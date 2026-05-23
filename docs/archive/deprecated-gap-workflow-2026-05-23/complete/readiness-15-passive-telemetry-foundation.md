# Complete: Passive Telemetry Foundation

Status: Complete
Date: 2026-05-22

## Feature Anchors

- `docs/features/vision.md` Element 3: Passive Telemetry
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 8: Local Metadata
- `docs/features/vision.md` Element 9: External API Boundary

## Observation Ownership Decision

Passive Telemetry uses the existing backend-owned gamelog watcher path.

Current route:

```txt
EveGamelogWatcher
-> parseEveLogLine
-> CombatWitnessRuntime normalized event fan-out
   -> CombatWitnessService
   -> PassiveTelemetryService
```

No second hidden watcher was added. Renderer code consumes snapshots only.

## Completed Work

- Added Passive Telemetry backend service.
- Added zKill system-context client and bounded normalization.
- Added Passive Telemetry IPC/preload snapshot bridge.
- Routed navigation jump events from the existing backend runtime into Passive Telemetry.
- Added Passive Telemetry renderer panel separate from Combat Witness.
- Added passive unavailable/fresh/stale/partial/degraded status language.
- Added offline verification for:
  - zKill response normalization
  - malformed response handling
  - navigation/current-system routing
  - cache/freshness behavior
  - unresolved-system degraded state
- Extended renderer shell verification and Electron smoke checks.

## Snapshot Fields

Renderer-facing snapshot:

```txt
kind: passive.telemetry.snapshot
observedAt
currentSystem.label
currentSystem.systemId
currentSystem.eventTime
currentSystem.observedAt
zkill.systemId
zkill.fetchedAt
zkill.sampleCount
zkill.capped
zkill.partial
zkill.failureCount
freshness.status
freshness.cacheAgeMs
freshness.freshnessMs
status
message
failure
```

## zKill Behavior

- Backend-only client.
- Uses existing HTTP helper when live fetch is supplied.
- Tests use injected client/fetch behavior.
- Normalizes refs to `{ killmailId, hash }`.
- Malformed refs become partial/failure metadata.
- Sample is bounded.
- No ESI expansion was added.
- No renderer fetch was added.

## Renderer Copy

- Panel label: `Passive Telemetry`
- Empty system: `Unobserved`
- Offline smoke state: `Unavailable`
- No-context message: `Waiting for a future observed system change.`
- Refreshed context: `Scoped zKill context refreshed.`
- Capped context: `Scoped zKill context is capped.`

## Verification

Executed:

```powershell
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:combat-runtime
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Observed:

```txt
passive telemetry verified
renderer shell verified
renderer boundary verified (4 files scanned)
combat witness runtime verified
core utilities verified
runtime error handling verified
combat parser verified
combat witness bridge verified
combat witness runtime verified
combat witness core verified
diagnostics policy verified
gamelog watcher verified
services verified
HTTP client verified
passive telemetry verified
Frame module verified
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
```

Smoke result summary:

```txt
status: passed
passiveText: Unavailable
signalText: Unavailable
watcherText: Unavailable
```

## Deferred Risks

- No live zKill smoke was run.
- No ESI expansion was added.
- System ID resolution is an interface only; no heavy metadata import was added.
- Passive Telemetry reacts only to future observed navigation events; old log replay remains intentionally blocked.
- Threat Intel search bar and Clipboard Acquisition remain deferred.

## Related Files

- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/zKillSystemContextClient.js`
- `src/combat/combatWitnessRuntime.js`
- `src/main/main.js`
- `src/main/preload.js`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `scripts/verify-passive-telemetry.js`
- `docs/audits/audit-2026-05-22-passive-telemetry-foundation-handover.md`
