# Gap To-Do: Runtime Startup And Session Recovery

Status: Complete
Priority: P1
Milestone: 11 - Operational Hardening And Runtime Control

## Need

Startup and session recovery should be explicit when required services, settings, or live permissions are unavailable.

## Actionables

- Define startup states for missing gamelog folder, invalid persisted path, disabled live IO, unavailable bridge, and stale snapshots.
- Keep watcher start/stop/restart validated and observable.
- Preserve lane-specific degraded messages.
- Verify partial startup does not imply tactical readiness.

## Guardrails

- Do not start watchers from invalid paths.
- Do not show optimistic ready state before backend confirmation.
- Do not collapse all degraded states into one generic error.

## Completion Signal

- Startup states are explicit and recoverable.
- Watcher lifecycle remains backend-owned and validated.
- `npm.cmd run verify:all` passes.
