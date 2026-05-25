# OverseerHS09: Passive Telemetry Instrument Band Dev Runway

Status: Active Dev runway opened
Date: 2026-05-25
Owner: AURA-Sense Overseer

## Decision

Open a tiny renderer-only Dev packet for:

```txt
Passive Telemetry Instrument Band
```

The Human confirmed they want Dev. This is Sense work, not Atlas or Lab work.

## Basis

- `workspace/OverseerHS07-sense-m19-instrument-status-band-adoption-review.md`
- `workspace/UIUXHS03-passive-telemetry-instrument-band-advisory.md`
- `workspace/OverseerHS08-passive-telemetry-instrument-band-advisory-review.md`

## Executor

Dev.

## Expected DevHS

```txt
workspace/DevHS03-passive-telemetry-instrument-band-prototype.md
```

## Scope Summary

Implement a compact Passive Telemetry Instrument Band using existing renderer surfaces and existing `passive.telemetry.snapshot` fields only.

Do not change backend contracts, provider behavior, bridge APIs, IPC channels, service commands, payload fields, live IO gates, parser/watcher/runtime behavior, or Lab/Atlas/Core files.

## Verification

Required commands are listed in `workspace/current.md`.

Live provider smoke, manual shortcut validation, and real SDE refresh/download remain gated unless the Human explicitly authorizes them.
