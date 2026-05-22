# Complete: Combat Witness Core

Status: Complete
Date: 2026-05-22

## Need

Combat Witness needed a backend-owned compute core before pressure gauges, EWAR witness, topology, spike displays, or renderer combat widgets could safely be added.

## Completed Work

- Added `CombatWitnessService` as the backend-owned event fan-out and snapshot boundary.
- Added 5s, 15s, and 30s rolling Combat Witness windows.
- Kept one-shot event stream items separate from rolling snapshot metrics.
- Added bounded event stream retention.
- Preserved rolling-window prune-on-add and retained-event caps.
- Isolated event listener and snapshot listener failures.
- Added a polling watcher strategy that feeds the same append-only `handleFile` parser path.
- Preserved offset seeding, complete-line buffering, duplicate suppression, and append-only observation for polling.
- Added watcher strategy diagnostics so the active strategy is observable.
- Added `npm run verify:combat-witness`.
- Included Combat Witness verification in `npm run verify:all`.

## Event Shape Used

The core consumes normalized parser events such as:

- `navigation.jump`
- `combat.damage`
- `combat.miss`
- future `combat.repair` events when exact raw fixtures exist

Snapshot output is compact and renderer-facing:

- `kind: combat.witness.snapshot`
- `observedAt`
- `windows.5s`
- `windows.15s`
- `windows.30s`
- bounded `eventStream`
- freshness metadata

## Retention And Window Policy

- Rolling metric windows: 5s, 15s, and 30s.
- Per-window retained event cap defaults to the `CombatRollingWindow` cap.
- Event stream retention is bounded separately from metric windows.
- Metrics are recomputed from recent rolling events.
- One-shot stream items are retained as compact event summaries, not permanent combat history.

## Listener Fan-Out Policy

- Event listeners are called through `CombatWitnessService.subscribeEvents`.
- Snapshot listeners are called through `CombatWitnessService.subscribeSnapshots`.
- Listener exceptions are traced and isolated so one consumer cannot stop later consumers.
- Renderer consumers should attach to snapshot output, not raw parser callbacks.

## Watcher Strategy And Fallback Policy

- Default watcher strategy remains `fs-watch`.
- `polling` strategy is available for environments where `fs.watch` is unreliable.
- `auto` strategy falls back from `fs-watch` to polling if watcher creation fails.
- Polling uses the same seeded offsets and `handleFile` append path as `fs-watch`.
- Polling does not replay old logs during normal operation.
- Active strategy is included in watcher status and diagnostics.

## Verification

Executed:

```powershell
npm.cmd run verify:combat-witness
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:combat-parser
npm.cmd run verify:all
```

Observed:

```txt
combat witness core verified
gamelog watcher verified
combat parser verified
core utilities verified
combat parser verified
combat witness core verified
gamelog watcher verified
services verified
HTTP client verified
Frame module verified
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
```

## Deferred Work

- No renderer Combat Witness widgets were added.
- No pressure gauge was added.
- No EWAR inference was added.
- No topology model was added.
- No persistent combat storage was added.
- Repair/healing parser coverage remains deferred until exact raw samples exist.

## Related Files

- `src/combat/combatWitnessService.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatRollingWindow.js`
- `scripts/verify-combat-witness-core.js`
- `scripts/verify-all.js`
- `package.json`
- `docs/audits/audit-2026-05-22-combat-witness-core-handover.md`
