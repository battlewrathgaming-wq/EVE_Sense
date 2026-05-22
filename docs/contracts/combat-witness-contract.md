# Contract: Combat Witness

Status: Seed
Date: 2026-05-22

## Purpose

Defines the transient combat-log witness model.

## Inputs

- newly appended EVE combat log lines
- file offset state
- parser output

## Outputs

- normalized combat events
- rolling-window snapshots
- one-shot event stream items

## Invariants

- Process newly appended log content only.
- Do not replay entire old logs during normal operation.
- Keep rolling windows bounded.
- Snapshot metrics may be recomputed from recent events.
- Event stream items should trigger once and expire.
- EWAR and pressure states must be labeled as observed/recent, not perfect truth.

## Must Not Do

- Do not preserve permanent combat history in AURA-Sense.
- Do not aggregate alpha spikes by ship label when labels may collide.
- Do not infer unseen state from missing log lines.
- Do not repeatedly re-alert from the same rolling-cache event.

