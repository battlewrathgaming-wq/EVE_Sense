const assert = require('node:assert');
const { mapPassiveTelemetryAdapter } = require('../src/passive/passiveTelemetryAdapter');
const { STATIC_HEAD_TRIAL_KIND, mapPassiveStaticHeadTrial } = require('../src/passive/passiveStaticHeadTrial');

const BASE_TIME = '2026-06-01T12:00:00.000Z';

function main() {
  verifyFreshContext();
  verifyStaleContext();
  verifyPartialSample();
  verifyCappedSampleWarning();
  verifyBlockedAuthority();
  verifyDegradedResolver();
  verifyNoObservationUnavailable();
  console.log('passive static head trial verified');
}

function verifyFreshContext() {
  const trial = mapTrial(freshSnapshot());
  assert.strictEqual(trial.kind, STATIC_HEAD_TRIAL_KIND, 'trial should identify static head input shape');
  assert.strictEqual(trial.trial.sourceKind, 'passive.telemetry.adapter', 'trial should begin at Passive adapter output');
  assert.strictEqual(trial.trial.sourceOwned, true, 'trial should keep Sense source ownership explicit');
  assert.strictEqual(trial.readout.label, 'Passive Telemetry', 'trial should preserve Passive lane label');
  assert.strictEqual(trial.readout.primaryValue, 'Jita', 'trial should preserve current system as primary value');
  assert.strictEqual(trial.readout.state.label, 'Fresh context', 'trial should preserve fresh Sense state label');
  assert.strictEqual(trial.readout.basis, 'zKill + ESI + Static lookup', 'trial should preserve provider and resolver basis');
  assert.strictEqual(trial.detail.providers.length, 2, 'trial detail should preserve provider basis');
  assertSourceAdapterBoundary(trial);
  assertNoLabStateCollapse(trial);
}

function verifyStaleContext() {
  const trial = mapTrial({
    ...freshSnapshot(),
    status: 'stale',
    message: 'Passive system context is stale',
    freshness: { status: 'stale', cacheAgeMs: 360000, freshnessMs: 60000 }
  });
  assert.strictEqual(trial.readout.state.label, 'Stale context', 'trial should keep stale distinct');
  assert.strictEqual(trial.availability.sourceAvailability, 'stale', 'trial should not make stale unavailable');
  assertWarning(trial, 'PASSIVE_CONTEXT_STALE');
}

function verifyPartialSample() {
  const trial = mapTrial({
    ...freshSnapshot(),
    status: 'partial',
    message: 'Partial provider response',
    zkill: { ...freshSnapshot().zkill, partial: true, failureCount: 1 }
  });
  assert.strictEqual(trial.readout.state.label, 'Partial sample', 'trial should keep partial sample visible');
  assert.strictEqual(trial.availability.sourceAvailability, 'partial', 'trial should preserve partial availability');
  assertWarning(trial, 'PASSIVE_PROVIDER_PARTIAL');
  assert.strictEqual(trial.detail.diagnostics.providerFailureCounts.zkill, 1, 'trial should preserve diagnostics');
}

function verifyCappedSampleWarning() {
  const trial = mapTrial({
    ...freshSnapshot(),
    message: 'zKill context sample capped',
    zkill: { ...freshSnapshot().zkill, capped: true }
  });
  assert.strictEqual(trial.readout.state.sourceStatus, 'fresh', 'capped sample should not overwrite source status');
  assert.strictEqual(trial.readout.state.label, 'Capped sample', 'trial should keep capped sample visible');
  assertWarning(trial, 'PASSIVE_ZKILL_SAMPLE_CAPPED');
}

function verifyBlockedAuthority() {
  const trial = mapTrial({
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
  assert.strictEqual(trial.readout.state.label, 'I/O off - ingest blocked', 'trial should preserve ADR-0008 authority wording');
  assert.strictEqual(trial.availability.reason, 'I/O off - ingest blocked', 'trial should not present blocked as no data');
  assert.strictEqual(trial.availability.sourceAvailability, 'authority-blocked', 'trial should preserve authority-blocked availability');
  assertWarning(trial, 'PASSIVE_AUTHORITY_BLOCKED');
  assertGap(trial, 'authority-blocked');
}

function verifyDegradedResolver() {
  const trial = mapTrial({
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
  assert.strictEqual(trial.readout.state.label, 'Degraded', 'trial should preserve degraded state');
  assert.strictEqual(trial.availability.reason, 'Current system observed; system ID unresolved for zKill context', 'trial should keep degraded reason first');
  assertWarning(trial, 'SYSTEM_NOT_FOUND');
  assertGap(trial, 'resolver-unresolved');
}

function verifyNoObservationUnavailable() {
  const trial = mapTrial({
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
  assert.strictEqual(trial.readout.primaryValue, 'No observation', 'trial should preserve no observation copy');
  assert.strictEqual(trial.readout.state.label, 'No observation', 'trial should not collapse no observation into generic unavailable');
  assert.strictEqual(trial.availability.reason, 'No admitted current-system observation', 'trial should keep no-observation reason');
  assertWarning(trial, 'PASSIVE_NO_OBSERVATION');
  assertGap(trial, 'no-observation');
}

function mapTrial(snapshot) {
  return mapPassiveStaticHeadTrial(mapPassiveTelemetryAdapter(snapshot));
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

function assertWarning(trial, code) {
  assert.ok(trial.warnings.some((warning) => warning.code === code), `expected warning ${code}`);
}

function assertGap(trial, kind) {
  assert.ok(trial.gaps.some((gap) => gap.kind === kind), `expected gap ${kind}`);
}

function assertSourceAdapterBoundary(trial) {
  assert.ok(trial.sourceAdapter.adapterPreview, 'trial should carry source adapterPreview for inspection');
  assert.strictEqual(Object.prototype.hasOwnProperty.call(trial.sourceAdapter, 'displaySafe'), false, 'trial must not introduce displaySafe');
  assert.strictEqual(Object.prototype.hasOwnProperty.call(trial.sourceAdapter, 'certainty'), false, 'trial must not introduce certainty');
}

function assertNoLabStateCollapse(trial) {
  const serialized = JSON.stringify(trial);
  for (const labState of ['CURRENT', 'AGED', 'PARTIAL', 'UNAVAILABLE', 'FALLBACK', 'NO DATA']) {
    assert.strictEqual(serialized.includes(labState), false, `trial must not import Lab ${labState} label`);
  }
}

main();
