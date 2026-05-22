# Gap To-Do: Passive Telemetry ESI System Activity

Status: Open
Milestone: `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`

## Task Requirement

Add backend-owned ESI aggregate system activity for Passive Telemetry after a resolved current-system observation.

## Why It Matters

On gate jump, AURA-Sense should provide low-noise current-system cues: ship kills, pod kills, NPC kills, and jumps. This feature exists in the project lineage and belongs in Passive Telemetry, but it must remain scoped, cached, observable, and distinct from ESI killmail expansion.

## Actionables

- Add a Passive Telemetry ESI activity client or adapter.
- Fetch ESI aggregate system kills and system jumps through the live IO gate.
- Filter aggregate responses to the resolved current `solarSystemID`.
- Expose ship kills, pod kills, NPC kills, jumps, fetched/updated timestamp where available, cache age, ETag/conditional state, and failure/degraded metadata.
- Treat responses as one-hour tactical cache records.
- Read from the cache record while fresh.
- After expiry, revalidate with ETag/conditional headers where available.
- Add fixture-backed tests for normalization, filtering, cache hit, cache expiry, ETag revalidation, blocked live IO, and failed-fetch degradation.

## Guardrails

- Do not add ESI killmail expansion.
- Do not retain ESI system activity as long-term history.
- Do not call ESI from renderer.
- Do not poll continuously.
- Do not refetch while the current-system cache record is fresh.
- Do not treat aggregate activity as complete tactical truth.

## Completion Signal

- A resolved system can produce a Passive Telemetry activity snapshot with kills/jumps from fixture ESI responses.
- A fresh one-hour cache record is reused without a second external request.
- An expired record revalidates with ETag/conditional state where available.
- Blocked live IO produces blocked/degraded state without calling ESI.
- `npm.cmd run verify:all` passes.

## Related Files

- `src/passive/passiveTelemetryService.js`
- future Passive Telemetry ESI activity client files
- `src/services/httpClient.js`
- `src/main/main.js`
- `scripts/verify-passive-telemetry.js`

