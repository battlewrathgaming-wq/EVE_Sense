# Live API Smoke Transition Readiness

Status: readiness map only - not live execution authorization
Date: 2026-05-25

## Purpose

This note maps the transition from refusal-path live API smoke records to a future authorized live API run.

It does not authorize live provider execution. A live run still requires explicit Human authorization in an active `workspace/current.md` packet and `AURA_SENSE_LIVE_API=1` set only for that run.

## Refusal Records

Current refusal commands:

```powershell
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:threat-live-api
```

When `AURA_SENSE_LIVE_API` is not `1`, these commands write:

- `.tmp\passive-live-api-smoke\result.json`
- `.tmp\threat-live-api-smoke\result.json`

Refusal records prove:

- the command exists and starts
- the default gate refuses live API execution
- the refusal artifact path is writable
- the smoke remains outside `verify:all`
- for Threat Intel, the refusal record explicitly shows `no_live_call: true` and empty `requestLogs`

Refusal records do not prove:

- live zKill or ESI reachability
- provider response shape under current live conditions
- ESI cache/ETag behavior against live responses
- zKill rate-limit behavior
- tactical correctness of returned samples

## Future Passive Live Path

Command:

```powershell
$env:AURA_SENSE_LIVE_API='1'; npm.cmd run smoke:passive-live-api
```

Default smoke input:

- observes a fixture `navigation.jump` from `Perimeter` to `Jita`
- resolves `Jita` through the local system resolver
- expected system ID: `30000142`

Provider routes:

- ESI kills: `https://esi.evetech.net/latest/universe/system_kills/`
- ESI jumps: `https://esi.evetech.net/latest/universe/system_jumps/`
- zKill system context: `https://zkillboard.com/api/systemID/30000142/pastSeconds/3600/`

Bounds and cache behavior:

- HTTP timeout: 10000 ms
- HTTP max attempts: 2
- zKill `pastSeconds`: 3600
- zKill sample limit: 5
- ESI activity cache: 60 minutes in the smoke-local client instance
- ESI conditional headers use `If-None-Match` when a cached ETag exists
- first smoke process normally records a refreshed cache state; revalidation only appears when the same client instance has stale cached data

Artifact:

- `.tmp\passive-live-api-smoke\result.json`

Expected live artifact fields:

- `status`
- `checked_at`
- `output_path`
- `snapshot.status`
- `snapshot.message`
- `snapshot.currentSystem`
- `snapshot.activity`
- `snapshot.zkill`
- `snapshot.gate`
- `snapshot.failure`
- `requestLogs`

Expected request log fields come from the shared HTTP client diagnostics policy and may include:

- `requested_at`
- `provider`
- `endpoint`
- `method`
- `statusCode`
- `durationMs`
- `retryCount`
- `cached`
- `rateLimited`
- `errorMessage`

## Future Threat Live Path

Command:

```powershell
$env:AURA_SENSE_LIVE_API='1'; npm.cmd run smoke:threat-live-api
```

Default and override:

- default target: `system:Jita`
- override: `AURA_SENSE_THREAT_LIVE_TARGET`
- target resolution uses local static metadata before provider calls

Provider route family:

- system targets: `systemID`
- pilot targets: `characterID`
- corporation targets: `corporationID`
- alliance targets: `allianceID`

Default route:

- `https://zkillboard.com/api/systemID/30000142/pastSeconds/3600/`

Bounds:

- HTTP timeout: 10000 ms
- HTTP max attempts: 2
- lookback seconds: 3600
- sample limit: 5
- one backend Threat Intel service scan
- zKill only; no ESI killmail expansion

Artifact:

- `.tmp\threat-live-api-smoke\result.json`

Expected live artifact fields:

- `status`
- `checked_at`
- `live_io_enabled`
- `output_path`
- `request.targetText`
- `request.lookbackSeconds`
- `request.sampleLimit`
- `snapshot.status`
- `snapshot.message`
- `snapshot.target`
- `snapshot.gate`
- `snapshot.zkill`
- `snapshot.failure`
- `requestLogs`

## Artifact Classification

| Artifact or field | Classification | Storage rule |
| --- | --- | --- |
| Refusal records | Default-safe smoke record | May be kept under `.tmp` and summarized in handoffs; not live execution evidence. |
| Live provider request logs | Live provider metadata | May be stored in live smoke artifact when explicitly authorized; keep endpoint, status, retry, timing, cache/rate-limit state; do not add secrets or unrelated operator state. |
| Provider result summaries | Bounded tactical sample summary | May store normalized counts, caps, partial/failure flags, target/system IDs, and killmail refs returned by the smoke; do not promote as complete intelligence. |
| Diagnostics | Sanitized runtime diagnostics | May store sanitized status/failure metadata; avoid raw private payloads. |
| Raw provider response bodies | Live provider payload | Do not store by default; add only if a future packet explicitly authorizes a narrow failure artifact. |
| Private EVE gamelog lines | Private operator content | Must not be stored by live API smoke. |
| Clipboard content | Private operator content | Must not be captured by live API smoke. |
| Machine-specific private paths | Operator environment detail | Do not hardcode or store unless an active operator packet explicitly needs a sanitized path validation record. |

## Minimum Authorization

Minimum future Human decision shape:

```txt
Authorize M12A live API smoke now: set AURA_SENSE_LIVE_API=1 for this run only, run smoke:passive-live-api and/or smoke:threat-live-api, use default Jita target unless I specify another target, write artifacts under .tmp, and stop on the documented stop conditions.
```

If only one lane is authorized, the active packet should name only that command.

## Future Live Run Stop Conditions

Stop the future live run and record the reason if:

- `workspace/current.md` does not explicitly authorize live API smoke
- the Human authorization does not name Passive, Threat, or both
- `AURA_SENSE_LIVE_API=1` would need to remain set beyond the single smoke command
- a command attempts a provider route outside the mapped ESI/zKill routes
- the smoke attempts ESI killmail expansion
- the smoke begins broad polling or multiple target scans
- request logs would include secrets, raw private operator content, clipboard content, or private gamelog lines
- provider rate-limit, timeout, malformed response, or 5xx behavior prevents a clear bounded artifact
- renderer, bridge, IPC, Lab, adapter, operator gamelog, calibration, raw fixture intake, or product-claim work becomes necessary
