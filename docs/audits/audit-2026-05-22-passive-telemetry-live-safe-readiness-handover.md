# Audit: Passive Telemetry Live-Safe Readiness Handover

Date: 2026-05-22
Scope: Milestone 08, Passive Telemetry live-safe readiness.

## Readiness Verdict

Ready with live smoke caveat.

Passive Telemetry now resolves known current systems locally, gates live API work, fetches scoped zKill context, fetches ESI aggregate system activity through a one-hour cache with ETag revalidation behavior, exposes request/freshness metadata in snapshots, and presents compact activity state in the HUD.

Live zKill/ESI smoke was not run. The new live smoke command refuses safely unless `AURA_SENSE_LIVE_API=1` is set.

## Feature Anchors

- `docs/features/vision.md` Element 3: Passive Telemetry
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 8: Local Metadata
- `docs/features/vision.md` Element 9: External API Boundary
- `docs/roadmap/passive-telemetry-live-readiness-interlock.md`

## Resolver

Resolver source:

```txt
fixtures/passive-system-resolver.json
src/passive/localSystemResolver.js
```

Behavior:

- exact-name local/static resolution
- no live ESI lookup for identity
- unresolved systems become degraded with `PASSIVE_SYSTEM_UNRESOLVED`

Current fixture systems:

- Jita
- Perimeter
- Faurent
- Iyen-Oursta

## zKill Route

Passive zKill now uses:

```txt
/systemID/{systemId}/pastSeconds/{seconds}/
```

Default lookback:

```txt
3600 seconds
```

Snapshot metadata includes `zkill.pastSeconds`, `sampleCount`, `capped`, `partial`, and `failureCount`.

## ESI Activity

Client:

```txt
src/passive/esiSystemActivityClient.js
```

Endpoints:

```txt
/universe/system_kills/
/universe/system_jumps/
```

Snapshot fields:

- `activity.shipKills`
- `activity.podKills`
- `activity.npcKills`
- `activity.jumps`
- `activity.cache.cacheMs`
- `activity.cache.cacheAgeMs`
- `activity.cache.state`
- `activity.cache.etag`
- `activity.cache.conditional`
- `activity.cache.revalidated`

Cache behavior:

- reads fresh one-hour activity records locally
- after expiry, revalidates with `If-None-Match` when an ETag exists
- does not expand killmails
- does not persist long-term history

## Live IO Gate

Gate:

```txt
src/passive/liveIoGate.js
```

Default posture in main:

```txt
live-disabled
```

Blocked behavior:

- returns `status: blocked`
- sets failure code `PASSIVE_LIVE_IO_BLOCKED`
- does not call zKill or ESI clients

Service commands:

- `passive.telemetry.live-io.status`
- `passive.telemetry.live-io.set-enabled`

## Request Diagnostics

Passive zKill and ESI clients are wired through `HttpClient` request logs in main. The service also emits traces for blocked, unresolved, refreshed, cached/revalidated ESI activity checks, and fetch failures.

No raw API payloads are exposed to the renderer.

## Renderer

Passive Telemetry HUD now includes:

```txt
Current system
zKill sample
Activity
Freshness
```

Activity copy is compact:

```txt
shipKills / jumps
```

Renderer remains presentation-only.

## Live Smoke

Command:

```powershell
npm.cmd run smoke:passive-live-api
```

Refusal artifact:

```txt
F:\Projects\AURA-Sense\.tmp\passive-live-api-smoke\result.json
status: refused
reason: Set AURA_SENSE_LIVE_API=1 to run live Passive Telemetry API smoke
checked_at: 2026-05-22T20:47:06.704Z
```

Live run requires:

```powershell
$env:AURA_SENSE_LIVE_API='1'; npm.cmd run smoke:passive-live-api
```

That live run was not performed in this handover.

Electron visual smoke:

```txt
F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
status: passed
checked_at: 2026-05-22T20:47:14.005Z
```

## Verification

Executed:

```powershell
npm.cmd run verify:passive-telemetry
npm.cmd run verify:http
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:all
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:electron
```

Observed:

```txt
passive telemetry verified
HTTP client verified
renderer shell verified
renderer boundary verified (4 files scanned)
all checks verified
AURA-Sense passive live API smoke refused: F:\Projects\AURA-Sense\.tmp\passive-live-api-smoke\result.json
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
```

## Deferrals Preserved

- live zKill/ESI smoke with `AURA_SENSE_LIVE_API=1`
- Threat Intel search
- Clipboard Acquisition
- ESI killmail expansion
- Atlas persistence/evidence stores
- broad polling
- renderer network calls
