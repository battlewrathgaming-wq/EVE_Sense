const { EveGamelogWatcher } = require('./eveGamelogWatcher');
const { CombatWitnessService } = require('./combatWitnessService');
const { validateLogPathForWatcher } = require('../services/ipcPayloadValidation');

function createCombatWitnessRuntime({
  service = new CombatWitnessService(),
  watcher = null,
  observers = [],
  now = () => new Date().toISOString(),
  trace = () => {}
} = {}) {
  if (!service?.addEvent || !service?.snapshot) {
    throw new Error('Combat Witness runtime requires a CombatWitnessService');
  }

  const runtime = {
    configuredPath: null,
    observers: new Set(observers.filter((observer) => typeof observer === 'function')),
    watcherStatus: {
      state: 'unavailable',
      path: null,
      message: 'EVE gamelog folder is not configured',
      strategy: null,
      updatedAt: now()
    }
  };

  const activeWatcher = watcher || new EveGamelogWatcher({
    watcherStrategy: 'auto',
    onEvent: (event) => {
      observeEvent(event);
    },
    onStatus: (status) => {
      runtime.watcherStatus = normalizeWatcherStatus(status, now());
    },
    trace
  });

  function configure(payload = {}) {
    const validation = validateLogPathForWatcher(payload.gamelogFolder);
    if (!validation.ok) {
      runtime.configuredPath = null;
      runtime.watcherStatus = {
        state: 'unavailable',
        path: null,
        message: validation.message,
        strategy: null,
        updatedAt: now()
      };
      return status();
    }

    runtime.configuredPath = validation.value;
    runtime.watcherStatus = {
      state: 'unavailable',
      path: runtime.configuredPath,
      message: 'EVE gamelog folder configured; watcher is stopped',
      strategy: null,
      updatedAt: now()
    };
    return status();
  }

  function start(payload = {}) {
    if (payload.gamelogFolder !== undefined) {
      const configured = configure(payload);
      if (!configured.configuredPath) {
        return configured;
      }
    }

    if (!runtime.configuredPath) {
      runtime.watcherStatus = {
        state: 'unavailable',
        path: null,
        message: 'EVE gamelog folder is not configured',
        strategy: null,
        updatedAt: now()
      };
      return status();
    }

    runtime.watcherStatus = normalizeWatcherStatus(activeWatcher.start(runtime.configuredPath), now());
    return status();
  }

  function stop() {
    activeWatcher.stop();
    runtime.watcherStatus = {
      state: 'unavailable',
      path: runtime.configuredPath,
      message: runtime.configuredPath ? 'Combat Witness watcher stopped' : 'EVE gamelog folder is not configured',
      strategy: null,
      updatedAt: now()
    };
    return status();
  }

  function status() {
    const watcherState = runtime.watcherStatus || {};
    return {
      ok: watcherState.state === 'watching',
      configuredPath: runtime.configuredPath,
      watcher: {
        state: watcherState.state || 'unavailable',
        path: watcherState.path || runtime.configuredPath || null,
        message: watcherState.message || 'Combat Witness watcher unavailable',
        strategy: watcherState.strategy || null,
        updatedAt: watcherState.updatedAt || now()
      }
    };
  }

  function snapshot() {
    return decorateSnapshot(service.snapshot(), status());
  }

  function observeEvent(event) {
    const snapshot = service.addEvent(event);
    notifyObservers(event);
    return snapshot;
  }

  function subscribeEvents(observer) {
    if (typeof observer !== 'function') {
      throw new Error('Combat Witness runtime observer must be a function');
    }
    runtime.observers.add(observer);
    return () => runtime.observers.delete(observer);
  }

  function notifyObservers(event) {
    for (const observer of runtime.observers) {
      try {
        observer(event);
      } catch (error) {
        trace('combat_runtime_observer_error', {
          eventId: event?.id || null,
          kind: event?.kind || null,
          message: error.message
        });
      }
    }
  }

  return {
    configure,
    service,
    snapshot,
    start,
    status,
    stop,
    observeEvent,
    subscribeEvents,
    watcher: activeWatcher
  };
}

function normalizeWatcherStatus(status = {}, updatedAt) {
  const state = status.state === 'watching'
    ? 'watching'
    : (status.state === 'error' || status.state === 'invalid' ? 'degraded' : 'unavailable');
  return {
    state,
    path: status.path || null,
    message: status.message || 'Combat Witness watcher unavailable',
    strategy: status.strategy || null,
    updatedAt
  };
}

function decorateSnapshot(snapshot, runtimeStatus) {
  return {
    ...snapshot,
    operational: {
      watcher: runtimeStatus.watcher
    }
  };
}

module.exports = {
  createCombatWitnessRuntime,
  decorateSnapshot,
  normalizeWatcherStatus
};
