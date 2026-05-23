const assert = require('node:assert');
const { createLiveIoGate } = require('../src/passive/liveIoGate');
const { createClipboardAcquisitionService } = require('../src/threat/clipboardAcquisitionService');
const { createThreatIntelService, normalizeScanRequest } = require('../src/threat/threatIntelService');
const { createThreatIntelTargetResolver } = require('../src/threat/threatIntelTargetResolver');
const { ThreatIntelZkillClient, normalizeThreatZkillRefs } = require('../src/threat/threatIntelZkillClient');

;(async () => {
  const empty = normalizeScanRequest({ targetText: '' });
  assert.strictEqual(empty.ok, false, 'empty Threat Intel request should fail validation');
  const normalized = normalizeScanRequest({ targetText: 'system:Jita', inputSource: 'clipboard', lookbackSeconds: 120, sampleLimit: 3 });
  assert.strictEqual(normalized.ok, true, 'valid Threat Intel request should normalize');
  assert.strictEqual(normalized.request.inputSource, 'clipboard', 'clipboard input should use same request contract');
  assert.strictEqual(normalized.request.lookbackSeconds, 120, 'lookback should be normalized');
  assert.strictEqual(normalized.request.sampleLimit, 3, 'sample limit should be normalized');
  const defaultWindow = normalizeScanRequest({ targetText: 'system:Jita' });
  assert.strictEqual(defaultWindow.request.lookbackSeconds, 3600, 'Threat Intel should default to a one-hour zKill pulse');

  const resolver = createThreatIntelTargetResolver();
  const jita = resolver({ targetText: 'system:Jita' });
  assert.strictEqual(jita.status, 'resolved', 'resolver should resolve prefixed system target');
  assert.strictEqual(jita.kind, 'system', 'resolver should preserve system kind');
  assert.strictEqual(jita.id, 30000142, 'resolver should return local system ID');
  assert.strictEqual(resolver({ targetText: 'Ambiguous Example' }).status, 'ambiguous', 'unprefixed duplicate target should be ambiguous');
  assert.strictEqual(resolver({ targetText: 'ship:Rifter' }).status, 'unsupported', 'unsupported prefixes should be rejected');
  assert.strictEqual(resolver({ targetText: 'system:Unknown' }).status, 'unresolved', 'unknown exact target should stay unresolved');

  let endpoint = null;
  const zkillClient = new ThreatIntelZkillClient({
    sampleLimit: 2,
    httpClient: {
      json: async (_provider, nextEndpoint) => {
        endpoint = nextEndpoint;
        return [
          { killmail_id: 101, zkb: { hash: 'a' } },
          { killmail_id: null, zkb: {} },
          { killmail_id: 102, zkb: { hash: 'b' } }
        ];
      }
    }
  });
  const probe = await zkillClient.fetchTargetRefs(jita, { lookbackSeconds: 3600 });
  assert.ok(endpoint.endsWith('/systemID/30000142/pastSeconds/3600/'), 'Threat Intel zKill route should be scoped');
  assert.strictEqual(probe.discoveredCount, 3, 'probe should expose discovered count');
  assert.strictEqual(probe.selectedCount, 1, 'probe should keep valid refs only within sample cap');
  assert.strictEqual(probe.capped, true, 'probe should expose capped samples');
  assert.strictEqual(probe.partial, true, 'probe should expose malformed refs as partial');

  const malformed = normalizeThreatZkillRefs(null, { target: jita, fetchedAt: '2026-05-22T00:00:00.000Z' });
  assert.strictEqual(malformed.partial, true, 'non-array zKill response should be partial');
  assert.strictEqual(malformed.failedCount, 1, 'non-array zKill response should record failure');

  let blockedCalls = 0;
  const blockedService = createThreatIntelService({
    liveIoGate: createLiveIoGate({ enabled: false }),
    resolveTarget: resolver,
    zkillClient: {
      fetchTargetRefs: async () => {
        blockedCalls += 1;
      }
    }
  });
  const blocked = await blockedService.scan({ targetText: 'system:Jita', inputSource: 'search' });
  assert.strictEqual(blocked.status, 'blocked', 'disabled live IO should block Threat Intel scans');
  assert.strictEqual(blocked.failure.code, 'PASSIVE_LIVE_IO_BLOCKED', 'blocked scan should expose gate code');
  assert.strictEqual(blockedCalls, 0, 'blocked scan should not call zKill');

  const blockedClipboard = await blockedService.scan({ targetText: 'system:Jita', inputSource: 'clipboard' });
  assert.strictEqual(blockedClipboard.status, 'blocked', 'disabled live IO should block clipboard Threat Intel scans');
  assert.strictEqual(blockedCalls, 0, 'blocked clipboard scan should not call zKill');

  const successService = createThreatIntelService({
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveTarget: resolver,
    now: () => Date.parse('2026-05-22T06:00:00.000Z'),
    zkillClient: {
      fetchTargetRefs: async (target, options = {}) => normalizeThreatZkillRefs([
        { killmail_id: 201, zkb: { hash: 'success' } }
      ], {
        target,
        fetchedAt: options.fetchedAt,
        endpointFamily: 'systemID',
        lookbackSeconds: options.lookbackSeconds,
        sampleLimit: options.sampleLimit
      })
    }
  });
  const success = await successService.scan({ targetText: 'system:Jita', inputSource: 'clipboard', sampleLimit: 1 });
  assert.strictEqual(success.status, 'succeeded', 'live-enabled injected scan should succeed');
  assert.strictEqual(success.zkill.selectedCount, 1, 'successful scan should expose selected sample count');
  assert.strictEqual(success.zkill.discoveredCount, 1, 'successful scan should expose one-hour killmail count');
  assert.strictEqual(success.message, '1 killmail in 1h', 'successful scan should read as a last-hour count');

  let nowMs = Date.parse('2026-05-22T07:00:00.000Z');
  let clipboardText = 'old clipboard';
  const captureService = createClipboardAcquisitionService({
    now: () => nowMs,
    readClipboard: () => clipboardText,
    scan: (request) => successService.scan(request),
    validateTarget: (text) => text === 'system:Jita'
  });
  assert.strictEqual(captureService.snapshot().state, 'idle', 'clipboard acquisition should start idle');
  const immediate = await captureService.arm({ clipboardText: 'system:Jita' });
  assert.strictEqual(immediate.state, 'cooldown', 'shortcut acquisition should capture current clipboard immediately');
  assert.strictEqual(immediate.lastCapture.targetText, 'system:Jita', 'shortcut acquisition should retain immediate clipboard target');
  nowMs += 6000;
  assert.strictEqual(captureService.tick().state, 'idle', 'immediate shortcut acquisition should cool down cleanly');
  await captureService.arm();
  assert.strictEqual(captureService.snapshot().state, 'listening', 'clipboard acquisition should enter listening state');
  const unchanged = await captureService.capture();
  assert.strictEqual(unchanged.state, 'listening', 'unchanged clipboard content should keep listening');
  clipboardText = 'system:Jita';
  const captured = await captureService.capture();
  assert.strictEqual(captured.state, 'cooldown', 'successful capture should seal into cooldown');
  assert.strictEqual(captured.lastCapture.targetText, 'system:Jita', 'successful capture should retain target text');
  const cooldown = await captureService.arm();
  assert.strictEqual(cooldown.state, 'cooldown', 'clipboard acquisition should not re-arm during cooldown');
  nowMs += 6000;
  assert.strictEqual(captureService.tick().state, 'idle', 'clipboard acquisition should return idle after cooldown');
  await captureService.arm();
  nowMs += 4000;
  assert.strictEqual(captureService.tick().state, 'cooldown', 'clipboard acquisition timeout should seal into cooldown');

  console.log('threat intel verified');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
