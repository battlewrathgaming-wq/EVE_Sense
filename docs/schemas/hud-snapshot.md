# Schema: HUD Snapshot

Status: Seed
Owner: Backend/main-process presentation services

## Purpose

Defines compact renderer-facing state.

The renderer should consume snapshots rather than recomputing telemetry truth.

## Suggested Sections

- passive telemetry summary
- threat intel summary
- combat witness summary
- freshness/staleness flags
- warnings
- mode hints

## Invariants

- Snapshots should be compact.
- Snapshots should include freshness metadata.
- Snapshots should not require renderer-side API calls.
- Snapshots should not contain unbounded event history.

