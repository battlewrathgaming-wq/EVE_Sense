# Milestone 10: Integrated Tactical Viewport

Status: Complete - Spike calibration and live smoke deferred
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

Milestone 10 makes AURA-Sense feel like one tactical instrument without collapsing its evidence lanes into one vague "threat" object.

Combat Witness, Passive Telemetry, and Threat Intel now exist as separate verified lanes. The next work is composition: visual priority, freshness honesty, request/degraded-state visibility, and language discipline. The HUD should reduce lookup pressure and interpretation load while preserving uncertainty.

This milestone is not a new intelligence system. It is the viewport integration pass.

## Feature Anchors

- `docs/features/vision.md` Element 1: Tactical HUD Shell
- `docs/features/vision.md` Element 2: Combat Witness
- `docs/features/vision.md` Element 3: Passive Telemetry
- `docs/features/vision.md` Element 4: Threat Intel
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 9: External API Boundary

## Operational Outcome

The operator can glance at one viewport and understand:

- what Combat Witness has observed recently
- what current-system context Passive Telemetry has, or why it is unavailable
- what deliberate Threat Intel scan has returned, or why it is blocked/unresolved
- which data is fresh, stale, partial, capped, blocked, or unavailable

Each lane remains independently truthful.

## Task Chain

### Task 1: Lane Priority And Snapshot Contract

- Status: Complete.
- Define the integrated HUD sections and priority order before CSS/layout work.
- Preserve Combat Witness, Passive Telemetry, and Threat Intel as separate lanes.
- Decide which backend snapshot fields are eligible for first integrated display.
- Keep Combat Witness weapon/spike metrics available but do not emphasize spikes until the real-dataset calibration packet resolves them.

Task packet: `docs/gap/complete/integrated-viewport-lane-priority-and-snapshot-contract.md`.

### Task 2: Calm Multi-Lane Layout

- Status: Complete.
- Refine the renderer into a compact tactical viewport with stable lane hierarchy.
- Avoid dashboard sprawl and decorative panels.
- Keep operator actions clear: watcher start/stop, Threat Intel scan, Clipboard arm.
- Preserve mobile/narrow layout readability.

Task packet: `docs/gap/complete/integrated-viewport-layout-composition.md`.

### Task 3: Degraded State And Request Pulse

- Status: Complete using existing snapshot metadata; raw diagnostics stream deferred.
- Surface blocked, stale, partial, unavailable, capped, and failed states without flooding the HUD.
- Add a compact request pulse/status area for live API attempts only if it can be fed from backend diagnostics or snapshot metadata.
- Keep live network smoke separate from offline verification.
- Do not add renderer network calls.

Task packet: `docs/gap/complete/integrated-viewport-request-pulse-and-degraded-state.md`.

### Task 4: Combat Metric Copy Guardrails

- Status: Complete for integrated HUD copy; calibration follow-up remains open.
- Decide which Combat Witness metrics are product-ready for display.
- Use observed-language for weapon counts, sources, targets, HPS/DPS, and repair balance.
- Keep damage spike outliers low-emphasis until calibrated against real datasets.
- Do not describe repair balance as survival, stability, or tank state.

Task packets:

- `docs/gap/complete/integrated-viewport-combat-metric-copy-guardrails.md`
- `docs/gap/complete/combat-window-weapon-spike-followups.md`
- `docs/gap/to-do/combat-metric-calibration-real-datasets.md`

### Task 5: Verification And Smoke Evidence

- Status: Complete.
- Extend renderer-shell checks for any new integrated HUD selectors.
- Preserve renderer boundary checks.
- Extend `smoke:electron` assertions and screenshots for the integrated viewport.
- Keep `verify:all` offline and deterministic.

Task packet: `docs/gap/complete/integrated-viewport-smoke-and-boundary-verification.md`.

### Task 6: State And Handover

- Status: Complete.
- Update current-state with actual integrated viewport behavior.
- Move completed packets to `docs/gap/complete`.
- Record verification and smoke artifact paths.
- Call out any live smoke, type metadata, repair parser, or Atlas handoff deferrals.

## Autonomy Envelope

Dev may touch:

- renderer layout and copy
- renderer smoke assertions
- preload/main bridge usage only where an existing backend snapshot needs presentation
- backend snapshot presentation adapters if needed
- diagnostics/request pulse presentation fed by backend-owned state
- docs, schemas, and verification scripts

Dev may not:

- merge Combat Witness, Passive Telemetry, and Threat Intel into one backend truth model
- call zKill, ESI, fetch, filesystem, parser, watcher, or runtime modules from the renderer
- add ESI killmail expansion
- add Atlas persistence, queues, reports, or watch execution
- promote damage spikes into warnings before calibration
- claim repair balance means the operator is safe or unsafe
- add broad polling or hidden background collection

## Acceptance Gate

Milestone 10 is complete when:

- the viewport presents all three active lanes with clear hierarchy
- freshness/degraded/capped/blocked language is visible and lane-specific
- operator actions remain explicit and low ambiguity
- Combat Witness metrics are presented as observations, not conclusions
- renderer boundary verification passes
- `npm.cmd run verify:all` passes
- `npm.cmd run smoke:electron` passes and records integrated viewport evidence

## Completion Evidence

Verification completed:

```txt
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
```

Electron visual smoke completed:

```txt
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
```

Smoke artifact records:

```txt
hasIntegratedViewport: true
hasLaneOverview: true
hasCombatMetrics: true
hasProviderBasis: true
```

Deferred by design:

- damage spike HUD emphasis until real-dataset calibration completes
- live zKill/ESI smoke evidence
- raw diagnostics stream in the HUD
- Atlas handoff or persistence

## Expected Handover

Dev handover should include:

- feature anchors used
- lane priority decisions
- displayed snapshot fields by lane
- degraded/request pulse behavior
- Combat Witness copy choices and spike/repair balance deferrals
- verification output
- Electron smoke artifact path
- completed and remaining gap packets
