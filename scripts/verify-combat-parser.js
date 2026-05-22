const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { CombatRollingWindow } = require('../src/combat/combatRollingWindow');
const { parseEveLogLine } = require('../src/combat/combatLogParser');
const { collectCompleteLines } = require('../src/combat/lineBuffer');
const { RecentEventDeduper } = require('../src/combat/recentEventDeduper');

const fixtures = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'combat-log-parser.json'), 'utf8')
);

for (const fixture of fixtures.accepted) {
  const event = parseEveLogLine(fixture.raw, { observedAt: '2026-05-22T00:00:00.000Z' });
  assert.ok(event, `${fixture.name} should parse`);
  for (const [key, value] of Object.entries(fixture.expect)) {
    assert.deepStrictEqual(event[key], value, `${fixture.name} should set ${key}`);
  }
  assert.ok(event.id, `${fixture.name} should include stable id`);
  assert.ok(event.rawLineHash, `${fixture.name} should include raw line hash`);
  assert.ok(event.eventTime, `${fixture.name} should include source event time`);
}

for (const fixture of fixtures.rejected) {
  assert.strictEqual(parseEveLogLine(fixture.raw), null, `${fixture.name} should be rejected`);
}

const overlongLine = `[ 2021.11.02 18:23:52 ] (combat) ${'x'.repeat(4100)}`;
assert.strictEqual(parseEveLogLine(overlongLine), null, 'overlong lines should be rejected');

const sameLine = fixtures.accepted[0].raw;
const first = parseEveLogLine(sameLine, { observedAt: '2026-05-22T00:00:00.000Z' });
const second = parseEveLogLine(sameLine, { observedAt: '2026-05-22T00:00:01.000Z' });
assert.strictEqual(first.id, second.id, 'same raw event should produce stable id');

const deduper = new RecentEventDeduper({ ttlMs: 5000 });
assert.strictEqual(deduper.isDuplicate(first, 1000), false, 'first event should not be duplicate');
assert.strictEqual(deduper.isDuplicate(second, 2000), true, 'same event inside TTL should be duplicate');
assert.strictEqual(deduper.isDuplicate(second, 8000), false, 'same event after TTL should be accepted again');

const chunkA = '[ 2021.11.02 17:13:51 ] (None) Jumping from Iyen-Oursta to Faurent\r\n[ 2021.11.02';
const bufferedA = collectCompleteLines({ chunk: chunkA });
assert.deepStrictEqual(
  bufferedA.lines,
  ['[ 2021.11.02 17:13:51 ] (None) Jumping from Iyen-Oursta to Faurent'],
  'line buffer should emit complete lines'
);
assert.strictEqual(bufferedA.partial, '[ 2021.11.02', 'line buffer should retain incomplete line');

const chunkB = ` 17:46:19 ] (combat) <color=0xff00ffff><b>53</b> <color=0x77ffffff><font size=10>to</font> <b><color=0xffffffff>Locced</b><font size=10><color=0x77ffffff> - 250mm Light 'Scout' Artillery I - Grazes\n`;
const bufferedB = collectCompleteLines({ chunk: chunkB, partial: bufferedA.partial });
assert.strictEqual(bufferedB.lines.length, 1, 'line buffer should complete retained partial on next chunk');
assert.strictEqual(bufferedB.partial, '', 'line buffer should clear completed partial');

const dropped = collectCompleteLines({ chunk: 'x'.repeat(12), maxPartialLength: 4 });
assert.strictEqual(dropped.partialDropped, true, 'oversized partial should be dropped');
assert.strictEqual(dropped.partial, '', 'dropped partial should not be retained');

const incoming = parseEveLogLine(fixtures.accepted[0].raw);
const outgoing = parseEveLogLine(fixtures.accepted[1].raw);
const repair = {
  id: 'synthetic-repair',
  kind: 'combat.repair',
  direction: 'incoming',
  amount: 30,
  eventTime: '2021-11-02T18:23:55.000Z'
};
const window = new CombatRollingWindow({ windowMs: 15000 });
window.add(incoming);
window.add(outgoing);
window.add(repair);
window.add({
  id: 'synthetic-thermal-hit',
  kind: 'combat.damage',
  direction: 'incoming',
  amount: 12,
  damageType: 'thermal',
  hitQuality: 'Hits',
  sourceLabel: 'Mining Drone',
  targetLabel: 'you',
  eventTime: '2021-11-02T18:23:54.000Z'
});
window.add({
  id: 'synthetic-kinetic-hit',
  kind: 'combat.damage',
  direction: 'incoming',
  amount: 15,
  damageType: 'kinetic',
  hitQuality: 'Penetrates',
  sourceLabel: 'Pithi Invader',
  targetLabel: 'you',
  eventTime: '2021-11-02T18:23:55.000Z'
});
window.add({
  id: 'synthetic-thermal-hit-2',
  kind: 'combat.damage',
  direction: 'incoming',
  amount: 9,
  damageType: 'thermal',
  hitQuality: 'Hits',
  sourceLabel: 'Pithi Invader',
  targetLabel: 'you',
  eventTime: '2021-11-02T18:23:56.000Z'
});
window.add({
  id: 'synthetic-thermal-hit-3',
  kind: 'combat.damage',
  direction: 'incoming',
  amount: 6,
  damageType: 'thermal',
  hitQuality: 'Hits',
  sourceLabel: 'Pithi Invader',
  targetLabel: 'you',
  eventTime: '2021-11-02T18:23:56.000Z'
});
const snapshot = window.snapshot(Date.parse('2021-11-02T18:23:56.000Z'));
assert.strictEqual(snapshot.damage.incoming.total, 45, 'incoming damage should aggregate in 15s window');
assert.strictEqual(snapshot.damage.incoming.perSecond, 3, 'incoming DPS should divide by 15s');
assert.strictEqual(snapshot.damage.incoming.hitQualityCounts.Hits, 4, 'incoming hit quality should count');
assert.strictEqual(snapshot.damage.outgoing.total, 0, 'old outgoing damage should be outside 15s window');
assert.strictEqual(snapshot.repair.incoming.total, 30, 'repair should aggregate in 15s window');
assert.strictEqual(snapshot.repair.incoming.perSecond, 2, 'repair HPS should divide by 15s');
assert.deepStrictEqual(snapshot.damage.incoming.mostCommonDamageType, { label: 'thermal', count: 3 }, 'incoming damage type should report most common known type');
assert.deepStrictEqual(snapshot.damage.incoming.mostCommonHitQuality, { label: 'Hits', count: 4 }, 'incoming hit quality should report most common quality');
assert.strictEqual(snapshot.damage.incoming.uniqueSourceCount, 2, 'incoming source count should count unique source labels');
assert.deepStrictEqual(snapshot.damage.incoming.topSource, { label: 'Pithi Invader', count: 3 }, 'incoming source counts should report top source');
assert.strictEqual(snapshot.balance.takenDps, 3, 'balance should expose damage taken DPS');
assert.strictEqual(snapshot.balance.repairReceivedHps, 2, 'balance should expose repair received HPS');
assert.strictEqual(snapshot.balance.receivedRepairMinusDamagePerSecond, -1, 'balance should expose received HPS minus taken DPS');

const prunedWindow = new CombatRollingWindow({ windowMs: 15000 });
prunedWindow.add({
  id: 'old-hit',
  kind: 'combat.damage',
  direction: 'incoming',
  amount: 99,
  eventTime: '2021-11-02T18:00:00.000Z'
});
prunedWindow.add({
  id: 'new-hit',
  kind: 'combat.damage',
  direction: 'incoming',
  amount: 1,
  eventTime: '2021-11-02T18:01:00.000Z'
});
assert.strictEqual(prunedWindow.events.length, 1, 'rolling window should prune expired events on add');
assert.strictEqual(prunedWindow.events[0].id, 'new-hit', 'rolling window should retain the newest in-window event');

const cappedWindow = new CombatRollingWindow({ windowMs: 60000, maxEvents: 3 });
for (let index = 0; index < 5; index += 1) {
  cappedWindow.add({
    id: `cap-${index}`,
    kind: 'combat.damage',
    direction: 'incoming',
    amount: 1,
    eventTime: `2021-11-02T18:00:0${index}.000Z`
  });
}
assert.deepStrictEqual(
  cappedWindow.events.map((event) => event.id),
  ['cap-2', 'cap-3', 'cap-4'],
  'rolling window should cap retained events under append-heavy input'
);

console.log('combat parser verified');
