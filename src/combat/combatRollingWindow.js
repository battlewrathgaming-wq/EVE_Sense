const DEFAULT_WINDOW_MS = 15000;
const DEFAULT_MAX_EVENTS = 500;

class CombatRollingWindow {
  constructor({ windowMs = DEFAULT_WINDOW_MS, maxEvents = DEFAULT_MAX_EVENTS } = {}) {
    this.windowMs = windowMs;
    this.maxEvents = maxEvents;
    this.events = [];
    this.latestEventMs = null;
  }

  add(event) {
    if (!isWindowEvent(event)) {
      return null;
    }

    this.events.push(event);
    const eventMs = Date.parse(event.eventTime);
    this.latestEventMs = this.latestEventMs == null ? eventMs : Math.max(this.latestEventMs, eventMs);
    this.prune(this.latestEventMs);
    this.enforceMaxEvents();
    return event;
  }

  snapshot(nowMs = Date.now()) {
    this.prune(nowMs);

    const damage = {
      incoming: {
        total: 0,
        perSecond: 0,
        hitQualityCounts: {},
        damageTypeCounts: {},
        sourceCounts: {},
        uniqueSourceCount: 0,
        mostCommonDamageType: null,
        mostCommonHitQuality: null,
        topSource: null
      },
      outgoing: {
        total: 0,
        perSecond: 0,
        hitQualityCounts: {},
        damageTypeCounts: {},
        targetCounts: {},
        uniqueTargetCount: 0,
        mostCommonDamageType: null,
        mostCommonHitQuality: null,
        topTarget: null
      }
    };
    const repair = {
      incoming: { total: 0, perSecond: 0 },
      outgoing: { total: 0, perSecond: 0 }
    };

    for (const event of this.events) {
      const direction = event.direction === 'outgoing' ? 'outgoing' : 'incoming';
      if (event.kind === 'combat.damage') {
        damage[direction].total += event.amount || 0;
        if (event.hitQuality) {
          damage[direction].hitQualityCounts[event.hitQuality] =
            (damage[direction].hitQualityCounts[event.hitQuality] || 0) + 1;
        }
        if (event.damageType) {
          damage[direction].damageTypeCounts[event.damageType] =
            (damage[direction].damageTypeCounts[event.damageType] || 0) + 1;
        }
        if (direction === 'incoming' && event.sourceLabel) {
          damage.incoming.sourceCounts[event.sourceLabel] = (damage.incoming.sourceCounts[event.sourceLabel] || 0) + 1;
        }
        if (direction === 'outgoing' && event.targetLabel) {
          damage.outgoing.targetCounts[event.targetLabel] = (damage.outgoing.targetCounts[event.targetLabel] || 0) + 1;
        }
      }
      if (event.kind === 'combat.repair') {
        repair[direction].total += event.amount || 0;
      }
    }

    const seconds = this.windowMs / 1000;
    for (const direction of ['incoming', 'outgoing']) {
      damage[direction].perSecond = roundMetric(damage[direction].total / seconds);
      repair[direction].perSecond = roundMetric(repair[direction].total / seconds);
      damage[direction].mostCommonDamageType = mostCommon(damage[direction].damageTypeCounts);
      damage[direction].mostCommonHitQuality = mostCommon(damage[direction].hitQualityCounts);
    }

    damage.incoming.uniqueSourceCount = Object.keys(damage.incoming.sourceCounts).length;
    damage.incoming.topSource = mostCommon(damage.incoming.sourceCounts);
    damage.outgoing.uniqueTargetCount = Object.keys(damage.outgoing.targetCounts).length;
    damage.outgoing.topTarget = mostCommon(damage.outgoing.targetCounts);

    const balance = {
      takenDps: damage.incoming.perSecond,
      dealtDps: damage.outgoing.perSecond,
      repairReceivedHps: repair.incoming.perSecond,
      repairAppliedHps: repair.outgoing.perSecond,
      receivedRepairMinusDamagePerSecond: roundMetric(repair.incoming.perSecond - damage.incoming.perSecond)
    };

    return {
      windowMs: this.windowMs,
      eventCount: this.events.length,
      damage,
      repair,
      balance
    };
  }

  prune(nowMs = Date.now()) {
    const cutoff = nowMs - this.windowMs;
    this.events = this.events.filter((event) => {
      const eventMs = Date.parse(event.eventTime);
      return Number.isFinite(eventMs) && eventMs >= cutoff && eventMs <= nowMs;
    });
  }

  enforceMaxEvents() {
    if (!Number.isInteger(this.maxEvents) || this.maxEvents < 1 || this.events.length <= this.maxEvents) {
      return;
    }
    this.events = this.events.slice(this.events.length - this.maxEvents);
  }

  clear() {
    this.events = [];
    this.latestEventMs = null;
  }
}

function isWindowEvent(event) {
  return (
    event &&
    (event.kind === 'combat.damage' || event.kind === 'combat.repair') &&
    (event.direction === 'incoming' || event.direction === 'outgoing') &&
    Number.isFinite(Date.parse(event.eventTime))
  );
}

function roundMetric(value) {
  return Math.round(value * 100) / 100;
}

function mostCommon(counts) {
  let winner = null;
  for (const [label, count] of Object.entries(counts)) {
    if (!winner || count > winner.count || (count === winner.count && label < winner.label)) {
      winner = { label, count };
    }
  }
  return winner;
}

module.exports = {
  CombatRollingWindow,
  DEFAULT_MAX_EVENTS,
  DEFAULT_WINDOW_MS
};
