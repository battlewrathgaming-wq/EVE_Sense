const assert = require('node:assert');
const { createPassiveTelemetryService } = require('../src/passive/passiveTelemetryService');
const { normalizeZKillSystemContext } = require('../src/passive/zKillSystemContextClient');

const normalized = normalizeZKillSystemContext([
  { killmail_id: 1001, zkb: { hash: 'abc' } },
  { killmail_id: null, zkb: {} },
  { killmail_id: 1002, zkb: { hash: 'def' } }
], {
  systemId: 30000142,
  fetchedAt: '2026-05-22T01:00:00.000Z',
  limit: 2
});
assert.strictEqual(normalized.sampleCount, 1, 'zKill normalization should keep valid refs only');
assert.strictEqual(normalized.capped, true, 'zKill normalization should report capped samples');
assert.strictEqual(normalized.partial, true, 'zKill normalization should report malformed refs as partial');

let fetchCount = 0;
let nowMs = Date.parse('2026-05-22T01:00:00.000Z');
const snapshots = [];
const service = createPassiveTelemetryService({
  now: () => nowMs,
  freshnessMs: 60000,
  resolveSystem: (systemName) => ({
    systemName,
    systemId: systemName === 'Jita' ? 30000142 : null,
    resolved: systemName === 'Jita'
  }),
  zkillClient: {
    fetchSystemContext: async (systemId, options = {}) => {
      fetchCount += 1;
      return normalizeZKillSystemContext([
        { killmail_id: 2001, zkb: { hash: 'fresh-hash' } }
      ], {
        systemId,
        fetchedAt: options.fetchedAt,
        limit: 10
      });
    }
  }
});
service.subscribeSnapshots((snapshot) => snapshots.push(snapshot));

assert.strictEqual(service.snapshot().status, 'unavailable', 'initial passive snapshot should be unavailable');
assert.strictEqual(service.snapshot().freshness.status, 'unavailable', 'initial passive freshness should be unavailable');

;(async () => {
  await service.observeEvent({
    id: 'jump-1',
    kind: 'navigation.jump',
    fromSystemName: 'Perimeter',
    systemName: 'Jita',
    eventTime: '2026-05-22T01:00:00.000Z',
    observedAt: '2026-05-22T01:00:00.000Z'
  });
  const snapshot = service.snapshot();
  assert.strictEqual(snapshot.currentSystem.label, 'Jita', 'passive telemetry should track current system');
  assert.strictEqual(snapshot.status, 'fresh', 'resolved system context should become fresh');
  assert.strictEqual(snapshot.zkill.sampleCount, 1, 'passive telemetry should expose zKill sample count');
  assert.ok(snapshots.some((entry) => entry.status === 'fresh'), 'passive telemetry should emit snapshots');

  await service.refresh();
  assert.strictEqual(fetchCount, 1, 'fresh cache should avoid repeated fetches');

  nowMs += 120000;
  assert.strictEqual(service.snapshot().status, 'stale', 'expired cache should report stale');

  await service.observeEvent({
    id: 'jump-2',
    kind: 'navigation.jump',
    fromSystemName: 'Jita',
    systemName: 'Unresolved',
    eventTime: '2026-05-22T01:02:00.000Z',
    observedAt: '2026-05-22T01:02:00.000Z'
  });
  assert.strictEqual(service.snapshot().status, 'degraded', 'unresolved systems should become degraded');

  let partialNowMs = Date.parse('2026-05-22T02:00:00.000Z');
  const partialService = createPassiveTelemetryService({
    now: () => partialNowMs,
    freshnessMs: 60000,
    resolveSystem: () => ({ systemId: 30000142, resolved: true }),
    zkillClient: {
      fetchSystemContext: async (systemId, options = {}) => normalizeZKillSystemContext([
        { killmail_id: 3001, zkb: { hash: 'partial-hash' } },
        { killmail_id: null, zkb: {} }
      ], {
        systemId,
        fetchedAt: options.fetchedAt,
        limit: 10
      })
    }
  });
  await partialService.observeEvent({
    id: 'jump-3',
    kind: 'navigation.jump',
    systemName: 'Jita',
    eventTime: '2026-05-22T02:00:00.000Z',
    observedAt: '2026-05-22T02:00:00.000Z'
  });
  assert.strictEqual(partialService.snapshot().status, 'partial', 'malformed refs should produce partial state while fresh');
  assert.strictEqual(partialService.snapshot().zkill.partial, true, 'partial metadata should remain visible');
  partialNowMs += 120000;
  assert.strictEqual(partialService.snapshot().status, 'stale', 'expired partial context should become stale');
  assert.strictEqual(partialService.snapshot().zkill.partial, true, 'expired partial context should preserve partial metadata');
  assert.match(partialService.snapshot().message, /Partial passive system context is stale/, 'expired partial context should explain stale partial state');

  const failedService = createPassiveTelemetryService({
    now: () => Date.parse('2026-05-22T03:00:00.000Z'),
    resolveSystem: () => ({ systemId: 30000142, resolved: true }),
    zkillClient: {
      fetchSystemContext: async () => {
        const error = new Error('synthetic zKill failure');
        error.code = 'SYNTHETIC_ZKILL_FAILURE';
        throw error;
      }
    }
  });
  await failedService.observeEvent({
    id: 'jump-4',
    kind: 'navigation.jump',
    systemName: 'Jita',
    eventTime: '2026-05-22T03:00:00.000Z',
    observedAt: '2026-05-22T03:00:00.000Z'
  });
  assert.strictEqual(failedService.snapshot().status, 'degraded', 'failed fetch should become degraded');
  assert.strictEqual(failedService.snapshot().failure.code, 'SYNTHETIC_ZKILL_FAILURE', 'failed fetch should preserve failure code');

  console.log('passive telemetry verified');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
