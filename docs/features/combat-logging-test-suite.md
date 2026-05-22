# Feature: Combat Logging Test Suite

Status: Active - Milestone 07
Date: 2026-05-22

## User Value

AURA-Sense needs a repeatable way to test real EVE log datasets and turn noisy raw lines into predictable observed events.

The feature should let engineers add exact raw examples, classify them, verify parser output, replay ordered datasets through the watcher/service path, and compare generated snapshots against expected results.

The goal is not to prove complete EVE combat truth. The goal is to make parser behavior predictable, explicit, and safe to refine.

## Data Classification

Input data:

- exact EVE gamelog lines
- source file name when useful
- line number when useful
- raw line hash
- proposed event family
- expected parser result or expected rejection

Output data:

- normalized parser event
- rejection reason
- rolling snapshot output
- event stream output
- coverage matrix status

## Creation / Update Path

1. Import or hand-author fixture rows from real datasets.
2. Preserve exact raw lines and hashes.
3. Classify fixture intent separately from parser output.
4. Run parser acceptance/rejection verification.
5. Run replay verification through watcher/runtime/service path.
6. Update coverage matrix with supported, deferred, or rejected event families.

## Must Not Do

- Do not use live EVE logs directly in normal verification.
- Do not store private raw logs outside explicit fixtures.
- Do not infer tactical certainty from parser coverage.
- Do not require Electron to test parser or replay behavior.
- Do not add renderer behavior as part of parser dataset testing.

## Relationship To AURA-Sense Scope

This feature supports Combat Witness and future Passive Telemetry by proving local observed telemetry. It does not create Threat Intel, evidence history, recommendations, topology claims, or Atlas-style persistence.

## Active Milestone

- `docs/roadmap/milestone-07-combat-logging-test-suite.md`
- `docs/roadmap/feature-aligned-milestones.md` Milestone 07

## Requested Implementation Slices

- `docs/gap/to-do/combat-log-dataset-fixture-ingestion.md`
- `docs/gap/to-do/combat-log-event-coverage-matrix.md`
- `docs/gap/to-do/combat-log-replay-harness.md`
- `docs/gap/to-do/combat-log-golden-snapshot-tests.md`
- `docs/gap/to-do/combat-log-repair-healing-fixtures.md`
