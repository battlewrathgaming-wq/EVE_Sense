# Complete: Combat Parser Fixture Tests

Status: Complete
Date: 2026-05-22

## Need

Combat Witness parser behavior must be testable without launching Electron or reading real EVE logs.

The parser also needed acceptance hardening after the first parser foundation: malformed EVE timestamp envelopes were being normalized by JavaScript date rollover, watcher callbacks were not isolated from parser/listener failures, and rolling metric retention needed bounded runtime behavior.

## Completed Work

- Kept parser ownership in `src/combat/combatLogParser.js`.
- Added rejected fixtures for invalid envelope-shaped timestamps.
- Hardened `parseEveTimestamp()` with explicit range checks and UTC component round-trip validation.
- Rejected malformed timestamp rollover instead of normalizing into a future date.
- Isolated parser exceptions in `EveGamelogWatcher` and reported them through rejected-line diagnostics.
- Isolated listener exceptions so one consumer cannot stop later appended lines.
- Added raw-line hashes to parser exception reports without retaining raw line text.
- Added rolling-window prune-on-add behavior.
- Added a configurable max retained event cap for append-heavy input.
- Updated the combat event schema to describe the emitted parser fields.

## Cases Covered

- accepted incoming color damage
- accepted outgoing color damage
- accepted incoming miss
- accepted outgoing miss
- accepted navigation jump
- rejected non-actionable notify line
- rejected malformed line
- rejected invalid timestamp month
- rejected invalid timestamp day rollover
- rejected invalid timestamp hour
- rejected invalid timestamp minute
- rejected invalid timestamp second
- overlong line rejection
- stable event identity
- duplicate suppression
- partial-line buffering
- parser exception isolation
- listener exception isolation
- rolling-window prune-on-add
- rolling-window max retained event cap

## Unsupported Or Deferred Event Families

- repair/healing parser coverage remains deferred until exact raw samples exist
- EWAR parser coverage remains deferred until exact raw samples exist
- topology inference remains out of scope
- pressure gauges and renderer combat widgets remain out of scope

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

## Related Files

- `src/combat/combatLogParser.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatRollingWindow.js`
- `fixtures/combat-log-parser.json`
- `scripts/verify-combat-parser.js`
- `scripts/verify-gamelog-watcher.js`
- `docs/schemas/combat-event.md`
- `docs/audits/audit-2026-05-22-combat-parser-hardening-handover.md`
