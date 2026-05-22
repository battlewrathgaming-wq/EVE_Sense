# Gap To-Do: Threat Intel Target Resolution Boundary

Status: Complete
Priority: P0
Milestone: 09 - Scoped Threat Intel And Clipboard Acquisition

## Need

Threat Intel must classify and resolve operator-entered targets without guessing or expanding into broad lookup behavior.

## Actionables

- Support system, pilot, corporation, alliance, and copied target text categories.
- Use local/static resolution where practical before any live lookup.
- Preserve unresolved and ambiguous target states.
- Return target kind, normalized label, resolved ID where known, and unresolved reason where not known.
- Reuse compact local metadata patterns where appropriate.
- Add tests for accepted, ambiguous, unsupported, and unresolved targets.

## Guardrails

- Do not silently guess target kind.
- Do not add large metadata imports before a real consumer needs them.
- Do not call live ESI for static type labels.
- Do not create Atlas-style identity stores.
- Do not auto-run from Passive Telemetry current-system state.

## Completion Signal

- Threat Intel can normalize supported target categories into a bounded scan target or explicit unresolved state.
- Ambiguous targets do not trigger live zKill calls.
- `npm.cmd run verify:all` passes.

## Related Files

- `docs/features/vision.md`
- `docs/terms/metadata.md`
- `docs/gap/complete/readiness-09-local-type-metadata.md`
- future target resolver files
