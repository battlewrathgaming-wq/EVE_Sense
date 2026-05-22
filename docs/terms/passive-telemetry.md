# Term: Passive Telemetry

## Plain Meaning

Passive telemetry is low-frequency background awareness about the current system, triggered by local observation rather than broad polling.

Examples:

- gate-jump or current-system detection from EVE logs
- ESI system kills and jumps for the current system
- scoped zKillmail context for the current system
- recent system kills or activity summaries
- one-hour ESI activity cache freshness
- ETag/conditional revalidation state where available
- unavailable/degraded state

## Product Rule

Passive telemetry should inform the HUD but must not overwrite scoped Threat Intel.

It should fetch only when justified by a current-system change or freshness boundary, not as hidden background collection.

ESI use in this lane means aggregate system activity endpoints, not ESI killmail expansion.

The activity cache is a tactical freshness record, not historical storage.

