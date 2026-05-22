# Gap: Combat Log Dataset Fixture Ingestion

Status: Open
Priority: P1

## Need

AURA-Sense needs a deterministic way to convert curated real EVE log datasets into parser fixtures without manually copying every line into ad hoc tests.

The ingestion path should preserve exact raw line text, hashes, proposed event family, source file metadata, and expected parser outcome.

## Guardrails

- Do not ingest an entire private log directory by default.
- Do not mutate source datasets.
- Do not normalize raw line text before hashing.
- Do not treat proposed event family as parser truth.
- Do not require Electron.

## Completion Signal

- A script can read a small fixture source file or spreadsheet export and produce repository fixture JSON/JSONL.
- Each fixture row includes raw line hash and expected parser disposition.
- Verification fails if raw line text no longer matches the stored hash.

## Related Files

- `docs/features/combat-logging-test-suite.md`
- `docs/research/aura7_exact_raw_event_samples.xlsx`
- `fixtures/combat-log-parser.json`
- `scripts/verify-combat-parser.js`
- `src/combat/combatLogParser.js`

