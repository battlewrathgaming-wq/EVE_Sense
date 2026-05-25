# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: Live validation harness preparation
Source of intent: Human accepted the M12 gate trace and asked whether Dev should inspect the gap before live validation
Latest closed milestone: Milestone 19 - Gamelog Ingest Containment And Fan-Out Assurance
Latest accepted closure: `workspace/OverseerHS31-m19-gamelog-containment-hardening-acceptance.md`
Latest M12 gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
Current executor: Dev
Current status: Open
Expected output: `workspace/DevHS34-m12-live-validation-harness-prep.md`

## Purpose

Prepare the M12 live/manual validation airlock without crossing the live/manual boundary.

The goal is to give future operator validation a safe harness shape:

- Passive already has `smoke:passive-live-api`
- Threat Intel needs a matching refusal-first live smoke command
- live operator gamelog smoke needs a playbook/scaffold before any operator-machine run
- all live/manual/private actions remain gated until explicitly opened later

This packet must not run live providers, inspect private EVE logs, validate manual shortcuts, or touch operator folders.

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
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`

Implementation surfaces likely needed:

- `scripts/smoke-passive-live-api.js`
- `src/passive/liveIoGate.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/threat/threatIntelTargetResolver.js`
- `src/services/httpClient.js`
- `src/main/main.js`
- `src/main/preload.js`
- `scripts/verify-provider-fault-injection.js`

## Runway

1. Review the M12 gate trace and existing Passive live smoke refusal path.
2. Add a Threat Intel live smoke command that refuses unless `AURA_SENSE_LIVE_API=1`.
3. Ensure the Threat live smoke refusal path writes a deterministic artifact under `.tmp`, similar to Passive.
4. If `AURA_SENSE_LIVE_API=1` is set in a future authorized run, the command should be scoped and respectful: one deliberate target, bounded lookback/sample, backend Threat Intel service, request logs, and artifact output.
5. Add a live operator gamelog smoke playbook/scaffold in docs, with privacy rules, artifact expectations, stop conditions, and explicit Human authorization requirements.
6. Update `package.json` with the new smoke command.
7. Update runtime smoke policy and current-state/testing docs as needed so the refusal-first harness is discoverable.
8. Run refusal-path smoke only, without setting `AURA_SENSE_LIVE_API`.
9. Run required verification.
10. Create the expected Dev handoff.

## Acceptance Criteria

The packet is complete when:

- `npm.cmd run smoke:threat-live-api` or equivalent exists
- the new Threat live smoke command refuses by default when `AURA_SENSE_LIVE_API` is not `1`
- the refusal path writes a deterministic artifact under `.tmp`
- the command is outside `verify:all`
- future enabled behavior is scoped to a single deliberate Threat Intel target and bounded provider query
- no live network call occurs during this packet
- no operator/private EVE log folder is inspected
- no manual shortcut validation is run
- a live operator gamelog smoke playbook/scaffold exists and does not authorize execution by itself
- docs clearly separate refusal-path records from live execution records
- `verify:all` remains offline and passing

## Guardrails

- Do not set `AURA_SENSE_LIVE_API=1`.
- Do not run live zKill or ESI calls.
- Do not run live EVE log ingestion.
- Do not inspect `C:\Users\Battle_wrath\Documents\EVE\logs\Gamelogs` or any private/operator gamelog folder.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not change provider semantics except what is required for a smoke harness.
- Do not add ESI killmail expansion.
- Do not add Atlas persistence, report storage, watch semantics, or Atlas-owned Evidence semantics.
- Do not change renderer UI/face behavior.
- Do not create Lab/adaptor/display work.
- Do not promote live behavior into product claims.

## Stop Conditions

Stop and hand off if:

- live provider execution appears necessary to implement the refusal path
- a playbook needs private operator paths or real sample content
- Threat live smoke needs product direction for target choice beyond a safe documented placeholder/default
- changes would affect bridge contracts, IPC payload semantics, or renderer behavior
- `verify:all` would need live network, Electron, private logs, or operator state

## Required Verification

Run:

```powershell
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:threat-live-api
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Do not set `AURA_SENSE_LIVE_API=1`. Both live smoke commands should record refusal/default-safe artifacts.

## Evidence

Dev completed the M12 live validation harness prep without crossing the live/manual boundary.

Files changed:

- `scripts/smoke-threat-live-api.js`
- `package.json`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/roadmap/runtime-smoke-policy.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `workspace/DevHS34-m12-live-validation-harness-prep.md`
- `workspace/current.md`

Threat live API smoke:

- Added `npm.cmd run smoke:threat-live-api`.
- Refuses by default unless `AURA_SENSE_LIVE_API=1`.
- Refusal artifact path: `.tmp\threat-live-api-smoke\result.json`.
- Refusal artifact records `status: refused`, `live_io_enabled: false`, `no_live_call: true`, and empty `requestLogs`.
- Future enabled behavior is limited to one deliberate target (`AURA_SENSE_THREAT_LIVE_TARGET` or default `system:Jita`), 3600 second lookback, 5 ref sample limit, backend Threat Intel service, zKill request logs, and artifact output.
- Command remains outside `verify:all`.

Passive refusal artifact:

- `npm.cmd run smoke:passive-live-api` wrote `.tmp\passive-live-api-smoke\result.json`.

Live operator gamelog scaffold:

- Added `docs/testing/live-operator-gamelog-smoke-playbook.md`.
- The scaffold includes authorization gate, privacy rules, artifact expectations, stop conditions, and non-goals.
- The scaffold explicitly does not authorize execution by itself.

Verification run without setting `AURA_SENSE_LIVE_API=1`:

```powershell
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:threat-live-api
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Results:

- `smoke:passive-live-api` exited 0; refused and wrote `.tmp\passive-live-api-smoke\result.json`.
- `smoke:threat-live-api` exited 0; refused and wrote `.tmp\threat-live-api-smoke\result.json`.
- `verify:protected-terms` exited 0 in working-set mode; warning-only protected-term findings reported; no protected-word JSON updates or renames performed.
- `verify:all` exited 0; all offline checks verified.
- Initial post-verification `git status --short --branch` showed the expected modified/new files for this packet.

Boundary confirmation:

- Did not set `AURA_SENSE_LIVE_API=1`.
- Did not run live zKill or ESI calls.
- Did not inspect `C:\Users\Battle_wrath\Documents\EVE\logs\Gamelogs` or any private/operator gamelog folder.
- Did not run live EVE log ingestion.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not change renderer UI/face behavior, Lab/adaptor/display work, bridge contracts, or IPC payload semantics.

## Handoff Requirements

Create:

```txt
workspace/DevHS34-m12-live-validation-harness-prep.md
```

The handoff should include:

1. Files changed.
2. New Threat live smoke command and default refusal behavior.
3. Artifact paths written by refusal-path smoke.
4. Live operator gamelog playbook/scaffold path.
5. Verification commands and results.
6. Confirmation that no live providers, private folders, manual shortcuts, real SDE, renderer, Lab, or adapter work was run.
7. Residual risks and next recommended M12 packet.

Dev handoff created:

```txt
workspace/DevHS34-m12-live-validation-harness-prep.md
```
