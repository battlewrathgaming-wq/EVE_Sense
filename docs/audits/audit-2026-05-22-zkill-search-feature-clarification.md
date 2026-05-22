# Audit: zKill Search Feature Clarification

Date: 2026-05-22
Scope: Clarify Passive Telemetry, Threat Intel search, and Clipboard Acquisition product intent.

## Verdict

Accepted as product doctrine refinement.

The feature direction is now clearer:

- Passive Telemetry is a current-system zKillmail context probe triggered by EVE log-observed gate jumps or current-system changes.
- Threat Intel starts as a deliberate search-bar zKillmail probe.
- Clipboard Acquisition is a visible Ctrl+Shift armed capture path that feeds the search bar and auto-runs the scoped scan.
- ESI killmail expansion is deferred unless a future milestone or ADR explicitly authorizes it.

## Doctrine Clarification

Passive Telemetry is not a broad environmental monitor. It should not poll aggressively or collect hidden background intelligence. It should react to local current-system observation and present scoped system context with freshness language.

Threat Intel is not required to start with ESI expansion. The first product surface should prove the operator-driven zKillmail scan, sample metadata, cap/failure language, and renderer/API boundary first.

Clipboard Acquisition is not persistent clipboard watching. It is a short armed workflow:

```txt
visible indicator
-> Ctrl+Shift arm
-> 3 second listen window
-> valid copied target goes to search box
-> scoped scan auto-runs
-> listener seals and cools down
```

## Records Updated

- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/current-state/current-implementation.md`
- `docs/gap/to-do/aura-sense-tactical-readiness.md`
- `docs/gap/to-do/performance-stability-compute-readiness.md`
- `docs/gap/to-do/readiness-05-zkill-ref-boundary.md`
- `docs/gap/to-do/readiness-06-threat-intel-sample-metadata.md`
- `docs/terms/passive-telemetry.md`
- `docs/terms/threat-intel.md`

## Handoff Impact

Milestone 06 should build Passive Telemetry as gate/current-system zKillmail context.

Milestone 07 should build search-bar Threat Intel and armed Clipboard Acquisition before any ESI expansion work.

Dev should not implement default ESI expansion inside the first search-bar scan.
