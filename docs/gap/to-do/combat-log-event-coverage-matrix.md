# Gap: Combat Log Event Coverage Matrix

Status: Open
Priority: P1

## Need

The parser needs a visible coverage matrix that separates supported, rejected, deferred, and unknown EVE log event families.

This lets dataset testing refine predictable events without silently widening parser claims.

## Guardrails

- Do not mark an event family supported without exact raw fixtures.
- Do not mark missing coverage as evidence that the event cannot happen.
- Do not combine usefulness/actionability with parser recognizability.
- Do not convert deferred families into UI requirements.

## Completion Signal

- A machine-readable coverage file exists.
- Verification checks that every accepted parser fixture maps to a supported event family.
- Verification checks that every deferred fixture remains rejected until explicitly promoted.
- Coverage status can be summarized in one command.

## Related Files

- `docs/features/combat-logging-test-suite.md`
- `docs/gap/complete/readiness-08-combat-parser-fixtures.md`
- `fixtures/combat-log-parser.json`
- `scripts/verify-combat-parser.js`

