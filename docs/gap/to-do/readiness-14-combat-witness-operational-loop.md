# Gap To-Do: Combat Witness Operational Loop

Date: 2026-05-22
Status: Open
Priority: P0 for Milestone 05

## Feature Anchors

- `docs/features/vision.md` Element 1: Tactical HUD Shell
- `docs/features/vision.md` Element 2: Combat Witness
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 7: Settings And Runtime Control

## Need

First Light proves that the renderer can present backend-owned Combat Witness snapshots. Electron visual smoke proves the shell can launch and capture the first-light viewport.

The next gap is operational flow: Combat Witness needs a real local watcher lifecycle connected to the viewport with honest missing/degraded/stale states.

## Task Chain

### Task 1: Runtime Path Control

- Use existing log path/settings validators before service mutation.
- Add the smallest runtime service needed for gamelog path validation/selection.
- Keep invalid/missing paths visible as unavailable or degraded.
- Avoid introducing a broad settings screen beyond the operational need.

### Task 2: Watcher Ownership

- Start, stop, or reflect watcher lifecycle from backend/main ownership.
- Feed parsed observations into existing Combat Witness backend cache/snapshot flow.
- Preserve polling fallback where file watching is weak.
- Route watcher/parser/listener failures through diagnostics.

### Task 3: Renderer Presentation

- Present watcher status as operational state, not tactical truth.
- Keep copy conservative:
  - unavailable
  - degraded
  - watching
  - empty
  - stale
  - witnessed
- Keep events bounded.
- Keep renderer presentation-only.

### Task 4: Verification

- Extend offline verification for settings/log-path service behavior.
- Extend renderer-shell or renderer-boundary verification if new UI paths are added.
- Keep `verify:all` offline.
- Extend `smoke:electron` for non-live UI evidence only.

### Task 5: Documentation And Handover

- Update current-state.
- Move this packet to complete when accepted.
- Record verification and smoke evidence.
- Keep Passive Telemetry, Threat Intel, and Atlas handoff deferred.

## Guardrails

- Do not parse logs in renderer.
- Do not call live APIs.
- Do not implement Threat Intel or Passive Telemetry in this milestone.
- Do not persist combat history.
- Do not hide missing watcher configuration behind an `empty` combat state.
- Do not convert diagnostics into noisy HUD chatter.

## Completion Signal

AURA-Sense can run the Combat Witness local observation loop from a validated gamelog path, feed backend-owned snapshots to the HUD, show accurate operational status, pass offline verification, and pass Electron visual smoke.

## Expected Verification

```powershell
npm.cmd run verify:all
npm.cmd run smoke:electron
```

## Related Documents

- `docs/roadmap/feature-aligned-milestones.md`
- `docs/roadmap/milestone-05-combat-witness-operational-loop.md`
- `docs/features/vision.md`
- `docs/current-state/current-implementation.md`
- `docs/gap/complete/readiness-12-tactical-hud-first-light.md`
- `docs/gap/complete/readiness-13-electron-visual-smoke.md`
