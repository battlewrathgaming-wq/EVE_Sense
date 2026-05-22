# Audit: Passive Telemetry Live Readiness Endpoint IO

Date: 2026-05-22
Role: Overseer
Scope: Review AURA-Sense Passive Telemetry live-use blockers against Atlas and Aura 7 endpoint IO handling.

## Verdict

Accepted with sequencing change.

Passive Telemetry should clear a live-readiness interlock before Dev treats it as usable in live operator flow. The Combat Logging Test Suite remains useful, but the next architectural pressure point is Passive Telemetry's live boundary.

## Current AURA-Sense Risks

- `src/main/main.js` creates `createPassiveTelemetryService()` without a real resolver.
- `src/passive/passiveTelemetryService.js` defaults every observed system to unresolved.
- Passive Telemetry does not yet fetch ESI aggregate system kills/jumps for the observed current system.
- `src/passive/zKillSystemContextClient.js` calls `/systemID/{id}/` instead of a bounded `pastSeconds` route.
- `passive.telemetry.refresh` is classified as `EXTERNAL_IO`, but there is no operator-visible live IO gate yet.
- Passive zKill uses `HttpClient`, but main wiring does not provide a request-log hook.
- Freshness downgrades `fresh` to `stale`, but expired `partial` context can remain semantically partial without stale language.

## Atlas Lessons

Atlas has the right gate shape for AURA-Sense to adapt:

- action registry with `local-only` and `live-required` modes
- blockers and warnings
- provider call estimates
- UI display hints for confirmation and scope/cap display
- service-layer enforcement before live work begins
- request logs with provider, endpoint, method, status, duration, retry, rate-limit, and error fields
- task cancellation and timeout propagation

Do not import Atlas persistence, evidence queues, reports, or watch execution. Those belong to Atlas, not Sense.

## Aura 7 Lessons

Aura 7 has the right lightweight request pulse shape:

- network enabled state
- in-flight request count
- requests per minute
- recent pending/success/failed/blocked/cached/throttled events
- `onStatus` updates for renderer-visible state
- zKill route format `/systemID/{id}/pastSeconds/{seconds}/`
- ESI system activity format using aggregate system kills and system jumps endpoints, filtered to the active system after resolution, with one-hour cache records and ETag/conditional revalidation where available
- short TTL cache and in-flight coalescing around zKill calls

Do not copy Aura 7's default-live posture. AURA-Sense needs explicit live IO gating before real calls.

## Doctrine Decision

AURA-Sense should use a local live IO gate, not an Atlas import.

The gate should be backend-owned, queryable from the renderer, and enforced by service handlers and external clients. It should be small enough for Passive Telemetry now and reusable for Threat Intel later.

Passive Telemetry live context should contain two separate external slices:

- ESI system activity: aggregate ship kills, pod kills, NPC kills, and jumps for the resolved current system.
- zKill system context: bounded recent killmail refs/results through `pastSeconds`.

This ESI usage is not ESI killmail expansion.

ESI system activity should be cached as a short-lived activity record. While the record is within its one-hour lifetime, AURA-Sense should read from it. After expiry, AURA-Sense should revalidate with ETag/conditional headers where available instead of repeatedly fetching fresh copies.

## Dev Handover

Use `docs/roadmap/passive-telemetry-live-readiness-interlock.md` as the controlling packet.

Implement in this order:

1. Passive system resolver.
2. Scoped zKill `pastSeconds` route.
3. ESI system kills/jumps context for the resolved current system.
4. Live IO gate and blocked refresh behavior.
5. Request observability via `HttpClient` request logs and diagnostics policy.
6. Freshness honesty for expired partial context.
7. Verification and current-state update.

Do not add:

- Threat Intel search
- Clipboard Acquisition
- ESI killmail expansion
- Atlas persistence
- hidden polling
- renderer network calls
- broad UI redesign

Expected handover:

- resolver source and unresolved behavior
- zKill route and `pastSeconds` value
- ESI system activity endpoints, one-hour cache/ETag behavior, and snapshot fields
- live gate states and blocked response shape
- request log fields emitted
- freshness state examples
- verification output
- current-state update
