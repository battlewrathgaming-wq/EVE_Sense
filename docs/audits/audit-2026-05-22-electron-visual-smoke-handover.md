# Audit: Electron Visual Smoke Handover

Date: 2026-05-22
Scope: Runtime Electron visual smoke and Frame module launch blocker.

## Readiness Verdict

Ready with caveats.

AURA-Sense now has a separate runtime smoke command that launches the real Electron shell, verifies the preload bridges and first-light viewport, captures a screenshot, writes a structured result, and exits cleanly.

## Completed Work

- Added `smoke:electron`.
- Added PowerShell smoke runner.
- Added explicit smoke env and argv flags.
- Added main-process visual smoke checks and screenshot capture.
- Added structured success/failure result output.
- Added Electron runtime verifier for install/runtime inspection.
- Extended static renderer-shell verification to keep smoke wiring present.
- Fixed Frame module null-bounds dereference before `BrowserWindow` creation.
- Moved the readiness packet to complete.

## Debug Notes

The initial smoke attempts launched Electron but produced no result file. Debugging showed:

- `electron.cmd --version` returned `v42.2.0`.
- Minimal Electron verifier launched successfully.
- Minimal Electron saw the smoke env and argv flags.
- AURA-Sense `main.js` entered under smoke mode.
- Execution stopped inside the Frame module before `BrowserWindow` construction.

Root cause:

```txt
state.bounds?.x !== null
```

evaluated true when `state.bounds` was null, causing a later `state.bounds.x` dereference.

## Verification

Executed:

```powershell
npm.cmd run verify:electron-runtime
npm.cmd run verify:frame
npm.cmd run verify:renderer-shell
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Smoke artifact directory:

```txt
F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
```

Artifacts:

- `first-light.png`
- `visual-smoke-launch.json`
- `visual-smoke-main-started.json`
- `visual-smoke-result.json`

Result:

```txt
status: passed
signalText: Empty
summaryText: No combat activity witnessed yet.
eventListText: No recent combat events witnessed.
```

## Concerns

- The visual smoke is local and environment-sensitive by design.
- `verify:electron-runtime` is intentionally separate from `verify:all`.
- The smoke does not validate live watcher lifecycle.
- Future viewport lanes will need expanded screenshots/checks.

## Deferred Work

- CI smoke policy.
- Real gamelog watcher lifecycle wiring.
- Product settings for log path and watcher status.
- Passive Telemetry and Threat Intel runtime lanes.
