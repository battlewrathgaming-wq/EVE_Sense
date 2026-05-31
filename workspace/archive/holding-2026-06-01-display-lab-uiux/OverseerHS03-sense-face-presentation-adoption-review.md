# OverseerHS03: Sense Face Presentation Adoption Review

Date: 2026-05-24
Role: Overseer
Status: Accepted for bounded Dev runway
Reviewed Sense advisory: `workspace/UIUXHS02-sense-face-presentation-advisory.md`
Reviewed Lab advisory input: `F:\Projects\AURA- Lab\workspace\SenseImportAdvisoryHS65-lab-presentation-adoption.md`

## Decision

Accept the Sense face advisory as bounded presentation direction and open a narrow Dev runway.

Recommendation: adapt, not import.

The Lab advisory is useful as presentation input, but it is not Sense authority. The Sense-side UI/UX advisory correctly preserves Sense-owned lane meaning, backend-owned truth, and renderer-boundary constraints.

## Accepted Direction

Open a renderer-only face refinement pass for Combat Witness and Passive Telemetry.

The pass should improve first-read clarity without changing contracts, bridge fields, IPC channels, service commands, provider behavior, parser behavior, rolling-window computation, or shared doctrine.

Combat Witness should become the first read:

- `Incoming DPS`
- `Repair HPS`
- `Observed balance`
- `Observed source`
- `Observed weapon`

Passive Telemetry should remain compact support:

- system
- kills
- jumps
- ratio
- state
- provider/sample basis

Accepted Passive state copy remains:

- `Fresh context`
- `Stale context`
- `Partial sample`
- `Capped sample`
- `Live IO blocked`
- `Degraded`
- `No observation`

## Lab Patterns Accepted For Adaptation

- compact readout hierarchy
- status-light / state-chip treatment
- source, freshness, basis, gaps, warnings, and diagnostics visibility
- diagnostics demotion without hiding authority state
- narrow/overlay containment discipline
- warning-only terminology review posture
- visual smoke expectations for changed presentation states

## Lab Patterns Rejected Or Parked

- importing Lab fixture taxonomy
- importing Lab neutral labels as Sense product meaning
- turning `Bridge State Readout` into Sense doctrine
- broad face redesign before a bounded renderer prototype proves value
- any Core/shared adapter work

## Sense-Specific Meaning To Preserve

- Combat Witness is rolling recent observation, not historical proof.
- Passive Telemetry is current-system context, not continuous Threat Intel.
- Threat Intel is deliberate scoped inspection, not background monitoring.
- Clipboard Acquisition is a short visible authority window.
- Renderer presents backend snapshots; backend owns truth.

## Dev Runway

`workspace/current.md` now opens:

```txt
Sense Face Refinement Pass - Combat Witness + Passive Telemetry
```

Expected Dev handoff:

```txt
workspace/DevHS02-sense-face-refinement-pass.md
```

## Verification Expectations

Required if Dev changes renderer presentation:

```powershell
npm.cmd run verify:combat-witness
npm.cmd run verify:combat-bridge
npm.cmd run verify:combat-runtime
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:protected-terms
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Do not run live provider smoke, live API calls, real SDE refresh, or manual shortcut validation unless the Human explicitly authorizes it.

## Risks

- Stronger face styling can imply stronger certainty unless observed/recent/sample wording remains visible.
- Diagnostics demotion can become unsafe if it hides source, freshness, basis, warnings, live IO, watcher, or provider state.
- Passive Telemetry can drift toward Threat Intel if the provider sample looks like continuous inspection.
- Combat Witness can drift toward Atlas evidence if observed rolling-window language is weakened.

## Stop Conditions

Return before continuing if the implementation would require backend contract changes, renderer-owned computation, parser changes, provider behavior changes, Lab/Core/shared doctrine decisions, or live/manual validation.
