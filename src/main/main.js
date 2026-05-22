const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, clipboard, globalShortcut, ipcMain } = require('electron');
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

const registry = createDefaultRegistry();
const passiveRequestLog = (entry) => traceRuntimeDiagnostic(entry.diagnostic_event || 'passive_request_log', entry);
const passiveLiveIoGate = createLiveIoGate();
const threatRequestLog = (entry) => traceRuntimeDiagnostic(entry.diagnostic_event || 'threat_request_log', entry);
const threatLiveIoGate = createLiveIoGate();
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
let mainWindow = null;

registerCombatWitnessRuntimeCommands(registry, combatWitnessRuntime);
registerPassiveTelemetryCommands(registry, passiveTelemetryService);
registerThreatIntelCommands(registry, threatIntelService, clipboardAcquisitionService);

function createWindow() {
  const window = createFrameWindow(app, {
    width: 960,
    height: 640,
    minWidth: 720,
    minHeight: 480,
    title: APP_NAME,
    preload: path.join(__dirname, 'preload.js'),
    backgroundColor: '#f5f7f8',
    defaultAlwaysOnTop: false
  });

  mainWindow = window;
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
  globalShortcut.unregisterAll();
});

function registerCombatWitnessRuntimeCommands(serviceRegistry, runtime) {
  serviceRegistry
    .register('combat.witness.status', {
      classification: TASK_CLASSIFICATIONS.READ_ONLY,
      description: 'Return Combat Witness watcher runtime status',
      handler: () => runtime.status()
    })
    .register('combat.witness.configure', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Validate and configure the local EVE gamelog folder for Combat Witness',
      handler: (payload = {}) => runtime.configure(payload)
    })
    .register('combat.witness.start', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Start Combat Witness watcher from the configured local EVE gamelog folder',
      handler: (payload = {}) => runtime.start(payload)
    })
    .register('combat.witness.stop', {
      classification: TASK_CLASSIFICATIONS.LOCAL_MUTATION,
      description: 'Stop Combat Witness watcher',
      handler: () => runtime.stop()
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
      handler: () => acquisition.snapshot()
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
    });
}

function registerClipboardGlobalShortcut() {
  try {
    const registered = globalShortcut.register('CommandOrControl+Shift+Space', () => {
      clipboardAcquisitionService.arm().catch((error) => {
        traceRuntimeDiagnostic('clipboard_acquisition_global_shortcut_error', { message: error.message });
      });
    });
    traceRuntimeDiagnostic('clipboard_acquisition_global_shortcut', {
      accelerator: 'CommandOrControl+Shift+Space',
      registered
    });
  } catch (error) {
    traceRuntimeDiagnostic('clipboard_acquisition_global_shortcut_error', { message: error.message });
  }
}

function traceRuntimeDiagnostic(event, payload = {}) {
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
  assertSmoke(checks.hasFreshnessText, 'renderer should show freshness/status text');
  assertSmoke(checks.hasEventList, 'renderer should contain event list surface');
  assertSmoke(checks.hasWatcherControls, 'renderer should contain Combat Witness watcher controls');
  assertSmoke(checks.hasPassiveSurface, 'renderer should contain Passive Telemetry surface');
  assertSmoke(checks.hasThreatSurface, 'renderer should contain Threat Intel surface');
  assertSmoke(checks.noParserRuntimeExposure, 'renderer should not expose parser/runtime modules');

  const image = await window.webContents.capturePage();
  fs.writeFileSync(path.join(outputDir, 'first-light.png'), image.toPNG());

  return {
    status: 'passed',
    checked_at: new Date().toISOString(),
    output_dir: outputDir,
    screenshots: ['first-light.png'],
    checks
  };
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
      hasCombatSurface: Boolean(document.querySelector('.combat-surface') && document.querySelector('#combat-summary')),
      hasFreshnessText: ['Recent', 'Stale', 'Empty', 'Unavailable', 'Degraded', 'Witnessed'].includes(document.querySelector('#combat-signal')?.textContent || ''),
      hasEventList: Boolean(document.querySelector('#event-list')),
      hasWatcherControls: Boolean(document.querySelector('#watcher-controls') && document.querySelector('#gamelog-folder')),
      hasPassiveSurface: Boolean(document.querySelector('.passive-surface') && document.querySelector('#passive-system')),
      hasThreatSurface: Boolean(document.querySelector('.threat-surface') && document.querySelector('#threat-search') && document.querySelector('#clipboard-arm')),
      noParserRuntimeExposure: (
        typeof window.CombatWitnessService === 'undefined' &&
        typeof window.EveCombatLogParser === 'undefined' &&
        typeof window.eveGamelogWatcher === 'undefined'
      ),
      signalText: document.querySelector('#combat-signal')?.textContent || null,
      watcherText: document.querySelector('#watcher-state')?.textContent || null,
      passiveText: document.querySelector('#passive-state')?.textContent || null,
      threatText: document.querySelector('#threat-state')?.textContent || null,
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
