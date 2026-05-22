# Milestone 11: Operational Hardening And Runtime Control

Status: Planned - Next After Milestone 10 Acceptance
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

Milestone 11 makes AURA-Sense safer to run for longer operator sessions.

The tactical viewport can only be trusted if its runtime controls are explicit, recoverable, and observable. This milestone hardens configuration, live IO control, diagnostics review, degraded startup, and smoke policy without adding new intelligence depth.

This is the boring architecture milestone. It exists to stop fragile runtime behavior from becoming operator ambiguity.

## Feature Anchors

- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 7: Settings And Runtime Control
- `docs/features/vision.md` Element 9: External API Boundary
- `docs/features/vision.md` Element 10: Atlas Handoff

## Operational Outcome

The operator can start AURA-Sense, recover from missing settings, understand blocked/degraded lanes, and control live IO without guessing what the app is doing.

## Priority Task Chain

### P0 Task 1: Runtime Settings Persistence

- Persist validated gamelog folder and operator-safe display/runtime preferences.
- Load persisted settings at startup through backend-owned validation.
- Recover visibly when persisted paths are missing or invalid.
- Keep settings small, explicit, and product-facing.

Task packet: `docs/gap/to-do/runtime-settings-persistence.md`.

### P0 Task 2: Live IO Control Policy

- Add an operator-visible live IO policy surface for Passive Telemetry and Threat Intel.
- Preserve backend live IO gate ownership.
- Show blocked state clearly when live calls are disabled.
- Keep live API execution out of `verify:all`.

Task packet: `docs/gap/to-do/runtime-live-io-control-policy.md`.

### P1 Task 3: Diagnostics Review Surface

- Add a compact diagnostics/degraded-state review surface.
- Show high-value watcher, parser, runtime, and provider failures without raw-log leakage.
- Avoid turning diagnostics into a noisy console.
- Preserve diagnostics policy filtering.

Task packet: `docs/gap/to-do/runtime-diagnostics-review-surface.md`.

### P1 Task 4: Startup And Session Recovery

- Make startup states explicit for missing gamelog folder, unavailable bridges, disabled live IO, and stale lane snapshots.
- Ensure watcher restart/stop behavior remains validated and observable.
- Keep renderer copy honest during partial startup.

Task packet: `docs/gap/to-do/runtime-startup-and-session-recovery.md`.

### P2 Task 5: Smoke Policy And Failure Records

- Define which smoke commands are local/manual, CI-safe, or live-only.
- Record reusable bug classes in `docs/failures` when discovered.
- Keep Electron smoke evidence under `.tmp`.
- Do not hardcode machine paths.

Task packet: `docs/gap/to-do/runtime-smoke-policy-and-failure-records.md`.

### P2 Task 6: Atlas Handoff Decision Boundary

- Write an ADR only if a concrete operator workflow requires handoff.
- Keep Atlas persistence, evidence stores, queues, and watch execution out of AURA-Sense core.
- Prefer "no handoff yet" if the workflow is not real.

Task packet: `docs/gap/to-do/atlas-handoff-decision-boundary.md`.

## Autonomy Envelope

Dev may touch:

- settings persistence service code
- main/preload service commands
- renderer settings and diagnostics surfaces
- diagnostics policy consumers
- live IO gate presentation
- smoke scripts and verification docs
- failure records and ADRs

Dev may not:

- add Atlas persistence or evidence stores
- add hidden live network behavior
- add broad background polling
- move diagnostics or settings truth into renderer
- weaken renderer boundary checks
- add new tactical conclusions while hardening runtime control

## Acceptance Gate

Milestone 11 is complete when:

- settings persist and recover through backend validation
- live IO enable/disable state is visible and backend-enforced
- degraded startup states are explicit
- diagnostics review shows important failures without flooding the HUD
- smoke policy is documented
- `npm.cmd run verify:all` passes
- `npm.cmd run smoke:electron` passes if renderer changed

## Expected Handover

Dev handover should include:

- persisted settings keys and storage path
- validation/recovery behavior
- live IO policy behavior
- diagnostics surface behavior
- smoke command policy
- failure records or ADRs created
- verification output
- completed and remaining gap packets
