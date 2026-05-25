# Milestone 12: Live Validation And Tactical Calibration

Status: Future candidate - live/manual gated
Date: 2026-05-22
Owner: Overseer direction, Dev execution

Current note: M12 is not an active milestone. It remains the appropriate future envelope for operator-machine validation, live API smoke evidence, real-data calibration, and accepted raw fixture intake. It must be explicitly opened by the Human/Overseer before any live, manual, private-folder, or operator-environment work runs.

Gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md` records how the current M12 gate is hooked through roadmap policy, runtime smoke policy, `AURA_SENSE_LIVE_API`, backend live IO gates, provider services, and the future live operator smoke boundary.

## Vision Setting

Milestone 12 would prove AURA-Sense against real operator conditions without turning live use into uncontrolled collection.

The viewport, runtime controls, provider gates, parser, watcher containment, and deterministic hardening are now stable enough to make this a plausible future candidate. The goal is not to add more features. The goal is to calibrate trust under an explicitly authorized live/manual packet.

This milestone converts "works in fixtures" into "behaves honestly in the field."

## Feature Anchors

- `docs/features/vision.md` Element 2: Combat Witness
- `docs/features/vision.md` Element 3: Passive Telemetry
- `docs/features/vision.md` Element 4: Threat Intel
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 8: Local Metadata
- `docs/features/vision.md` Element 9: External API Boundary
- `docs/features/combat-logging-test-suite.md`

## Operational Outcome

AURA-Sense has recorded live/manual smoke evidence, calibrated Combat Witness metric language, and promoted only proven real-data behavior into product claims.

## Priority Task Chain

### P0 Task 1: Live Operator Smoke Playbook

- Define a manual smoke playbook for live EVE gamelog use on an operator machine.
- Prove watcher start, append-only line handling, future jump observation, Combat Witness updates, and clean shutdown.
- Record artifacts without storing broad private logs.
- Keep live smoke separate from `verify:all`.

Task packet: `docs/gap/to-do/live-operator-smoke-playbook.md`.

Current state: candidate only. Do not execute without a fresh active `workspace/current.md` packet.

### P0 Task 2: Live API Smoke Evidence

- Run explicit live-gated Passive Telemetry and Threat Intel smoke only when `AURA_SENSE_LIVE_API=1` is intentionally enabled.
- Record provider, route family, lookback, cache/ETag state, blocked behavior, failures, and artifact paths.
- Keep zKill and ESI calls scoped and respectful.
- Do not run live API smoke inside offline verification.

Task packet: `docs/gap/to-do/live-api-smoke-evidence.md`.

Current state: candidate only. Live provider smoke remains opt-in and outside `verify:all`.

### P1 Task 3: Combat Metric Calibration

- Test weapon counts, source/target labels, repair balance, and spike outliers against longer curated combat samples.
- Decide whether spike thresholding remains `average + standard deviation` or changes.
- Decide whether spike display requires a minimum sample count.
- Keep spike language observational until calibrated.

Task packet: `docs/gap/to-do/combat-metric-calibration-real-datasets.md`.

### P1 Task 4: Repair/Healing Raw Fixture Intake

- Add exact raw repair/healing fixtures only from real EVE log samples.
- Keep hashes exact and private-log scope narrow.
- Expand raw parser support only after accepted fixture evidence exists.
- Keep normalized synthetic repair events separate from raw parser claims.

Task packet: `docs/gap/to-do/repair-healing-raw-fixture-intake.md`.

### P2 Task 5: Local Metadata Consumer Hardening

- Status: Complete for compact type lookup foundation; future consumers may extend artifact deliberately.
- Add compact local metadata only for visible consumers that now need labels.
- Resolve type/system labels locally where practical.
- Keep unresolved IDs visible.
- Avoid large runtime SDE parsing and live ESI type lookup.

Task packet: `docs/gap/complete/local-metadata-consumer-hardening.md`.

### P2 Task 6: Live Findings Audit And Doctrine Update

- Produce a live-validation audit after smoke/calibration.
- Update current-state with proven live behavior.
- Retire or re-scope stale gaps.
- Add failure records for live-only defects.

Task packet: `docs/gap/to-do/live-findings-audit-and-doctrine-update.md`.

## Autonomy Envelope

Dev may touch:

- manual smoke scripts and docs
- live smoke harnesses that require explicit opt-in
- fixture ingestion and replay datasets
- parser support backed by exact raw fixtures
- Combat Witness metric tests and schemas
- compact metadata adapters for active consumers
- current-state, audits, failures, and gap movement

Dev may not:

- ingest broad private log directories
- store long-term history
- run live API checks during `verify:all`
- add ESI killmail expansion by default
- add Atlas persistence
- promote uncalibrated spike/repair labels into tactical certainty
- hide live failures behind optimistic UI

## Acceptance Gate

Milestone 12 is complete when:

- live operator smoke has a written playbook and recorded result
- live API smoke has explicit opt-in evidence or a recorded refusal path
- Combat Witness metric calibration has a documented decision
- raw repair/healing parser claims are still deferred or backed by exact accepted fixtures
- local metadata work is either implemented for a real consumer or explicitly deferred
- `npm.cmd run verify:all` remains offline and passes
- relevant live/manual smoke artifacts are recorded outside offline verification

## Expected Handover

Dev handover should include:

- live smoke commands and artifact paths
- operator-machine assumptions
- provider routes and live IO gate state
- real dataset calibration decisions
- repair/healing fixture evidence or deferral
- metadata consumer decisions
- failures found and records added
- current-state updates
