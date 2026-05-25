# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M18 - Provider Fault-Injection Hardening
Roadmap source: `docs/roadmap/milestone-18-provider-fault-injection-hardening.md`
Current runway: Deterministic provider fault-injection verifier for Passive Telemetry and Threat Intel
Latest closed milestone: Milestone 17 - Render and Frame performance assurance
Latest accepted closure: `workspace/OverseerHS22-m17-frame-window-smoke-hardening-acceptance.md`
Latest scope review: `workspace/EngTestHS23-next-scope-review.md`
Latest Overseer acceptance: `workspace/OverseerHS24-next-scope-review-acceptance.md`
Current executor: Dev
Current status: Open
Expected output: `workspace/DevHS25-provider-fault-injection-hardening.md`

## Purpose

Implement the accepted HS23/HS24 deterministic provider fault-injection hardening packet.

The goal is to add one fixture-only verifier that proves Passive Telemetry and Threat Intel provider failure paths remain visible, lane-specific, and distinct from live IO blocked, no scan, no observation, stale context, partial sample, capped sample, degraded, and failed states.

This packet is backend/test hardening only. Lab-facing presentation work remains parked.

## Required Reading

Boot and coordination:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/prompts.md`
- `workspace/overseer.md`

M18 direction:

- `docs/roadmap/README.md`
- `docs/roadmap/milestone-18-provider-fault-injection-hardening.md`
- `workspace/EngTestHS23-next-scope-review.md`
- `workspace/OverseerHS24-next-scope-review-acceptance.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`

Implementation surfaces:

- `scripts/verify-all.js`
- `scripts/verify-http-client.js`
- `scripts/verify-passive-telemetry.js`
- `scripts/verify-threat-intel.js`
- `src/services/httpClient.js`
- `src/passive/liveIoGate.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`

## Runway

1. Review HS23 and HS24 to confirm the narrow implementation target.
2. Add a fixture-only `scripts/verify-provider-fault-injection.js`.
3. Add `npm.cmd run verify:provider-faults` to `package.json`.
4. Include the new deterministic verifier in `scripts/verify-all.js`.
5. Cover the minimum useful cases from HS23:
   - Passive zKill injected timeout/error becomes `degraded` with failure metadata.
   - Passive ESI injected failure becomes `degraded` with failure metadata.
   - Passive malformed provider data becomes `partial` or degraded as appropriate, not fresh/complete.
   - Passive stale cache / ETag revalidation failure remains visible.
   - Threat zKill timeout/429/500/invalid JSON becomes failed with bounded failure metadata.
   - Threat malformed provider data becomes partial, not succeeded.
   - Live IO blocked remains distinct and does not call providers.
6. Use injected fakes, deterministic clocks, fixed fetched-at values, and backend snapshot assertions only.
7. Update `docs/testing/aggressive-test-harness-matrix.md`.
8. Update `docs/current-state/current-implementation.md`.
9. Run required verification.
10. Create the expected Dev handoff.

## Acceptance Criteria

The packet is complete when:

- `npm.cmd run verify:provider-faults` exists and passes
- the verifier is deterministic and fixture-only
- Passive Telemetry and Threat Intel provider failures are tested separately
- live IO blocked remains distinct from provider failure
- Passive zKill, Passive ESI, and Threat zKill failure paths preserve bounded failure code/message metadata
- malformed provider responses produce partial/degraded semantics as appropriate and do not become complete/fresh truth
- stale ESI cache and ETag failure behavior remains visible
- `verify:provider-faults` is included in `verify:all`
- docs/testing and current-state docs reflect the new deterministic checks
- no live provider smoke, manual shortcut validation, real SDE refresh/download, Lab face, adapter, renderer, or display request work is included

## Guardrails

- Do not run live provider smoke.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not adopt a Lab face.
- Do not implement adapter work.
- Do not create additional Lab-facing display requests.
- Do not touch renderer behavior unless a defect forces a separate scoped packet.
- Do not change IPC, payload schemas, service semantics, lane meanings, UI copy, or provider runtime behavior unless the new verifier exposes a real bug and the fix remains inside this packet.
- Do not collapse Combat Witness, Passive Telemetry, Threat Intel, and Clipboard Acquisition boundaries.
- Do not treat live IO blocked, provider failure, no scan, no observation, stale context, partial sample, capped sample, degraded, or failed states as interchangeable.

## Stop Conditions

Stop and hand off if:

- the verifier requires live network, Electron, clipboard, local EVE logs, private operator state, or SDE assets
- the implementation would need renderer or Lab changes
- the verifier reveals a semantic defect that cannot be fixed without changing contracts or lane meanings
- provider failure semantics are ambiguous and need Human/Overseer direction

## Required Verification

Run:

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

## Handoff Requirements

Create:

```txt
workspace/DevHS25-provider-fault-injection-hardening.md
```

The handoff should include:

1. Files changed.
2. Provider fault cases covered.
3. Any implementation defects fixed.
4. Verification commands and results.
5. Confirmation that no live/manual/SDE/Lab/renderer work was included.
6. Residual risks or follow-up recommendations.

## Overseer Review

Pending. This packet is open for Dev.
