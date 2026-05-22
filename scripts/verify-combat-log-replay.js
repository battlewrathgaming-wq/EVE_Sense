const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { buildFixtureRows, readCuratedRows } = require('./import-combat-log-fixtures');
const { collectCompleteLines } = require('../src/combat/lineBuffer');
const { parseEveLogLine } = require('../src/combat/combatLogParser');
const { RecentEventDeduper } = require('../src/combat/recentEventDeduper');
const { createCombatWitnessRuntime } = require('../src/combat/combatWitnessRuntime');
const { CombatWitnessService } = require('../src/combat/combatWitnessService');

const rows = buildFixtureRows(readCuratedRows(path.join(__dirname, '..', 'fixtures', 'combat-log-curated-source.jsonl')));
const byHash = new Map(rows.map((row) => [row.rawLineHash, row]));
const dataset = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'combat-log-replay-dataset.json'), 'utf8'));

const service = new CombatWitnessService({
  now: () => Date.parse(dataset.golden.snapshotAt)
});
const fanOut = [];
const listenerErrors = [];
const runtime = createCombatWitnessRuntime({
  service,
  observers: [
    (event) => fanOut.push(event),
    () => {
      throw new Error('intentional replay listener isolation check');
    }
  ],
  trace: (event, payload) => {
    if (event === 'combat_runtime_observer_error') {
      listenerErrors.push(payload);
    }
  }
});
let partial = '';
const replayed = [];

for (const item of dataset.events) {
  const row = byHash.get(item.rawLineHash);
  assert.ok(row, `dataset row ${item.rawLineHash} should resolve to curated fixture`);
  const splitAt = Math.max(1, Math.floor(row.raw.length / 2));
  const chunks = [`${row.raw.slice(0, splitAt)}`, `${row.raw.slice(splitAt)}\r\n`];
  for (const chunk of chunks) {
    const collected = collectCompleteLines({ chunk, partial });
    partial = collected.partial;
    for (const line of collected.lines) {
      const event = parseEveLogLine(line, { observedAt: new Date(Date.parse('2026-05-22T00:00:00.000Z') + item.at).toISOString() });
      if (!event) {
        continue;
      }
      runtime.observeEvent(event);
      replayed.push(event);
    }
  }
}

assert.strictEqual(partial, '', 'replay should not leave a partial line');
assert.ok(replayed.length >= 5, 'replay should emit normalized events');
const deduper = new RecentEventDeduper({ ttlMs: 5000 });
const duplicateA = parseEveLogLine(byHash.get(dataset.events[0].rawLineHash).raw);
const duplicateB = parseEveLogLine(byHash.get(dataset.events[0].rawLineHash).raw);
assert.strictEqual(deduper.isDuplicate(duplicateA, 1000), false, 'first replay event should not be duplicate');
assert.strictEqual(deduper.isDuplicate(duplicateB, 2000), true, 'duplicate replay event should be suppressed');
assert.strictEqual(fanOut.length, replayed.length, 'runtime fan-out should observe every replayed event');
assert.ok(listenerErrors.length >= 1, 'listener isolation should record observer errors');

const snapshot = service.snapshot(Date.parse(dataset.golden.snapshotAt));
assert.strictEqual(snapshot.windows['5s'].damage.incoming.total, dataset.golden.windows['5s'].damage.incoming.total, '5s incoming damage should match golden');
assert.strictEqual(snapshot.windows['15s'].damage.incoming.perSecond, dataset.golden.windows['15s'].damage.incoming.perSecond, '15s incoming DPS should match golden');
assert.strictEqual(snapshot.windows['30s'].balance.takenDps, dataset.golden.windows['30s'].balance.takenDps, '30s balance should match golden');
assert.strictEqual(snapshot.eventStream.length, dataset.golden.eventStreamCount, 'event stream retention should match golden');

console.log(`combat log replay verified: events=${replayed.length} stream=${snapshot.eventStream.length}`);
