# Feature-Aligned Milestones

Status: Active
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Purpose

This roadmap turns the feature vision into larger implementation envelopes.

The goal is to stop treating every implementation step as a separate user-mediated decision. Dev should be able to take a feature-aligned milestone, work through its task chain, preserve the guardrails, verify the result, and hand back a coherent slice.

## Source Of Truth

All milestones must reference:

- `docs/features/vision.md`
- `docs/current-state/current-implementation.md`
- relevant contracts and schemas
- active or completed gap packets
- latest Overseer handover

If a proposed task does not map to a feature element, it needs an Overseer clarification before implementation.

## Milestone Shape

Each milestone should define:

- feature anchors
- operational outcome
- task chain
- autonomy envelope
- acceptance gate
- explicit deferrals
- expected verification
- expected handover contents

Task chains are intentionally multi-step. They give Dev room to implement the feature slice without requiring the user to approve every small move.

## Active Sequence

### Interlock: Passive Telemetry Live Readiness

Status: Active in `docs/roadmap/passive-telemetry-live-readiness-interlock.md`.

This interlock must clear before Passive Telemetry is treated as live-usable. It addresses real system resolution, bounded zKill `pastSeconds` routes, live IO gating, request observability, and freshness honesty.

The interlock is intentionally narrow. It must not add Threat Intel search, Clipboard Acquisition, ESI expansion, Atlas persistence, or renderer network calls.

### Milestone 05: Combat Witness Operational Loop

Status: Complete in `docs/gap/complete/readiness-14-combat-witness-operational-loop.md`.

Feature anchors:

- Element 1: Tactical HUD Shell
- Element 2: Combat Witness
- Element 6: Diagnostics And Degraded State
- Element 7: Settings And Runtime Control

Operational outcome:

Combat Witness moves from first-light presentation to an operator-usable local runtime loop: configured log path, watcher lifecycle, backend snapshot bridge, degraded status, visual smoke evidence, and no renderer-owned telemetry.

Task chain:

1. Establish product-facing log path/settings flow using existing validators.
2. Wire live gamelog watcher lifecycle into the Combat Witness bridge.
3. Surface watcher state and degraded/unavailable status in the HUD without adding new tactical claims.
4. Preserve backend-owned snapshots and bounded event streams.
5. Extend renderer-shell/static verification for new presentation boundaries.
6. Extend `smoke:electron` checks and screenshots for the live-loop UI states that can be proven offline.
7. Update current-state, complete the gap packet, and hand over with verification.

Autonomy envelope:

Dev may touch main/preload/renderer service wiring, settings/log-path service code, Combat Witness bridge lifecycle code, renderer copy for watcher status, verification scripts, and smoke checks.

Acceptance gate:

AURA-Sense can point at a valid gamelog folder, start or reflect watcher status, present Combat Witness freshness/degraded state, pass `verify:all`, and pass `smoke:electron` without live network or Atlas behavior.

### Milestone 06: Passive Telemetry Foundation

Status: Complete in `docs/gap/complete/readiness-15-passive-telemetry-foundation.md`.

Feature anchors:

- Element 3: Passive Telemetry
- Element 6: Diagnostics And Degraded State
- Element 8: Local Metadata
- Element 9: External API Boundary

Operational outcome:

Passive Telemetry detects current-system changes from EVE logs and provides a low-frequency zKillmail context probe for the system the operator has just entered, with freshness language and strict separation from Threat Intel.

Task chain:

1. Define Passive Telemetry snapshot schema before renderer work.
2. Detect gate jumps or current-system changes from EVE logs.
3. Resolve current system identity with local/static metadata where practical.
4. Add a scoped zKillmail system-context fetch that runs on system change, not aggressive polling.
5. Add freshness, unavailable, capped, and failed-fetch metadata.
6. Present a compact passive system-context panel in the HUD.
7. Extend verification for lane separation, fetch throttling, and renderer boundaries.
8. Extend smoke evidence for passive empty/ready/degraded states.
9. Update current-state and handover.

Autonomy envelope:

Dev may add backend passive telemetry service code, compact metadata adapter code, schema docs, renderer panel code, and verification for the lane.

Acceptance gate:

Passive Telemetry can present current-system zKillmail context after a gate jump without calling Threat Intel paths, without broad polling, and without historical storage.

### Milestone 07: Combat Logging Test Suite

Status: Active in:

- `docs/features/combat-logging-test-suite.md`
- `docs/audits/audit-2026-05-22-combat-log-test-suite-milestone-handover.md`
- `docs/gap/to-do/combat-log-dataset-fixture-ingestion.md`
- `docs/gap/to-do/combat-log-event-coverage-matrix.md`
- `docs/gap/to-do/combat-log-replay-harness.md`
- `docs/gap/to-do/combat-log-golden-snapshot-tests.md`
- `docs/gap/to-do/combat-log-repair-healing-fixtures.md`

Feature anchors:

- Element 2: Combat Witness
- Element 3: Passive Telemetry
- Element 6: Diagnostics And Degraded State
- Support Feature: Combat Logging Test Suite

Operational outcome:

AURA-Sense can test curated real EVE gamelog datasets as fixtures, map event coverage, replay ordered datasets through watcher/runtime/service semantics, and compare golden Combat Witness snapshots without using replay behavior in normal runtime.

Task chain:

1. Add deterministic dataset fixture ingestion for curated rows, hashes, expected parser disposition, and source metadata.
2. Add a machine-readable combat-log event coverage matrix that separates supported, rejected, deferred, and unknown families.
3. Add an offline replay harness for ordered fixture datasets through parser/watcher/runtime/service semantics.
4. Add golden snapshot tests for 5s/15s/30s Combat Witness output from known datasets.
5. Add exact raw repair/healing fixtures and rejected lookalikes before parser expansion claims HPS from raw logs.
6. Wire the new verification commands into `verify:all` only when they are offline and deterministic.
7. Update current-state, feature docs, and completion evidence.

Autonomy envelope:

Dev may add fixture formats, importer scripts, coverage matrix files, replay harness scripts, golden snapshot fixtures, parser fixtures, verification scripts, and related docs.

Dev may not:

- ingest private log directories by default
- add runtime replay scanning
- require Electron for parser/replay verification
- widen parser claims without exact raw fixtures
- add renderer behavior as part of this milestone
- infer tactical recommendations or complete combat truth from fixture coverage

Acceptance gate:

The test suite can ingest curated real-data rows, verify raw line hashes, summarize event-family coverage, replay datasets deterministically, compare golden snapshots, and keep repair/healing claims gated behind exact raw fixtures.

### Milestone 08: Scoped Threat Intel Foundation

Feature anchors:

- Element 4: Threat Intel
- Element 5: Clipboard Acquisition
- Element 8: Local Metadata
- Element 9: External API Boundary

Operational outcome:

Threat Intel supports deliberate scoped scans from a search bar or armed clipboard capture, with explicit evidence basis, sample limits, freshness, and failure language.

Task chain:

1. Define search bar target acquisition and scan request contract.
2. Implement or adapt clipboard acquisition as a Ctrl+Shift armed, visible, temporary input workflow with timeout and cooldown.
3. Insert valid clipboard captures into the search box and auto-run the scoped scan.
4. Add zKillmail query/ref normalization for the requested target.
5. Add sample, cap, failed-fetch, and freshness metadata.
6. Keep ESI killmail expansion deferred unless this milestone is explicitly expanded by Overseer.
7. Add local type metadata only where the Threat Intel output consumes it.
8. Present a compact scan result surface that avoids certainty language.
9. Verify renderer isolation, API boundary behavior, keyboard/listening lifecycle, and sample metadata.
10. Record live smoke separately if any live API checks are run.

Autonomy envelope:

Dev may implement backend clients/services, acquisition workflow, scoped renderer controls, metadata adapter use, and verification for the Threat Intel lane.

Acceptance gate:

A search bar or armed clipboard scan returns a tactical zKillmail-backed snapshot with visible evidence basis and no broad background scraping, no Atlas persistence, no default ESI expansion, and no renderer API calls.

### Milestone 09: Integrated Tactical Viewport

Feature anchors:

- Element 1: Tactical HUD Shell
- Element 2: Combat Witness
- Element 3: Passive Telemetry
- Element 4: Threat Intel
- Element 6: Diagnostics And Degraded State

Operational outcome:

The HUD composes multiple lanes into one calm tactical viewport without merging their truth models.

Task chain:

1. Define lane priority and visual hierarchy.
2. Preserve each lane's freshness, uncertainty, and degraded state.
3. Add layout modes only if the operator workflow needs them.
4. Verify lane boundaries and renderer ownership rules.
5. Extend visual smoke across the integrated viewport.
6. Run an Overseer language pass for overclaiming.
7. Update current-state and milestone evidence.

Autonomy envelope:

Dev may refine HUD composition, copy, CSS/layout, smoke coverage, and lane orchestration. Dev may not merge backend truth models.

Acceptance gate:

The viewport shows Combat Witness, Passive Telemetry, and Threat Intel as separate tactical lanes with clear freshness and no false certainty.

### Milestone 10: Operational Hardening And Handoff Boundaries

Feature anchors:

- Element 6: Diagnostics And Degraded State
- Element 7: Settings And Runtime Control
- Element 9: External API Boundary
- Element 10: Atlas Handoff

Operational outcome:

AURA-Sense becomes stable enough for longer operator sessions while keeping Atlas handoff explicit and deferred unless justified.

Task chain:

1. Harden settings persistence and recovery.
2. Add operator-facing degraded-state review.
3. Decide CI policy for smoke commands.
4. Audit API/network behavior under failure.
5. Define Atlas handoff ADR only if a concrete user workflow exists.
6. Add failure records for reusable bug classes.
7. Update current-state and handover.

Autonomy envelope:

Dev may harden runtime control, diagnostics, smoke policy, and documentation. Atlas integration remains deferred unless an ADR authorizes a narrow handoff.

Acceptance gate:

AURA-Sense can run longer sessions with visible degraded states, recoverable settings, scoped network behavior, and no accidental Atlas import.

## Dev Instruction Rule

Future Dev handovers should identify:

- milestone number and name
- feature anchors from `docs/features/vision.md`
- completed tasks in the chain
- tasks intentionally left incomplete
- files touched
- verification run
- smoke/live evidence if applicable
- current-state updates
- explicit deferrals

## Overseer Review Rule

Overseer reviews should judge milestone progress by feature outcome, not by number of small tasks completed.

The question is:

```txt
Did this work move the intended feature element closer to trustworthy tactical operation without broadening the product?
```
