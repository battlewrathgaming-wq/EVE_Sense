# Audit: Combat Log Test Suite Milestone Handover

Date: 2026-05-22
Role: Overseer
Scope: Engineer feature requests for real-data combat-log testing.

## Current Truth

Combat Witness and Passive Telemetry now depend on the same local EVE gamelog observation foundation. The watcher boundary is intentionally append-only: existing files are seeded at current offsets, newly discovered files are not tail-replayed, partial lines are buffered, and duplicate normalized events are suppressed briefly.

That runtime doctrine is correct. It must not be weakened to make testing easier.

The engineer's proposed feature-request gaps are accepted as a verification milestone:

- `docs/gap/to-do/combat-log-dataset-fixture-ingestion.md`
- `docs/gap/to-do/combat-log-event-coverage-matrix.md`
- `docs/gap/to-do/combat-log-replay-harness.md`
- `docs/gap/to-do/combat-log-golden-snapshot-tests.md`
- `docs/gap/to-do/combat-log-repair-healing-fixtures.md`

## Milestone Direction

Milestone 07 is now Combat Logging Test Suite.

This is a supporting feature aligned to:

- Element 2: Combat Witness
- Element 3: Passive Telemetry
- Element 6: Diagnostics And Degraded State
- Support Feature: Combat Logging Test Suite

The purpose is to let Dev run for a longer slice against curated real EVE data while preserving tactical doctrine. The work should make parser behavior, stream replay, and rolling snapshots observable and repeatable before AURA-Sense adds more operator-facing intelligence.

## Ordered Dev Slices

1. Build dataset fixture ingestion for curated rows, exact raw line text, raw line hash, expected disposition, source metadata, and proposed family.
2. Build a machine-readable event coverage matrix that separates supported, rejected, deferred, and unknown families.
3. Build an offline replay harness that exercises parser/watcher/runtime/service semantics, including chunking, partial lines, duplicate suppression, listener isolation, and fan-out.
4. Build golden snapshot tests for deterministic 5s/15s/30s Combat Witness windows from known ordered datasets.
5. Add repair/healing fixtures only from exact raw samples and keep HPS parser expansion deferred if samples are insufficient.
6. Wire stable offline checks into `npm.cmd run verify:all`.
7. Move completed packets to `docs/gap/complete`, update current-state, and produce a Dev handover with verification output.

## Guardrails

- Do not ingest private log directories by default.
- Do not replay old logs in normal runtime.
- Do not introduce a second watcher doctrine for tests.
- Do not require Electron for parser/replay verification.
- Do not add renderer UI in this milestone.
- Do not add Threat Intel search, Clipboard Acquisition, or ESI expansion.
- Do not claim repair/healing support without exact raw samples.
- Do not infer tactical truth from coverage percentages.

## Architectural Risk

The main risk is testing convenience leaking into runtime behavior. Replay belongs in offline verification only. The production watcher must remain future-appended-lines only.

The second risk is parser overclaiming. Proposed event family is dataset annotation, not parser truth. Coverage should expose unknowns and deferred families rather than pressuring Dev to classify every line.

The third risk is scope attraction. Because real data is interesting, Dev may be tempted to add UI panels, summaries, or intelligence claims. Those remain outside this milestone.

## Handoff For Next Dev Session

Start at `docs/roadmap/milestone-07-combat-logging-test-suite.md`.

Use `docs/features/combat-logging-test-suite.md` and the five P1 gap packets as the controlling scope. Work through them in order. Treat this as a verification feature, not product surface expansion.

Expected handover:

- fixture ingestion format and refusal behavior
- coverage matrix file shape and summary output
- replay harness behavior and boundaries
- golden snapshot fixtures and deterministic assertions
- repair/healing accepted samples or explicit deferral
- commands run, including `npm.cmd run verify:all`
- current-state updates
- gap packets moved to complete when accepted
