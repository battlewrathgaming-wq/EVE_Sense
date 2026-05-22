# Audit: Post Threat Intel And Combat Metrics Overseer Review

Date: 2026-05-22
Role: Overseer
Scope: Review engineer handover, verify current behavior, retire stale packets, and prepare Dev runway.

## Current Truth

Milestone 09, Scoped Threat Intel And Clipboard Acquisition, is complete with live network smoke deferred.

Accepted implementation state:

- backend Threat Intel scan request/snapshot contract
- local/static target resolution for supported target categories
- backend-only scoped zKill `pastSeconds` probe
- live IO gate with blocked state
- compact renderer search surface with explicit submit
- Clipboard Acquisition listening/cooldown lifecycle
- Electron global shortcut implemented as `CommandOrControl+Shift+Space`
- completed Milestone 09 gap packets moved to `docs/gap/complete`

Additional Combat Witness work has also landed:

- expanded combat replay and watcher-path smoke coverage
- exact raw fixture hash discipline strengthened
- observed repair balance computed from normalized repair events
- source/target, hit quality, damage type, weapon count, and spike outlier metrics added to Combat Witness snapshots
- combat metric schema documentation expanded

## Verification Run

```txt
npm.cmd run verify:all
all checks verified
```

```txt
npm.cmd run smoke:electron
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
clipboard_acquisition_global_shortcut { accelerator: 'CommandOrControl+Shift+Space', registered: true }
```

## Debug Review

No failing runtime issue was found in the offline verification or Electron visual smoke pass.

Observed documentation drift:

- `combat-log-replay-and-repair-balance-next-scope.md` was complete but still under `docs/gap/to-do`.
- `performance-stability-compute-readiness.md` still described Threat Intel zKill/sample metadata as deferred even though Milestone 09 completed those packets.
- `readiness-09-local-type-metadata.md` still referenced Milestone 09 as the active condition after Milestone 09 was complete.

## Architectural Risk

The next risk is not missing code. The next risk is presentation overclaim.

Combat Witness now exposes richer metrics, but damage spike detection is intentionally lightweight and needs dataset calibration before becoming strong UI emphasis. Repair balance is useful, but it must remain observed HPS minus observed DPS and must not become survival language.

Milestone 10 should integrate lanes visually before adding new intelligence depth.

## Dev Direction

Proceed with Milestone 10:

`docs/roadmap/milestone-10-integrated-tactical-viewport.md`

Start with:

1. `docs/gap/to-do/integrated-viewport-lane-priority-and-snapshot-contract.md`
2. `docs/gap/to-do/integrated-viewport-layout-composition.md`
3. `docs/gap/to-do/integrated-viewport-request-pulse-and-degraded-state.md`

Then handle Combat Witness display language with:

- `docs/gap/to-do/integrated-viewport-combat-metric-copy-guardrails.md`
- `docs/gap/to-do/combat-window-weapon-spike-followups.md`

Finish with:

- `docs/gap/to-do/integrated-viewport-smoke-and-boundary-verification.md`

## Non-Negotiables

- Keep Combat Witness, Passive Telemetry, and Threat Intel separate.
- Renderer remains presentation-only.
- Do not add ESI killmail expansion.
- Do not add Atlas persistence or evidence stores.
- Do not treat zKill samples as complete truth.
- Do not promote damage spikes into warnings before calibration.
- Do not describe repair balance as safe/stable/breaking/tank state.
- Keep `verify:all` offline.

## Expected Dev Handover

- lane priority and snapshot display contract
- integrated viewport screenshots/smoke artifact
- displayed fields by lane
- degraded/request pulse behavior
- combat metric copy decisions and deferrals
- verification output
- completed packets moved to `docs/gap/complete`
- current-state updates
