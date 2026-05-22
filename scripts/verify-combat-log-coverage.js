const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { buildFixtureRows, readCuratedRows } = require('./import-combat-log-fixtures');
const { parseEveLogLine } = require('../src/combat/combatLogParser');

const rows = buildFixtureRows(readCuratedRows(path.join(__dirname, '..', 'fixtures', 'combat-log-curated-source.jsonl')));
const coverage = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'combat-log-event-coverage.json'), 'utf8'));

const summary = { supported: 0, rejected: 0, deferred: 0, unknown: 0 };
for (const [family, entry] of Object.entries(coverage.families)) {
  assert.ok(['supported', 'rejected', 'deferred', 'unknown'].includes(entry.status), `${family} should have valid coverage status`);
  summary[entry.status] += 1;
}

for (const row of rows) {
  const entry = coverage.families[row.proposedFamily];
  assert.ok(entry, `${row.name} proposed family should exist in coverage matrix`);
  const parsed = parseEveLogLine(row.raw, { observedAt: '2026-05-22T00:00:00.000Z' });
  if (row.expectedDisposition === 'accepted') {
    assert.strictEqual(entry.status, 'supported', `${row.name} accepted fixture should map to supported family`);
    assert.ok(parsed, `${row.name} should parse`);
    assert.strictEqual(parsed.kind, entry.parserKind, `${row.name} parser kind should match coverage matrix`);
  }
  if (row.expectedDisposition === 'rejected') {
    assert.ok(['rejected', 'deferred', 'unknown'].includes(entry.status), `${row.name} rejected fixture should not map to supported family`);
    assert.strictEqual(parsed, null, `${row.name} should remain rejected`);
  }
}

console.log(`combat log coverage verified: supported=${summary.supported} rejected=${summary.rejected} deferred=${summary.deferred} unknown=${summary.unknown}`);
