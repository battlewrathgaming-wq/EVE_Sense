# Gap To-Do: Runtime Settings And Diagnostics Fault Tests

Status: Open
Priority: P1
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

Runtime hardening needs fault tests beyond the happy-path settings and diagnostics cases.

## Actionables

- Test corrupted JSON settings.
- Test schema drift and unknown keys.
- Test missing, moved, and invalid gamelog directories after save.
- Test save/load race-like sequences.
- Test diagnostics limit enforcement.
- Test redaction of raw, line, content, and structured payload fields.

## Guardrails

- Do not persist telemetry or combat history.
- Do not expose raw private log text.
- Do not make renderer responsible for settings truth.

## Completion Signal

- Runtime settings and diagnostics fault tests are deterministic.
- Degraded settings remain recoverable.
- `npm.cmd run verify:all` passes.
