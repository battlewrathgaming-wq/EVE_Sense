# Backlog: Fleet Pressure Broadcast

Status: Future exploration only
Updated: 2026-05-23

This is not current AURA-Sense scope.

## Concept

A future system could broadcast lightweight pressure telemetry from multiple AURA-Sense clients to a fleet/logistics view.

Possible example:

```text
pilot, system, observed pressure, recent incoming DPS, timestamp
```

## Required Preconditions

Do not build this until:

- local Combat Witness is stable
- combat metrics are calibrated with real datasets
- privacy boundaries are defined
- transport/security model is reviewed
- relay behavior is bounded and non-authoritative

## Must Not Do

- send raw combat logs
- expose local filesystem data
- accept inbound remote commands
- become persistent fleet surveillance
- become Atlas-like intelligence storage
- imply perfect battlefield state

## Preferred Future Shape

If ever built, it should be:

- outbound-only from clients
- session-code based
- schema validated
- rate limited
- ephemeral
- telemetry-only
- explicitly enabled by the operator
