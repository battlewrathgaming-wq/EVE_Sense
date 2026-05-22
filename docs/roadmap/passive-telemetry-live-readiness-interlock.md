# Interlock: Passive Telemetry Live Readiness

Status: Active - Must Clear Before Live Passive Use
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

Passive Telemetry is structurally wired, but it is not ready for live operator use while real systems remain unresolved, zKill requests are broad, and live external IO is not visibly gated.

This interlock sits ahead of further operator-facing live work. It is intentionally smaller than a product milestone and larger than a bug ticket: Dev should clear the live-use boundary in one coherent slice, then return to the Combat Logging Test Suite or Threat Intel sequence.

## Source Patterns Reviewed

Atlas:

- `F:\Projects\AURA-Atlas\src\main\services\liveApiGateService.js`
- `F:\Projects\AURA-Atlas\src\main\services\mutatingActionService.js`
- `F:\Projects\AURA-Atlas\src\main\api\httpClient.js`
- `F:\Projects\AURA-Atlas\src\main\api\zkillClient.js`
- `F:\Projects\AURA-Atlas\docs\gap\complete\live-api-gate-ux.md`
- `F:\Projects\AURA-Atlas\docs\gap\complete\http-timeouts-and-cancellation.md`

Aura 7 lineage:

- `F:\Projects\EVE-Threat-Overlay\src\main\networkGate.js`
- `F:\Projects\EVE-Threat-Overlay\src\main\zkill.js`
- `F:\Projects\EVE-Threat-Overlay\src\main\esi.js`
- `F:\Projects\EVE-Threat-Overlay\Docs\audits\audit-2026-05-22-current-state-alignment.md`

## Adopt

- Atlas-style live action gate: local-only versus live-required actions, blockers, warnings, provider estimates, and UI-oriented display hints.
- Atlas-style service enforcement: live-required handlers must check the gate before calling external clients.
- Atlas-style HTTP discipline: timeout, cancellation, retry bounds, provider/endpoint/status/duration/retry/rate-limit/error logging.
- Aura 7-style request pulse: pending, success, failed, blocked, cached, throttled, in-flight count, recent events, requests per minute.
- Aura 7 zKill route shape: `/systemID/{id}/pastSeconds/{seconds}/`.
- Local/static system resolution before live lookup.

## Reject

- Do not import Atlas persistence, evidence stores, queueing, reports, or watch execution into AURA-Sense.
- Do not copy Aura 7's default-live network posture; AURA-Sense live API use must be explicitly visible and blockable.
- Do not add ESI expansion to Passive Telemetry.
- Do not use live gating as permission for broad polling.
- Do not make renderer code call zKill, ESI, or fetch directly.
- Do not make search focus the only path to operator-initiated live context; fullscreen EVE use needs hands-free acquisition.

## Operator Intent Rule

Search focus alone is not enough to justify a live request.

Allowed live request triggers:

- explicit search submit from the AURA-Sense UI
- valid clipboard acquisition through the visible Ctrl+Shift armed listener
- optional stable typed input debounce in a future Threat Intel milestone, if it remains visible and cancellable

Clipboard acquisition is the preferred hands-free path for fullscreen play. It may populate the search box and trigger the scoped scan after a valid captured target, then must seal and enter a 5 second cooldown.

## Ordered Dev Slices

### Task 1: Passive System Resolver

- Add an injectable Passive Telemetry system resolver.
- Resolve observed EVE system names to system IDs from local/static metadata where practical.
- Preserve explicit unresolved degraded state when resolution fails.
- Do not use ESI as the default resolver in this interlock.

### Task 2: Scoped zKill Route

- Change passive zKill system context calls to a bounded recent-window route.
- Use `/systemID/{id}/pastSeconds/{seconds}/`.
- Make `pastSeconds` a named option in the client and snapshot metadata.
- Keep sample cap and partial/failure metadata visible.

### Task 3: Live IO Gate

- Add a small AURA-Sense live IO gate for Passive Telemetry.
- Gate state must distinguish local-only, live-disabled, live-enabled, blocked, and degraded.
- `passive.telemetry.refresh` must return a blocked/degraded result when live IO is disabled, not silently call zKill.
- Keep `verify:all` offline.

### Task 4: Request Observability

- Wire passive zKill through the existing `HttpClient` request-log hook.
- Emit diagnostics for attempted, blocked, cached, succeeded, failed, timed out, cancelled, capped, partial, and stale paths.
- Keep diagnostic output throttled through the existing diagnostics policy.
- Surface enough snapshot metadata for the HUD to explain unavailable, blocked, partial, stale, and degraded states.

### Task 5: Freshness Honesty

- Ensure expired partial context cannot remain simply `partial` forever.
- Represent expired partial context as stale plus partial/failure metadata, or an equivalent explicit status.
- Add tests for fresh, stale, partial, stale-partial, blocked, unresolved, and failed-fetch states.

### Task 6: Verification And Handover

- Add deterministic unit verification for resolver, scoped route construction, gate blocking, request log hook, and freshness states.
- Add a separate explicit live zKill smoke command only if Dev can keep it opt-in and outside `verify:all`.
- Update current-state and hand over with commands run, live behavior still deferred, and remaining caveats.

## Acceptance Gate

The interlock is complete when:

- observed real system names can resolve to IDs through a local/static resolver or degrade explicitly
- passive zKill uses a bounded `pastSeconds` route
- live passive zKill calls are visibly gated and blockable
- request attempts and outcomes are observable
- partial context expires honestly
- offline verification passes
- no renderer network calls, Threat Intel search, ESI expansion, Atlas persistence, or broad polling were added
