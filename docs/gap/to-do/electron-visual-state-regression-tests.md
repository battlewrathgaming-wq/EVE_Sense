# Gap To-Do: Electron Visual State Regression Tests

Status: Open
Priority: P1
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

Electron smoke proves the default integrated viewport, but visual regressions often hide in alternate states.

## Actionables

- Add smoke fixtures or controlled states for unavailable, stale, degraded, blocked, partial, capped, cooldown, diagnostics observed, and settings recovered/degraded states.
- Test narrow viewport sizing.
- Assert critical labels and controls remain visible.
- Capture screenshots under `.tmp/electron-visual-smoke`.

## Guardrails

- Do not put Electron smoke into `verify:all`.
- Do not hardcode machine-specific paths.
- Do not use live network or real EVE logs for visual state tests.

## Completion Signal

- Electron smoke covers multiple tactical/runtime states.
- Screenshots and structured results record the state permutations.
- Renderer boundary checks still pass.
