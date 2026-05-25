const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { EveGamelogWatcher } = require('../src/combat/eveGamelogWatcher');
const { RecentEventDeduper } = require('../src/combat/recentEventDeduper');
const { createDiagnosticsPolicy } = require('../src/services/diagnosticsPolicy');
const { projectRoot } = require('../src/util/tempPaths');

const tempBase = path.join(projectRoot(), '.tmp', 'verify-gamelog-watcher-chaos');
fs.rmSync(tempBase, { recursive: true, force: true });
fs.mkdirSync(tempBase, { recursive: true });
const tempRoot = fs.mkdtempSync(path.join(tempBase, 'run-'));

try {
  verifyOffsetSeedingAndAppendOnly();
  verifyContainmentGuards();
  verifyPollingFallbackAndTick();
  verifyDuplicateTtlBursts();
  verifyTailReadFailureDoesNotAdvanceOffset();
  verifyFailureIsolationAndSanitization();
  console.log('gamelog watcher chaos verified');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function verifyOffsetSeedingAndAppendOnly() {
  const folder = makeFolder('append-only');
  const oldA = writeLog(folder, '20260523_010000_A.txt', jumpLine('OldA', 'SeedA'));
  const oldB = writeLog(folder, '20260523_010000_B.txt', jumpLine('OldB', 'SeedB'));
  const events = [];
  const rejected = [];
  const traces = [];
  const watcher = new EveGamelogWatcher({
    watcherStrategy: 'polling',
    onEvent: (event) => events.push(event),
    onRejectedLine: (line) => rejected.push(line),
    trace: (event, payload) => traces.push({ event, payload }),
    setIntervalFn: () => 1,
    clearIntervalFn: () => {}
  });

  watcher.start(folder);
  assert.strictEqual(events.length, 0, 'existing multi-file content should seed without replay');
  assert.strictEqual(watcher.handleFile(oldA).length, 0, 'seeded file should not replay without append');
  assert.strictEqual(watcher.handleFile(oldB).length, 0, 'second seeded file should not replay without append');

  append(oldA, jumpLine('SeedA', 'FutureA'));
  assert.strictEqual(watcher.handleFile(oldA).length, 1, 'future append should parse from seeded offset');
  const offsetBeforeReplacement = watcher.offsets.get(path.resolve(oldA));
  replaceFileWith(oldA, `${'x'.repeat(offsetBeforeReplacement)}${jumpLine('Replacement', 'ShouldNotRead')}`);
  assert.strictEqual(watcher.handleFile(oldA).length, 0, 'same-size or larger replacement should seed new identity without replaying replacement tail');
  assert.ok(traces.some((entry) => entry.event === 'file_replaced'), 'same-size or larger replacement should be observable');
  append(oldA, jumpLine('ShouldNotRead', 'FutureAfterIdentityChange'));
  assert.strictEqual(watcher.handleFile(oldA).length, 1, 'future append after identity replacement should parse');

  const newFile = writeLog(folder, '20260523_020000_NEW.txt', jumpLine('OldNew', 'SeedNew'));
  assert.strictEqual(watcher.handleFile(newFile).length, 0, 'newly discovered file should seed current content');
  append(newFile, jumpLine('SeedNew', 'FutureNew'));
  assert.strictEqual(watcher.handleFile(newFile).length, 1, 'new file future append should parse');

  append(oldA, '[ 2026.05.23 01:00:03 ] (combat) Mining Drone misses you');
  assert.strictEqual(watcher.handleFile(oldA).length, 0, 'partial line should wait for completion');
  append(oldA, ' completely\n');
  assert.strictEqual(watcher.handleFile(oldA).length, 1, 'partial line across appends should emit once');

  fs.writeFileSync(oldA, jumpLine('Replacement', 'ShouldNotReplay'));
  assert.strictEqual(watcher.handleFile(oldA).length, 0, 'truncated or replaced file content should not replay');
  assert.ok(traces.some((entry) => entry.event === 'file_truncated'), 'truncation should be observable');
  append(oldA, jumpLine('ShouldNotReplay', 'FutureAfterReplacement'));
  assert.strictEqual(watcher.handleFile(oldA).length, 1, 'future append after replacement should parse');

  fs.rmSync(newFile);
  assert.deepStrictEqual(watcher.handleFile(newFile), [], 'deleted file event should be harmless');
  append(oldB, '[ 2026.05.23 01:00:04 ] (notify) private line should hash only\n');
  watcher.handleFile(oldB);
  assert.strictEqual(rejected.length, 1, 'unparsed line should be rejected');
  assert.ok(rejected[0].rawLineHash, 'unparsed rejection should include hash evidence');
  assert.strictEqual(rejected[0].line, undefined, 'unparsed rejection should not retain raw line text');
  assert.doesNotMatch(JSON.stringify(rejected[0]), /private line/, 'rejection evidence should not leak raw line content');

  watcher.stop();
}

function verifyContainmentGuards() {
  const folder = makeFolder('containment');
  const outside = path.join(tempRoot, 'outside-containment.txt');
  writeLog(folder, '20260523_021000_A.txt', '');
  fs.writeFileSync(outside, jumpLine('Outside', 'ShouldNotRead'));
  const traces = [];
  const events = [];
  const watcher = new EveGamelogWatcher({
    watcherStrategy: 'polling',
    onEvent: (event) => events.push(event),
    trace: (event, payload) => traces.push({ event, payload }),
    setIntervalFn: () => 1,
    clearIntervalFn: () => {}
  });
  watcher.start(folder);

  assert.deepStrictEqual(watcher.handleFile(outside), [], 'direct handleFile outside active folder should be skipped');
  assert.ok(
    traces.some((entry) => entry.event === 'file_skipped_outside_containment' && entry.payload.reason === 'outside_active_folder'),
    'outside direct handleFile should be observable without reading'
  );

  const separatorLike = path.join(folder, '..', 'escape.txt');
  fs.writeFileSync(separatorLike, jumpLine('Separator', 'ShouldNotRead'));
  assert.deepStrictEqual(watcher.handleFile(separatorLike), [], 'separator/traversal-like path should be skipped before read');

  const symlinkTarget = path.join(tempRoot, 'symlink-target.txt');
  fs.writeFileSync(symlinkTarget, jumpLine('LinkTarget', 'ShouldNotRead'));
  const symlinkPath = path.join(folder, '20260523_021001_LINK.txt');
  const symlinkCreated = tryCreateFileSymlink(symlinkTarget, symlinkPath);
  if (symlinkCreated) {
    assert.deepStrictEqual(watcher.handleFile(symlinkPath), [], 'symlink log file should be skipped before read');
    assert.ok(
      traces.some((entry) => entry.event === 'file_skipped_outside_containment' && entry.payload.reason === 'link_file'),
      'symlink log file skip should be observable'
    );
  }

  let fsWatchCallback = null;
  const originalWatch = fs.watch;
  fs.watch = (_folderPath, _options, callback) => {
    fsWatchCallback = callback;
    return { on: () => {}, close: () => {} };
  };
  try {
    const watchTraces = [];
    const fsWatcher = new EveGamelogWatcher({
      watcherStrategy: 'fs-watch',
      diagnosticsPolicy: createDiagnosticsPolicy({ mode: 'verbose' }),
      trace: (event, payload) => watchTraces.push({ event, payload })
    });
    fsWatcher.start(folder);
    fsWatchCallback('rename', '..\\escape.txt');
    fsWatchCallback('rename', '../escape.txt');
    assert.ok(
      watchTraces.some((entry) => entry.event === 'file_skipped_outside_containment' && entry.payload.reason === 'unsafe_filename'),
      'fs-watch separator-like filenames should be skipped before path join reads'
    );
    fsWatcher.stop();
  } finally {
    fs.watch = originalWatch;
  }

  assert.strictEqual(events.length, 0, 'containment skips should emit no parsed events');
  watcher.stop();
}

function verifyPollingFallbackAndTick() {
  const folder = makeFolder('fallback');
  const logPath = writeLog(folder, '20260523_030000_A.txt', jumpLine('Old', 'Seed'));
  const traces = [];
  let pollCallback = null;
  const originalWatch = fs.watch;
  fs.watch = () => {
    throw new Error('fs.watch unavailable in chaos test');
  };
  try {
    const watcher = new EveGamelogWatcher({
      watcherStrategy: 'auto',
      trace: (event, payload) => traces.push({ event, payload }),
      setIntervalFn: (callback) => {
        pollCallback = callback;
        return 42;
      },
      clearIntervalFn: () => {}
    });
    const status = watcher.start(folder);
    assert.strictEqual(status.state, 'watching', 'auto watcher should stay watching after fs-watch failure');
    assert.strictEqual(status.strategy, 'polling', 'auto watcher should fall back to polling');
    assert.ok(traces.some((entry) => entry.event === 'watcher_strategy_fallback'), 'fallback should be traced');
    assert.strictEqual(typeof pollCallback, 'function', 'polling strategy should register a poll callback');
    append(logPath, jumpLine('Seed', 'Polled'));
    pollCallback();
    append(logPath, jumpLine('Polled', 'PolledDirect'));
    const polled = watcher.pollOnce();
    assert.strictEqual(polled.length, 1, 'poll callback should read future appended lines');
    watcher.stop();
  } finally {
    fs.watch = originalWatch;
  }
}

function verifyDuplicateTtlBursts() {
  const deduper = new RecentEventDeduper({ ttlMs: 1000 });
  const event = { id: 'same-event', rawLineHash: 'same-hash' };
  assert.strictEqual(deduper.isDuplicate(event, 1000), false, 'first burst event should pass');
  assert.strictEqual(deduper.isDuplicate(event, 1200), true, 'duplicate inside TTL should suppress');
  assert.strictEqual(deduper.isDuplicate(event, 2501), false, 'duplicate after TTL should pass again');
}

function verifyTailReadFailureDoesNotAdvanceOffset() {
  const folder = makeFolder('tail-read-failure');
  const logPath = writeLog(folder, '20260523_035000_A.txt', '');
  const traces = [];
  const statuses = [];
  let failOnce = true;
  const watcher = new EveGamelogWatcher({
    watcherStrategy: 'polling',
    onStatus: (status) => statuses.push(status),
    trace: (event, payload) => traces.push({ event, payload }),
    readRange: (filePath, start, end) => {
      if (failOnce) {
        failOnce = false;
        throw new Error('simulated permission churn');
      }
      return fs.readFileSync(filePath, 'utf8').slice(start, end);
    },
    setIntervalFn: () => 1,
    clearIntervalFn: () => {}
  });

  watcher.offsets.set(logPath, 0);
  append(logPath, `${jumpLine('SecretSeed', 'FutureAfterFailure')}`);
  assert.deepStrictEqual(watcher.handleFile(logPath), [], 'failed range read should emit no events');
  assert.strictEqual(watcher.offsets.get(logPath), 0, 'failed range read must not advance past unread bytes');
  assert.strictEqual(statuses.at(-1).state, 'error', 'failed range read should degrade watcher status');
  assert.ok(traces.some((entry) => entry.event === 'tail_read_failed'), 'failed range read should be diagnostic');
  assert.doesNotMatch(JSON.stringify(traces), /SecretSeed|FutureAfterFailure/, 'failed range read diagnostics should not leak unread log text');

  const recovered = watcher.handleFile(logPath);
  assert.strictEqual(recovered.length, 1, 'next successful read should consume previously unread bytes');
  assert.strictEqual(watcher.offsets.get(logPath), fs.statSync(logPath).size, 'successful read should advance offset after bytes are read');
  watcher.stop();
}

function verifyFailureIsolationAndSanitization() {
  const folder = makeFolder('failures');
  const logPath = writeLog(folder, '20260523_040000_A.txt', '');
  const rejected = [];
  const traces = [];
  const events = [];
  const watcher = new EveGamelogWatcher({
    parseLine: (line) => {
      if (line.includes('throw-parser')) {
        throw new Error('parser boom with raw sentinel');
      }
      return {
        id: line,
        kind: 'navigation.jump',
        eventTime: '2026-05-23T04:00:00.000Z',
        rawLineHash: `hash-${line}`
      };
    },
    onRejectedLine: (line) => rejected.push(line),
    onEvent: (event) => {
      if (event.id.includes('listener-throws')) {
        throw new Error('listener boom');
      }
      events.push(event);
    },
    trace: (event, payload) => traces.push({ event, payload })
  });
  watcher.offsets.set(logPath, 0);
  append(logPath, 'throw-parser raw-secret\nlistener-throws\nlistener-continues\n');
  const handled = watcher.handleFile(logPath);
  assert.strictEqual(handled.length, 2, 'parser failure should not stop following events');
  assert.strictEqual(events.length, 1, 'listener failure should not stop following listener calls');
  assert.strictEqual(events[0].id, 'listener-continues', 'listener should receive event after listener failure');
  assert.strictEqual(rejected[0].reason, 'parser_error', 'parser exception should be rejected as parser_error');
  assert.ok(rejected[0].rawLineHash, 'parser exception should preserve hash evidence');
  assert.strictEqual(rejected[0].line, undefined, 'parser exception should not retain raw text');
  assert.ok(traces.some((entry) => entry.event === 'listener_error'), 'listener errors should be traced');
  assert.doesNotMatch(JSON.stringify(rejected), /raw-secret/, 'parser rejection should not leak raw text');
  assert.doesNotMatch(JSON.stringify(traces), /raw-secret/, 'traces should not leak parser raw text');
}

function makeFolder(name) {
  const folder = path.join(tempRoot, name, 'EVE', 'logs', 'Gamelogs');
  fs.mkdirSync(folder, { recursive: true });
  return folder;
}

function writeLog(folder, name, text) {
  const filePath = path.join(folder, name);
  fs.writeFileSync(filePath, text, 'utf8');
  return filePath;
}

function append(filePath, text) {
  fs.appendFileSync(filePath, text, 'utf8');
}

function replaceFileWith(filePath, text) {
  const replacementPath = `${filePath}.replacement`;
  fs.writeFileSync(replacementPath, text, 'utf8');
  fs.rmSync(filePath, { force: true });
  fs.renameSync(replacementPath, filePath);
}

function tryCreateFileSymlink(target, linkPath) {
  try {
    fs.symlinkSync(target, linkPath, 'file');
    return true;
  } catch {
    return false;
  }
}

function jumpLine(from, to) {
  return `[ 2026.05.23 01:00:00 ] (None) Jumping from ${from} to ${to}\n`;
}
