# M18 - Provider Fault-Injection Hardening

Status: Active

## Outcome

AURA-Sense has deterministic, fixture-only provider fault-injection verification for Passive Telemetry and Threat Intel provider failure paths.

The goal is to prove backend snapshot semantics under provider faults without live network, Electron, local EVE logs, private operator state, or SDE assets.

## Why This Is Milestone-Sized

Existing provider failure checks are real but distributed across generic HTTP, Passive Telemetry, and Threat Intel verification.

M18 creates one lane-level hardening slice that proves:

- Passive Telemetry provider faults remain distinct from live IO blocked state
- Threat Intel provider faults remain distinct from no scan and successful scans
- malformed provider data cannot masquerade as complete/fresh truth
- stale cache and ETag failure behavior remains visible
- bounded failure code/message metadata survives into backend snapshots

## Likely Runways

- Add `npm.cmd run verify:provider-faults` with fixture-only provider fault injection.
- Wire the new deterministic command into `verify:all`.
- Update the aggressive test harness matrix and current implementation docs.
- Fix only defects revealed by the new verifier, if any, while preserving lane boundaries.

## Acceptance Criteria

M18 is complete when:

- a deterministic `verify:provider-faults` command exists
- the verifier does not call live zKill, ESI, SDE, Electron, clipboard, local EVE logs, or private operator files
- Passive Telemetry and Threat Intel provider failure paths are tested separately
- live IO blocked remains distinct from provider failure
- Passive zKill, Passive ESI, and Threat zKill failure paths preserve bounded failure metadata
- malformed provider responses produce partial/degraded semantics as appropriate and do not become complete/fresh truth
- stale ESI cache and ETag failure behavior remains visible
- the command is included in `verify:all`
- docs/testing and current-state docs record the new deterministic checks

## Non-Goals

- Do not run live provider smoke.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not adopt a Lab face.
- Do not implement adapter work.
- Do not create additional Lab-facing display requests.
- Do not touch renderer behavior unless a defect forces a separately scoped packet.
- Do not collapse Combat Witness, Passive Telemetry, Threat Intel, and Clipboard Acquisition boundaries.
- Do not treat live IO blocked, provider failure, no scan, no observation, stale context, partial sample, or capped sample as interchangeable.

## Dependencies

- `workspace/EngTestHS23-next-scope-review.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`
- `scripts/verify-all.js`
- `scripts/verify-http-client.js`
- `scripts/verify-passive-telemetry.js`
- `scripts/verify-threat-intel.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/services/httpClient.js`

## Verification Shape

Required:

```powershell
npm.cmd run verify:provider-faults
npm.cmd run verify:http
npm.cmd run verify:passive-telemetry
npm.cmd run verify:threat-intel
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

`npm.cmd run smoke:electron` is not required unless renderer-visible or Electron-window behavior changes.
