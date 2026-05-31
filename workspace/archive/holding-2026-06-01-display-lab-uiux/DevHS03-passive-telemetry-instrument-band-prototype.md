# DevHS03: Passive Telemetry Instrument Band Prototype

Status: Complete - ready for Overseer review
Date: 2026-05-25
Role: AURA-Sense Dev

## Request

Execute the active Dev runway for a tiny renderer-only Passive Telemetry Instrument Band prototype using existing `passive.telemetry.snapshot` fields only.

## Files Reviewed

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `workspace/current.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/prompts.md`
- `workspace/OverseerHS07-sense-m19-instrument-status-band-adoption-review.md`
- `workspace/UIUXHS03-passive-telemetry-instrument-band-advisory.md`
- `workspace/OverseerHS08-passive-telemetry-instrument-band-advisory-review.md`
- `workspace/SenseUIUXHS01-passive-telemetry-bridge-state-readout.md`
- `workspace/OverseerHS01-passive-telemetry-readout-mapping-review.md`
- `workspace/OverseerHS02-passive-telemetry-readout-prototype-review.md`
- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `src/main/main.js`
- `scripts/verify-renderer-shell.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/liveIoGate.js`
- `scripts/verify-passive-telemetry.js`
- `src/main/preload.js`

External Lab advisory input read as presentation-pattern input only:

- `F:\Projects\AURA- Lab\workspace\OverseerHS71-m19-acceptance.md`
- `F:\Projects\AURA- Lab\workspace\DevHS68-instrument-status-band-prototype.md`
- `F:\Projects\AURA- Lab\workspace\LabRemoteConsumerConformanceHS66.md`

## Changes Made

- Refined the existing Passive glance area into a closed Passive Telemetry band.
- Kept `Passive Telemetry` visible as the lane label.
- Made `currentSystem.label` the primary band value when present.
- Shows `No observation` as the primary value when no current system exists.
- Kept kills, jumps, and ratio as compact support values.
- Kept the Sense-owned state label visible through the existing readout chip.
- Added a compact gap marker using existing Passive gap mapping.
- Added freshness age to the band basis line when `freshness.cacheAgeMs` exists.
- Reused the existing diagnostics panel as the compact detail path for Passive state, sample, activity, freshness, age, basis, gap, live IO, provider pulse, and failure context.
- Extended renderer shell checks and Electron smoke assertions for the new Passive band structure and narrow viewport visibility.

## Boundaries Preserved

- No `passive.telemetry.snapshot` shape changes.
- No Passive Telemetry backend, provider client, live IO gate, cache, parser, watcher, runtime, IPC, bridge, payload, or service-command changes.
- No renderer calls to zKill, ESI, filesystem, provider clients, parser, watcher, or runtime modules.
- No Atlas, Core, or Lab files changed.
- No Lab neutral state labels were imported as user-facing Passive copy.
- No live provider smoke, manual shortcut validation, or real SDE refresh/download.

## Verification

Passed:

```powershell
npm.cmd run verify:renderer-shell
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:protected-terms
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Notes:

- `verify:protected-terms` completed in warning-only working-set mode with 117 warning-only items after this handoff file was added.
- `smoke:electron` passed and wrote artifacts under `.tmp\electron-visual-smoke`.

## Findings

- The existing Passive compact surface was sufficient for the first band prototype; no new large front-page card was needed.
- Passive state distinctions remain Sense-owned: `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, `No observation`, and supported `Provider pending`.
- `Static lookup` remains gated by existing resolver-source support.
- The band improves first-glance scanability while leaving Combat Witness priority intact.

## Remaining Risk

- The prototype reuses diagnostics as the detail reveal. A dedicated Passive-only reveal could be useful later, but would be separate scope.
- The new local identifiers use `passive-band`/instrument-band framing for implementation clarity; visible product copy remains `Passive Telemetry` and Sense-owned state/basis language.

## Recommendation

Recommend Overseer accept this as the tiny renderer-only Passive Telemetry Instrument Band prototype. Any next step should be either visual-density tuning or a dedicated Passive detail reveal, not backend or contract work.
