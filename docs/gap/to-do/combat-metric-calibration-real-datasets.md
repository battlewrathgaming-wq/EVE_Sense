# Gap To-Do: Combat Metric Calibration With Real Datasets

Status: Open
Priority: P1
Milestone: 12 - Live Validation And Tactical Calibration

## Need

Combat Witness weapon, source/target, repair balance, and spike metrics need real dataset review before the HUD gives them strong visual emphasis.

## Actionables

- Test longer curated combat samples across ship sizes, NPCs, drones, missiles, turrets, and mixed attackers.
- Compare current spike rule against percentile, median absolute deviation, fixed minimum, and sample-count thresholds.
- Decide minimum sample count for spike display.
- Preserve exact observed labels and uncertainty.
- Update schema and golden tests with the chosen rule.

## Guardrails

- Do not treat spikes as threat conclusions.
- Do not infer durable identity from observed labels.
- Do not persist combat history.

## Completion Signal

- Spike/weapon display rules are documented and fixture-backed.
- `npm.cmd run verify:all` passes.
