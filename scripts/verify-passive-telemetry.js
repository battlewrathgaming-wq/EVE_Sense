const assert = require('node:assert');
const { PassiveEsiSystemActivityClient, normalizeEsiSystemActivity } = require('../src/passive/esiSystemActivityClient');
const { createLiveIoGate } = require('../src/passive/liveIoGate');
const { createLocalSystemResolver } = require('../src/passive/localSystemResolver');
const { createPassiveTelemetryService } = require('../src/passive/passiveTelemetryService');
const { ZKillSystemContextClient, normalizeZKillSystemContext } = require('../src/passive/zKillSystemContextClient');

;(async () => {
const resolver = createLocalSystemResolver({
  systems: [{ systemName: 'Jita', systemId: 30000142 }]
});
assert.deepStrictEqual(
  resolver('Jita'),
  { systemName: 'Jita', systemId: 30000142, resolved: true, source: 'local-static' },
  'local resolver should resolve exact system names'
);
assert.strictEqual(resolver('jita').resolved, false, 'local resolver should not guess case-mismatched names');

let zkillEndpoint = null;
const routeClient = new ZKillSystemContextClient({
  pastSeconds: 1800,
  httpClient: {
    json: async (_provider, endpoint) => {
      zkillEndpoint = endpoint;
      return [{ killmail_id: 42, zkb: { hash: 'route-hash' } }];
    }
  }
});
const routeContext = await routeClient.fetchSystemContext(30000142, { fetchedAt: '2026-05-22T00:00:00.000Z' });
assert.ok(zkillEndpoint.endsWith('/systemID/30000142/pastSeconds/1800/'), 'zKill route should include pastSeconds');
assert.strictEqual(routeContext.pastSeconds, 1800, 'zKill context should expose pastSeconds');

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
  liveIoGate: createLiveIoGate({ enabled: true }),
  resolveSystem: (systemName) => ({
    systemName,
    systemId: systemName === 'Jita' ? 30000142 : null,
    resolved: systemName === 'Jita'
  }),
  esiActivityClient: {
    fetchSystemActivity: async (systemId, options = {}) => normalizeEsiSystemActivity({
      systemId,
      fetchedAt: options.fetchedAt,
      kills: [{ system_id: systemId, ship_kills: 3, pod_kills: 1, npc_kills: 9 }],
      jumps: [{ system_id: systemId, ship_jumps: 21 }]
    })
  },
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
  assert.strictEqual(snapshot.activity.shipKills, 3, 'passive telemetry should expose ESI ship kills');
  assert.strictEqual(snapshot.activity.jumps, 21, 'passive telemetry should expose ESI jumps');
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
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveSystem: () => ({ systemId: 30000142, resolved: true }),
    esiActivityClient: {
      fetchSystemActivity: async (systemId, options = {}) => normalizeEsiSystemActivity({
        systemId,
        fetchedAt: options.fetchedAt,
        kills: [{ system_id: systemId }],
        jumps: [{ system_id: systemId }]
      })
    },
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
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveSystem: () => ({ systemId: 30000142, resolved: true }),
    esiActivityClient: {
      fetchSystemActivity: async (systemId, options = {}) => normalizeEsiSystemActivity({
        systemId,
        fetchedAt: options.fetchedAt,
        kills: [],
        jumps: []
      })
    },
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

  let blockedZkillCalls = 0;
  let blockedEsiCalls = 0;
  const blockedService = createPassiveTelemetryService({
    now: () => Date.parse('2026-05-22T04:00:00.000Z'),
    liveIoGate: createLiveIoGate({ enabled: false }),
    resolveSystem: () => ({ systemId: 30000142, resolved: true }),
    esiActivityClient: {
      fetchSystemActivity: async () => {
        blockedEsiCalls += 1;
      }
    },
    zkillClient: {
      fetchSystemContext: async () => {
        blockedZkillCalls += 1;
      }
    }
  });
  await blockedService.observeEvent({
    id: 'jump-5',
    kind: 'navigation.jump',
    systemName: 'Jita',
    eventTime: '2026-05-22T04:00:00.000Z',
    observedAt: '2026-05-22T04:00:00.000Z'
  });
  assert.strictEqual(blockedService.snapshot().status, 'blocked', 'disabled live IO should report blocked');
  assert.strictEqual(blockedService.snapshot().failure.code, 'PASSIVE_LIVE_IO_BLOCKED', 'blocked snapshot should expose blocked code');
  assert.strictEqual(blockedZkillCalls, 0, 'blocked live IO should not call zKill');
  assert.strictEqual(blockedEsiCalls, 0, 'blocked live IO should not call ESI');

  let activityCalls = 0;
  let activityNowMs = Date.parse('2026-05-22T05:00:00.000Z');
  const activityClient = new PassiveEsiSystemActivityClient({
    now: () => activityNowMs,
    httpClient: {
      jsonWithMeta: async (_provider, endpoint, options = {}) => {
        activityCalls += 1;
        if (options.headers?.['If-None-Match']) {
          return { data: null, statusCode: 304, etag: options.headers['If-None-Match'] };
        }
        if (endpoint.includes('system_kills')) {
          return {
            data: [{ system_id: 30000142, ship_kills: 5, pod_kills: 2, npc_kills: 11 }],
            statusCode: 200,
            etag: '"activity-etag"'
          };
        }
        return {
          data: [{ system_id: 30000142, ship_jumps: 34 }],
          statusCode: 200,
          etag: '"activity-etag"'
        };
      }
    }
  });
  const activityA = await activityClient.fetchSystemActivity(30000142, { fetchedAt: '2026-05-22T05:00:00.000Z' });
  assert.strictEqual(activityA.shipKills, 5, 'ESI activity should normalize ship kills');
  assert.strictEqual(activityA.jumps, 34, 'ESI activity should normalize jumps');
  assert.strictEqual(activityA.cache.etag, '"activity-etag"', 'ESI activity should retain ETag');
  const activityB = await activityClient.fetchSystemActivity(30000142);
  assert.strictEqual(activityB.cache.state, 'fresh', 'fresh ESI activity cache should be reused');
  assert.strictEqual(activityCalls, 2, 'fresh ESI activity cache should avoid second request pair');
  activityNowMs += 2 * 60 * 60 * 1000;
  const activityC = await activityClient.fetchSystemActivity(30000142);
  assert.strictEqual(activityC.cache.state, 'revalidated', 'expired ESI activity cache should revalidate with ETag');
  assert.strictEqual(activityCalls, 4, 'expired ESI activity cache should perform conditional request pair');

  let gateNowMs = Date.parse('2026-05-22T06:00:00.000Z');
  let gateEsiCalls = 0;
  let gateZkillCalls = 0;
  const gateEsiClient = new PassiveEsiSystemActivityClient({
    now: () => gateNowMs,
    httpClient: {
      jsonWithMeta: async (_provider, endpoint, options = {}) => {
        gateEsiCalls += 1;
        if (options.headers?.['If-None-Match']) {
          return { data: null, statusCode: 304, etag: options.headers['If-None-Match'] };
        }
        if (endpoint.includes('system_kills')) {
          return {
            data: [{ system_id: 30000142, ship_kills: 8, pod_kills: 1, npc_kills: 22 }],
            statusCode: 200,
            etag: '"gate-etag"'
          };
        }
        return {
          data: [{ system_id: 30000142, ship_jumps: 55 }],
          statusCode: 200,
          etag: '"gate-etag"'
        };
      }
    }
  });
  const gateService = createPassiveTelemetryService({
    now: () => gateNowMs,
    freshnessMs: 60000,
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveSystem: resolver,
    esiActivityClient: gateEsiClient,
    zkillClient: {
      fetchSystemContext: async (systemId, options = {}) => {
        gateZkillCalls += 1;
        return normalizeZKillSystemContext([{ killmail_id: 4001, zkb: { hash: 'gate-hash' } }], {
          systemId,
          fetchedAt: options.fetchedAt,
          pastSeconds: 3600
        });
      }
    }
  });
  await gateService.observeEvent({
    id: 'jump-6',
    kind: 'navigation.jump',
    fromSystemName: 'Perimeter',
    systemName: 'Jita',
    eventTime: '2026-05-22T06:00:00.000Z',
    observedAt: '2026-05-22T06:00:00.000Z'
  });
  assert.strictEqual(gateService.snapshot().currentSystem.systemId, 30000142, 'jump-gate path should resolve system locally');
  assert.strictEqual(gateService.snapshot().activity.shipKills, 8, 'jump-gate path should expose ESI activity');
  assert.strictEqual(gateService.snapshot().activity.cache.etag, '"gate-etag"', 'jump-gate path should retain ESI ETag');
  assert.strictEqual(gateEsiCalls, 2, 'jump-gate path should fetch ESI kills and jumps once');
  await gateService.refresh();
  assert.strictEqual(gateService.snapshot().activity.cache.state, 'fresh', 'manual refresh should read fresh ESI activity locally');
  assert.strictEqual(gateEsiCalls, 2, 'fresh ESI activity record should avoid another API read');
  gateNowMs += 2 * 60 * 60 * 1000;
  await gateService.refresh();
  assert.strictEqual(gateService.snapshot().activity.cache.state, 'revalidated', 'expired ESI activity record should revalidate with ETag');
  assert.strictEqual(gateEsiCalls, 4, 'expired ESI activity record should issue conditional kills and jumps reads');
  assert.strictEqual(gateZkillCalls, 2, 'zKill should refresh only when passive context freshness expires');

  console.log('passive telemetry verified');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
