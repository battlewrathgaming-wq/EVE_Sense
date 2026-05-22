const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { APP_NAME } = require('../constants');
const { createCombatWitnessBridge } = require('../combat/combatWitnessBridge');
const { createDefaultRegistry, registerElectronServiceHandlers } = require('../services/serviceRegistry');
const { registerRuntimeErrorHandlers } = require('./runtimeErrorHandling');
const { createFrameWindow, registerFrameWindowHandlers } = require('../modules/Frame');

const registry = createDefaultRegistry();
const combatWitnessBridge = createCombatWitnessBridge();
let mainWindow = null;

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
  createWindow();

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
      hasFreshnessText: ['Recent', 'Stale', 'Empty', 'Unavailable'].includes(document.querySelector('#combat-signal')?.textContent || ''),
      hasEventList: Boolean(document.querySelector('#event-list')),
      noParserRuntimeExposure: (
        typeof window.CombatWitnessService === 'undefined' &&
        typeof window.EveCombatLogParser === 'undefined' &&
        typeof window.eveGamelogWatcher === 'undefined'
      ),
      signalText: document.querySelector('#combat-signal')?.textContent || null,
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
