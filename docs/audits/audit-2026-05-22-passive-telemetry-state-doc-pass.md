# Audit: Passive Telemetry State And Documentation Pass

Date: 2026-05-22
Scope: Documentation pass and Passive Telemetry state deep dive.

## Readiness Verdict

Partially improved; Milestone 08 remains active.

The documentation state is broadly aligned: Combat Logging Test Suite is complete, Passive Telemetry foundation exists, and Passive Telemetry live-safe readiness remains the active runway. The main state-handling issue found in this pass was expired partial zKill context.

## State Finding

Before this pass, `PassiveTelemetryService.snapshot()` converted expired `fresh` context to `stale`, but expired `partial` context could continue presenting as `partial`.

That was too optimistic. A partial context that ages out is both stale and partial.

## Change Made

Passive Telemetry now reports expired `fresh` or expired `partial` context as `stale`. Partial metadata remains visible through `zkill.partial` and `zkill.failureCount`, and the stale message distinguishes partial stale context.

Renderer copy remains presentation-only:

```txt
Partial passive context is stale.
```

## Verification

Executed:

```powershell
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:all
npm.cmd run smoke:electron
```

State matrix now covered in offline verification:

- unavailable
- fresh
- stale
- partial
- stale partial
- unresolved/degraded
- failed fetch/degraded

## Still Open

The active freshness-honesty packet is not complete because blocked live IO and expired ESI activity cache states depend on later Milestone 08 tasks:

- live IO gate
- ESI system activity client/cache
- ESI cache revalidation state

## Documentation Pass Notes

- Current-state remains accurate that Passive Telemetry live-safe readiness is active.
- Historical audit references to old to-do packet paths were left unchanged as operational history.
- No Threat Intel, Clipboard Acquisition, ESI killmail expansion, Atlas persistence, renderer network calls, or live smoke behavior was added.

## Recommendation

Overseer should keep Milestone 08 active and proceed next with the local resolver, scoped zKill route, and live IO gate before treating Passive Telemetry as live operator-ready.
