# OverseerHS37: M12A Live API Transition Readiness Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer

## Reviewed

- `workspace/current.md`
- `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
- `docs/testing/live-api-smoke-transition-readiness.md`
- `docs/roadmap/runtime-smoke-policy.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `.tmp/passive-live-api-smoke/result.json`
- `.tmp/threat-live-api-smoke/result.json`

## Acceptance

M12A live API smoke transition readiness is accepted.

The packet moved Sense from simple refusal artifacts to an auditable future live-run map without crossing the live provider boundary.

## Accepted Behavior

- `npm.cmd run smoke:passive-live-api` still refuses by default without `AURA_SENSE_LIVE_API=1`.
- `npm.cmd run smoke:threat-live-api` still refuses by default without `AURA_SENSE_LIVE_API=1`.
- Refusal artifacts are written under `.tmp`.
- Threat refusal records `live_io_enabled: false`, `no_live_call: true`, default target `system:Jita`, lookback `3600`, sample limit `5`, and empty `requestLogs`.
- `docs/testing/live-api-smoke-transition-readiness.md` records the future Passive and Threat live-enabled paths, provider routes, target bounds, artifact classification, minimum authorization wording, and stop conditions.
- Runtime smoke policy, current-state, and the aggressive harness matrix now point to the readiness map while preserving that it is not live execution authorization.

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

- `smoke:passive-live-api`: exited 0 and wrote `.tmp\passive-live-api-smoke\result.json`.
- `smoke:threat-live-api`: exited 0 and wrote `.tmp\threat-live-api-smoke\result.json`.
- Passive refusal artifact recorded `status: refused` and the expected gate reason.
- Threat refusal artifact recorded `status: refused`, `live_io_enabled: false`, `no_live_call: true`, target `system:Jita`, empty `requestLogs`, and the expected artifact path.
- `verify:protected-terms`: exited 0; warning-only findings were reported; no protected-word JSON updates or renames were performed.
- `verify:all`: exited 0; all offline checks verified.
- `git status --short --branch`: showed the expected M12A modified/new files before this acceptance record.

## Boundaries Preserved

- Did not set `AURA_SENSE_LIVE_API=1`.
- Did not run live zKill or ESI calls.
- Did not inspect private/operator EVE log folders.
- Did not run live EVE log ingestion.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not change provider semantics, renderer UI, bridge contracts, IPC payload semantics, Lab/adaptor/display work, operator gamelog smoke, Combat calibration, or raw fixture intake.

## Residual Risk

The future live-enabled Passive and Threat paths are still unproven against current live provider behavior. They require a future Human-authorized M12 packet that explicitly names the lane, command, target scope, artifact rules, and stop conditions.

Protected-term verification remains noisy because existing Sense docs use words such as evidence, watcher, coverage, and readout in historical or command-name contexts. The check is warning-only and did not indicate a required rename for this packet.

## Resting State

Return `workspace/current.md` to idle between M12 slices.

Recommended next M12 options:

- authorized live API execution for Passive and/or Threat using the new readiness map
- live operator gamelog smoke playbook execution
- Combat Witness real-sample calibration
- raw repair/healing fixture intake from accepted samples
