# Audit: Next Two Milestones Overseer Scope

Date: 2026-05-22
Role: Overseer
Scope: Scope the next two feature-aligned milestones after integrated viewport work.

## Current Local Truth

The local checkout is clean and `npm.cmd run verify:all` passes.

Milestone 10 remains recorded locally as the active integrated viewport runway. The user reports Dev has finished; this audit scopes the next two milestones without marking Milestone 10 complete locally because no Dev completion artifact is present in this checkout.

## Next Milestone Order

1. Milestone 11: Operational Hardening And Runtime Control
2. Milestone 12: Live Validation And Tactical Calibration

This order is intentional.

Runtime hardening must come before live validation because live/manual evidence is only useful when settings, live IO controls, startup recovery, and diagnostics are explicit.

## Milestone 11 Priority

P0:

- `docs/gap/to-do/runtime-settings-persistence.md`
- `docs/gap/to-do/runtime-live-io-control-policy.md`

P1:

- `docs/gap/to-do/runtime-diagnostics-review-surface.md`
- `docs/gap/to-do/runtime-startup-and-session-recovery.md`

P2:

- `docs/gap/to-do/runtime-smoke-policy-and-failure-records.md`
- `docs/gap/to-do/atlas-handoff-decision-boundary.md`

## Milestone 12 Priority

P0:

- `docs/gap/to-do/live-operator-smoke-playbook.md`
- `docs/gap/to-do/live-api-smoke-evidence.md`

P1:

- `docs/gap/to-do/combat-metric-calibration-real-datasets.md`
- `docs/gap/to-do/repair-healing-raw-fixture-intake.md`

P2:

- `docs/gap/to-do/local-metadata-consumer-hardening.md`
- `docs/gap/to-do/live-findings-audit-and-doctrine-update.md`

## Doctrine

- Do not use Milestone 11 to add new intelligence depth.
- Do not use Milestone 12 to broaden collection.
- Keep `verify:all` offline.
- Keep live smoke explicit, gated, and recorded.
- Keep renderer presentation-only.
- Keep Atlas handoff deferred unless an ADR proves a real workflow.

## Expected Dev Handover

For each milestone, Dev should report:

- completed task packets
- verification output
- smoke/live evidence where applicable
- current-state updates
- completed packets moved to `docs/gap/complete`
- explicit deferrals and remaining risk
