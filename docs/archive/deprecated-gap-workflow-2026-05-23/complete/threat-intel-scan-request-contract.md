# Gap To-Do: Threat Intel Scan Request Contract

Status: Complete
Priority: P0
Milestone: 09 - Scoped Threat Intel And Clipboard Acquisition

## Need

Threat Intel needs one backend-owned request and snapshot contract that covers explicit search submit, pasted targets, and armed clipboard acquisition.

## Actionables

- Define the Threat Intel scan request shape.
- Include target text, optional target kind, input source, lookback seconds, sample limit, live gate state, and request timestamp.
- Define the renderer-facing scan snapshot shape.
- Return explicit validation states for empty, ambiguous, unsupported, unresolved, blocked, partial, failed, and succeeded scans.
- Keep typed, pasted, and clipboard-acquired input on the same backend path.
- Add fixture-backed verification for valid and invalid request shapes.

## Guardrails

- Do not let renderer own scan truth.
- Do not trigger scans from search focus alone.
- Do not create a separate clipboard-only scan path.
- Do not add ESI killmail expansion.
- Do not add Atlas persistence or evidence stores.

## Completion Signal

- One backend contract handles explicit search submit and clipboard-acquired targets.
- Invalid target requests return explicit structured validation states.
- Verification proves request normalization and snapshot shape.
- `npm.cmd run verify:all` passes.

## Related Files

- `docs/roadmap/milestone-09-scoped-threat-intel-and-clipboard-acquisition.md`
- `docs/contracts/threat-intel-contract.md`
- future Threat Intel service/client files
- future verification scripts

