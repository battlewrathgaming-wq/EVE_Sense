const { HttpClient } = require('../src/services/httpClient');
const { createDiagnosticsPolicy } = require('../src/services/diagnosticsPolicy');
const { createLiveSmokeHttpClient } = require('../src/services/liveSmokeHttpClient');
const {
  TaskRunner,
  TASK_CLASSIFICATIONS,
  TASK_STATES
} = require('../src/services/taskRunner');

async function main() {
  await verifyTimeout();
  await verifyCancellation();
  await verifySuccessAndLogHook();
  await verifyLiveSmokeSuccessLogHook();
  await verifyInvalidJsonIsNonRetryable();
  await verifyRateLimitRetryExhaustion();
  await verifyServerErrorVisibility();
  console.log('HTTP client verified');
}

async function verifyTimeout() {
  const logs = [];
  const client = new HttpClient({
    timeoutMs: 20,
    fetchImpl: neverFetch,
    onRequestLog: (entry) => logs.push(entry)
  });

  await assertRejects(
    () => client.json('fixture', 'https://example.invalid/timeout'),
    'HTTP_TIMEOUT',
    'timeout request should reject with HTTP_TIMEOUT'
  );
  assert(logs[0].errorMessage === 'HTTP request timed out', 'timeout should be logged clearly');
}

async function verifyCancellation() {
  const runner = new TaskRunner();
  const task = runner.runDetachedTask({
    type: 'http.fixture',
    classification: TASK_CLASSIFICATIONS.EXTERNAL_IO,
    scopeKey: 'fixture'
  }, async ({ signal }) => {
    const client = new HttpClient({
      signal,
      timeoutMs: 1000,
      fetchImpl: neverFetch
    });
    await client.json('fixture', 'https://example.invalid/cancel');
    return { status: TASK_STATES.SUCCEEDED };
  });

  assert(task.status === TASK_STATES.RUNNING, 'detached HTTP fixture should start running');
  runner.cancelTask(task.task_id, 'fixture cancellation');
  const cancelled = await waitForTask(runner, task.task_id);
  assert(cancelled.status === TASK_STATES.CANCELLED, 'cancelled HTTP fixture should finish as cancelled');
  assert(cancelled.error.code === 'TASK_CANCELLED', 'cancelled task should use task cancellation code');
}

async function verifySuccessAndLogHook() {
  const logs = [];
  const client = new HttpClient({
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      text: async () => '{"ok":true}'
    }),
    diagnosticsPolicy: createDiagnosticsPolicy({ mode: 'verbose' }),
    onRequestLog: (entry) => logs.push(entry)
  });

  const result = await client.json('fixture', 'https://example.invalid/success');
  assert(result.ok === true, 'successful response should parse JSON');
  assert(logs[0].statusCode === 200, 'successful response should call log hook');
  assert(logs[0].diagnostic_event === 'http_request_success', 'successful response should identify diagnostic event in verbose mode');
}

async function verifyLiveSmokeSuccessLogHook() {
  const logs = [];
  const client = createLiveSmokeHttpClient({
    fetchImpl: async (_endpoint, options = {}) => ({
      ok: true,
      status: 200,
      headers: { get: () => null },
      requestHeadersSeen: options.headers,
      text: async () => '[{"killmail_id":1,"zkb":{"hash":"safe-ref"}}]'
    }),
    onRequestLog: (entry) => logs.push(entry)
  });

  const result = await client.json('zkill', 'https://example.invalid/smoke-success');
  assert(Array.isArray(result), 'live smoke client should parse successful JSON arrays');
  assert(logs.length === 1, 'live smoke client should capture successful request metadata');
  assert(logs[0].diagnostic_event === 'http_request_success', 'live smoke success should be visible in smoke artifacts');
  assert(logs[0].provider === 'zkill', 'live smoke request log should preserve provider');
  assert(logs[0].endpoint.endsWith('/smoke-success'), 'live smoke request log should preserve endpoint metadata');
  assert(logs[0].method === 'GET', 'live smoke request log should preserve method');
  assert(logs[0].statusCode === 200, 'live smoke request log should preserve status code');
  assert(logs[0].retryCount === 0, 'live smoke request log should preserve retry count');
  assert(logs[0].headers === undefined, 'live smoke request log must not store request headers');
  assert(logs[0].body === undefined && logs[0].data === undefined, 'live smoke request log must not store provider bodies');
}

async function verifyInvalidJsonIsNonRetryable() {
  const logs = [];
  let attempts = 0;
  const client = new HttpClient({
    fetchImpl: async () => {
      attempts += 1;
      return {
        ok: true,
        status: 200,
        text: async () => '{not valid json'
      };
    },
    onRequestLog: (entry) => logs.push(entry)
  });

  await assertRejects(
    () => client.json('fixture', 'https://example.invalid/invalid-json'),
    'HTTP_INVALID_JSON',
    'invalid JSON should reject with HTTP_INVALID_JSON'
  );
  assert(attempts === 1, 'invalid JSON should not be retried');
  assert(logs.length === 1, 'invalid JSON should write one failure log');
  assert(logs[0].errorMessage.includes('invalid JSON'), 'invalid JSON should log clear message');
  assert(!logs[0].statusCode, 'invalid JSON should not be logged as successful status');
}

async function verifyRateLimitRetryExhaustion() {
  const logs = [];
  let attempts = 0;
  const client = new HttpClient({
    maxAttempts: 2,
    fetchImpl: async () => {
      attempts += 1;
      return {
        ok: false,
        status: 429,
        headers: { get: (name) => name === 'retry-after' ? '0.001' : null },
        text: async () => ''
      };
    },
    onRequestLog: (entry) => logs.push(entry)
  });

  await assertRejects(
    () => client.json('zkill', 'https://example.invalid/rate-limited'),
    undefined,
    'rate-limited request should reject after retry exhaustion'
  );
  assert(attempts === 2, 'rate-limited request should retry until configured attempts are exhausted');
  assert(logs[0].statusCode === 429, 'rate limit failure should preserve status code');
  assert(logs[0].rateLimited === true, 'rate limit failure should be operator-visible');
  assert(logs[0].diagnostic_event === 'http_request_rate_limited', 'rate limit failure should use rate-limit diagnostic event');
}

async function verifyServerErrorVisibility() {
  const logs = [];
  const client = new HttpClient({
    maxAttempts: 1,
    fetchImpl: async () => ({
      ok: false,
      status: 500,
      headers: { get: () => null },
      text: async () => ''
    }),
    onRequestLog: (entry) => logs.push(entry)
  });

  await assertRejects(
    () => client.json('esi', 'https://example.invalid/server-error'),
    undefined,
    'server error request should reject'
  );
  assert(logs[0].statusCode === 500, 'server error should preserve status code');
  assert(logs[0].diagnostic_event === 'http_request_error', 'server error should be logged as request error');
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

async function waitForTask(runner, taskId) {
  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    const task = runner.getTask(taskId);
    if (task && task.status !== TASK_STATES.RUNNING && task.status !== TASK_STATES.QUEUED) {
      return task;
    }
    await delay(10);
  }
  throw new Error(`Timed out waiting for task ${taskId}`);
}

async function assertRejects(fn, expectedCode, message) {
  try {
    await fn();
  } catch (error) {
    if (expectedCode !== undefined) {
      assert(error.code === expectedCode, `${message}: expected ${expectedCode}, got ${error.code || error.message}`);
    }
    return;
  }
  throw new Error(message);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
