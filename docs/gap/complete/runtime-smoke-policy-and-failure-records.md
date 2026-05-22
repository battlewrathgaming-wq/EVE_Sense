# Gap To-Do: Runtime Smoke Policy And Failure Records

Status: Complete
Priority: P2
Milestone: 11 - Operational Hardening And Runtime Control

## Need

AURA-Sense needs a clear policy for offline verification, Electron smoke, live API smoke, and live operator smoke so evidence is useful and repeatable.

## Actionables

- Classify smoke commands as offline, Electron/manual, live API, or live operator.
- Keep `verify:all` offline and deterministic.
- Keep artifacts under `.tmp` unless a durable audit records the result.
- Add failure records for reusable bug classes.
- Avoid hardcoded machine paths in scripts.

## Guardrails

- Do not make CI depend on local EVE logs or live network.
- Do not weaken smoke assertions to pass unstable UI.
- Do not store private logs as smoke artifacts.

## Completion Signal

- Smoke policy is documented and reflected in scripts/docs.
- Failure records exist for newly discovered reusable defects.
- `npm.cmd run verify:all` passes.
