# Audit: Engineering Contribution - Combat Witness Runtime Boundary

Date: 2026-05-22
Scope: Backend Combat Witness parser, configurable EVE gamelog watcher, 15 second rolling combat metrics, and normalized event stream ownership.

## Readiness Verdict

Ready with caveats.

AURA-Sense now has the first backend-owned Combat Witness runtime boundary. It can watch a user-defined EVE `Gamelogs` folder, parse newly appended complete lines into normalized observed events, suppress short-window duplicates, and compute 15 second rolling damage/repair metrics.

This is not yet a full Combat Witness service. It is the fixture-backed parser and cache foundation that a service can consume.

## Implemented Contribution

### Parser Boundary

Implemented in:

- `src/combat/combatLogParser.js`
- `fixtures/combat-log-parser.json`
- `scripts/verify-combat-parser.js`

Current accepted event families:

- `navigation.jump`
- `combat.damage`
- `combat.miss`

Current rejected behavior:

- malformed lines return `null`
- overlong lines return `null`
- unsupported notify/question/control lines return `null`

Current parser principles:

- raw EVE log line in
- normalized observed event out
- no renderer parsing
- no persistent combat history
- no tactical claims beyond observed telemetry

### Gamelog Watcher Boundary

Implemented in:

- `src/combat/eveLogPaths.js`
- `src/combat/eveGamelogWatcher.js`
- `scripts/verify-gamelog-watcher.js`

The watcher accepts a user-defined folder path. The Windows default helper points to:

```txt
Documents\EVE\logs\Gamelogs
```

The watcher behavior is stricter than the old Aura 7 prototype:

- existing files are offset-seeded and not replayed
- newly discovered files are seeded at current size and not tail-replayed
- only future appended bytes are read
- partial lines are buffered until complete
- duplicate normalized events are suppressed inside a short TTL

### Rolling Metrics

Implemented in:

- `src/combat/combatRollingWindow.js`

Current 15 second rolling snapshot computes:

- damage taken total
- damage taken DPS
- damage dealt total
- damage dealt DPS
- repairs received total
- repairs received HPS
- repairs applied total
- repairs applied HPS
- received HPS minus taken DPS
- incoming hit-quality counts
- outgoing hit-quality counts
- most common incoming hit quality
- most common outgoing hit quality
- incoming damage type counts when event data contains `damageType`
- most common incoming damage type when known
- unique incoming source label count
- top incoming source label by count

## Stream Ownership Decision

The intended model is:

```txt
EVE gamelog watcher
-> complete appended lines
-> parser
-> normalized observed event stream
   -> rolling DPS/HPS window consumer
   -> jump/location consumer
   -> future EWAR consumer
   -> future diagnostics/debug consumer
   -> future HUD snapshot service
```

This should be one lightweight backend process path at first, not a worker.

The current implementation has a single `onEvent(event)` callback from `EveGamelogWatcher`. That is enough for the first runtime service, but it is not yet a formal event bus. The next service layer should fan out the same normalized event to multiple backend listeners.

## Performance Notes

Current rolling-window compute is intentionally simple:

- bounded by event age
- one in-memory array
- one pass per snapshot
- no renderer involvement
- no database writes

This is appropriate for a 15 second tactical window.

If combat volume grows enough to matter, improve in this order:

1. Add a max retained event cap as a safety rail.
2. Coalesce snapshot emission to a fixed cadence, such as 250-500ms.
3. Keep per-listener failures isolated so one consumer cannot break fan-out.
4. Only then consider pre-aggregated buckets or a worker.

Do not introduce a worker until there is measured pressure from enrichment, replay, topology, or graph computation.

## Open Ends

### Event Bus / Listener Fan-Out

Required before multiple runtime consumers are attached.

Requirements:

- one normalized event enters the bus once
- every backend listener receives the same event shape
- listener exceptions are captured and reported, not allowed to stop the stream
- no renderer listener may parse raw logs
- event objects should be treated as immutable by convention or by shallow freeze

### Repair / Healing Parser Fixtures

The rolling cache supports `combat.repair`, but exact raw repair/healing parsing is not proven yet.

Requirements:

- collect exact raw repair/healing samples
- classify local reps, incoming remote reps, outgoing remote reps, and boost-style lines separately
- avoid treating repair cost, module denial, or capacitor failure as healing
- add fixtures before parser expansion

### Damage Type Source

The rolling cache supports `damageType` when present. Current exact damage samples reliably expose amount, direction, source/target label, weapon label, color, and hit quality. They do not always expose true EVE damage type.

Requirements:

- do not infer damage type from weapon label without an explicit metadata rule
- if local type metadata later maps ammo/weapon to damage profile, label it as derived metadata
- keep `mostCommonDamageType` nullable when unknown

### Jump / Location Consumer

The parser emits `navigation.jump`, but no location tracker service exists yet.

Requirements:

- consume normalized jump events
- maintain current observed system
- expose freshness and observed time
- do not trigger Threat Intel or Passive Telemetry until those lanes exist

### Snapshot Service

The rolling cache can produce snapshots, but no service currently schedules or emits them.

Requirements:

- consume normalized combat events
- update rolling windows
- emit compact snapshots at a bounded cadence
- separate one-shot event stream items from recomputed metrics
- preserve labels such as observed/recent/witnessed

### Settings / Path Selection

The watcher accepts a user-defined folder path, but no AURA-Sense settings UI/service owns that path yet.

Requirements:

- validate selected folder before starting watcher
- store user override only through the settings service once that service exists
- keep OS defaults as suggestions, not assumptions
- support redirected Documents/OneDrive/non-standard layouts

## Current Verification

```powershell
npm.cmd run verify:combat-parser
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:all
```

Current successful verification output:

```txt
core utilities verified
combat parser verified
gamelog watcher verified
services verified
HTTP client verified
Frame module verified
renderer boundary verified
renderer shell verified
all checks verified
```

## Recommended Next Gaps

- Add a backend normalized event bus/fan-out service.
- Add exact repair/healing fixtures before parsing repair lines.
- Add a Combat Witness snapshot service around `CombatRollingWindow`.
- Add current-system tracker from `navigation.jump`.
- Update `docs/schemas/combat-event.md` from seed shape to the actual parser event shape after the next parser pass.
- Move `readiness-08-combat-parser-fixtures.md` toward complete once accepted/rejected fixture coverage is broad enough.
- Keep `readiness-07-combat-witness-core.md` open until snapshot emission and listener fan-out exist.

