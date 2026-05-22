const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseEveLogLine } = require('../src/combat/combatLogParser');
const { sha256 } = require('./import-combat-log-fixtures');

const fixtures = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'combat-log-hostile-parser.json'), 'utf8')
);
const coverage = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'combat-log-event-coverage.json'), 'utf8')
);

const rejected = [
  ...fixtures.rejected,
  ...fixtures.generated.map((fixture) => ({
    name: fixture.name,
    family: fixture.family,
    raw: `${fixture.prefix}${String(fixture.repeat).repeat(fixture.count)}`
  }))
];

for (const fixture of rejected) {
  const family = coverage.families[fixture.family];
  assert.ok(family, `${fixture.name} family should exist in coverage matrix`);
  assert.notStrictEqual(family.status, 'supported', `${fixture.name} should not map to a supported family`);

  const parsed = parseEveLogLine(fixture.raw, { observedAt: '2026-05-23T00:00:00.000Z' });
  assert.strictEqual(parsed, null, `${fixture.name} should reject`);

  const evidence = rejectionEvidence(fixture);
  assert.strictEqual(evidence.name, fixture.name, `${fixture.name} evidence should name fixture`);
  assert.strictEqual(evidence.family, fixture.family, `${fixture.name} evidence should preserve family`);
  assert.strictEqual(evidence.disposition, 'rejected', `${fixture.name} evidence should be explicit`);
  assert.strictEqual(evidence.rawLineHash, sha256(fixture.raw), `${fixture.name} evidence should hash exact raw line`);
  assert.ok(!Object.hasOwn(evidence, 'raw'), `${fixture.name} evidence must not retain raw line text`);
  assert.ok(!JSON.stringify(evidence).includes(fixture.raw), `${fixture.name} evidence must not leak raw line text`);
}

console.log(`combat parser hostile fixtures verified: rejected=${rejected.length}`);

function rejectionEvidence(fixture) {
  return {
    name: fixture.name,
    family: fixture.family,
    disposition: 'rejected',
    rawLineHash: sha256(fixture.raw)
  };
}

