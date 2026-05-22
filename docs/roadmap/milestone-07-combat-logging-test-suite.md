# Milestone 07: Combat Logging Test Suite

Status: Active
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

AURA-Sense now has working Combat Witness and Passive Telemetry lanes. Before adding more operator-facing intelligence, the project needs better real-data confidence for the local log foundation.

This milestone is not product surface expansion. It is a verification and fixture milestone that lets Dev work against curated real EVE gamelog data without changing runtime watcher doctrine.

Dev should treat this as a full work envelope. The task chain is ordered, but it is not a request for user approval between each task.

Feature anchors:

- `docs/features/vision.md` Element 2: Combat Witness
- `docs/features/vision.md` Element 3: Passive Telemetry
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/combat-logging-test-suite.md`
- `docs/audits/audit-2026-05-22-combat-log-test-suite-milestone-handover.md`

## Operational Outcome

AURA-Sense can ingest curated real-data fixture rows, maintain an event coverage matrix, replay ordered fixture datasets offline, compare golden Combat Witness snapshots, and add repair/healing parser coverage only from exact raw samples.

## Task Chain

### Task 1: Dataset Fixture Ingestion

- Implement `docs/gap/to-do/combat-log-dataset-fixture-ingestion.md`.
- Accept curated source files or spreadsheet exports.
- Preserve exact raw line text and raw line hash.
- Store proposed event family separately from parser truth.
- Reject hash drift.

### Task 2: Event Coverage Matrix

- Implement `docs/gap/to-do/combat-log-event-coverage-matrix.md`.
- Track supported, rejected, deferred, and unknown event families.
- Require exact raw fixtures before marking a family supported.
- Verify accepted parser fixtures map to supported families.

### Task 3: Replay Harness

- Implement `docs/gap/to-do/combat-log-replay-harness.md`.
- Replay ordered fixture datasets through the same parser/watcher/runtime/service semantics used by the app.
- Simulate ordering, chunking, partial lines, duplicate suppression, listener isolation, and event fan-out.
- Keep replay strictly offline and outside runtime behavior.

### Task 4: Golden Snapshot Tests

- Implement `docs/gap/to-do/combat-log-golden-snapshot-tests.md`.
- Compare deterministic 5s/15s/30s Combat Witness snapshots from known datasets.
- Avoid wall-clock dependence.
- Keep renderer layout and styling out of the tests.

### Task 5: Repair And Healing Fixtures

- Implement `docs/gap/to-do/combat-log-repair-healing-fixtures.md`.
- Add exact raw repair/healing samples with hashes.
- Add rejected lookalikes such as repair cost questions, capacitor failure, and module denial.
- Only then expand parser claims for `combat.repair`.

### Task 6: Verification Integration

- Add new verification scripts only when deterministic.
- Include them in `npm.cmd run verify:all` after they are stable.
- Keep Electron smoke out of this milestone unless a visible UI state changes.

### Task 7: State And Handover

- Move completed packets to `docs/gap/complete`.
- Update `docs/current-state/current-implementation.md`.
- Record fixture formats, coverage summary, replay behavior, golden snapshot outputs, and parser claim changes.

## Autonomy Envelope

Dev may touch:

- `fixtures/`
- parser fixture formats
- dataset ingestion scripts
- coverage matrix files
- replay harness scripts
- Combat Witness verification scripts
- parser code only when exact raw fixtures justify the claim
- docs and completion records

Dev may not:

- ingest entire private log directories by default
- replay old logs during normal runtime
- persist replay output as combat history
- require Electron for parser/replay tests
- add renderer UI
- add Threat Intel search
- add ESI expansion
- infer tactical certainty from fixture coverage

## Acceptance Gate

Milestone 07 is complete when:

- curated real-data rows can become verified fixtures
- event-family coverage is visible and machine-checkable
- ordered datasets replay deterministically through watcher/runtime/service semantics
- golden Combat Witness snapshots are verified
- repair/healing parser claims are backed by exact raw fixtures or explicitly remain deferred
- `npm.cmd run verify:all` passes
- current-state and completion evidence are updated

## Expected Handover

Dev handover should include:

- feature anchors used
- fixture ingestion format
- coverage matrix summary
- replay harness behavior
- golden snapshot fixtures and assertions
- repair/healing accepted and rejected examples
- verification output
- parser claims added or explicitly deferred
- files touched
