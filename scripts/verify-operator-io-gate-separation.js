const assert = require('node:assert');
const { createCombatWitnessRuntime } = require('../src/combat/combatWitnessRuntime');
const { createLiveIoGate } = require('../src/passive/liveIoGate');
const { createPassiveTelemetryService } = require('../src/passive/passiveTelemetryService');
const { normalizeEsiSystemActivity } = require('../src/passive/esiSystemActivityClient');
const { normalizeZKillSystemContext } = require('../src/passive/zKillSystemContextClient');
const { runClipboardAcquisitionWithGate } = require('../src/threat/clipboardAcquisitionGate');
const { createClipboardAcquisitionService } = require('../src/threat/clipboardAcquisitionService');
const { createThreatIntelService } = require('../src/threat/threatIntelService');
const { createThreatIntelTargetResolver } = require('../src/threat/threatIntelTargetResolver');
const { normalizeThreatZkillRefs } = require('../src/threat/threatIntelZkillClient');

async function main() {
  await verifiesParserJumpFeedsPassiveWithoutThreatScan();
  await verifiesClipboardAndThreatScanDoNotGatePassiveObservation();
  await verifiesClipboardServiceCommandsDoNotReadWhenThreatIoIsOff();
  console.log('operator IO gate separation verified');
}

async function verifiesParserJumpFeedsPassiveWithoutThreatScan() {
  let passiveRefreshes = 0;
  let threatScans = 0;
  const passive = createPassiveTelemetryService({
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveSystem: (systemName) => ({
      systemName,
      systemId: systemName === 'Jita' ? 30000142 : null,
      resolved: systemName === 'Jita'
    }),
    esiActivityClient: {
      fetchSystemActivity: async (systemId, options = {}) => {
        passiveRefreshes += 1;
        return normalizeEsiSystemActivity({
          systemId,
          fetchedAt: options.fetchedAt,
          kills: [{ system_id: systemId, ship_kills: 1, pod_kills: 0, npc_kills: 3 }],
          jumps: [{ system_id: systemId, ship_jumps: 12 }]
        });
      }
    },
    zkillClient: {
      fetchSystemContext: async (systemId, options = {}) => normalizeZKillSystemContext([
        { killmail_id: 9001, zkb: { hash: 'passive-gate-hash' } }
      ], {
        systemId,
        fetchedAt: options.fetchedAt
      })
    }
  });

  const threat = createThreatIntelService({
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveTarget: createThreatIntelTargetResolver(),
    zkillClient: {
      fetchTargetRefs: async (target, options = {}) => {
        threatScans += 1;
        return normalizeThreatZkillRefs([{ killmail_id: 8001, zkb: { hash: 'threat-gate-hash' } }], {
          target,
          fetchedAt: options.fetchedAt
        });
      }
    }
  });
  const runtime = createCombatWitnessRuntime({
    observers: [(event) => passive.observeEvent(event)]
  });

  await runtime.observeEvent({
    id: 'jump-gate-separation',
    kind: 'navigation.jump',
    fromSystemName: 'Perimeter',
    systemName: 'Jita',
    eventTime: '2026-05-25T12:00:00.000Z',
    observedAt: '2026-05-25T12:00:00.000Z'
  });

  assert.strictEqual(passive.snapshot().currentSystem.label, 'Jita', 'parser jump should update Passive current system');
  assert.strictEqual(passiveRefreshes, 1, 'parser jump should refresh Passive context once');
  assert.strictEqual(threatScans, 0, 'parser jump should not invoke Threat scan');

  await threat.scan({ targetText: 'system:Jita', inputSource: 'clipboard' });
  assert.strictEqual(threatScans, 1, 'explicit Threat scan should use Threat path when invoked');
}

async function verifiesClipboardAndThreatScanDoNotGatePassiveObservation() {
  let passiveRefreshes = 0;
  let threatScans = 0;
  const passive = createPassiveTelemetryService({
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveSystem: (systemName) => ({
      systemName,
      systemId: systemName === 'Jita' ? 30000142 : null,
      resolved: systemName === 'Jita'
    }),
    esiActivityClient: {
      fetchSystemActivity: async (systemId, options = {}) => {
        passiveRefreshes += 1;
        return normalizeEsiSystemActivity({
          systemId,
          fetchedAt: options.fetchedAt,
          kills: [{ system_id: systemId, ship_kills: 2 }],
          jumps: [{ system_id: systemId, ship_jumps: 22 }]
        });
      }
    },
    zkillClient: {
      fetchSystemContext: async (systemId, options = {}) => normalizeZKillSystemContext([], {
        systemId,
        fetchedAt: options.fetchedAt
      })
    }
  });
  const threat = createThreatIntelService({
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveTarget: createThreatIntelTargetResolver(),
    zkillClient: {
      fetchTargetRefs: async (target, options = {}) => {
        threatScans += 1;
        return normalizeThreatZkillRefs([], {
          target,
          fetchedAt: options.fetchedAt
        });
      }
    }
  });
  const clipboard = createClipboardAcquisitionService({
    readClipboard: () => 'system:Jita',
    validateTarget: (text) => text === 'system:Jita',
    scan: (request) => threat.scan(request)
  });

  assert.strictEqual(passive.snapshot().currentSystem, null, 'Passive should start without current-system observation');
  const captured = await clipboard.arm({ clipboardText: 'system:Jita' });
  assert.strictEqual(captured.reason, 'captured', 'explicit clipboard shortcut path should capture when invoked');
  assert.strictEqual(threatScans, 1, 'clipboard acquisition should invoke Threat scan');
  assert.strictEqual(passiveRefreshes, 0, 'clipboard acquisition should not refresh Passive');
  assert.strictEqual(passive.snapshot().currentSystem, null, 'Threat scan should not initialize Passive current system');

  await passive.observeEvent({
    id: 'jump-after-threat',
    kind: 'navigation.jump',
    fromSystemName: 'Perimeter',
    systemName: 'Jita',
    eventTime: '2026-05-25T12:01:00.000Z',
    observedAt: '2026-05-25T12:01:00.000Z'
  });
  assert.strictEqual(passive.snapshot().currentSystem.label, 'Jita', 'Passive should still open from parser-observed jump');
  assert.strictEqual(threatScans, 1, 'Passive jump should not trigger another Threat scan');
}

async function verifiesClipboardServiceCommandsDoNotReadWhenThreatIoIsOff() {
  let clipboardReads = 0;
  let threatScans = 0;
  const threatGate = createLiveIoGate({
    enabled: false,
    reason: 'Threat Intel live IO is disabled',
    blockedCode: 'THREAT_LIVE_IO_BLOCKED'
  });
  const clipboard = createClipboardAcquisitionService({
    readClipboard: () => {
      clipboardReads += 1;
      return 'system:Jita';
    },
    validateTarget: (text) => text === 'system:Jita',
    scan: async () => {
      threatScans += 1;
      return { status: 'succeeded' };
    }
  });
  const gatedCommand = (action) => runClipboardAcquisitionWithGate({
    liveIoStatus: () => threatGate.status(),
    action
  });

  const blockedArm = await gatedCommand(() => clipboard.arm());
  assert.strictEqual(blockedArm.state, 'blocked', 'service-command arm should return blocked when Threat IO is off');
  assert.strictEqual(blockedArm.reason, 'io-disabled', 'blocked service-command arm should use compatible blocked reason');
  assert.strictEqual(blockedArm.lastCapture, null, 'blocked service-command arm should not expose capture data');
  assert.strictEqual(clipboardReads, 0, 'service-command arm should not read clipboard when Threat IO is off');

  const blockedCapture = await gatedCommand(() => clipboard.capture());
  assert.strictEqual(blockedCapture.state, 'blocked', 'service-command capture should return blocked when Threat IO is off');
  assert.strictEqual(blockedCapture.reason, 'io-disabled', 'blocked service-command capture should use compatible blocked reason');
  assert.strictEqual(clipboardReads, 0, 'service-command capture should not read clipboard when Threat IO is off');
  assert.strictEqual(threatScans, 0, 'blocked clipboard service commands should not scan Threat Intel');

  threatGate.setEnabled(true, 'test enables Threat Intel live IO');
  const listening = await gatedCommand(() => clipboard.arm());
  assert.strictEqual(listening.state, 'listening', 'service-command arm should still baseline when Threat IO is on');
  assert.strictEqual(clipboardReads, 1, 'service-command arm should read one baseline only after Threat IO is on');
  const unchanged = await gatedCommand(() => clipboard.capture());
  assert.strictEqual(unchanged.state, 'listening', 'service-command capture should ignore unchanged baseline when Threat IO is on');
  assert.strictEqual(clipboardReads, 2, 'service-command capture should read current clipboard only after Threat IO is on');
  assert.strictEqual(threatScans, 0, 'unchanged clipboard should not scan Threat Intel');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
