# Gap To-Do: Live IO Provider Fault Injection

Status: Open
Priority: P1
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

Provider paths need hostile failure tests before live behavior is trusted.

## Actionables

- Simulate blocked live IO for Passive Telemetry and Threat Intel.
- Simulate timeout, cancellation, retry exhaustion, 429, 500, malformed JSON, non-array responses, stale cache, failed ETag revalidation, and partial zKill refs.
- Verify failures remain lane-specific and do not appear as empty intelligence.
- Verify request diagnostics stay sanitized and compact.

## Guardrails

- Do not run real provider calls inside `verify:all`.
- Do not add broad retry loops.
- Do not call APIs from renderer.

## Completion Signal

- Provider fault injection tests cover common and hostile failure modes.
- Blocked/failed/partial/cached states are distinguishable.
- `npm.cmd run verify:all` passes.
