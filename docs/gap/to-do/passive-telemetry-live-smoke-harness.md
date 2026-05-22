# Gap To-Do: Passive Telemetry Live Smoke Harness

Status: Open
Milestone: `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`

## Task Requirement

Add a separate, explicit live smoke command for Passive Telemetry ESI activity and zKill behavior.

## Why It Matters

Offline verification proves structure. A gated live smoke proves the real API boundary without making normal checks depend on network access.

## Actionables

- Add a script or command outside `verify:all`.
- Require an explicit env flag such as `AURA_SENSE_LIVE_API=1`.
- Refuse clearly when the flag is absent.
- Use conservative defaults: known system, ESI activity read, scoped zKill lookback, low cap.
- Write a structured result artifact under `F:\Projects\AURA-Sense\.tmp`.
- Include request outcome, activity kills/jumps, cache/ETag state, zKill sample count, cap/partial/failure metadata, and refusal behavior.

## Current Baseline Artifact

The existing Electron visual smoke artifact is available as the pre-API UI/runtime baseline:

```txt
F:\Projects\AURA-Sense\.tmp\electron-visual-smoke\visual-smoke-result.json
```

Latest recorded result:

```txt
status: passed
checked_at: 2026-05-22T20:34:29.699Z
passiveText: Unavailable
hasPassiveSurface: true
```

This artifact proves the shell and Passive Telemetry surface load. It does not satisfy the live smoke harness completion signal because it does not run live zKill or ESI calls.

## Guardrails

- Do not add ESI killmail expansion.
- Do not run live smoke from `verify:all`.
- Do not mutate persistent product state.
- Do not use broad polling.

## Completion Signal

- Without the flag, live smoke refuses and exits cleanly.
- With the flag, one scoped ESI activity read and one scoped zKill context fetch can run and write an artifact.
- Offline verification remains deterministic.

## Dev Failure Notes

If live smoke cannot be completed, leave notes here:

```txt
Failure reason:

Command used:

Artifact path:

Network/API response:

Recommended next attempt:
```

## Related Files

- `package.json`
- future live smoke script
- `src/passive/zKillSystemContextClient.js`
- future Passive Telemetry ESI activity client files
- `src/passive/passiveTelemetryService.js`
