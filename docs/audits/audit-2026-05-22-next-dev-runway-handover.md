# Audit: Next Dev Runway Handover

Date: 2026-05-22
Role: Overseer
Scope: Consolidate recent Passive Telemetry, ESI activity, Threat Intel, and Clipboard Acquisition decisions into Dev sequencing.

## Current Truth

Combat Logging Test Suite is complete. Passive Telemetry foundation is wired but not live-safe yet. The next Dev runway should clear Passive Telemetry live-safe readiness before beginning Threat Intel and Clipboard Acquisition.

Recent doctrine clarified:

- Passive Telemetry needs ESI aggregate system kills/jumps on observed gate jump.
- ESI activity is a one-hour tactical cache record with ETag/conditional revalidation where available.
- zKill Passive Telemetry context must use bounded `pastSeconds`.
- Clipboard Acquisition is the hands-free Threat Intel input path for fullscreen EVE use.
- Clipboard Acquisition has a short armed listener, then a 5 second cooldown after seal.
- Search focus alone must not trigger API work.

## Dev Sequence

### First: Milestone 08 Passive Telemetry Live-Safe Readiness

Use:

- `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`
- `docs/roadmap/passive-telemetry-live-readiness-interlock.md`
- `docs/gap/to-do/passive-telemetry-local-system-resolver.md`
- `docs/gap/to-do/passive-telemetry-esi-system-activity.md`
- `docs/gap/to-do/passive-telemetry-scoped-zkill-route.md`
- `docs/gap/to-do/passive-telemetry-live-io-gate.md`
- `docs/gap/to-do/passive-telemetry-debugging-and-tracing.md`
- `docs/gap/to-do/passive-telemetry-freshness-honesty.md`
- `docs/gap/to-do/passive-telemetry-live-smoke-harness.md`

Outcome:

Passive Telemetry can resolve the observed current system, fetch ESI activity and zKill context through gated backend clients, expose cache/freshness/degraded state, and remain separate from Threat Intel.

Current smoke baseline before API-function work:

```txt
F:\Projects\AURA-Sense\.tmp\electron-visual-smoke\visual-smoke-result.json
status: passed
checked_at: 2026-05-22T20:34:29.699Z
passiveText: Unavailable
hasPassiveSurface: true
noNodeRequire: true
noElectronGlobal: true
```

This is an Electron renderer/runtime baseline only. It is not a live zKill/ESI smoke result.

### Second: Milestone 09 Scoped Threat Intel And Clipboard Acquisition

Use:

- `docs/roadmap/milestone-09-scoped-threat-intel-and-clipboard-acquisition.md`
- `docs/features/clipboard-acquisition.md`
- `docs/audits/audit-2026-05-22-clipboard-acquisition-cooldown-intent.md`

Outcome:

The operator can run a scoped zKill-backed scan by explicit search submit or Ctrl+Shift clipboard acquisition, with visible sample/freshness/cap/failure language and no focus-triggered API calls.

### Third: Milestone 10 Integrated Tactical Viewport

Use:

- `docs/roadmap/feature-aligned-milestones.md` Milestone 10

Outcome:

Combat Witness, Passive Telemetry, and Threat Intel compose into one calm HUD without merging their truth models.

## Guardrails For Dev

- Keep lanes separate.
- Keep renderer presentation-only.
- Keep live calls gated, scoped, observable, and backend-owned.
- Keep ESI aggregate system activity distinct from ESI killmail expansion.
- Keep zKill context sampled and partial-aware.
- Keep clipboard listening deliberate, visible, short, and sealed.
- Keep `verify:all` offline.

## Deferrals

- ESI killmail expansion remains deferred.
- Atlas persistence, queues, reports, watch execution, and evidence stores remain out of AURA-Sense core.
- Stable typed-input debounce for search remains optional future work; focus alone is not a trigger.
- Live zKill/ESI smoke is separate from `verify:all` and must be explicitly recorded.

## Required Handover Shape

Each Dev handover should state:

- active milestone or interlock
- feature anchors
- tasks completed
- tasks left incomplete
- verification run
- live smoke status
- smoke artifact path/result when renderer or live API smoke is relevant
- files touched
- current-state updates
- explicit deferrals preserved
