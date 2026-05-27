# UIUXDiscoveryHS02: Provider Sample Basis Row

Status: Advisory discovery input, not project authority
Date: 2026-05-27
Surface: Provider/sample basis and pulse row
Source owner: AURA-Sense

## Grounding Records Reviewed

- `workspace/current.md`
- `workspace/critical/critical-terms.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/current-state/current-implementation.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `F:\Projects\Docs\Aura-Project-Orchestration\Projects\Sense\UXUI\Context_memory.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\Projects\Sense\UXUI\passive-telemetry-activity-texture-basis.md`

## User Task

Understand the basis behind displayed provider/sample values without reading provider liveness or certainty into the UI.

## What Is Visible Now

- Provider pulse row contains `passive-provider-pulse` and `threat-provider-pulse`.
- Initial Passive pulse reads `Passive --` / `No observation` depending on path.
- Initial Threat pulse reads `Threat --`.
- Renderer maps Passive pulse labels to `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Cached activity`, `Provider pending`, `Live IO blocked`, `Degraded`, and `No observation`.
- Threat pulse maps to `Threat pending`, `Threat blocked`, `Threat failed`, `Threat partial`, `Threat capped`, `Threat sampled`, or `Threat --`.

## What The User Needs To Understand

- Provider/sample state is basis support, not a live heartbeat.
- Passive basis should explain activity texture only as much as needed.
- Threat provider state should stay tied to deliberate scan, not imply continuous monitoring.
- I/O authority and provider failure must remain distinct.

## First-Read Candidates

- A quiet source/sample basis indicator rather than a pulse label.
- Passive basis near activity texture, not as a global status strip.
- Threat basis only when a scan exists or is actively pending/blocked.
- Small blip/gauge treatment only if it reads as sample/basis, not liveness.

## Detail / Diagnostic Candidates

- Provider, sample count, cap/partial, checked/captured time.
- ESI hourly/cadence basis.
- zKill lookback/sample detail.
- Failure counts and provider errors.
- Cache/ETag details only in diagnostics.

## Terms To Preserve

- `Provider pulse` as current source term until changed by accepted Sense work.
- `Partial sample`
- `Capped sample`
- `Live IO blocked`
- `No scan`
- `No observation`
- `No provider sample yet`
- `Threat Intel`
- `Passive Telemetry`

## Terms To Avoid Or Qualify

- Avoid `pulse` as interface direction if it implies continuous heartbeat.
- Avoid `live`, `healthy`, `online`, or `verified` unless source meaning explicitly supports it.
- Avoid `No data`.
- Avoid making `Cached activity` a primary Passive state without acceptance.

## Risks / False Implications

- Pulse language can imply a constant provider heartbeat.
- A shared provider row can make Passive and Threat look like equivalent continuous lanes.
- Passive provider status can feel more important than the activity texture it supports.
- Threat `Threat --` can imply a background Threat provider is idle rather than no deliberate scan.
- Basis detail can become diagnostic clutter.

## Possible request_display Candidate

Yes.

Existing candidate in display inventory:

```text
sense.provider-pulse-row
```

Recommended discovery direction:

```text
Compare pulse row against calmer source/sample basis treatments.
```

## No Dev Authorization

No Dev authorization. This artifact does not request implementation, copy changes, provider-state renames, Lab submission, bridge changes, or renderer changes.
