const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { buildFixtureRows, readCuratedRows } = require('./import-combat-log-fixtures');
const { parseEveLogLine } = require('../src/combat/combatLogParser');
const { CombatWitnessService } = require('../src/combat/combatWitnessService');

const rows = buildFixtureRows(readCuratedRows(path.join(__dirname, '..', 'fixtures', 'combat-log-curated-source.jsonl')));
const byHash = new Map(rows.map((row) => [row.rawLineHash, row]));
const dataset = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'combat-log-replay-dataset.json'), 'utf8'));
const service = new CombatWitnessService({ now: () => Date.parse(dataset.golden.snapshotAt) });

for (const item of dataset.events) {
  const row = byHash.get(item.rawLineHash);
  const event = parseEveLogLine(row.raw, {
    observedAt: new Date(Date.parse('2026-05-22T00:00:00.000Z') + item.at).toISOString()
  });
  service.addEvent(event);
}

const snapshot = service.snapshot(Date.parse(dataset.golden.snapshotAt));
for (const [windowName, expected] of Object.entries(dataset.golden.windows)) {
  const actual = snapshot.windows[windowName];
  assert.ok(actual, `${windowName} snapshot should exist`);
  assert.strictEqual(actual.eventCount, expected.eventCount, `${windowName} event count should match golden`);
  assert.strictEqual(actual.damage.incoming.total, expected.damage.incoming.total, `${windowName} incoming total should match golden`);
  assert.strictEqual(actual.damage.incoming.perSecond, expected.damage.incoming.perSecond, `${windowName} incoming DPS should match golden`);
  assert.deepStrictEqual(actual.damage.incoming.topSource, expected.damage.incoming.topSource, `${windowName} top source should match golden`);
  assert.strictEqual(actual.damage.outgoing.total, expected.damage.outgoing.total, `${windowName} outgoing total should match golden`);
  assert.strictEqual(actual.damage.outgoing.perSecond, expected.damage.outgoing.perSecond, `${windowName} outgoing DPS should match golden`);
  assert.strictEqual(actual.balance.takenDps, expected.balance.takenDps, `${windowName} taken DPS should match golden`);
  assert.strictEqual(actual.balance.dealtDps, expected.balance.dealtDps, `${windowName} dealt DPS should match golden`);
}
assert.strictEqual(snapshot.eventStream.length, dataset.golden.eventStreamCount, 'golden event stream count should match');
assert.strictEqual(snapshot.freshness.eventStreamCount, dataset.golden.eventStreamCount, 'golden freshness stream count should match');

console.log(`combat golden snapshots verified: windows=${Object.keys(dataset.golden.windows).join(',')}`);
