# DevHS36: M12A Live API Smoke Transition Readiness

Status: Complete
Date: 2026-05-25
Role: AURA-Sense Dev

## Summary

Prepared the M12A transition map from refusal-path live API smoke records toward a future authorized live API run.

No live provider run was performed. `AURA_SENSE_LIVE_API=1` was not set.

## Files Changed

- `docs/testing/live-api-smoke-transition-readiness.md`
- `docs/roadmap/runtime-smoke-policy.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `workspace/current.md`
- `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`

No service/provider semantics changed.

## Refusal Commands

Run without setting `AURA_SENSE_LIVE_API=1`:

```powershell
npm.cmd run smoke:passive-live-api
```

Output:

```txt
AURA-Sense passive live API smoke refused: F:\Projects\AURA-Sense\.tmp\passive-live-api-smoke\result.json
```

Artifact:

```txt
.tmp\passive-live-api-smoke\result.json
```

Observed fields:

```json
{
  "status": "refused",
  "reason": "Set AURA_SENSE_LIVE_API=1 to run live Passive Telemetry API smoke"
}
```

```powershell
npm.cmd run smoke:threat-live-api
```

Output:

```txt
AURA-Sense threat live API smoke refused: F:\Projects\AURA-Sense\.tmp\threat-live-api-smoke\result.json
```

Artifact:

```txt
.tmp\threat-live-api-smoke\result.json
```

Observed fields:

```json
{
  "status": "refused",
  "reason": "Set AURA_SENSE_LIVE_API=1 to run live Threat Intel API smoke",
  "live_io_enabled": false,
  "no_live_call": true,
  "requestLogs": []
}
```

## What Refusal Proves

- The smoke commands exist and start.
- Default live API execution is blocked unless `AURA_SENSE_LIVE_API=1`.
- Refusal artifacts are writable under `.tmp`.
- Threat refusal explicitly records no live call and empty request logs.
- The commands remain outside `verify:all`.

## What Refusal Does Not Prove

- Live zKill or ESI reachability.
- Current live provider response shape.
- ESI cache/ETag behavior against live responses.
- zKill rate-limit behavior.
- Tactical correctness of returned live samples.

## Future Passive Live-Enabled Path

Command:

```powershell
$env:AURA_SENSE_LIVE_API='1'; npm.cmd run smoke:passive-live-api
```

Mapped path:

- smoke observes fixture `navigation.jump` from `Perimeter` to `Jita`
- local resolver resolves `Jita` to system ID `30000142`
- `PassiveTelemetryService.observeEvent()` calls `refresh({ reason: 'system-change' })`
- live gate is enabled in the smoke-local service
- `PassiveEsiSystemActivityClient` calls:
  - `https://esi.evetech.net/latest/universe/system_kills/`
  - `https://esi.evetech.net/latest/universe/system_jumps/`
- `ZKillSystemContextClient` calls:
  - `https://zkillboard.com/api/systemID/30000142/pastSeconds/3600/`

Bounds and artifact:

- HTTP timeout: 10000 ms
- HTTP max attempts: 2
- zKill lookback: 3600 seconds
- zKill sample limit: 5
- ESI cache: 60 minutes in the smoke-local client
- ESI ETag revalidation uses `If-None-Match` only when cached ETag exists in the same client instance
- artifact: `.tmp\passive-live-api-smoke\result.json`
- expected request log fields: `requested_at`, `provider`, `endpoint`, `method`, `statusCode`, `durationMs`, `retryCount`, `cached`, `rateLimited`, `errorMessage`

## Future Threat Live-Enabled Path

Command:

```powershell
$env:AURA_SENSE_LIVE_API='1'; npm.cmd run smoke:threat-live-api
```

Mapped path:

- default target is `system:Jita`
- override target is `AURA_SENSE_THREAT_LIVE_TARGET`
- local static resolver resolves supported system/pilot/corporation/alliance targets
- live gate is enabled in the smoke-local service
- `ThreatIntelService.scan()` runs one backend scan
- `ThreatIntelZkillClient` calls zKill only; no ESI killmail expansion

Route families:

- system -> `systemID`
- pilot -> `characterID`
- corporation -> `corporationID`
- alliance -> `allianceID`

Default route:

```txt
https://zkillboard.com/api/systemID/30000142/pastSeconds/3600/
```

Bounds and artifact:

- HTTP timeout: 10000 ms
- HTTP max attempts: 2
- lookback: 3600 seconds
- sample limit: 5
- artifact: `.tmp\threat-live-api-smoke\result.json`
- expected request log fields: `requested_at`, `provider`, `endpoint`, `method`, `statusCode`, `durationMs`, `retryCount`, `cached`, `rateLimited`, `errorMessage`

## Artifact Classification

| Artifact or field | Classification | Storage rule |
| --- | --- | --- |
| Refusal records | Default-safe smoke record | May be kept under `.tmp` and summarized in handoffs; not live execution evidence. |
| Live provider request logs | Live provider metadata | Store only under explicit live authorization; keep endpoint/status/retry/timing/cache/rate-limit state. |
| Provider result summaries | Bounded tactical sample summary | Store normalized counts, caps, partial/failure flags, target/system IDs, and killmail refs; do not treat as complete intelligence. |
| Diagnostics | Sanitized runtime diagnostics | Store sanitized status/failure metadata only. |
| Raw provider response bodies | Live provider payload | Do not store by default. |
| Private EVE gamelog lines | Private operator content | Must not be stored by live API smoke. |
| Clipboard content | Private operator content | Must not be captured by live API smoke. |
| Machine-specific private paths | Operator environment detail | Do not hardcode or store unless a future operator packet explicitly authorizes a sanitized path record. |

## Minimum Human Authorization

Suggested minimum decision shape for a future live run:

```txt
Authorize M12A live API smoke now: set AURA_SENSE_LIVE_API=1 for this run only, run smoke:passive-live-api and/or smoke:threat-live-api, use default Jita target unless I specify another target, write artifacts under .tmp, and stop on the documented stop conditions.
```

If only one lane is authorized, the active packet should name only that command.

## Future Live Stop Conditions

Stop and record the reason if:

- `workspace/current.md` does not explicitly authorize live API smoke
- Human authorization does not name Passive, Threat, or both
- `AURA_SENSE_LIVE_API=1` would need to remain set beyond the single smoke command
- a command attempts provider routes outside the mapped ESI/zKill routes
- the smoke attempts ESI killmail expansion
- the smoke begins broad polling or multiple target scans
- request logs would include secrets, raw private operator content, clipboard content, or private gamelog lines
- provider rate-limit, timeout, malformed response, or 5xx behavior prevents a bounded artifact
- renderer, bridge, IPC, Lab, adapter, operator gamelog, calibration, raw fixture intake, or product-claim work becomes necessary

## Verification

Run without setting `AURA_SENSE_LIVE_API=1`:

```powershell
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:threat-live-api
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Results:

- `smoke:passive-live-api`: exited 0; refused and wrote `.tmp\passive-live-api-smoke\result.json`.
- `smoke:threat-live-api`: exited 0; refused and wrote `.tmp\threat-live-api-smoke\result.json`.
- `verify:protected-terms`: exited 0 in working-set mode; warning-only protected-term findings reported; no protected-word JSON updates or renames performed.
- `verify:all`: exited 0; all offline checks verified.
- `git status --short --branch`: showed branch `main...origin/main [ahead 2]` with expected M12A changed/new files.

## Boundary Confirmation

- Did not set `AURA_SENSE_LIVE_API=1`.
- Did not run live zKill or ESI calls.
- Did not inspect private/operator EVE log folders.
- Did not run live EVE log ingestion.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not change renderer UI/face behavior.
- Did not create Lab/adaptor/display work.
- Did not run operator gamelog smoke.
- Did not perform Combat Witness calibration.
- Did not perform raw fixture intake.
