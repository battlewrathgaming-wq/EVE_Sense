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

  const gamelogFolder = path.join(tempRoot, 'EVE', 'logs', 'Gamelogs');
  fs.mkdirSync(gamelogFolder, { recursive: true });
  const saved = settings.save({ gamelogFolder });
  assert.strictEqual(saved.status, 'ready', 'valid runtime settings should save as ready');
  assert.strictEqual(saved.settings.gamelogFolder, gamelogFolder, 'saved settings should retain validated gamelog path');

  const reloaded = createRuntimeSettingsService({ settingsPath, now: () => '2026-05-22T00:00:01.000Z' });
  assert.strictEqual(reloaded.load().settings.gamelogFolder, gamelogFolder, 'settings should survive reload');

  fs.writeFileSync(settingsPath, '{not valid json', 'utf8');
  const corrupted = createRuntimeSettingsService({ settingsPath, now: () => '2026-05-22T00:00:01.500Z' }).load();
  assert.strictEqual(corrupted.status, 'degraded', 'corrupted runtime settings JSON should degrade visibly');
  assert.strictEqual(corrupted.failure.code, 'SETTINGS_READ_FAILED', 'corrupted runtime settings should expose read failure code');

  fs.writeFileSync(settingsPath, JSON.stringify({ schemaVersion: 999, settings: [] }), 'utf8');
  const schemaDrift = createRuntimeSettingsService({ settingsPath, now: () => '2026-05-22T00:00:01.750Z' }).load();
  assert.strictEqual(schemaDrift.status, 'degraded', 'schema drift with invalid settings payload should degrade visibly');
  assert.strictEqual(schemaDrift.failure.code, 'SETTINGS_INVALID_PAYLOAD', 'schema drift should expose validation code');

  fs.rmSync(gamelogFolder, { recursive: true, force: true });
  fs.writeFileSync(settingsPath, JSON.stringify({ schemaVersion: 1, settings: { gamelogFolder } }), 'utf8');
  const invalid = createRuntimeSettingsService({ settingsPath, now: () => '2026-05-22T00:00:02.000Z' }).load();
  assert.strictEqual(invalid.status, 'degraded', 'missing persisted gamelog path should degrade visibly');
  assert.strictEqual(invalid.failure.code, 'SETTINGS_LOG_PATH_MISSING', 'degraded settings should expose validation code');

  const directorySettings = createRuntimeSettingsService({
    settingsPath: tempRoot,
    now: () => '2026-05-22T00:00:02.500Z'
  });
  const writeFailure = directorySettings.save({ userAgent: 'AURA-Sense test agent' });
  assert.strictEqual(writeFailure.status, 'degraded', 'permission-like settings write failure should degrade visibly');
  assert.strictEqual(writeFailure.failure.code, 'SETTINGS_WRITE_FAILED', 'settings write failure should expose write failure code');

  const diagnostics = createRuntimeDiagnosticsService({ limit: 2, now: () => '2026-05-22T00:00:03.000Z' });
  diagnostics.record('poll_tick', { path: 'quiet' });
  assert.strictEqual(diagnostics.snapshot().count, 0, 'low-value diagnostics should be suppressed');
  diagnostics.record('line_rejected', { rawLine: 'private raw line', rawLineHash: 'abc123', reason: 'parser_error' });
  diagnostics.record('http_request_error', { responseContent: 'private response body', code: 'HTTP_500' });
  diagnostics.record('status', { state: 'error', message: 'watcher failed' });
  const snapshot = diagnostics.snapshot();
  assert.strictEqual(snapshot.count, 2, 'diagnostics should enforce configured record limit');
  assert.strictEqual(snapshot.records[1].payload.responseContent, '[redacted]', 'raw diagnostic content should be redacted');
  assert.strictEqual(diagnostics.snapshot().records.some((record) => record.payload.rawLineHash === 'abc123'), false, 'old diagnostics should drop beyond limit');

  console.log('runtime control verified');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
