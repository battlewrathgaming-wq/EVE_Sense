# UIUXDiscoveryHS01: Passive Telemetry Current-System Activity

Status: Advisory discovery input, not project authority
Date: 2026-05-27
Surface: Passive Telemetry compact readout / current-system activity
Source owner: AURA-Sense

## Grounding Records Reviewed

- `AGENTS.md`
- `workspace/current.md`
- `workspace/critical/critical-terms.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/current-state/current-implementation.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `F:\Projects\Docs\Aura-Project-Orchestration\Projects\Sense\UXUI\Context_memory.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\Projects\Sense\UXUI\passive-telemetry-current-system-activity.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\Projects\Sense\UXUI\passive-telemetry-presence-behavior.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\Projects\Sense\UXUI\passive-telemetry-activity-texture-basis.md`

## User Task

Understand light activity texture for the current system without leaving EVE flow.

This surface should support the player's own inference. It should not command behavior, declare danger/safety, or behave like a diagnostic dashboard.

## What Is Visible Now

- `Passive Telemetry` lane label in the top glance strip.
- `No observation` as lane gap/state when no current system is observed.
- `Current system` label with `No observation` value.
- Activity chips for `Kills`, `Jumps`, and `Ratio`, currently `--` when no system exists.
- Passive readout state and basis line, currently `No observation` / `No provider sample yet`.
- Provider pulse row with Passive and Threat provider/sample chips.
- Diagnostics include Passive state, sample, activity, freshness, age, basis, gap, and pulse detail.

## What The User Needs To Understand

- When Sense has observed a current system, activity texture belongs to that system.
- Kills, jumps, and ratio are supplementary texture, not a recommendation.
- ESI activity is hourly/cadence-limited and should be read as a captured/checked basis, not live truth.
- Before a parser-observed system transition, Passive can rest quietly rather than showing a large static no-observation report.
- If current-system observation itself fails, the current-system slot can carry that replacement state.

## First-Read Candidates

- Current-system activity texture.
- System name as anchor for kills/jumps/ratio.
- Low-pressure ratio or gauge as a quiet vibe synthesis.
- Optional small basis print such as `ESI hourly`, checked time, captured time, or unchanged-at-last-check.
- Dormant drawer behavior before the first observed system transition.

## Detail / Diagnostic Candidates

- ESI check/capture timestamp detail.
- ESI unchanged-at-last-check detail.
- zKill system context sample detail, if retained in compact Passive context.
- Resolver detail only if resolution failure prevents activity lookup.
- Passive gate/failure metadata in diagnostics or support detail.
- Raw field names and cache/ETag internals should stay out of the first read.

## Terms To Preserve

- `Passive Telemetry`
- `Current system`
- `No observation`
- `Kills`
- `Jumps`
- `Ratio`
- `Live IO blocked`
- `Partial sample`
- `Capped sample`
- `No provider sample yet`

## Terms To Avoid Or Qualify

- Avoid generic `No data`.
- Avoid `Fresh context` as a global statement about the whole surface when only ESI/provider activity cadence is being described.
- Avoid bare `Current` where it can imply broad truth.
- Avoid `risk`, `safe`, `danger`, `threat`, `verified`, `truth`, `monitoring`, or `evidence`.
- Avoid heartbeat-like `pulse` language unless reframed as provider/sample basis.

## Risks / False Implications

- The current top-band empty state can make Passive feel like a static page section rather than a dormant drawer.
- A large `No observation` presentation may overstate absence before the lane has activated.
- `Fresh context` can make current-system authority feel uncertain if it is really ESI/provider cadence.
- Ratio can become a risk score if visually too central or warning-colored.
- Provider absence can accidentally weaken the current-system anchor even when only activity texture is missing.

## Possible request_display Candidate

Yes, but as a material/request-display candidate focused on presence behavior and activity texture, not source meaning.

Suggested candidate shape:

```text
sense.passive-current-system-activity
```

Request strength likely:

```text
formative / pressure-test
```

## No Dev Authorization

No Dev authorization. This artifact does not request implementation, copy changes, renderer changes, Lab submission, provider calls, live/manual smoke, schema changes, bridge changes, or visual polish.
