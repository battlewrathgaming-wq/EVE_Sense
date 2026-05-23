const { createLiveIoGate } = require('../passive/liveIoGate');
const { createThreatIntelTargetResolver } = require('./threatIntelTargetResolver');
const {
  DEFAULT_THREAT_LOOKBACK_SECONDS,
  DEFAULT_THREAT_SAMPLE_LIMIT,
  ThreatIntelZkillClient
} = require('./threatIntelZkillClient');

const INPUT_SOURCES = new Set(['search', 'paste', 'clipboard']);

function createThreatIntelService({
  resolveTarget = createThreatIntelTargetResolver(),
  zkillClient = new ThreatIntelZkillClient(),
  liveIoGate = createLiveIoGate(),
  now = () => Date.now(),
  trace = () => {}
} = {}) {
  let lastSnapshot = emptySnapshot(now);

  async function scan(request = {}, context = {}) {
    const normalized = normalizeScanRequest(request, now);
    if (!normalized.ok) {
      lastSnapshot = snapshotFromValidation(normalized, now);
      return lastSnapshot;
    }

    const resolved = resolveTarget(normalized.request);
    if (resolved.status !== 'resolved') {
      lastSnapshot = snapshotFromResolution(normalized.request, resolved, now);
      return lastSnapshot;
    }

    if (resolved.kind === 'text') {
      lastSnapshot = snapshotFromResolution(normalized.request, {
        status: 'unsupported',
        reason: 'unsupported',
        message: 'Copied text requires a supported target kind before zKill scan'
      }, now);
      return lastSnapshot;
    }

    const gate = liveIoGate.check({ providers: ['zkill'] });
    if (!gate.ok) {
      lastSnapshot = {
        ...baseSnapshot(normalized.request, now),
        status: 'blocked',
        target: resolved,
        gate,
        message: gate.message,
        failure: { code: gate.code, message: gate.message }
      };
      trace('threat_intel_live_io_blocked', { targetKind: resolved.kind, targetId: resolved.id });
      return lastSnapshot;
    }

    try {
      const probe = await zkillClient.fetchTargetRefs(resolved, {
        signal: context.signal,
        fetchedAt: new Date(now()).toISOString(),
        lookbackSeconds: normalized.request.lookbackSeconds,
        sampleLimit: normalized.request.sampleLimit
      });
      lastSnapshot = {
        ...baseSnapshot(normalized.request, now),
        status: probe.partial ? 'partial' : 'succeeded',
        target: resolved,
        gate,
        zkill: compactProbe(probe),
        message: `${formatKillmailCount(probe.discoveredCount)} in ${formatLookbackLabel(probe.lookbackSeconds)}`,
        failure: probe.failures[0] || null
      };
      trace('threat_intel_scan_completed', {
        targetKind: resolved.kind,
        targetId: resolved.id,
        selectedCount: probe.selectedCount,
        capped: probe.capped,
        partial: probe.partial
      });
      return lastSnapshot;
    } catch (error) {
      lastSnapshot = {
        ...baseSnapshot(normalized.request, now),
        status: 'failed',
        target: resolved,
        gate,
        message: error.message,
        failure: { code: error.code || 'THREAT_INTEL_SCAN_FAILED', message: error.message }
      };
      trace('threat_intel_scan_failed', lastSnapshot.failure);
      return lastSnapshot;
    }
  }

  function snapshot() {
    return lastSnapshot;
  }

  function liveIoStatus() {
    return liveIoGate.status();
  }

  function setLiveIoEnabled(enabled, reason = null) {
    return liveIoGate.setEnabled(enabled === true, reason);
  }

  return {
    liveIoStatus,
    scan,
    setLiveIoEnabled,
    snapshot
  };
}

function normalizeScanRequest(request = {}, now = () => Date.now()) {
  const targetText = String(request.targetText || '').trim();
  if (!targetText) {
    return { ok: false, status: 'empty', message: 'Threat Intel target is empty' };
  }
  const inputSource = INPUT_SOURCES.has(request.inputSource) ? request.inputSource : 'search';
  const lookbackSeconds = boundedInteger(request.lookbackSeconds, DEFAULT_THREAT_LOOKBACK_SECONDS, 60, 86400);
  const sampleLimit = boundedInteger(request.sampleLimit, DEFAULT_THREAT_SAMPLE_LIMIT, 1, 50);
  return {
    ok: true,
    request: {
      targetText,
      targetKind: request.targetKind || null,
      inputSource,
      lookbackSeconds,
      sampleLimit,
      requestedAt: request.requestedAt || new Date(now()).toISOString()
    }
  };
}

function snapshotFromValidation(validation, now) {
  return {
    ...baseSnapshot(null, now),
    status: validation.status,
    message: validation.message,
    failure: { code: `THREAT_INTEL_${validation.status.toUpperCase()}`, message: validation.message }
  };
}

function snapshotFromResolution(request, resolution, now) {
  return {
    ...baseSnapshot(request, now),
    status: resolution.status,
    target: resolution,
    message: resolution.message || 'Threat Intel target is unresolved',
    failure: { code: `THREAT_TARGET_${String(resolution.reason || resolution.status).toUpperCase()}`, message: resolution.message || 'Threat Intel target is unresolved' }
  };
}

function baseSnapshot(request, now) {
  return {
    kind: 'threat.intel.snapshot',
    observedAt: new Date(now()).toISOString(),
    request,
    target: null,
    gate: null,
    zkill: null,
    freshness: { status: request ? 'pending' : 'empty' },
    status: request ? 'pending' : 'empty',
    message: request ? 'Threat Intel scan pending' : 'No Threat Intel scan has run',
    failure: null
  };
}

function emptySnapshot(now) {
  return baseSnapshot(null, now);
}

function compactProbe(probe) {
  return {
    provider: probe.provider,
    endpointFamily: probe.endpointFamily,
    fetchedAt: probe.fetchedAt,
    lookbackSeconds: probe.lookbackSeconds,
    sampleLimit: probe.sampleLimit,
    discoveredCount: probe.discoveredCount,
    selectedCount: probe.selectedCount,
    malformedCount: probe.malformedCount,
    failedCount: probe.failedCount,
    capped: probe.capped,
    partial: probe.partial,
    refs: probe.refs
  };
}

function boundedInteger(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isInteger(number)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, number));
}

function formatLookbackLabel(seconds) {
  const value = Number(seconds);
  if (value === 3600) return '1h';
  if (value > 0 && value % 3600 === 0) return `${value / 3600}h`;
  if (value > 0 && value % 60 === 0) return `${value / 60}m`;
  return `${value || DEFAULT_THREAT_LOOKBACK_SECONDS}s`;
}

function formatKillmailCount(count) {
  const value = Number(count) || 0;
  return `${value} ${value === 1 ? 'killmail' : 'killmails'}`;
}

module.exports = {
  INPUT_SOURCES,
  createThreatIntelService,
  normalizeScanRequest
};
