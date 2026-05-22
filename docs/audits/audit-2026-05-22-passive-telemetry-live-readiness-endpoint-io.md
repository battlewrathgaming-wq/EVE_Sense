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
- short TTL cache and in-flight coalescing around zKill calls

Do not copy Aura 7's default-live posture. AURA-Sense needs explicit live IO gating before real calls.

## Doctrine Decision

AURA-Sense should use a local live IO gate, not an Atlas import.

The gate should be backend-owned, queryable from the renderer, and enforced by service handlers and external clients. It should be small enough for Passive Telemetry now and reusable for Threat Intel later.

## Dev Handover

Use `docs/roadmap/passive-telemetry-live-readiness-interlock.md` as the controlling packet.

Implement in this order:

1. Passive system resolver.
2. Scoped zKill `pastSeconds` route.
3. Live IO gate and blocked refresh behavior.
4. Request observability via `HttpClient` request logs and diagnostics policy.
5. Freshness honesty for expired partial context.
6. Verification and current-state update.

Do not add:

- Threat Intel search
- Clipboard Acquisition
- ESI expansion
- Atlas persistence
- hidden polling
- renderer network calls
- broad UI redesign

Expected handover:

- resolver source and unresolved behavior
- zKill route and `pastSeconds` value
- live gate states and blocked response shape
- request log fields emitted
- freshness state examples
- verification output
- current-state update

