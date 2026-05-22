# Gap: Combat Log Replay Harness

Status: Open
Priority: P1

## Need

AURA-Sense needs an offline replay harness that feeds ordered fixture lines through the same parser/runtime path used by the gamelog watcher.

This is required to test datasets as streams, including ordering, duplicate suppression, partial-line behavior, runtime status, and event fan-out.

## Guardrails

- Do not replay old logs in normal runtime behavior.
- Do not require a live EVE client.
- Do not require Electron.
- Do not bypass `parseEveLogLine`, `EveGamelogWatcher`, or `CombatWitnessService` semantics unless the test explicitly names the lower boundary.
- Do not persist replay output as combat history.

## Completion Signal

- A verification script can replay a curated dataset into Combat Witness runtime.
- Replay emits normalized events and snapshots deterministically.
- Replay can simulate chunking and partial lines.
- Replay can assert duplicate suppression and listener isolation.

## Related Files

- `docs/features/combat-logging-test-suite.md`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessService.js`
- `scripts/verify-gamelog-watcher.js`

