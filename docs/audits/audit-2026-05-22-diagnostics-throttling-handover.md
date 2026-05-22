# Audit: Diagnostics Throttling Handover

Date: 2026-05-22
Scope: Backend diagnostics policy for current trace producers and HTTP request logging.

## Readiness Verdict

Ready with caveats.

Diagnostics now have an explicit backend policy. Normal chatter is suppressed or throttled by default, while degraded/error states remain visible. No renderer diagnostics UI or subscription channel was added.

## Completed Work

- Added `DiagnosticsPolicy`.
- Added low/medium/high diagnostic priority behavior.
- Added default suppression for routine watcher and HTTP success chatter.
- Added throttling for medium-value status events.
- Preserved watcher fallback, parser/listener failures, snapshot listener failures, HTTP errors, and rate limits.
- Applied policy to Combat Witness watcher traces.
- Applied policy to Combat Witness service traces.
- Applied policy to HTTP request logs.
- Fixed duplicate logging for non-OK HTTP responses.
- Added `verify:diagnostics` and included it in `verify:all`.

## Verification

Executed:

```powershell
npm.cmd run verify:diagnostics
npm.cmd run verify:http
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:all
```

Observed:

```txt
diagnostics policy verified
HTTP client verified
gamelog watcher verified
core utilities verified
combat parser verified
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

## Concerns

- Diagnostics are still backend-only.
- Future renderer diagnostics must be throttled before wiring.
- Live runtime smoke has not yet exercised the diagnostics policy under long polling or high log volume.
- Future services need to use the shared policy rather than ad hoc logging.

## Deferred Work

- Add runtime error handling using the diagnostics policy.
- Add renderer diagnostics transport only after backend policy and runtime errors are stable.
- Add live smoke for long-session watcher diagnostics when a runtime app path exists.

## Recommended Next Slice

Continue the active readiness queue:

```txt
docs/gap/to-do/readiness-10-runtime-error-handling.md
```
