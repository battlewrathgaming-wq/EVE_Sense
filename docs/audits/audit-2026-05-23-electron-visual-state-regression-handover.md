# Audit: Electron Visual State Regression Handover

Date: 2026-05-23
Status: Complete

## Scope

Complete the `electron-visual-state-regression-tests.md` packet without changing product runtime behavior.

## Work Product

- Extended explicit Electron visual smoke to capture controlled alternate UI states:
  - unavailable
  - stale
  - degraded
  - blocked
  - partial/capped
  - cooldown
  - diagnostics open
  - settings degraded
  - narrow viewport
- Added visibility assertions for critical controls and labels in each state.
- Added bounded screenshot retry handling for transient `UnknownVizError`.
- Recorded screenshot capture attempt counts in `visual-smoke-result.json`.
- Isolated smoke user data under `.tmp\electron-visual-smoke\user-data` to avoid reading persisted operator settings or starting real gamelog watchers during smoke.
- Updated renderer-shell static verification to protect the smoke harness coverage.

## Verification Signals

Completed:

```powershell
npm.cmd run smoke:electron
npm.cmd run verify:renderer-shell
npm.cmd run verify:all
git diff --check
```

Latest smoke artifact recorded:

```txt
.tmp\electron-visual-smoke\visual-smoke-result.json
```

The latest smoke wrote ten screenshots and used isolated user data:

```txt
.tmp\electron-visual-smoke\user-data
```

## Concerns

- This is a visibility and screenshot regression harness, not a pixel-diff system.
- Controlled renderer states do not replace backend/provider fault injection tests.
- The first successful isolated smoke needed a bounded retry for `first-light.png`, proving the retry path is useful.

## Deferred Risks

- Provider request pulse UI remains open.
- Clipboard Acquisition race tests remain open.
- Runtime settings and diagnostics fault tests remain open for backend-driven degraded-state proof.
- Electron visual smoke remains outside `verify:all` by design.

## Affected Systems And Files

- `src/main/main.js`
- `scripts/electron-visual-smoke.ps1`
- `scripts/verify-renderer-shell.js`
- `docs/gap/complete/electron-visual-state-regression-tests.md`
- `docs/gap/to-do/ux-handover-current-overlay-and-next-ui-slices.md`
- `docs/current-state/current-implementation.md`

## Recommendation For Overseer Review

Overseer should treat this as baseline visual evidence coverage. A future pixel-diff or perceptual regression system should be opened as a separate packet if screenshot comparison becomes necessary.
