const { HttpClient } = require('../services/httpClient');

const DEFAULT_CACHE_MS = 60 * 60 * 1000;
const ESI_BASE = 'https://esi.evetech.net/latest';

class PassiveEsiSystemActivityClient {
  constructor({
    httpClient = new HttpClient({ timeoutMs: 10000, maxAttempts: 2 }),
    endpointBase = ESI_BASE,
    cacheMs = DEFAULT_CACHE_MS,
    now = () => Date.now(),
    trace = () => {}
  } = {}) {
    this.httpClient = httpClient;
    this.endpointBase = endpointBase.replace(/\/$/, '');
    this.cacheMs = cacheMs;
    this.now = now;
    this.trace = trace;
    this.cache = new Map();
  }

  async fetchSystemActivity(systemId, options = {}) {
    const id = Number(systemId);
    if (!Number.isInteger(id) || id < 1) {
      const error = new Error('ESI system activity requires a numeric system ID');
      error.code = 'ESI_SYSTEM_ID_REQUIRED';
      throw error;
    }

    const cached = this.cache.get(id);
    const nowMs = this.now();
    if (cached && nowMs - cached.cachedAtMs <= this.cacheMs) {
      this.trace('passive_esi_activity_cached', { systemId: id, cacheAgeMs: nowMs - cached.cachedAtMs });
      return {
        ...cached.record,
        cache: {
          ...cached.record.cache,
          cacheAgeMs: nowMs - cached.cachedAtMs,
          state: 'fresh'
        }
      };
    }

    const headers = cached?.etag ? { 'If-None-Match': cached.etag } : {};
    const killsEndpoint = `${this.endpointBase}/universe/system_kills/`;
    const jumpsEndpoint = `${this.endpointBase}/universe/system_jumps/`;

    const [killsResult, jumpsResult] = await Promise.all([
      this.fetchJsonWithMeta('esi', killsEndpoint, { signal: options.signal, headers }),
      this.fetchJsonWithMeta('esi', jumpsEndpoint, { signal: options.signal, headers })
    ]);

    if (cached && killsResult.statusCode === 304 && jumpsResult.statusCode === 304) {
      const record = {
        ...cached.record,
        fetchedAt: new Date(nowMs).toISOString(),
        cache: {
          ...cached.record.cache,
          cacheAgeMs: 0,
          state: 'revalidated',
          revalidated: true
        }
      };
      this.cache.set(id, { record, cachedAtMs: nowMs, etag: cached.etag });
      return record;
    }

    const record = normalizeEsiSystemActivity({
      systemId: id,
      kills: killsResult.data,
      jumps: jumpsResult.data,
      fetchedAt: options.fetchedAt || new Date(nowMs).toISOString(),
      cacheMs: this.cacheMs,
      etag: killsResult.etag || jumpsResult.etag || null,
      conditional: Boolean(cached?.etag),
      revalidated: Boolean(cached)
    });
    this.cache.set(id, { record, cachedAtMs: nowMs, etag: record.cache.etag });
    return record;
  }

  async fetchJsonWithMeta(provider, endpoint, options = {}) {
    if (typeof this.httpClient.jsonWithMeta === 'function') {
      return this.httpClient.jsonWithMeta(provider, endpoint, options);
    }
    const data = await this.httpClient.json(provider, endpoint, options);
    return { data, statusCode: 200, etag: null };
  }
}

function normalizeEsiSystemActivity({ systemId, kills, jumps, fetchedAt, cacheMs = DEFAULT_CACHE_MS, etag = null, conditional = false, revalidated = false } = {}) {
  const killRow = Array.isArray(kills) ? kills.find((entry) => Number(entry?.system_id) === Number(systemId)) : null;
  const jumpRow = Array.isArray(jumps) ? jumps.find((entry) => Number(entry?.system_id) === Number(systemId)) : null;
  return {
    systemId,
    fetchedAt,
    shipKills: Number(killRow?.ship_kills) || 0,
    podKills: Number(killRow?.pod_kills) || 0,
    npcKills: Number(killRow?.npc_kills) || 0,
    jumps: Number(jumpRow?.ship_jumps) || 0,
    partial: !Array.isArray(kills) || !Array.isArray(jumps),
    failures: [
      ...(!Array.isArray(kills) ? [{ code: 'ESI_KILLS_RESPONSE_NOT_ARRAY', message: 'ESI system kills response was not an array' }] : []),
      ...(!Array.isArray(jumps) ? [{ code: 'ESI_JUMPS_RESPONSE_NOT_ARRAY', message: 'ESI system jumps response was not an array' }] : [])
    ],
    cache: {
      cacheMs,
      cacheAgeMs: 0,
      state: revalidated ? 'revalidated' : 'refreshed',
      etag,
      conditional,
      revalidated
    }
  };
}

module.exports = {
  DEFAULT_CACHE_MS,
  PassiveEsiSystemActivityClient,
  normalizeEsiSystemActivity
};
