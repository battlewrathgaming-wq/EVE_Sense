# Complete: Combat Witness Snapshot Bridge

Status: Complete
Date: 2026-05-22

## Need

Combat Witness had backend-owned snapshots, but the renderer did not have an explicit boundary for receiving them.

## Completed Work

- Added `src/combat/combatWitnessBridge.js`.
- Added IPC channels for direct snapshot request, subscription, unsubscribe, and snapshot delivery.
- Exposed compact Combat Witness snapshot methods through preload as `window.auraCombatWitness`.
- Kept raw parser events and rolling metric computation in backend code.
- Added unsubscribe behavior for renderer consumers.
- Added throttled bridge emission with bounded pending snapshot flush support.
- Added verification that the bridge exposes backend-owned rolling metrics without renderer computation.
- Extended renderer shell verification to require the preload bridge.
- Included bridge verification in `npm run verify:all`.

## Boundary Added

IPC channels:

- `aura:combat-witness:get-snapshot`
- `aura:combat-witness:subscribe`
- `aura:combat-witness:unsubscribe`
- `aura:combat-witness:snapshot`

Preload API:

- `window.auraCombatWitness.getSnapshot()`
- `window.auraCombatWitness.subscribeSnapshots(callback)`

## Snapshot Shape Exposed

The bridge exposes the compact backend snapshot:

- `kind: combat.witness.snapshot`
- `observedAt`
- `windows.5s`
- `windows.15s`
- `windows.30s`
- bounded `eventStream`
- `freshness`

## Update Cadence

- Bridge snapshot publication is throttled by `minUpdateIntervalMs`.
- Rapid updates keep the newest pending snapshot.
- Pending snapshots flush on a bounded timer instead of waiting for another combat event.
- Renderer consumers receive compact snapshots, not one IPC message per raw combat event.

## Verification

Executed:

```powershell
npm.cmd run verify:combat-bridge
npm.cmd run verify:renderer-shell
npm.cmd run verify:all
```

Observed:

```txt
combat witness bridge verified
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
```

## Deferred Risks

- Renderer presentation of the snapshot remains deferred to Tactical HUD First Light.
- No pressure, EWAR, topology, or recommendations were added.
- No live app smoke was run.

## Related Files

- `src/combat/combatWitnessBridge.js`
- `src/main/main.js`
- `src/main/preload.js`
- `scripts/verify-combat-witness-bridge.js`
- `scripts/verify-renderer-shell.js`
- `docs/audits/audit-2026-05-22-combat-witness-snapshot-bridge-handover.md`
