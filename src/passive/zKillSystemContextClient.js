const { HttpClient } = require('../services/httpClient');

const DEFAULT_LIMIT = 10;

class ZKillSystemContextClient {
  constructor({
    httpClient = new HttpClient({ timeoutMs: 10000, maxAttempts: 2 }),
    endpointBase = 'https://zkillboard.com/api',
    limit = DEFAULT_LIMIT
  } = {}) {
    this.httpClient = httpClient;
    this.endpointBase = endpointBase.replace(/\/$/, '');
    this.limit = limit;
  }

  async fetchSystemContext(systemId, options = {}) {
    const id = Number(systemId);
    if (!Number.isInteger(id) || id < 1) {
      const error = new Error('zKill system context requires a numeric system ID');
      error.code = 'ZKILL_SYSTEM_ID_REQUIRED';
      throw error;
    }

    const endpoint = `${this.endpointBase}/systemID/${id}/`;
    const data = await this.httpClient.json('zkill', endpoint, {
      signal: options.signal
    });
    return normalizeZKillSystemContext(data, {
      systemId: id,
      fetchedAt: options.fetchedAt || new Date().toISOString(),
      limit: this.limit
    });
  }
}

function normalizeZKillSystemContext(data, { systemId, fetchedAt, limit = DEFAULT_LIMIT } = {}) {
  if (!Array.isArray(data)) {
    return {
      systemId,
      fetchedAt,
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
    sampleCount: refs.length,
    capped: data.length > limit,
    partial: failures.length > 0,
    failures,
    refs
  };
}

module.exports = {
  DEFAULT_LIMIT,
  ZKillSystemContextClient,
  normalizeZKillSystemContext
};
