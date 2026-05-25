# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: M12A live API smoke transition readiness
Source of intent: Human chose M12 live/manual validation first, then calibration; advisory maturity input included live/manual harness readiness, live API refusal/record scaffolding, privacy/artifact classification, and tactical lane honesty
Latest closed milestone: M12 - Live Validation And Tactical Calibration preparation slice
Latest accepted closure: `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
Latest Dev handoff: `workspace/DevHS34-m12-live-validation-harness-prep.md`
Latest M12 gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
Current executor: Dev
Current status: Open
Expected output: `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`

## Purpose

Prepare M12A to move from refusal-path live API smoke records toward a future authorized live API run, without running live providers in this packet.

This packet should make the transition auditable:

- what would be opened
- which commands would run
- which providers/routes/targets are involved
- where artifacts are written
- what privacy classification applies
- what refusal records prove today
- what exact Human authorization is still required before live execution

This is not the live run.

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
- `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
- `workspace/DevHS34-m12-live-validation-harness-prep.md`
- `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`
- `scripts/smoke-passive-live-api.js`
- `scripts/smoke-threat-live-api.js`
- `src/passive/passiveTelemetryService.js`
- `src/threat/threatIntelService.js`
- `src/services/httpClient.js`

## Runway

1. Review the current Passive and Threat live API smoke commands.
2. Confirm refusal behavior from both commands without setting `AURA_SENSE_LIVE_API`.
3. Inspect the refusal artifacts and summarize what they prove and what they do not prove.
4. Map the future live-enabled path for Passive:
   - command
   - provider routes
   - default system/target
   - lookback/cache/ETag behavior
   - artifact path
   - expected request log fields
5. Map the future live-enabled path for Threat:
   - command
   - target default and override
   - provider route family
   - lookback/sample limit
   - artifact path
   - expected request log fields
6. Classify artifacts:
   - refusal records
   - live provider request logs
   - provider result summaries
   - diagnostics
   - anything that must not be stored
7. Identify the minimum Human authorization phrase/decision needed for a future live run.
8. Identify stop conditions for the future live run.
9. Update docs if the readiness map or artifact classification is missing from durable records.
10. Run required verification and create the expected Dev handoff.

## Acceptance Criteria

The packet is complete when:

- Passive and Threat refusal paths are rerun and recorded
- no `AURA_SENSE_LIVE_API=1` run occurs
- no live zKill or ESI calls occur
- the future live Passive path is mapped clearly enough for a later authorized worker
- the future live Threat path is mapped clearly enough for a later authorized worker
- refusal records are explicitly distinguished from live execution records
- artifact privacy/classification rules are documented
- minimum authorization wording or decision shape is documented for future live execution
- live run stop conditions are documented
- `verify:all` remains offline and passing
- no operator gamelog smoke, Combat calibration, raw fixture intake, renderer, Lab, or adapter work is included

## Guardrails

- Do not set `AURA_SENSE_LIVE_API=1`.
- Do not run live zKill or ESI calls.
- Do not run live EVE log ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not change provider semantics unless a refusal/readiness bug blocks the packet.
- Do not change renderer UI/face behavior.
- Do not create Lab/adaptor/display work.
- Do not promote live behavior into product claims.
- Do not combine M12A with operator gamelog smoke or combat metric calibration.

## Stop Conditions

Stop and hand off if:

- future live execution cannot be mapped without running it
- artifact classification needs product/privacy direction not present on disk
- a smoke command's refusal path attempts a network call
- a smoke artifact would contain sensitive provider or operator material by default
- changes would affect bridge contracts, IPC payload semantics, renderer behavior, or lane meanings

## Required Verification

Run:

```powershell
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:threat-live-api
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
workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md
```

The handoff should include:

1. Files changed.
2. Refusal command outputs and artifact paths.
3. Future Passive live-enabled path map.
4. Future Threat live-enabled path map.
5. Artifact privacy/classification table.
6. Minimum Human authorization needed for future live execution.
7. Stop conditions for future live execution.
8. Verification commands and results.
9. Confirmation that no live providers, private folders, manual shortcuts, real SDE, renderer, Lab, adapter, operator gamelog smoke, calibration, or fixture intake work was run.
