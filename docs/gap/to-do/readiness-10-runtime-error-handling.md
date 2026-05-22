# Gap To-Do: Runtime Error Handling

Date: 2026-05-22
Status: Open

## Actionables

- Add unhandled rejection logging.
- Add uncaught exception logging.
- Add renderer crash/gone handling.
- Surface degraded state where useful.
- Preserve enough diagnostic context for long-session failures.
- Route runtime failures through the shared diagnostics policy where possible.
- Add a small offline verification or injectable handler test for runtime error reporting.
- Keep fatal/degraded signals high priority; do not rely on console-only output.

## Task Requirements

A tactical overlay may run for long sessions. Failure should be visible and diagnosable rather than silent.

This task should add minimal runtime safety handling without turning the app into a heavy monitoring system.

Expected first files to inspect:

- `src/main/main.js`
- `src/services/diagnosticsPolicy.js`
- `src/services/messageTaxonomy.js`
- `scripts/verify-*.js`

## Guardrails

- Do not spam the renderer with low-value errors.
- Do not auto-restart loops without clear status.
- Do not hide fatal errors behind generic messages only.
- Do not add a renderer diagnostics UI in this slice.
- Do not swallow fatal errors without preserving developer-visible context.

## Completion Signal

Long sessions fail visibly and diagnostically rather than silently.

## Evidence Of Completion

When complete, record:

- handlers added
- user-visible/developer-visible outputs
- verification or manual smoke evidence
- diagnostic event names and priorities used
- any intentionally deferred renderer-facing behavior

## Related Documents

- `docs/audits/audit-2026-05-22-performance-stability-readiness.md`
- `docs/audits/audit-2026-05-22-diagnostics-throttling-handover.md`
- `docs/roadmap/milestone-02-runtime-observability.md`


