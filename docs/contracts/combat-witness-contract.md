# Contract: Combat Witness

Status: Active Foundation
Date: 2026-05-22

## Purpose

Defines the transient combat-log witness model.

## Inputs

- newly appended EVE combat log lines
- file offset state
- parser output

## Outputs

- normalized combat events
- rolling-window snapshots
- one-shot event stream items

## Invariants

- Process newly appended log content only.
- Do not replay entire old logs during normal operation.
- Keep rolling windows bounded.
- Snapshot metrics may be recomputed from recent events.
- Event stream items should trigger once and expire.
- EWAR and pressure states must be labeled as observed/recent, not perfect truth.

## Must Not Do

- Do not preserve permanent combat history in AURA-Sense.
- Do not aggregate alpha spikes by ship label when labels may collide.
- Do not infer unseen state from missing log lines.
- Do not repeatedly re-alert from the same rolling-cache event.

## Current Implemented Foundation

- Parser emits normalized `navigation.jump`, `combat.damage`, and `combat.miss` events.
- Combat Witness compute accepts normalized `combat.repair` events for rolling HPS and repair-balance tests, but raw repair log parsing remains gated behind exact fixtures.
- Gamelog watcher supports `fs-watch`, `polling`, and `auto` fallback strategies.
- `CombatWitnessService` owns event fan-out, 5s/15s/30s snapshots, bounded event stream items, source/target counts, hit-quality counts, and observed HPS-DPS balance.
- Listener failures are isolated.
- `combat.witness.*` service commands own runtime path/status/start/stop control.
- Renderer presentation consumes backend-owned snapshots and watcher status.

## Verification

Current checks:

```powershell
npm.cmd run verify:combat-parser
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:combat-witness
npm.cmd run verify:combat-runtime
npm.cmd run verify:all
```

