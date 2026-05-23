# Operational Budget

Status: Active reference
Updated: 2026-05-23

This document defines practical resource expectations. These are warning thresholds, not hard limits.

## Principle

```text
Bounded behavior matters more than feature count.
```

AURA-Sense should remain usable during long sessions without uncontrolled memory, CPU, network, cache, or renderer growth.

## AURA-Sense Targets

### Memory

Idle target:

```text
under 300 MB preferred
```

Active target:

```text
under 600 MB preferred
```

Temporary spikes are less important than continuous growth.

### CPU

Idle target:

```text
0-5% preferred
```

Sustained idle CPU above 10% needs investigation.

### Storage

AURA-Sense should store:

- settings
- capped diagnostics
- fixture data
- local metadata artifacts
- smoke/test artifacts under `.tmp`

It should not store permanent combat history or Atlas-style evidence.

### Network

Network behavior should be:

- explicit
- scoped
- cache-aware
- low-frequency
- user or event driven

Avoid:

- renderer-triggered provider calls
- broad polling
- uncontrolled retries
- repeated enrichment of known static labels

### Renderer

Renderer payloads should be compact snapshots and bounded event streams.

Avoid:

- unbounded DOM growth
- per-line IPC spam
- renderer-owned telemetry history
- continuous decorative animation

## Atlas Difference

AURA Atlas may intentionally use SQLite persistence, larger storage, and historical evidence indexing.

AURA-Sense should not.

## Red Flags

- memory rises continuously
- idle CPU remains high
- cache folders grow without cap
- diagnostics grow without limit
- provider calls occur during inactivity
- renderer stores large event history
- live scans occur without visible user action

## Guidance

If a feature needs broad retention, heavy indexing, or long-term evidence, it probably belongs in Atlas or behind a future handoff ADR.
