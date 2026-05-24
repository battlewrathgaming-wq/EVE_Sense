# DevHS01: Sense Pre-Bridge Hardening

Date: 2026-05-24
Role: Dev
Milestone: 13 - Aggressive Testing And Bug Hunting
Packet: `workspace/current.md`

## Scope

Executed HS01 ordered runway for Sense-local logger-to-bridge hardening, then added bounded offline provider/runtime fault coverage while keeping live/API/manual work gated.

## Completed

- Combat Witness runtime now emits renderer-facing snapshots for watcher status-only transitions, including configure/start/stop/degraded updates, without requiring a new combat event.
- Gamelog watcher tail offsets now advance only after the appended byte range is read successfully.
- Tail-read failure diagnostics expose file/range/status evidence without raw private log text.
- Combat Witness bridge validates the IPC sender before creating a backend service snapshot subscription.
- Invalid subscribe attempts, unsubscribe, and destroyed-sender cleanup are covered.
- Combat Witness renderer primary status now reconciles freshness with operational watcher state so degraded/unavailable watcher truth wins over recent freshness.
- Runtime settings save failures now return a degraded snapshot instead of throwing through the caller.
- Offline provider/runtime tests now cover HTTP timeout, cancel, malformed JSON, 429 retry exhaustion, 500 visibility, Passive ESI stale ETag failure, corrupted settings JSON, schema drift, missing folders, write failure, diagnostic limit enforcement, and redaction.

## Files Changed

- `src/combat/combatWitnessRuntime.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatWitnessBridge.js`
- `src/renderer/app.js`
- `src/runtime/runtimeSettingsService.js`
- `scripts/verify-combat-witness-runtime.js`
- `scripts/verify-combat-witness-bridge.js`
- `scripts/verify-gamelog-watcher-chaos.js`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-http-client.js`
- `scripts/verify-passive-telemetry.js`
- `scripts/verify-runtime-control.js`
- `workspace/current.md`
- `workspace/DevHS01-sense-pre-bridge-hardening.md`

## Verification

```txt
npm.cmd run verify:combat-runtime - passed
npm.cmd run verify:combat-bridge - passed
npm.cmd run verify:gamelog-watcher-chaos - passed
npm.cmd run verify:renderer-shell - passed
npm.cmd run verify:renderer-boundary-adversarial - passed
npm.cmd run verify:http - passed
npm.cmd run verify:passive-telemetry - passed
npm.cmd run verify:threat-intel - passed
npm.cmd run verify:runtime-control - passed
npm.cmd run verify:diagnostics - passed
npm.cmd run verify:all - passed
```

## Findings

- Watcher status-only changes previously updated runtime status but were not observable by Combat Witness bridge subscribers until another combat event emitted a service snapshot.
- Tail offsets previously advanced before the appended range read, so stat/read churn could skip unread bytes.
- Bridge subscribe validated sender after ensuring the backend service subscription, allowing invalid subscribe attempts to leave idle service listeners.
- Renderer Combat Witness state previously used freshness alone for the primary signal/summary path.
- Runtime settings write failures were not normalized into a degraded settings snapshot.

## Deferrals

- Live API smoke was not run; no operator authorization was requested or needed.
- Electron visual smoke was not run because renderer DOM/smoke behavior did not change.
- Manual operator smoke was not run.
- Full local metadata/SDE hardening remains a next-runway candidate.
- Broader bug-hunt triage/failure records remain open for a later packet.

## Next Runway Recommendation

Proceed with local metadata/SDE builder hardening and bug-hunt triage, while optionally expanding provider fault injection for lane-specific service-level traces if Overseer wants more Milestone 13 depth before metadata work.
