# Gap To-Do: Combat Parser Hostile Fixtures

Status: Open
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
