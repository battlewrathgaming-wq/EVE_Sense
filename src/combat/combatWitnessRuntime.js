const { EveGamelogWatcher } = require('./eveGamelogWatcher');
const { CombatWitnessService } = require('./combatWitnessService');
const { validateLogPathForWatcher } = require('../services/ipcPayloadValidation');

function createCombatWitnessRuntime({
  service = new CombatWitnessService(),
  watcher = null,
  observers = [],
  ingestEnabled = true,
  now = () => new Date().toISOString(),
  trace = () => {}
} = {}) {
  if (!service?.addEvent || !service?.snapshot) {
    throw new Error('Combat Witness runtime requires a CombatWitnessService');
  }

  const runtime = {
    configuredPath: null,
    ingestAuthority: {
      enabled: ingestEnabled === true,
      message: ingestEnabled === true ? 'I/O authority is on' : 'I/O authority is off; gamelog ingest is blocked'
    },
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
    isIngestAllowed: () => ingestIoStatus().enabled,
    onEvent: (event) => {
      observeEvent(event);
    },
    onStatus: (status) => {
      runtime.watcherStatus = normalizeWatcherStatus(status, now());
      emitOperationalSnapshot();
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
      emitOperationalSnapshot();
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
    emitOperationalSnapshot();
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
      emitOperationalSnapshot();
      return status();
    }

    if (!ingestIoStatus().enabled) {
      if (typeof activeWatcher.stop === 'function') {
        activeWatcher.stop();
      }
      runtime.watcherStatus = blockedWatcherStatus(runtime.configuredPath, now());
      trace('combat_witness_ingest_blocked', {
        reason: 'io-disabled',
        stage: 'start'
      });
      emitOperationalSnapshot();
      return status();
    }

    runtime.watcherStatus = normalizeWatcherStatus(activeWatcher.start(runtime.configuredPath), now());
    emitOperationalSnapshot();
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
    emitOperationalSnapshot();
    return status();
  }

  function setIngestEnabled(enabled, reason = null) {
    runtime.ingestAuthority = {
      enabled: enabled === true,
      message: reason || (enabled === true ? 'I/O authority is on' : 'I/O authority is off; gamelog ingest is blocked')
    };
    if (!runtime.ingestAuthority.enabled) {
      if (typeof activeWatcher.stop === 'function') {
        activeWatcher.stop();
      }
      runtime.watcherStatus = blockedWatcherStatus(runtime.configuredPath, now());
      trace('combat_witness_ingest_blocked', {
        reason: 'io-disabled',
        stage: 'authority-change'
      });
      emitOperationalSnapshot();
    }
    return status();
  }

  function ingestIoStatus() {
    return { ...runtime.ingestAuthority };
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

  function emitOperationalSnapshot() {
    if (typeof service.emitSnapshot === 'function') {
      service.emitSnapshot(snapshot());
    }
  }

  function observeEvent(event) {
    if (!ingestIoStatus().enabled) {
      trace('combat_witness_event_ignored_io_disabled', {
        eventId: event?.id || null,
        kind: event?.kind || null
      });
      return service.snapshot();
    }
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
    setIngestEnabled,
    ingestIoStatus,
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
    : (status.state === 'blocked'
        ? 'blocked'
        : (status.state === 'error' || status.state === 'invalid' ? 'degraded' : 'unavailable'));
  return {
    state,
    path: status.path || null,
    message: status.message || 'Combat Witness watcher unavailable',
    strategy: status.strategy || null,
    updatedAt
  };
}

function blockedWatcherStatus(configuredPath, updatedAt) {
  return {
    state: 'blocked',
    path: configuredPath || null,
    message: 'I/O authority is off; gamelog ingest is blocked',
    strategy: null,
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
