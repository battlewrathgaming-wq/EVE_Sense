# Milestone 02: Runtime Observability And Snapshot Presentation Entry

Status: Complete
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Milestone Overview

AURA-Sense now has enough backend foundation to begin moving from seed rigging toward a tactical runtime path.

This milestone is about discipline before display. Diagnostics must be useful without becoming noise, long-session failures must be visible, and the renderer may only consume backend-owned snapshots through an explicit service/preload boundary. The goal is not richer combat interpretation. The goal is to make the first presentation path observable, bounded, and hard to misuse.

Combat Witness is the first runtime lane with real backend shape. It should be used to prove the pattern:

```txt
backend observation
-> normalized event
-> bounded service-owned snapshot
-> explicit bridge/subscription
-> renderer presentation only
```

Threat Intel and Passive Telemetry remain deferred until their service/client boundaries exist. Do not use UI work as a shortcut to create those lanes.

## Completion Verdict

Milestone 02 is complete.

Completed foundations:

- shared backend diagnostics policy
- runtime error diagnostics for process and renderer failure paths
- Combat Witness snapshot bridge through IPC/preload
- verification coverage included in `verify:all`

Renderer presentation remains intentionally deferred to Milestone 03.

## Current Starting Truth

- `npm.cmd run verify:all` is passing and remains offline.
- Combat Witness parser, watcher, event fan-out, and 5s/15s/30s snapshots exist in backend code.
- Combat Witness renderer subscription exists; renderer presentation does not exist yet.
- IPC/service validation exists for current service boundaries.
- Active scan and settings validators exist, but product services are not wired yet.
- Diagnostics now have a shared backend policy for current trace producers, but no renderer diagnostics transport/UI exists yet.

## Doctrine Guardrails

- Renderer must consume snapshots; it must not parse logs or compute Combat Witness metrics.
- Diagnostics must preserve degraded/error states and suppress low-value normal chatter by default.
- No pressure, EWAR, topology, or tactical recommendation widgets until basic snapshot presentation is stable.
- zKill/ESI Threat Intel work remains deferred until scoped clients and service contracts exist.
- Combat Witness observations remain transient and non-evidence-grade.

## Ranked Dev Task Lines

### P0: Keep Verification And State Honest

- P0-01: Run `npm.cmd run verify:all` before and after every milestone slice.
- P0-02: Update `docs/current-state/current-implementation.md` after any runtime boundary changes.
- P0-03: Move completed gap packets to `docs/gap/complete` with verification output.
- P0-04: Do not treat older audits as current implementation truth.

### P1: Diagnostics Throttling

Status: Complete in `docs/gap/complete/readiness-04-diagnostics-throttling.md`.

- P1-01: Implement `docs/gap/to-do/readiness-04-diagnostics-throttling.md`. Complete.
- P1-02: Add a small diagnostics policy/helper rather than scattering throttle logic through runtime code. Complete.
- P1-03: Cover existing trace sources first: `src/combat/eveGamelogWatcher.js`, `src/combat/combatWitnessService.js`, and `src/services/httpClient.js`. Complete.
- P1-04: Keep errors, degraded watcher states, parser/listener failures, blocked requests, and fallback strategy changes visible. Complete.
- P1-05: Suppress or sample low-value normal traces such as poll ticks, cache hits, duplicate suppression, and routine tail reads by default. Complete.
- P1-06: Add offline verification for filtering/throttling behavior and include it in `verify:all`. Complete.

### P2: Runtime Error Handling

Status: Complete in `docs/gap/complete/readiness-10-runtime-error-handling.md`.

- P2-01: Implement `docs/gap/to-do/readiness-10-runtime-error-handling.md` after diagnostics policy exists. Complete.
- P2-02: Add process-level unhandled rejection and uncaught exception logging. Complete.
- P2-03: Add Electron render-process-gone handling. Complete.
- P2-04: Route degraded state through the diagnostics policy rather than direct renderer spam. Complete.

### P3: Combat Witness Snapshot Bridge

Status: Complete in `docs/gap/complete/readiness-11-combat-witness-snapshot-bridge.md`.

- P3-01: Implement the Combat Witness snapshot bridge packet only after diagnostics throttling is complete. Complete.
- P3-02: Expose Combat Witness snapshots through a backend service/preload subscription boundary. Complete.
- P3-03: Keep renderer state presentation-only and bounded. Complete.
- P3-04: Add verification that renderer does not import combat modules or compute snapshot metrics. Complete.

### P4: Deferred Threat Intel And Metadata Work

- P4-01: Keep `readiness-05-zkill-ref-boundary.md` deferred until a zKill client exists.
- P4-02: Keep `readiness-06-threat-intel-sample-metadata.md` deferred until zKill discovery and ESI expansion exist.
- P4-03: Keep `readiness-09-local-type-metadata.md` deferred until Threat Intel timelines or type labels exist.

## Completion Signal

Milestone 02 is complete when:

- diagnostics have explicit levels/categories and throttling defaults
- long-session runtime errors produce visible diagnostics without renderer spam
- Combat Witness snapshots can reach the renderer through an explicit boundary
- renderer remains presentation-only under static verification
- `verify:all` remains offline and passing

## Next Vision Milestone

After this milestone completes, continue to:

- `docs/roadmap/milestone-03-tactical-viewport-first-light.md`

That milestone should create the first honest product-facing tactical viewport. It must not start before runtime error handling and the Combat Witness snapshot bridge are complete.

## Explicit Deferrals

- Threat Intel zKill/ESI implementation
- Passive Telemetry implementation
- pressure gauges
- EWAR inference
- topology models
- Atlas persistence or export handoff
- live API smoke inside `verify:all`

## Source Notes

- `docs/audits/audit-2026-05-22-ipc-settings-validation-handover.md`
- `docs/audits/audit-2026-05-22-combat-witness-core-handover.md`
- `docs/audits/audit-2026-05-22-diagnostics-throttling-handover.md`
- `docs/audits/audit-2026-05-22-runtime-error-handling-handover.md`
- `docs/audits/audit-2026-05-22-combat-witness-snapshot-bridge-handover.md`
- `docs/gap/complete/readiness-04-diagnostics-throttling.md`
- `docs/gap/complete/readiness-10-runtime-error-handling.md`
- `docs/gap/complete/readiness-11-combat-witness-snapshot-bridge.md`
- `docs/current-state/current-implementation.md`
