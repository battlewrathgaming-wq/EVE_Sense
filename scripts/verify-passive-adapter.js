const assert = require('node:assert');
const { mapPassiveTelemetryAdapter } = require('../src/passive/passiveTelemetryAdapter');

const BASE_TIME = '2026-06-01T12:00:00.000Z';

function main() {
  verifyFreshContext();
  verifyStaleContext();
  verifyPartialSample();
  verifyCappedSampleWarning();
  verifyBlockedAuthority();
  verifyDegradedResolver();
  verifyNoObservationUnavailable();
  console.log('passive adapter verified');
}

function verifyFreshContext() {
  const mapped = mapPassiveTelemetryAdapter(freshSnapshot());
  assert.strictEqual(mapped.kind, 'passive.telemetry.adapter', 'adapter kind should identify Passive adapter output');
  assert.strictEqual(mapped.lane.snapshotKind, 'passive.telemetry.snapshot', 'adapter should preserve source snapshot kind');
  assert.strictEqual(mapped.domain.currentSystem.label, 'Jita', 'adapter should preserve current system label');
  assert.strictEqual(mapped.basis.observation.source, 'admitted navigation.jump', 'adapter should preserve observation basis');
  assert.strictEqual(mapped.basis.resolver.source, 'local-static', 'adapter should preserve resolver basis');
  assert.strictEqual(mapped.basis.providers.length, 2, 'adapter should preserve zKill and ESI provider basis');
  assert.strictEqual(mapped.state.status, 'fresh', 'adapter should preserve fresh state');
  assert.strictEqual(mapped.state.authority.enabled, true, 'fresh adapter should preserve enabled authority');
  assert.strictEqual(mapped.warnings.length, 0, 'fresh fixture should not add warnings');
  assert.strictEqual(mapped.adapterPreview.stateLabel, 'Fresh context', 'adapter preview should describe fresh context');
  assertNoForbiddenSlots(mapped);
}

function verifyStaleContext() {
  const mapped = mapPassiveTelemetryAdapter({
    ...freshSnapshot(),
    status: 'stale',
    message: 'Passive system context is stale',
    freshness: { status: 'stale', cacheAgeMs: 360000, freshnessMs: 60000 }
  });
  assert.strictEqual(mapped.state.status, 'stale', 'adapter should preserve stale state');
  assert.strictEqual(mapped.state.availability, 'stale', 'adapter should keep stale distinct from unavailable');
  assertWarning(mapped, 'PASSIVE_CONTEXT_STALE');
  assert.strictEqual(mapped.adapterPreview.stateLabel, 'Stale context', 'adapter preview should preserve stale context');
}

function verifyPartialSample() {
  const mapped = mapPassiveTelemetryAdapter({
    ...freshSnapshot(),
    status: 'partial',
    message: 'Partial provider response',
    zkill: { ...freshSnapshot().zkill, partial: true, failureCount: 1 }
  });
  assert.strictEqual(mapped.state.status, 'partial', 'adapter should preserve partial status');
  assert.strictEqual(mapped.state.availability, 'partial', 'adapter should preserve partial availability');
  assertWarning(mapped, 'PASSIVE_PROVIDER_PARTIAL');
  assert.strictEqual(mapped.diagnostics.providerFailureCounts.zkill, 1, 'adapter should preserve zKill failure count diagnostics');
}

function verifyCappedSampleWarning() {
  const mapped = mapPassiveTelemetryAdapter({
    ...freshSnapshot(),
    message: 'zKill context sample capped',
    zkill: { ...freshSnapshot().zkill, capped: true }
  });
  assert.strictEqual(mapped.state.status, 'fresh', 'capped zKill sample should not overwrite fresh status');
  assertWarning(mapped, 'PASSIVE_ZKILL_SAMPLE_CAPPED');
  assert.strictEqual(mapped.adapterPreview.stateLabel, 'Capped sample', 'adapter preview should surface capped sample');
}

function verifyBlockedAuthority() {
  const mapped = mapPassiveTelemetryAdapter({
    ...freshSnapshot(),
    status: 'blocked',
    message: 'Passive Telemetry live IO is disabled',
    gate: {
      state: 'live-disabled',
      enabled: false,
      message: 'Passive Telemetry live IO is disabled'
    },
    zkill: null,
    activity: null,
    failure: {
      code: 'PASSIVE_LIVE_IO_BLOCKED',
      message: 'Passive Telemetry live IO is disabled'
    },
    freshness: { status: 'blocked', cacheAgeMs: null, freshnessMs: 60000 }
  });
  assert.strictEqual(mapped.state.status, 'blocked', 'adapter should preserve blocked status');
  assert.strictEqual(mapped.state.availability, 'authority-blocked', 'adapter should keep authority block distinct');
  assert.strictEqual(mapped.state.authority.state, 'blocked', 'adapter should expose blocked authority state');
  assert.strictEqual(mapped.state.authority.code, 'PASSIVE_LIVE_IO_BLOCKED', 'adapter should preserve blocked code');
  assertWarning(mapped, 'PASSIVE_AUTHORITY_BLOCKED');
  assertGap(mapped, 'authority-blocked');
  assert.strictEqual(mapped.adapterPreview.stateLabel, 'I/O off - ingest blocked', 'adapter preview should use accepted blocked wording candidate');
}

function verifyDegradedResolver() {
  const mapped = mapPassiveTelemetryAdapter({
    kind: 'passive.telemetry.snapshot',
    observedAt: BASE_TIME,
    currentSystem: {
      label: 'Unknown',
      fromSystemName: 'Perimeter',
      eventTime: BASE_TIME,
      observedAt: BASE_TIME,
      systemId: null,
      resolved: false,
      resolverSource: null
    },
    zkill: null,
    activity: null,
    gate: { state: 'live-enabled', enabled: true, message: 'Passive Telemetry live IO is enabled' },
    freshness: { status: 'degraded', cacheAgeMs: null, freshnessMs: 60000 },
    status: 'degraded',
    message: 'Current system observed; system ID unresolved for zKill context',
    failure: {
      code: 'SYSTEM_NOT_FOUND',
      message: 'Current system observed; system ID unresolved for zKill context'
    }
  });
  assert.strictEqual(mapped.state.status, 'degraded', 'adapter should preserve degraded state');
  assert.strictEqual(mapped.basis.resolver.resolved, false, 'adapter should preserve unresolved resolver basis');
  assertWarning(mapped, 'SYSTEM_NOT_FOUND');
  assertGap(mapped, 'resolver-unresolved');
  assertGap(mapped, 'degraded');
}

function verifyNoObservationUnavailable() {
  const mapped = mapPassiveTelemetryAdapter({
    kind: 'passive.telemetry.snapshot',
    observedAt: BASE_TIME,
    currentSystem: null,
    zkill: null,
    activity: null,
    gate: { state: 'live-disabled', enabled: false, message: 'Passive Telemetry live IO is disabled' },
    freshness: { status: 'unavailable', cacheAgeMs: null, freshnessMs: 60000 },
    status: 'unavailable',
    message: 'Current system has not been observed',
    failure: null
  });
  assert.strictEqual(mapped.state.status, 'unavailable', 'adapter should preserve unavailable state');
  assert.strictEqual(mapped.state.availability, 'no-observation', 'adapter should distinguish no observation from generic unavailable');
  assert.strictEqual(mapped.domain.currentSystem, null, 'adapter should preserve absent current system');
  assertWarning(mapped, 'PASSIVE_NO_OBSERVATION');
  assertGap(mapped, 'no-observation');
  assert.strictEqual(mapped.adapterPreview.primaryLabel, 'No observation', 'adapter preview should preserve no observation');
}

function freshSnapshot() {
  return {
    kind: 'passive.telemetry.snapshot',
    observedAt: BASE_TIME,
    currentSystem: {
      label: 'Jita',
      fromSystemName: 'Perimeter',
      eventTime: '2026-06-01T11:59:50.000Z',
      observedAt: '2026-06-01T11:59:51.000Z',
      systemId: 30000142,
      resolved: true,
      resolverSource: 'local-static'
    },
    zkill: {
      systemId: 30000142,
      fetchedAt: BASE_TIME,
      pastSeconds: 3600,
      sampleCount: 4,
      capped: false,
      partial: false,
      failureCount: 0
    },
    activity: {
      systemId: 30000142,
      fetchedAt: BASE_TIME,
      shipKills: 8,
      podKills: 1,
      npcKills: 22,
      jumps: 55,
      partial: false,
      failureCount: 0,
      cache: {
        cacheMs: 3600000,
        cacheAgeMs: 0,
        state: 'refreshed',
        etag: '"fixture"',
        conditional: false,
        revalidated: false
      }
    },
    gate: { state: 'live-enabled', enabled: true, message: 'Passive Telemetry live IO is enabled' },
    freshness: { status: 'fresh', cacheAgeMs: 0, freshnessMs: 60000 },
    status: 'fresh',
    message: 'Passive system context refreshed',
    failure: null
  };
}

function assertWarning(mapped, code) {
  assert.ok(mapped.warnings.some((warning) => warning.code === code), `expected warning ${code}`);
}

function assertGap(mapped, kind) {
  assert.ok(mapped.gaps.some((gap) => gap.kind === kind), `expected gap ${kind}`);
}

function assertNoForbiddenSlots(mapped) {
  assert.strictEqual(Object.prototype.hasOwnProperty.call(mapped, 'certainty'), false, 'adapter must not emit certainty');
  assert.strictEqual(Object.prototype.hasOwnProperty.call(mapped, 'displaySafe'), false, 'adapter must not emit displaySafe');
  assert.ok(mapped.adapterPreview, 'adapter must emit adapterPreview');
}

main();
