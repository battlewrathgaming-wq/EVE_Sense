# OverseerHS08: Passive Telemetry Instrument Band Advisory Review

Status: Advisory only, not Sense authority
Decision: Accepted advisory input
Date: 2026-05-25
Owner: AURA-Sense Overseer

## Request Received

Progress the current Sense context after Lab M19 became available as advisory presentation-pattern input.

An untracked UI/UX advisory already existed at:

```txt
workspace/UIUXHS03-passive-telemetry-instrument-band-advisory.md
```

This review accepts it as Sense-local advisory input only.

## Files Reviewed

- `workspace/current.md`
- `workspace/overview.md`
- `workspace/OverseerHS07-sense-m19-instrument-status-band-adoption-review.md`
- `workspace/UIUXHS03-passive-telemetry-instrument-band-advisory.md`

## Decision

Accept `UIUXHS03` as advisory input for a possible future Passive Telemetry instrument band.

Do not open Dev yet.

## Acceptance Reasons

- The advisory preserves Sense authority and treats Lab M19 as presentation grammar, not source meaning.
- It keeps Passive Telemetry as current-system context, not Threat Intel, Atlas evidence, or historical storage.
- It maps Lab state labels into Sense-owned lane copy rather than importing Lab labels as enums.
- It stays renderer-only for any future prototype and uses existing `passive.telemetry.snapshot` fields.
- It preserves backend-owned truth, live-IO gate meaning, provider/sample basis, partial/capped state, and no-observation distinctions.
- It explicitly rejects live provider smoke, manual shortcut validation, real SDE refresh, contract changes, and provider behavior changes for this advisory.

## Accepted Direction

If Human chooses to proceed, the next suitable packet is a tiny renderer-only Dev prototype:

```txt
Passive Telemetry Instrument Band
```

Minimum shape:

- current system as primary value
- Sense-owned Passive state label
- compact kills/jumps/ratio support
- basis/freshness line
- gap/warning/live-IO marker
- compact detail reveal or existing diagnostics reuse
- no backend contract, provider, bridge, IPC, or snapshot-shape changes

## Guardrails For Any Future Dev Packet

- Do not import Lab fixture semantics.
- Do not use Lab neutral labels as Sense state enums.
- Do not rename Sense contracts, payload fields, service commands, IPC channels, CSS/test ids, or bridge APIs.
- Do not compute Passive truth in the renderer.
- Do not call zKill, ESI, logs, provider clients, parser, watcher, or runtime modules from the renderer.
- Do not make Passive Telemetry look like continuous Threat Intel.
- Do not imply complete system awareness, Atlas evidence, verified truth, or historical storage.

## Recommendation

Human decision needed:

1. Open a tiny Dev packet for the Passive Telemetry Instrument Band.
2. Park this advisory until the next post-M14 Sense milestone.
3. Request another UI/UX pass focused on exact density/visual treatment before Dev.

Overseer recommendation: option 1 is now safe if the Human wants visible progress. The advisory is specific enough for a narrow renderer-only Dev runway.
