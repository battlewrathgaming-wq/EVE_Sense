# Audit: UX To-Do Reconciliation Handover

Date: 2026-05-23
Status: Complete

## Scope

Close the two UX handover packets that were already implemented or documented:

- Combat Metrics Presentation Audit
- Native Gamelog Folder Picker

This pass was documentation and reconciliation only. It did not change runtime behavior.

## Work Product

- Moved `combat-metrics-presentation-audit.md` to complete after confirming `docs/current-state/combat-metrics.md` maps parser capture, rolling compute, snapshot exposure, renderer display, terminology risks, HUD-safe metrics, diagnostics-only metrics, calibration-needed metrics, and known gaps.
- Moved `native-gamelog-folder-picker.md` to complete after confirming the main-process dialog path, preload allowlist, renderer service invocation, typed-path fallback, and static verification coverage.
- Updated `docs/current-state/current-implementation.md` to remove stale native-picker and old shortcut wording.
- Updated `docs/gap/to-do/aura-sense-tactical-readiness.md` so native picker is no longer listed as an open follow-up.
- Updated `docs/gap/to-do/ux-handover-current-overlay-and-next-ui-slices.md` so the next UX sequence starts with visual state regression, provider pulse UI, and clipboard race tests.

## Verification Signals

Completed verification for this reconciliation:

```powershell
npm.cmd run verify:renderer-shell
npm.cmd run verify:all
git diff --check
```

Result:

- renderer shell verified
- all checks verified
- `git diff --check` exited cleanly

Native dialog behavior remains best confirmed by operator smoke:

```powershell
npm.cmd run smoke:electron
```

## Concerns

- `verify:all` can prove the static service/renderer boundary, but it does not open a native OS dialog.
- The native picker configures the selected folder through backend validation; the renderer then starts the watcher after a successful selection. Manual smoke should still confirm invalid selections remain visibly rejected on a live operator machine.
- Combat metrics terminology is now documented, but no runtime fields or UI labels were renamed in this pass.

## Deferred Risks

- Electron visual state regression coverage is still open and should be the next UX/testing slice.
- Provider request pulse UI remains open and should use backend-owned diagnostics or snapshot metadata only.
- Clipboard Acquisition race tests remain open before further shortcut UX polish.
- Damage spike outliers and repair/healing parser behavior remain calibration/fixture-gated.

## Affected Systems And Files

- `docs/current-state/combat-metrics.md`
- `docs/current-state/current-implementation.md`
- `docs/gap/complete/combat-metrics-presentation-audit.md`
- `docs/gap/complete/native-gamelog-folder-picker.md`
- `docs/gap/to-do/aura-sense-tactical-readiness.md`
- `docs/gap/to-do/ux-handover-current-overlay-and-next-ui-slices.md`
- `src/main/main.js`
- `src/main/preload.js`
- `src/renderer/app.js`
- `src/renderer/index.html`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-renderer-boundary-adversarial.js`

## Recommendation For Overseer Review

Overseer should review whether the completed combat metrics terminology is accepted for a future UI copy pass. If accepted, open a separate scoped UI task for label changes without renaming backend fields.
