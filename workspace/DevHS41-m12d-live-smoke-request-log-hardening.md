# DevHS41: M12D Live Smoke Request-Log Hardening

Status: Complete
Date: 2026-05-25
Role: AURA-Sense Dev

## Summary

Hardened live API smoke audit artifacts without running live providers.

The packet keeps normal runtime diagnostics unchanged, adds smoke-local verbose request-log capture for future authorized live smoke artifacts, and aligns Passive refusal artifacts with the existing Threat refusal grammar.

## Files Changed

- `src/services/liveSmokeHttpClient.js`
- `scripts/smoke-passive-live-api.js`
- `scripts/smoke-threat-live-api.js`
- `scripts/verify-http-client.js`
- `docs/testing/live-api-smoke-transition-readiness.md`
- `docs/roadmap/runtime-smoke-policy.md`
- `docs/current-state/current-implementation.md`
- `workspace/current.md`
- `workspace/DevHS41-m12d-live-smoke-request-log-hardening.md`

## Empty M12C Request Logs Cause

M12C's successful Threat live artifact had `requestLogs: []` because `HttpClient` wraps `onRequestLog` through the default diagnostics policy.

Successful requests become `http_request_success`, and `diagnosticsPolicy` classifies `http_request_success` as low-value in normal mode. Low-value successes are suppressed by default, so the smoke-local `requestLogs` callback never received the successful zKill request metadata.

This was not a provider failure and did not mean the zKill request skipped the HTTP client. It meant the normal diagnostics filter did exactly what it does for runtime noise control.

## Chosen Request-Log Behavior

Future authorized live smoke artifacts should capture successful request metadata for auditability.

Implementation:

- Added `createLiveSmokeHttpClient()` in `src/services/liveSmokeHttpClient.js`.
- The helper constructs `HttpClient` with `createDiagnosticsPolicy({ mode: 'verbose' })`.
- `smoke:passive-live-api` and `smoke:threat-live-api` now use the helper for smoke-local HTTP clients.
- Normal runtime diagnostics policy is unchanged.

Captured request metadata remains bounded to the existing HTTP log fields such as provider, endpoint, method, status code, duration, retry count, cache/rate-limit/error indicators, and diagnostic event. It does not log raw provider bodies, request headers, clipboard content, private gamelog lines, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims.

## Passive Refusal Alignment

`npm.cmd run smoke:passive-live-api` without `AURA_SENSE_LIVE_API=1` now writes:

```json
{
  "status": "refused",
  "live_io_enabled": false,
  "no_live_call": true,
  "requestLogs": []
}
```

Threat refusal behavior remains intact and continues to record `live_io_enabled: false`, `no_live_call: true`, target settings, and empty `requestLogs`.

## Deterministic Checks

`scripts/verify-http-client.js` now verifies that `createLiveSmokeHttpClient()` captures successful request metadata in verbose smoke mode while still not storing headers or provider bodies.

The existing default HTTP behavior remains covered by the same verifier.

## Verification

Run without setting `AURA_SENSE_LIVE_API=1`:

```powershell
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:threat-live-api
npm.cmd run verify:http
npm.cmd run verify:threat-intel
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Results:

- `smoke:passive-live-api`: exited 0; refused and wrote `.tmp\passive-live-api-smoke\result.json` with `live_io_enabled: false`, `no_live_call: true`, and `requestLogs: []`.
- `smoke:threat-live-api`: exited 0; refused and wrote `.tmp\threat-live-api-smoke\result.json` with existing Threat refusal fields intact.
- `verify:http`: exited 0; HTTP client verified, including smoke-local successful request metadata capture.
- `verify:threat-intel`: exited 0; Threat Intel verified.
- `verify:protected-terms`: exited 0 in working-set mode; warning-only protected-term findings reported; no protected-word JSON updates or renames performed.
- `verify:all`: exited 0; all offline checks verified.
- `git status --short --branch`: showed branch `main...origin/main` with expected M12D modified/new files.

## Boundary Confirmation

- Did not set `AURA_SENSE_LIVE_API=1`.
- Did not run live zKill or ESI calls.
- Did not run Passive live API smoke as live execution.
- Did not use `AURA_SENSE_THREAT_LIVE_TARGET`.
- Did not inspect private/operator EVE log folders.
- Did not run live EVE log ingestion.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not change provider route semantics, target semantics, bridge contracts, IPC payload semantics, renderer behavior, Lab/adaptor/display work, lane meanings, or product claims.
- Did not run operator gamelog smoke, Combat calibration, or raw fixture intake.
