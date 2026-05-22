# Audit: Architecture And Passive Telemetry Handover

Date: 2026-05-22
Scope: Review completed state, identify architectural needs, and hand Dev the next feature-aligned milestone.

## Readiness Verdict

Ready for Milestone 06 with guardrails.

AURA-Sense has completed the Combat Witness operational loop. The next useful work is not more Combat Witness polish and not Threat Intel search yet. The next feature-aligned milestone should establish Passive Telemetry as a separate lane: current-system detection from EVE logs plus scoped zKillmail context.

## Current State Reviewed

Complete:

- Combat Witness parser, watcher, runtime, bridge, and HUD surface
- Electron visual smoke
- backend-owned watcher lifecycle
- renderer boundary verification
- `verify:all`
- `smoke:electron`

Open:

- Passive Telemetry
- Threat Intel search bar
- Clipboard Acquisition
- local metadata consumers
- persistent settings and native folder picker
- live operator-machine smoke

## Architectural Needs

The main architectural decision is observation ownership.

`EveGamelogWatcher` already parses navigation jump events, but `CombatWitnessRuntime` currently owns the watcher lifecycle. Passive Telemetry also needs navigation/current-system observations.

Dev must avoid creating a silent second watcher path. Prefer a small backend-owned observation fan-out or a narrow routing path from existing backend ownership into Passive Telemetry. Renderer must not parse logs.

Supporting needs:

- Passive Telemetry snapshot contract before UI work
- backend-only zKillmail client/service with injected fetch
- system identity resolver that avoids heavy metadata until justified
- cache/freshness policy
- lane separation from Threat Intel
- offline verification and Electron smoke updates

## Work Product Created

- `docs/roadmap/architecture-needs-review-2026-05-22.md`
- `docs/roadmap/milestone-06-passive-telemetry-foundation.md`
- `docs/gap/to-do/readiness-15-passive-telemetry-foundation.md`

Updated:

- `docs/current-state/current-implementation.md`
- `docs/roadmap/README.md`
- `docs/roadmap/feature-aligned-milestones.md`
- `docs/gap/to-do/aura-sense-tactical-readiness.md`

## Handoff To Dev

Authorized milestone:

```txt
docs/roadmap/milestone-06-passive-telemetry-foundation.md
```

Authorized gap packet:

```txt
docs/gap/to-do/readiness-15-passive-telemetry-foundation.md
```

Reference feature brief:

```txt
docs/features/vision.md
```

Dev should work the task chain as a bundled feature milestone:

1. Observation source
2. Passive snapshot shape
3. zKill system context
4. Renderer presentation
5. Verification and smoke
6. Current-state and completion handover

## Scope Guidance

Do:

- detect current system from backend-owned log observation
- fetch scoped zKillmail context for the current system
- expose freshness, sample, cap, and failure metadata
- present passive context separately from Combat Witness and Threat Intel
- keep `verify:all` offline
- run `smoke:electron` after UI changes

Do not:

- add Threat Intel search bar
- add Clipboard Acquisition
- add ESI expansion
- add Atlas persistence
- call zKill from renderer
- create a second hidden watcher
- imply zKillmail context is complete tactical truth

## Expected Closeout

Dev handover should include:

- observation ownership decision
- snapshot fields
- zKill normalization/caching behavior
- renderer copy used
- verification output
- smoke artifact path and result summary
- current-state update
- explicit deferrals preserved
