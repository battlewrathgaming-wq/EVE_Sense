const { ZKillSystemContextClient } = require('./zKillSystemContextClient');

const DEFAULT_FRESHNESS_MS = 5 * 60 * 1000;

function createPassiveTelemetryService({
  zkillClient = new ZKillSystemContextClient(),
  resolveSystem = (systemName) => ({ systemName, systemId: null, resolved: false }),
  freshnessMs = DEFAULT_FRESHNESS_MS,
  now = () => Date.now(),
  trace = () => {}
} = {}) {
  const listeners = new Set();
  const state = {
    currentSystem: null,
    context: null,
    status: 'unavailable',
    message: 'Current system has not been observed',
    lastError: null
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
      state.status = cached.status;
      emit();
      return snapshot();
    }

    const resolved = resolveSystem(state.currentSystem.label);
    state.currentSystem.systemId = resolved?.systemId || null;
    state.currentSystem.resolved = resolved?.resolved === true;

    if (!state.currentSystem.systemId) {
      state.status = 'degraded';
      state.message = 'Current system observed; system ID unresolved for zKill context';
      state.context = null;
      emit();
      return snapshot();
    }

    try {
      state.context = await zkillClient.fetchSystemContext(state.currentSystem.systemId, {
        signal,
        fetchedAt: new Date(now()).toISOString()
      });
      state.status = state.context.partial ? 'partial' : 'fresh';
      state.message = state.context.capped
        ? 'zKill context sample capped'
        : 'zKill system context refreshed';
      state.lastError = null;
      trace('passive_context_refreshed', {
        systemName: state.currentSystem.label,
        systemId: state.currentSystem.systemId,
        sampleCount: state.context.sampleCount,
        capped: state.context.capped,
        partial: state.context.partial
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
    const status = state.status === 'fresh' && !cached.fresh ? 'stale' : state.status;
    return {
      kind: 'passive.telemetry.snapshot',
      observedAt: new Date(now()).toISOString(),
      currentSystem: state.currentSystem ? { ...state.currentSystem } : null,
      zkill: state.context ? {
        systemId: state.context.systemId,
        fetchedAt: state.context.fetchedAt,
        sampleCount: state.context.sampleCount,
        capped: state.context.capped,
        partial: state.context.partial,
        failureCount: state.context.failures.length
      } : null,
      freshness: {
        status,
        cacheAgeMs: cached.ageMs,
        freshnessMs
      },
      status,
      message: status === 'stale' ? 'Passive system context is stale' : state.message,
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

  return {
    observeEvent,
    refresh,
    snapshot,
    subscribeSnapshots
  };
}

module.exports = {
  DEFAULT_FRESHNESS_MS,
  createPassiveTelemetryService
};
