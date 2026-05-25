# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: M12B live API security review before authorized execution
Source of intent: Human chose option 1, authorized live API execution as the next direction, but requested a security review first for context
Latest accepted slice: M12A live API smoke transition readiness
Latest accepted closure: `workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md`
Latest Dev handoff: `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
Latest M12 prep acceptance: `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
Latest M12 gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
Current executor: Security / Engineering review
Current status: Open
Expected output: `workspace/SecEngHS38-m12b-live-api-security-review.md`

## Purpose

Review whether Sense is ready to open a future Human-authorized live API smoke run for Passive and/or Threat without weakening live IO, privacy, provider, artifact, or lane boundaries.

This is context and risk review only.

This packet does not authorize live provider execution.

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
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
- `workspace/DevHS34-m12-live-validation-harness-prep.md`
- `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
- `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
- `workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`
- `scripts/smoke-passive-live-api.js`
- `scripts/smoke-threat-live-api.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/services/httpClient.js`

## Runway

1. Review the M12A readiness map and live API smoke scripts without setting `AURA_SENSE_LIVE_API=1`.
2. Trace Passive future live execution from command to providers to artifact:
   - explicit gate
   - routes
   - target/system bounds
   - timeout/retry behavior
   - cache/ETag behavior
   - request log fields
   - artifact shape
3. Trace Threat future live execution from command to provider to artifact:
   - explicit gate
   - route family
   - target override risk
   - lookback/sample bounds
   - request log fields
   - artifact shape
4. Review artifact/privacy classification:
   - refusal records
   - live request logs
   - provider result summaries
   - diagnostics
   - raw provider bodies
   - operator gamelog lines
   - clipboard content
   - machine-specific paths
5. Review authorization wording and determine whether it is precise enough for a future live packet.
6. Review stop conditions and identify any missing security, privacy, provider-health, or scope stop condition.
7. Decide whether the next executable packet should be:
   - Threat-only live API smoke
   - Passive-only live API smoke
   - both lanes in one live API smoke
   - more hardening before live execution
   - pause/escalate for Human decision
8. Identify the minimum pre-live fixes, doc edits, or script hardening required before execution, if any.
9. Run review-safe verification and create the expected security/engineering handoff.

## Acceptance Criteria

The packet is complete when:

- Passive future live path is reviewed for gate, route, target, retry/timeout, cache, request log, and artifact risk
- Threat future live path is reviewed for gate, route, target override, bounds, request log, and artifact risk
- artifact/privacy classification is confirmed or corrected
- authorization wording is accepted or replacement wording is proposed
- stop conditions are accepted or additions are proposed
- the reviewer gives a clear go/no-go recommendation for the next live API packet shape
- any required pre-live hardening is listed as blocker, recommended, or optional
- no `AURA_SENSE_LIVE_API=1` run occurs
- no live zKill or ESI calls occur
- no private/operator folders, live EVE logs, clipboard content, real SDE refresh, renderer, Lab, adapter, Combat calibration, or raw fixture intake work is included

## Guardrails

- Do not set `AURA_SENSE_LIVE_API=1`.
- Do not run live zKill or ESI calls.
- Do not run live EVE log ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not change provider semantics unless the review finds a severe safety bug and the Human authorizes a new implementation packet.
- Do not change renderer UI/face behavior.
- Do not create Lab/adaptor/display work.
- Do not promote live behavior into product claims.
- Do not combine this review with operator gamelog smoke, Combat calibration, or raw fixture intake.

## Stop Conditions

Stop and hand off if:

- future live execution cannot be assessed without running live providers
- artifact classification needs product/privacy direction not present on disk
- the smoke scripts could log raw private content by default
- target override behavior is too broad to safely authorize
- request logging could include secrets or provider payloads beyond metadata
- changes would affect bridge contracts, IPC payload semantics, renderer behavior, or lane meanings

## Required Verification

Run:

```powershell
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:threat-live-api
npm.cmd run verify:protected-terms
git status --short --branch
```

Do not set `AURA_SENSE_LIVE_API=1`.

`npm.cmd run verify:all` is optional for this review-only packet unless the reviewer makes docs/code changes that justify full offline verification.

## Work Record

Pending Security / Engineering review.

## Handoff Requirements

Create:

```txt
workspace/SecEngHS38-m12b-live-api-security-review.md
```

The handoff should include:

1. Files reviewed.
2. Passive live path risk trace.
3. Threat live path risk trace.
4. Artifact/privacy classification findings.
5. Authorization wording review.
6. Stop condition review.
7. Recommended next live API packet shape.
8. Blockers, recommended hardening, and optional improvements.
9. Verification commands and results.
10. Confirmation that no live providers, private folders, manual shortcuts, real SDE, renderer, Lab, adapter, operator gamelog smoke, calibration, or fixture intake work was run.
