const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { EveGamelogWatcher, validateGamelogFolder } = require('../src/combat/eveGamelogWatcher');
const { defaultGamelogFolder, normalizeGamelogFolder } = require('../src/combat/eveLogPaths');

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-sense-gamelog-'));

try {
  assert.strictEqual(
    defaultGamelogFolder({ homeDir: 'C:\\Users\\Pilot', platform: 'win32' }),
    path.join('C:\\Users\\Pilot', 'Documents', 'EVE', 'logs', 'Gamelogs'),
    'Windows default should point at Documents/EVE/logs/Gamelogs'
  );
  assert.strictEqual(normalizeGamelogFolder(''), null, 'blank folder path should normalize to null');
  assert.strictEqual(validateGamelogFolder(path.join(tempRoot, 'missing')).state, 'missing', 'missing path should fail validation');

  const folder = path.join(tempRoot, 'Gamelogs');
  fs.mkdirSync(folder, { recursive: true });
  const logPath = path.join(folder, '20260522_010101_123.txt');
  fs.writeFileSync(logPath, '[ 2026.05.22 01:01:01 ] (None) Jumping from Old to Seeded\n');

  const statuses = [];
  const rejected = [];
  const events = [];
  const traces = [];
  const watcher = new EveGamelogWatcher({
    onStatus: (status) => statuses.push(status),
    onRejectedLine: (line) => rejected.push(line),
    onEvent: (event) => events.push(event),
    trace: (event, payload) => traces.push({ event, payload })
  });

  const status = watcher.start(folder);
  assert.strictEqual(status.state, 'watching', 'valid folder should enter watching state');
  assert.strictEqual(events.length, 0, 'existing log content should be seeded, not replayed');

  append(logPath, '[ 2026.05.22 01:01:02 ] (None) Jumping from Seeded to Appended\n');
  const appendedEvents = watcher.handleFile(logPath);
  assert.strictEqual(appendedEvents.length, 1, 'appended jump line should emit one event');
  assert.strictEqual(appendedEvents[0].kind, 'navigation.jump', 'appended line should parse as jump');
  assert.strictEqual(appendedEvents[0].systemName, 'Appended', 'jump target should be parsed');

  append(logPath, '[ 2026.05.22 01:01:03 ] (notify) ignored\n');
  watcher.handleFile(logPath);
  assert.strictEqual(rejected.length, 1, 'unparsed appended lines should be reported as rejected');

  append(logPath, '[ 2026.05.22 01:01:04 ] (combat) Mining Drone misses you');
  assert.strictEqual(watcher.handleFile(logPath).length, 0, 'partial line should not emit until newline');
  append(logPath, ' completely\n');
  const partialEvents = watcher.handleFile(logPath);
  assert.strictEqual(partialEvents.length, 1, 'completed partial line should emit once');
  assert.strictEqual(partialEvents[0].kind, 'combat.miss', 'completed partial should parse');

  append(logPath, '[ 2026.05.22 01:01:05 ] (combat) Mining Drone misses you completely\n');
  append(logPath, '[ 2026.05.22 01:01:05 ] (combat) Mining Drone misses you completely\n');
  const duplicateEvents = watcher.handleFile(logPath);
  assert.strictEqual(duplicateEvents.length, 1, 'duplicate appended events should be suppressed');

  const newLogPath = path.join(folder, '20260522_020202_123.txt');
  fs.writeFileSync(newLogPath, '[ 2026.05.22 02:02:02 ] (None) Jumping from Old to NewFileSeed\n');
  assert.strictEqual(watcher.handleFile(newLogPath).length, 0, 'newly discovered file should seed current size');
  append(newLogPath, '[ 2026.05.22 02:02:03 ] (None) Jumping from NewFileSeed to Future\n');
  assert.strictEqual(watcher.handleFile(newLogPath).length, 1, 'new file future append should parse');

  watcher.stop();
  assert.ok(statuses.some((entry) => entry.state === 'watching'), 'watcher should report watching status');

  const parserFailures = [];
  const parserFailureWatcher = new EveGamelogWatcher({
    parseLine: (line) => {
      if (line.includes('throw-parser')) {
        throw new Error('parser boom');
      }
      return {
        id: line,
        kind: 'navigation.jump',
        eventTime: '2026-05-22T01:01:10.000Z',
        rawLineHash: line
      };
    },
    onRejectedLine: (line) => parserFailures.push(line),
    onEvent: (event) => events.push(event)
  });
  const parserFailureLog = path.join(folder, '20260522_030303_123.txt');
  fs.writeFileSync(parserFailureLog, '');
  parserFailureWatcher.offsets.set(parserFailureLog, 0);
  append(parserFailureLog, 'throw-parser\nok-after-parser-error\n');
  const parserFailureEvents = parserFailureWatcher.handleFile(parserFailureLog);
  assert.strictEqual(parserFailures.length, 1, 'parser exceptions should report rejected line');
  assert.strictEqual(parserFailures[0].reason, 'parser_error', 'parser exception should use parser_error reason');
  assert.ok(parserFailures[0].rawLineHash, 'parser exception report should include raw line hash');
  assert.strictEqual(parserFailures[0].line, undefined, 'parser exception report should not retain raw line text');
  assert.strictEqual(parserFailureEvents.length, 1, 'watcher should continue after parser exception');

  const listenerTraces = [];
  const listenerWatcher = new EveGamelogWatcher({
    parseLine: (line) => ({
      id: line,
      kind: 'navigation.jump',
      eventTime: '2026-05-22T01:01:10.000Z',
      rawLineHash: line
    }),
    onEvent: (event) => {
      if (event.id === 'listener-throws') {
        throw new Error('listener boom');
      }
      events.push(event);
    },
    trace: (event, payload) => listenerTraces.push({ event, payload })
  });
  const listenerFailureLog = path.join(folder, '20260522_040404_123.txt');
  fs.writeFileSync(listenerFailureLog, '');
  listenerWatcher.offsets.set(listenerFailureLog, 0);
  append(listenerFailureLog, 'listener-throws\nlistener-continues\n');
  const listenerFailureEvents = listenerWatcher.handleFile(listenerFailureLog);
  assert.strictEqual(listenerFailureEvents.length, 2, 'listener exceptions should not stop later events');
  assert.ok(listenerTraces.some((entry) => entry.event === 'listener_error'), 'listener exception should emit trace');
  assert.ok(events.some((event) => event.id === 'listener-continues'), 'watcher should continue after listener exception');

  console.log('gamelog watcher verified');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function append(filePath, text) {
  fs.appendFileSync(filePath, text);
}
