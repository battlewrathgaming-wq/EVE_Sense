const assert = require('node:assert');
const { EveGamelogWatcher } = require('../src/combat/eveGamelogWatcher');
const { CombatWitnessService } = require('../src/combat/combatWitnessService');
const { HttpClient } = require('../src/services/httpClient');
const {
  createDiagnosticsPolicy,
  diagnosticPriority,
  httpDiagnosticEvent
} = require('../src/services/diagnosticsPolicy');

async function main() {
  verifyPolicyPriorities();
  verifyTraceFiltering();
  await verifyHttpFiltering();
  console.log('diagnostics policy verified');
}

function verifyPolicyPriorities() {
  assert.strictEqual(diagnosticPriority('poll_tick'), 'low', 'poll ticks should be low value by default');
  assert.strictEqual(diagnosticPriority('tail_read'), 'low', 'routine tail reads should be low value by default');
  assert.strictEqual(diagnosticPriority('duplicate_suppressed'), 'low', 'duplicate suppression should be low value by default');
  assert.strictEqual(diagnosticPriority('listener_error'), 'high', 'listener errors should remain high value');
  assert.strictEqual(diagnosticPriority('watcher_strategy_fallback'), 'high', 'watcher fallback should remain high value');
  assert.strictEqual(diagnosticPriority('status', { state: 'error' }), 'high', 'error status should remain high value');
  assert.strictEqual(diagnosticPriority('status', { state: 'watching' }), 'medium', 'normal watching status should be throttled');
  assert.strictEqual(diagnosticPriority('line_rejected', { reason: 'unparsed' }), 'low', 'routine unparsed lines should be low value');
  assert.strictEqual(diagnosticPriority('line_rejected', { reason: 'parser_error' }), 'high', 'parser errors should remain high value');
  assert.strictEqual(httpDiagnosticEvent({ statusCode: 200 }), 'http_request_success', 'HTTP success should map to success event');
  assert.strictEqual(httpDiagnosticEvent({ rateLimited: true }), 'http_request_rate_limited', 'HTTP rate limit should map to high-value event');
}

function verifyTraceFiltering() {
  let nowMs = 0;
  const policy = createDiagnosticsPolicy({ throttleMs: 1000, now: () => nowMs });
  const watcherEvents = [];
  const watcher = new EveGamelogWatcher({
    diagnosticsPolicy: policy,
    trace: (event, payload) => watcherEvents.push({ event, payload })
  });

  watcher.trace('poll_tick', { events: 0 });
  watcher.trace('tail_read', { lines: 1 });
  watcher.trace('duplicate_suppressed', { id: 'a' });
  watcher.trace('status', { state: 'watching' });
  watcher.trace('status', { state: 'watching' });
  watcher.trace('listener_error', { message: 'listener failed' });
  watcher.trace('watcher_strategy_fallback', { to: 'polling' });

  assert.deepStrictEqual(
    watcherEvents.map((entry) => entry.event),
    ['status', 'listener_error', 'watcher_strategy_fallback'],
    'watcher diagnostics should suppress low-value chatter and preserve high-value events'
  );
  assert.strictEqual(watcherEvents[0].payload.source, 'combat.gamelog_watcher', 'watcher diagnostics should include source');

  nowMs = 1001;
  watcher.trace('status', { state: 'watching' });
  assert.strictEqual(watcherEvents.filter((entry) => entry.event === 'status').length, 2, 'normal status should emit after throttle interval');

  const verboseEvents = [];
  const verbosePolicy = createDiagnosticsPolicy({ mode: 'verbose' });
  const verboseWatcher = new EveGamelogWatcher({
    diagnosticsPolicy: verbosePolicy,
    trace: (event) => verboseEvents.push(event)
  });
  verboseWatcher.trace('poll_tick', {});
  assert.deepStrictEqual(verboseEvents, ['poll_tick'], 'verbose diagnostics should preserve low-value events');

  const serviceEvents = [];
  const service = new CombatWitnessService({
    diagnosticsPolicy: policy,
    trace: (event, payload) => serviceEvents.push({ event, payload })
  });
  service.trace('combat_snapshot_listener_error', { message: 'snapshot failed' });
  assert.strictEqual(serviceEvents[0].event, 'combat_snapshot_listener_error', 'Combat Witness high-value diagnostics should pass policy');
  assert.strictEqual(serviceEvents[0].payload.source, 'combat.witness_service', 'Combat Witness diagnostics should include source');
}

async function verifyHttpFiltering() {
  const logs = [];
  const policy = createDiagnosticsPolicy();
  const successClient = new HttpClient({
    diagnosticsPolicy: policy,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      text: async () => '{"ok":true}'
    }),
    onRequestLog: (entry) => logs.push(entry)
  });

  await successClient.json('fixture', 'https://example.invalid/success');
  assert.strictEqual(logs.length, 0, 'successful HTTP request chatter should be suppressed by default');

  const errorClient = new HttpClient({
    diagnosticsPolicy: policy,
    maxAttempts: 1,
    fetchImpl: async () => ({
      ok: false,
      status: 503,
      headers: { get: () => null },
      text: async () => ''
    }),
    onRequestLog: (entry) => logs.push(entry)
  });

  await assertRejects(
    () => errorClient.json('fixture', 'https://example.invalid/error'),
    undefined,
    'HTTP error request should reject'
  );
  assert.strictEqual(logs.length, 1, 'HTTP degraded/error request should be logged');
  assert.strictEqual(logs[0].diagnostic_event, 'http_request_error', 'HTTP error log should include diagnostic event');
}

async function assertRejects(fn, expectedCode, message) {
  try {
    await fn();
  } catch (error) {
    if (expectedCode !== undefined) {
      assert.strictEqual(error.code, expectedCode, message);
    }
    return;
  }
  throw new Error(message);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
