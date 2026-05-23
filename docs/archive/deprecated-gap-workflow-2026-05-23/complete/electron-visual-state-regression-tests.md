# Gap To-Do: Electron Visual State Regression Tests

Status: Complete
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

## Completion Evidence

- `src/main/main.js` now captures controlled visual regression states during explicit Electron smoke:
  - unavailable
  - stale
  - degraded
  - blocked
  - partial/capped
  - cooldown
  - diagnostics open
  - settings degraded
  - narrow viewport
- `scripts/electron-visual-smoke.ps1` isolates Electron smoke user data under `.tmp\electron-visual-smoke\user-data` so persisted operator settings do not start real gamelog watchers during smoke.
- Screenshot capture has a bounded `UnknownVizError` retry path and records capture attempt counts in `visual-smoke-result.json`.
- `scripts/verify-renderer-shell.js` asserts that the visual smoke harness retains the regression states, isolated user-data path, and retry count reporting.

## Verification Signal

Completed verification:

```powershell
npm.cmd run smoke:electron
npm.cmd run verify:renderer-shell
npm.cmd run verify:all
git diff --check
```

Smoke artifact:

```txt
.tmp\electron-visual-smoke\visual-smoke-result.json
```

Recorded screenshots:

- `first-light.png`
- `state-unavailable.png`
- `state-stale.png`
- `state-degraded.png`
- `state-blocked.png`
- `state-partial-capped.png`
- `state-cooldown.png`
- `state-diagnostics-open.png`
- `state-settings-degraded.png`
- `state-narrow-viewport.png`

## Deferred Risks

- The smoke harness verifies visibility and screenshot capture, not pixel-perfect visual comparison.
- The controlled states are renderer-side state fixtures; they do not replace backend fault injection packets.
- `UnknownVizError` can still fail after three bounded capture attempts; failures remain recorded in `.tmp\electron-visual-smoke`.
- Live network and real EVE log behavior remain outside this smoke by design.

## Related Files

- `src/main/main.js`
- `scripts/electron-visual-smoke.ps1`
- `scripts/verify-renderer-shell.js`
- `docs/failures/failure-2026-05-22-electron-capture-transient-viz.md`
