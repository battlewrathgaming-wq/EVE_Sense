# OverseerHS40: M12C Threat Live API Smoke

Status: Complete
Date: 2026-05-25
Role: AURA-Sense Overseer

## Purpose

Run the first authorized live provider smoke for AURA-Sense under M12: Threat Intel only, default `system:Jita`, zKill only, one command, standard `.tmp` artifact.

## Authorization

Human explicitly authorized:

```txt
Authorize M12 live API smoke for Threat only now. Set AURA_SENSE_LIVE_API=1 only for the named command invocation, then clear it. Run only npm.cmd run smoke:threat-live-api. Use default Jita target. Do not use AURA_SENSE_THREAT_LIVE_TARGET. Write only the standard .tmp live smoke result artifact. Do not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims. Stop on the documented M12 live API stop conditions and record the stop reason.
```

## Command Run

Run with `AURA_SENSE_LIVE_API=1` scoped to the single command invocation and `AURA_SENSE_THREAT_LIVE_TARGET` removed for the invocation:

```powershell
npm.cmd run smoke:threat-live-api
```

Result:

```txt
AURA-Sense threat live API smoke passed: F:\Projects\AURA-Sense\.tmp\threat-live-api-smoke\result.json
```

Exit code: 0.

After the command, `AURA_SENSE_LIVE_API` and `AURA_SENSE_THREAT_LIVE_TARGET` were checked as unset in the follow-up shell context.

## Artifact

Path:

```txt
.tmp\threat-live-api-smoke\result.json
```

Observed summary:

- `status`: `passed`
- `live_io_enabled`: `true`
- request target: `system:Jita`
- lookback seconds: `3600`
- sample limit: `5`
- snapshot status: `succeeded`
- message: `3 killmails in 1h`
- resolved target kind: `system`
- resolved target label: `Jita`
- resolved target ID: `30000142`
- target source: `local-static`
- gate state: `live-enabled`
- providers: `zkill`
- zKill endpoint family: `systemID`
- discovered count: `3`
- selected count: `3`
- malformed count: `0`
- failed count: `0`
- capped: `false`
- partial: `false`
- selected refs: `3`
- failure: `null`
- request logs: empty array

The artifact contains bounded zKill killmail refs for the selected sample. It does not contain raw provider bodies, request/response headers, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims.

## Stop Conditions

No accepted M12 live API stop condition was hit.

Notes:

- The exact command list did not change.
- `AURA_SENSE_THREAT_LIVE_TARGET` was not used.
- The resolved target was default `system:Jita`.
- The run did not record rate limit, timeout, malformed response, retry exhaustion, 5xx, partial, capped, malformed, or failed sample state.
- The run did not require renderer, bridge, IPC, Lab, adapter, operator gamelog, calibration, fixture intake, SDE refresh, or product-claim work.

## Observation

The live artifact's `requestLogs` array was empty even though the zKill summary succeeded. This is not a stop condition by itself because the provider result summary is present and bounded, but a later hardening pass may want to verify whether the zKill client should emit HTTP request metadata through the shared request-log path during live smoke.

## Boundary Confirmation

- Ran only `npm.cmd run smoke:threat-live-api`.
- Set `AURA_SENSE_LIVE_API=1` only for the named command invocation.
- Cleared `AURA_SENSE_LIVE_API` after the command.
- Did not use `AURA_SENSE_THREAT_LIVE_TARGET`.
- Did not run Passive live API smoke.
- Did not run live ESI calls.
- Did not run live EVE log ingestion.
- Did not inspect private/operator EVE log folders.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not change code or provider semantics.
- Did not change renderer UI, bridge contracts, IPC payload semantics, Lab/adaptor/display work, operator gamelog smoke, Combat calibration, or raw fixture intake.

## Recommended Next State

Return `workspace/current.md` to idle after M12C.

Recommended next M12 options:

- review whether empty `requestLogs` in the successful Threat live artifact needs hardening before Passive live smoke
- align Passive refusal artifacts with Threat refusal fields
- open Passive-only live API smoke after the Threat live artifact is accepted
- later run live operator gamelog smoke, Combat Witness calibration, or raw repair/healing fixture intake under separate packets
