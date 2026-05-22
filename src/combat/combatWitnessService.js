const { CombatRollingWindow } = require('./combatRollingWindow');
const { defaultDiagnosticsPolicy } = require('../services/diagnosticsPolicy');

const DEFAULT_WINDOW_MS = [5000, 15000, 30000];
const DEFAULT_EVENT_STREAM_LIMIT = 30;

class CombatWitnessService {
  constructor({
    windowMs = DEFAULT_WINDOW_MS,
    maxEventsPerWindow = 500,
    eventStreamLimit = DEFAULT_EVENT_STREAM_LIMIT,
    now = () => Date.now(),
    onSnapshot = () => {},
    trace = () => {},
    diagnosticsPolicy = defaultDiagnosticsPolicy
  } = {}) {
    this.windowMs = [...windowMs].sort((left, right) => left - right);
    this.eventStreamLimit = eventStreamLimit;
    this.now = now;
    this.onSnapshot = onSnapshot;
    this.trace = diagnosticsPolicy.wrapTrace(trace, 'combat.witness_service');
    this.eventListeners = new Set();
    this.snapshotListeners = new Set();
    this.eventStream = [];
    this.windows = new Map(this.windowMs.map((durationMs) => [
      durationMs,
      new CombatRollingWindow({ windowMs: durationMs, maxEvents: maxEventsPerWindow })
    ]));
  }

  addEvent(event, nowMs = null) {
    if (!event || typeof event !== 'object' || !isCombatWitnessEvent(event)) {
      return this.snapshot(nowMs ?? this.now());
    }

    this.addEventStreamItem(event);
    this.emitEvent(event);

    for (const window of this.windows.values()) {
      window.add(event);
    }

    const referenceNowMs = nowMs ?? Math.max(this.eventNow(event), this.latestWindowEventMs());
    const snapshot = this.snapshot(referenceNowMs);
    this.emitSnapshot(snapshot);
    return snapshot;
  }

  snapshot(nowMs = this.now()) {
    const freshness = computeFreshness(this.eventStream[0], nowMs, this.eventStream.length);
    return {
      kind: 'combat.witness.snapshot',
      observedAt: new Date(nowMs).toISOString(),
      windows: Object.fromEntries(
        Array.from(this.windows.entries()).map(([durationMs, window]) => [
          `${durationMs / 1000}s`,
          compactWindowSnapshot(window.snapshot(nowMs))
        ])
      ),
      eventStream: [...this.eventStream],
      freshness
    };
  }

  subscribeEvents(listener) {
    return subscribe(this.eventListeners, listener);
  }

  subscribeSnapshots(listener) {
    return subscribe(this.snapshotListeners, listener);
  }

  clear() {
    for (const window of this.windows.values()) {
      window.clear();
    }
    this.eventStream = [];
  }

  addEventStreamItem(event) {
    if (!isStreamEvent(event)) {
      return;
    }
    this.eventStream.unshift(compactEvent(event));
    if (this.eventStream.length > this.eventStreamLimit) {
      this.eventStream = this.eventStream.slice(0, this.eventStreamLimit);
    }
  }

  emitEvent(event) {
    emitToListeners(this.eventListeners, event, this.trace, 'combat_event_listener_error');
  }

  emitSnapshot(snapshot) {
    try {
      this.onSnapshot(snapshot);
    } catch (error) {
      this.trace('combat_snapshot_sink_error', { message: error.message });
    }
    emitToListeners(this.snapshotListeners, snapshot, this.trace, 'combat_snapshot_listener_error');
  }

  eventNow(event) {
    const eventMs = Date.parse(event?.eventTime);
    return Number.isFinite(eventMs) ? eventMs : this.now();
  }

  latestWindowEventMs() {
    const latest = Array.from(this.windows.values())
      .map((window) => window.latestEventMs)
      .filter((value) => Number.isFinite(value));
    return latest.length ? Math.max(...latest) : this.now();
  }
}

function compactWindowSnapshot(snapshot) {
  return {
    windowMs: snapshot.windowMs,
    eventCount: snapshot.eventCount,
    damage: {
      incoming: compactDamageSide(snapshot.damage.incoming),
      outgoing: compactDamageSide(snapshot.damage.outgoing)
    },
    repair: {
      incoming: compactRepairSide(snapshot.repair.incoming),
      outgoing: compactRepairSide(snapshot.repair.outgoing)
    },
    balance: snapshot.balance
  };
}

function compactDamageSide(side) {
  return {
    total: side.total,
    perSecond: side.perSecond,
    hitQualityCounts: side.hitQualityCounts || {},
    damageTypeCounts: side.damageTypeCounts || {},
    sourceCounts: side.sourceCounts || {},
    targetCounts: side.targetCounts || {},
    uniqueSourceCount: side.uniqueSourceCount,
    uniqueTargetCount: side.uniqueTargetCount,
    topSource: side.topSource,
    topTarget: side.topTarget,
    mostCommonDamageType: side.mostCommonDamageType,
    mostCommonHitQuality: side.mostCommonHitQuality
  };
}

function compactRepairSide(side) {
  return {
    total: side.total,
    perSecond: side.perSecond,
    eventCount: side.eventCount,
    sourceCounts: side.sourceCounts || {},
    targetCounts: side.targetCounts || {},
    uniqueSourceCount: side.uniqueSourceCount,
    uniqueTargetCount: side.uniqueTargetCount,
    topSource: side.topSource,
    topTarget: side.topTarget
  };
}

function compactEvent(event) {
  return {
    id: event.id,
    kind: event.kind,
    eventTime: event.eventTime,
    observedAt: event.observedAt || null,
    direction: event.direction || null,
    sourceLabel: event.sourceLabel || null,
    targetLabel: event.targetLabel || null,
    amount: event.amount ?? null,
    hitQuality: event.hitQuality || null,
    weaponLabel: event.weaponLabel || null
  };
}

function computeFreshness(latestEvent, nowMs, eventStreamCount = 0) {
  const latestEventTime = latestEvent?.eventTime || null;
  const latestObservedAt = latestEvent?.observedAt || null;
  const referenceTime = latestObservedAt || latestEventTime;
  const referenceMs = Date.parse(referenceTime);
  const ageMs = Number.isFinite(referenceMs) ? Math.max(0, nowMs - referenceMs) : null;
  let status = 'empty';

  if (ageMs != null) {
    status = ageMs <= 15000 ? 'recent' : 'stale';
  }

  return {
    status,
    latestEventTime,
    latestObservedAt,
    latestEventAgeMs: ageMs,
    eventStreamCount
  };
}

function isStreamEvent(event) {
  return event.kind === 'combat.damage' || event.kind === 'combat.miss' || event.kind === 'combat.repair';
}

function isCombatWitnessEvent(event) {
  return isStreamEvent(event);
}

function subscribe(listeners, listener) {
  if (typeof listener !== 'function') {
    throw new Error('Combat Witness listener must be a function');
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitToListeners(listeners, payload, trace, traceEvent) {
  for (const listener of listeners) {
    try {
      listener(payload);
    } catch (error) {
      trace(traceEvent, { message: error.message });
    }
  }
}

module.exports = {
  CombatWitnessService,
  computeFreshness,
  DEFAULT_EVENT_STREAM_LIMIT,
  DEFAULT_WINDOW_MS
};
