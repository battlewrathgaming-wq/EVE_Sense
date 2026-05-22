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

  assert(main.includes("require('../modules/Frame')"), 'main process should create windows through Frame module');
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
