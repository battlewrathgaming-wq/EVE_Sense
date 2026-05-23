const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, clipboard, dialog, globalShortcut, ipcMain } = require('electron');
const { APP_NAME } = require('../constants');
const { createCombatWitnessBridge } = require('../combat/combatWitnessBridge');
const { createCombatWitnessRuntime, decorateSnapshot } = require('../combat/combatWitnessRuntime');
const { createPassiveTelemetryBridge } = require('../passive/passiveTelemetryBridge');
const { PassiveEsiSystemActivityClient } = require('../passive/esiSystemActivityClient');
const { createLiveIoGate } = require('../passive/liveIoGate');
const { createLocalSystemResolver } = require('../passive/localSystemResolver');
const { createPassiveTelemetryService } = require('../passive/passiveTelemetryService');
const { ZKillSystemContextClient } = require('../passive/zKillSystemContextClient');
const { HttpClient } = require('../services/httpClient');
const { createDefaultRegistry, registerElectronServiceHandlers } = require('../services/serviceRegistry');
const { TASK_CLASSIFICATIONS } = require('../services/taskRunner');
const { createClipboardAcquisitionService } = require('../threat/clipboardAcquisitionService');
const { createThreatIntelService } = require('../threat/threatIntelService');
const { createThreatIntelTargetResolver } = require('../threat/threatIntelTargetResolver');
const { ThreatIntelZkillClient } = require('../threat/threatIntelZkillClient');
const { registerRuntimeErrorHandlers } = require('./runtimeErrorHandling');
const { createFrameWindow, registerFrameWindowHandlers } = require('../modules/Frame');
const { createRuntimeDiagnosticsService } = require('../runtime/runtimeDiagnosticsService');
const { createRuntimeSettingsService } = require('../runtime/runtimeSettingsService');

const CLIPBOARD_SNAPSHOT_CHANNEL = 'aura:threat-clipboard:snapshot';
const TARGET_KIND_TOGGLE_CHANNEL = 'aura:threat-target-kind:toggle';
const WINDOW_PRESENTATION_PAUSE_CHANNEL = 'aura:window:presentation-pause';

configureUserDataPath();

const registry = createDefaultRegistry();
const runtimeDiagnosticsService = createRuntimeDiagnosticsService();
const passiveRequestLog = (entry) => traceRuntimeDiagnostic(entry.diagnostic_event || 'passive_request_log', entry);
const passiveLiveIoGate = createLiveIoGate();
const threatRequestLog = (entry) => traceRuntimeDiagnostic(entry.diagnostic_event || 'threat_request_log', entry);
const threatLiveIoGate = createLiveIoGate({
  reason: 'Threat Intel live IO is disabled',
  enabledMessage: 'Threat Intel live IO is enabled',
  disabledMessage: 'Threat Intel live IO is disabled',
  blockedCode: 'THREAT_LIVE_IO_BLOCKED'
});
const passiveTelemetryService = createPassiveTelemetryService({
  esiActivityClient: new PassiveEsiSystemActivityClient({
    httpClient: new HttpClient({ timeoutMs: 10000, maxAttempts: 2, onRequestLog: passiveRequestLog }),
    trace: traceRuntimeDiagnostic
  }),
  liveIoGate: passiveLiveIoGate,
  resolveSystem: createLocalSystemResolver(),
  trace: traceRuntimeDiagnostic,
  zkillClient: new ZKillSystemContextClient({
    httpClient: new HttpClient({ timeoutMs: 10000, maxAttempts: 2, onRequestLog: passiveRequestLog })
  })
});
const threatIntelService = createThreatIntelService({
  liveIoGate: threatLiveIoGate,
  resolveTarget: createThreatIntelTargetResolver(),
  trace: traceRuntimeDiagnostic,
  zkillClient: new ThreatIntelZkillClient({
    httpClient: new HttpClient({ timeoutMs: 10000, maxAttempts: 2, onRequestLog: threatRequestLog })
  })
});
const clipboardAcquisitionService = createClipboardAcquisitionService({
  scan: (request) => threatIntelService.scan(request),
  readClipboard: () => clipboard.readText(),
  trace: traceRuntimeDiagnostic
});
const combatWitnessRuntime = createCombatWitnessRuntime({
  observers: [(event) => {
    passiveTelemetryService.observeEvent(event).catch((error) => {
      traceRuntimeDiagnostic('passive_observer_error', { message: error.message });
    });
  }],
  trace: traceRuntimeDiagnostic
});
const combatWitnessBridge = createCombatWitnessBridge({
  service: combatWitnessRuntime.service,
  snapshotProvider: combatWitnessRuntime.snapshot,
  snapshotDecorator: (snapshot) => decorateSnapshot(snapshot, combatWitnessRuntime.status())
});
const passiveTelemetryBridge = createPassiveTelemetryBridge({
  service: passiveTelemetryService
});
const runtimeSettingsService = createRuntimeSettingsService({
  settingsPath: path.join(app.getPath('userData'), 'runtime-settings.json')
});
let mainWindow = null;
let clipboardCapturePoll = null;
let windowPresentationResumeTimer = null;
let clipboardShortcutStatus = {
  accelerator: 'Control+\\',
  fallbackAccelerator: null,
  registered: false,
  fallbackRegistered: false,
  supported: false,
  message: 'Clipboard shortcut has not been registered yet'
};

function configureUserDataPath() {
  const userDataDir = process.env.AURA_SENSE_USER_DATA_DIR;
  if (!userDataDir) {
    return;
  }
  fs.mkdirSync(userDataDir, { recursive: true });
  app.setPath('userData', userDataDir);
}

registerCombatWitnessRuntimeCommands(registry, combatWitnessRuntime, runtimeSettingsService);
registerPassiveTelemetryCommands(registry, passiveTelemetryService);
registerThreatIntelCommands(registry, threatIntelService, clipboardAcquisitionService);
registerRuntimeControlCommands(registry, runtimeSettingsService, runtimeDiagnosticsService);

function createWindow() {
  const window = createFrameWindow(app, {
    width: 520,
    height: 420,
    minWidth: 320,
    minHeight: 240,
    title: APP_NAME,
    preload: path.join(__dirname, 'preload.js'),
    backgroundColor: '#f5f7f8',
    defaultAlwaysOnTop: false
  });

  mainWindow = window;
  registerWindowPresentationPause(window);
  const rendererLoad = window.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  runVisualSmokeIfRequested(window, rendererLoad);
}

app.whenReady().then(() => {
  registerRuntimeErrorHandlers({
    app,
    getWindows: () => BrowserWindow.getAllWindows()
  });
  registerElectronServiceHandlers(ipcMain, registry, () => ({ appName: APP_NAME }));
  registerFrameWindowHandlers(ipcMain, app, () => mainWindow);
  recoverRuntimeSettings();
  combatWitnessBridge.register(ipcMain);
  passiveTelemetryBridge.register(ipcMain);
  createWindow();
  registerClipboardGlobalShortcut();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (clipboardCapturePoll) {
    clearInterval(clipboardCapturePoll);
    clipboardCapturePoll = null;
  }
  if (windowPresentationResumeTimer) {
    clearTimeout(windowPresentationResumeTimer);
    windowPresentationResumeTimer = null;
  }
  globalShortcut.unregisterAll();
});

function registerWindowPresentationPause(window) {
  const schedulePause = (reason) => {
    if (!window || window.isDestroyed()) return;
    window.webContents.send(WINDOW_PRESENTATION_PAUSE_CHANNEL, {
      paused: true,
      reason,
      at: new Date().toISOString()
    });
    if (windowPresentationResumeTimer) {
      clearTimeout(windowPresentationResumeTimer);
    }
    windowPresentationResumeTimer = setTimeout(() => {
      if (!window || window.isDestroyed()) return;
      window.webContents.send(WINDOW_PRESENTATION_PAUSE_CHANNEL, {
        paused: false,
        reason,
        at: new Date().toISOString()
      });
    }, 180);
  };

  window.on('move', () => schedulePause('move'));
  window.on('resize', () => schedulePause('resize'));
}

function registerCombatWitnessRuntimeCommands(serviceRegistry, runtime, settingsService) {
  serviceRegistry
    .register('combat.witness.status', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return Combat Witness watcher runtime status',
      handler: () => runtime.status()
    })
    .register('combat.witness.configure', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Validate and configure the local EVE gamelog folder for Combat Witness',
      handler: (payload = {}) => {
        const status = runtime.configure(payload);
        if (status.configuredPath && settingsService) {
          settingsService.save({ gamelogFolder: status.configuredPath });
        } else {
          traceRuntimeDiagnostic('runtime_settings_configure_rejected', {
            message: status.watcher?.message || 'Combat Witness path rejected'
          });
        }
        return status;
      }
    })
    .register('combat.witness.start', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Start Combat Witness watcher from the configured local EVE gamelog folder',
      handler: (payload = {}) => {
        const status = runtime.start(payload);
        if (status.configuredPath && settingsService) {
          settingsService.save({ gamelogFolder: status.configuredPath });
        } else if (!status.ok) {
          traceRuntimeDiagnostic('combat_witness_start_rejected', {
            message: status.watcher?.message || 'Combat Witness watcher did not start'
          });
        }
        return status;
      }
    })
    .register('combat.witness.stop', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Stop Combat Witness watcher',
      handler: () => runtime.stop()
    })
    .register('runtime.gamelog-folder.pick', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Open a native folder picker and configure the selected EVE gamelog folder',
      handler: async () => {
        const result = await dialog.showOpenDialog(mainWindow, {
          title: 'Select EVE Gamelogs Folder',
          properties: ['openDirectory']
        });
        if (result.canceled || !result.filePaths?.[0]) {
          return {
            canceled: true,
            message: 'Folder selection cancelled'
          };
        }
        const gamelogFolder = result.filePaths[0];
        const status = runtime.configure({ gamelogFolder });
        if (status.configuredPath && settingsService) {
          settingsService.save({ gamelogFolder: status.configuredPath });
        }
        return {
          canceled: false,
          gamelogFolder,
          status
        };
      }
    });
}

function registerRuntimeControlCommands(serviceRegistry, settingsService, diagnosticsService) {
  serviceRegistry
    .register('runtime.settings.snapshot', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return persisted runtime settings status',
      handler: () => settingsService.current()
    })
    .register('runtime.settings.save', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Persist validated runtime settings',
      handler: (payload = {}) => settingsService.save(payload)
    })
    .register('runtime.live-io.snapshot', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return live IO policy state for provider lanes',
      handler: () => liveIoPolicySnapshot()
    })
    .register('runtime.live-io.set-enabled', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Enable or disable backend live IO gates for provider lanes',
      handler: (payload = {}) => setLiveIoPolicy(payload)
    })
    .register('runtime.diagnostics.snapshot', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return high-value runtime diagnostics',
      handler: () => diagnosticsService.snapshot()
    });
}

function registerPassiveTelemetryCommands(serviceRegistry, service) {
  serviceRegistry
    .register('passive.telemetry.snapshot', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return Passive Telemetry current-system context snapshot',
      handler: () => service.snapshot()
    })
    .register('passive.telemetry.refresh', {
      classification: TASK_CLASSIFICATIONS.EXTERNAL_IO,
      description: 'Refresh Passive Telemetry current-system context through backend clients',
      handler: (_payload = {}, context = {}) => service.refresh({ signal: context.signal })
    })
    .register('passive.telemetry.live-io.status', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return Passive Telemetry live IO gate status',
      handler: () => service.liveIoStatus()
    })
    .register('passive.telemetry.live-io.set-enabled', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Enable or disable Passive Telemetry live IO gate',
      handler: (payload = {}) => service.setLiveIoEnabled(payload.enabled === true, payload.reason || null)
    });
}

function registerThreatIntelCommands(serviceRegistry, service, acquisition) {
  serviceRegistry
    .register('threat.intel.snapshot', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return latest Threat Intel scan snapshot',
      handler: () => service.snapshot()
    })
    .register('threat.intel.scan', {
      classification: TASK_CLASSIFICATIONS.EXTERNAL_IO,
      description: 'Run a deliberate scoped Threat Intel scan',
      handler: (payload = {}, context = {}) => service.scan(payload, { signal: context.signal })
    })
    .register('threat.intel.live-io.status', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return Threat Intel live IO gate status',
      handler: () => service.liveIoStatus()
    })
    .register('threat.intel.live-io.set-enabled', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Enable or disable Threat Intel live IO gate',
      handler: (payload = {}) => service.setLiveIoEnabled(payload.enabled === true, payload.reason || null)
    })
    .register('threat.clipboard.snapshot', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return Clipboard Acquisition lifecycle state',
      handler: () => acquisition.tick()
    })
    .register('threat.clipboard.arm', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Arm Clipboard Acquisition for one target capture',
      handler: (payload = {}) => acquisition.arm(payload)
    })
    .register('threat.clipboard.capture', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Capture current clipboard text through Clipboard Acquisition',
      handler: (payload = {}) => acquisition.capture(payload)
    })
    .register('threat.clipboard.cancel', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Cancel Clipboard Acquisition and enter cooldown',
      handler: () => acquisition.cancel()
    })
    .register('threat.clipboard.shortcut-status', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return Clipboard Acquisition global shortcut registration status',
      handler: () => clipboardShortcutStatus
    });
}

function recoverRuntimeSettings() {
  const settings = runtimeSettingsService.load();
  if (settings.settings.gamelogFolder && settings.status !== 'degraded') {
    const status = combatWitnessRuntime.configure({ gamelogFolder: settings.settings.gamelogFolder });
    traceRuntimeDiagnostic('runtime_settings_recovered', {
      status: settings.status,
      gamelogConfigured: Boolean(status.configuredPath),
      watcherState: status.watcher.state
    });
    return;
  }
  if (settings.status === 'degraded') {
    traceRuntimeDiagnostic('runtime_settings_degraded', settings.failure || { message: settings.message });
  }
}

function liveIoPolicySnapshot() {
  return {
    kind: 'runtime.live-io.snapshot',
    passive: passiveTelemetryService.liveIoStatus(),
    threat: threatIntelService.liveIoStatus(),
    message: 'Live IO is backend gated and disabled by default'
  };
}

function setLiveIoPolicy(payload = {}) {
  const lane = payload.lane === 'passive' || payload.lane === 'threat' ? payload.lane : 'all';
  const enabled = payload.enabled === true;
  const reason = payload.reason || (enabled ? 'Operator enabled live IO' : 'Operator disabled live IO');
  if (lane === 'all' || lane === 'passive') {
    passiveTelemetryService.setLiveIoEnabled(enabled, reason);
  }
  if (lane === 'all' || lane === 'threat') {
    threatIntelService.setLiveIoEnabled(enabled, reason);
  }
  traceRuntimeDiagnostic('runtime_live_io_policy_changed', { lane, enabled });
  return liveIoPolicySnapshot();
}

function registerClipboardGlobalShortcut() {
  const preferredAccelerator = 'Control+\\';
  const fallbackAccelerator = 'Control+Alt+Space';
  const kindToggleAccelerator = 'Alt+\\';
  try {
    const registered = globalShortcut.register(preferredAccelerator, armClipboardFromShortcut);
    const kindToggleRegistered = globalShortcut.register(kindToggleAccelerator, emitTargetKindToggle);
    let fallbackRegistered = false;
    if (!registered) {
      fallbackRegistered = globalShortcut.register(fallbackAccelerator, armClipboardFromShortcut);
    }
    clipboardShortcutStatus = {
      accelerator: preferredAccelerator,
      fallbackAccelerator: fallbackRegistered ? fallbackAccelerator : null,
      registered,
      fallbackRegistered,
      kindToggleAccelerator,
      kindToggleRegistered,
      supported: registered || fallbackRegistered,
      message: registered
        ? 'Ctrl+\\ opens a 3 second clipboard scan window'
        : (fallbackRegistered
            ? 'Ctrl+\\ could not be registered; Ctrl+Alt+Space opens a 3 second clipboard scan window'
            : 'Ctrl+\\ could not be registered; use the Threat Intel scan field')
    };
    traceRuntimeDiagnostic('clipboard_acquisition_global_shortcut', {
      ...clipboardShortcutStatus
    });
  } catch (error) {
    let fallbackRegistered = false;
    let kindToggleRegistered = false;
    try {
      fallbackRegistered = globalShortcut.register(fallbackAccelerator, armClipboardFromShortcut);
    } catch {
      fallbackRegistered = false;
    }
    try {
      kindToggleRegistered = globalShortcut.register(kindToggleAccelerator, emitTargetKindToggle);
    } catch {
      kindToggleRegistered = false;
    }
    clipboardShortcutStatus = {
      accelerator: preferredAccelerator,
      fallbackAccelerator: fallbackRegistered ? fallbackAccelerator : null,
      registered: false,
      fallbackRegistered,
      kindToggleAccelerator,
      kindToggleRegistered,
      supported: fallbackRegistered,
      message: fallbackRegistered
        ? 'Ctrl+\\ shortcut failed; Ctrl+Alt+Space opens a 3 second clipboard scan window'
        : `Ctrl+\\ shortcut failed: ${error.message}; use the Threat Intel scan field`
    };
    traceRuntimeDiagnostic('clipboard_acquisition_global_shortcut_error', { message: error.message });
  }
}

function emitTargetKindToggle() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  mainWindow.webContents.send(TARGET_KIND_TOGGLE_CHANNEL, {
    kind: 'threat.target-kind.toggle',
    accelerator: 'Alt+\\',
    toggledAt: new Date().toISOString()
  });
}

function armClipboardFromShortcut() {
  if (!threatLiveIoGate.status().enabled) {
    emitClipboardSnapshot({
      kind: 'clipboard.acquisition.snapshot',
      state: 'blocked',
      message: 'IO authority is off; clipboard scan was not started',
      reason: 'io-disabled',
      listeningUntilMs: null,
      cooldownUntilMs: null,
      lastCapture: null
    });
    traceRuntimeDiagnostic('clipboard_acquisition_io_blocked', {
      message: 'IO authority is off; clipboard was not read'
    });
    return;
  }
  const currentClipboardText = clipboard.readText();
  const armPayload = String(currentClipboardText || '').trim()
    ? { clipboardText: currentClipboardText }
    : {};

  clipboardAcquisitionService.arm(armPayload)
    .then((snapshot) => {
      emitClipboardSnapshot(snapshot);
      scheduleClipboardCapturePoll(snapshot);
    })
    .catch((error) => {
      traceRuntimeDiagnostic('clipboard_acquisition_global_shortcut_error', { message: error.message });
    });
}

function scheduleClipboardCapturePoll(snapshot) {
  if (clipboardCapturePoll) {
    clearInterval(clipboardCapturePoll);
    clipboardCapturePoll = null;
  }
  if (snapshot?.state !== 'listening') {
    return;
  }

  clipboardCapturePoll = setInterval(async () => {
    try {
      const next = await clipboardAcquisitionService.capture();
      emitClipboardSnapshot(next);
      if (next.state !== 'listening') {
        clearInterval(clipboardCapturePoll);
        clipboardCapturePoll = null;
      }
    } catch (error) {
      clearInterval(clipboardCapturePoll);
      clipboardCapturePoll = null;
      traceRuntimeDiagnostic('clipboard_acquisition_capture_poll_error', { message: error.message });
    }
  }, 400);
}

function emitClipboardSnapshot(snapshot) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  mainWindow.webContents.send(CLIPBOARD_SNAPSHOT_CHANNEL, snapshot);
}

function traceRuntimeDiagnostic(event, payload = {}) {
  runtimeDiagnosticsService.record(event, payload);
  console.warn(`[aura-sense diagnostic] ${event}`, payload);
}

function runVisualSmokeIfRequested(window, rendererLoad) {
  if (!isVisualSmokeRequested()) {
    return;
  }

  const outputDir = visualSmokeOutputDir();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, 'visual-smoke-main-started.json'),
    JSON.stringify({
      status: 'started',
      started_at: new Date().toISOString(),
      argv: process.argv.filter((arg) => arg.includes('aura-sense')),
      env_flag: process.env.AURA_SENSE_ELECTRON_VISUAL_SMOKE || null
    }, null, 2)
  );

  (async () => {
    try {
      await rendererLoad;
      const result = await runVisualSmoke(window, outputDir);
      fs.writeFileSync(
        path.join(outputDir, 'visual-smoke-result.json'),
        JSON.stringify(result, null, 2)
      );
      console.log(`AURA-Sense visual smoke passed: ${outputDir}`);
      app.exit(0);
    } catch (error) {
      const failure = await captureSmokeFailure(window, outputDir, error);
      fs.writeFileSync(
        path.join(outputDir, 'visual-smoke-result.json'),
        JSON.stringify(failure, null, 2)
      );
      console.error(error);
      app.exit(1);
    }
  })();
}

function isVisualSmokeRequested() {
  return (
    process.env.AURA_SENSE_ELECTRON_VISUAL_SMOKE === '1' ||
    process.argv.includes('--aura-sense-electron-visual-smoke')
  );
}

function visualSmokeOutputDir() {
  const argPrefix = '--aura-sense-visual-smoke-dir=';
  const dirArg = process.argv.find((arg) => arg.startsWith(argPrefix));
  return process.env.AURA_SENSE_VISUAL_SMOKE_DIR || dirArg?.slice(argPrefix.length) || path.join(app.getPath('userData'), 'visual-smoke');
}

async function runVisualSmoke(window, outputDir) {
  await waitForSmokeReady(window);
  const checks = await smokeChecks(window);
  assertSmoke(checks.hasAuraBridge, 'renderer should expose aura service bridge');
  assertSmoke(checks.hasWindowBridge, 'renderer should expose auraWindow bridge');
  assertSmoke(checks.hasCombatWitnessBridge, 'renderer should expose auraCombatWitness bridge');
  assertSmoke(checks.noNodeRequire, 'renderer should not expose Node require');
  assertSmoke(checks.noElectronGlobal, 'renderer should not expose Electron globals');
  assertSmoke(checks.hasCombatSurface, 'renderer should contain Combat Witness surface');
  assertSmoke(checks.hasIntegratedViewport, 'renderer should contain integrated viewport root');
  assertSmoke(checks.hasGlanceStrip, 'renderer should contain compact glance strip');
  assertSmoke(checks.hasSystemContext, 'renderer should contain system kills/jumps context');
  assertSmoke(checks.hasClipboardListen, 'renderer should contain clipboard listen state');
  assertSmoke(checks.hasDrawerControls, 'renderer should contain collapsed detail drawers and diagnostics takeover');
  assertSmoke(checks.hasEventList, 'renderer should contain event list surface');
  assertSmoke(checks.hasWatcherControls, 'renderer should contain Combat Witness watcher controls');
  assertSmoke(checks.hasThreatSurface, 'renderer should contain Threat Intel surface');
  assertSmoke(checks.hasCombatMetrics, 'renderer should contain compact Combat Witness metric fields');
  assertSmoke(checks.hasRuntimeState, 'renderer should contain runtime state in diagnostics panel');
  assertSmoke(checks.noParserRuntimeExposure, 'renderer should not expose parser/runtime modules');

  const firstLightCaptureAttempts = await captureSmokeScreenshot(window, path.join(outputDir, 'first-light.png'));
  const regressionStates = await captureVisualRegressionStates(window, outputDir);

  return {
    status: 'passed',
    checked_at: new Date().toISOString(),
    output_dir: outputDir,
    screenshots: ['first-light.png', ...regressionStates.map((state) => state.screenshot)],
    capture_attempts: [
      { screenshot: 'first-light.png', attempts: firstLightCaptureAttempts },
      ...regressionStates.map((state) => ({
        screenshot: state.screenshot,
        attempts: state.capture_attempts
      }))
    ],
    checks,
    regression_states: regressionStates
  };
}

async function captureVisualRegressionStates(window, outputDir) {
  const originalBounds = window.getBounds();
  const states = [
    {
      name: 'unavailable',
      screenshot: 'state-unavailable.png',
      assertions: ['#pressure-title', '#watcher-indicator', '#incoming-pressure', '#repair-throughput'],
      script: `
        resetViewportState();
        setText('#combat-summary', 'Combat Witness bridge unavailable.');
        setText('#combat-detail', 'Combat Witness snapshot unavailable.');
        setText('#combat-signal', 'Unavailable');
        setText('#watcher-state', 'Unavailable');
        setText('#watcher-message', 'Log Watcher unavailable.');
        setText('#incoming-pressure', '0');
        setText('#repair-throughput', '0');
      `
    },
    {
      name: 'stale',
      screenshot: 'state-stale.png',
      assertions: ['#pressure-title', '#passive-system', '#system-shipkills', '#front-threat-provider'],
      script: `
        resetViewportState();
        setText('#combat-summary', 'No recent combat observed.');
        setText('#combat-signal', 'Stale');
        setText('#combat-detail', 'Latest Combat Witness snapshot is stale.');
        setText('#passive-freshness', 'Stale');
        setText('#threat-basis', 'Cached provider context');
      `
    },
    {
      name: 'degraded',
      screenshot: 'state-degraded.png',
      assertions: ['#watcher-indicator', '#pressure-title', '#incoming-pressure', '#repair-throughput'],
      script: `
        resetViewportState();
        setText('#watcher-state', 'Degraded');
        setText('#watcher-message', 'Log Watcher degraded; polling fallback active.');
        setText('#combat-summary', 'Combat Witness degraded, latest snapshot retained.');
        document.querySelector('#watcher-indicator')?.classList.add('is-degraded');
      `
    },
    {
      name: 'blocked',
      screenshot: 'state-blocked.png',
      assertions: ['#top-live-io-toggle', '#pressure-title', '#incoming-pressure', '#front-observed-source'],
      script: `
        resetViewportState();
        document.querySelector('#integrated-viewport')?.classList.add('io-off');
        setText('#live-io-state', 'Off - network and clipboard blocked');
        setText('#combat-summary', 'Combat Witness remains local while live IO is blocked.');
        setText('#front-observed-source', 'No source observed');
        document.querySelector('#top-live-io-toggle')?.classList.remove('is-on');
      `
    },
    {
      name: 'partial-capped',
      screenshot: 'state-partial-capped.png',
      assertions: ['#threat-drawer', '#front-threat-provider', '#threat-pulse', '#threat-message', '#threat-target-label'],
      script: `
        resetViewportState();
        document.querySelector('#threat-drawer').open = true;
        setText('#threat-state', 'Partial');
        setText('#threat-target-label', 'Jita');
        setText('#threat-sample', '10 / 28');
        setText('#threat-basis', 'zKill capped partial sample');
        setText('#threat-message', 'Partial provider response; sample capped for display.');
        document.querySelectorAll('#threat-pulse span').forEach((dot, index) => {
          dot.classList.toggle('is-active', index < 6);
          dot.classList.toggle('is-selected', index < 3);
        });
      `
    },
    {
      name: 'cooldown',
      screenshot: 'state-cooldown.png',
      assertions: ['#threat-drawer', '#clipboard-listen', '#clipboard-state', '#threat-message'],
      script: `
        resetViewportState();
        document.querySelector('#threat-drawer').open = true;
        document.querySelector('#clipboard-listen')?.classList.add('is-cooldown');
        setText('#clipboard-state', 'Cooldown');
        setText('#shortcut-message', 'Ctrl+\\\\ is cooling down after the last clipboard scan.');
        setText('#threat-message', 'Clipboard scan sealed; cooldown active.');
      `
    },
    {
      name: 'diagnostics-open',
      screenshot: 'state-diagnostics-open.png',
      assertions: ['#diagnostics-panel', '#diagnostics-state', '#watcher-controls', '#event-list'],
      script: `
        resetViewportState();
        document.querySelector('#integrated-viewport')?.classList.add('diagnostics-open');
        document.querySelector('#diagnostics-toggle')?.classList.add('active');
        setText('#diagnostics-state', 'Observed');
        setText('#event-list', '');
        const item = document.createElement('li');
        const label = document.createElement('strong');
        label.textContent = 'Observed state';
        const detail = document.createElement('span');
        detail.textContent = 'diagnostics smoke';
        item.append(label, detail);
        document.querySelector('#event-list')?.appendChild(item);
      `
    },
    {
      name: 'settings-degraded',
      screenshot: 'state-settings-degraded.png',
      assertions: ['#diagnostics-panel', '#settings-state', '#runtime-health', '#gamelog-folder', '#watcher-message'],
      script: `
        resetViewportState();
        document.querySelector('#integrated-viewport')?.classList.add('diagnostics-open');
        setText('#settings-state', 'Recovered with degraded path');
        setText('#runtime-health', 'Runtime ready');
        setValue('#gamelog-folder', 'C:\\\\EVE\\\\Missing\\\\Gamelogs');
        setText('#watcher-message', 'Persisted gamelog folder is missing; select a valid folder.');
      `
    },
    {
      name: 'narrow-viewport',
      screenshot: 'state-narrow-viewport.png',
      width: 420,
      height: 520,
      assertions: ['#integrated-viewport', '#pressure-title', '#incoming-pressure', '#repair-throughput', '#front-context-value'],
      script: `
        resetViewportState();
        setText('#combat-summary', 'Narrow viewport smoke state.');
        setText('#incoming-pressure', '742');
        setText('#repair-throughput', '511');
        setText('#front-context-value', 'Heavy Neutron Blaster II');
      `
    }
  ];

  const results = [];
  for (const state of states) {
    if (state.width && state.height) {
      window.setSize(state.width, state.height);
    } else {
      window.setBounds(originalBounds);
    }
    await delay(60);
    const check = await applyVisualRegressionState(window, state);
    for (const assertion of check.assertions) {
      assertSmoke(assertion.visible, `${state.name} should keep ${assertion.selector} visible`);
    }
    const captureAttempts = await captureSmokeScreenshot(window, path.join(outputDir, state.screenshot));
    results.push({
      name: state.name,
      screenshot: state.screenshot,
      capture_attempts: captureAttempts,
      viewport: check.viewport,
      assertions: check.assertions
    });
  }
  window.setBounds(originalBounds);
  return results;
}

function applyVisualRegressionState(window, state) {
  return window.webContents.executeJavaScript(`
    (() => {
      const setText = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = value;
      };
      const setValue = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.value = value;
      };
      const resetViewportState = () => {
        document.querySelector('#integrated-viewport')?.classList.remove('diagnostics-open', 'io-off');
        document.querySelector('#diagnostics-toggle')?.classList.remove('active');
        document.querySelector('#threat-drawer').open = false;
        document.querySelector('#clipboard-listen')?.classList.remove('is-listening', 'is-cooldown', 'is-unsupported');
        document.querySelector('#watcher-indicator')?.classList.remove('is-watching', 'is-degraded', 'is-blocked');
        document.querySelectorAll('#threat-pulse span').forEach((dot) => {
          dot.classList.remove('is-active', 'is-selected');
        });
      };
      ${state.script}
      const selectors = ${JSON.stringify(state.assertions)};
      const assertions = selectors.map((selector) => {
        const element = document.querySelector(selector);
        const rect = element?.getBoundingClientRect();
        const style = element ? getComputedStyle(element) : null;
        return {
          selector,
          text: element?.textContent?.trim().slice(0, 120) || null,
          visible: Boolean(
            element &&
            rect &&
            rect.width > 0 &&
            rect.height > 0 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden'
          )
        };
      });
      return {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        assertions
      };
    })();
  `);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function captureSmokeScreenshot(window, filePath) {
  const maxAttempts = 3;
  let lastError = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const image = await window.webContents.capturePage();
      fs.writeFileSync(filePath, image.toPNG());
      return attempt;
    } catch (error) {
      lastError = error;
      if (error.message !== 'UnknownVizError' || attempt === maxAttempts) {
        throw error;
      }
      await delay(150 * attempt);
    }
  }
  throw lastError;
}

function waitForSmokeReady(window) {
  return window.webContents.executeJavaScript(`
    new Promise((resolve, reject) => {
      const started = Date.now();
      const check = () => {
        const summary = document.querySelector('#combat-summary')?.textContent || '';
        const signal = document.querySelector('#combat-signal')?.textContent || '';
        const hasSurface = Boolean(document.querySelector('.combat-surface'));
        if (hasSurface && summary && signal && summary !== 'Waiting for backend snapshot.') {
          resolve(true);
          return;
        }
        if (Date.now() - started > 10000) {
          reject(new Error('Timed out waiting for first-light renderer initialization'));
          return;
        }
        setTimeout(check, 100);
      };
      check();
    });
  `);
}

function smokeChecks(window) {
  return window.webContents.executeJavaScript(`
    ({
      hasAuraBridge: Boolean(window.aura?.invokeService && window.aura?.listServices),
      hasWindowBridge: Boolean(window.auraWindow?.getState && window.auraWindow?.setAlwaysOnTop),
      hasCombatWitnessBridge: Boolean(window.auraCombatWitness?.getSnapshot && window.auraCombatWitness?.subscribeSnapshots),
      noNodeRequire: typeof window.require === 'undefined',
      noElectronGlobal: typeof window.ipcRenderer === 'undefined' && typeof window.BrowserWindow === 'undefined',
      hasIntegratedViewport: Boolean(document.querySelector('#integrated-viewport')),
      hasGlanceStrip: Boolean(document.querySelector('.glance-strip')),
      hasSystemContext: Boolean(document.querySelector('#system-shipkills') && document.querySelector('#system-jumps') && document.querySelector('#system-ratio')),
      hasClipboardListen: Boolean(document.querySelector('#clipboard-state') && document.querySelector('#clipboard-key-ctrl') && document.querySelector('#clipboard-key-slash') && !document.querySelector('#shortcut-state')),
      hasDrawerControls: Boolean(document.querySelector('#threat-drawer') && document.querySelector('#diagnostics-setup-host') && document.querySelector('#diagnostics-panel') && document.querySelector('#diagnostics-toggle')),
      hasCombatSurface: Boolean(document.querySelector('.combat-surface') && document.querySelector('#pressure-title') && document.querySelector('#net-pressure-gauge')),
      hasCombatMetrics: Boolean(document.querySelector('#net-pressure-value') && document.querySelector('#incoming-pressure') && document.querySelector('#repair-throughput') && document.querySelector('#incoming-bar') && document.querySelector('#repair-bar')),
      hasEventList: Boolean(document.querySelector('#event-list')),
      hasWatcherControls: Boolean(document.querySelector('#watcher-controls') && document.querySelector('#gamelog-folder')),
      hasThreatSurface: Boolean(document.querySelector('.threat-surface') && document.querySelector('#threat-search')),
      hasRuntimeState: Boolean(document.querySelector('#live-io-state') && document.querySelector('#settings-state')),
      noParserRuntimeExposure: (
        typeof window.CombatWitnessService === 'undefined' &&
        typeof window.EveCombatLogParser === 'undefined' &&
        typeof window.eveGamelogWatcher === 'undefined'
      ),
      signalText: document.querySelector('#combat-signal')?.textContent || null,
      watcherText: document.querySelector('#watcher-state')?.textContent || null,
      threatText: document.querySelector('#threat-state')?.textContent || null,
      combatDetailText: document.querySelector('#combat-detail')?.textContent || null,
      incomingPressureText: document.querySelector('#incoming-pressure')?.textContent || null,
      repairBalanceText: document.querySelector('#repair-balance')?.textContent || null,
      passiveBasisText: document.querySelector('#passive-basis')?.textContent || null,
      threatBasisText: document.querySelector('#threat-basis')?.textContent || null,
      settingsStateText: document.querySelector('#settings-state')?.textContent || null,
      liveIoStateText: document.querySelector('#live-io-state')?.textContent || null,
      diagnosticsStateText: document.querySelector('#diagnostics-state')?.textContent || null,
      summaryText: document.querySelector('#combat-summary')?.textContent || null,
      eventListText: document.querySelector('#event-list')?.textContent || null
    });
  `);
}

async function captureSmokeFailure(window, outputDir, error) {
  let diagnostics = {};
  fs.mkdirSync(outputDir, { recursive: true });
  try {
    diagnostics = await smokeDiagnostics(window);
    const image = await window.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'failure.png'), image.toPNG());
  } catch (diagnosticError) {
    diagnostics = {
      diagnostic_error: diagnosticError.message
    };
  }

  return {
    status: 'failed',
    checked_at: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    screenshots: fs.existsSync(path.join(outputDir, 'failure.png')) ? ['failure.png'] : [],
    diagnostics
  };
}

function smokeDiagnostics(window) {
  return window.webContents.executeJavaScript(`
    ({
      readyState: document.readyState,
      hasAuraBridge: Boolean(window.aura),
      hasWindowBridge: Boolean(window.auraWindow),
      hasCombatWitnessBridge: Boolean(window.auraCombatWitness),
      hasScriptTag: Boolean(document.querySelector('script[src="./app.js"]')),
      bodyTextSample: document.body.innerText.slice(0, 500)
    });
  `);
}

function assertSmoke(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
