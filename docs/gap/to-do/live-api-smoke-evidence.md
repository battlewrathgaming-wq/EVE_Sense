# Gap To-Do: Live API Smoke Evidence

Status: Open
Priority: P0
Milestone: 12 - Live Validation And Tactical Calibration

## Need

Passive Telemetry and Threat Intel live provider paths need explicit opt-in evidence before product claims rely on them.

## Actionables

- Run live API smoke only with explicit `AURA_SENSE_LIVE_API=1` or equivalent gate.
- Record Passive Telemetry ESI/zKill routes, cache/ETag behavior, and blocked path.
- Record Threat Intel scoped zKill route, lookback, sample cap, blocked path, and failures.
- Keep artifacts outside offline verification.

## Guardrails

- Do not call APIs from renderer.
- Do not broaden provider routes.
- Do not retry noisily.
- Do not add ESI killmail expansion by default.

## Completion Signal

- Live provider evidence or safe refusal is recorded in an audit.
- `npm.cmd run verify:all` remains offline and passes.
