# Gap: Combat Log Replay And Repair Balance Next Scope

Status: Complete
Priority: P1

## Need

AURA-Sense needs the next Combat Witness testing and compute slice to do two things:

1. Strengthen combat log replay confidence without making every test filesystem-heavy.
2. Prepare the observed HPS-DPS repair balance concept for future HUD presentation.

This scope follows the Combat Logging Test Suite review and keeps the work backend-owned until snapshot output is precise.

## Replay Strategy

Use two replay layers.

### Lower-Level Semantic Replay

Keep the fast deterministic path:

```txt
fixture raw line
-> line-buffer/chunk simulation
-> parser
-> Combat Witness runtime/service
-> golden snapshot
```

Use this for most golden dataset tests.

Strengths:

- fast
- deterministic timestamps
- easy partial-line and chunking cases
- good parser/event/snapshot coverage
- no filesystem noise

Limitations:

- does not prove offset seeding
- does not prove append-only file reads
- does not prove watcher rejection behavior
- can drift from runtime ingestion if watcher semantics change

### Watcher-Path Replay Smoke

Add a smaller representative replay using temporary files and `EveGamelogWatcher.handleFile`.

Target path:

```txt
temporary gamelog folder/file
-> seed existing file offset
-> append fixture bytes
-> handleFile
-> parser
-> runtime/service
-> snapshot assertion
```

Use this to prove ingestion semantics, not every parser case.

Strengths:

- proves real append path
- proves offset seeding
- proves partial-line buffering through watcher
- proves watcher rejection/diagnostic behavior
- closer to actual EVE gamelog behavior

Limitations:

- more setup
- slower than semantic replay
- less focused for pure parser failures

## Repair Balance Concept

The UI-facing concept is a future tug-of-war radial based on:

```txt
repair balance = observed incoming HPS - observed incoming DPS
```

AURA-Sense does not know:

- current HP
- max HP
- resist profile
- incoming volley risk
- repair cycle certainty
- whether future reps will continue

Therefore this metric must not imply survival, safety, or recommendation.

Preferred language:

- `Repair Balance +12/s`
- `Repair Balance -38/s`
- `Incoming Pressure`
- `Repair Throughput`
- `Observed repair balance`

Avoid:

- `Stable`
- `Safe`
- `Breaking`
- `Tank holds`
- `You will survive`

## Guardrails

- Do not add renderer radial UI in this slice.
- Do not claim HPS from raw logs until exact repair/healing fixtures exist.
- Do not infer HP state.
- Do not infer future healing.
- Do not make all replay tests depend on filesystem behavior.
- Do not replay historical logs in normal runtime behavior.
- Keep golden tests deterministic and wall-clock independent.
- Do not mark an event family as supported unless at least one exact raw accepted fixture backs it.
- Do not trim exact raw fixture text when computing fixture hashes. Only the row/file transport newline may be removed.

## Logger And Debugging Pass

The watcher/logger path is part of this scope because replay tests need to be debuggable without flooding normal runtime logs.

Current behavior to preserve:

- `EveGamelogWatcher` wraps traces through `diagnosticsPolicy.wrapTrace(trace, 'combat.gamelog_watcher')`.
- Routine events such as `poll_tick`, `tail_read`, `file_event`, `file_seeded`, `offsets_seeded`, and `duplicate_suppressed` are low-value by default.
- High-value events such as `listener_error`, `watcher_strategy_fallback`, `partial_line_dropped`, and non-routine `line_rejected` stay visible.
- `line_rejected` with `reason: 'unparsed'` is low-value by default.
- `line_rejected` with `reason: 'parser_error'` is high-value and reports `rawLineHash` instead of echoing the raw line.
- Verbose diagnostics mode preserves low-value watcher events for dataset debugging.

Requirements:

- Replay verification should be able to capture watcher traces deterministically.
- Watcher-path replay should assert the useful rejection/debug path, including unparsed lines, parser errors, and trace `source`.
- Parser errors must continue to avoid raw-line leakage in trace payloads while preserving `rawLineHash`.
- Any new debug output must go through diagnostics policy rather than ad hoc console logging.

## Implementation Requirements

- Add a watcher-path replay verification using a temporary gamelog folder.
- Keep existing lower-level replay as the main semantic golden harness.
- Strengthen golden snapshot data so at least one dataset proves mixed-window aggregation, not only pruning.
- Replace the current weak golden case where the snapshot window leaves only one incoming damage event and outgoing damage at zero.
- Include incoming damage, outgoing damage, misses, jump events, and at least synthetic normalized repair events until exact raw repair fixtures exist.
- Assert `balance.receivedRepairMinusDamagePerSecond`.
- Assert that repair balance remains an observed metric, not a tactical verdict.
- Strengthen coverage verification so any `supported` coverage family must have at least one accepted exact raw fixture row.
- Make `verify:combat-coverage` fail when a supported family has no accepted fixture evidence.
- Strengthen fixture ingestion so fixture hashes use the exact stored raw value, not `raw.trim()`.
- Make fixture verification fail if leading or trailing spaces in the stored raw field drift from the stored hash.

## Completion Signal

- `npm.cmd run verify:combat-replay` covers lower-level semantic replay.
- A watcher-path replay smoke is included in verification.
- Golden snapshots include a non-trivial 15 second case with incoming damage and incoming repair.
- Golden snapshots prove mixed incoming damage, outgoing damage, hit-quality aggregation, repair/HPS, multiple attackers, source counts, and event ordering effects.
- Verification proves HPS-DPS math as `receivedRepairMinusDamagePerSecond`.
- `npm.cmd run verify:combat-coverage` fails if a supported family lacks accepted exact fixture evidence.
- Fixture ingestion and verification prove exact raw hashing without `trim()`.
- Watcher-path replay proves offset seeding, append reads, partial-line buffering, rejection diagnostics, parser-error diagnostics, and duplicate suppression at least once.
- Diagnostics verification covers the logger/debug behavior needed to inspect watcher replay without enabling noisy normal logs.
- Documentation or fixture notes clearly state that raw repair parsing remains deferred until exact samples exist.
- `npm.cmd run verify:all` passes.

## Completion Notes

Implemented in this slice:

- replay dataset expanded beyond single-event pruning
- semantic replay supports exact raw fixture rows plus explicit normalized repair events
- watcher-path replay smoke uses temp-file append through `EveGamelogWatcher.handleFile`
- golden snapshots assert 5s/15s/30s DPS, HPS, repair balance, source counts, and hit-quality counts
- fixture ingestion hashes exact raw values without `trim()`
- coverage verification fails supported families without accepted exact raw fixtures
- Combat Witness snapshots expose bounded source/target counts and hit-quality/damage-type counts

## Related Files

- `docs/features/combat-logging-test-suite.md`
- `docs/gap/complete/combat-log-replay-harness.md`
- `docs/gap/complete/combat-log-golden-snapshot-tests.md`
- `docs/gap/complete/combat-log-repair-healing-fixtures.md`
- `fixtures/combat-log-replay-dataset.json`
- `scripts/verify-combat-log-replay.js`
- `scripts/verify-combat-golden-snapshots.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessService.js`
- `src/combat/combatRollingWindow.js`
