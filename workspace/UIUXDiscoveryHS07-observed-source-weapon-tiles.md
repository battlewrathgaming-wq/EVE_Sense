# UIUXDiscoveryHS07: Observed Source And Weapon Tiles

Status: Advisory discovery input, not project authority
Date: 2026-05-27
Surface: Observed Source / Observed Weapon context tiles
Source owner: AURA-Sense

Naming footnote:

This artifact preserves the current source-facing `Combat Witness` term. Human discussion raised a future adapter/presentation-language direction: prefer `Combat Telemetry` as the broader naming frame beside `Passive Telemetry`, with observed/witnessed language used inside the lane where source humility matters. `Combat Witness` has useful flavor for aspects, but as a main surface name it can sound too dramatic or like a victim/witness persona. This is a future product-language consideration only; it does not rename the current artifact, lane, code, contracts, source terms, or UI copy.

## Grounding Records Reviewed

- `workspace/current.md`
- `workspace/critical/critical-terms.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/current-state/current-implementation.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `F:\Projects\Docs\Aura-Project-Orchestration\Projects\Sense\UXUI\Context_memory.md`

## User Task

Glance at recent observed combat context without interpreting local log labels as durable identity, enemy status, or complete combat truth.

## What Is Visible Now

- `Observed Weapon` tile in the right column.
- `Observed Source` tile in the right column.
- A configurable front context tile can switch between `Observed Weapon`, `Observed Source`, and `Repair Balance`.
- Empty values show `--` or unobserved state depending on location.
- Diagnostics include `Observed Source` and `Observed Weapon`.
- Data comes from Combat Witness rolling window labels/counts.

## What The User Needs To Understand

- These tiles show recently observed local-log labels.
- They are support context for Combat Witness.
- Empty/unobserved state should not take large spatial authority.
- Observed source is not enemy classification.
- Observed weapon is not normalized item truth unless supported by source.

## First-Read Candidates

- Most observed weapon during active combat.
- Most observed source during active combat.
- Configurable utility tile for the context the player cares about.
- Dormant or compact state when no combat observation exists.

## Detail / Diagnostic Candidates

- Counts behind observed labels.
- Window duration.
- Source/target direction.
- Missing weapon label handling.
- Tie behavior and pruning.
- Event stream detail.

## Terms To Preserve

- `Observed Source`
- `Observed Weapon`
- `Most observed weapon`
- `Combat Witness`
- `Observed balance`

## Terms To Avoid Or Qualify

- Avoid `enemy`, `hostile`, `primary`, `attacker`, or identity certainty unless source supports it.
- Avoid `weapon type truth` or normalized item certainty.
- Avoid historical/evidence language.
- Avoid making empty tiles look equally important to active combat context.

## Risks / False Implications

- Large empty tiles can feel like permanent dashboard panels rather than context that appears at point of need.
- Observed Source can be read as actor identity or hostile classification.
- Observed Weapon can be read as precise item truth.
- Configurable tile affordance may be too quiet or too decorative.
- Empty right-column space competes with meaningful Combat Witness/Passive content.

## Possible request_display Candidate

Parked.

Potential future candidate:

```text
sense.observed-context-tiles
```

This likely needs a User Meaning Card before any request_display comparison.

## No Dev Authorization

No Dev authorization. This artifact does not request implementation, copy changes, renderer layout changes, or Lab submission.
