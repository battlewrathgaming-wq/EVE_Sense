# AURA-7 Telemetry Findings

## Purpose

This document consolidates findings extracted from EVE Online gamelog analysis to inform parser, telemetry, and UI-agent development for AURA-7.

The purpose of AURA-7 is not to replace the EVE interface, FC judgement, or pilot instinct.

AURA-7 senses telemetry and compresses high-frequency combat and operational events into concise battlefield state.

The system is:
- observational,
- low-cognition,
- non-authoritative,
- stream-oriented,
- and combat-state driven.

---

# Core Truths

- Outside of "You" and current ship identity, AURA-7 remains agnostic to allegiance, intent, and outcome.

- Only the pilot, fleet cohesion, positioning, allied support, and hostile weakness determine survival.

- AURA-7 surfaces telemetry, not instructions.

- The system does not attempt to assess the battlefield.

- The system does not attempt to replace the EVE interface.

- Combat logs are noisy.
Combat state is not.

---

# Telemetry Filtering Principle

Displayed information should satisfy at least one of the following:

- Useful
- Actionable
- Requires pilot attention
- Simplifies or compresses noisy log data

If not:
- aggregate it,
- compress it,
- deprioritize it,
- or discard it.

The objective is low cognition and immediate readability.

---

# Architectural Findings

## Stream Processing

The gamelog system should behave as a stream processor, not a historian.

Recommended architecture:

```text
EVE Log File
    ↓
Tail Reader
    ↓
Line Parser
    ↓
Normalized Event
    ↓
Event Bus / Ring Buffer
    ↓
Consumers / Compression Layer
    ↓
Telemetry Output
```

Important:
- Read appended lines only.
- Never repeatedly rescan historical windows.
- Rolling windows should exist in memory state, not file rescans.

---

## Layer Separation

The following layers must remain distinct:

| Layer | Purpose |
|---|---|
| Raw Log | Exact untouched line |
| Parsed Event | Structured extraction |
| Derived State | Rolling combat state |
| Telemetry Output | Condensed UI information |

Do not mix raw log truth with semantic interpretation.

---

## Compression Layer

The compression layer is the product.

The parser is not the product.
The event bus is not the product.
The UI is not the product.

AURA-7 exists to transform:

```text
noise → concise operational awareness
```

---

# Major Telemetry Domains

## Application State

Repeated hit quality strongly exposes:
- transversal,
- tracking,
- falloff,
- positioning,
- defensive degradation,
- weapon application.

Observed quality ladder:

| Result | Meaning |
|---|---|
| Glances Off | Very weak application |
| Grazes | Weak application |
| Hits | Stable application |
| Penetrates | Strong application |
| Smashes | Severe application |
| Wrecks | Critical application |

Application is one of the highest-value combat telemetry primitives.

Suggested display:

Incoming:
- pale red → strong red

Outgoing:
- pale green → strong green

AURA-7 does not explain why application changed.
It surfaces that it changed.

---

## Weapon Pressure

Repeated weapon events are more valuable than singular damage events.

Aggregate by:
- weapon type,
- frequency,
- recency,
- dominant contributors.

Recommended:
- rolling 10 second window,
- top 1–2 dominant weapon groups only.

Example:

```text
Scourge Cruise Missile
Pith Massacrer [4]
```

```text
Nova Light Missile
Mercenary Crow
Mercenary Hyena
[+3]
```

Important:
- frequency matters more than singular damage,
- repeated cadence creates combat pressure,
- not all high danger is high alpha.

Do not over-report.
When all weapons are visible, no telemetry is valuable.

---

## EWAR State

EWAR is immediate-attention telemetry.

Observed categories:
- Warp scramble
- Warp disruption
- ECM / jam
- Neutralization
- Webification
- Lock interference
- Warp denial

Display:
- effect,
- hostile source where possible.

Example:

```text
SCRAMMED
Mercenary Crow
```

---

## Pressure & Equilibrium

Incoming damage, outgoing damage, and repairs should be aggregated over rolling windows.

Suggested baseline:
- 20 second rolling window.

Important:
- exact DPS is less valuable than combat stability.

Key concept:

```text
incoming pressure
vs
repair throughput
```

AURA-7 should surface changing equilibrium, not combat recommendations.

---

## Outlier Damage

Singular abnormal impacts are operationally important.

Examples:
- alpha strikes,
- wrecking hits,
- sudden application spikes,
- unexpected volley escalation.

Outliers should include:
- amount,
- source,
- optionally weapon class.

Example:

```text
OUTLIER
Mercenary Hyena
103 — Smashes
```

---

## Unique Damage Sources

Do not display total hostile count.

Instead:
- display unique active contributors,
- aggregated where necessary.

This exposes:
- pressure topology,
- dominant threats,
- escalating battlefield diversity.

---

# Combat Pressure Findings

Combat pressure is:
- temporal,
- relational,
- stateful,
- emergent.

Not event-based.

Repeated examples:

```text
5
6
11
12
```

over extended periods proved:
- cadence creates pressure,
- sustained application matters,
- suppression pressure exists independently of alpha.

Pressure types identified:

| Type | Meaning |
|---|---|
| Sustained | constant repeated application |
| Burst | temporary spike |
| Alpha | isolated heavy impact |
| Saturation | many simultaneous weak sources |
| Suppression | persistent unavoidable cadence |
| Control | EWAR / tackle pressure |

---

# Weapon & Threat Classification

Observed stable weapon classes:

| Weapon | Tactical Meaning |
|---|---|
| Light Missile | skirmish / saturation |
| Heavy Missile | sustained medium pressure |
| Cruise Missile | ranged suppression |
| Torpedo | burst / alpha |
| Turret / Artillery | tracking dependent |

Observed stable hostile archetypes:

| Entity | Role |
|---|---|
| Pith Massacrer | cruise suppression |
| Pith Usurper | torpedo burst |
| Dire Pithum Nullifier | ECM/control |
| Mercenary Crow | tackle/light missile |
| Mercenary Rapier | tackle/range control |
| Missile Batteries | emplacement pressure |

Important:
- weapon identity matters more than raw damage.

---

# Cadence Findings

Weapon cadence proved highly deterministic.

Observed patterns:

| Weapon | Typical Cadence |
|---|---|
| Cruise Missile | ~5s |
| Heavy Missile | ~5s |
| Torpedo | ~3–5s |
| Light Missile | clustered repeated intervals |

This supports:
- cadence analysis,
- pressure persistence,
- predictive telemetry later.

---

# Tactical Control Findings

The logs expose tactical control state directly.

Observed:
- warp scramble attempts,
- warp disruption attempts,
- warp denial,
- sensor interference,
- targeting failure.

This allows distinction between:

| State | Meaning |
|---|---|
| Dangerous hostile present | tackle capability exists |
| Escape denied | active tackle state |

---

# Drone Warfare Findings

Drone warfare forms a full telemetry subsystem.

Observed:
- drone engagement,
- drone return,
- drone incapacitation,
- drone bandwidth restrictions,
- drone tackle targeting,
- drone misses,
- drone application.

Drone telemetry should likely become its own state subsystem.

---

# Resource Warfare Findings

Capacitor warfare is directly observable.

Observed:
- module activation failures,
- energy neutralization,
- repair inability,
- propulsion failure.

This exposes:
- operational degradation,
- mobility collapse,
- repair instability,
- combat capability loss.

---

# Environmental & Operational Findings

Not all threats are hostile ships.

Observed:
- environmental damage,
- faction restrictions,
- docking denial,
- simulation state,
- travel state,
- autopilot state,
- session lock.

The combat model must support:
- operational state,
- not just incoming damage.

---

# PvP Findings

PvP logs confirmed:
- tackle networks,
- fleet-follow states,
- overlapping EWAR,
- drone-target tackle,
- coordinated pressure,
- relational combat.

Combat becomes graph-like under PvP.

Not:
- one hostile,
- one pressure source,
- one event stream.

But:
- layered relationships,
- overlapping effects,
- synchronized tackle.

---

# Color Metadata Findings

Combat logs contain stable semantic color metadata.

Observed:

| Color | Meaning |
|---|---|
| `0xffcc0000` | incoming / hostile damage |
| `0xff00ffff` | outgoing / self-applied damage |

Recommendation:
- preserve raw color metadata in normalized events.

Example:

```ts
{
  rawColor: "0xffcc0000",
  direction: "incoming"
}
```

Do not strip formatting too early.

---

# Recommended Canonical Event Categories

```text
GameEvent
├── CombatEvent
├── EwarEvent
├── DroneEvent
├── ResourceEvent
├── NavigationEvent
├── EnvironmentalEvent
├── FleetEvent
├── RestrictionEvent
├── SessionEvent
├── EconomyEvent
├── FactionEvent
├── UIEvent
└── TravelEvent
```

---

# Final Design Principle

AURA-7 should not mirror the combat log.

It should surface:
- changing combat qualities,
- operational degradation,
- application shifts,
- dominant pressure,
- control effects,
- equilibrium changes,
- and immediate pilot-attention telemetry.

No assumptions.
No battlefield authority.
No automated judgement.

Only concise operational truths extracted from combat noise.

