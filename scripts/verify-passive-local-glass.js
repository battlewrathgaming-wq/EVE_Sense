const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { buildPassiveLocalGlassData } = require('./generate-passive-local-glass-fixtures');

const ROOT = path.join(__dirname, '..');
const TRIAL_DIR = path.join(ROOT, 'trials', 'passive-local-glass');
const GENERATED_INPUT = path.join(TRIAL_DIR, 'sense-trial-readouts.json');
const RUNTIME_FILES = [
  'inspect-head.html',
  'instrument-readout-panel.js',
  'instrument-readout-panel.css',
  'sense-trial-readouts.json'
];
const FORBIDDEN_LAB_LABELS = ['CURRENT', 'AGED', 'PARTIAL', 'UNAVAILABLE', 'FALLBACK', 'NO DATA'];
const FORBIDDEN_RUNTIME_REFERENCES = [
  'F:\\Projects\\AURA- Lab',
  'AURA- Lab',
  'example-readouts.json',
  'electron',
  'preload',
  'ipc',
  'service registry',
  'SmokeFlash',
  'Pane Board',
  'Wayfinder'
];

function main() {
  assertTrialFilesPresent();
  assertNoSymlinks();
  assertGeneratedInputCurrent();
  assertSenseReadouts();
  assertRuntimeFilesAreLocalStatic();
  console.log('passive local glass verified');
}

function assertTrialFilesPresent() {
  for (const fileName of [
    'README.md',
    'MANIFEST.md',
    ...RUNTIME_FILES
  ]) {
    assert.ok(fs.existsSync(path.join(TRIAL_DIR, fileName)), `expected trial file ${fileName}`);
  }

  assert.strictEqual(fs.existsSync(path.join(TRIAL_DIR, 'index.html')), false, 'Lab selector page should not be staged');
  assert.strictEqual(fs.existsSync(path.join(TRIAL_DIR, 'example-readouts.json')), false, 'Lab example data should not be staged as Sense input');
}

function assertNoSymlinks() {
  for (const fileName of fs.readdirSync(TRIAL_DIR)) {
    const stat = fs.lstatSync(path.join(TRIAL_DIR, fileName));
    assert.strictEqual(stat.isSymbolicLink(), false, `${fileName} must not be a symlink`);
  }
}

function assertGeneratedInputCurrent() {
  const expected = `${JSON.stringify(buildPassiveLocalGlassData(), null, 2)}\n`;
  const actual = fs.readFileSync(GENERATED_INPUT, 'utf8');
  assert.strictEqual(actual, expected, 'Sense glass input should be generated from the Passive mapper chain');
}

function assertSenseReadouts() {
  const data = JSON.parse(fs.readFileSync(GENERATED_INPUT, 'utf8'));
  assert.deepStrictEqual(
    data.meta.sourceChain,
    [
      'passive.telemetry.snapshot fixture',
      'mapPassiveTelemetryAdapter',
      'mapPassiveStaticHeadTrial',
      'glass readout input'
    ],
    'generated input should name the accepted mapper chain'
  );
  assert.deepStrictEqual(
    data.readouts.map((readout) => readout.id),
    [
      'passive-fresh',
      'passive-stale',
      'passive-partial',
      'passive-capped',
      'passive-blocked',
      'passive-degraded',
      'passive-no-observation'
    ],
    'generated input should cover all accepted Passive fixture states'
  );

  for (const label of FORBIDDEN_LAB_LABELS) {
    assert.strictEqual(
      data.readouts.some((readout) => readout.state.label === label),
      false,
      `generated input must not import Lab ${label} state label`
    );
  }
  const serialized = JSON.stringify(data);
  assert.ok(serialized.includes('I/O off - ingest blocked'), 'generated input should preserve blocked authority wording');
  assert.ok(serialized.includes('No observation'), 'generated input should preserve no-observation wording');
  assert.ok(serialized.includes('Passive Telemetry'), 'generated input should preserve Passive lane label');
}

function assertRuntimeFilesAreLocalStatic() {
  for (const fileName of RUNTIME_FILES) {
    const text = fs.readFileSync(path.join(TRIAL_DIR, fileName), 'utf8');
    for (const reference of FORBIDDEN_RUNTIME_REFERENCES) {
      assert.strictEqual(
        text.toLowerCase().includes(reference.toLowerCase()),
        false,
        `${fileName} should not contain runtime/external reference ${reference}`
      );
    }
  }

  const html = fs.readFileSync(path.join(TRIAL_DIR, 'inspect-head.html'), 'utf8');
  const js = fs.readFileSync(path.join(TRIAL_DIR, 'instrument-readout-panel.js'), 'utf8');
  assert.ok(html.includes('instrument-readout-panel.js'), 'inspection page should load local glass script');
  assert.ok(js.includes("fetch('./sense-trial-readouts.json'"), 'glass script should load Sense-generated input');
  assert.strictEqual(js.includes('innerHTML'), false, 'glass script should not render arbitrary HTML');
  assert.ok(js.includes('textContent'), 'glass script should render display text through textContent');
}

main();
