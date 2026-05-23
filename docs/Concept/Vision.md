# AURA-Sense Concept Vision

Status: Active reference
Updated: 2026-05-23

This concept file is aligned to the current implementation state. It is not an audit and not a promise that every future idea is implemented.

## Identity

AURA-Sense is a tactical viewport for EVE Online.

It presents recent observations from local combat logs, scoped external context, and deliberate user input. It should remain lightweight, bounded, and honest about uncertainty.

## Main Question

```text
What is happening around me right now?
```

Supporting questions:

```text
What must I notice?
What changed recently?
What is stale, partial, degraded, or unavailable?
```

## Boundary With Atlas

AURA-Sense observes now.

AURA Atlas remembers evidence and assessment over time.

AURA-Sense should not grow Atlas-style evidence retention, watch execution, historical reporting, or long-term intelligence storage unless a future ADR defines a narrow handoff.

## Current Lanes

### Combat Witness

Rolling local gamelog telemetry.

It observes recent combat pressure, repair throughput, source/target labels, weapons, damage type, and spike-like events where parser support exists.

It is not a killmail archive or survivability model.

### Passive Telemetry

Current-system context and low-frequency activity signals.

It may use local system resolution, ESI aggregate system activity, and scoped zKill context when live IO is enabled.

It is not Threat Intel and should not run broad background collection.

### Threat Intel

Explicit operator search from typed target or armed clipboard acquisition.

Current direction is scoped zKill-backed sampling with visible cap, freshness, and failure basis. ESI killmail expansion is deferred.

### Clipboard Acquisition

Short-lived deliberate target capture.

It is not always-on clipboard monitoring.

## Design Priorities

- backend-owned telemetry truth
- renderer as presentation only
- low cognitive load
- explicit degraded states
- bounded rolling windows
- local metadata where practical
- live API gates
- no overclaiming

## Current Hardening Focus

The current runway is aggressive testing:

- watcher chaos
- live provider faults
- clipboard races
- corrupted settings
- visual state regression
- local metadata/SDE builder hardening
- bug triage and failure records

## Mantra

```text
Observe conservatively.
Present tactically.
Keep telemetry transient.
Do not overclaim.
Keep Atlas separate.
```
