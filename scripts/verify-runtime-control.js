const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createRuntimeDiagnosticsService } = require('../src/runtime/runtimeDiagnosticsService');
const { createRuntimeSettingsService } = require('../src/runtime/runtimeSettingsService');

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-runtime-control-'));

try {
  const settingsPath = path.join(tempRoot, 'runtime-settings.json');
  const settings = createRuntimeSettingsService({ settingsPath, now: () => '2026-05-22T00:00:00.000Z' });
  assert.strictEqual(settings.load().status, 'missing', 'missing runtime settings should be explicit');

  const gamelogFolder = path.join(tempRoot, 'Gamelogs');
  fs.mkdirSync(gamelogFolder);
  const saved = settings.save({ gamelogFolder });
  assert.strictEqual(saved.status, 'ready', 'valid runtime settings should save as ready');
  assert.strictEqual(saved.settings.gamelogFolder, gamelogFolder, 'saved settings should retain validated gamelog path');

  const reloaded = createRuntimeSettingsService({ settingsPath, now: () => '2026-05-22T00:00:01.000Z' });
  assert.strictEqual(reloaded.load().settings.gamelogFolder, gamelogFolder, 'settings should survive reload');

  fs.rmSync(gamelogFolder, { recursive: true, force: true });
  const invalid = createRuntimeSettingsService({ settingsPath, now: () => '2026-05-22T00:00:02.000Z' }).load();
  assert.strictEqual(invalid.status, 'degraded', 'missing persisted gamelog path should degrade visibly');
  assert.strictEqual(invalid.failure.code, 'SETTINGS_LOG_PATH_MISSING', 'degraded settings should expose validation code');

  const diagnostics = createRuntimeDiagnosticsService({ now: () => '2026-05-22T00:00:03.000Z' });
  diagnostics.record('poll_tick', { path: 'quiet' });
  assert.strictEqual(diagnostics.snapshot().count, 0, 'low-value diagnostics should be suppressed');
  diagnostics.record('line_rejected', { rawLine: 'private raw line', rawLineHash: 'abc123', reason: 'parser_error' });
  const snapshot = diagnostics.snapshot();
  assert.strictEqual(snapshot.count, 1, 'high-value diagnostics should be retained');
  assert.strictEqual(snapshot.records[0].payload.rawLine, '[redacted]', 'raw diagnostic text should be redacted');
  assert.strictEqual(snapshot.records[0].payload.rawLineHash, 'abc123', 'hash diagnostic evidence should remain');

  console.log('runtime control verified');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
