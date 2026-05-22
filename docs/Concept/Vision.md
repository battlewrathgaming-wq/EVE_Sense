# AURA-7 — General Design Scope & Development Framing

## Project Identity

AURA-7 is a real-time tactical telemetry overlay for EVE Online built as an Electron application.

It is designed as:
- a lightweight operational awareness system
- a transient tactical observer
- a low-cognitive-load combat telemetry HUD

It is **not** intended to become:
- a broad intelligence platform
- a historical analytics engine
- a fleet command suite
- a persistent telemetry warehouse

Persistent intelligence and long-term evidence storage belong to the companion platform:
AURA Atlas.

---

# Core Product Philosophy

## Primary Objective

AURA-7 exists to answer two questions:

> “What is happening around me right now?”

and

> “What must I do?”

The system prioritizes:
- tactical clarity
- operational relevance
- glanceability
- low latency
- bounded complexity

The system intentionally deprioritizes:
- exhaustive historical analysis
- deep enrichment
- investigative tooling
- persistent combat intelligence
- high-information-density interfaces

---

# Architectural Philosophy

## Observational Truth

AURA-7 is an observational system.

It reports:
- observed events
- witnessed telemetry
- derived tactical summaries

It does **not** claim:
- authoritative combat state
- exact survivability
- persistent EWAR certainty
- perfect pilot attribution
- omniscient battlefield knowledge

The system must remain:
- uncertainty-aware
- conservative
- evidence-scoped

The HUD should communicate:
- tactical pressure
- recent observations
- probable operational realities

without overstating certainty.

---

# Product Boundary

## AURA-7 Responsibilities

AURA-7 handles:
- passive telemetry
- tactical overlays
- rolling combat telemetry
- scoped threat inspection
- operational summaries
- immediate combat awareness

AURA-7 focuses on:
- now
- current pressure
- recent events
- local tactical decisions

---

## AURA Atlas Responsibilities

AURA Atlas handles:
- persistent intelligence
- historical analysis
- long-range pattern tracking
- relationship mapping
- watchlists
- operational memory
- evidence aggregation

AURA Atlas focuses on:
- trends
- history
- intelligence persistence
- pattern emergence

This separation is mandatory.

AURA-7 must not slowly evolve into Atlas.

---

# High-Level System Architecture

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

Core architectural principles:
- ingestion is isolated from rendering
- normalization is centralized
- computation is renderer-independent
- presentation consumes snapshots/events only

The renderer must never directly parse logs.

---

# Core Technical Principles

## 1. Event-Driven Architecture

AURA-7 is fundamentally:
- append-only
- event-driven
- rolling-window based

The system prefers:
- transient streams
- lightweight snapshots
- rolling aggregation

over:
- persistent mutable state
- historical replay scans
- deep object ownership

---

## 2. Rolling Telemetry Windows

Combat telemetry operates on bounded rolling windows.

Typical windows:
- 5s
- 15s
- 30s
- 60s retention cache

Hooks scan recent events only.

Hooks do not own persistent state.

This keeps:
- CPU predictable
- memory bounded
- UI responsive
- telemetry transient

---

## 3. Snapshot Metrics vs Event Streams

The system separates:

### Snapshot Metrics
Continuously recomputed:
- DPS
- HPS
- combat pressure
- topology summaries

### Event Streams
Triggered once from newly observed events:
- alpha spikes
- EWAR observations
- combat edge creation

Event streams must:
- use stable identities
- avoid duplicate re-alerting
- naturally expire
- never repeatedly trigger from cache rereads

---

# Combat Witness Philosophy

Combat Witness is:
- transient
- observational
- tactical

It is not:
- authoritative
- persistent intelligence
- evidence-grade telemetry

Combat Witness answers:

> “What is happening to me right now?”

not:

> “What historically occurred?”

Key rules:
- only newly appended logs are processed
- no replay parsing
- no full-log rescanning
- no inferred unseen state

---

# Cache Philosophy

Caching is a first-class architectural concern.

## Conditional Cache
Used for:
- frequently refreshed ESI endpoints

Features:
- ETags
- If-None-Match
- Last-Modified reuse
- stale-safe reuse

---

## Immutable Cache
Used for:
- expanded killmails
- immutable tactical evidence

Behavior:
- fetch once
- reuse permanently

---

## Read-Through Cache
Used for:
- entity resolution
- names
- IDs
- universe metadata

---

## Local Metadata Preference

Static metadata should come from local datasets whenever possible.

Avoid repeated ESI lookups for:
- ship names
- system names
- category/group metadata
- static topology data

Remote APIs should primarily provide:
- live activity
- discovery
- dynamic evidence

---

# UI & Presentation Philosophy

## Low Cognitive Load

The HUD is designed for:
- combat situations
- rapid glanceability
- operational clarity
- stress environments

Avoid:
- clutter
- excessive motion
- noisy animation
- deep nested panels
- excessive enrichment
- historical overload

The UI should feel:
- calm
- restrained
- tactical
- readable under pressure

---

## Shared HUD Shell

AURA-7 uses one shared HUD shell with presentation modes.

Modes:
- Intel Mode
- Combat Mode

Modes affect:
- rendering
- update cadence
- displayed telemetry

Modes do not affect:
- event collection
- cache population
- telemetry observation

---

# Performance Philosophy

The project prioritizes:
- responsiveness
- bounded rendering cost
- lightweight operation

Primary performance risks:
- DOM churn
- renderer thrashing
- animation spam
- IPC flooding
- unnecessary rerenders

Primary optimization strategies:
- aggregate before rendering
- batch UI updates
- compact IPC payloads
- rolling caches
- bounded retention
- append-only event flow

The system intentionally accepts:
- lightweight rolling computations

because they are cheaper than:
- renderer instability
- UI overdraw
- excessive animation

---

# Network Philosophy

AURA-7 is intentionally conservative.

Goals:
- respectful API usage
- sustainable polling
- bounded concurrency
- cache-heavy operation
- scoped discovery

The system should avoid:
- broad scraping
- high-frequency crawling
- unnecessary enrichment
- uncontrolled concurrency

zKillboard is discovery-only.

Expanded ESI killmails are treated as tactical evidence.

---

# Development Constraints for Codex

## Codex Should Preserve

Codex development should preserve:
- architectural separation
- bounded telemetry windows
- append-only event flow
- renderer isolation
- transient telemetry philosophy
- low cognitive load presentation
- uncertainty-aware messaging

---

## Codex Should Avoid

Codex should avoid introducing:
- renderer-owned telemetry logic
- persistent combat history in AURA-7
- uncontrolled state growth
- repeated replay parsing
- excessive animations
- deep dependency chains
- UI over-enrichment
- aggressive polling behavior
- duplicated event processing

---

# Electron Application Constraints

Electron is used as:
- a desktop shell
- a renderer host
- a presentation layer

Electron should not become:
- the telemetry engine
- the cache authority
- the primary compute owner

Heavy logic should remain:
- centralized
- deterministic
- renderer-independent

---

# Long-Term Vision

AURA-7 should evolve toward:
- stable tactical responsiveness
- operational reliability
- restrained visual design
- trustworthy telemetry
- scalable event normalization

The project should continue emphasizing:
- tactical usefulness over feature count
- clarity over density
- observational truth over false certainty
- bounded systems over uncontrolled expansion

---

# Core Design Mantra

```text
Observe conservatively.
Cache intelligently.
Present tactically.
Do not overclaim.
Keep telemetry transient.
Keep evidence rebuildable.
Prefer actionable clarity over information density.
```