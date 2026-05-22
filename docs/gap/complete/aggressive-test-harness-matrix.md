# Gap To-Do: Aggressive Test Harness Matrix

Status: Complete
Priority: P0
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

AURA-Sense needs a clear matrix that maps core invariants to verification commands so aggressive tests do not become scattered scripts.

## Actionables

- List core invariants: renderer boundary, parser truth, watcher append-only behavior, live IO gate, clipboard lifecycle, settings recovery, diagnostics sanitization, provider failure visibility, and visual state.
- Map each invariant to `verify:all`, focused verify commands, Electron smoke, live API smoke, live operator smoke, or manual bug hunt.
- Identify what must never enter `verify:all`.
- Add command documentation for new aggressive test scripts.

## Guardrails

- Keep `verify:all` offline and deterministic.
- Do not require local EVE logs, live network, Electron, or large SDE assets for offline verification.
- Do not create scripts that mutate product state outside `.tmp` or explicit fixtures.

## Completion Signal

- A testing matrix exists and is linked from roadmap/current-state or testing docs.
- New aggressive tests have an explicit command class.
- `npm.cmd run verify:all` passes.

## Completion Notes

- Matrix added at `docs/testing/aggressive-test-harness-matrix.md`.
- Current-state and Milestone 13 now link the matrix and command-class boundary.
- `verify:combat-parser-hostile` is the first explicit aggressive offline command and is included in `verify:all`.
