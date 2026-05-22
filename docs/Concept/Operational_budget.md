# AURA Projects — Technical Budget & Resource Philosophy

# Purpose

This document defines practical operational budgets for:
- memory usage
- CPU usage
- network behavior
- file growth
- cache growth
- renderer activity

These budgets are intended to:
- guide implementation decisions
- constrain architectural drift
- preserve responsiveness
- maintain low operational overhead
- provide Codex with engineering boundaries

These are not hard technical limits.

They are operational targets and warning thresholds.

---

# Core Philosophy

```text
Lightweight behavior matters more than small install size.
```

The system should:
- remain responsive
- remain bounded
- avoid uncontrolled growth
- minimize idle activity
- avoid unnecessary work

The project should prioritize:
- operational efficiency
- predictable resource usage
- graceful degradation
- bounded systems

---

# Project Separation

## AURA-7

AURA-7 is:
- transient
- tactical
- event-driven
- low-retention

AURA-7 should prioritize:
- responsiveness
- low idle cost
- bounded memory
- transient telemetry
- lightweight runtime behavior

---

## AURA Atlas

AURA Atlas is:
- persistent
- historical
- analytical
- database-driven

Atlas may intentionally use:
- larger storage
- persistent indexing
- SQLite persistence
- historical aggregation

However:
growth must remain intentional, indexed, and bounded.

---

# Install Size Budgets

Electron applications include Chromium and Node runtimes.

Small executable size is not the primary optimization target.

Operational behavior is more important than package size.

---

## Electron Package Targets

### Excellent
```text
100–250 MB
```

### Acceptable
```text
250–500 MB
```

### Heavy
```text
500 MB–1 GB
```

### Concerning
```text
1 GB+
```

Large install size alone is not considered a failure condition.

---

# Memory Budgets

# AURA-7 Runtime Memory

## Idle Target

### Excellent
```text
100–250 MB
```

### Acceptable
```text
250–500 MB
```

### Heavy
```text
500 MB–1 GB
```

### Concerning
```text
1 GB+
```

Operational target:

```text
Idle target: under 300 MB
```

---

## Active Usage Target

Combat, scans, and telemetry processing may temporarily increase memory usage.

### Good
```text
under 500 MB
```

### Acceptable
```text
500–800 MB
```

### Concerning
```text
1 GB+
```

Operational target:

```text
Active target: under 600 MB
```

---

# Memory Philosophy

The system should prefer:
- rolling windows
- transient event streams
- bounded caches
- append-only short-term telemetry
- cache expiry policies

The system should avoid:
- permanent combat event retention
- unbounded arrays
- duplicated state ownership
- renderer-owned telemetry history
- large persistent in-memory datasets

---

# Memory Warning Signs

The following behaviors indicate architectural risk:

- memory usage continually rising
- memory never stabilizing
- repeated event duplication
- retained stale telemetry
- oversized renderer state
- unbounded cache retention
- excessive IPC payload retention

The most important signal is:
- persistent memory growth over time

not:
- temporary operational spikes

---

# CPU Budgets

# Idle CPU Usage

## Excellent
```text
0–2%
```

## Acceptable
```text
2–5%
```

## Heavy
```text
5–10%
```

## Problematic
```text
10%+ idle
```

AURA-7 should feel:
- mostly dormant
- event-driven
- low activity while idle

---

# Active CPU Usage

Combat processing and scans may briefly increase CPU usage.

Short operational spikes are acceptable.

Constant elevated CPU usage is not.

The application should avoid:
- continuous polling loops
- renderer thrashing
- unnecessary recomputation
- animation-driven rerenders

---

# Network Budgets

# Core Philosophy

Network behavior should be:
- burst-driven
- event-driven
- player-driven
- cache-aware

The application should avoid:
- constant background scraping
- high-frequency polling
- renderer-triggered requests
- repeated enrichment of known entities

---

# Good Network Pattern

```text
User action
    ↓
Scoped API calls
    ↓
Cache locally
    ↓
Reuse aggressively
```

Idle state should produce:
- minimal network activity

---

# Bad Network Pattern

The following patterns are discouraged:

- API calls on every render
- repeated entity enrichment
- broad polling loops
- duplicate requests
- UI-driven request spam
- uncontrolled concurrency

---

# Network Philosophy

The system should:
- use ETags where possible
- cache aggressively
- reuse immutable data
- prefer local metadata
- minimize repeated enrichment
- treat external APIs respectfully

---

# Storage Budgets

# AURA-7 Storage

AURA-7 should remain lightweight and transient.

---

## Expected Storage Sizes

### Config / Settings
```text
KB–few MB
```

### Runtime Cache
```text
few MB–100 MB
```

### Debug Logs
```text
rotated and capped
```

### Combat Telemetry
```text
transient
non-permanent
```

AURA-7 should not become:
- a telemetry archive
- a historical warehouse
- a persistent evidence system

---

# AURA Atlas Storage

Atlas intentionally supports persistence.

---

## SQLite Guidance

### Small
```text
under 100 MB
```

### Healthy
```text
100 MB–1 GB
```

### Large But Acceptable
```text
1–5 GB
```

### Requires Review
```text
5 GB+
```

Large databases are acceptable if:
- indexed correctly
- bounded by retention policy
- intentionally designed

---

# Cache Philosophy

All caches should be:
- bounded
- expirable
- replaceable
- observable

The system should avoid:
- immortal caches
- duplicated cache layers
- uncontrolled growth
- hidden persistence

Examples:
- TTL expiration
- size caps
- rolling retention windows
- immutable object reuse

---

# Renderer Budgets

The renderer should remain:
- lightweight
- responsive
- bounded

The renderer should avoid:
- owning telemetry authority
- retaining large event history
- animation-heavy loops
- oversized reactive state

---

# Preferred Rendering Patterns

Prefer:
- CSS transitions
- opacity transforms
- SVG overlays
- batched updates
- compact snapshots

Avoid:
- layout-heavy animation
- continuous rerender loops
- animation-driven React state
- excessive blur/shadow stacking
- unbounded DOM growth

---

# IPC Philosophy

IPC traffic should remain:
- compact
- aggregated
- batched
- snapshot-oriented

Avoid:
- per-event renderer spam
- oversized payloads
- repeated full-state transfers

---

# Lightweight System Principles

A lightweight system is defined by:

```text
Bounded behavior.
Predictable growth.
Low idle cost.
Minimal unnecessary work.
```

Not:
- minimal file count
- tiny executable size
- absence of features

---

# Red Flag Checklist

The system may be drifting into unhealthy territory if:

- memory rises continuously
- idle CPU remains elevated
- network calls occur during inactivity
- renderer FPS drops while idle
- cache folders grow indefinitely
- debug logs become massive
- SQLite growth is uncontrolled
- animations continue during performance pressure
- telemetry is duplicated across layers

---

# Codex Guidance

Codex should preserve:
- bounded systems
- transient telemetry
- cache expiry
- rolling windows
- compact IPC
- low idle activity
- event-driven behavior

Codex should avoid:
- uncontrolled retention
- duplicate ownership
- broad polling loops
- renderer-heavy state
- permanent combat history in AURA-7
- unnecessary enrichment
- unbounded arrays or caches

---

# Final Principle

```text
The system should remain operationally lightweight,
even if the project itself becomes architecturally sophisticated.
```