# OverseerHS43: M12E Passive Live API Smoke

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer

## Request Received

Human explicitly authorized a Passive-only M12 live API smoke:

- set `AURA_SENSE_LIVE_API=1` only for the named command invocation
- run only `npm.cmd run smoke:passive-live-api`
- use default script target/settings
- do not set `AURA_SENSE_THREAT_LIVE_TARGET` or any extra live target override
- write only the standard `.tmp` Passive live smoke result artifact
- do not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims
- stop on documented M12 live API stop conditions and record the stop reason

## Command

Executed once:

```powershell
$env:AURA_SENSE_LIVE_API='1'; Remove-Item Env:\AURA_SENSE_THREAT_LIVE_TARGET -ErrorAction SilentlyContinue; npm.cmd run smoke:passive-live-api; $exit=$LASTEXITCODE; Remove-Item Env:\AURA_SENSE_LIVE_API -ErrorAction SilentlyContinue; exit $exit
```

Result:

- exit code: 0
- console result: `AURA-Sense passive live API smoke passed: F:\Projects\AURA-Sense\.tmp\passive-live-api-smoke\result.json`

## Artifact

Reviewed:

```txt
.tmp\passive-live-api-smoke\result.json
```

Artifact summary:

- `status`: `passed`
- `snapshot.status`: `fresh`
- `snapshot.message`: `zKill context sample capped`
- current system: `Jita`
- from system: `Perimeter`
- system ID: `30000142`
- resolver source: `local-static`
- gate state: `live-enabled`
- failure: `null`

Passive activity summary:

- ship kills: 30
- pod kills: 7
- NPC kills: 130
- jumps: 3649
- activity partial: false
- activity failure count: 0
- ESI cache state: `refreshed`
- ESI conditional request: false
- ESI revalidated: false

zKill context summary:

- past seconds: 3600
- sample count: 5
- capped: true
- partial: false
- failure count: 0

Request metadata observed:

- ESI `system_kills` route returned 200
- ESI `system_jumps` route returned 200
- zKill `systemID/30000142/pastSeconds/3600` route returned 200
- retry count was 0 for all three request records

## Environment Cleanup

Checked after the command:

```powershell
Get-ChildItem Env:AURA_SENSE_LIVE_API,Env:AURA_SENSE_THREAT_LIVE_TARGET -ErrorAction SilentlyContinue
```

Result: no matching environment variables were present.

## Boundary Confirmation

- Ran only `npm.cmd run smoke:passive-live-api`.
- Set `AURA_SENSE_LIVE_API=1` only inside the command invocation and cleared it afterward.
- Did not set `AURA_SENSE_THREAT_LIVE_TARGET`.
- Did not use a target override.
- Did not run Threat live smoke.
- Did not run live EVE log ingestion.
- Did not inspect private/operator EVE log folders.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not run renderer, bridge, IPC, Lab, adapter, operator gamelog, calibration, or raw fixture work.
- Did not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims.

## Acceptance

M12E Passive live API smoke is accepted as bounded live evidence.

This proves the Passive live path can resolve the default local Jita context, call the documented ESI and zKill provider routes, summarize activity/context, and write smoke-local request metadata without broadening into private/operator or product-claim territory.

## Residual Risk

The result is a single bounded smoke against current live provider conditions. It does not prove continuous Passive correctness, long-window cache behavior, ESI revalidation, zKill rate-limit behavior, operator gamelog behavior, Combat Witness calibration, or raw repair/healing parser claims.

The zKill context sample was capped at the configured limit of 5, which is expected for the default Jita target and should not be read as complete intelligence.

## Resting State

Return `workspace/current.md` to idle after M12E.

Recommended next M12 options:

- live operator gamelog smoke playbook execution, if the Human wants to validate the operator-machine watcher path
- Combat Witness calibration from accepted real samples
- raw repair/healing fixture intake from accepted samples
- Threat-only default Jita rerun only if another live request-metadata confirmation is useful
