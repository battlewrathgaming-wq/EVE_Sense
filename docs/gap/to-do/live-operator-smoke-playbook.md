# Gap To-Do: Live Operator Smoke Playbook

Status: Open
Priority: P0
Milestone: 12 - Live Validation And Tactical Calibration

## Need

AURA-Sense needs a manual live smoke process that proves real operator-machine behavior without collecting broad private history.

## Actionables

- Define live EVE gamelog smoke steps.
- Prove watcher start, append-only behavior, future jump observation, Combat Witness updates, and shutdown.
- Record command, environment, result, artifact path, and deferrals.
- Avoid storing broad raw logs.

## Guardrails

- Do not replay historical logs in normal runtime.
- Do not ingest private folders wholesale.
- Do not include live smoke in `verify:all`.

## Completion Signal

- A live operator smoke audit exists with result and artifact path.
- Failures are recorded or scoped into follow-up gaps.
