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
  assert(preload.includes('auraPassiveTelemetry'), 'preload should expose Passive Telemetry snapshot bridge');
  assert(preload.includes('auraThreatIntel'), 'preload should expose Threat Intel bridge');
  assert(preload.includes('aura:combat-witness:get-snapshot'), 'preload should expose Combat Witness snapshot request');
  assert(preload.includes('aura:combat-witness:subscribe'), 'preload should expose Combat Witness subscription request');
  assert(preload.includes('aura:passive-telemetry:get-snapshot'), 'preload should expose Passive Telemetry snapshot request');
  assert(preload.includes('aura:window:set-always-on-top'), 'preload should expose always-on-top IPC');
  assert(html.includes('frame-chrome'), 'renderer should include Frame chrome');
  assert(html.includes('integrated-viewport'), 'renderer should include integrated viewport root');
  assert(html.includes('lane-overview'), 'renderer should include lane overview strip');
  assert(html.includes('pin-window'), 'renderer should include always-on-top control');
  assert(html.includes('AURA-Sense'), 'renderer should carry AURA-Sense product label');
  assert(html.includes('combat-summary'), 'renderer should include Combat Witness summary target');
  assert(html.includes('combat-signal'), 'renderer should include Combat Witness freshness target');
  assert(html.includes('combat-detail'), 'renderer should include Combat Witness lane detail target');
  assert(html.includes('incoming-pressure'), 'renderer should include observed incoming pressure target');
  assert(html.includes('repair-throughput'), 'renderer should include observed repair throughput target');
  assert(html.includes('repair-balance'), 'renderer should include observed repair balance target');
  assert(html.includes('observed-source'), 'renderer should include observed source target');
  assert(html.includes('observed-weapon'), 'renderer should include observed weapon target');
  assert(html.includes('watcher-controls'), 'renderer should include Combat Witness watcher controls');
  assert(html.includes('watcher-state'), 'renderer should include Combat Witness watcher state target');
  assert(html.includes('passive-surface'), 'renderer should include Passive Telemetry surface');
  assert(html.includes('passive-system'), 'renderer should include Passive Telemetry current-system target');
  assert(html.includes('passive-activity'), 'renderer should include Passive Telemetry activity target');
  assert(html.includes('passive-basis'), 'renderer should include Passive Telemetry provider basis target');
  assert(html.includes('event-list'), 'renderer should include bounded event stream target');
  assert(html.includes('threat-search'), 'renderer should include Threat Intel search form');
  assert(html.includes('threat-target'), 'renderer should include Threat Intel target input');
  assert(html.includes('threat-basis'), 'renderer should include Threat Intel provider basis target');
  assert(html.includes('clipboard-arm'), 'renderer should include Clipboard Acquisition arm control');
  assert(app.includes('seed.readiness'), 'renderer should request seed readiness through services');
  assert(app.includes("window.aura.invokeService('combat.witness.status'"), 'renderer should read Combat Witness runtime status through services');
  assert(app.includes("window.aura.invokeService('combat.witness.start'"), 'renderer should start Combat Witness watcher through services');
  assert(app.includes("window.aura.invokeService('combat.witness.stop'"), 'renderer should stop Combat Witness watcher through services');
  assert(app.includes('window.auraCombatWitness.getSnapshot'), 'renderer should request bridge-owned Combat Witness snapshots');
  assert(app.includes('window.auraCombatWitness.subscribeSnapshots'), 'renderer should subscribe through Combat Witness bridge');
  assert(app.includes('window.auraPassiveTelemetry.getSnapshot'), 'renderer should request backend-owned Passive Telemetry snapshots');
  assert(app.includes('window.auraPassiveTelemetry.subscribeSnapshots'), 'renderer should subscribe through Passive Telemetry bridge');
  assert(app.includes('snapshot.activity.shipKills'), 'renderer should present backend-owned Passive Telemetry activity');
  assert(app.includes('window15s.damage?.incoming'), 'renderer should present backend-owned Combat Witness incoming metrics');
  assert(app.includes('window15s.repair?.incoming'), 'renderer should present backend-owned Combat Witness repair metrics');
  assert(app.includes('balance.receivedRepairMinusDamagePerSecond'), 'renderer should present backend-owned observed repair balance');
  assert(app.includes('incoming.mostObservedWeaponType'), 'renderer should present backend-owned observed weapon metrics');
  assert(app.includes('window.auraThreatIntel.scan'), 'renderer should run Threat Intel scans through preload bridge');
  assert(app.includes("inputSource: 'search'"), 'renderer should mark explicit search input source');
  assert(app.includes('armClipboard'), 'renderer should arm Clipboard Acquisition through preload bridge');
  assert(app.includes("addEventListener('focus'"), 'renderer should handle focus without scanning');
  assert(!app.includes("addEventListener('focus', submitThreatSearch"), 'renderer focus must not dispatch Threat Intel scan');
  assert(app.includes('snapshot.operational?.watcher'), 'renderer should present backend-owned watcher status');
  assert(app.includes('snapshot.freshness?.status'), 'renderer should present backend-owned freshness status');
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
