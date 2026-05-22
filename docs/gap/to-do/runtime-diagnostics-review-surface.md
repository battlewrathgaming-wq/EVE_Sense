# Gap To-Do: Runtime Diagnostics Review Surface

Status: Open
Priority: P1
Milestone: 11 - Operational Hardening And Runtime Control

## Need

Important failures need a quiet review surface so the operator and Dev can understand degraded state without reading console noise.

## Actionables

- Present high-value watcher, parser, runtime, and provider diagnostics.
- Preserve diagnostics policy filtering.
- Avoid raw log line leakage; prefer hashes and structured reasons.
- Keep routine poll/cache noise out of the primary HUD.
- Add verification for representative degraded diagnostics.

## Guardrails

- Do not stream an unfiltered log console into the renderer.
- Do not expose private raw log content.
- Do not make diagnostics the tactical truth source.

## Completion Signal

- Degraded states have inspectable reasons.
- Routine noise remains suppressed.
- `npm.cmd run verify:all` passes.
