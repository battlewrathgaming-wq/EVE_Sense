# Audit: Combat Witness Core Handover

Date: 2026-05-22
Scope: Backend Combat Witness event fan-out, rolling snapshots, and watcher strategy hardening.

## Readiness Verdict

Ready with caveats.

The backend Combat Witness core is now sufficient to answer what was observed in the last 5/15/30 seconds without renderer-owned computation. This is not a UI milestone and does not add pressure, EWAR, topology, or historical persistence.

## Completed Work

- Added backend `CombatWitnessService`.
- Added event fan-out and snapshot fan-out with listener failure isolation.
- Added 5s/15s/30s rolling snapshot windows.
- Kept bounded one-shot event stream items separate from rolling metrics.
- Added polling watcher strategy for environments where `fs.watch` is unreliable.
- Preserved append-only observation semantics in polling by reusing seeded offsets and `handleFile`.
- Added watcher strategy diagnostics.
- Added `verify:combat-witness` and included it in `verify:all`.
- Archived `readiness-07-combat-witness-core.md` in `docs/gap/complete/`.

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

## Remaining Risks

- Combat Witness is still backend-only; no renderer subscription path has been wired yet.
- No pressure/EWAR/topology model exists yet.
- Repair/healing parsing still waits on exact raw samples.
- Polling exists as a fallback strategy, but long-session live smoke has not been run.

## Recommended Next Slice

Return to safety and service readiness order:

```txt
docs/gap/to-do/readiness-03-ipc-settings-validation.md
```

After service validation and diagnostics throttling, Combat Witness presentation can consume snapshots without becoming telemetry authority.
