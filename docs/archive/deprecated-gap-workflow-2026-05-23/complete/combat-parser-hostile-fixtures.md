# Gap To-Do: Combat Parser Hostile Fixtures

Status: Complete
Priority: P0
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

The parser must reject hostile and near-miss lines as safely as it accepts known-good lines.

## Actionables

- Add malformed envelope fixtures.
- Add timestamp rollover, impossible date, timezone-like, and missing timestamp variants.
- Add near-miss combat text that looks tactical but should reject.
- Add oversized lines and private-content lookalikes.
- Prove rejected lines use hash evidence and do not leak raw line text.
- Keep coverage matrix honest about supported, rejected, deferred, and unknown families.

## Guardrails

- Do not widen parser support without exact accepted raw fixtures.
- Do not store broad private logs.
- Do not infer repair/healing or EWAR support from lookalikes.

## Completion Signal

- Hostile fixtures are covered by focused parser/coverage verification.
- Rejections are explicit and diagnostic-safe.
- `npm.cmd run verify:all` passes.

## Completion Notes

- Hostile fixtures added at `fixtures/combat-log-hostile-parser.json`.
- Focused verifier added as `npm.cmd run verify:combat-parser-hostile`.
- Coverage matrix now tracks hostile rejected families separately from supported exact fixtures.
- Rejection evidence in the verifier uses exact raw-line hashes and does not retain raw line text.
- Hostile verification exposed and fixed an unsupported-color fallback in `src/combat/combatLogParser.js`; color-tagged damage now requires a known direction color and matching relation.
