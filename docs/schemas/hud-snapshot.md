# Schema: HUD Snapshot

Status: Seed
Owner: Backend/main-process presentation services

## Purpose

Defines compact renderer-facing state.

The renderer should consume snapshots rather than recomputing telemetry truth.

## Suggested Sections

- passive telemetry summary
- threat intel summary
- combat witness summary with 5s/15s/30s windows
- freshness/staleness flags
- warnings
- mode hints

## Invariants

- Snapshots should be compact.
- Snapshots should include freshness metadata.
- Snapshots should not require renderer-side API calls.
- Snapshots should not contain unbounded event history.

## Combat Witness Section

Current backend shape:

- `kind: combat.witness.snapshot`
- `observedAt`
- `windows.5s`
- `windows.15s`
- `windows.30s`
- bounded `eventStream`
- `freshness.latestEventTime`
- `freshness.latestObservedAt`
- `freshness.status`
- `freshness.latestEventAgeMs`
- `freshness.eventStreamCount`

Renderer code should present this snapshot shape rather than recomputing rolling combat metrics.

Current freshness statuses:

- `empty`: no bounded Combat Witness event stream item exists
- `recent`: latest backend reference time is within 15 seconds
- `stale`: latest backend reference time is older than 15 seconds

## Passive Telemetry Section

Current backend shape:

- `kind: passive.telemetry.snapshot`
- `observedAt`
- `currentSystem.label`
- `currentSystem.systemId`
- `currentSystem.eventTime`
- `currentSystem.observedAt`
- `zkill.systemId`
- `zkill.fetchedAt`
- `zkill.sampleCount`
- `zkill.capped`
- `zkill.partial`
- `zkill.failureCount`
- `freshness.status`
- `freshness.cacheAgeMs`
- `freshness.freshnessMs`
- `status`
- `message`
- `failure`

Current passive statuses:

- `unavailable`: no current system has been observed
- `fresh`: current-system context is within freshness window
- `stale`: current-system context exists but freshness expired
- `partial`: context was fetched with malformed or incomplete refs
- `degraded`: system ID resolution or context fetch failed

