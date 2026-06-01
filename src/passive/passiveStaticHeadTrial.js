const STATIC_HEAD_TRIAL_KIND = 'passive.static-head-trial.input';
const PASSIVE_ADAPTER_KIND = 'passive.telemetry.adapter';

function mapPassiveStaticHeadTrial(adapter = {}) {
  assertPassiveAdapter(adapter);

  const preview = adapter.adapterPreview || {};
  const currentSystem = adapter.domain?.currentSystem || null;
  const sourceState = adapter.state || {};
  const warnings = Array.isArray(adapter.warnings) ? adapter.warnings : [];
  const gaps = Array.isArray(adapter.gaps) ? adapter.gaps : [];

  return {
    kind: STATIC_HEAD_TRIAL_KIND,
    trial: {
      id: 'sense.passive.static-head-trial',
      laneId: adapter.lane?.id || 'passive-telemetry',
      sourceKind: adapter.kind,
      sourceOwned: true,
      boundary: 'Sense-local fixture/static presentation-head trial only'
    },
    readout: {
      label: adapter.lane?.label || 'Passive Telemetry',
      primaryValue: preview.primaryLabel || currentSystem?.label || 'No observation',
      state: {
        label: preview.stateLabel || sourceState.status || 'No observation',
        sourceStatus: sourceState.status || 'unavailable',
        availability: sourceState.availability || 'unknown',
        sourceOwned: true
      },
      basis: preview.basisLine || basisFromAdapter(adapter),
      ageLabel: preview.ageLine || 'No age',
      sampleLine: preview.sampleLine || 'No provider sample yet',
      authorityLine: preview.authorityLine || adapter.state?.authority?.message || null,
      warningLine: preview.warningLine || null
    },
    availability: {
      reason: reasonFirst(adapter),
      sourceStatus: sourceState.status || 'unavailable',
      sourceAvailability: sourceState.availability || 'unknown',
      sourceOwned: true
    },
    warnings: warnings.map(mapWarning),
    gaps: gaps.map(mapGap),
    detail: buildDetail(adapter),
    sourceAdapter: {
      kind: adapter.kind,
      lane: adapter.lane,
      adapterPreview: adapter.adapterPreview,
      basis: adapter.basis,
      freshness: adapter.freshness,
      state: adapter.state
    }
  };
}

function assertPassiveAdapter(adapter) {
  if (adapter.kind !== PASSIVE_ADAPTER_KIND) {
    throw new Error(`Expected ${PASSIVE_ADAPTER_KIND}`);
  }
  if (!adapter.adapterPreview) {
    throw new Error('Passive static head trial requires adapterPreview');
  }
}

function basisFromAdapter(adapter) {
  const providers = Array.isArray(adapter.basis?.providers) ? adapter.basis.providers : [];
  const providerNames = providers.map((provider) => provider.provider).filter(Boolean);
  const resolver = adapter.basis?.resolver?.source === 'local-static' ? 'Static lookup' : null;
  return [...providerNames, resolver].filter(Boolean).join(' + ') || 'No provider sample yet';
}

function reasonFirst(adapter) {
  const status = adapter.state?.status;
  const availability = adapter.state?.availability;
  if (availability === 'authority-blocked') return 'I/O off - ingest blocked';
  if (availability === 'no-observation') return 'No admitted current-system observation';
  if (status === 'degraded') return adapter.diagnostics?.failure?.message || adapter.diagnostics?.message || 'Passive Telemetry degraded';
  if (status === 'stale') return 'Passive context is stale';
  if (status === 'partial') return 'Partial provider sample';
  if (adapter.warnings?.some((warning) => warning.code === 'PASSIVE_ZKILL_SAMPLE_CAPPED')) return 'Capped zKill sample';
  return adapter.diagnostics?.message || adapter.adapterPreview?.stateLabel || 'Passive context available';
}

function mapWarning(warning) {
  return {
    code: warning.code,
    label: warning.label,
    sourceField: warning.sourceField,
    severity: warning.severity,
    sourceOwned: true
  };
}

function mapGap(gap) {
  return {
    kind: gap.kind,
    reason: gap.reason,
    sourceOwned: true
  };
}

function buildDetail(adapter) {
  const providers = Array.isArray(adapter.basis?.providers) ? adapter.basis.providers : [];
  const providerSummary = providers.map((provider) => ({
    provider: provider.provider,
    scope: provider.scope,
    fetchedAt: provider.fetchedAt || null,
    counts: provider.counts || {},
    partial: provider.partial === true,
    capped: provider.capped === true
  }));

  return {
    currentSystem: adapter.domain?.currentSystem || null,
    observation: adapter.basis?.observation || null,
    resolver: adapter.basis?.resolver || null,
    providers: providerSummary,
    freshness: adapter.freshness || null,
    diagnostics: adapter.diagnostics || null
  };
}

module.exports = {
  STATIC_HEAD_TRIAL_KIND,
  mapPassiveStaticHeadTrial
};
