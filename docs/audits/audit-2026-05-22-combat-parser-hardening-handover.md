# Audit: Combat Parser Hardening Handover

Date: 2026-05-22
Scope: Combat parser acceptance hardening after `audit-2026-05-22-combat-parser-overseer-review.md`.

## Readiness Verdict

Ready with caveats.

The parser fixture gap is complete for the current supported parser claims. Combat Witness Core remains incomplete because event fan-out, snapshot service, and compact renderer snapshot emission do not yet exist.

## Completed Work

- Hardened EVE timestamp parsing against invalid ranges and date rollover.
- Added rejected fixtures for malformed envelope-shaped timestamps.
- Added watcher parser exception isolation.
- Added watcher listener exception isolation.
- Added raw-line hash diagnostics for parser exceptions without retaining raw line text.
- Added rolling-window prune-on-add behavior.
- Added configurable max retained event cap.
- Updated the combat event schema from seed suggestions to current emitted fields.
- Archived `readiness-08-combat-parser-fixtures.md` in `docs/gap/complete/`.

## Verification

Executed:

```powershell
npm.cmd run verify:combat-parser
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:all
```

Observed:

```txt
combat parser verified
gamelog watcher verified
core utilities verified
combat parser verified
gamelog watcher verified
services verified
HTTP client verified
Frame module verified
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
```

## Remaining Risks

- Parser support is intentionally narrow and should not be treated as complete EVE combat log coverage.
- Repair/healing, EWAR, topology, and pressure interpretation remain deferred.
- Combat Witness still needs a backend event fan-out and snapshot service before renderer expansion.
- Multiple rolling windows such as 5s/15s/30s are not yet wired into a service boundary.

## Recommended Next Slice

Continue with `docs/gap/to-do/readiness-07-combat-witness-core.md`.

Expected focus:

- watcher strategy hardening with chokidar-style behavior or a polling fallback
- backend event fan-out
- 5s/15s/30s snapshot service
- compact renderer-facing snapshot shape
- clear split between rolling snapshot metrics and one-shot event stream items

Do not add Combat Witness UI widgets until snapshot emission exists.
