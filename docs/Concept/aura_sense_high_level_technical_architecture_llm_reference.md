# AURA-Sense — High Level & Technical Architecture Reference

## Purpose

AURA-Sense is a real-time tactical overlay for EVE Online.

Its purpose is:
- immediate operational awareness
- scoped tactical intelligence
- passive telemetry
- combat witness telemetry
- low cognitive load presentation

AURA-Sense is intentionally:
- observational
- conservative
- cache-aware
- uncertainty-aware
- evidence-driven

AURA-Sense answers:

"What is happening around me right now?"
"What must I do?"

It is NOT intended to become:
- a deep historical intelligence platform
- a broad scraping platform
- a fleet command platform
- a persistent evidence warehouse

Persistent intelligence belongs to AURA Atlas.

---

# Product Separation

## AURA-Sense

Role:
- tactical viewport
- operational overlay
- transient telemetry witness

Focus:
- local awareness
- immediate combat pressure
- passive telemetry
- scoped scans
- low cognitive load
- real-time tactical decisions

Answers:
"What is happening now?"

## AURA Atlas

Role:
- persistent evidence platform
- historical intelligence system

Focus:
- watchlists
- long-range timelines
- relationship analysis
- historical aggregation
- operational memory
- pattern discovery

Answers:
"What patterns emerge over time?"

---

# Core Design Philosophy

## Observational Truth

AURA-Sense reports:
- observed events
- tactical telemetry
- scoped summaries

It does NOT pretend to know:
- full combat state
- exact survivability
- exact HP state
- persistent EWAR state
- perfect pilot attribution

The system should never overclaim certainty.

---

## Tactical Relevance Over Information Density

The HUD exists for:
- stress situations
- glanceability
- tactical awareness
- rapid decision support

Avoid:
- deep historical context
- excessive enrichment
- investigative overload
- UI clutter
- constant motion

Combat telemetry should prioritize:
"What must I do?"

not:
"What do we know historically?"

---

## Evidence Separation

Threat Intel:
- evidence-backed
- ESI-expanded
- rebuildable
- scoped

Combat Witness:
- transient
- rolling telemetry
- observational
- non-authoritative

Combat telemetry must never become evidence-grade intelligence.

---

# High-Level Architecture

```text
EVE Logs
+ ESI
+ zKill Discovery
        ↓
Observer Layer
        ↓
Normalized Event Cache
        ↓
Compute Hooks
        ↓
HUD Presentation Modes
```

The architecture separates:
- collection
- normalization
- computation
- presentation

No renderer should directly parse logs.

---

# Major Systems

## 1. Passive Telemetry

Purpose:
- current system awareness
- passive navigation telemetry

Sources:
- EVE gamelog jump events
- ESI system statistics

Provides:
- ship kills
- jumps
- pods
- current system
- ESI timestamp

Characteristics:
- low-frequency
- cache-backed
- background-updated

Important:
Passive telemetry must never overwrite Threat Intel state.

---

## 2. Threat Intel

Purpose:
- scoped tactical inspection

Supported scans:
- systems
- pilots
- corporations
- alliances

Pipeline:

```text
query
→ local system resolution
→ ESI entity resolution
→ zKill discovery
→ ESI killmail expansion
→ local aggregation
→ scoped tactical summary
```

Key Rule:

```text
zKill is discovery only.
Expanded ESI killmails are the tactical source of truth.
```

Threat Intel derives:
- recent activity
- active pilots
- aggressing corporations
- footprints
- recent activity timelines
- scoped summaries

---

# ESI / zKill Pipeline

## Entity Resolution

Uses:

```http
POST /latest/universe/ids/
```

Important behavior:
- local systems.json checked first
- systems preferred before generic ESI ambiguity resolution
- avoids "Jita" corporation ambiguity

Entity categories:
- character
- corporation
- alliance
- system

---

## zKill Usage

zKillboard is used ONLY for:

```text
killmail_id
zkb.hash
```

NOT for tactical truth.

Example:

```http
GET /api/systemID/30000142/pastSeconds/3600/
```

---

## ESI Killmail Expansion

Expanded killmails are authoritative tactical evidence.

Uses:

```http
GET /latest/killmails/{killmail_id}/{hash}/
```

Used fields:
- attackers
- victim
- solar_system_id
- killmail_time
- corp IDs
- alliance IDs
- ship_type_id

Derived locally:
- top aggressor
- aggressing corporation
- footprints
- timelines
- recent activity

---

# Cache Philosophy

## ESI Cache

Shared cache:

```text
esiCache
```

Modes:

### Conditional Cache

Used for:
- system kills
- jumps
- pods

Behavior:
- If-None-Match
- ETag revalidation
- Last-Modified preservation
- stale reuse on 304

### Immutable Cache

Used for:
- expanded killmails

Behavior:
- fetch once
- reuse permanently
- keyed by request URL/body

### Read-Through Cache

Used for:
- universe/ids
- universe/names

Behavior:
- cached lookup reuse
- normalized entity cache

---

# Local Metadata Philosophy

Prefer local static metadata whenever possible.

Examples:
- systems.json
- SDE ship metadata
- groups/categories
- ship type lookups

Do NOT repeatedly call ESI for:
- ship names
- system names
- category/group classification
- topology metadata

Live APIs should primarily provide:
- dynamic activity evidence
- entity discovery
- killmail expansion

---

# Combat Witness

Combat Witness is a transient tactical telemetry system.

It is NOT:
- evidence persistence
- pilot intelligence
- historical analytics

It IS:
- live operational awareness
- rolling combat telemetry
- tactical pressure witness

Combat Witness answers:
"What is happening to me right now?"

---

# Combat Witness Architecture

## Observer Layer

Reads:
- newly appended combat log data only

Uses:
- file offsets
- incremental tail reads
- no replay scanning

The log reader:
- never reparses old data
- only processes appended content

---

## Parser Layer

Normalizes combat lines into structured events.

Example:

```js
{
  id,
  observedAt,
  kind,
  direction,
  sourceLabel,
  targetLabel,
  amount,
  damageType,
  effectType
}
```

Important:
- preserve overview/color metadata where possible
- treat combat logs as observational telemetry
- do not infer unseen state

---

## Rolling Witness Cache

Purpose:
- shared transient combat event stream

Typical retention:
- 60 seconds

Window consumers:
- 5s
- 15s
- 30s

The cache is:
- append-only
- rolling
- transient
- lightweight

---

## Compute Hooks

Hooks read from the rolling cache.

Hooks do NOT own state.

Examples:
- Applied DPS 5s
- Received DPS 15s
- Received HPS 15s
- EWAR witness
- combat topology
- alpha spike witness

Hooks scan backward until events become stale.

Example:

```js
getEventsSince(windowMs)
```

---

# Event Streams vs Snapshot Metrics

AURA-Sense separates:

## Snapshot Metrics

Continuously recomputed:
- DPS
- HPS
- topology summaries
- pressure gauge

These repeatedly read rolling windows.

---

## Event Streams

Triggered once from newly observed events:
- alpha spikes
- EWAR observations
- new combat edges

These should:
- enter display once
- age visually
- expire naturally
- never re-alert from rolling cache rereads

Event identity should use stable IDs.

---

# Combat Pressure Gauge

The Combat Pressure Gauge is NOT:
- health state
- survivability prediction
- tank simulation

It represents:

```text
observed combat pressure
```

Derived from:
- incoming applied pressure
- observed repair/sustain pressure

Windows:
- typically 15s rolling

Visual Model:

Red:
- incoming pressure

Green:
- sustain/repair pressure

The display communicates:
- stabilization
- collapse pressure
- combat momentum
- pressure trend

NOT exact HP truth.

---

# EWAR Philosophy

EWAR is treated as:

```text
observed recent events
```

NOT:
- confirmed active state
- guaranteed persistence

Example:

```text
SCRAM observed — Stiletto — 2s ago
```

NOT:

```text
SCRAMMED
```

unless logs explicitly confirm persistence/end-state.

EWAR observations:
- decay naturally
- fade visually
- expire if not refreshed

This prevents stale misleading state.

---

# Combat Topology

Combat topology derives:

```text
[Ship] attacked [Ship]
```

relationships from observed combat lines.

Purpose:
- focus-fire awareness
- cohesion observation
- split-pressure observation
- escalation awareness

This is:
- observational topology
- not authoritative fleet intelligence

The system intentionally tolerates:
- duplicate ship names
- incomplete attribution
- observational ambiguity

---

# Alpha Spike Witness

Alpha spikes are:
- per-line observations
- not grouped source totals

Important:
Do NOT aggregate by ship label.

Reason:
Multiple ships may share identical names.

Correct model:

```text
Observed spike event
```

NOT:

```text
This ship did all this damage
```

Spikes:
- enter once
- remain visible briefly
- expire naturally
- never re-alert from cache rereads

---

# Mode Architecture

AURA-Sense uses one shared HUD shell.

Modes:
- Intel Mode
- Combat Mode

Modes affect:
- rendering
- update cadence
- presentation focus

Modes do NOT affect:
- observation
- cache population
- event collection

---

## Intel Mode

Displays:
- passive telemetry
- system state
- Threat Intel
- scans
- network diagnostics

---

## Combat Mode

Displays:
- Combat Pressure
- Applied DPS
- Received DPS
- Received HPS
- EWAR witness
- topology
- spike witness

---

## Auto-Swap Behavior

Optional setting:

```text
autoSwapOnCombat
```

Rules:
- only valid combat events trigger swap
- non-combat logs must not trigger swap
- user manual mode choice must be respected
- repeated combat lines must not repeatedly override mode

Inactive modes:
- reduce rendering work
- stop unnecessary animations
- keep caches warm
- continue background updates

---

# Performance Philosophy

The system is designed to remain lightweight.

Most expensive systems are:
- Electron rendering
- DOM churn
- animation spam
- IPC flooding

NOT:
- rolling computations
- DPS calculations
- cache scans

Optimization rules:
- aggregate before renderer
- send compact snapshots
- batch UI updates
- keep windows short
- use rolling caches
- avoid reparsing

---

# Network Philosophy

AURA-Sense is intentionally conservative.

Goals:
- sustainable polling
- respectful API behavior
- scoped discovery
- low operational footprint

NOT:
- broad scraping
- universe-wide crawling
- high-speed ingestion

Rules:
- cache aggressively
- use ETags
- dedupe requests
- immutable killmail reuse
- bounded concurrency
- manual scan cooldowns
- observable network pulse

---

# Core Principles

```text
Observe conservatively.
Cache intelligently.
Present tactically.
Do not overclaim.
Keep telemetry transient.
Keep evidence rebuildable.
Prefer actionable clarity over information density.
```

