# OverseerHS35: M12 Live Validation Harness Prep Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer

## Reviewed

- `workspace/current.md`
- `workspace/DevHS34-m12-live-validation-harness-prep.md`
- `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
- `scripts/smoke-threat-live-api.js`
- `scripts/smoke-passive-live-api.js`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/roadmap/runtime-smoke-policy.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`

## Acceptance

The M12 live validation harness preparation runway is accepted.

The packet added a Threat Intel refusal-first live API smoke command, documented live operator gamelog smoke as a scaffold only, and updated the relevant docs so future M12 execution can distinguish refusal-path records from authorized live/manual run records.

No live/manual/private boundary was crossed.

## Accepted Behavior

- `npm.cmd run smoke:threat-live-api` exists.
- The command refuses by default unless `AURA_SENSE_LIVE_API=1`.
- Default refusal writes `.tmp\threat-live-api-smoke\result.json`.
- The refusal artifact records `live_io_enabled: false`, `no_live_call: true`, target shape, and empty request logs.
- Future enabled behavior is scoped to one deliberate target, bounded lookback/sample, backend Threat Intel service, zKill-only provider route, and artifact output.
- The command remains outside `verify:all`.
- `docs/testing/live-operator-gamelog-smoke-playbook.md` exists as a scaffold and explicitly does not authorize execution by itself.

## Verification

Overseer reran on 2026-05-25 without setting `AURA_SENSE_LIVE_API=1`:

```powershell
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:threat-live-api
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Results:

- `smoke:passive-live-api`: exited 0 and wrote refusal artifact.
- `smoke:threat-live-api`: exited 0 and wrote refusal artifact.
- `verify:protected-terms`: exited 0 with clean working tree, no files scanned, no advisory findings, no renames, and no protected-word JSON updates.
- `verify:all`: passed, `all checks verified`.
- `git status --short --branch`: clean and synced before acceptance edits.

Refusal artifacts observed:

- `.tmp\passive-live-api-smoke\result.json`
- `.tmp\threat-live-api-smoke\result.json`

The Threat artifact recorded `no_live_call: true` and empty `requestLogs`.

## Boundaries Preserved

- Did not set `AURA_SENSE_LIVE_API=1`.
- Did not run live zKill or ESI calls.
- Did not inspect private/operator EVE log folders.
- Did not run live EVE log ingestion.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not change renderer UI/face behavior.
- Did not change Lab, adapter, display, bridge contract, or IPC payload semantics.

## Residual Risk

The live-enabled branches are intentionally unproven until a future Human-authorized M12 live/manual packet.

The operator gamelog playbook is a scaffold. It still needs a future active packet to name exact operator assumptions, artifact destination, stop conditions, and authorization before execution.

## Resting State

Return `workspace/current.md` to idle.

Recommended future M12 options:

- refusal-to-live API transition packet for Passive and/or Threat
- live operator gamelog smoke playbook execution packet
- Combat metric calibration with accepted real-data fixtures
- raw repair/healing fixture intake with exact accepted samples
