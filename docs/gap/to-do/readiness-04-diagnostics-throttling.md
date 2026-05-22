# Gap To-Do: Diagnostics Throttling

Date: 2026-05-22
Status: Open

## Actionables

- Add diagnostic levels or categories.
- Add a reusable diagnostics policy/helper under `src/services` or another clearly owned backend utility location.
- Apply the policy to current trace producers: `src/combat/eveGamelogWatcher.js`, `src/combat/combatWitnessService.js`, and `src/services/httpClient.js`.
- Disable or sample low-value normal traces by default, including poll ticks, routine tail reads, duplicate suppression, and successful request chatter.
- Preserve high-value errors, blocked requests, throttles, watcher strategy fallback, parser/listener failures, and degraded states.
- Throttle any future renderer diagnostics path before it is wired.
- Add verification or a small unit check for diagnostic filtering/throttling behavior.
- Include the verification in `npm run verify:all` once stable.

## Task Requirements

Diagnostics should help during development without becoming a runtime performance problem.

Current tracing is useful but ungoverned. Polling watcher ticks, routine tail reads, duplicate suppression, listener traces, and normal request logs should not flood console or future renderer diagnostics during normal operation.

## Guardrails

- Do not suppress important degraded/error states.
- Do not remove diagnostics entirely.
- Do not make diagnostics depend on renderer state.
- Do not add a renderer diagnostics drawer before backend diagnostic policy exists.
- Do not make the policy specific to Combat Witness only; HTTP and future API clients should be able to use it.

## Completion Signal

Normal operation does not flood console or renderer diagnostics, while degraded states remain visible.

## Evidence Of Completion

When complete, record:

- diagnostic controls added
- default behavior
- preserved high-priority events
- verification output
- files covered
- events intentionally suppressed or sampled by default

## Related Documents

- `docs/audits/audit-2026-05-22-performance-stability-readiness.md`
- `docs/roadmap/milestone-02-runtime-observability.md`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatWitnessService.js`
- `src/services/httpClient.js`


