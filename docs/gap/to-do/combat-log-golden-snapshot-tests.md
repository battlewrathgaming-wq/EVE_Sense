# Gap: Combat Log Golden Snapshot Tests

Status: Open
Priority: P1
Milestone: 07 - Combat Logging Test Suite

## Need

Combat Witness needs golden snapshot tests that prove rolling DPS/HPS and event-stream output from known datasets.

Parser fixtures prove individual lines. Golden snapshot tests prove predictable time-window behavior from sequences of lines.

## Guardrails

- Do not make golden snapshots depend on wall-clock time.
- Do not include renderer layout or styling.
- Do not infer unseen combat state from missing lines.
- Do not treat snapshot expectations as tactical recommendations.
- Do not require raw repair parsing until exact repair fixtures exist.

## Completion Signal

- A fixture dataset produces expected 5s, 15s, and 30s snapshots.
- Tests verify damage taken DPS, damage dealt DPS, HPS when supported, HPS-DPS balance, most common hit quality, top source labels, and event stream retention.
- Snapshot tests run under `npm.cmd run verify:all`.
- Golden outputs include freshness/window metadata so failures explain whether math, ordering, or parser classification changed.

## Related Files

- `docs/features/combat-logging-test-suite.md`
- `docs/roadmap/milestone-07-combat-logging-test-suite.md`
- `src/combat/combatRollingWindow.js`
- `src/combat/combatWitnessService.js`
- `scripts/verify-combat-witness-core.js`
