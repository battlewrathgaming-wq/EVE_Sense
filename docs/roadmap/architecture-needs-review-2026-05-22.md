# Architecture Needs Review: Post Combat Witness Loop

Status: Active
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Current Baseline

AURA-Sense now has:

- Electron shell and preload bridge
- renderer boundary verification
- Combat Witness parser, watcher, runtime, bridge, and HUD surface
- Electron visual smoke
- backend service registry and validation helpers
- zKill/search feature doctrine clarified, with ESI expansion deferred

The project is ready to expand from one proven lane into the next feature lane, but it should pause long enough to avoid accidental coupling.

## Architectural Needs Before Passive Telemetry

### 1. Gamelog Observation Ownership

Current state:

- `EveGamelogWatcher` parses both combat and navigation events.
- `CombatWitnessRuntime` currently owns the watcher lifecycle.
- Passive Telemetry needs navigation/current-system events from the same local observation stream.
- The engineering audit records strict watcher behavior:
  - existing files are offset-seeded and not replayed
  - newly discovered files are seeded at current size and not tail-replayed
  - only future appended bytes are read
  - partial lines are buffered until complete
  - duplicate normalized events are suppressed inside a short TTL

Need:

Create one backend-owned observation path for EVE gamelog events.

Canonical target:

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

Acceptable approaches:

- Extract a small shared gamelog observation runtime that can feed Combat Witness and Passive Telemetry while preserving append-only watcher semantics.
- Or, as a narrower first step, let the existing backend runtime publish navigation events to a Passive Telemetry service without giving renderer ownership.

Guardrail:

Do not create a second hidden watcher for Passive Telemetry unless an audit proves it is necessary.

Do not replay old log content to populate Passive Telemetry; it should react to future observed navigation/current-system events.

The normalized event stream should fan out backend-side. Renderer code consumes snapshots only.

### 2. Passive Snapshot Contract

Need:

Define a renderer-facing Passive Telemetry snapshot before UI work.

Minimum fields:

- current system label
- source event time
- observed/fetched timestamps
- freshness status
- zKill sample count
- capped/partial/failure metadata
- unavailable/degraded message

Guardrail:

The snapshot should describe system context, not threat certainty.

### 3. zKill System Context Client

Need:

Add a backend-only zKillmail client boundary for current-system context.

Required behavior:

- injected fetch for offline verification
- timeout/cancel/retry policy via existing HTTP client helpers
- explicit User-Agent
- bounded response normalization
- cache/freshness metadata
- no renderer fetch
- no ESI expansion

Guardrail:

zKill output is context, not complete truth.

### 4. System Resolution

Need:

Resolve current system names/IDs without importing a heavy static data requirement too early.

Acceptable first slice:

- preserve system name from EVE logs
- add a small resolver interface
- use fixture/static metadata only where required for zKill query shape
- keep unresolved labels visible

Guardrail:

Do not import large metadata datasets before a consumer proves the need.

### 5. Lane Separation

Need:

Passive Telemetry and Threat Intel must remain separate even if both use zKillmail.

Difference:

- Passive Telemetry: automatic current-system context from local log observation and freshness policy.
- Threat Intel: operator-initiated search bar or armed clipboard scan.

Guardrail:

Do not let Passive Telemetry update active Threat Intel state or auto-run search scans.

### 6. Verification And Smoke

Need:

Keep `verify:all` offline and deterministic.

Expected checks:

- navigation/current-system fixture parsing
- observation fan-out or runtime routing
- zKill client normalization with injected fetch
- cache/freshness behavior
- renderer boundary: no fetch, no filesystem, no parser
- lane separation
- Electron smoke for passive panel empty/unavailable/ready states that can be proven offline

Live zKill smoke, if run, must remain separate from `verify:all`.

## Recommended Next Milestone

Proceed with:

- `docs/roadmap/milestone-06-passive-telemetry-foundation.md`
- `docs/gap/to-do/readiness-15-passive-telemetry-foundation.md`

Do not start Threat Intel search bar or Clipboard Acquisition until Passive Telemetry's automatic current-system lane has a clean backend boundary.
