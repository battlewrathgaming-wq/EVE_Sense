const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { CombatWitnessService } = require('../src/combat/combatWitnessService');
const { EveGamelogWatcher } = require('../src/combat/eveGamelogWatcher');

const snapshots = [];
const traces = [];
const service = new CombatWitnessService({
  eventStreamLimit: 2,
  onSnapshot: (snapshot) => snapshots.push(snapshot),
  trace: (event, payload) => traces.push({ event, payload })
});

const seenEvents = [];
service.subscribeEvents((event) => seenEvents.push(event));
service.subscribeEvents(() => {
  throw new Error('event listener failed');
});
service.subscribeSnapshots(() => {
  throw new Error('snapshot listener failed');
});

service.addEvent(combatDamage('old-hit', '2026-05-22T00:59:50.000Z', 100));
service.addEvent(combatDamage('hit-30s', '2026-05-22T01:00:11.000Z', 30));
service.addEvent(combatDamage('hit-15s', '2026-05-22T01:00:21.000Z', 15));
service.addEvent(combatDamage('spike-15s', '2026-05-22T01:00:22.000Z', 60, {
  sourceLabel: 'Pirate Frigate',
  weaponLabel: 'Light Missile',
  hitQuality: 'Penetrates',
  damageType: 'thermal'
}));
service.addEvent(combatRepair('repair-15s', '2026-05-22T01:00:24.000Z', 9));
service.addEvent(combatDamage('hit-5s', '2026-05-22T01:00:26.000Z', 5));
service.addEvent({
  id: 'miss-1',
  kind: 'combat.miss',
  direction: 'incoming',
  sourceLabel: 'Mining Drone',
  targetLabel: 'you',
  eventTime: '2026-05-22T01:00:27.000Z'
});

const snapshot = service.snapshot(Date.parse('2026-05-22T01:00:28.000Z'));
assert.strictEqual(snapshot.kind, 'combat.witness.snapshot', 'snapshot should identify its kind');
assert.strictEqual(snapshot.freshness.status, 'recent', 'snapshot should expose backend-owned recent freshness');
assert.strictEqual(snapshot.freshness.eventStreamCount, 2, 'snapshot freshness should expose bounded event count');
assert.strictEqual(snapshot.windows['5s'].damage.incoming.total, 5, '5s window should include only recent damage');
assert.strictEqual(snapshot.windows['15s'].damage.incoming.total, 80, '15s window should include 15s, spike, and 5s damage');
assert.strictEqual(snapshot.windows['30s'].damage.incoming.total, 110, '30s window should include 30s, 15s, spike, and 5s damage');
assert.strictEqual(snapshot.windows['15s'].repair.incoming.total, 9, '15s window should aggregate incoming repairs');
assert.strictEqual(snapshot.windows['15s'].repair.incoming.perSecond, 0.6, '15s window should compute incoming HPS');
assert.strictEqual(snapshot.windows['15s'].balance.receivedRepairMinusDamagePerSecond, -4.73, '15s repair balance should remain observed HPS minus DPS');
assert.deepStrictEqual(
  snapshot.windows['15s'].damage.incoming.sourceCounts,
  { 'Mining Drone': 2, 'Pirate Frigate': 1 },
  '15s window should expose incoming attacker counts'
);
assert.deepStrictEqual(
  snapshot.windows['15s'].damage.incoming.hitQualityCounts,
  { Hits: 2, Penetrates: 1 },
  '15s window should expose hit quality counts'
);
assert.deepStrictEqual(
  snapshot.windows['15s'].damage.incoming.mostObservedWeaponType,
  { label: 'Light Missile', count: 1 },
  '15s window should expose most observed weapon type'
);
assert.deepStrictEqual(
  snapshot.windows['15s'].damage.incoming.spikeOutliers.map((event) => ({
    id: event.id,
    amount: event.amount,
    shipLabel: event.shipLabel,
    weaponLabel: event.weaponLabel
  })),
  [{ id: 'spike-15s', amount: 60, shipLabel: 'Pirate Frigate', weaponLabel: 'Light Missile' }],
  '15s window should expose damage spike outliers with observed ship label'
);
assert.strictEqual(snapshot.eventStream.length, 2, 'event stream should stay bounded separately from metrics');
assert.deepStrictEqual(
  snapshot.eventStream.map((event) => event.id),
  ['miss-1', 'hit-5s'],
  'event stream should keep newest one-shot items'
);
assert.ok(snapshots.length >= 5, 'service should emit snapshots as events arrive');
assert.ok(seenEvents.length >= 5, 'event fan-out should notify listeners');
assert.ok(traces.some((entry) => entry.event === 'combat_event_listener_error'), 'event listener failures should be isolated');
assert.ok(traces.some((entry) => entry.event === 'combat_snapshot_listener_error'), 'snapshot listener failures should be isolated');

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-sense-combat-core-'));
try {
  const folder = path.join(tempRoot, 'EVE', 'logs', 'Gamelogs');
  fs.mkdirSync(folder, { recursive: true });
  const logPath = path.join(folder, '20260522_010101_123.txt');
  fs.writeFileSync(logPath, '[ 2026.05.22 01:01:01 ] (None) Jumping from Old to Seeded\n');
  let intervalCallback = null;
  let intervalMs = null;
  const watcherTraces = [];
  const watcherEvents = [];
  const watcher = new EveGamelogWatcher({
    watcherStrategy: 'polling',
    pollIntervalMs: 250,
    setIntervalFn: (callback, ms) => {
      intervalCallback = callback;
      intervalMs = ms;
      return { callback, ms };
    },
    clearIntervalFn: () => {},
    onEvent: (event) => watcherEvents.push(event),
    trace: (event, payload) => watcherTraces.push({ event, payload })
  });

  const status = watcher.start(folder);
  assert.strictEqual(status.strategy, 'polling', 'polling watcher should report active strategy');
  assert.strictEqual(intervalMs, 250, 'polling watcher should use configured interval');
  assert.strictEqual(watcherEvents.length, 0, 'polling watcher should seed existing content without replay');

  append(logPath, '[ 2026.05.22 01:01:02 ] (combat) Mining Drone misses you completely\n');
  intervalCallback();
  assert.strictEqual(watcherEvents.length, 1, 'polling watcher should parse appended complete lines');
  assert.strictEqual(watcherEvents[0].kind, 'combat.miss', 'polling watcher should preserve parser semantics');
  assert.ok(watcherTraces.some((entry) => entry.event === 'watcher_strategy' && entry.payload.strategy === 'polling'), 'polling strategy should be diagnostic');
  watcher.stop();

  const originalWatch = fs.watch;
  const fallbackTraces = [];
  let fallbackIntervalCallback = null;
  try {
    fs.watch = () => {
      throw new Error('fs.watch unavailable');
    };
    const fallbackWatcher = new EveGamelogWatcher({
      watcherStrategy: 'auto',
      setIntervalFn: (callback, ms) => {
        fallbackIntervalCallback = callback;
        return { callback, ms };
      },
      clearIntervalFn: () => {},
      trace: (event, payload) => fallbackTraces.push({ event, payload })
    });
    const fallbackStatus = fallbackWatcher.start(folder);
    assert.strictEqual(fallbackStatus.strategy, 'polling', 'auto watcher should fall back to polling when fs.watch creation fails');
    assert.ok(typeof fallbackIntervalCallback === 'function', 'auto fallback should install polling callback');
    assert.ok(
      fallbackTraces.some((entry) => entry.event === 'watcher_strategy_fallback' && entry.payload.to === 'polling'),
      'auto fallback should emit diagnostic trace'
    );
    fallbackWatcher.stop();
  } finally {
    fs.watch = originalWatch;
  }
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log('combat witness core verified');

function combatDamage(id, eventTime, amount, overrides = {}) {
  return {
    id,
    kind: 'combat.damage',
    direction: 'incoming',
    amount,
    sourceLabel: 'Mining Drone',
    targetLabel: 'you',
    hitQuality: 'Hits',
    eventTime,
    ...overrides
  };
}

function combatRepair(id, eventTime, amount) {
  return {
    id,
    kind: 'combat.repair',
    direction: 'incoming',
    amount,
    sourceLabel: 'Logistics Wingmate',
    targetLabel: 'you',
    eventTime
  };
}

function append(filePath, text) {
  fs.appendFileSync(filePath, text);
}
