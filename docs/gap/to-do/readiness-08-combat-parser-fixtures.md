# Gap To-Do: Combat Parser Fixture Tests

Date: 2026-05-22
Status: Open

## Actionables

- Add fixture log lines for jump detection.
- Add fixture log lines for incoming damage variants.
- Add malformed line cases.
- Add long line cases.
- Add duplicate line cases.
- Verify partial-line buffering behavior.
- Verify parser output shape.

## Task Requirements

Log parsing must be testable without launching Electron.

The current parser lives inside `EveLogWatcher`, which makes it harder to verify independently. This task may extract parser helpers if useful, but should stay scoped.

## Guardrails

- Do not widen parsing claims beyond known EVE log formats.
- Do not treat missing parser coverage as evidence that an event cannot happen.
- Do not require real EVE logs for tests.

## Completion Signal

Parser behavior is covered by deterministic fixture tests.

## Evidence Of Completion

When complete, record:

- fixture file(s)
- parser helper/module changes
- cases covered
- verification output

## Related Documents

- `Docs/contracts/combat-witness-contract.md`
- `Docs/schemas/combat-event.md`


