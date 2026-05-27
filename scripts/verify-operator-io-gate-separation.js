const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createCombatWitnessRuntime } = require('../src/combat/combatWitnessRuntime');
const { EveGamelogWatcher } = require('../src/combat/eveGamelogWatcher');
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
  await verifiesCombatWitnessStartIsBlockedWhileIoIsOff();
  await verifiesActiveGamelogWatcherDoesNotReadAfterIoTurnsOff();
  await verifiesRuntimeAdmissionDoesNotMutateCombatOrPassiveWhileIoIsOff();
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

async function verifiesCombatWitnessStartIsBlockedWhileIoIsOff() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-sense-io-start-'));
  try {
    const folder = makeGamelogFolder(tempRoot);
    let watcherStarts = 0;
    let watcherStops = 0;
    const runtime = createCombatWitnessRuntime({
      ingestEnabled: false,
      watcher: {
        start: () => {
          watcherStarts += 1;
          return { state: 'watching', path: folder, message: 'should not start' };
        },
        stop: () => {
          watcherStops += 1;
        }
      }
    });

    const configured = runtime.configure({ gamelogFolder: folder });
    assert.strictEqual(configured.configuredPath, folder, 'I/O-off runtime may keep configured gamelog path as support state');
    const blocked = runtime.start();
    assert.strictEqual(blocked.ok, false, 'I/O-off runtime start should not be ok');
    assert.strictEqual(blocked.watcher.state, 'blocked', 'I/O-off runtime start should return blocked watcher state');
    assert.strictEqual(watcherStarts, 0, 'I/O-off runtime start should not start the watcher');
    assert.strictEqual(watcherStops, 1, 'I/O-off runtime start should stop any active watcher handle defensively');

    runtime.setIngestEnabled(true, 'test enables runtime ingest');
    const started = runtime.start();
    assert.strictEqual(started.watcher.state, 'watching', 'runtime start should work after I/O authority is enabled');
    assert.strictEqual(watcherStarts, 1, 'I/O-on runtime start should call watcher start once');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

async function verifiesActiveGamelogWatcherDoesNotReadAfterIoTurnsOff() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-sense-io-read-'));
  try {
    const folder = makeGamelogFolder(tempRoot);
    const logPath = path.join(folder, '20260527_010101_123.txt');
    fs.writeFileSync(logPath, jumpLine('Old', 'Seed'), 'utf8');
    let ingestAllowed = true;
    let readCalls = 0;
    const events = [];
    const watcher = new EveGamelogWatcher({
      watcherStrategy: 'polling',
      isIngestAllowed: () => ingestAllowed,
      readRange: (filePath, start, end) => {
        readCalls += 1;
        return fs.readFileSync(filePath, 'utf8').slice(start, end);
      },
      onEvent: (event) => events.push(event),
      setIntervalFn: () => 1,
      clearIntervalFn: () => {}
    });

    const started = watcher.start(folder);
    assert.strictEqual(started.state, 'watching', 'watcher should start while I/O is on');
    fs.appendFileSync(logPath, jumpLine('Seed', 'Blocked'), 'utf8');
    ingestAllowed = false;

    assert.deepStrictEqual(watcher.pollOnce(), [], 'I/O-off poll should not admit events');
    assert.deepStrictEqual(watcher.handleFile(logPath), [], 'I/O-off handleFile should not admit events');
    assert.strictEqual(readCalls, 0, 'I/O-off watcher should not call readRange after append');
    assert.strictEqual(events.length, 0, 'I/O-off watcher should not emit parser events');

    ingestAllowed = true;
    const admitted = watcher.handleFile(logPath);
    assert.strictEqual(admitted.length, 1, 'watcher should admit appended line after I/O returns on');
    assert.strictEqual(readCalls, 1, 'I/O-on watcher should read the pending tail once');
    watcher.stop();
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

async function verifiesRuntimeAdmissionDoesNotMutateCombatOrPassiveWhileIoIsOff() {
  let passiveRefreshes = 0;
  const passive = createPassiveTelemetryService({
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveSystem: (systemName) => ({
      systemName,
      systemId: 30000142,
      resolved: true
    }),
    esiActivityClient: {
      fetchSystemActivity: async (systemId, options = {}) => {
        passiveRefreshes += 1;
        return normalizeEsiSystemActivity({
          systemId,
          fetchedAt: options.fetchedAt,
          kills: [{ system_id: systemId, ship_kills: 1 }],
          jumps: [{ system_id: systemId, ship_jumps: 2 }]
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
  const runtime = createCombatWitnessRuntime({
    ingestEnabled: false,
    observers: [(event) => passive.observeEvent(event)]
  });

  runtime.observeEvent({
    id: 'blocked-combat-event',
    kind: 'combat.miss',
    source: 'Mining Drone',
    target: 'You',
    eventTime: '2026-05-27T01:01:01.000Z',
    observedAt: '2026-05-27T01:01:01.000Z',
    rawLineHash: 'blocked-combat'
  });
  runtime.observeEvent({
    id: 'blocked-passive-event',
    kind: 'navigation.jump',
    fromSystemName: 'Perimeter',
    systemName: 'Jita',
    eventTime: '2026-05-27T01:01:02.000Z',
    observedAt: '2026-05-27T01:01:02.000Z'
  });

  assert.strictEqual(runtime.snapshot().eventStream.length, 0, 'I/O-off runtime admission should not mutate Combat Witness event stream');
  assert.strictEqual(passive.snapshot().currentSystem, null, 'I/O-off runtime admission should not mutate Passive current system');
  assert.strictEqual(passiveRefreshes, 0, 'I/O-off runtime admission should not trigger Passive provider refresh');

  runtime.setIngestEnabled(true, 'test enables runtime ingest');
  runtime.observeEvent({
    id: 'admitted-combat-event',
    kind: 'combat.miss',
    source: 'Mining Drone',
    target: 'You',
    eventTime: '2026-05-27T01:01:03.000Z',
    observedAt: '2026-05-27T01:01:03.000Z',
    rawLineHash: 'admitted-combat'
  });
  assert.strictEqual(runtime.snapshot().eventStream.length, 1, 'I/O-on runtime admission should still allow Combat Witness computation');
}

function makeGamelogFolder(root) {
  const folder = path.join(root, 'EVE', 'logs', 'Gamelogs');
  fs.mkdirSync(folder, { recursive: true });
  return folder;
}

function jumpLine(from, to) {
  return `[ 2026.05.27 01:01:01 ] (None) Jumping from ${from} to ${to}\n`;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
