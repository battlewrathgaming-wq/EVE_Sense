# UIUXDiscoveryHS03: Combat Witness Quiet Pressure

Status: Advisory discovery input, not project authority
Date: 2026-05-27
Surface: Combat Witness first-read face and quiet state
Source owner: AURA-Sense

Naming / slicing footnote:

This artifact preserves the current source-facing `Combat Witness` term. Human discussion raised a future adapter/presentation-language direction: prefer `Combat Telemetry` as the main surface/lane label beside `Passive Telemetry`, while keeping witnessed/observed wording inside the lane for source humility. `Combat Witness` has useful flavor for aspects, but as a main surface name it can sound too dramatic or like a victim/witness persona. `Observed Source` and `Observed Weapon` are backend computational outputs from admitted combat-log observations and should be treated as sliceable combat-lane outputs, not separate product pillars. This note does not rename current code, contracts, artifacts, source terms, or UI copy; it preserves a future product-language consideration for an accepted adapter/presentation pass.

## Grounding Records Reviewed

- `workspace/current.md`
- `workspace/critical/critical-terms.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/current-state/current-implementation.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `F:\Projects\Docs\Aura-Project-Orchestration\Projects\Sense\UXUI\Context_memory.md`

## User Task

Notice recent observed combat pressure without treating the display as survival truth, complete fight history, or tactical command.

## What Is Visible Now

- `Combat Witness` surface in the main row.
- `15s rolling observed window` label.
- Gauge for `Observed balance`.
- `Incoming DPS` and `Repair HPS` values.
- Diagnostics include Combat State, Combat Summary, Combat Detail, Combat Signal, witnessed event count, 5s incoming, 15s repair, repair balance, event list.
- Quiet/empty state currently shows zeros and unavailable/waiting messages in some paths.

## What The User Needs To Understand

- Combat Witness is recent local-log observation.
- It is a short-window tactical support read, not complete combat truth.
- Zero/quiet should feel like "nothing observed in the window" rather than broken.
- Repair balance is observed HPS minus DPS, not survival or tank stability.
- I/O off now means no new local ingest; last/resting display may need separate treatment from active observation.

## First-Read Candidates

- Recent observed pressure.
- Incoming DPS / repair HPS relationship.
- Observed balance as a compact support cue.
- Quiet state that feels restful, not broken.
- Small I/O or watcher authority indication only when it changes whether new observation can enter.

## Detail / Diagnostic Candidates

- Event stream.
- Observed source / observed weapon context.
- Watcher state.
- 5s/15s/30s windows.
- Parser/watcher diagnostics.
- Ingest blocked state under I/O off.

## Terms To Preserve

- `Combat Witness`
- `Observed balance`
- `Incoming DPS`
- `Repair HPS`
- `15s rolling observed window`
- `Observed Source`
- `Observed Weapon`
- `Log Watcher` where watcher-specific

## Terms To Avoid Or Qualify

- Avoid `safe`, `stable`, `surviving`, `tank`, `breaking`, or `danger` unless future calibrated meaning supports it.
- Avoid `evidence`, `history`, or durable proof language.
- Avoid enemy/hostile identity claims from observed source labels.
- Avoid treating zeros as complete absence of combat outside the observed window.

## Risks / False Implications

- The gauge can overclaim survival if labeled or styled too decisively.
- Quiet zero state can be read as "safe" rather than "no observed pressure in window."
- Diagnostics can leak into the primary face and make the HUD feel operational rather than gameplay-supplementary.
- I/O-off ingest block could be confused with combat quiet if not represented carefully.

## Possible request_display Candidate

Parked.

This is core Sense face work, but it likely needs a User Meaning Card first before Lab comparison or display request.

Possible future candidate:

```text
sense.combat-witness-quiet-pressure
```

## No Dev Authorization

No Dev authorization. This artifact does not request implementation, calibration, renderer changes, live/manual gamelog use, or Lab submission.
