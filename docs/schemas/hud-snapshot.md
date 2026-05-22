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

Renderer code should present this snapshot shape rather than recomputing rolling combat metrics.

