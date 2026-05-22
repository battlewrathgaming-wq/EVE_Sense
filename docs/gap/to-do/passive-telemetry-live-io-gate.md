# Gap To-Do: Passive Telemetry Live IO Gate

Status: Open
Milestone: `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`

## Task Requirement

Add a backend-owned gate that controls whether Passive Telemetry may perform live external IO.

## Why It Matters

Passive Telemetry is automatic after a current-system observation. Automatic live work must be visible, blockable, and explainable.

## Actionables

- Add a small live IO gate or reuse an existing compatible gate if present.
- Represent states such as local-only, live-disabled, live-enabled, blocked, and degraded.
- Ensure `passive.telemetry.refresh` does not call zKill or ESI activity clients when live IO is disabled.
- Return clear blocked/degraded snapshot metadata.
- Keep `verify:all` offline.

## Guardrails

- Do not use live gating as permission for broad polling.
- Do not add renderer network calls.
- Do not hide blocked live behavior as empty activity.
- Do not add Threat Intel or Clipboard Acquisition in this task.

## Completion Signal

- With live IO disabled, Passive Telemetry returns blocked/degraded state and no zKill or ESI activity call is made.
- With live IO enabled in tests, the injected client can run.
- `npm.cmd run verify:all` passes.

## Related Files

- `src/main/main.js`
- `src/services/serviceRegistry.js`
- `src/passive/passiveTelemetryService.js`
- future live IO gate files
