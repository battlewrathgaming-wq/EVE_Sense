# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: M12D live smoke request-log and refusal-artifact hardening
Source of intent: M12C completed the first Threat-only live zKill smoke, and the live artifact passed but had an empty `requestLogs` array; Human agreed to a small non-live hardening follow-up before Passive live smoke
Latest accepted slice: M12C Threat-only default Jita live API smoke
Latest live smoke record: `workspace/OverseerHS40-m12c-threat-live-api-smoke.md`
Latest M12B acceptance: `workspace/OverseerHS39-m12b-live-api-security-review-acceptance.md`
Latest security/engineering handoff: `workspace/SecEngHS38-m12b-live-api-security-review.md`
Latest M12A acceptance: `workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md`
Latest M12A Dev handoff: `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
Latest M12 prep acceptance: `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
Latest M12 gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
Current executor: Dev
Current status: Open
Expected output: `workspace/DevHS41-m12d-live-smoke-request-log-hardening.md`

## Purpose

Harden the audit trail for future live API smoke without making another live provider call.

This packet should explain and fix the empty `requestLogs` observation from M12C if appropriate, then align Passive refusal artifacts with Threat refusal artifacts so later Passive live work starts from the same artifact grammar.

This is not live execution.

## Required Reading

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/overseer.md`
- `docs/roadmap/README.md`
- `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
- `docs/roadmap/runtime-smoke-policy.md`
- `docs/testing/live-api-smoke-transition-readiness.md`
- `workspace/OverseerHS40-m12c-threat-live-api-smoke.md`
- `workspace/OverseerHS39-m12b-live-api-security-review-acceptance.md`
- `workspace/SecEngHS38-m12b-live-api-security-review.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`
- `scripts/smoke-threat-live-api.js`
- `scripts/smoke-passive-live-api.js`
- `scripts/verify-http-client.js`
- `scripts/verify-threat-intel.js`
- `src/services/httpClient.js`
- `src/services/diagnosticsPolicy.js`
- `src/threat/threatIntelZkillClient.js`
- `src/threat/threatIntelService.js`
- `src/passive/passiveTelemetryService.js`

## Runway

1. Trace why M12C's successful Threat live artifact had `requestLogs: []`.
2. Decide whether successful live smoke artifacts should include request metadata even though normal diagnostics suppress low-value HTTP successes.
3. If appropriate, harden the live smoke scripts or their local HTTP client construction so smoke artifacts capture request metadata without changing normal runtime diagnostics policy.
4. Align Passive refusal artifact shape with Threat refusal by adding:
   - `live_io_enabled: false`
   - `no_live_call: true`
   - `requestLogs: []`
5. Add deterministic verification for the chosen behavior using injected/fake HTTP where possible.
6. Update docs only where the expected artifact grammar changes.
7. Run required refusal/default-safe verification and create the expected Dev handoff.

## Acceptance Criteria

The packet is complete when:

- the cause of empty `requestLogs` is explained in the handoff
- future live smoke artifact request-log behavior is intentionally preserved or changed, with rationale
- if changed, request metadata is captured for smoke artifacts without logging raw provider bodies, headers with secrets, clipboard content, private gamelog lines, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims
- Passive refusal artifacts include `live_io_enabled: false`, `no_live_call: true`, and `requestLogs: []`
- Threat refusal behavior remains intact
- deterministic verification covers the changed smoke/request-log/refusal behavior
- no `AURA_SENSE_LIVE_API=1` run occurs
- no live zKill or ESI calls occur
- no Passive live API smoke, live EVE log ingestion, private folders, manual shortcuts, real SDE refresh, renderer, Lab, adapter, Combat calibration, or raw fixture intake work is run

## Guardrails

- Do not set `AURA_SENSE_LIVE_API=1`.
- Do not run live zKill or ESI calls.
- Do not run Passive live API smoke as live execution.
- Do not use `AURA_SENSE_THREAT_LIVE_TARGET`.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not change provider route semantics, target semantics, bridge contracts, IPC payload semantics, renderer behavior, Lab/adaptor/display work, lane meanings, or product claims.
- Do not broaden normal runtime diagnostics to noisy success logging unless that is explicitly scoped to smoke artifacts.

## Stop Conditions

Stop and hand off if:

- proving the request-log behavior would require a live provider call
- the safest fix would change normal runtime diagnostics policy rather than smoke-local artifact capture
- request metadata cannot be captured without storing raw provider bodies, sensitive headers, private operator content, or unrelated operator state
- changes would affect bridge contracts, IPC payload semantics, renderer behavior, provider semantics, or lane meanings

## Required Verification

Run:

```powershell
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:threat-live-api
npm.cmd run verify:http
npm.cmd run verify:threat-intel
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Do not set `AURA_SENSE_LIVE_API=1`.

## Work Record

Pending Dev.

## Handoff Requirements

Create:

```txt
workspace/DevHS41-m12d-live-smoke-request-log-hardening.md
```

The handoff should include:

1. Files changed.
2. Cause of empty M12C `requestLogs`.
3. Chosen request-log behavior for future live smoke artifacts.
4. Passive refusal artifact alignment result.
5. Verification commands and results.
6. Confirmation that no live providers, private folders, manual shortcuts, real SDE, renderer, Lab, adapter, operator gamelog smoke, calibration, or fixture intake work was run.
