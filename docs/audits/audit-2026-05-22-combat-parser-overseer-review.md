# Audit: Combat Parser Overseer Review

Date: 2026-05-22
Scope: Review of engineering handover for Combat Witness parser, EVE gamelog watcher, line buffering, duplicate suppression, and rolling combat metrics.

## Readiness Verdict

Ready with caveats.

The engineering contribution is accepted as the first backend-owned Combat Witness parser foundation. It correctly moves parsing out of the renderer, adds deterministic fixtures, adds a watcher that reads appended complete lines rather than replaying old logs, and includes parser/watcher verification in `verify:all`.

This is not yet accepted as complete Combat Witness core. It is also not enough to close the parser fixture gap until the hardening items below are addressed.

## Accepted Work

- Added `src/combat/combatLogParser.js` as a dedicated parser boundary.
- Added `fixtures/combat-log-parser.json` and `scripts/verify-combat-parser.js`.
- Added `src/combat/lineBuffer.js` for partial-line handling.
- Added `src/combat/recentEventDeduper.js` for short-window duplicate suppression.
- Added `src/combat/eveGamelogWatcher.js` and `scripts/verify-gamelog-watcher.js`.
- Added `src/combat/combatRollingWindow.js` as the first rolling metric primitive.
- Added parser and gamelog watcher verification to `npm.cmd run verify:all`.
- Updated current-state notes to acknowledge the parser/watcher/15s rolling metric foundation.

## Findings

### P2: Invalid EVE timestamps are normalized instead of rejected

`parseEveTimestamp()` uses JavaScript date rollover behavior. A malformed envelope such as:

```txt
[ 2021.99.99 99:99:99 ] (combat) Mining Drone misses you completely
```

currently parses into a future ISO timestamp instead of returning `null`.

This weakens the parser boundary because malformed-but-envelope-shaped lines can become normalized events.

Required follow-up:

- validate month, day, hour, minute, and second ranges before constructing the ISO timestamp
- reject rollover dates where the resulting UTC components do not match the input
- add rejected fixtures for out-of-range date/time values

### P2: Rolling retention is only enforced during snapshot

`CombatRollingWindow.add()` appends events without pruning or max-retained protection. Retention is currently enforced only when `snapshot()` is called.

That is acceptable for the current verification harness, but a runtime service could accumulate events if snapshot cadence stops or is delayed.

Required follow-up:

- prune on add, or require the future snapshot service to call snapshot/prune at a bounded cadence
- add a max retained event cap before high-volume combat use
- add verification for retention behavior under append-heavy input

### P2: Watcher callback path does not isolate parser/listener failures

`EveGamelogWatcher.handleFile()` calls parser and `onEvent()` directly inside the file handling path.

The current parser fixtures pass, but future parser expansion or listener code should not be able to stop the stream silently or crash the watcher loop.

Required follow-up:

- catch parser exceptions and report rejected/error diagnostics
- catch listener exceptions and continue processing later lines
- preserve the raw line reference or hash in error reports without storing permanent combat history

### P3: Combat event schema still describes a seed shape

`docs/schemas/combat-event.md` remains seed-level and does not yet name the actual emitted parser fields such as `eventTime`, `channel`, `rawLineHash`, `rawColor`, `hitQuality`, `weaponLabel`, `fromSystemName`, and `systemName`.

Required follow-up:

- update the schema after the parser timestamp hardening pass
- keep navigation and combat event variants explicit
- preserve uncertainty language: observed event, not authoritative truth

## Doctrine Assessment

No doctrine drift found in the contribution.

The parser work preserved the important boundaries:

- no renderer parsing
- no live API work
- no persistent combat archive
- no Atlas-style evidence semantics
- no tactical claims beyond observed normalized telemetry

The main pressure now is sequencing: do not build pressure gauges, EWAR displays, topology, or renderer widgets until the event bus and snapshot service exist.

## Verification

Executed:

```powershell
npm.cmd run verify:all
```

Observed:

```txt
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

Additional edge probe:

```txt
[ 2021.99.99 99:99:99 ] (combat) Mining Drone misses you completely
```

Result:

```txt
Accepted as navigation/combat event with rolled-over future timestamp.
```

This confirms the timestamp validation finding.

## Dev Handshake

Next authorized Dev slice:

```txt
Combat parser hardening acceptance pass
```

Work from:

- `docs/gap/to-do/readiness-08-combat-parser-fixtures.md`
- `docs/gap/to-do/readiness-07-combat-witness-core.md`
- `docs/audits/engineering_audit_contribution.md`

Do first:

- harden timestamp parsing and add rejected timestamp fixtures
- isolate parser and listener failures in the watcher path
- add rolling-window retention/cap verification or explicitly defer cap behind the snapshot service
- update `docs/schemas/combat-event.md` once emitted shape is stable

Do not do yet:

- no renderer combat widgets
- no pressure gauge
- no EWAR inference
- no topology model
- no persistent combat storage
- no live EVE API calls

Expected verification:

```powershell
npm.cmd run verify:combat-parser
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:all
```

Expected handover:

- parser fixtures added
- rejected malformed timestamp cases covered
- watcher failure behavior described
- rolling retention policy described
- verification output included
- explicit remaining parser gaps named

## Gap Verdict

- Keep `readiness-08-combat-parser-fixtures.md` open, now partial.
- Keep `readiness-07-combat-witness-core.md` open, now partial.
- Do not start Combat Witness UI expansion until event fan-out and snapshot emission exist.
