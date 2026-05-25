# Overseer HS22 - M17 Frame/Window Smoke Hardening Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer
Reviewed handoff: `workspace/DevHS21-frame-window-smoke-hardening.md`

## Decision

Accepted.

The Dev packet completed the bounded M17 Frame/window smoke hardening runway.

## Accepted Changes

- Product-window Frame bounds persistence is explicitly enabled with `persistBounds: true` in `src/main/main.js`.
- `npm.cmd run verify:frame` now protects the product-window bounds persistence option.
- Visual regression smoke bounds mutation is guarded with `try/finally` in `src/main/main.js`.
- `npm.cmd run verify:renderer-shell` now protects the visual smoke bounds restoration guard.

## Verification

Overseer reran:

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

Results:

- `verify:frame`: passed.
- `verify:renderer-shell`: passed.
- `verify:renderer-boundary`: passed.
- `verify:renderer-boundary-adversarial`: passed.
- `verify:protected-terms`: passed, warning-only. The output is noisy because changed smoke verification files include existing renderer/smoke vocabulary; no protected-word files, renames, or terminology changes were made.
- `verify:all`: passed.
- `smoke:electron`: passed and wrote artifacts under `.tmp\electron-visual-smoke`.
- `git status --short --branch`: expected modified packet files before acceptance commit.

## Scope Preserved

- No Lab face adoption.
- No adapter implementation.
- No provider/live IO behavior changes.
- No payload, schema, service-semantic, lane-meaning, or UI redesign work.
- No live provider smoke, manual shortcut validation, or real SDE refresh/download.

## Residual Risk

Product-window bounds now persist across runs. Existing Frame state normalization rejects invalid or incomplete bounds, and Electron smoke uses isolated user data. This is accepted as the intended M17 behavior.

## Next State

M17 can close.

`workspace/current.md` should return to idle with no active executable runway.
