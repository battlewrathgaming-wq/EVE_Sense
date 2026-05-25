const assert = require('node:assert');
const { HttpClient } = require('../src/services/httpClient');
const { createLiveIoGate } = require('../src/passive/liveIoGate');
const { PassiveEsiSystemActivityClient, normalizeEsiSystemActivity } = require('../src/passive/esiSystemActivityClient');
const { createPassiveTelemetryService } = require('../src/passive/passiveTelemetryService');
const { normalizeZKillSystemContext } = require('../src/passive/zKillSystemContextClient');
const { createThreatIntelService } = require('../src/threat/threatIntelService');
const { normalizeThreatZkillRefs, ThreatIntelZkillClient } = require('../src/threat/threatIntelZkillClient');

const JITA = { systemName: 'Jita', systemId: 30000142, resolved: true, source: 'fixture' };
const THREAT_TARGET = {
  status: 'resolved',
  kind: 'system',
  id: 30000142,
  label: 'Jita',
  source: 'fixture'
};

async function main() {
  await verifyPassiveZkillFault();
  await verifyPassiveEsiFault();
  await verifyPassiveMalformedProviderData();
  await verifyPassiveEtagRevalidationFault();
  await verifyThreatHttpFaults();
  await verifyThreatMalformedProviderData();
  await verifyLiveIoBlockedSplit();
  console.log('provider fault injection verified');
}

async function verifyPassiveZkillFault() {
  const service = passiveService({
    nowMs: Date.parse('2026-05-25T08:00:00.000Z'),
    esiActivityClient: {
      fetchSystemActivity: async (systemId, options = {}) => activityRecord(systemId, options.fetchedAt)
    },
    zkillClient: {
      fetchSystemContext: async () => {
        throw codedError('SYNTHETIC_ZKILL_TIMEOUT', 'synthetic zKill timeout');
      }
    }
  });

  const snapshot = await observeJita(service, 'passive-zkill-fault');
  assert.strictEqual(snapshot.status, 'degraded', 'Passive zKill fault should degrade the snapshot');
  assert.strictEqual(snapshot.failure.code, 'SYNTHETIC_ZKILL_TIMEOUT', 'Passive zKill failure code should be preserved');
  assert.match(snapshot.failure.message, /zKill timeout/, 'Passive zKill failure message should be preserved');
  assert.notStrictEqual(snapshot.status, 'blocked', 'Passive zKill provider fault must not be live IO blocked');
}

async function verifyPassiveEsiFault() {
  const service = passiveService({
    nowMs: Date.parse('2026-05-25T08:10:00.000Z'),
    esiActivityClient: {
      fetchSystemActivity: async () => {
        throw codedError('SYNTHETIC_ESI_500', 'synthetic ESI 500');
      }
    },
    zkillClient: {
      fetchSystemContext: async (systemId, options = {}) => zkillRecord(systemId, options.fetchedAt)
    }
  });

  const snapshot = await observeJita(service, 'passive-esi-fault');
  assert.strictEqual(snapshot.status, 'degraded', 'Passive ESI fault should degrade the snapshot');
  assert.strictEqual(snapshot.failure.code, 'SYNTHETIC_ESI_500', 'Passive ESI failure code should be preserved');
  assert.match(snapshot.failure.message, /ESI 500/, 'Passive ESI failure message should be preserved');
  assert.notStrictEqual(snapshot.status, 'blocked', 'Passive ESI provider fault must not be live IO blocked');
}

async function verifyPassiveMalformedProviderData() {
  const service = passiveService({
    nowMs: Date.parse('2026-05-25T08:20:00.000Z'),
    esiActivityClient: {
      fetchSystemActivity: async (systemId, options = {}) => normalizeEsiSystemActivity({
        systemId,
        fetchedAt: options.fetchedAt,
        kills: { malformed: true },
        jumps: [{ system_id: systemId, ship_jumps: 12 }]
      })
    },
    zkillClient: {
      fetchSystemContext: async (systemId, options = {}) => normalizeZKillSystemContext({ malformed: true }, {
        systemId,
        fetchedAt: options.fetchedAt,
        pastSeconds: 3600
      })
    }
  });

  const snapshot = await observeJita(service, 'passive-malformed');
  assert.strictEqual(snapshot.status, 'partial', 'Passive malformed provider data should become partial');
  assert.notStrictEqual(snapshot.status, 'fresh', 'Passive malformed provider data must not become fresh');
  assert.strictEqual(snapshot.zkill.partial, true, 'Passive malformed zKill response should remain visible');
  assert.strictEqual(snapshot.zkill.failureCount, 1, 'Passive malformed zKill response should preserve failure count');
  assert.strictEqual(snapshot.activity.partial, true, 'Passive malformed ESI response should remain visible');
  assert.strictEqual(snapshot.activity.failureCount, 1, 'Passive malformed ESI response should preserve failure count');
  assert.strictEqual(snapshot.failure, null, 'Passive partial provider data should not be collapsed into a failed fetch');
}

async function verifyPassiveEtagRevalidationFault() {
  let nowMs = Date.parse('2026-05-25T08:30:00.000Z');
  let conditionalSeen = false;
  const esiClient = new PassiveEsiSystemActivityClient({
    now: () => nowMs,
    httpClient: {
      jsonWithMeta: async (_provider, endpoint, options = {}) => {
        if (options.headers?.['If-None-Match']) {
          conditionalSeen = true;
          if (endpoint.includes('system_jumps')) {
            throw codedError('ESI_REVALIDATION_FAILED', 'synthetic ESI ETag revalidation failure');
          }
          return { data: null, statusCode: 304, etag: options.headers['If-None-Match'] };
        }
        if (endpoint.includes('system_kills')) {
          return {
            data: [{ system_id: JITA.systemId, ship_kills: 7, pod_kills: 1, npc_kills: 20 }],
            statusCode: 200,
            etag: '"provider-fault-etag"'
          };
        }
        return {
          data: [{ system_id: JITA.systemId, ship_jumps: 44 }],
          statusCode: 200,
          etag: '"provider-fault-etag"'
        };
      }
    }
  });
  const service = createPassiveTelemetryService({
    now: () => nowMs,
    freshnessMs: 60000,
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveSystem: () => JITA,
    esiActivityClient: esiClient,
    zkillClient: {
      fetchSystemContext: async (systemId, options = {}) => zkillRecord(systemId, options.fetchedAt)
    }
  });

  const first = await observeJita(service, 'passive-etag-a');
  assert.strictEqual(first.status, 'fresh', 'Passive ETag setup should start fresh');
  assert.strictEqual(first.activity.cache.etag, '"provider-fault-etag"', 'Passive ETag setup should retain cache validator');

  nowMs += 2 * 60 * 60 * 1000;
  const degraded = await observeJita(service, 'passive-etag-b');
  assert.strictEqual(conditionalSeen, true, 'Passive stale ESI cache should attempt ETag revalidation');
  assert.strictEqual(degraded.status, 'degraded', 'Passive ETag revalidation fault should be visible in snapshot status');
  assert.strictEqual(degraded.failure.code, 'ESI_REVALIDATION_FAILED', 'Passive ETag revalidation fault should preserve failure code');
  assert.match(degraded.failure.message, /ETag revalidation failure/, 'Passive ETag revalidation fault should preserve failure message');
}

async function verifyThreatHttpFaults() {
  await assertThreatHttpFailure({
    label: 'timeout',
    expectedCode: 'HTTP_TIMEOUT',
    fetchImpl: neverFetch,
    timeoutMs: 10
  });
  await assertThreatHttpFailure({
    label: '429',
    expectedCode: 'THREAT_INTEL_SCAN_FAILED',
    expectedMessage: /zkill 429/,
    fetchImpl: statusFetch(429, '')
  });
  await assertThreatHttpFailure({
    label: '500',
    expectedCode: 'THREAT_INTEL_SCAN_FAILED',
    expectedMessage: /zkill 500/,
    fetchImpl: statusFetch(500, '')
  });
  await assertThreatHttpFailure({
    label: 'invalid-json',
    expectedCode: 'HTTP_INVALID_JSON',
    expectedMessage: /invalid JSON/,
    fetchImpl: statusFetch(200, '{not json')
  });
}

async function verifyThreatMalformedProviderData() {
  const service = createThreatIntelService({
    now: () => Date.parse('2026-05-25T09:00:00.000Z'),
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveTarget: () => THREAT_TARGET,
    zkillClient: {
      fetchTargetRefs: async (_target, options = {}) => normalizeThreatZkillRefs([
        { killmail_id: null, zkb: {} },
        { killmail_id: 9001, zkb: { hash: 'valid-threat-ref' } }
      ], {
        target: THREAT_TARGET,
        fetchedAt: options.fetchedAt,
        endpointFamily: 'systemID',
        lookbackSeconds: options.lookbackSeconds,
        sampleLimit: options.sampleLimit
      })
    }
  });

  const snapshot = await service.scan({ targetText: 'system:Jita', inputSource: 'search' });
  assert.strictEqual(snapshot.status, 'partial', 'Threat malformed provider data should become partial');
  assert.notStrictEqual(snapshot.status, 'succeeded', 'Threat malformed provider data must not become succeeded');
  assert.strictEqual(snapshot.zkill.partial, true, 'Threat malformed provider data should expose partial flag');
  assert.strictEqual(snapshot.zkill.malformedCount, 1, 'Threat malformed provider data should preserve malformed count');
  assert.strictEqual(snapshot.failure.code, 'ZKILL_REF_MALFORMED', 'Threat malformed provider data should preserve bounded failure code');
}

async function verifyLiveIoBlockedSplit() {
  let passiveZkillCalls = 0;
  let passiveEsiCalls = 0;
  const passive = passiveService({
    nowMs: Date.parse('2026-05-25T09:10:00.000Z'),
    liveIoGate: createLiveIoGate({ enabled: false }),
    esiActivityClient: {
      fetchSystemActivity: async () => {
        passiveEsiCalls += 1;
      }
    },
    zkillClient: {
      fetchSystemContext: async () => {
        passiveZkillCalls += 1;
      }
    }
  });
  const passiveSnapshot = await observeJita(passive, 'passive-blocked');
  assert.strictEqual(passiveSnapshot.status, 'blocked', 'Passive disabled live IO should remain blocked');
  assert.strictEqual(passiveSnapshot.failure.code, 'PASSIVE_LIVE_IO_BLOCKED', 'Passive blocked state should keep lane gate code');
  assert.strictEqual(passiveEsiCalls, 0, 'Passive blocked live IO should not call ESI');
  assert.strictEqual(passiveZkillCalls, 0, 'Passive blocked live IO should not call zKill');

  let threatCalls = 0;
  const threat = createThreatIntelService({
    now: () => Date.parse('2026-05-25T09:20:00.000Z'),
    liveIoGate: createLiveIoGate({
      enabled: false,
      reason: 'Threat Intel live IO is disabled',
      blockedCode: 'THREAT_LIVE_IO_BLOCKED'
    }),
    resolveTarget: () => THREAT_TARGET,
    zkillClient: {
      fetchTargetRefs: async () => {
        threatCalls += 1;
      }
    }
  });
  const threatSnapshot = await threat.scan({ targetText: 'system:Jita', inputSource: 'search' });
  assert.strictEqual(threatSnapshot.status, 'blocked', 'Threat disabled live IO should remain blocked');
  assert.strictEqual(threatSnapshot.failure.code, 'THREAT_LIVE_IO_BLOCKED', 'Threat blocked state should keep lane gate code');
  assert.strictEqual(threatCalls, 0, 'Threat blocked live IO should not call zKill');
  assert.notStrictEqual(threatSnapshot.status, 'failed', 'Threat blocked state must not be provider failure');
}

async function assertThreatHttpFailure({ label, expectedCode, expectedMessage = null, fetchImpl, timeoutMs = 1000 }) {
  const client = new ThreatIntelZkillClient({
    httpClient: new HttpClient({
      fetchImpl,
      maxAttempts: 1,
      timeoutMs
    })
  });
  const service = createThreatIntelService({
    now: () => Date.parse('2026-05-25T08:50:00.000Z'),
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveTarget: () => THREAT_TARGET,
    zkillClient: client
  });
  const snapshot = await service.scan({ targetText: 'system:Jita', inputSource: 'search' });
  assert.strictEqual(snapshot.status, 'failed', `Threat ${label} fault should fail the scan`);
  assert.strictEqual(snapshot.failure.code, expectedCode, `Threat ${label} fault should preserve bounded code`);
  if (expectedMessage) {
    assert.match(snapshot.failure.message, expectedMessage, `Threat ${label} fault should preserve bounded message`);
  }
  assert.notStrictEqual(snapshot.status, 'blocked', `Threat ${label} provider fault must not be live IO blocked`);
  assert.strictEqual(snapshot.zkill, null, `Threat ${label} provider fault should not publish successful zKill refs`);
}

function passiveService({ nowMs, liveIoGate = createLiveIoGate({ enabled: true }), esiActivityClient, zkillClient }) {
  return createPassiveTelemetryService({
    now: () => nowMs,
    freshnessMs: 60000,
    liveIoGate,
    resolveSystem: () => JITA,
    esiActivityClient,
    zkillClient
  });
}

async function observeJita(service, id) {
  return service.observeEvent({
    id,
    kind: 'navigation.jump',
    fromSystemName: 'Perimeter',
    systemName: JITA.systemName,
    eventTime: '2026-05-25T08:00:00.000Z',
    observedAt: '2026-05-25T08:00:00.000Z'
  });
}

function activityRecord(systemId, fetchedAt) {
  return normalizeEsiSystemActivity({
    systemId,
    fetchedAt,
    kills: [{ system_id: systemId, ship_kills: 4, pod_kills: 0, npc_kills: 11 }],
    jumps: [{ system_id: systemId, ship_jumps: 31 }]
  });
}

function zkillRecord(systemId, fetchedAt) {
  return normalizeZKillSystemContext([
    { killmail_id: 8001, zkb: { hash: 'provider-fault-ref' } }
  ], {
    systemId,
    fetchedAt,
    pastSeconds: 3600
  });
}

function statusFetch(status, body) {
  return async () => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
    text: async () => body
  });
}

function neverFetch(_endpoint, options = {}) {
  return new Promise((_resolve, reject) => {
    if (options.signal?.aborted) {
      reject(abortError());
      return;
    }
    options.signal?.addEventListener('abort', () => reject(abortError()), { once: true });
  });
}

function abortError() {
  const error = new Error('aborted');
  error.name = 'AbortError';
  return error;
}

function codedError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
