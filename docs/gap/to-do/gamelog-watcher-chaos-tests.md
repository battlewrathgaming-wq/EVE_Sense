# Gap To-Do: Gamelog Watcher Chaos Tests

Status: Open
Priority: P0
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

The watcher must remain append-only, bounded, and diagnostic-safe under filesystem chaos.

## Actionables

- Test existing-file offset seeding with multiple files.
- Test newly discovered file seeding without replay.
- Test partial lines across multiple appends.
- Test truncation, rotation-like replacement, deletion, and unreadable-file behavior.
- Test fs-watch fallback to polling.
- Test duplicate suppression TTL behavior under bursts.
- Test listener/parser failures without stopping the watcher.

## Guardrails

- Do not replay historical logs in normal runtime.
- Do not leak raw line content in diagnostics.
- Do not make watcher tests depend on real operator folders.

## Completion Signal

- Watcher chaos verification exists and is deterministic under `.tmp`.
- Append-only behavior is proven across failure cases.
- `npm.cmd run verify:all` passes.
