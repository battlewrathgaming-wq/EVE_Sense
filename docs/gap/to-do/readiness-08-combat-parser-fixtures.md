# Gap To-Do: Combat Parser Fixture Tests

Date: 2026-05-22
Status: Open - Partial

## Actionables

- Add fixture log lines for jump detection. Current: partial coverage exists.
- Add fixture log lines for incoming damage variants. Current: partial coverage exists.
- Add malformed line cases. Current: basic malformed coverage exists.
- Add long line cases. Current: overlong coverage exists.
- Add duplicate line cases. Current: short-window duplicate coverage exists.
- Verify partial-line buffering behavior. Current: coverage exists.
- Verify parser output shape. Current: partial coverage exists.
- Add rejected fixtures for invalid but envelope-shaped timestamps.
- Verify parser returns `null` rather than normalizing rolled-over date/time values.
- Verify watcher behavior when parser/listener code throws.
- Add more accepted raw combat samples before widening parser claims.

## Task Requirements

Log parsing must be testable without launching Electron.

The parser has been extracted into `src/combat/combatLogParser.js` and is covered by `scripts/verify-combat-parser.js`.

The remaining task is an acceptance hardening pass, not a broad parser expansion.

## Guardrails

- Do not widen parsing claims beyond known EVE log formats.
- Do not treat missing parser coverage as evidence that an event cannot happen.
- Do not require real EVE logs for tests.
- Do not infer damage type from weapon labels without an explicit metadata rule.
- Do not parse repair/healing lines until exact raw samples exist.

## Completion Signal

Parser behavior is covered by deterministic fixture tests, malformed timestamp rollover is rejected, and watcher failure behavior is predictable.

## Evidence Of Completion

When complete, record:

- fixture file(s)
- parser helper/module changes
- cases covered
- verification output
- remaining unsupported event families

## Related Documents

- `docs/contracts/combat-witness-contract.md`
- `docs/schemas/combat-event.md`
- `docs/audits/audit-2026-05-22-combat-parser-overseer-review.md`


