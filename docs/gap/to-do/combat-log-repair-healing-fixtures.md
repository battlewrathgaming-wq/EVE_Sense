# Gap: Combat Log Repair And Healing Fixtures

Status: Open
Priority: P1
Milestone: 07 - Combat Logging Test Suite

## Need

The rolling cache supports normalized `combat.repair` events, but raw repair/healing parser behavior is not yet fixture-proven.

AURA-Sense needs exact raw samples before claiming HPS from logs.

## Guardrails

- Do not classify repair cost questions as healing.
- Do not classify capacitor failure or module denial as healing.
- Do not infer repairs from damage reduction.
- Do not claim source/target certainty when the log line does not expose it.
- Do not add HPS UI claims before parser fixtures exist.

## Completion Signal

- Exact raw repair/healing samples exist with hashes.
- Parser tests cover accepted repair lines and rejected non-healing lookalikes.
- Normalized repair events include direction, amount, source/target labels when available, and event time.
- Rolling snapshot tests prove HPS from parsed repair fixtures.
- If exact raw samples remain insufficient, parser expansion remains explicitly deferred instead of guessed.

## Related Files

- `docs/features/combat-logging-test-suite.md`
- `docs/roadmap/milestone-07-combat-logging-test-suite.md`
- `src/combat/combatLogParser.js`
- `src/combat/combatRollingWindow.js`
- `fixtures/combat-log-parser.json`
- `scripts/verify-combat-parser.js`
