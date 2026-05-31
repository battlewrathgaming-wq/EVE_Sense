const ADAPTER_KIND = 'passive.telemetry.adapter';
const PASSIVE_SNAPSHOT_KIND = 'passive.telemetry.snapshot';

function mapPassiveTelemetryAdapter(snapshot = {}) {
  const status = snapshot.status || 'unavailable';
  const currentSystem = mapCurrentSystem(snapshot.currentSystem);
  const providers = mapProviders(snapshot);
  const warnings = buildWarnings(snapshot, status);
  const gaps = buildGaps(snapshot, status, currentSystem, providers);

  return {
    kind: ADAPTER_KIND,
    lane: {
      id: 'passive-telemetry',
      snapshotKind: snapshot.kind || PASSIVE_SNAPSHOT_KIND,
      label: 'Passive Telemetry'
    },
    domain: {
      currentSystem
    },
    basis: {
      observation: mapObservation(snapshot.currentSystem),
      resolver: mapResolver(snapshot.currentSystem),
      providers
    },
    freshness: mapFreshness(snapshot, status),
    state: {
      status,
      authority: mapAuthority(snapshot),
      availability: availabilityFor(snapshot, status),
      pending: Boolean(currentSystem && !snapshot.zkill && !snapshot.activity && status !== 'blocked' && status !== 'degraded')
    },
    warnings,
    gaps,
    diagnostics: mapDiagnostics(snapshot),
    adapterPreview: buildAdapterPreview(snapshot, status, currentSystem, providers, warnings, gaps)
  };
}

function mapCurrentSystem(currentSystem) {
  if (!currentSystem) return null;
  return {
    label: currentSystem.label || null,
    systemId: currentSystem.systemId || null,
    resolved: currentSystem.resolved === true,
    fromSystemName: currentSystem.fromSystemName || null
  };
}

function mapObservation(currentSystem) {
  if (!currentSystem) return null;
  return {
    source: 'admitted navigation.jump',
    eventTime: currentSystem.eventTime || null,
    observedAt: currentSystem.observedAt || null
  };
}

function mapResolver(currentSystem) {
  if (!currentSystem) return null;
  return {
    source: currentSystem.resolverSource || null,
    resolved: currentSystem.resolved === true
  };
}

function mapProviders(snapshot) {
  return [
    mapZkillProvider(snapshot.zkill),
    mapEsiProvider(snapshot.activity)
  ].filter(Boolean);
}

function mapZkillProvider(zkill) {
  if (!zkill) return null;
  return {
    provider: 'zKill',
    scope: {
      kind: 'system-context',
      pastSeconds: zkill.pastSeconds || null
    },
    fetchedAt: zkill.fetchedAt || null,
    counts: {
      sampleCount: numberOrZero(zkill.sampleCount)
    },
    capped: zkill.capped === true,
    partial: zkill.partial === true
  };
}

function mapEsiProvider(activity) {
  if (!activity) return null;
  return {
    provider: 'ESI',
    scope: {
      kind: 'aggregate-system-activity'
    },
    fetchedAt: activity.fetchedAt || null,
    counts: {
      shipKills: numberOrZero(activity.shipKills),
      podKills: numberOrZero(activity.podKills),
      npcKills: numberOrZero(activity.npcKills),
      jumps: numberOrZero(activity.jumps)
    },
    partial: activity.partial === true,
    cache: mapCache(activity.cache)
  };
}

function mapCache(cache) {
  if (!cache) return null;
  return {
    cacheMs: cache.cacheMs ?? null,
    cacheAgeMs: cache.cacheAgeMs ?? null,
    state: cache.state || null,
    revalidated: cache.revalidated === true
  };
}

function mapFreshness(snapshot, status) {
  const providerFetchedAt = [
    snapshot.zkill?.fetchedAt,
    snapshot.activity?.fetchedAt
  ].filter(Boolean);
  return {
    status: snapshot.freshness?.status || status,
    snapshotObservedAt: snapshot.observedAt || null,
    sourceAgeMs: snapshot.freshness?.cacheAgeMs ?? null,
    freshnessMs: snapshot.freshness?.freshnessMs ?? null,
    providerFetchedAt
  };
}

function mapAuthority(snapshot) {
  const gate = snapshot.gate || {};
  const blocked = snapshot.status === 'blocked' || gate.enabled === false;
  return {
    state: blocked ? 'blocked' : (gate.state || 'unknown'),
    enabled: gate.enabled === true,
    message: snapshot.status === 'blocked'
      ? (snapshot.message || gate.message || 'I/O off - ingest blocked')
      : (gate.message || null),
    code: snapshot.status === 'blocked' ? (snapshot.failure?.code || 'PASSIVE_AUTHORITY_BLOCKED') : null
  };
}

function availabilityFor(snapshot, status) {
  if (!snapshot.currentSystem && status === 'unavailable') return 'no-observation';
  if (status === 'blocked') return 'authority-blocked';
  if (status === 'degraded') return 'degraded';
  if (status === 'stale') return 'stale';
  if (status === 'partial' || snapshot.zkill?.partial || snapshot.activity?.partial) return 'partial';
  return status;
}

function buildWarnings(snapshot, status) {
  const warnings = [];
  if (status === 'blocked') {
    warnings.push(warning('PASSIVE_AUTHORITY_BLOCKED', 'I/O off - ingest blocked', 'state.authority', 'high'));
  }
  if (status === 'stale' || snapshot.freshness?.status === 'stale') {
    warnings.push(warning('PASSIVE_CONTEXT_STALE', 'Stale context', 'freshness.status', 'medium'));
  }
  if (snapshot.zkill?.capped) {
    warnings.push(warning('PASSIVE_ZKILL_SAMPLE_CAPPED', 'Capped sample', 'basis.providers.zKill.capped', 'medium'));
  }
  if (status === 'partial' || snapshot.zkill?.partial || snapshot.activity?.partial) {
    warnings.push(warning('PASSIVE_PROVIDER_PARTIAL', 'Partial sample', 'basis.providers', 'medium'));
  }
  if (status === 'degraded') {
    warnings.push(warning(snapshot.failure?.code || 'PASSIVE_DEGRADED', 'Degraded', 'diagnostics.failure', 'high'));
  }
  if (!snapshot.currentSystem && status === 'unavailable') {
    warnings.push(warning('PASSIVE_NO_OBSERVATION', 'No observation', 'domain.currentSystem', 'low'));
  }
  return warnings;
}

function buildGaps(snapshot, status, currentSystem, providers) {
  const gaps = [];
  if (!currentSystem) {
    gaps.push(gap('no-observation', 'No admitted current-system observation'));
  }
  if (currentSystem && currentSystem.resolved !== true) {
    gaps.push(gap('resolver-unresolved', snapshot.failure?.message || 'Current system is not resolved'));
  }
  if (currentSystem && providers.length === 0 && status !== 'blocked' && status !== 'degraded') {
    gaps.push(gap('provider-sample-missing', 'No Passive provider sample is available yet'));
  }
  if (status === 'blocked') {
    gaps.push(gap('authority-blocked', snapshot.message || 'Sense is not allowed to ingest while I/O is off'));
  }
  if (status === 'degraded') {
    gaps.push(gap('degraded', snapshot.failure?.message || snapshot.message || 'Passive Telemetry degraded'));
  }
  return gaps;
}

function mapDiagnostics(snapshot) {
  return {
    failure: snapshot.failure ? { ...snapshot.failure } : null,
    providerFailureCounts: {
      zkill: snapshot.zkill?.failureCount ?? 0,
      esi: snapshot.activity?.failureCount ?? 0
    },
    cache: snapshot.activity?.cache ? mapCache(snapshot.activity.cache) : null,
    message: snapshot.message || null
  };
}

function buildAdapterPreview(snapshot, status, currentSystem, providers, warnings, gaps) {
  const zkill = providers.find((provider) => provider.provider === 'zKill');
  const esi = providers.find((provider) => provider.provider === 'ESI');
  const sampleParts = [
    zkill ? `zKill ${zkill.counts.sampleCount}` : null,
    esi ? `ESI ${esi.counts.shipKills} / ${esi.counts.jumps}` : null
  ].filter(Boolean);
  return {
    primaryLabel: currentSystem?.label || 'No observation',
    stateLabel: previewStateLabel(snapshot, status),
    basisLine: previewBasisLine(snapshot, providers, gaps),
    ageLine: ageLine(snapshot),
    sampleLine: sampleParts.join(' + ') || 'No provider sample yet',
    authorityLine: status === 'blocked' ? 'I/O off - ingest blocked' : (snapshot.gate?.message || null),
    warningLine: warnings.map((entry) => entry.label).join(' + ') || null
  };
}

function previewStateLabel(snapshot, status) {
  if (status === 'fresh' && snapshot.zkill?.capped) return 'Capped sample';
  if (status === 'fresh') return 'Fresh context';
  if (status === 'partial') return snapshot.zkill?.capped ? 'Capped sample' : 'Partial sample';
  if (status === 'stale') return 'Stale context';
  if (status === 'blocked') return 'I/O off - ingest blocked';
  if (status === 'degraded') return 'Degraded';
  if (!snapshot.currentSystem) return 'No observation';
  return 'Unavailable';
}

function previewBasisLine(snapshot, providers, gaps) {
  if (snapshot.status === 'blocked') return 'Authority blocked';
  if (gaps.some((entry) => entry.kind === 'no-observation')) return 'No admitted current-system observation';
  const providerNames = providers.map((provider) => provider.provider);
  const resolver = snapshot.currentSystem?.resolverSource === 'local-static' ? 'Static lookup' : null;
  return [...providerNames, resolver].filter(Boolean).join(' + ') || 'No provider sample yet';
}

function ageLine(snapshot) {
  const ageMs = Number(snapshot.freshness?.cacheAgeMs);
  if (!Number.isFinite(ageMs)) return 'No age';
  return `${Math.round(ageMs / 1000)}s old`;
}

function warning(code, label, sourceField, severity) {
  return { code, label, sourceField, severity };
}

function gap(kind, reason) {
  return { kind, reason };
}

function numberOrZero(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

module.exports = {
  ADAPTER_KIND,
  mapPassiveTelemetryAdapter
};
