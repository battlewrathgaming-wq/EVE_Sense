# Milestone 06: Passive Telemetry Foundation

Status: Complete
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

Passive Telemetry is the next feature-aligned milestone.

The aim is not to build a broad intelligence panel. The aim is to let AURA-Sense notice the operator's current system from EVE logs and fetch a small, fresh zKillmail context sample for that system.

Feature anchors:

- `docs/features/vision.md` Element 3: Passive Telemetry
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 8: Local Metadata
- `docs/features/vision.md` Element 9: External API Boundary

## Operational Outcome

AURA-Sense can detect current-system changes from backend-owned log observation, produce a Passive Telemetry snapshot with zKillmail-backed system context, and present it in the HUD with freshness and uncertainty language.

## Completion Verdict

Milestone 06 is complete with caveats.

Passive Telemetry now consumes navigation events from the existing backend gamelog observation path, normalizes bounded zKill system-context metadata behind a backend boundary, exposes a passive snapshot bridge, and presents a separate HUD panel with unavailable/fresh/stale/partial/degraded language.

Live zKill smoke, local metadata-backed system ID resolution, Threat Intel search, Clipboard Acquisition, and ESI expansion remain deferred.

## Task Chain

### Task 1: Observation Ownership Decision

- Review current Combat Witness watcher ownership.
- Use this canonical backend stream target:

```txt
EVE gamelog watcher
-> complete appended lines
-> parser
-> normalized observed event stream
   -> rolling DPS/HPS window consumer
   -> jump/location consumer
   -> future EWAR consumer
   -> future diagnostics/debug consumer
   -> future HUD snapshot service
```

- Preserve `EveGamelogWatcher` append-only semantics:
  - offset-seed existing files
  - seed newly discovered files at current size
  - read only future appended bytes
  - buffer partial lines until complete
  - suppress short-TTL duplicate normalized events
- Avoid adding a second hidden watcher.
- Either extract a small shared gamelog observation runtime or route navigation events from backend ownership into Passive Telemetry.
- Preserve Combat Witness behavior and verification.
- Keep renderer consumption snapshot-only.

Status: Complete.

### Task 2: Passive Snapshot Contract

- Define the Passive Telemetry snapshot shape before renderer implementation.
- Include current system, source event time, fetched time, freshness, sample count, capped/partial/failure metadata, and unavailable/degraded message.
- Add or update schema/contract docs if the shape becomes stable.

Status: Complete.

### Task 3: zKill System Context Boundary

- Add backend-only zKillmail system-context client/service.
- Use injected fetch in tests.
- Use timeout/cancel/retry and explicit User-Agent through existing HTTP helpers.
- Normalize responses into bounded context metadata.
- Do not add ESI expansion.

Status: Complete.

### Task 4: Freshness And Cache Policy

- Trigger fetches on current-system change or explicit freshness expiry.
- Do not poll aggressively.
- Expose cache/freshness state in the snapshot.
- Treat fetch errors as unavailable/degraded, not empty truth.

Status: Complete.

### Task 5: HUD Integration

- Add a compact Passive Telemetry panel.
- Keep it visually secondary to Combat Witness.
- Use context language, not threat certainty.
- Keep Passive Telemetry separate from Threat Intel search state.

Status: Complete.

### Task 6: Verification And Smoke

- Add offline verification for navigation routing, zKill normalization, cache/freshness, and lane separation.
- Extend renderer boundary checks if new UI paths are added.
- Run `npm.cmd run verify:all`.
- Extend `npm.cmd run smoke:electron` for passive unavailable/ready states where possible.
- Keep live zKill smoke separate if performed.

Status: Complete.

### Task 7: State And Handover

- Update current-state.
- Move `docs/gap/to-do/readiness-15-passive-telemetry-foundation.md` to complete when accepted.
- Record verification output, smoke evidence, and explicit deferrals.

Status: Complete.

## Autonomy Envelope

Dev may touch:

- backend gamelog observation ownership
- Passive Telemetry service/client code
- zKillmail client boundary
- small metadata resolver interface
- preload/service bridge for Passive Telemetry snapshots
- renderer passive panel
- verification scripts
- smoke checks
- related docs

Dev may not:

- add Threat Intel search bar
- add Clipboard Acquisition
- add ESI expansion
- add Atlas persistence
- call zKill from renderer
- create a hidden second watcher without documenting the decision
- replay existing log files as Passive Telemetry evidence
- make zKillmail activity sound like complete tactical truth

## Acceptance Gate

Milestone 06 is complete when:

- current-system changes can produce backend-owned Passive Telemetry snapshots
- zKillmail system context is fetched or fixture-normalized through a backend boundary
- snapshots include freshness, cap/sample, and unavailable/degraded state
- HUD presents Passive Telemetry separately from Combat Witness and Threat Intel
- `npm.cmd run verify:all` passes
- `npm.cmd run smoke:electron` passes after UI changes
- current-state and completion evidence are updated

## Expected Handover

Dev handover should include:

- feature anchors used
- observation ownership decision
- snapshot fields produced
- zKill client behavior and limits
- cache/freshness policy
- renderer files touched
- verification output
- smoke output directory and result summary
- explicit deferrals
