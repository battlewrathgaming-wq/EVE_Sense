# Gap To-Do: Runtime Settings Persistence

Status: Complete
Priority: P0
Milestone: 11 - Operational Hardening And Runtime Control

## Need

The operator should not have to re-enter safe runtime configuration every session, and invalid persisted settings must not silently mutate services.

## Actionables

- Persist validated gamelog folder and small product-facing runtime preferences.
- Load settings through backend validation at startup.
- Show recoverable degraded state when persisted paths are missing or invalid.
- Keep persistence schema explicit and versionable.
- Add verification for load, save, invalid path, and recovery behavior.

## Guardrails

- Do not persist tactical telemetry or combat history.
- Do not let renderer write settings directly.
- Do not accept invalid paths silently.
- Do not expose internal debug toggles as product settings.

## Completion Signal

- Settings survive restart through backend-owned validation.
- Invalid settings degrade visibly without starting invalid watchers.
- `npm.cmd run verify:all` passes.
