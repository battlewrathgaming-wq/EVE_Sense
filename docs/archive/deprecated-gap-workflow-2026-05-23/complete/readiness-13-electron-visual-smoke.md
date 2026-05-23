# Complete: Electron Visual Smoke

Status: Complete
Date: 2026-05-22

## Need

AURA-Sense needed a runtime smoke path after First Light so the real Electron shell could launch, render the product viewport, capture visual evidence, and exit cleanly without joining offline `verify:all`.

## Completed Work

- Added `npm.cmd run smoke:electron`.
- Added `scripts/electron-visual-smoke.ps1`.
- Added explicit smoke flags:
  - `AURA_SENSE_ELECTRON_VISUAL_SMOKE=1`
  - `AURA_SENSE_VISUAL_SMOKE_DIR=.tmp\electron-visual-smoke`
  - `--aura-sense-electron-visual-smoke`
  - `--aura-sense-visual-smoke-dir=...`
- Added main-process smoke mode after renderer load.
- Captured `first-light.png`.
- Wrote `visual-smoke-result.json`.
- Added launch and main-started smoke markers for operational evidence.
- Added runner-side failure behavior if Electron exits without a structured result file.
- Added `verify:electron-runtime` for direct Electron runtime inspection.
- Extended renderer shell verification for smoke script and smoke-mode wiring.
- Fixed a Frame module null-bounds bug that blocked `BrowserWindow` construction.

## Root Cause Found

Electron was installed and runnable:

- Electron: `42.2.0`
- Node inside Electron: `24.15.0`
- Project cwd: `F:\Projects\AURA-Sense`

The smoke hang was caused by the Frame module, not Electron installation.

`src/modules/Frame/windowShell.js` treated `state.bounds?.x !== null` as a safe null-bounds guard. When `state.bounds` was `null`, optional chaining returned `undefined`, and `undefined !== null` evaluated true. The module then dereferenced `state.bounds.x` before creating `BrowserWindow`.

The guard now requires `state.bounds` to exist before reading coordinates.

## Smoke Artifacts

Output directory:

```txt
.tmp\electron-visual-smoke
```

Artifacts observed:

- `first-light.png`
- `visual-smoke-launch.json`
- `visual-smoke-main-started.json`
- `visual-smoke-result.json`

Result summary:

```txt
status: passed
signalText: Empty
summaryText: No combat activity witnessed yet.
eventListText: No recent combat events witnessed.
```

Smoke checks passed:

- service bridge exists
- Frame window bridge exists
- Combat Witness bridge exists
- Node `require` is not exposed
- Electron globals are not exposed
- Combat Witness surface exists
- freshness/status text exists
- event list exists
- parser/runtime modules are not exposed

## Verification

Executed:

```powershell
npm.cmd run verify:electron-runtime
npm.cmd run verify:frame
npm.cmd run verify:renderer-shell
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Observed:

```txt
Frame module verified
renderer shell verified
core utilities verified
runtime error handling verified
combat parser verified
combat witness bridge verified
combat witness core verified
diagnostics policy verified
gamelog watcher verified
services verified
HTTP client verified
Frame module verified
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
```

## Deferred Risks

- Smoke is local runtime evidence, not CI coverage.
- Smoke does not require live EVE logs, zKill, ESI, or network access.
- Smoke covers the first-light viewport only, not future multi-lane HUD surfaces.
- Real gamelog watcher lifecycle remains unwired to the first-light viewport.

## Related Files

- `package.json`
- `scripts/electron-visual-smoke.ps1`
- `scripts/verify-electron-runtime.js`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-frame-module.js`
- `src/main/main.js`
- `src/modules/Frame/windowShell.js`
- `docs/audits/audit-2026-05-22-electron-visual-smoke-handover.md`
