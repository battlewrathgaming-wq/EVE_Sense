# Gap To-Do: Passive Telemetry Debugging And Tracing

Status: Open
Milestone: `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`

## Task Requirement

Add enough debugging and tracing around Passive Telemetry live behavior to diagnose live smoke failures without turning the HUD into a log viewer.

## Why It Matters

The next failures are likely to be environmental: unresolved systems, blocked live IO, ESI activity failures, zKill failures, timeouts, cancellation, malformed responses, or stale cache behavior. Dev needs structured traces to see which path happened.

## Actionables

- Wire passive zKill and ESI activity requests through request logging hooks.
- Emit diagnostics for attempted, blocked, cached, succeeded, failed, timed out, cancelled, capped, partial, and stale paths.
- Include provider, endpoint shape, duration, status/failure code, retry count, cache/ETag state, and cap/partial metadata where available.
- Keep logs throttled through the existing diagnostics policy.
- Expose concise state fields for the HUD: unavailable, blocked, stale, partial, degraded, fresh.
- Add tests for trace emission on success, blocked, malformed response, and failure paths.

## Guardrails

- Do not expose raw API payloads in renderer diagnostics.
- Do not let tracing create a persistence layer.
- Do not flood renderer updates during repeated failures.
- Do not make diagnostics imply tactical certainty.

## Completion Signal

- Offline verification can prove the trace paths.
- A live smoke failure would leave enough artifact/log detail to explain the failure class.
- `npm.cmd run verify:all` passes.

## Dev Failure Notes

If this task cannot be completed cleanly, leave notes here:

```txt
Failure reason:

Relevant command/output:

Files touched:

Recommended next attempt:
```

## Related Files

- `src/services/httpClient.js`
- `src/services/diagnosticsPolicy.js`
- `src/passive/zKillSystemContextClient.js`
- future Passive Telemetry ESI activity client files
- `src/passive/passiveTelemetryService.js`
- `src/main/main.js`
- `scripts/verify-passive-telemetry.js`
