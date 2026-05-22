# Complete: Runtime Error Handling

Status: Complete
Date: 2026-05-22

## Need

A tactical overlay may run for long sessions. Runtime failures should produce visible diagnostics with enough developer context instead of failing silently.

## Completed Work

- Added `src/main/runtimeErrorHandling.js`.
- Added process-level unhandled rejection reporting.
- Added process-level uncaught exception reporting.
- Added Electron render-process-gone reporting for existing and future windows.
- Routed runtime failures through the shared diagnostics policy.
- Preserved high-priority diagnostic events for fatal/degraded runtime states.
- Fixed `main.js` activation path by importing `BrowserWindow`.
- Added `npm run verify:runtime-errors`.
- Included runtime error verification in `npm run verify:all`.

## Diagnostic Events

- `runtime_unhandled_rejection`
- `runtime_uncaught_exception`
- `renderer_process_gone`

These are high-priority diagnostics and are preserved by the default diagnostics policy.

## User-Visible / Developer-Visible Outputs

- Developer-visible diagnostics are emitted through the shared backend diagnostics policy.
- Renderer-facing error presentation remains deferred until a renderer diagnostics transport/UI exists.
- Fatal errors are not hidden behind generic messages; diagnostics preserve message, name, code, and stack where available.

## Verification

Executed:

```powershell
npm.cmd run verify:runtime-errors
npm.cmd run verify:all
```

Observed:

```txt
runtime error handling verified
core utilities verified
runtime error handling verified
combat parser verified
combat witness bridge verified
combat witness core verified
diagnostics policy verified
gamelog watcher verified
services verified
HTTP client verified
Frame module verified
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
```

## Deferred Risks

- No renderer diagnostics UI was added.
- No automatic restart behavior was added.
- Live crash smoke was not run; this is covered by injectable offline verification only.

## Related Files

- `src/main/runtimeErrorHandling.js`
- `src/main/main.js`
- `src/services/diagnosticsPolicy.js`
- `scripts/verify-runtime-error-handling.js`
- `docs/audits/audit-2026-05-22-runtime-error-handling-handover.md`
