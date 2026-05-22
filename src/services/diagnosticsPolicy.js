const DEFAULT_THROTTLE_MS = 1000;

const LOW_VALUE_EVENTS = new Set([
  'duplicate_suppressed',
  'file_event',
  'file_seeded',
  'http_request_success',
  'offsets_seeded',
  'poll_tick',
  'tail_read'
]);

const THROTTLED_EVENTS = new Set([
  'status',
  'watcher_strategy'
]);

const HIGH_VALUE_EVENTS = new Set([
  'combat_event_listener_error',
  'combat_snapshot_listener_error',
  'combat_snapshot_sink_error',
  'http_request_error',
  'http_request_rate_limited',
  'line_rejected',
  'listener_error',
  'partial_line_dropped',
  'renderer_process_gone',
  'runtime_uncaught_exception',
  'runtime_unhandled_rejection',
  'watcher_strategy_fallback'
]);

class DiagnosticsPolicy {
  constructor({
    mode = 'normal',
    throttleMs = DEFAULT_THROTTLE_MS,
    now = () => Date.now()
  } = {}) {
    this.mode = mode;
    this.throttleMs = throttleMs;
    this.now = now;
    this.lastEmitted = new Map();
  }

  shouldEmit(event, payload = {}) {
    if (this.mode === 'verbose') {
      return true;
    }

    const priority = diagnosticPriority(event, payload);
    if (priority === 'high') {
      return true;
    }
    if (priority === 'low') {
      return false;
    }

    return this.shouldEmitThrottled(event, payload);
  }

  shouldEmitThrottled(event, payload = {}) {
    const key = diagnosticThrottleKey(event, payload);
    const nowMs = this.now();
    const last = this.lastEmitted.get(key);
    if (last != null && nowMs - last < this.throttleMs) {
      return false;
    }
    this.lastEmitted.set(key, nowMs);
    return true;
  }

  wrapTrace(trace, source = null) {
    if (typeof trace !== 'function') {
      return () => {};
    }
    return (event, payload = {}) => {
      const nextPayload = source ? { source, ...payload } : payload;
      if (this.shouldEmit(event, nextPayload)) {
        trace(event, nextPayload);
      }
    };
  }

  wrapRequestLog(onRequestLog) {
    if (typeof onRequestLog !== 'function') {
      return null;
    }
    return (entry) => {
      const event = httpDiagnosticEvent(entry);
      if (this.shouldEmit(event, entry)) {
        onRequestLog({ diagnostic_event: event, ...entry });
      }
    };
  }
}

function diagnosticPriority(event, payload = {}) {
  if (event === 'status') {
    return payload.state === 'watching' ? 'medium' : 'high';
  }
  if (event === 'watcher_strategy') {
    return 'medium';
  }
  if (event === 'line_rejected') {
    return payload.reason === 'unparsed' ? 'low' : 'high';
  }
  if (HIGH_VALUE_EVENTS.has(event)) {
    return 'high';
  }
  if (LOW_VALUE_EVENTS.has(event)) {
    return 'low';
  }
  if (THROTTLED_EVENTS.has(event)) {
    return 'medium';
  }
  return 'medium';
}

function diagnosticThrottleKey(event, payload = {}) {
  return [
    event,
    payload.source || '',
    payload.state || '',
    payload.strategy || '',
    payload.provider || ''
  ].join(':');
}

function httpDiagnosticEvent(entry = {}) {
  if (entry.rateLimited) {
    return 'http_request_rate_limited';
  }
  if (entry.errorMessage || (entry.statusCode && entry.statusCode >= 400)) {
    return 'http_request_error';
  }
  return 'http_request_success';
}

function createDiagnosticsPolicy(options = {}) {
  return new DiagnosticsPolicy(options);
}

const defaultDiagnosticsPolicy = createDiagnosticsPolicy();

module.exports = {
  DiagnosticsPolicy,
  HIGH_VALUE_EVENTS,
  LOW_VALUE_EVENTS,
  THROTTLED_EVENTS,
  createDiagnosticsPolicy,
  defaultDiagnosticsPolicy,
  diagnosticPriority,
  httpDiagnosticEvent
};
