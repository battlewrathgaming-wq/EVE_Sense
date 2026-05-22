# Audit: Integrated Tactical Viewport Handover

Date: 2026-05-22
Owner: Dev execution under Overseer doctrine
Milestone: 10 - Integrated Tactical Viewport
Status: Complete with spike calibration and live smoke deferred

## Scope

Implemented the Milestone 10 composition slice only:

- integrated viewport root and lane overview
- Combat Witness as the primary lane
- Passive Telemetry and Threat Intel as paired support lanes
- lane-specific degraded/provider basis labels
- observed Combat Witness metric display
- renderer-shell and Electron smoke assertions for integrated selectors
- documentation and gap packet closure

No new collection authority, external API path, persistence, Atlas handoff, or backend truth model was added.

## Lane Priority Decisions

Priority order:

1. Combat Witness: primary, local, time-sensitive observation lane.
2. Passive Telemetry: support lane for current-system context and provider availability.
3. Threat Intel: support lane for deliberate operator-initiated scan context.
4. Event stream and controls: operational detail below the first integrated lane group.

The overview strip repeats each lane's current status. It does not compute or imply a global threat score.

## Displayed Snapshot Fields

Combat Witness:

- `freshness.status`
- `operational.watcher.state`
- `windows.5s.damage.incoming.total`
- `windows.15s.repair.incoming.total`
- `freshness.eventStreamCount`
- `windows.15s.damage.incoming.perSecond`
- `windows.15s.repair.incoming.perSecond`
- `windows.15s.balance.receivedRepairMinusDamagePerSecond`
- `windows.15s.damage.incoming.topSource`
- `windows.15s.damage.incoming.mostObservedWeaponType`

Passive Telemetry:

- `status`
- `currentSystem.label`
- `zkill.sampleCount`
- `activity.shipKills`
- `activity.jumps`
- `freshness.status`
- blocked/provider basis derived from existing snapshot fields

Threat Intel:

- `status`
- `target.label`
- `zkill.provider`
- `zkill.lookbackSeconds`
- `zkill.selectedCount`
- `zkill.discoveredCount`
- clipboard acquisition state
- blocked/partial/capped/provider basis derived from existing snapshot fields

## Degraded And Request Pulse Behavior

The viewport uses compact lane-specific labels for unavailable, stale, partial, blocked, capped, degraded, and idle states. Provider basis fields are derived from existing backend snapshots.

No raw diagnostics stream was added to the HUD. No renderer network calls were introduced.

## Combat Metric Copy Choices

Displayed copy:

- `Incoming pressure`
- `Repair throughput`
- `Observed repair balance`
- `Observed source`
- `Most observed weapon`

The HUD does not display spike outliers yet. Repair balance remains observed HPS minus observed incoming DPS and is not described as safe, stable, breaking, or survival evidence.

## Verification Signals

Focused verification:

```txt
npm.cmd run verify:renderer-shell
renderer shell verified

npm.cmd run verify:renderer-boundary
renderer boundary verified (4 files scanned)
```

Full offline verification:

```txt
npm.cmd run verify:all
all checks verified
```

Electron smoke:

```txt
npm.cmd run smoke:electron
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
```

Smoke artifact:

```txt
F:\Projects\AURA-Sense\.tmp\electron-visual-smoke\visual-smoke-result.json
status: passed
hasIntegratedViewport: true
hasLaneOverview: true
hasCombatMetrics: true
hasProviderBasis: true
```

## Documentation Updates

Updated:

- `docs/current-state/current-implementation.md`
- `docs/schemas/hud-snapshot.md`
- `docs/roadmap/feature-aligned-milestones.md`
- `docs/roadmap/milestone-10-integrated-tactical-viewport.md`
- `docs/gap/to-do/aura-sense-tactical-readiness.md`

Moved completed packets to `docs/gap/complete/`:

- `integrated-viewport-lane-priority-and-snapshot-contract.md`
- `integrated-viewport-layout-composition.md`
- `integrated-viewport-request-pulse-and-degraded-state.md`
- `integrated-viewport-combat-metric-copy-guardrails.md`
- `integrated-viewport-smoke-and-boundary-verification.md`

## Deferred Risks And Concerns

- Damage spike HUD emphasis remains deferred until real dataset calibration.
- `docs/gap/to-do/combat-window-weapon-spike-followups.md` remains open.
- Live zKill/ESI smoke remains deferred and must stay outside `verify:all`.
- Runtime settings persistence, diagnostics review surface, and live IO control policy are scoped for Milestone 11.
- Atlas handoff remains a decision boundary, not an implementation.

## Recommendation For Overseer Review

Review the integrated viewport screenshot and wording for overclaiming before Milestone 11 begins. The next high-value slice is operational hardening: settings persistence, explicit live IO policy, compact diagnostics review, startup/session recovery, and smoke policy.
