const { HttpClient } = require('../services/httpClient');

const DEFAULT_LIMIT = 10;
const DEFAULT_PAST_SECONDS = 3600;

class ZKillSystemContextClient {
  constructor({
    httpClient = new HttpClient({ timeoutMs: 10000, maxAttempts: 2 }),
    endpointBase = 'https://zkillboard.com/api',
    limit = DEFAULT_LIMIT,
    pastSeconds = DEFAULT_PAST_SECONDS
  } = {}) {
    this.httpClient = httpClient;
    this.endpointBase = endpointBase.replace(/\/$/, '');
    this.limit = limit;
    this.pastSeconds = pastSeconds;
  }

  async fetchSystemContext(systemId, options = {}) {
    const id = Number(systemId);
    if (!Number.isInteger(id) || id < 1) {
      const error = new Error('zKill system context requires a numeric system ID');
      error.code = 'ZKILL_SYSTEM_ID_REQUIRED';
      throw error;
    }

    const pastSeconds = normalizePastSeconds(options.pastSeconds || this.pastSeconds);
    const endpoint = `${this.endpointBase}/systemID/${id}/pastSeconds/${pastSeconds}/`;
    const data = await this.httpClient.json('zkill', endpoint, {
      signal: options.signal
    });
    return normalizeZKillSystemContext(data, {
      systemId: id,
      fetchedAt: options.fetchedAt || new Date().toISOString(),
      limit: this.limit,
      pastSeconds
    });
  }
}

function normalizeZKillSystemContext(data, { systemId, fetchedAt, limit = DEFAULT_LIMIT, pastSeconds = DEFAULT_PAST_SECONDS } = {}) {
  if (!Array.isArray(data)) {
    return {
      systemId,
      fetchedAt,
      pastSeconds,
      sampleCount: 0,
      capped: false,
      partial: true,
      failures: [{ code: 'ZKILL_RESPONSE_NOT_ARRAY', message: 'zKill system context response was not an array' }],
      refs: []
    };
  }

  const refs = [];
  const failures = [];
  for (const item of data.slice(0, limit)) {
    const killmailId = Number(item?.killmail_id);
    const hash = item?.zkb?.hash || item?.hash || null;
    if (!Number.isInteger(killmailId) || !hash) {
      failures.push({ code: 'ZKILL_REF_MALFORMED', message: 'zKill ref missing killmail_id or hash' });
      continue;
    }
    refs.push({ killmailId, hash });
  }

  return {
    systemId,
    fetchedAt,
    pastSeconds,
    sampleCount: refs.length,
    capped: data.length > limit,
    partial: failures.length > 0,
    failures,
    refs
  };
}

function normalizePastSeconds(value) {
  const seconds = Number(value);
  if (!Number.isInteger(seconds) || seconds < 60 || seconds > 86400) {
    return DEFAULT_PAST_SECONDS;
  }
  return seconds;
}

module.exports = {
  DEFAULT_LIMIT,
  DEFAULT_PAST_SECONDS,
  ZKillSystemContextClient,
  normalizePastSeconds,
  normalizeZKillSystemContext
};
