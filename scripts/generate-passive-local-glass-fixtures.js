const fs = require('node:fs');
const path = require('node:path');
const { mapPassiveTelemetryAdapter } = require('../src/passive/passiveTelemetryAdapter');
const { mapPassiveStaticHeadTrial } = require('../src/passive/passiveStaticHeadTrial');

const BASE_TIME = '2026-06-01T12:00:00.000Z';
const OUTPUT_PATH = path.join(__dirname, '..', 'trials', 'passive-local-glass', 'sense-trial-readouts.json');

function buildPassiveLocalGlassData() {
  const cases = [
    ['passive-fresh', freshSnapshot()],
    ['passive-stale', staleSnapshot()],
    ['passive-partial', partialSnapshot()],
    ['passive-capped', cappedSnapshot()],
    ['passive-blocked', blockedSnapshot()],
    ['passive-degraded', degradedSnapshot()],
    ['passive-no-observation', noObservationSnapshot()]
  ];

  return {
    meta: {
      generatedBy: 'scripts/generate-passive-local-glass-fixtures.js',
      boundary: 'Sense-generated Passive fixture input for local static glass inspection only.',
      sourceChain: [
        'passive.telemetry.snapshot fixture',
        'mapPassiveTelemetryAdapter',
        'mapPassiveStaticHeadTrial',
        'glass readout input'
      ]
    },
    readouts: cases.map(([id, snapshot]) => glassReadoutFromTrial(id, mapPassiveStaticHeadTrial(mapPassiveTelemetryAdapter(snapshot))))
  };
}

function writePassiveLocalGlassData(filePath = OUTPUT_PATH) {
  const data = buildPassiveLocalGlassData();
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return data;
}

function glassReadoutFromTrial(id, trial) {
  const sourceStatus = trial.readout.state.sourceStatus || 'unavailable';
  const stateId = stateIdFor(trial);
  const sourceTerms = [
    trial.readout.state.label,
    trial.readout.primaryValue,
    trial.availability.reason
  ].filter(Boolean);

  return {
    id,
    label: trial.readout.label,
    state: {
      id: stateId,
      label: trial.readout.state.label,
      marker: 'SENSE'
    },
    primaryValue: trial.readout.primaryValue === 'No observation' ? '' : trial.readout.primaryValue,
    absenceLabel: trial.readout.primaryValue === 'No observation' ? 'No observation' : undefined,
    ageLabel: trial.readout.ageLabel,
    basis: trial.readout.basis,
    availability: {
      status: trial.availability.sourceAvailability,
      reason: trial.availability.reason
    },
    coverage: {
      summary: 'Sense trial fields are available in detail; coverage is not Sense state truth.',
      knownFields: [
        'readout',
        'availability',
        'warnings',
        'gaps',
        'detail',
        'sourceAdapter'
      ]
    },
    displayPolicy: {
      compactMeta: true,
      coverageInDetailOnly: true
    },
    gaps: trial.gaps.map((gap) => `${gap.kind}: ${gap.reason}`),
    warnings: trial.warnings.map((warning) => `${warning.code}: ${warning.label}`),
    sourceOwned: {
      owner: 'AURA-Sense Passive Telemetry',
      layer: 'Sense-local static trial input',
      terms: sourceTerms,
      visibleLabel: trial.readout.state.label,
      qualification: `${trial.readout.state.label} is a Sense-owned Passive Telemetry state label for this fixture.`
    },
    detail: {
      summary: `Generated from ${trial.sourceAdapter.kind}; source status ${sourceStatus}.`,
      rows: detailRows(trial)
    }
  };
}

function stateIdFor(trial) {
  if (trial.warnings.some((warning) => warning.code === 'PASSIVE_ZKILL_SAMPLE_CAPPED')) return 'capped';
  if (trial.readout.state.availability === 'authority-blocked') return 'blocked';
  if (trial.readout.state.availability === 'no-observation') return 'unavailable';
  return trial.readout.state.sourceStatus || 'unavailable';
}

function detailRows(trial) {
  const rows = [
    { label: 'Source kind', value: trial.sourceAdapter.kind },
    { label: 'Snapshot kind', value: trial.sourceAdapter.lane?.snapshotKind || 'passive.telemetry.snapshot' },
    { label: 'Adapter preview', value: JSON.stringify(trial.sourceAdapter.adapterPreview) },
    { label: 'Authority', value: JSON.stringify(trial.sourceAdapter.state?.authority || {}) },
    { label: 'Freshness', value: JSON.stringify(trial.sourceAdapter.freshness || {}) },
    { label: 'Warnings', value: trial.warnings.length ? trial.warnings.map((warning) => warning.label).join(', ') : 'None' },
    { label: 'Gaps', value: trial.gaps.length ? trial.gaps.map((gap) => gap.reason).join('; ') : 'None' }
  ];

  for (const provider of trial.detail.providers) {
    rows.push({
      label: `${provider.provider} basis`,
      value: JSON.stringify({
        scope: provider.scope,
        fetchedAt: provider.fetchedAt,
        counts: provider.counts,
        partial: provider.partial,
        capped: provider.capped
      })
    });
  }

  return rows;
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

function staleSnapshot() {
  return {
    ...freshSnapshot(),
    status: 'stale',
    message: 'Passive system context is stale',
    freshness: { status: 'stale', cacheAgeMs: 360000, freshnessMs: 60000 }
  };
}

function partialSnapshot() {
  const snapshot = freshSnapshot();
  return {
    ...snapshot,
    status: 'partial',
    message: 'Partial provider response',
    zkill: { ...snapshot.zkill, partial: true, failureCount: 1 }
  };
}

function cappedSnapshot() {
  const snapshot = freshSnapshot();
  return {
    ...snapshot,
    message: 'zKill context sample capped',
    zkill: { ...snapshot.zkill, capped: true }
  };
}

function blockedSnapshot() {
  return {
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
  };
}

function degradedSnapshot() {
  return {
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
  };
}

function noObservationSnapshot() {
  return {
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
  };
}

if (require.main === module) {
  writePassiveLocalGlassData();
  console.log(`passive local glass fixtures written: ${path.relative(path.join(__dirname, '..'), OUTPUT_PATH)}`);
}

module.exports = {
  buildPassiveLocalGlassData,
  writePassiveLocalGlassData
};
