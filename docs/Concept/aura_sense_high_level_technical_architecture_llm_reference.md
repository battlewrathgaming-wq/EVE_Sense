# AURA-Sense High-Level Technical Reference

Status: Active reference
Updated: 2026-05-23

Use this file as a plain technical orientation for future Codex sessions. Current implementation truth still lives in `docs/current-state/current-implementation.md`.

## Architecture Shape

```text
main process services
-> parser/client/watcher/cache/compute modules
-> service command and event boundary
-> preload API
-> renderer HUD presentation
```

The renderer presents backend-owned snapshots. It does not parse logs, call providers, or own tactical truth.

## Implemented Foundation

AURA-Sense currently includes:

- Electron main/preload/renderer boundary
- service command registry
- task/status vocabulary
- diagnostics taxonomy
- HTTP client utilities
- Combat Witness parser/watcher/runtime path
- Combat Witness snapshot bridge
- Passive Telemetry snapshot lane
- scoped zKill and ESI aggregate system activity clients for Passive Telemetry
- Threat Intel scan request and target resolver boundary
- Clipboard Acquisition lifecycle
- integrated viewport foundation
- runtime settings persistence and diagnostics review
- local type metadata foundation
- aggressive testing matrix and several adversarial checks

## Lane Boundaries

### Combat Witness

Source:

- local EVE gamelog lines

Output:

- rolling observed events
- 5s/15s/30s snapshots
- recent combat metrics

Not output:

- evidence history
- survival truth
- perfect attribution

### Passive Telemetry

Source:

- current-system observation
- local/static resolution
- scoped live calls only when allowed

Output:

- current system context
- aggregate activity and bounded zKill context
- freshness/degraded state

Not output:

- Threat Intel scan
- ESI killmail expansion
- long-term history

### Threat Intel

Source:

- explicit operator search
- valid clipboard acquisition

Output:

- scoped zKill-backed sample
- cap/freshness/failure basis

Not output:

- Atlas report
- persistent evidence
- default ESI expansion

## External Calls

Live calls must be:

- explicit
- gated
- scoped
- logged/diagnosed
- outside `verify:all`

Provider failure should be degraded/unavailable state, not empty truth.

## Local Metadata

Static type/system labels should resolve locally where practical.

Unknown IDs should remain visible. Do not hide unresolved values behind guessed names.

## Current Unproven Areas

- live Threat Intel zKill smoke
- optional ESI expansion path
- full current SDE type metadata refresh
- exact raw repair/healing parser coverage
- native folder picker
- provider request pulse UI
- real operator live gamelog smoke
