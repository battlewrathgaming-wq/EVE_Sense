# Gap To-Do: Passive Telemetry Freshness Honesty

Status: Open
Milestone: `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`

## Task Requirement

Make Passive Telemetry freshness state honest across fresh, stale, partial, stale-partial, blocked, unresolved, failed-fetch, and expired ESI activity cache cases.

## Why It Matters

Passive Telemetry is contextual, not authoritative. If a partial or failed context ages out, the HUD should say so instead of leaving the operator with stale confidence.

## Actionables

- Review `PassiveTelemetryService.snapshot()` status derivation.
- Ensure expired partial context cannot remain simply `partial`.
- Preserve failure metadata while making stale state visible.
- Ensure expired ESI activity cache state is visible until revalidated.
- Add a small state matrix in tests.
- Keep copy concise and cautious.

## Progress Notes

2026-05-22 Dev pass:

- Reviewed `PassiveTelemetryService.snapshot()` status derivation.
- Expired zKill `fresh` and `partial` context now reports `stale`.
- Expired partial context preserves `zkill.partial` and `zkill.failureCount`.
- Offline verification covers unavailable, fresh, stale, partial, stale-partial, unresolved/degraded, and failed-fetch/degraded.

Remaining in this packet:

- `blocked` state requires the live IO gate task.
- expired ESI activity cache state requires the ESI system activity task.

## Guardrails

- Do not erase useful failure metadata when marking context stale.
- Do not convert stale or partial context into clear/empty truth.
- Do not overbuild assessment logic.

## Completion Signal

- Tests cover fresh, stale, partial, stale-partial, blocked, unresolved, and failed-fetch snapshots.
- HUD state copy remains presentation-only.
- `npm.cmd run verify:all` passes.

## Related Files

- `src/passive/passiveTelemetryService.js`
- `src/renderer/app.js`
- `scripts/verify-passive-telemetry.js`
