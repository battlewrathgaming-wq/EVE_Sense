const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { buildFixtureRows, readCuratedRows } = require('./import-combat-log-fixtures');
const { collectCompleteLines } = require('../src/combat/lineBuffer');
const { parseEveLogLine } = require('../src/combat/combatLogParser');
const { RecentEventDeduper } = require('../src/combat/recentEventDeduper');
const { createCombatWitnessRuntime } = require('../src/combat/combatWitnessRuntime');
const { CombatWitnessService } = require('../src/combat/combatWitnessService');
const { EveGamelogWatcher } = require('../src/combat/eveGamelogWatcher');
const { createDiagnosticsPolicy } = require('../src/services/diagnosticsPolicy');

const rows = buildFixtureRows(readCuratedRows(path.join(__dirname, '..', 'fixtures', 'combat-log-curated-source.jsonl')));
const byHash = new Map(rows.map((row) => [row.rawLineHash, row]));
const dataset = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'combat-log-replay-dataset.json'), 'utf8'));

const semanticReplay = verifySemanticReplay();
const watcherReplay = verifyWatcherPathReplay();

console.log(
  `combat log replay verified: events=${semanticReplay.replayed.length} stream=${semanticReplay.snapshot.eventStream.length} watcher=${watcherReplay.events.length}`
);

function verifySemanticReplay() {
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
    if (item.kind === 'normalized') {
      const event = materializeNormalizedEvent(item);
      runtime.observeEvent(event);
      replayed.push(event);
      continue;
    }

    const row = fixtureRow(item.rawLineHash);
    const splitAt = Math.max(1, Math.floor(row.raw.length / 2));
    const chunks = [`${row.raw.slice(0, splitAt)}`, `${row.raw.slice(splitAt)}\r\n`];
    for (const chunk of chunks) {
      const collected = collectCompleteLines({ chunk, partial });
      partial = collected.partial;
      for (const line of collected.lines) {
        const event = materializeRawEvent(line, item);
        if (!event) {
          continue;
        }
        runtime.observeEvent(event);
        replayed.push(event);
      }
    }
  }

  assert.strictEqual(partial, '', 'replay should not leave a partial line');
  assert.ok(replayed.length >= 10, 'replay should emit normalized events');
  const deduper = new RecentEventDeduper({ ttlMs: 5000 });
  const duplicateA = parseEveLogLine(fixtureRow(dataset.events[0].rawLineHash).raw);
  const duplicateB = parseEveLogLine(fixtureRow(dataset.events[0].rawLineHash).raw);
  assert.strictEqual(deduper.isDuplicate(duplicateA, 1000), false, 'first replay event should not be duplicate');
  assert.strictEqual(deduper.isDuplicate(duplicateB, 2000), true, 'duplicate replay event should be suppressed');
  assert.strictEqual(fanOut.length, replayed.length, 'runtime fan-out should observe every replayed event');
  assert.ok(listenerErrors.length >= 1, 'listener isolation should record observer errors');

  const snapshot = service.snapshot(Date.parse(dataset.golden.snapshotAt));
  assert.strictEqual(snapshot.windows['5s'].damage.incoming.total, dataset.golden.windows['5s'].damage.incoming.total, '5s incoming damage should match golden');
  assert.strictEqual(snapshot.windows['15s'].damage.incoming.perSecond, dataset.golden.windows['15s'].damage.incoming.perSecond, '15s incoming DPS should match golden');
  assert.strictEqual(snapshot.windows['15s'].damage.outgoing.perSecond, dataset.golden.windows['15s'].damage.outgoing.perSecond, '15s outgoing DPS should match golden');
  assert.strictEqual(snapshot.windows['15s'].repair.incoming.perSecond, dataset.golden.windows['15s'].repair.incoming.perSecond, '15s incoming HPS should match golden');
  assert.strictEqual(
    snapshot.windows['15s'].balance.receivedRepairMinusDamagePerSecond,
    dataset.golden.windows['15s'].balance.receivedRepairMinusDamagePerSecond,
    '15s repair balance should match golden'
  );
  assert.deepStrictEqual(snapshot.windows['15s'].damage.incoming.sourceCounts, dataset.golden.windows['15s'].damage.incoming.sourceCounts, '15s incoming source counts should match golden');
  assert.deepStrictEqual(snapshot.windows['15s'].damage.incoming.weaponCounts, dataset.golden.windows['15s'].damage.incoming.weaponCounts, '15s incoming weapon counts should match golden');
  assert.deepStrictEqual(snapshot.windows['15s'].damage.incoming.mostObservedWeaponType, dataset.golden.windows['15s'].damage.incoming.mostObservedWeaponType, '15s incoming most observed weapon should match golden');
  assert.deepStrictEqual(snapshot.windows['15s'].damage.incoming.spikeOutliers, dataset.golden.windows['15s'].damage.incoming.spikeOutliers, '15s incoming spike outliers should match golden');
  assert.deepStrictEqual(snapshot.windows['15s'].damage.outgoing.mostObservedWeaponType, dataset.golden.windows['15s'].damage.outgoing.mostObservedWeaponType, '15s outgoing most observed weapon should match golden');
  assert.strictEqual(snapshot.windows['30s'].balance.takenDps, dataset.golden.windows['30s'].balance.takenDps, '30s balance should match golden');
  assert.strictEqual(snapshot.eventStream.length, dataset.golden.eventStreamCount, 'event stream retention should match golden');

  return { replayed, snapshot };
}

function verifyWatcherPathReplay() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-sense-combat-replay-'));
  try {
    const folder = path.join(tempRoot, 'EVE', 'logs', 'Gamelogs');
    fs.mkdirSync(folder, { recursive: true });
    const logPath = path.join(folder, '20260522_010101_123.txt');
    fs.writeFileSync(logPath, `${fixtureRow(dataset.watcherReplay.seedRawLineHash).raw}\n`);

    const service = new CombatWitnessService({ now: () => Date.parse(dataset.golden.snapshotAt) });
    const runtime = createCombatWitnessRuntime({ service });
    const rejected = [];
    const traces = [];
    const events = [];
    const watcher = new EveGamelogWatcher({
      diagnosticsPolicy: createDiagnosticsPolicy({ mode: 'verbose' }),
      parseLine: (line, options) => {
        if (line.includes('throw-parser')) {
          throw new Error('parser boom');
        }
        return parseEveLogLine(line, options);
      },
      onRejectedLine: (line) => rejected.push(line),
      onEvent: (event) => {
        events.push(event);
        runtime.observeEvent(event);
      },
      trace: (event, payload) => traces.push({ event, payload })
    });

    const status = watcher.start(folder);
    assert.strictEqual(status.state, 'watching', 'watcher replay should start from temp gamelog folder');
    assert.strictEqual(events.length, 0, 'watcher replay should seed existing content without replaying it');

    const firstRaw = fixtureRow(dataset.watcherReplay.appendRawLineHashes[0]).raw;
    append(logPath, firstRaw.slice(0, Math.floor(firstRaw.length / 2)));
    assert.strictEqual(watcher.handleFile(logPath).length, 0, 'watcher replay should hold partial raw line');
    append(logPath, `${firstRaw.slice(Math.floor(firstRaw.length / 2))}\n`);
    assert.strictEqual(watcher.handleFile(logPath).length, 1, 'watcher replay should emit completed partial raw line');

    for (const rawLineHash of dataset.watcherReplay.appendRawLineHashes.slice(1)) {
      append(logPath, `${fixtureRow(rawLineHash).raw}\n`);
      watcher.handleFile(logPath);
    }
    append(logPath, `${dataset.watcherReplay.parserErrorLine}\n`);
    watcher.handleFile(logPath);
    append(logPath, `${firstRaw}\n${firstRaw}\n`);
    watcher.handleFile(logPath);

    const snapshot = service.snapshot(Date.parse(dataset.golden.snapshotAt));
    assert.ok(events.some((event) => event.kind === 'combat.damage'), 'watcher replay should parse damage through handleFile');
    assert.ok(events.some((event) => event.kind === 'combat.miss'), 'watcher replay should parse miss through handleFile');
    assert.ok(rejected.some((line) => line.reason === 'unparsed'), 'watcher replay should report unparsed fixture lines');
    assert.ok(rejected.some((line) => line.reason === 'parser_error'), 'watcher replay should report parser exceptions');
    assert.ok(
      traces.some((entry) => entry.event === 'line_rejected' && entry.payload.reason === 'unparsed' && entry.payload.source === 'combat.gamelog_watcher'),
      'watcher replay should expose unparsed trace source in verbose diagnostics'
    );
    const parserErrorTrace = traces.find((entry) => entry.event === 'line_rejected' && entry.payload.reason === 'parser_error');
    assert.ok(parserErrorTrace, 'watcher replay should trace parser errors');
    assert.ok(parserErrorTrace.payload.rawLineHash, 'parser error trace should include raw line hash');
    assert.strictEqual(parserErrorTrace.payload.line, undefined, 'parser error trace should not include raw line text');
    assert.ok(traces.some((entry) => entry.event === 'tail_read'), 'verbose watcher replay should keep tail read debug traces');
    assert.ok(traces.some((entry) => entry.event === 'duplicate_suppressed'), 'watcher replay should prove duplicate suppression trace');
    assert.ok(snapshot.eventStream.length >= 3, 'watcher replay should feed runtime/service snapshots');

    watcher.stop();
    return { events, rejected, traces, snapshot };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function materializeRawEvent(line, item) {
  const event = parseEveLogLine(line, { observedAt: observedAtFor(item) });
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

function materializeNormalizedEvent(item) {
  return {
    observedAt: observedAtFor(item),
    ...item.event
  };
}

function observedAtFor(item) {
  const baseMs = Date.parse(dataset.baseObservedAt || '2026-05-22T00:00:00.000Z');
  return new Date(baseMs + (item.at || 0)).toISOString();
}

function fixtureRow(rawLineHash) {
  const row = byHash.get(rawLineHash);
  assert.ok(row, `dataset row ${rawLineHash} should resolve to curated fixture`);
  return row;
}

function append(filePath, text) {
  fs.appendFileSync(filePath, text);
}
