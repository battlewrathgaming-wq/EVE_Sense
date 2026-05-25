const { createDiagnosticsPolicy } = require('./diagnosticsPolicy');
const { HttpClient } = require('./httpClient');

function createLiveSmokeHttpClient({
  timeoutMs = 10000,
  maxAttempts = 2,
  onRequestLog = null,
  ...options
} = {}) {
  return new HttpClient({
    ...options,
    timeoutMs,
    maxAttempts,
    diagnosticsPolicy: createDiagnosticsPolicy({ mode: 'verbose' }),
    onRequestLog
  });
}

module.exports = {
  createLiveSmokeHttpClient
};
