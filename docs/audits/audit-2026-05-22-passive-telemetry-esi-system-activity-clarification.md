# Audit: Passive Telemetry ESI System Activity Clarification

Date: 2026-05-22
Role: Overseer
Scope: Clarify that Passive Telemetry needs ESI aggregate system activity on gate jump.

## Clarification

Passive Telemetry requires ESI aggregate system activity after a gate jump.

When AURA-Sense observes the operator entering a system, the intended live context is:

```txt
observed jump/current system
-> resolve system ID
-> ESI system kills + system jumps
-> filter to current system
-> zKill bounded recent system context
-> Passive Telemetry snapshot
```

The ESI slice should expose:

- ship kills
- pod kills
- NPC kills
- jumps
- fetched/updated timestamp where available
- freshness/cache age
- one-hour activity record lifetime
- ETag/conditional revalidation state where available
- unavailable/degraded/failure state

## Boundary

This is not ESI killmail expansion.

ESI aggregate system activity belongs to Passive Telemetry because it answers low-noise current environment questions. ESI killmail expansion remains deferred and belongs only to a future explicitly authorized Threat Intel or Atlas handoff path.

## Endpoint Doctrine

- Use backend-only ESI clients.
- Use the live IO gate.
- Use request logging and diagnostics.
- Use cache or conditional behavior where practical.
- Treat system activity as a one-hour cache record with ETag/conditional revalidation where available.
- Read from the cached record while fresh.
- Do not poll continuously.
- Do not refetch repeatedly while the operator remains in the same system.
- Do not present ESI aggregate activity as complete tactical truth.
- Do not call ESI from the renderer.

## Source Pattern

This behavior exists in the project lineage:

- Aura 7/EVE-Threat-Overlay used ESI `system_kills` and `system_jumps`, filtered by system ID, for Passive Telemetry.
- Atlas contributes the live gate and request accounting discipline, but not its persistence or evidence model.

## Handoff Note

Dev should update the Passive Telemetry live-readiness interlock so the resolver feeds both ESI system activity and zKill system context. Verification should prove the ESI activity client can normalize fixture responses, filter to the requested system, read from a fresh one-hour activity record, revalidate with ETag/conditional state after expiry, expose freshness metadata, and degrade explicitly when blocked or failed.
