# Gap To-Do: Passive Telemetry Local System Resolver

Status: Open
Milestone: `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`

## Task Requirement

Add a backend-owned resolver that maps observed EVE system names from `navigation.jump` events to `solarSystemID`.

## Why It Matters

Passive Telemetry currently has the correct lane shape, but unresolved system names prevent real ESI activity and zKill context. Live use should not depend on ESI lookup for static system identity.

## Actionables

- Add an injectable resolver used by `PassiveTelemetryService`.
- Resolve exact system-name matches from local/static metadata.
- Return a structured unresolved result when no exact match exists.
- Keep unresolved systems non-fatal and visibly degraded.
- Add fixture-backed tests for resolved and unresolved systems.

## Guardrails

- Do not use live ESI as the default resolver.
- Do not create Atlas persistence.
- Do not let renderer resolve systems.
- Do not silently guess on ambiguous or partial names.

## Completion Signal

- A fixture jump to a known system produces `currentSystem.systemId`.
- A fixture jump to an unknown system returns degraded state without throwing.
- `npm.cmd run verify:all` passes.

## Related Files

- `src/passive/passiveTelemetryService.js`
- `src/main/main.js`
- `scripts/verify-passive-telemetry.js`
- future local metadata resolver files
