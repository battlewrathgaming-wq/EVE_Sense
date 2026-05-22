# Gap To-Do: Runtime Live IO Control Policy

Status: Complete
Priority: P0
Milestone: 11 - Operational Hardening And Runtime Control

## Need

Live API behavior must be operator-visible and backend-enforced so AURA-Sense never looks like it is silently collecting external intelligence.

## Actionables

- Add an operator-visible live IO enabled/disabled state.
- Preserve backend live IO gate ownership for Passive Telemetry and Threat Intel.
- Show blocked state as blocked, not empty intelligence.
- Record request attempt/block/outcome metadata through backend diagnostics.
- Keep live API smoke out of `verify:all`.

## Guardrails

- Do not call APIs from renderer.
- Do not enable live IO by accident during offline verification.
- Do not add broad polling or retries.
- Do not hide provider failures.

## Completion Signal

- Live-disabled provider paths block visibly and make no external calls.
- Live-enabled paths remain scoped and observable.
- `npm.cmd run verify:all` passes.
