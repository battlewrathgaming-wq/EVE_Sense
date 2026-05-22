const { ZKillSystemContextClient } = require('./zKillSystemContextClient');
const { PassiveEsiSystemActivityClient } = require('./esiSystemActivityClient');
const { createLiveIoGate } = require('./liveIoGate');

const DEFAULT_FRESHNESS_MS = 5 * 60 * 1000;

function createPassiveTelemetryService({
  zkillClient = new ZKillSystemContextClient(),
  esiActivityClient = new PassiveEsiSystemActivityClient(),
  liveIoGate = createLiveIoGate(),
  resolveSystem = (systemName) => ({ systemName, systemId: null, resolved: false }),
  freshnessMs = DEFAULT_FRESHNESS_MS,
  now = () => Date.now(),
  trace = () => {}
} = {}) {
  const listeners = new Set();
  const state = {
    currentSystem: null,
    context: null,
    activity: null,
    status: 'unavailable',
    message: 'Current system has not been observed',
    lastError: null,
    gate: liveIoGate.status()
  };

  async function observeEvent(event) {
    if (event?.kind !== 'navigation.jump' || !event.systemName) {
      return snapshot();
    }

    const observedAt = event.observedAt || new Date(now()).toISOString();
    state.currentSystem = {
      label: event.systemName,
      fromSystemName: event.fromSystemName || null,
      eventTime: event.eventTime,
      observedAt
    };
    state.status = 'stale';
    state.message = 'Current system observed; context fetch pending';
    emit();

    await refresh({ reason: 'system-change' });
    return snapshot();
  }

  async function refresh({ signal = null, reason = 'manual' } = {}) {
    if (!state.currentSystem) {
      state.status = 'unavailable';
      state.message = 'Current system has not been observed';
      emit();
      return snapshot();
    }

    const cached = cachedFreshness();
    if (cached.fresh && reason !== 'system-change') {
      await refreshActivityFromCacheIfAllowed(signal);
      state.status = cached.status;
      emit();
      return snapshot();
    }

    const resolved = resolveSystem(state.currentSystem.label);
    state.currentSystem.systemId = resolved?.systemId || null;
    state.currentSystem.resolved = resolved?.resolved === true;
    state.currentSystem.resolverSource = resolved?.source || null;

    if (!state.currentSystem.systemId) {
      state.status = 'degraded';
      state.message = 'Current system observed; system ID unresolved for zKill context';
      state.context = null;
      state.activity = null;
      state.lastError = { code: resolved?.reason || 'PASSIVE_SYSTEM_UNRESOLVED', message: state.message };
      trace('passive_system_unresolved', { systemName: state.currentSystem.label });
      emit();
      return snapshot();
    }

    const gate = liveIoGate.check({ providers: ['esi', 'zkill'] });
    state.gate = liveIoGate.status();
    if (!gate.ok) {
      state.status = 'blocked';
      state.message = gate.message;
      state.lastError = { code: gate.code, message: gate.message };
      trace('passive_live_io_blocked', {
        systemName: state.currentSystem.label,
        systemId: state.currentSystem.systemId,
        providers: gate.providers
      });
      emit();
      return snapshot();
    }

    try {
      const fetchedAt = new Date(now()).toISOString();
      const [activity, context] = await Promise.all([
        esiActivityClient.fetchSystemActivity(state.currentSystem.systemId, { signal, fetchedAt }),
        zkillClient.fetchSystemContext(state.currentSystem.systemId, { signal, fetchedAt })
      ]);
      state.activity = activity;
      state.context = context;
      state.status = context.partial || activity.partial ? 'partial' : 'fresh';
      state.message = context.capped
        ? 'zKill context sample capped'
        : 'Passive system context refreshed';
      state.lastError = null;
      trace('passive_context_refreshed', {
        systemName: state.currentSystem.label,
        systemId: state.currentSystem.systemId,
        sampleCount: state.context.sampleCount,
        capped: state.context.capped,
        partial: state.context.partial || state.activity.partial,
        activityCacheState: state.activity.cache?.state || null
      });
    } catch (error) {
      state.status = 'degraded';
      state.message = error.message;
      state.lastError = { code: error.code || 'PASSIVE_CONTEXT_FETCH_FAILED', message: error.message };
      trace('passive_context_fetch_failed', state.lastError);
    }

    emit();
    return snapshot();
  }

  function snapshot() {
    const cached = cachedFreshness();
    const status = isContextExpired(state.status, cached) ? 'stale' : state.status;
    return {
      kind: 'passive.telemetry.snapshot',
      observedAt: new Date(now()).toISOString(),
      currentSystem: state.currentSystem ? { ...state.currentSystem } : null,
      zkill: state.context ? {
        systemId: state.context.systemId,
        fetchedAt: state.context.fetchedAt,
        pastSeconds: state.context.pastSeconds,
        sampleCount: state.context.sampleCount,
        capped: state.context.capped,
        partial: state.context.partial,
        failureCount: state.context.failures.length
      } : null,
      activity: state.activity ? {
        systemId: state.activity.systemId,
        fetchedAt: state.activity.fetchedAt,
        shipKills: state.activity.shipKills,
        podKills: state.activity.podKills,
        npcKills: state.activity.npcKills,
        jumps: state.activity.jumps,
        partial: state.activity.partial,
        failureCount: state.activity.failures.length,
        cache: state.activity.cache
      } : null,
      gate: state.gate,
      freshness: {
        status,
        cacheAgeMs: cached.ageMs,
        freshnessMs
      },
      status,
      message: status === 'stale' ? staleMessage() : state.message,
      failure: state.lastError
    };
  }

  function subscribeSnapshots(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Passive Telemetry listener must be a function');
    }
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function emit() {
    const next = snapshot();
    for (const listener of listeners) {
      try {
        listener(next);
      } catch (error) {
        trace('passive_snapshot_listener_error', { message: error.message });
      }
    }
  }

  function cachedFreshness() {
    const fetchedMs = Date.parse(state.context?.fetchedAt);
    if (!Number.isFinite(fetchedMs)) {
      return {
        ageMs: null,
        fresh: false,
        status: 'unavailable'
      };
    }
    const ageMs = Number.isFinite(fetchedMs) ? Math.max(0, now() - fetchedMs) : null;
    return {
      ageMs,
      fresh: ageMs != null && ageMs <= freshnessMs,
      status: ageMs != null && ageMs <= freshnessMs ? 'fresh' : 'stale'
    };
  }

  async function refreshActivityFromCacheIfAllowed(signal = null) {
    if (!state.currentSystem?.systemId || !state.activity) {
      return null;
    }
    const gate = liveIoGate.check({ providers: ['esi'] });
    state.gate = liveIoGate.status();
    if (!gate.ok) {
      return null;
    }
    try {
      state.activity = await esiActivityClient.fetchSystemActivity(state.currentSystem.systemId, {
        signal,
        fetchedAt: new Date(now()).toISOString()
      });
      trace('passive_esi_activity_checked', {
        systemId: state.currentSystem.systemId,
        cacheState: state.activity.cache?.state || null,
        cacheAgeMs: state.activity.cache?.cacheAgeMs ?? null,
        etag: state.activity.cache?.etag || null
      });
      return state.activity;
    } catch (error) {
      trace('passive_esi_activity_check_failed', {
        code: error.code || 'PASSIVE_ESI_ACTIVITY_CHECK_FAILED',
        message: error.message
      });
      return null;
    }
  }

  function isContextExpired(status, cached) {
    return (status === 'fresh' || status === 'partial') && !cached.fresh;
  }

  function staleMessage() {
    if (state.context?.partial) {
      return 'Partial passive system context is stale';
    }
    return 'Passive system context is stale';
  }

  function setLiveIoEnabled(enabled, reason = null) {
    state.gate = liveIoGate.setEnabled(enabled === true, reason);
    emit();
    return state.gate;
  }

  function liveIoStatus() {
    state.gate = liveIoGate.status();
    return state.gate;
  }

  return {
    observeEvent,
    refresh,
    liveIoStatus,
    setLiveIoEnabled,
    snapshot,
    subscribeSnapshots
  };
}

module.exports = {
  DEFAULT_FRESHNESS_MS,
  createPassiveTelemetryService
};
