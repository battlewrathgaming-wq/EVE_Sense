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
  const event = materializeDatasetEvent(item);
  if (event) {
    service.addEvent(event);
  }
}

const snapshot = service.snapshot(Date.parse(dataset.golden.snapshotAt));
for (const [windowName, expected] of Object.entries(dataset.golden.windows)) {
  const actual = snapshot.windows[windowName];
  assert.ok(actual, `${windowName} snapshot should exist`);
  assertExpectedSubset(actual, expected, windowName);
}
assert.strictEqual(snapshot.eventStream.length, dataset.golden.eventStreamCount, 'golden event stream count should match');
assert.strictEqual(snapshot.freshness.eventStreamCount, dataset.golden.eventStreamCount, 'golden freshness stream count should match');

console.log(`combat golden snapshots verified: windows=${Object.keys(dataset.golden.windows).join(',')}`);

function materializeDatasetEvent(item) {
  if (item.kind === 'normalized') {
    return {
      observedAt: observedAtFor(item),
      ...item.event
    };
  }

  const row = byHash.get(item.rawLineHash);
  assert.ok(row, `golden dataset row ${item.rawLineHash} should resolve to curated fixture`);
  const event = parseEveLogLine(row.raw, { observedAt: observedAtFor(item) });
  if (!event) {
    return null;
  }
  return {
    ...event,
    id: item.id || event.id,
    eventTime: item.eventTime || event.eventTime,
    observedAt: observedAtFor(item)
  };
}

function observedAtFor(item) {
  const baseMs = Date.parse(dataset.baseObservedAt || '2026-05-22T00:00:00.000Z');
  return new Date(baseMs + (item.at || 0)).toISOString();
}

function assertExpectedSubset(actual, expected, label) {
  if (expected === null || typeof expected !== 'object' || Array.isArray(expected)) {
    assert.deepStrictEqual(actual, expected, `${label} should match golden`);
    return;
  }

  for (const [key, expectedValue] of Object.entries(expected)) {
    assert.ok(Object.prototype.hasOwnProperty.call(actual, key), `${label}.${key} should exist`);
    assertExpectedSubset(actual[key], expectedValue, `${label}.${key}`);
  }
}
