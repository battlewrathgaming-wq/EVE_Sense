const DEFAULT_DIAGNOSTIC_LIMIT = 30;
const LOW_VALUE_EVENTS = new Set([
  'poll_tick',
  'tail_read',
  'duplicate_suppressed',
  'http_request_success'
]);

function createRuntimeDiagnosticsService({
  limit = DEFAULT_DIAGNOSTIC_LIMIT,
  now = () => new Date().toISOString()
} = {}) {
  const records = [];

  function record(event, payload = {}) {
    if (LOW_VALUE_EVENTS.has(event)) {
      return snapshot();
    }
    const entry = sanitizeDiagnostic({
      event,
      payload,
      observedAt: now()
    });
    records.unshift(entry);
    if (records.length > limit) {
      records.length = limit;
    }
    return snapshot();
  }

  function snapshot() {
    return {
      kind: 'runtime.diagnostics.snapshot',
      status: records.length ? 'observed' : 'quiet',
      count: records.length,
      records: [...records]
    };
  }

  return {
    record,
    snapshot
  };
}

function sanitizeDiagnostic(entry) {
  return {
    event: String(entry.event || 'runtime_diagnostic'),
    observedAt: entry.observedAt,
    payload: sanitizePayload(entry.payload)
  };
}

function sanitizePayload(payload = {}) {
  const clean = {};
  for (const [key, value] of Object.entries(payload || {})) {
    if (/raw|line|content/i.test(key) && !/hash/i.test(key)) {
      clean[key] = '[redacted]';
    } else if (typeof value === 'string') {
      clean[key] = value.length > 180 ? `${value.slice(0, 177)}...` : value;
    } else if (value == null || typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    } else {
      clean[key] = '[structured]';
    }
  }
  return clean;
}

module.exports = {
  DEFAULT_DIAGNOSTIC_LIMIT,
  createRuntimeDiagnosticsService,
  sanitizeDiagnostic
};
