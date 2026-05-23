# AURA-Sense

AURA-Sense is a local Electron tactical viewport for EVE Online.

It is built to present recent operational observations with low cognitive load. It is not a historical intelligence platform, persistent evidence store, fleet command suite, or Atlas clone.

## Current Product State

AURA-Sense currently has a verified runtime foundation and integrated tactical viewport foundation.

Implemented and verified areas include:

- minimal Electron shell and preload boundary
- renderer boundary static checks
- service command registry and task/status vocabulary
- diagnostics and runtime error handling
- HTTP client utilities with timeout/cancellation/retry behavior
- Combat Witness parser, watcher, rolling metrics, and snapshot bridge
- 5s/15s/30s Combat Witness snapshots
- gamelog watcher lifecycle and diagnostics
- Passive Telemetry backend snapshot lane
- scoped Passive Telemetry zKill route and ESI aggregate system activity client
- one-hour Passive Telemetry ESI activity cache with ETag revalidation behavior
- backend-owned live IO gate for Passive Telemetry and Threat Intel
- Threat Intel scan request/snapshot contract
- local/static Threat Intel target resolver
- backend-only scoped Threat Intel zKill probe
- compact Threat Intel search surface that scans only on explicit submit
- Clipboard Acquisition with armed/listening/sealed/cooldown lifecycle
- global clipboard arming shortcut using `CommandOrControl+Shift+Space`
- integrated HUD layout for Combat Witness, Passive Telemetry, and Threat Intel
- runtime settings persistence and startup recovery without auto-starting watchers
- diagnostics review surface
- local type metadata foundation
- combat-log fixture ingestion, coverage matrix, replay harness, and golden snapshots
- adversarial parser and renderer/preload boundary tests

## Not Yet Proven

AURA-Sense has not yet proven:

- live zKill-backed Threat Intel search through a recorded live smoke
- optional ESI killmail expansion for Threat Intel
- full refreshed type metadata generated from current SDE source
- exact raw repair/healing parser coverage
- native gamelog folder picker
- live EVE gamelog operational smoke on an operator machine
- provider request pulse UI
- calibrated damage spike emphasis from real datasets
- production-grade visual polish beyond the current integrated foundation

## Product Boundary

AURA-Sense answers:

```text
What is happening around me right now?
What must I notice?
What is stale, partial, degraded, or unavailable?
```

AURA Atlas answers:

```text
What patterns emerge over time?
What evidence should be preserved?
What assessments should be remembered?
```

This boundary is mandatory.

## Runtime Lanes

### Combat Witness

Short-window tactical telemetry from local EVE gamelog lines.

It is observational and transient. It is not historical evidence.

### Passive Telemetry

Current-system context and low-frequency activity signals.

It must stay separate from deliberate Threat Intel scans and must not become background intelligence collection.

### Threat Intel

Operator-initiated scoped search for systems, pilots, corporations, alliances, or copied text.

Current implementation is zKill-backed and sample/cap/freshness aware. ESI killmail expansion remains deferred unless explicitly authorized by future doctrine.

### Clipboard Acquisition

Deliberate short-lived input capture for tactical search. It is not persistent clipboard surveillance.

## Verification

Run the deterministic offline suite:

```powershell
npm run verify:all
```

Run Electron visual smoke separately:

```powershell
npm.cmd run smoke:electron
```

Live API smoke remains opt-in and outside `verify:all`:

```powershell
$env:AURA_SENSE_LIVE_API="1"
```

## App Shell

```powershell
npm start
```

## Current Work Focus

Current hardening work is focused on aggressive testing and bug hunting:

- gamelog watcher chaos tests
- live IO provider fault injection
- clipboard acquisition race tests
- runtime settings and diagnostics fault tests
- Electron visual state regression tests
- local metadata/SDE builder hardening
- bug-hunt triage and failure records

See:

- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/gap/to-do/README.md`

## Development Rule

Borrow proven rigging. Do not import domain weight before the AURA-Sense runtime has earned it.

Keep telemetry backend-owned, renderer-presented, bounded, and honest about uncertainty.
