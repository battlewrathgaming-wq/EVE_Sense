# Gap To-Do: Passive Telemetry Scoped zKill Route

Status: Open
Milestone: `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`

## Task Requirement

Harden Passive Telemetry zKill calls so they are explicitly time-scoped and bounded.

## Why It Matters

Passive Telemetry should be respectful and scoped. A broad `/systemID/{id}/` route is less clear than a route that declares its lookback window.

## Actionables

- Use `/systemID/{id}/pastSeconds/{seconds}/`.
- Make `pastSeconds` a named client option.
- Include lookback/window metadata in the normalized context or snapshot.
- Preserve local sample cap and malformed-ref handling.
- Add tests that assert the generated endpoint includes `pastSeconds`.

## Guardrails

- Do not infer tactical truth from zKill summaries.
- Do not add ESI killmail expansion.
- Do not call zKill from renderer.
- Do not increase polling frequency.

## Completion Signal

- Offline verification proves route construction uses `pastSeconds`.
- zKill normalization still outputs bounded refs and cap/partial/failure metadata.
- `npm.cmd run verify:all` passes.

## Related Files

- `src/passive/zKillSystemContextClient.js`
- `src/passive/passiveTelemetryService.js`
- `scripts/verify-passive-telemetry.js`
