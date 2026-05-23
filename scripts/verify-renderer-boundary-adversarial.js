const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { projectRoot } = require('../src/util/tempPaths');

const root = projectRoot();
const rendererDir = path.join(root, 'src', 'renderer');
const preloadPath = path.join(root, 'src', 'main', 'preload.js');

const forbiddenRendererRules = [
  {
    name: 'direct provider endpoints',
    pattern: /https?:\/\/|esi\.|zkillboard|zkillredisq|\/api\/|killmails\/|system_kills|system_jumps|pastSeconds/i,
    sample: "fetch('https://esi.evetech.net/latest/universe/system_kills/')"
  },
  {
    name: 'node or electron authority',
    pattern: /\brequire\s*\(|\bimport\s+.*\s+from\s+['"](?:node:|electron|fs|path|child_process|net|http|https)/,
    sample: "const fs = require('node:fs')"
  },
  {
    name: 'filesystem and log access',
    pattern: /\breadFile(?:Sync)?\s*\(|\bwriteFile(?:Sync)?\s*\(|\breaddir(?:Sync)?\s*\(|\bwatch\s*\(|(?:['"`][^'"`]*(?:Gamelogs|\.txt)[^'"`]*['"`]\s*\))/i,
    sample: "fs.readFileSync('Gamelogs/local.txt')"
  },
  {
    name: 'parser ownership',
    pattern: /parseEveLogLine|combatLogParser|LOG_ENVELOPE_PATTERN|rawLineHash|hits you for|misses you completely/i,
    sample: "parseEveLogLine('[ 2026.01.01 00:00:00 ] (combat) Mining Drone misses you completely')"
  },
  {
    name: 'tactical computation ownership',
    pattern: /new\s+CombatRollingWindow|damagePattern|calculateDps|\b(?:const|let|var)\s+\w*(?:Dps|Hps|RepairMinusDamage)\w*\s*=|receivedRepairMinusDamagePerSecond\s*=/i,
    sample: 'const receivedRepairMinusDamagePerSecond = repair - damage'
  }
];

const preloadForbiddenRules = [
  {
    name: 'preload network calls',
    pattern: /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bnavigator\.sendBeacon\b/,
    sample: "fetch('https://zkillboard.com/api/')"
  },
  {
    name: 'preload filesystem access',
    pattern: /\breadFile(?:Sync)?\s*\(|\bwriteFile(?:Sync)?\s*\(|\breaddir(?:Sync)?\s*\(|\bwatch\s*\(|Gamelogs/i,
    sample: "fs.watch('Gamelogs')"
  },
  {
    name: 'preload parser ownership',
    pattern: /parseEveLogLine|combatLogParser|CombatRollingWindow|hits you for|misses you completely/i,
    sample: 'CombatRollingWindow'
  }
];

const allowedRendererServiceCommands = new Set([
  'seed.readiness',
  'runtime.settings.snapshot',
  'runtime.gamelog-folder.pick',
  'runtime.live-io.snapshot',
  'runtime.live-io.set-enabled',
  'runtime.diagnostics.snapshot',
  'combat.witness.status',
  'combat.witness.start',
  'combat.witness.stop'
]);

function main() {
  verifyRulesCatchAdversarialSamples();
  verifyRendererFiles();
  verifyPreloadShape();
  console.log('renderer boundary adversarial checks verified');
}

function verifyRulesCatchAdversarialSamples() {
  for (const rule of [...forbiddenRendererRules, ...preloadForbiddenRules]) {
    assert.match(rule.sample, rule.pattern, `${rule.name} rule should catch its adversarial sample`);
  }
}

function verifyRendererFiles() {
  const violations = [];
  for (const filePath of listFiles(rendererDir)) {
    const text = fs.readFileSync(filePath, 'utf8');
    const relative = path.relative(root, filePath);
    for (const rule of forbiddenRendererRules) {
      const match = text.match(rule.pattern);
      if (match) {
        violations.push(`${relative}:${lineForIndex(text, match.index || 0)} ${rule.name}`);
      }
    }
  }
  assert.deepStrictEqual(violations, [], `renderer adversarial boundary violations:\n${violations.join('\n')}`);
}

function verifyPreloadShape() {
  const preload = fs.readFileSync(preloadPath, 'utf8');
  for (const rule of preloadForbiddenRules) {
    const match = preload.match(rule.pattern);
    assert.strictEqual(match, null, `preload should reject ${rule.name}`);
  }

  assert.match(preload, /RENDERER_SERVICE_COMMANDS/, 'preload should expose an explicit renderer command allowlist');
  assert.match(preload, /RENDERER_SERVICE_COMMAND_SET\.has\(command\)/, 'generic service bridge should enforce the allowlist');
  assert.doesNotMatch(preload, /listServices:\s*\(\)\s*=>\s*ipcRenderer\.invoke\('aura:service:list'\)/, 'preload must not expose full backend service inventory');

  const commands = extractPreloadAllowlist(preload);
  assert.deepStrictEqual(new Set(commands), allowedRendererServiceCommands, 'preload allowlist should match renderer service authority');

  assertSubscription(preload, 'auraCombatWitness', 'aura:combat-witness:snapshot', 'aura:combat-witness:unsubscribe');
  assertSubscription(preload, 'auraPassiveTelemetry', 'aura:passive-telemetry:snapshot', 'aura:passive-telemetry:unsubscribe');
  assert.match(preload, /aura:threat-clipboard:snapshot/, 'preload should expose clipboard snapshot push channel');
  assert.match(preload, /typeof callback !== 'function'/g, 'snapshot subscriptions should validate callbacks');
  assert.match(preload, /threat\.clipboard\.arm/, 'preload should keep backend-owned clipboard acquisition available to shortcut flow');
}

function extractPreloadAllowlist(preload) {
  const match = preload.match(/const RENDERER_SERVICE_COMMANDS = Object\.freeze\(\[([\s\S]*?)\]\);/);
  assert.ok(match, 'preload allowlist should be statically inspectable');
  return Array.from(match[1].matchAll(/'([^']+)'/g)).map((entry) => entry[1]);
}

function assertSubscription(preload, bridgeName, channel, unsubscribeChannel) {
  const bridgeStart = preload.indexOf(`exposeInMainWorld('${bridgeName}'`);
  assert.notStrictEqual(bridgeStart, -1, `${bridgeName} should be exposed`);
  const bridgeBlock = preload.slice(bridgeStart, preload.indexOf('});', bridgeStart) + 3);
  assert.match(bridgeBlock, new RegExp(`ipcRenderer\\.on\\('${escapeRegExp(channel)}'`), `${bridgeName} should subscribe to ${channel}`);
  assert.match(bridgeBlock, new RegExp(`removeListener\\('${escapeRegExp(channel)}'`), `${bridgeName} unsubscribe should remove listener`);
  assert.match(bridgeBlock, new RegExp(`ipcRenderer\\.invoke\\('${escapeRegExp(unsubscribeChannel)}'`), `${bridgeName} unsubscribe should notify main process`);
}

function listFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(entryPath));
    } else if (/\.(?:js|mjs|cjs|html|css)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function lineForIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main();
