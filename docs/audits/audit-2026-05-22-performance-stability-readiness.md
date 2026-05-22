# Audit: Performance And Stability Readiness

Date: 2026-05-22
Scope: AURA-Sense current codebase reviewed for performance, stability, structural boundaries, and missing compute primitives.

## Summary

AURA-Sense is structurally small and mostly aligned with the tactical-overlay intent, but it is not yet ready for heavier Combat Witness or richer HUD work.

The current app is stable enough as a thin prototype because it has:

- main-process API clients
- preload isolation
- bounded visible combat feed
- TTL caches
- in-flight request coalescing
- manual scan cooldowns
- passive/active isolation checks
- network kill switch

The next heavy-lifting work needs rigging first:

- backend Combat Witness compute layer
- renderer update batching
- diagnostics throttling
- IPC payload validation
- scan evidence/sample metadata
- stronger parser fixtures
- grouped verification
- explicit runtime safety checks

The main theme:

```txt
The app currently presents events.
It does not yet own a robust tactical compute model.
```

## Review Basis

Reviewed implementation:

- `src/main/main.js`
- `src/main/ipcRouter.js`
- `src/main/logWatcher.js`
- `src/main/intelService.js`
- `src/main/esi.js`
- `src/main/zkill.js`
- `src/main/networkGate.js`
- `src/main/cacheService.js`
- `src/main/settings.js`
- `src/preload/preload.js`
- `src/renderer/renderer.js`
- `src/shared/constants.js`
- verification scripts in `scripts/`

Reviewed doctrine:

- `Docs/tenets/tenets.md`
- `Docs/contracts/*.md`
- `Docs/audits/audit-2026-05-22-current-state-alignment.md`
- `Docs/gap/to-do/implementation-alignment-gap-analysis.md`

## Current Strengths

### Main-Process Ownership Exists

Network calls, log watching, settings, and scan orchestration currently live in the main process.

This aligns with:

- renderer is presentation, not authority
- APIs should not be called from render cycles
- log parsing should not happen in renderer

### Network Behavior Is Better Than Prototype Average

`EsiClient`, `ZKillClient`, `NetworkGate`, `TTLCache`, and `InFlightRegistry` already provide:

- request coalescing
- bounded cache maps
- retry/backoff for ESI retry statuses
- visible network status
- network kill switch
- conditional cache support for ESI system stats
- immutable-style cache path for expanded killmails

This is a good foundation.

### Passive / Active Isolation Has Verification

Existing tests check that passive telemetry does not update active Threat Intel. This directly protects one of the project’s known drift risks.

### Renderer Is Compact

The renderer is DOM-driven, small, and low-density. It is not currently doing expensive rendering work.

The risk is future growth, not current DOM size.

## Performance Risks

### 1. Diagnostics Are Too Chatty For Heavy Use

`Diagnostics.trace()` logs every trace to `console.log` and emits every diagnostic to the renderer sink.

Cache hit/miss tracing is enabled in `TTLCache`, and request/in-flight tracing is also active.

Risk:

- console spam during active telemetry
- renderer diagnostics channel spam
- unnecessary IPC traffic
- reduced performance during combat or high log activity

Needed:

- debug/verbose toggle
- category-level filtering
- rate limiting or sampling for cache hit/miss traces
- production default that does not emit every low-value trace

### 2. Combat Events Are Sent One-By-One To Renderer

Current flow:

```txt
logWatcher.parseLine
-> onCombat
-> COMBAT_UPDATE
-> renderer addCombatEvent
-> direct DOM prepend
```

This is fine for low volume but weak for heavy combat logs.

Risk:

- IPC per combat line
- direct DOM churn per event
- no backend batch/snapshot model
- no way to compute rolling metrics without adding renderer complexity

Needed:

- backend rolling witness cache
- batched combat update snapshots
- one-shot event stream with stable IDs
- renderer receives compact snapshots/events

### 3. Renderer Network Updates Can Be Frequent

`NetworkGate.record()` emits status after every network event. Each request produces at least pending and completion records.

This is useful for diagnostics, but heavy live scans can cause repeated renderer updates.

Needed:

- coalesce network status updates
- preserve immediate updates for blocked/degraded events
- throttle normal pending/success updates to a small interval

### 4. Immutable Cache Is Bounded In Memory

ESI killmail expansion is conceptually immutable, but `TTLCache` still has `maxEntries: 800`.

This is acceptable for AURA-Sense as a transient tactical viewport, but the documentation and naming should be honest:

```txt
immutable within bounded runtime cache
```

Risk:

- future code assumes killmail cache is durable/permanent
- evicted killmails may be refetched later

This is not an Atlas-style evidence cache, and should not become one.

### 5. Log Watcher Reads Tail On Newly Added Files

`handleFile(filePath, initial = true)` reads the last 8192 bytes for newly added files.

This can be useful for catching the current session tail, but it is not purely append-only observation.

Risk:

- old tail lines can trigger current location/combat observations
- a newly created/copied log can produce stale events

Needed:

- explicit policy for initial tail behavior
- label it as tail seeding
- perhaps disable combat parsing on initial tail unless deliberately enabled

## Stability Risks

### 1. IPC Payload Validation Is Light

Current active scan payload accepts string or object and normalizes lightly.

Settings payload is merged and saved with minimal validation.

Risk:

- oversized query strings
- blank User-Agent
- invalid log path
- unbounded future payload fields
- accidental renderer misuse as UI grows

Needed:

- small validator helpers
- max query length
- allowed type hints
- sane User-Agent fallback
- log path validation before watcher restart

### 2. zKill Response Shape Is Not Hardened

`IntelService` assumes zKill data is array-like:

```txt
(zkillData || []).slice(0, 8)
```

Risk:

- non-array response breaks scan
- malformed refs can pass to ESI expansion

Needed:

- normalize zKill response to discovery refs in `ZKillClient`
- return only `{ killmailId, hash }`
- warn on malformed/non-array responses

### 3. ESI Client Has A Legacy Auto Resolver

`IntelService.resolveEntity()` correctly handles local systems first and typed filtering.

But `EsiClient.resolveName()` still has a broad auto resolution order that can prefer character/corporation/alliance/system depending on response order.

Risk:

- future code may use `resolveName()` and reintroduce ambiguity bugs

Needed:

- deprecate or harden `resolveName()`
- prefer typed `resolveIds()` plus service-level type filtering

### 4. No Global Runtime Error Boundary

The app does not appear to register global handlers for:

- unhandled promise rejections
- uncaught exceptions
- renderer crash/gone events

Risk:

- silent failures or hard crashes during long sessions

Needed:

- process-level error logging
- BrowserWindow render-process-gone handling
- user-visible degraded state where practical

### 5. Settings Restart Watcher Immediately

Saving settings restarts the log watcher immediately.

Risk:

- bad path causes watcher to move to missing/error state
- blank or malformed User-Agent affects API requests

Needed:

- settings validation response before save
- explicit status when watcher path fails
- preserve previous good path if desired

## Missing Structural / Computing Pieces

### 1. Combat Witness Compute Core

The concept docs describe:

```txt
Observer Layer
-> Parser Layer
-> Rolling Witness Cache
-> Compute Hooks
-> HUD Snapshot
```

Current code has:

```txt
Observer/parser-lite
-> direct renderer event
```

Missing modules:

- `combatEventNormalizer`
- `combatWitnessCache`
- `combatMetrics`
- `combatEventStream`
- `combatSnapshotService`

The first useful target is not a full combat system. It is a minimal backend-owned model:

```txt
append normalized event
-> keep 60s bounded cache
-> compute 5s/15s/30s received damage
-> emit compact snapshot
```

### 2. Snapshot/Event Stream Split

The docs require separation between:

- snapshot metrics: recomputed from rolling windows
- event streams: triggered once and naturally expire

Current code only has a renderer feed.

Needed:

- stable event IDs
- once-only event emission
- snapshot computation separate from alert events

### 3. Backpressure / Batching

There is no batching layer for:

- combat events
- diagnostics
- network status updates

Needed:

- micro-batch combat events per short interval
- coalesce snapshot output
- throttle low-priority diagnostics

### 4. Explicit Freshness Model

Current panels show some timestamps, but there is no shared freshness model.

Needed:

- observedAt
- source timestamp when available
- staleAfterMs
- expiredAfterMs
- freshness label: fresh, stale, expired, unavailable

This matters for AURA-Sense because stale tactical information can be worse than no information.

### 5. Local Type Metadata

System names are local-first, but ship/type names are not.

Needed:

- compact local type lookup
- ship labels in active scan timelines
- avoid live ESI type lookups

This should stay lightweight and not turn AURA-Sense into Atlas.

### 6. Formal Service Boundary

The current IPC router is fine for a prototype, but the next stage needs a simple backend command/service layer.

Needed command areas:

- settings validation/save
- active scan
- network status/toggle
- combat snapshot subscription
- diagnostics subscription level
- readiness/status

This does not need to be as heavy as Atlas. It only needs stable shapes and validation.

## Verification Gaps

Current verification is useful but incomplete.

Add:

- `verify:all`
- log watcher fixture parsing
- combat event normalization
- rolling cache expiry
- renderer boundary static check
- IPC payload validation
- zKill response hardening
- scan evidence/sample metadata
- diagnostics throttling behavior

## Recommended Engineering Sequence

### Stage 1: Safety And Contracts

1. Add `verify:all`.
2. Add renderer boundary static verification.
3. Add IPC/settings/query validation.
4. Harden zKill response normalization.
5. Reduce diagnostics noise by default.

### Stage 2: Threat Intel Honesty

1. Add evidence/sample metadata to scan results.
2. Adjust UI wording away from certainty/hostility.
3. Show expanded/discovered counts and partial status.
4. Add local type labels for victim ship output.

### Stage 3: Combat Witness Foundation

1. Normalize combat events in backend.
2. Add bounded rolling cache.
3. Add received damage snapshot windows.
4. Emit compact combat snapshots.
5. Keep renderer presentation-only.

### Stage 4: Combat Witness Growth

After Stage 3 is stable:

- pressure gauge
- EWAR witness
- alpha spike event stream
- combat topology
- mode auto-swap

Do not build these directly in renderer.

## Readiness Verdict

AURA-Sense is currently ready for:

- small UI wording improvements
- verification grouping
- boundary hardening
- metadata lookup
- first backend Combat Witness cache

It is not yet ready for:

- complex combat pressure modeling
- EWAR state display
- topology visualization
- fleet broadcast work
- high-volume combat telemetry rendering

The project should treat the next phase as structural rigging, not feature decoration.

