# OverseerHS33: M12 Live Validation Gate Trace

Status: Advisory trace, no live/manual work opened
Date: 2026-05-25
Role: AURA-Sense Overseer

## Purpose

Trace how M12 live/manual validation is currently hooked without running live EVE logs, live providers, private folders, manual shortcut validation, or operator-machine smoke.

This is documentation only. It does not open M12, does not authorize Dev work, and does not change runtime behavior.

## Files Reviewed

- `workspace/current.md`
- `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
- `docs/roadmap/runtime-smoke-policy.md`
- `package.json`
- `scripts/smoke-passive-live-api.js`
- `src/passive/liveIoGate.js`
- `src/passive/passiveTelemetryService.js`
- `src/threat/threatIntelService.js`
- `src/main/main.js`
- `src/main/preload.js`
- `src/passive/passiveTelemetryBridge.js`
- `scripts/verify-runtime-control.js`

## Current Gate Shape

M12 is currently a future candidate, not active work.

The gate is hooked in four layers:

1. Roadmap gate:
   - `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md` says M12 must be explicitly opened before live, manual, private-folder, or operator-environment work runs.
   - `workspace/current.md` is idle and does not open M12.

2. Runtime smoke policy:
   - `docs/roadmap/runtime-smoke-policy.md` keeps `verify:all` offline.
   - Live API smoke is explicit and opt-in.
   - Live operator smoke belongs to a future M12/operator-validation packet.

3. Environment gate:
   - `scripts/smoke-passive-live-api.js` refuses unless `AURA_SENSE_LIVE_API=1`.
   - The refusal writes `.tmp/passive-live-api-smoke/result.json` and exits without live provider calls.

4. Backend live IO gate:
   - `createLiveIoGate()` defaults to disabled.
   - `src/main/main.js` creates separate Passive and Threat live IO gates.
   - `runtime.live-io.set-enabled` toggles Passive, Threat, or both gates.
   - Passive and Threat services check their gates before provider calls.

## Hook Trace

### Offline Verification

```txt
npm.cmd run verify:all
-> scripts/verify-all.js
-> offline deterministic checks only
-> no Electron, local EVE logs, live network, or private operator state
```

This remains the default safety baseline.

### Passive Live API Smoke

```txt
npm.cmd run smoke:passive-live-api
-> scripts/smoke-passive-live-api.js
-> if AURA_SENSE_LIVE_API !== 1: refused result artifact
-> if AURA_SENSE_LIVE_API === 1:
   create PassiveTelemetryService with liveIoGate enabled
   observe fixture Jita navigation.jump
   fetch ESI activity and zKill context through HttpClient
   write .tmp/passive-live-api-smoke/result.json
```

The live smoke path is explicit and script-local. It does not change the app's default runtime gate state.

### App Runtime Live IO

```txt
renderer IO button
-> window.aura.invokeService('runtime.live-io.set-enabled')
-> service registry
-> setLiveIoPolicy()
-> passiveTelemetryService.setLiveIoEnabled()
-> threatIntelService.setLiveIoEnabled()
```

The renderer can request a gate change through the allowed service command, but the gate remains backend-owned.

### Passive Provider Calls

```txt
Combat log navigation.jump
-> Combat Witness runtime observers
-> passiveTelemetryService.observeEvent()
-> passiveTelemetryService.refresh({ reason: 'system-change' })
-> resolve local system ID
-> liveIoGate.check({ providers: ['esi', 'zkill'] })
-> blocked snapshot if disabled
-> ESI/zKill clients only if enabled
```

Blocked Passive state preserves `PASSIVE_LIVE_IO_BLOCKED` and should not be treated as provider failure.

### Threat Provider Calls

```txt
manual target or Clipboard Acquisition scan
-> threatIntelService.scan()
-> resolve target
-> liveIoGate.check({ providers: ['zkill'] })
-> blocked snapshot if disabled
-> zKill target probe only if enabled
```

Blocked Threat state preserves `THREAT_LIVE_IO_BLOCKED` and should not be treated as no scan or provider failure.

### Live Operator Gamelog Smoke

```txt
future M12 packet only
-> real operator EVE Gamelogs folder
-> configured through existing gamelog validator
-> watcher start
-> future append behavior only
-> Combat Witness and Passive observer behavior
-> recorded audit artifact without broad private log retention
```

No current command runs this. M19 made the path safer, but did not authorize live folder inspection.

## Current Coverage

Already deterministic:

- live IO disabled state blocks Passive ESI/zKill and Threat zKill
- provider faults stay distinct from live IO blocked state
- runtime settings validate gamelog folder structure
- watcher containment blocks outside active folder reads
- `smoke:passive-live-api` records a refusal artifact when not explicitly enabled

Not yet hooked as live/manual evidence:

- live operator gamelog smoke playbook
- live Threat Intel provider smoke command
- manual shortcut validation
- real dataset combat metric calibration
- exact raw repair/healing fixture intake from accepted samples

## Recommendation

Keep M12 closed until Human explicitly opens a live/manual packet.

If opened, first slice should be a review/playbook packet, not direct live execution:

1. Write a live operator smoke playbook.
2. Confirm artifact paths and privacy limits.
3. Confirm exact commands and stop conditions.
4. Run refusal-path evidence first.
5. Only then run live/manual checks with explicit Human authorization.

## Verification

Run for this trace-only update:

```powershell
npm.cmd run verify:protected-terms
git status --short --branch
```

Result:

- `verify:protected-terms` exited 0 in working-set mode.
- It reported warning-only items around existing M12 live-smoke/evidence wording, file-monitor terminology, and blocked/failed/no-scan distinctions.
- No protected-word JSON files were changed.
- No renames were performed.

`verify:all` was not rerun because this pass is documentation-only and does not change code behavior.
