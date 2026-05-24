const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createCombatWitnessRuntime } = require('../src/combat/combatWitnessRuntime');

const runtime = createCombatWitnessRuntime();
const statusSnapshots = [];
runtime.service.subscribeSnapshots((snapshot) => statusSnapshots.push(snapshot));

const missing = runtime.start({ gamelogFolder: path.join(os.tmpdir(), '__missing_aura_sense_gamelog__') });
assert.strictEqual(missing.watcher.state, 'unavailable', 'missing gamelog path should be unavailable');
assert.strictEqual(missing.configuredPath, null, 'missing gamelog path should not become configured');
assert.strictEqual(statusSnapshots.at(-1).operational.watcher.state, 'unavailable', 'missing path should emit renderer-facing watcher status');

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-sense-runtime-'));
try {
  const folder = path.join(tempRoot, 'Gamelogs');
  fs.mkdirSync(folder, { recursive: true });
  const logPath = path.join(folder, '20260522_010101_123.txt');
  fs.writeFileSync(logPath, '[ 2026.05.22 01:01:01 ] (None) Jumping from Old to Seeded\n');

  const configured = runtime.configure({ gamelogFolder: folder });
  assert.strictEqual(configured.configuredPath, folder, 'valid gamelog path should configure runtime');
  assert.strictEqual(configured.watcher.state, 'unavailable', 'configured watcher should remain unavailable until started');
  assert.strictEqual(statusSnapshots.at(-1).operational.watcher.message, 'EVE gamelog folder configured; watcher is stopped', 'configure should emit status-only snapshot');

  const started = runtime.start();
  assert.strictEqual(started.watcher.state, 'watching', 'runtime should start watcher from configured path');
  assert.strictEqual(started.watcher.path, folder, 'runtime should report watched path');
  assert.strictEqual(statusSnapshots.at(-1).operational.watcher.state, 'watching', 'watcher start should emit status-only snapshot');

  fs.appendFileSync(logPath, '[ 2026.05.22 01:01:02 ] (combat) Mining Drone misses you completely\n');
  runtime.watcher.handleFile(logPath);
  const snapshot = runtime.snapshot();
  assert.strictEqual(snapshot.operational.watcher.state, 'watching', 'snapshot should include watcher state');
  assert.strictEqual(snapshot.eventStream.length, 1, 'watcher events should feed Combat Witness snapshot stream');

  const stopped = runtime.stop();
  assert.strictEqual(stopped.watcher.state, 'unavailable', 'stopped watcher should report unavailable');
  assert.strictEqual(statusSnapshots.at(-1).operational.watcher.state, 'unavailable', 'watcher stop should emit status-only snapshot');
  assert.strictEqual(statusSnapshots.at(-1).eventStream.length, 1, 'status-only snapshot should preserve backend event stream without requiring a new event');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log('combat witness runtime verified');
