const { HttpClient } = require('../services/httpClient');
const { normalizePastSeconds } = require('../passive/zKillSystemContextClient');

const DEFAULT_THREAT_LOOKBACK_SECONDS = 86400;
const DEFAULT_THREAT_SAMPLE_LIMIT = 10;
const ROUTES = Object.freeze({
  system: 'systemID',
  pilot: 'characterID',
  corporation: 'corporationID',
  alliance: 'allianceID'
});

class ThreatIntelZkillClient {
  constructor({
    httpClient = new HttpClient({ timeoutMs: 10000, maxAttempts: 2 }),
    endpointBase = 'https://zkillboard.com/api',
    lookbackSeconds = DEFAULT_THREAT_LOOKBACK_SECONDS,
    sampleLimit = DEFAULT_THREAT_SAMPLE_LIMIT
  } = {}) {
    this.httpClient = httpClient;
    this.endpointBase = endpointBase.replace(/\/$/, '');
    this.lookbackSeconds = lookbackSeconds;
    this.sampleLimit = sampleLimit;
  }

  async fetchTargetRefs(target, options = {}) {
    const route = ROUTES[target?.kind];
    if (!route || !target?.id) {
      const error = new Error('Threat Intel zKill probe requires a resolved zKill target');
      error.code = 'THREAT_TARGET_UNSUPPORTED_FOR_ZKILL';
      throw error;
    }
    const lookbackSeconds = normalizePastSeconds(options.lookbackSeconds || this.lookbackSeconds);
    const endpoint = `${this.endpointBase}/${route}/${target.id}/pastSeconds/${lookbackSeconds}/`;
    const data = await this.httpClient.json('zkill', endpoint, { signal: options.signal });
    return normalizeThreatZkillRefs(data, {
      provider: 'zkill',
      endpointFamily: route,
      target,
      fetchedAt: options.fetchedAt || new Date().toISOString(),
      lookbackSeconds,
      sampleLimit: options.sampleLimit || this.sampleLimit
    });
  }
}

function normalizeThreatZkillRefs(data, {
  provider = 'zkill',
  endpointFamily = null,
  target = null,
  fetchedAt,
  lookbackSeconds = DEFAULT_THREAT_LOOKBACK_SECONDS,
  sampleLimit = DEFAULT_THREAT_SAMPLE_LIMIT
} = {}) {
  if (!Array.isArray(data)) {
    return {
      provider,
      endpointFamily,
      target,
      fetchedAt,
      lookbackSeconds,
      sampleLimit,
      discoveredCount: 0,
      selectedCount: 0,
      malformedCount: 0,
      failedCount: 1,
      capped: false,
      partial: true,
      failures: [{ code: 'ZKILL_RESPONSE_NOT_ARRAY', message: 'zKill response was not an array' }],
      refs: []
    };
  }

  const refs = [];
  const failures = [];
  for (const item of data.slice(0, sampleLimit)) {
    const killmailId = Number(item?.killmail_id);
    const hash = item?.zkb?.hash || item?.hash || null;
    if (!Number.isInteger(killmailId) || !hash) {
      failures.push({ code: 'ZKILL_REF_MALFORMED', message: 'zKill ref missing killmail_id or hash' });
      continue;
    }
    refs.push({ killmailId, hash });
  }

  return {
    provider,
    endpointFamily,
    target,
    fetchedAt,
    lookbackSeconds,
    sampleLimit,
    discoveredCount: data.length,
    selectedCount: refs.length,
    malformedCount: failures.length,
    failedCount: failures.length,
    capped: data.length > sampleLimit,
    partial: failures.length > 0,
    failures,
    refs
  };
}

module.exports = {
  DEFAULT_THREAT_LOOKBACK_SECONDS,
  DEFAULT_THREAT_SAMPLE_LIMIT,
  ROUTES,
  ThreatIntelZkillClient,
  normalizeThreatZkillRefs
};
