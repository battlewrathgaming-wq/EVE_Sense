# Complete: Diagnostics Throttling

Status: Complete
Date: 2026-05-22

## Need

Diagnostics should help during development and long sessions without flooding console, IPC, or future renderer diagnostics channels.

## Completed Work

- Added reusable diagnostics policy helper at `src/services/diagnosticsPolicy.js`.
- Added diagnostic priority classification for low, medium, and high value events.
- Suppressed low-value normal chatter by default.
- Throttled medium-value events by source/key.
- Preserved high-value errors, degraded states, watcher fallback, listener failures, parser failures, and rate limits.
- Applied diagnostics policy to `EveGamelogWatcher`.
- Applied diagnostics policy to `CombatWitnessService`.
- Applied diagnostics policy to `HttpClient` request logging.
- Removed duplicate HTTP error logging for non-OK responses.
- Added verbose mode for development inspection.
- Added `npm run verify:diagnostics`.
- Included diagnostics verification in `npm run verify:all`.

## Default Behavior

Suppressed by default:

- `poll_tick`
- `tail_read`
- `duplicate_suppressed`
- `file_event`
- `file_seeded`
- `offsets_seeded`
- successful HTTP request chatter
- routine unparsed line reports

Throttled by default:

- normal `watching` status events
- watcher strategy announcements
- unknown medium-priority diagnostic events

Preserved by default:

- watcher strategy fallback
- watcher error/missing/invalid status
- parser errors
- listener errors
- snapshot sink/listener errors
- partial line drops
- HTTP errors
- HTTP rate limits

## Files Covered

- `src/services/diagnosticsPolicy.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatWitnessService.js`
- `src/services/httpClient.js`

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

## Deferred Risks

- No renderer diagnostics channel exists yet.
- No diagnostics drawer or presentation UI was added.
- Live long-session diagnostics behavior still needs smoke coverage once runtime services are wired.
- Future producers must opt into the shared policy instead of sending diagnostics directly.

## Related Files

- `scripts/verify-diagnostics-policy.js`
- `scripts/verify-http-client.js`
- `scripts/verify-all.js`
- `docs/audits/audit-2026-05-22-diagnostics-throttling-handover.md`
