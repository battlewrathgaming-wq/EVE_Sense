# Milestone 08: Passive Telemetry Live-Safe Readiness

Status: Complete With Live Network Smoke Deferred
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

Passive Telemetry is structurally present, but it should not be treated as live-ready until system resolution, ESI system activity, scoped zKill routes, live IO gating, and diagnostics are hardened.

This milestone turns the Passive Telemetry foundation into a cautious live-capable lane. It should remain smaller than Threat Intel and should not introduce Atlas-style persistence, broad polling, search, clipboard acquisition, or ESI killmail expansion.

Feature anchors:

- `docs/features/vision.md` Element 3: Passive Telemetry
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 8: Local Metadata
- `docs/features/vision.md` Element 9: External API Boundary
- `docs/roadmap/passive-telemetry-live-readiness-interlock.md`

## Operational Outcome

AURA-Sense can observe a current-system change, resolve the system locally, fetch one-hour ETag-aware ESI system activity and scoped bounded zKill context only when live IO is allowed, expose honest freshness/degraded state, and produce enough diagnostics for live smoke debugging.

## Completion Verdict

Milestone 08 is complete with live network smoke deferred.

Passive Telemetry now has local/static resolution, live IO gating, scoped zKill `pastSeconds` context, ESI aggregate system activity with one-hour cache and ETag revalidation behavior, request diagnostics, freshness honesty, compact HUD activity presentation, and an explicit live smoke command.

The live smoke command was verified in refusal mode only. A live network run still requires `AURA_SENSE_LIVE_API=1`.

## Task Chain

### Task 1: Local System Resolver

- Resolve observed `navigation.jump` system names to `solarSystemID` through local/static metadata.
- Use exact-name matching first.
- Preserve clear degraded state when unresolved.
- Do not use live ESI as the default resolver.

Task packet: `docs/gap/complete/passive-telemetry-local-system-resolver.md`.

Status: Complete in `docs/gap/complete/passive-telemetry-local-system-resolver.md`.

### Task 2: Scoped zKill Route

- Change Passive Telemetry zKill requests to use `/systemID/{id}/pastSeconds/{seconds}/`.
- Make lookback seconds explicit in client options and snapshot metadata.
- Keep cap/sample/failure language visible.

Task packet: `docs/gap/complete/passive-telemetry-scoped-zkill-route.md`.

Status: Complete in `docs/gap/complete/passive-telemetry-scoped-zkill-route.md`.

### Task 3: ESI System Activity

- Add a backend-only Passive Telemetry ESI system activity client.
- Fetch aggregate system kills and system jumps through the live IO gate.
- Filter responses to the resolved current `solarSystemID`.
- Expose ship kills, pod kills, NPC kills, jumps, freshness/cache metadata, and degraded/failure state.
- Treat activity as a one-hour cache record with ETag/conditional revalidation where available.
- Do not add ESI killmail expansion.

Task packet: `docs/gap/complete/passive-telemetry-esi-system-activity.md`.

Status: Complete in `docs/gap/complete/passive-telemetry-esi-system-activity.md`.

### Task 4: Live IO Gate

- Add a small backend-owned live IO gate for Passive Telemetry.
- Block zKill and ESI activity calls when disabled and return a clear blocked/degraded snapshot.
- Keep renderer display-only.

Task packet: `docs/gap/complete/passive-telemetry-live-io-gate.md`.

Status: Complete in `docs/gap/complete/passive-telemetry-live-io-gate.md`.

### Task 5: Request Diagnostics And Tracing

- Wire passive zKill and ESI activity calls through request logging.
- Record attempted, blocked, cached, succeeded, failed, timed out, cancelled, capped, partial, and stale paths.
- Ensure the HUD can explain unavailable, blocked, partial, stale, and degraded states without becoming a diagnostics console.

Task packet: `docs/gap/complete/passive-telemetry-debugging-and-tracing.md`.

Status: Complete in `docs/gap/complete/passive-telemetry-debugging-and-tracing.md`.

### Task 6: Freshness Honesty

- Ensure expired partial context cannot remain merely `partial`.
- Preserve failure metadata while making stale state visible.
- Add deterministic tests for fresh, stale, partial, stale-partial, blocked, unresolved, and failed-fetch states.

Task packet: `docs/gap/complete/passive-telemetry-freshness-honesty.md`.

Status: Complete in `docs/gap/complete/passive-telemetry-freshness-honesty.md`.

### Task 7: Live Smoke Harness

- Add a separate live-gated smoke command outside `verify:all`.
- Require an explicit environment flag.
- Use conservative defaults for ESI activity and zKill context and write artifacts under `.tmp`.
- Do not add ESI killmail expansion.

Task packet: `docs/gap/complete/passive-telemetry-live-smoke-harness.md`.

Status: Complete in `docs/gap/complete/passive-telemetry-live-smoke-harness.md`; live network run deferred.

### Task 8: State And Handover

- Update current-state after implementation.
- Move completed task packets to `docs/gap/complete`.
- Record verification commands, smoke artifacts, blocked/degraded behavior, and remaining caveats.

## Autonomy Envelope

Dev may touch:

- Passive Telemetry service/client code
- local metadata resolver adapters
- backend service registry commands
- HTTP request logging/diagnostics plumbing
- renderer copy for passive status display
- deterministic verification scripts
- live smoke scripts, if gated
- current-state and completion docs

Dev may not:

- add Threat Intel search
- add Clipboard Acquisition
- add ESI killmail expansion
- add Atlas persistence or evidence reports
- call zKill or ESI from renderer
- add broad background polling
- imply zKill context is complete tactical truth

## Acceptance Gate

Milestone 08 is complete when:

- observed real system names resolve locally or degrade explicitly
- ESI system kills/jumps activity is fetched from a fresh one-hour cache record or revalidated with ETag/conditional state
- passive zKill uses a bounded `pastSeconds` route
- live passive calls are visibly gated and blockable
- passive request attempts and outcomes are traceable
- freshness states are honest, including expired partial context
- live smoke exists only as an explicit gated command
- `npm.cmd run verify:all` passes
- `npm.cmd run smoke:electron` passes if renderer-visible behavior changes
- current-state and completion evidence are updated

## Expected Handover

Dev handover should include:

- resolver source and behavior
- ESI activity endpoints, cache lifetime, ETag behavior, and snapshot fields
- zKill route shape and default lookback
- live gate states and blocked behavior
- request diagnostics emitted
- freshness state matrix
- verification output
- live smoke command and refusal behavior
- smoke artifact path if live smoke was run
- explicit deferrals
