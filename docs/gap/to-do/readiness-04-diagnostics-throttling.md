# Gap To-Do: Diagnostics Throttling

Date: 2026-05-22
Status: Open

## Actionables

- Add diagnostic levels or categories.
- Disable low-value cache hit/miss trace spam by default.
- Throttle diagnostics sent to the renderer.
- Preserve high-value errors, blocked requests, throttles, and degraded states.
- Add verification or a small unit check for diagnostic filtering behavior.

## Task Requirements

Diagnostics should help during development without becoming a runtime performance problem.

Current tracing is useful but chatty. Cache hit/miss, in-flight, and normal request traces should not flood console or renderer during normal operation.

## Guardrails

- Do not suppress important degraded/error states.
- Do not remove diagnostics entirely.
- Do not make diagnostics depend on renderer state.

## Completion Signal

Normal operation does not flood console or renderer diagnostics, while degraded states remain visible.

## Evidence Of Completion

When complete, record:

- diagnostic controls added
- default behavior
- preserved high-priority events
- verification output

## Related Documents

- `Docs/audits/audit-2026-05-22-performance-stability-readiness.md`


