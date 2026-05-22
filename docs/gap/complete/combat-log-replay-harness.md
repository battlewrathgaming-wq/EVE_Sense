# Complete: Combat Log Replay Harness

Status: Complete
Date: 2026-05-22

## Outcome

An offline replay harness can feed ordered curated lines through parser, partial-line assembly, duplicate suppression checks, Combat Witness runtime fan-out, and Combat Witness service snapshots.

The harness now has two replay layers:

- semantic replay for deterministic parser/runtime/service golden checks
- watcher-path replay through `EveGamelogWatcher.handleFile` for temp-file append, offset seeding, partial-line buffering, rejection diagnostics, parser-error diagnostics, and duplicate suppression

## Evidence

- `fixtures/combat-log-replay-dataset.json`
- `scripts/verify-combat-log-replay.js`
- `npm.cmd run verify:combat-replay`

## Verification Signal

```txt
combat log replay verified: events=11 stream=10 watcher=3
```

## Guardrails Preserved

- Replay is verification-only.
- Normal runtime watcher doctrine remains append-only.
- No Electron dependency.
- No replay output is persisted as combat history.
