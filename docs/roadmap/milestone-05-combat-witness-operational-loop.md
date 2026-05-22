# Milestone 05: Combat Witness Operational Loop

Status: Active
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

Combat Witness has proven first-light presentation and runtime smoke. The next milestone should make it operational: not just displayed, but connected to a real local observation loop with visible status and safe failure behavior.

This milestone is feature-aligned, not micro-task-driven.

Feature anchors:

- `docs/features/vision.md` Element 1: Tactical HUD Shell
- `docs/features/vision.md` Element 2: Combat Witness
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 7: Settings And Runtime Control

## Operational Outcome

AURA-Sense can configure or reflect a gamelog path, run the Combat Witness watcher lifecycle, feed backend-owned snapshots to the first-light HUD, show fresh/stale/empty/unavailable/degraded state, and preserve verification plus Electron smoke.

## Task Chain

### Task 1: Log Path And Runtime Control

- Use existing log path/settings validators.
- Add the smallest product-facing service needed to validate and store/select a gamelog folder.
- Keep user settings mutation explicit and recoverable.
- Show invalid or missing path as unavailable/degraded, not as empty combat state.

### Task 2: Watcher Lifecycle To Bridge

- Wire the gamelog watcher into the Combat Witness bridge from main/backend ownership.
- Preserve fs-watch and polling fallback behavior.
- Ensure listener/parser failures become diagnostics rather than renderer crashes.
- Keep snapshot computation in backend code.

### Task 3: HUD Status Integration

- Add watcher lifecycle state to the Combat Witness surface.
- Use observation-safe copy: `unavailable`, `watching`, `stale`, `empty`, `witnessed`, `degraded`.
- Keep event list bounded.
- Do not add pressure, topology, EWAR, or recommendations.

### Task 4: Verification And Smoke

- Extend static verification for any new renderer surface.
- Verify renderer still does not import `src/combat`.
- Keep `npm.cmd run verify:all` offline.
- Extend `npm.cmd run smoke:electron` only for states that can be proven without live EVE logs.

### Task 5: State And Handover

- Update `docs/current-state/current-implementation.md`.
- Move `docs/gap/to-do/readiness-14-combat-witness-operational-loop.md` to complete when accepted.
- Record verification output and smoke artifacts.
- Preserve explicit deferrals.

## Autonomy Envelope

Dev may touch:

- main/preload service wiring
- Combat Witness bridge lifecycle code
- watcher startup/shutdown code
- settings/log path service code
- renderer Combat Witness status presentation
- verification scripts
- smoke checks
- related docs

Dev may not:

- add Passive Telemetry
- add Threat Intel
- add Atlas persistence
- call zKill/ESI
- compute telemetry truth in renderer
- turn missing logs into a false `empty` state

## Acceptance Gate

Milestone 05 is complete when:

- a valid gamelog path can be validated or selected through AURA-Sense runtime control
- Combat Witness watcher lifecycle feeds backend-owned snapshots
- the HUD distinguishes unavailable/degraded/stale/empty/witnessed states
- `npm.cmd run verify:all` passes
- `npm.cmd run smoke:electron` passes
- current-state and completion evidence are updated

## Expected Handover

Dev handover should include:

- feature anchors used
- task chain items completed
- files touched
- snapshot/status fields consumed by renderer
- diagnostics surfaced
- verification output
- smoke output directory and result summary
- explicit deferrals
