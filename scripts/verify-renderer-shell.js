const fs = require('node:fs');
const path = require('node:path');
const { projectRoot } = require('../src/util/tempPaths');

function main() {
  const root = projectRoot();
  const main = read(path.join(root, 'src', 'main', 'main.js'));
  const frame = read(path.join(root, 'src', 'modules', 'Frame', 'windowShell.js'));
  const preload = read(path.join(root, 'src', 'main', 'preload.js'));
  const html = read(path.join(root, 'src', 'renderer', 'index.html'));
  const app = read(path.join(root, 'src', 'renderer', 'app.js'));
  const packageJson = read(path.join(root, 'package.json'));
  const smokeScript = read(path.join(root, 'scripts', 'electron-visual-smoke.ps1'));

  assert(main.includes("require('../modules/Frame')"), 'main process should create windows through Frame module');
  assert(main.includes('AURA_SENSE_ELECTRON_VISUAL_SMOKE'), 'main process should support explicit visual smoke mode');
  assert(main.includes('AURA_SENSE_VISUAL_SMOKE_DIR'), 'main process should use explicit visual smoke output dir');
  assert(main.includes('--aura-sense-electron-visual-smoke'), 'main process should support explicit visual smoke argv flag');
  assert(main.includes('capturePage()'), 'visual smoke should capture Electron window screenshots');
  assert(main.includes('visual-smoke-result.json'), 'visual smoke should write a structured result file');
  assert(main.includes('noParserRuntimeExposure'), 'visual smoke should assert parser/runtime modules are not exposed');
  assert(frame.includes('frame: false'), 'Frame module should create frameless windows');
  assert(frame.includes('contextIsolation: true'), 'Frame module should enable context isolation');
  assert(frame.includes('nodeIntegration: false'), 'Frame module should disable node integration');
  assert(preload.includes('contextBridge.exposeInMainWorld'), 'preload should expose a narrow bridge');
  assert(preload.includes('aura:service:invoke'), 'preload should invoke service channel');
  assert(preload.includes('auraWindow'), 'preload should expose Frame window bridge');
  assert(preload.includes('auraCombatWitness'), 'preload should expose Combat Witness snapshot bridge');
  assert(preload.includes('aura:combat-witness:get-snapshot'), 'preload should expose Combat Witness snapshot request');
  assert(preload.includes('aura:combat-witness:subscribe'), 'preload should expose Combat Witness subscription request');
  assert(preload.includes('aura:window:set-always-on-top'), 'preload should expose always-on-top IPC');
  assert(html.includes('frame-chrome'), 'renderer should include Frame chrome');
  assert(html.includes('pin-window'), 'renderer should include always-on-top control');
  assert(html.includes('AURA-Sense'), 'renderer should carry AURA-Sense product label');
  assert(html.includes('combat-summary'), 'renderer should include Combat Witness summary target');
  assert(html.includes('combat-signal'), 'renderer should include Combat Witness freshness target');
  assert(html.includes('event-list'), 'renderer should include bounded event stream target');
  assert(app.includes('seed.readiness'), 'renderer should request seed readiness through services');
  assert(app.includes('window.auraCombatWitness.getSnapshot'), 'renderer should request bridge-owned Combat Witness snapshots');
  assert(app.includes('window.auraCombatWitness.subscribeSnapshots'), 'renderer should subscribe through Combat Witness bridge');
  assert(app.includes("snapshot?.freshness?.status"), 'renderer should present backend-owned freshness status');
  assert(app.includes('window.auraWindow.setAlwaysOnTop'), 'renderer should toggle always-on-top through Frame bridge');
  assert(!app.includes('innerHTML'), 'renderer should not use innerHTML in the seed shell');
  assert(app.includes('textContent'), 'renderer should render dynamic data as textContent');
  assert(packageJson.includes('"smoke:electron"'), 'package should expose Electron visual smoke script');
  assert(smokeScript.includes('AURA_SENSE_ELECTRON_VISUAL_SMOKE'), 'visual smoke script should set explicit smoke flag');
  assert(smokeScript.includes('AURA_SENSE_VISUAL_SMOKE_DIR'), 'visual smoke script should set explicit smoke output dir');
  assert(smokeScript.includes('--aura-sense-electron-visual-smoke'), 'visual smoke script should pass explicit smoke argv flag');
  assert(smokeScript.includes('.tmp'), 'visual smoke script should keep artifacts under project .tmp');
  assert(!smokeScript.includes('F:'), 'visual smoke script should not hardcode a drive path');

  console.log('renderer shell verified');
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

main();
