# OverseerHS42: M12D Live Smoke Log Hardening Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer

## Reviewed

- `workspace/current.md`
- `workspace/DevHS41-m12d-live-smoke-request-log-hardening.md`
- `src/services/liveSmokeHttpClient.js`
- `scripts/smoke-passive-live-api.js`
- `scripts/smoke-threat-live-api.js`
- `scripts/verify-http-client.js`
- `docs/testing/live-api-smoke-transition-readiness.md`
- `docs/roadmap/runtime-smoke-policy.md`
- `docs/current-state/current-implementation.md`

## Acceptance

M12D live smoke request-log and refusal-artifact hardening is accepted.

The packet explains why M12C's successful Threat live smoke produced an empty `requestLogs` array, fixes future live-smoke artifact capture without changing normal runtime diagnostics policy, and aligns Passive refusal artifacts with Threat refusal artifacts.

## Accepted Behavior

- `HttpClient` success logs are still suppressed by normal runtime diagnostics because `http_request_success` remains low-value in normal mode.
- Live smoke scripts now use `createLiveSmokeHttpClient()`, which applies a smoke-local verbose diagnostics policy.
- Future authorized live smoke artifacts can capture successful HTTP request metadata for auditability.
- Normal runtime diagnostics are unchanged.
- Passive refusal artifacts now include `live_io_enabled: false`, `no_live_call: true`, and `requestLogs: []`.
- Threat refusal artifacts remain intact.
- Deterministic HTTP verification covers smoke-local successful request metadata capture with injected fake HTTP and asserts request headers/provider bodies are not stored.

## Verification

Overseer reran without setting `AURA_SENSE_LIVE_API=1`:

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

- `smoke:passive-live-api`: exited 0; refused and wrote `.tmp\passive-live-api-smoke\result.json`.
- Passive refusal artifact recorded `status: refused`, `live_io_enabled: false`, `no_live_call: true`, and `requestLogs: []`.
- `smoke:threat-live-api`: exited 0; refused and wrote `.tmp\threat-live-api-smoke\result.json`.
- Threat refusal artifact retained `live_io_enabled: false`, `no_live_call: true`, target `system:Jita`, and `requestLogs: []`.
- `verify:http`: exited 0; HTTP client verified.
- `verify:threat-intel`: exited 0; Threat Intel verified.
- `verify:protected-terms`: exited 0; warning-only findings remain; no protected-word JSON updates or renames were performed.
- `verify:all`: exited 0; all offline checks verified.
- `git status --short --branch`: showed expected M12D modified/new files before this acceptance record.

## Boundaries Preserved

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

## Residual Risk

The smoke-local success request metadata path is deterministically verified with fake HTTP. It has not yet been observed in a second authorized live run after this hardening. A future Passive or Threat live packet should confirm request metadata appears in the live smoke artifact.

Terminology verification remains warning-only because existing Sense docs include older cross-project wording in historical/current references. No M12D rename is required.

## Resting State

Return `workspace/current.md` to idle after M12D.

Recommended next M12 options:

- authorized Threat-only default Jita rerun only if the Human wants to confirm smoke-local success request metadata live
- Passive-only live API smoke using the now-aligned refusal grammar and smoke-local request metadata capture
- live operator gamelog smoke playbook execution
- Combat Witness calibration from accepted real samples
- raw repair/healing fixture intake from accepted samples
