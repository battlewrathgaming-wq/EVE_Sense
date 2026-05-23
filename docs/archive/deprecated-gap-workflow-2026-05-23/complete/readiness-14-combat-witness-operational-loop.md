# Complete: Combat Witness Operational Loop

Status: Complete
Date: 2026-05-22

## Feature Anchors

- `docs/features/vision.md` Element 1: Tactical HUD Shell
- `docs/features/vision.md` Element 2: Combat Witness
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 7: Settings And Runtime Control

## Need

First Light presented backend-owned Combat Witness snapshots, but the viewport did not yet own an operator-usable local observation loop.

## Completed Work

- Added backend Combat Witness runtime owner.
- Added service commands:
  - `combat.witness.status`
  - `combat.witness.configure`
  - `combat.witness.start`
  - `combat.witness.stop`
- Reused existing gamelog path validation before runtime mutation.
- Wired `EveGamelogWatcher` into the backend Combat Witness service.
- Decorated snapshots with backend-owned watcher operational status.
- Added renderer controls for explicit gamelog folder path, start, stop, watcher state, and watcher message.
- Kept renderer presentation-only; parser, watcher, filesystem, and metrics remain backend-owned.
- Extended visual smoke checks to prove watcher controls and unavailable state without live logs.
- Added offline runtime verification for missing path, valid path, watcher start, event feed, snapshot status, and stop behavior.

## Snapshot / Status Fields Consumed By Renderer

- `snapshot.operational.watcher.state`
- `snapshot.operational.watcher.message`
- `snapshot.operational.watcher.path`
- `snapshot.freshness.status`
- `snapshot.freshness.eventStreamCount`
- `snapshot.windows.5s.damage.incoming.total`
- `snapshot.windows.15s.repair.incoming.total`
- `snapshot.eventStream`

## Diagnostics And Status Surfaced

- Missing or invalid gamelog paths are presented as `Unavailable`.
- Watcher errors and invalid watcher states normalize to `Degraded`.
- Watching state is presented as operational state, not tactical certainty.
- Combat activity remains `Witnessed`, `Recent`, `Stale`, or `Empty` only after the watcher is active.

## Verification

Executed:

```powershell
npm.cmd run verify:combat-runtime
npm.cmd run verify:combat-bridge
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Observed:

```txt
combat witness runtime verified
combat witness bridge verified
renderer shell verified
renderer boundary verified (4 files scanned)
core utilities verified
runtime error handling verified
combat parser verified
combat witness bridge verified
combat witness runtime verified
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

Smoke result summary:

```txt
status: passed
signalText: Unavailable
watcherText: Unavailable
summaryText: Combat Witness snapshot is unavailable.
eventListText: Snapshot unavailable.
```

## Deferred Risks

- No live EVE client log folder was exercised.
- Gamelog folder configuration is session-scoped; persistent product settings remain deferred.
- The renderer uses a typed path input; native folder picker UX remains deferred.
- Exact raw repair/healing fixtures remain deferred.
- Passive Telemetry, Threat Intel, pressure, EWAR, topology, and recommendations remain deferred.

## Related Files

- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessBridge.js`
- `src/main/main.js`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `scripts/verify-combat-witness-runtime.js`
- `scripts/verify-renderer-shell.js`
- `docs/audits/audit-2026-05-22-combat-witness-operational-loop-handover.md`
