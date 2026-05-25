# DevHS21: Frame Window Smoke Hardening

Status: Complete - ready for Overseer review
Date: 2026-05-25
Role: AURA-Sense Dev

## Request

Execute the active M17 Dev runway for Frame/window smoke hardening: make the product-window bounds persistence decision explicit, add deterministic verification for that decision, and harden visual smoke bounds restoration.

## Files Changed

- `src/main/main.js`
- `scripts/verify-frame-module.js`
- `scripts/verify-renderer-shell.js`
- `workspace/current.md`
- `workspace/DevHS21-frame-window-smoke-hardening.md`

## Product-Window Bounds Decision

Enabled Frame bounds persistence for the AURA-Sense product window by passing `persistBounds: true` to the main `createFrameWindow(app, ...)` options.

The Frame module already supports persisted bounds behind an opt-in option, with `persistBounds: false` remaining the default for other Frame consumers. The product window now opts in explicitly while preserving the existing always-on-top persistence behavior.

Deterministic coverage was added to `npm.cmd run verify:frame` so the main-window Frame options must include `persistBounds: true`.

## Smoke Restoration Hardening

Wrapped visual regression smoke window size/bounds mutation in a `try/finally` guard inside `captureVisualRegressionStates`.

The smoke runner now attempts to restore the original window bounds even if a visual state assertion or screenshot capture fails after the window is resized. `npm.cmd run verify:renderer-shell` now statically verifies that the visual regression smoke path restores `originalBounds` from a `finally` block.

## Verification

Passed:

```powershell
npm.cmd run verify:frame
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:protected-terms
npm.cmd run verify:all
npm.cmd run smoke:electron
git status --short --branch
```

Observed results:

- `verify:frame`: `Frame module verified`
- `verify:renderer-shell`: `renderer shell verified`
- `verify:renderer-boundary`: `renderer boundary verified (4 files scanned)`
- `verify:renderer-boundary-adversarial`: `renderer boundary adversarial checks verified`
- `verify:protected-terms`: completed in working-set discovery mode with warning-only protected-term items; no protected-word files or renames were changed.
- `verify:all`: `all checks verified`
- `smoke:electron`: passed and wrote visual artifacts under `.tmp\electron-visual-smoke`
- `git status --short --branch`: branch `main...origin/main` with the expected modified implementation, verification, current-packet, and handoff files.

## Boundaries Preserved

- No Lab face, adapter, provider/live IO, payload/schema, service-semantic, lane-meaning, or UI redesign work.
- No renderer boundary weakening.
- No live provider smoke, manual shortcut validation, or real SDE refresh/download.
- No changes outside the AURA-Sense project.

## Residual Risk

The product window now persists bounds across runs. That is the chosen behavior for this packet, but it means a previously moved/resized product window will reopen at the saved geometry. Existing Frame normalization rejects invalid or incomplete bounds, and the Electron smoke uses isolated user data under `.tmp`.

