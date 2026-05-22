# Audit: Current State Alignment

Date: 2026-05-22
Scope: Current AURA-7 Electron implementation compared against seeded tenets, contracts, and existing concept docs.

## Summary

AURA-7 is currently a thin but coherent tactical overlay prototype.

The implementation broadly aligns with the project intent in several important ways:

- renderer uses a preload API rather than direct Node access
- passive telemetry and active Threat Intel are separated enough to prevent the earlier cross-contamination failure mode
- zKill is used as a discovery source for killmail refs
- ESI expanded killmails are used for scoped Threat Intel summaries
- network activity is centralized through main-process clients
- cache, in-flight request coalescing, manual scan cooldown, and a network kill switch exist
- the HUD is compact and low-density

The implementation does not yet fully match the deeper architecture described in the concept docs.

The largest gaps are:

- Combat Witness is currently a simple recent combat feed, not a full rolling witness pipeline
- Threat Intel summaries do not expose enough evidence/sample/cap language
- UI wording still overclaims in places, especially `Primary Hostile Corp`
- renderer still owns some tactical presentation state that should remain explicitly presentation-only
- backend IPC commands are direct feature handlers rather than a formal service contract
- no grouped verification script or current-state documentation existed before this audit

This is a rushed but salvageable foundation. The next work should be rigging and boundary hardening, not broad feature expansion.

## Current Implemented Architecture

Runtime shape:

```txt
Electron main
-> settings / services / clients / log watcher
-> IPC router
-> preload bridge
-> renderer HUD
```

Important files:

- `src/main/main.js`
- `src/main/ipcRouter.js`
- `src/main/intelService.js`
- `src/main/esi.js`
- `src/main/zkill.js`
- `src/main/logWatcher.js`
- `src/main/networkGate.js`
- `src/preload/preload.js`
- `src/renderer/renderer.js`
- `src/renderer/index.html`

The current renderer is a simple DOM-driven HUD, not a React app.

## Current Data Sources

### Local EVE Gamelogs

Owned by:

- `src/main/logWatcher.js`

Current behavior:

- watches the configured gamelog folder with `chokidar`
- seeds offsets for existing `.txt` files
- tails changed `.txt` files
- parses jump/location lines
- parses a small set of incoming combat damage patterns
- sends location and combat events to renderer through IPC

Alignment:

- mostly aligns with the observer-layer concept
- avoids direct renderer log parsing
- avoids full replay scanning for existing files by seeding offsets

Gaps:

- newly added files may read the last 8192 bytes on initial add, which is useful but should be documented as tail seeding rather than pure append-only observation
- combat parser is very narrow
- no normalized combat event schema is enforced yet
- no backend rolling witness cache exists

### Local Static Metadata

Owned by:

- `assets/systems.json`
- `src/main/systemCatalog.js`

Current behavior:

- local system name -> system ID lookup
- local system ID -> name lookup
- local system lookup is used before ESI for system resolution

Alignment:

- good match for local-first metadata doctrine
- specifically protects against the `Jita` ambiguity case

Gaps:

- no local ship/type metadata yet
- no local group/category metadata yet
- Threat Intel still renders victim ships as `Type <id>`

### ESI

Owned by:

- `src/main/esi.js`

Current behavior:

- central ESI client
- clear User-Agent from settings
- conditional cache for `system_kills` and `system_jumps`
- immutable cache for killmail expansion
- read-through cache for universe ID/name endpoints
- in-flight request coalescing
- retry/backoff for ESI retry statuses
- network kill switch integration

Alignment:

- strong fit with respectful API use
- strong fit with cache-aware behavior
- live calls are not made from renderer

Gaps:

- default network state is enabled; there is a kill switch, but not an explicit "live API gate" confirmation model
- no visible preflight estimate before a scan
- cache is in-memory only

### zKill

Owned by:

- `src/main/zkill.js`

Current behavior:

- central zKill client
- short TTL cache
- in-flight request coalescing
- network kill switch integration
- recent kills fetched by modifier, ID, and `pastSeconds`

Alignment:

- zKill is only used to discover refs that are then expanded through ESI

Gaps:

- client returns the full zKill response to `IntelService`; downstream currently uses only `killmail_id` and hash for expansion, but this boundary should be hardened
- non-array zKill responses are not explicitly guarded before `.slice()`
- no explicit zKill ref object/schema exists

## Current Pipelines

### Passive Telemetry

Current flow:

```txt
gamelog jump line
-> main log watcher
-> LOCATION_UPDATE to renderer
-> delayed passive system stats scan
-> ESI system_kills/system_jumps
-> SYSTEM_STATS_UPDATE + PASSIVE_UPDATE
-> renderer Passive Telemetry panel
```

Strengths:

- passive system stats use `intel.systemStatsByName`, not full active Threat Intel scan
- passive updates do not emit `ACTIVE_UPDATE`
- renderer verification explicitly checks passive updates do not mutate active threat state
- generation counters and cooldown suppress stale/rapid passive scans

Risks:

- passive telemetry still relies on `IntelService` for stats; this is not wrong, but the service boundary should remain clear so passive never drifts into active scan behavior

### Active Threat Intel

Current flow:

```txt
renderer scan form
-> preload `eveOverlay.intel.scan`
-> IPC ACTIVE_SCAN_REQUEST
-> manual cooldown / in-flight coalescing / abort stale scan
-> IntelService.resolveEntity
-> zKill recentKills
-> ESI killmail expansion for first 8 refs
-> local aggregation
-> ACTIVE_UPDATE
-> renderer Threat Intel view model
```

Strengths:

- local system resolution happens before ESI fallback
- type hint is supported: auto, system, character, corporation, alliance
- scans are coalesced and previous active scan is aborted
- manual cooldown exists
- zKill refs are expanded through ESI before tactical aggregation

Risks:

- no user-visible cap or sample statement; the code expands first 8 refs silently
- `activity.killCount` uses zKill discovered count, while recent activity only reflects expanded killmails
- UI can make the sample look more complete than it is
- labels such as `Primary Hostile Corp` imply disposition that the system has not proven
- Auto resolution still prefers characters/corps/alliances over systems after ESI fallback; local systems are safe, but unknown or missing local systems could resolve surprisingly

### Combat Witness

Current flow:

```txt
gamelog combat line
-> log watcher regex parse
-> COMBAT_UPDATE
-> renderer recent combat list
```

Strengths:

- combat observations are not persisted
- renderer keeps only a small visible list
- duplicate suppression exists for recent identical lines

Gaps:

- no backend rolling witness cache
- no normalized event shape beyond `attacker`, `damage`, `type`, `rawLine`, `observedAt`
- no snapshot metrics such as DPS/HPS/pressure gauge
- no event-stream identity beyond duplicate suppression
- no EWAR witness
- no topology witness
- no stale/expired visual language beyond keeping six list items

This is the largest difference between concept and implementation.

## Current State Ownership

### Main Process Owns

- settings load/save
- ESI and zKill clients
- network gate
- local system catalog
- log watching/parsing
- passive scan scheduling
- active scan orchestration
- diagnostics emission

### Renderer Owns

- display state for passive telemetry
- display state for active Threat Intel
- display state for recent combat events
- settings drawer state
- network diagnostics drawer state
- DOM rendering and collapse/expand state

This is mostly acceptable for a prototype if renderer state remains presentation-only.

Boundary concern:

- renderer `activeThreatState` and `combatState` should be documented as display state, not tactical authority
- future computed telemetry should move to backend snapshot services before the renderer grows more complex

## Current IPC Model

Current IPC is channel-based:

- `settings:get`
- `settings:save`
- `settings:select-log-folder`
- `intel:active-scan-request`
- `network:get-status`
- `network:set-enabled`
- window controls
- event channels for logs, location, combat, passive/active/network/diagnostics updates

Strengths:

- renderer uses preload bridge
- context isolation is enabled
- Node integration is disabled

Gaps:

- no formal service registry or command taxonomy
- limited payload validation
- settings save accepts raw user input
- no task/progress model
- no action classification such as local-only, live-network, telemetry, or destructive

## Current UI Model

The HUD currently includes:

- titlebar
- scan controls
- network status strip and diagnostics drawer
- Passive Telemetry panel
- collapsible Threat Intel panel
- collapsible Combat Feed panel
- settings drawer

Alignment:

- compact, readable, low density
- no heavy historical UI
- no excessive nested investigative panels

Risks:

- some language overclaims certainty or disposition
- evidence/sample language is missing
- combat feed is more of a raw recent list than a witness model

## Verification

Existing scripts:

- `verify:entity`
- `verify:network`
- `verify:rendering`
- `verify:network-rendering`
- `verify:passive-isolation`
- `verify:compact-hud`

All were run during this audit and passed.

Current coverage is useful, especially around:

- entity resolution
- passive/active isolation
- cache/kill-switch behavior
- compact HUD behavior
- renderer view model wording shape

Missing coverage:

- no grouped `verify:all`
- no log watcher fixture tests
- no Combat Witness rolling-window tests
- no IPC payload validation tests
- no static check that renderer never imports main modules or calls fetch
- no scan sample/cap/reporting contract tests

## Alignment Assessment

### Strong Alignment

- AURA-7 is still tactical, not persistent
- passive telemetry and Threat Intel are separated
- renderer does not directly parse logs or call APIs
- zKill -> ESI expansion pipeline exists for Threat Intel
- local system resolution exists
- network behavior is centralized, cached, and observable

### Partial Alignment

- Combat Witness exists only as a basic feed
- UI is compact but not yet fully uncertainty-aware
- Threat Intel is evidence-backed but does not show evidence basis clearly
- IPC boundary exists but is not a formal service contract

### Main Drift Risks

- UI copy could imply certainty beyond observation
- Threat Intel could appear complete despite capped expansion
- renderer state could become tactical authority as features grow
- Combat Witness may accrete ad hoc renderer logic without a backend event/cache model
- passive scan and active scan share `IntelService`, so guardrails must stay tested

## Recommended Next Steps

1. Create a grouped verification script such as `verify:all`.
2. Add a UI language pass for Threat Intel and Combat Witness labels.
3. Add scan evidence/sample metadata to active scan results and display.
4. Define a formal backend snapshot/service boundary before expanding renderer complexity.
5. Build the first backend Combat Witness rolling cache and fixture tests.
6. Add static boundary checks for renderer/preload/main separation.
7. Only then add richer presentation modes or advanced combat widgets.

