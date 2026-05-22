# Gap To-Do: Passive Telemetry Foundation

Date: 2026-05-22
Status: Open
Priority: P0 for Milestone 06

## Feature Anchors

- `docs/features/vision.md` Element 3: Passive Telemetry
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 8: Local Metadata
- `docs/features/vision.md` Element 9: External API Boundary

## Need

AURA-Sense needs its next feature lane: current-system context from EVE logs.

In practice, Passive Telemetry should read gate/current-system changes from the local logs and run a scoped zKillmail context fetch for the system the operator has just entered.

## Task Chain

### Task 1: Observation Source

- Reuse backend-owned EVE log observation.
- Avoid a second hidden watcher if the existing watcher can safely fan out navigation events.
- Preserve Combat Witness runtime behavior.
- Document the ownership decision in the handover.

### Task 2: Snapshot Shape

- Define a Passive Telemetry snapshot before renderer work.
- Include:
  - current system label
  - observed event time
  - fetched time
  - freshness status
  - sample count
  - cap/partial/failure metadata
  - unavailable/degraded message

### Task 3: zKill System Context

- Add a backend-only zKillmail query boundary for system context.
- Use injected fetch for offline tests.
- Normalize malformed or capped responses.
- Cache by current system and freshness window.
- Keep live network smoke separate from `verify:all`.

### Task 4: Renderer Presentation

- Add a compact passive system context panel.
- Present `unavailable`, `fresh`, `stale`, `partial`, or `degraded` state honestly.
- Do not update Threat Intel state.
- Do not imply complete combat or system danger truth.

### Task 5: Verification

- Add offline tests for:
  - navigation/current-system event routing
  - zKill response normalization
  - cache/freshness behavior
  - lane separation
  - renderer boundary ownership
- Extend Electron smoke if a visible passive panel is added.

## Guardrails

- Do not poll aggressively.
- Do not call zKill from renderer.
- Do not add ESI expansion.
- Do not build Threat Intel search in this milestone.
- Do not build Clipboard Acquisition in this milestone.
- Do not store history.
- Do not merge Passive Telemetry and Threat Intel.

## Completion Signal

Passive Telemetry can present current-system zKillmail context after a log-observed system change, with backend-owned freshness and sample metadata, while preserving lane separation and offline verification.

## Expected Verification

```powershell
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Any live zKill smoke must be separate and explicitly reported.

## Related Documents

- `docs/roadmap/milestone-06-passive-telemetry-foundation.md`
- `docs/roadmap/architecture-needs-review-2026-05-22.md`
- `docs/roadmap/feature-aligned-milestones.md`
- `docs/features/vision.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/terms/passive-telemetry.md`
