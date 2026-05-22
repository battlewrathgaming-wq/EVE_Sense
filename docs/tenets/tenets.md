# AURA-Sense Tenets

Status: Active
Date: 2026-05-22

AURA-Sense is a real-time tactical overlay, not a historical intelligence platform.

It exists to present recent, scoped, operationally useful observations with low cognitive load. It must not become the place where persistent intelligence, historical memory, or authoritative facts are invented.

## 1. Tactical Viewport First

AURA-Sense answers:

```txt
What is happening around me right now?
What must I do?
```

AURA Atlas answers:

```txt
What patterns emerge over time?
```

The boundary is mandatory. AURA-Sense may inspect, summarize, and display tactical observations, but persistent historical evidence belongs to Atlas.

## 2. Transient By Default

AURA-Sense should prefer rolling windows, bounded caches, and short-lived telemetry.

Combat telemetry, pressure readings, EWAR observations, and topology hints should naturally expire unless deliberately exported or handed to another system.

## 3. Renderer Is Presentation, Not Authority

The renderer consumes snapshots and events. It must not own telemetry truth, parse logs directly, call live APIs directly, or become the source of derived tactical state.

Collection, normalization, caching, and computation belong in backend/main-process services.

## 4. Separate Telemetry Lanes

AURA-Sense has distinct lanes:

- Passive Telemetry
- Threat Intel
- Combat Witness
- Presentation Modes

These lanes may inform the same HUD, but they must not silently overwrite one another.

Passive telemetry must not contaminate scoped Threat Intel. Combat Witness must not become evidence-grade intelligence.

## 5. Observation Is Not Certainty

AURA-Sense reports what it observed.

Avoid implying:

- exact survivability
- confirmed persistent EWAR state
- perfect pilot attribution
- complete battlefield state
- historical operator patterns

Preferred language uses observed, recent, witnessed, pressure, signal, stale, and expired states.

## 6. Combat Witness Is Tactical Telemetry

Combat Witness is a rolling operational witness.

It is not a killmail database, combat archive, or historical evidence system.

It should process newly appended log lines, normalize events, compute short-window summaries, and expire stale observations.

## 7. Threat Intel Remains Evidence-Backed

Scoped Threat Intel may use zKill discovery and ESI killmail expansion.

The rule remains:

```txt
zKill discovery
-> ESI expanded killmail
-> local tactical summary
```

zKill is discovery only. Expanded ESI killmails are the source of truth for scoped Threat Intel.

## 8. Low Cognitive Load Wins

The HUD must remain readable under pressure.

Prefer:

- compact snapshots
- stable layout
- restrained motion
- short tactical labels
- clear status and uncertainty

Avoid investigative overload, dense historical context, and decorative motion that competes with telemetry.

## 9. Respectful API Use

External API behavior must remain conservative, scoped, observable, and cache-aware.

AURA-Sense should avoid broad scraping, repeated enrichment, and renderer-triggered request spam.

## 10. Local Metadata First

Static metadata should come from local/cached data where possible:

- systems
- ship/type labels
- group/category metadata
- topology/reference data

Live APIs should primarily provide dynamic activity, scoped discovery, and killmail expansion.

## 11. AI Is Commentary, Not Telemetry

AI may summarize or explain tactical state, but it must not become the source of observed telemetry or hidden transformation logic.

AI output should remain labeled as commentary or guidance.

## 12. Product Identity

```txt
AURA-Sense observes now.
AURA Atlas remembers later.
```

AURA-Sense should remain lightweight, bounded, operational, and tactical.
