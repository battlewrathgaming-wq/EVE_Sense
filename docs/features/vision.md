# Feature Vision: AURA-Sense Product Elements

Status: Active
Updated: 2026-05-23

This document defines the product elements AURA-Sense is building toward. It is not a claim that every element is complete.

## Product Frame

AURA-Sense is a tactical viewport for recent, scoped, operationally useful EVE observations.

It should answer:

```text
What is happening around me right now?
What must I notice?
What is stale, partial, degraded, or unavailable?
```

It should not become:

- AURA Atlas
- a historical intelligence warehouse
- a fleet command suite
- a recommendation engine
- a renderer-owned telemetry engine

## Element 1: Tactical HUD Shell

Goal:

Present current tactical state in a compact, stable, low-cognitive-load viewport.

Current state:

- Electron shell exists.
- Integrated tactical viewport foundation exists.
- Electron visual smoke exists.

Must not:

- compute telemetry truth in renderer
- hide degraded state
- rely on decorative motion for meaning

## Element 2: Combat Witness

Goal:

Convert local EVE gamelog observations into short-window tactical awareness.

Current state:

- parser fixtures exist
- watcher/runtime path exists
- 5s/15s/30s snapshots exist
- observed pressure, repair balance, source, weapon count, and spike-related metrics exist
- repair/healing raw fixture coverage is still incomplete

Must not:

- become historical combat storage
- infer unseen state
- present repair balance as survival truth

## Element 3: Passive Telemetry

Goal:

Provide current-system context and low-frequency activity signals.

Current state:

- local/static system resolver exists
- scoped zKill system context route exists
- ESI aggregate system kills/jumps activity client exists
- live IO gate exists
- stale/partial freshness honesty exists

Must not:

- auto-run Threat Intel
- expand ESI killmails
- poll aggressively
- retain long-term activity history

## Element 4: Threat Intel

Goal:

Support deliberate scoped tactical inspection from typed input or captured text.

Current state:

- scan request/snapshot contract exists
- local/static target resolver exists
- scoped zKill probe exists
- compact search surface exists
- live zKill smoke remains deferred until explicitly gated and recorded
- ESI expansion remains deferred

Must not:

- treat zKill summaries as truth
- scan on focus alone
- run broad background collection
- add Atlas persistence

## Element 5: Clipboard Acquisition

Goal:

Let the operator deliberately acquire a copied EVE target for a short Threat Intel workflow.

Current state:

- armed/listening/sealed/cooldown lifecycle exists
- preferred global shortcut is `Control+\` with fallback status reporting
- UI Arm control remains available

Must not:

- monitor clipboard indefinitely
- hide listener state
- bypass Threat Intel scan boundaries
- re-arm during cooldown

## Element 6: Diagnostics And Degraded State

Goal:

Make runtime confidence visible without flooding the HUD.

Current state:

- diagnostics policy exists
- runtime error handling exists
- diagnostics review surface exists
- provider/degraded state display exists

Must not:

- show provider failure as empty truth
- leak private raw logs
- mix developer noise into operator state without filtering

## Element 7: Settings And Runtime Control

Goal:

Let the operator configure runtime paths and live IO policy without invalid service state.

Current state:

- validated gamelog folder settings exist
- startup recovery exists without auto-starting watcher
- live IO policy control exists

Must not:

- accept invalid paths silently
- auto-start watchers just because settings exist
- expose internal toggles as product controls

## Element 8: Local Metadata

Goal:

Resolve tactical labels locally where practical.

Current state:

- local type metadata foundation exists
- read-only type lookup helper exists
- full refreshed SDE-derived metadata remains explicit and not default

Must not:

- hide unresolved IDs
- stage real SDE artifacts by default
- claim freshness it cannot prove

## Element 9: External API Boundary

Goal:

Keep live external calls scoped, respectful, observable, and replaceable.

Current state:

- HTTP wrapper exists
- live IO gate exists
- Passive Telemetry live smoke harness exists
- Threat Intel zKill live path is gated and deferred for explicit run

Must not:

- call APIs from renderer
- run live APIs in `verify:all`
- retry noisily under failure
- hide cap/freshness/sample limits

## Element 10: Atlas Handoff

Goal:

Allow future handoff to AURA Atlas without importing Atlas into AURA-Sense.

Current state:

- Atlas handoff is deferred by ADR.

Must not:

- persist evidence by default
- add Atlas watch execution
- create hidden historical reporting stores

## Support Feature: Combat Logging Test Suite

Goal:

Test real EVE gamelog examples safely through curated fixtures.

Current state:

- fixture ingestion exists
- event coverage matrix exists
- replay harness exists
- golden snapshot tests exist
- hostile parser fixtures exist

Must not:

- ingest private log directories by default
- require Electron for parser verification
- use replay harness behavior in normal runtime

## Current Hardening Focus

The active hardening runway is Milestone 13:

- hostile parser and renderer boundary tests are partly complete
- watcher chaos tests remain open
- live IO provider fault injection remains open
- clipboard acquisition race tests remain open
- runtime settings diagnostics fault tests remain open
- Electron visual state regression tests remain open
- local metadata/SDE builder hardening remains open

Use `docs/current-state/current-implementation.md` for current implementation truth.
