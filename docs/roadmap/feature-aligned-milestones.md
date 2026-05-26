# Feature-Aligned Milestones

Status: Historical feature-aligned scaffold
Date: 2026-05-22
Owner: Overseer direction, Dev execution

Current note: This file records the feature-aligned milestone sequence that got AURA-Sense to its current verified baseline. Use `docs/roadmap/README.md`, the active candidate milestone file, and `workspace/current.md` for current authority before opening new work.

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

## Feature Sequence

### Interlock: Passive Telemetry Live Readiness

Status: Complete with live network smoke deferred in `docs/roadmap/passive-telemetry-live-readiness-interlock.md`.

This interlock cleared the live-safe Passive Telemetry boundary: real system resolution, ESI system kills/jumps activity, one-hour ETag-aware activity cache records, bounded zKill `pastSeconds` routes, live IO gating, request observability, and freshness honesty.

The interlock is intentionally narrow. It must not add Threat Intel search, Clipboard Acquisition, ESI killmail expansion, Atlas persistence, or renderer network calls.

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

Status: Complete in:

- `docs/features/combat-logging-test-suite.md`
- `docs/audits/audit-2026-05-22-combat-log-test-suite-milestone-handover.md`
- `docs/audits/audit-2026-05-22-combat-log-test-suite-handover.md`
- `docs/gap/complete/combat-log-dataset-fixture-ingestion.md`
- `docs/gap/complete/combat-log-event-coverage-matrix.md`
- `docs/gap/complete/combat-log-replay-harness.md`
- `docs/gap/complete/combat-log-golden-snapshot-tests.md`
- `docs/gap/complete/combat-log-repair-healing-fixtures.md`

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

Completion signal:

```txt
combat fixture ingestion verified: 7 curated rows
combat log coverage verified: supported=5 rejected=2 deferred=1 unknown=0
combat log replay verified: events=5 stream=4
combat golden snapshots verified: windows=5s,15s,30s
```

### Milestone 08: Passive Telemetry Live-Safe Readiness

Status: Complete with live network smoke deferred in `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`.

Feature anchors:

- Element 3: Passive Telemetry
- Element 6: Diagnostics And Degraded State
- Element 8: Local Metadata
- Element 9: External API Boundary

Operational outcome:

Passive Telemetry becomes live-safe: it resolves observed systems, fetches ESI aggregate system activity through one-hour ETag-aware cache records, fetches bounded zKill context, obeys a live IO gate, and reports honest freshness/degraded states.

Task chain:

1. Resolve observed system names to local/static system IDs or degrade explicitly.
2. Add ESI aggregate system kills/jumps activity with one-hour cache and ETag/conditional revalidation where available.
3. Change passive zKill context to bounded `pastSeconds` routes.
4. Add a backend live IO gate for passive ESI/zKill calls.
5. Wire request logging and diagnostics for attempted, blocked, cached, succeeded, failed, timed out, cancelled, capped, partial, and stale paths.
6. Fix freshness honesty for partial and expired cache states.
7. Add an explicit live smoke harness outside `verify:all`.
8. Update current-state and completion evidence.

Autonomy envelope:

Dev may touch Passive Telemetry backend services/clients, local metadata resolver adapters, service registry commands, request logging/diagnostics plumbing, compact passive HUD copy, deterministic verification, live smoke scripts, and docs.

Dev may not add Threat Intel search, Clipboard Acquisition, ESI killmail expansion, Atlas persistence, renderer network calls, broad polling, or false certainty language.

Acceptance gate:

Passive Telemetry can provide current-system ESI activity and bounded zKill context only when live IO is allowed, can block external calls visibly, can read fresh cache records, can revalidate expired records, and can pass offline verification.

Completion signal:

```txt
passive telemetry verified
all checks verified
AURA-Sense passive live API smoke refused: F:\Projects\AURA-Sense\.tmp\passive-live-api-smoke\result.json
```

### Milestone 09: Scoped Threat Intel And Clipboard Acquisition

Status: Complete with live network smoke deferred in `docs/roadmap/milestone-09-scoped-threat-intel-and-clipboard-acquisition.md`.

Feature anchors:

- Element 4: Threat Intel
- Element 5: Clipboard Acquisition
- Element 8: Local Metadata
- Element 9: External API Boundary

Operational outcome:

Threat Intel supports deliberate scoped scans from explicit renderer/service requests or Clipboard Acquisition, with explicit provider/source basis, sample limits, freshness, and failure language.

Implementation note:

Electron global shortcut registration uses `Control+\` as the preferred chord with `Control+Alt+Space` fallback status reporting rather than a bare Ctrl+Shift chord. Focused UI keyboard affordances remain available.

Task chain:

1. Define search target acquisition and scan request contract.
2. Implement or adapt clipboard acquisition as an I/O-gated `Control+\` permission action with focused/windowed temporary input behavior, timeout, duplicate suppression, and cooldown.
3. Insert valid clipboard captures into the search box and auto-run the scoped scan.
4. Add zKillmail query/ref normalization for the requested target.
5. Add sample, cap, failed-fetch, and freshness metadata.
6. Keep ESI killmail expansion deferred unless this milestone is explicitly expanded by Overseer.
7. Add local type metadata only where the Threat Intel output consumes it.
8. Present a compact scan result surface that avoids certainty language.
9. Verify renderer isolation, API boundary behavior, keyboard/listening lifecycle, no-scan-on-focus behavior, cooldown behavior, and sample metadata.
10. Record live smoke separately if any live API checks are run.

Autonomy envelope:

Dev may implement backend clients/services, acquisition workflow, scoped renderer controls, metadata adapter use, and verification for the Threat Intel lane.

Dev may not scan on search focus alone, keep clipboard listening indefinitely, require AURA-Sense window focus for the primary clipboard arming path, add ESI killmail expansion by default, or import Atlas persistence.

Acceptance gate:

Explicit renderer/service scan request or Clipboard Acquisition returns a tactical zKillmail-backed snapshot with visible provider/source basis and no broad background scraping, no focus-triggered API calls, no Atlas persistence, no default ESI expansion, and no renderer API calls.

Completion signal:

```txt
threat intel verified
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
```

### Milestone 10: Integrated Tactical Viewport

Status: Complete with spike calibration and live smoke deferred in `docs/roadmap/milestone-10-integrated-tactical-viewport.md`.

Feature anchors:

- Element 1: Tactical HUD Shell
- Element 2: Combat Witness
- Element 3: Passive Telemetry
- Element 4: Threat Intel
- Element 6: Diagnostics And Degraded State

Operational outcome:

The HUD composes multiple lanes into one calm tactical viewport without merging their truth models.

Completion summary:

- lane overview added for Combat Witness, Passive Telemetry, and Threat Intel
- Combat Witness remains the primary lane
- Passive Telemetry and Threat Intel are paired support lanes
- observed Combat Witness pressure, repair throughput, repair balance, source, and weapon fields are displayed without conclusion language
- provider/basis fields show Passive Telemetry and Threat Intel context without renderer provider calls

Task chain:

1. Define lane priority and visual hierarchy.
2. Preserve each lane's freshness, uncertainty, and degraded state.
3. Add layout modes only if the operator workflow needs them.
4. Verify lane boundaries and renderer ownership rules.
5. Extend visual smoke across the integrated viewport.
6. Run an Overseer language pass for overclaiming.
7. Update current-state and milestone evidence.

Use the active milestone file for task packets, Dev autonomy, acceptance gates, and expected handover details.

Autonomy envelope:

Dev may refine HUD composition, copy, CSS/layout, smoke coverage, and lane orchestration. Dev may not merge backend truth models.

Acceptance gate:

The viewport shows Combat Witness, Passive Telemetry, and Threat Intel as separate tactical lanes with clear freshness and no false certainty.

Completion signal:

```txt
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
```

### Milestone 11: Operational Hardening And Runtime Control

Status: Complete with live operator validation deferred to Milestone 12 in `docs/roadmap/milestone-11-operational-hardening-and-runtime-control.md`.

Feature anchors:

- Element 6: Diagnostics And Degraded State
- Element 7: Settings And Runtime Control
- Element 9: External API Boundary
- Element 10: Atlas Handoff

Operational outcome:

AURA-Sense becomes stable enough for longer operator sessions with recoverable settings, visible live IO policy, explicit startup/degraded state, and quiet diagnostics review.

Completion summary:

- validated gamelog folder settings persist through a backend-owned settings file
- valid persisted gamelog settings recover at startup without auto-starting the watcher
- invalid persisted settings degrade visibly
- Passive Telemetry and Threat Intel live IO gates have one visible operator control
- sanitized diagnostics are available through a compact runtime review surface
- smoke command policy, transient Electron capture failure record, and Atlas-deferred ADR are documented

Task chain:

1. Persist and validate runtime settings.
2. Add operator-visible live IO control policy.
3. Add a compact diagnostics review surface.
4. Harden startup and session recovery states.
5. Define smoke command policy and failure records.
6. Decide Atlas handoff boundary by ADR only if a concrete workflow exists.
7. Update current-state and handover.

Autonomy envelope:

Dev may harden runtime control, diagnostics, smoke policy, and documentation. Atlas integration remains deferred unless an ADR authorizes a narrow handoff.

Acceptance gate:

AURA-Sense can run longer sessions with visible degraded states, recoverable settings, scoped network behavior, and no accidental Atlas import.

Completion signal:

```txt
runtime control verified
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
```

### Milestone 12: Live Validation And Tactical Calibration

Status: Future candidate / live-manual gated in `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`.

Feature anchors:

- Element 2: Combat Witness
- Element 3: Passive Telemetry
- Element 4: Threat Intel
- Element 6: Diagnostics And Degraded State
- Element 8: Local Metadata
- Element 9: External API Boundary
- Support Feature: Combat Logging Test Suite

Operational outcome:

AURA-Sense has recorded live/manual smoke evidence, calibrated Combat Witness metric language, and promoted only proven real-data behavior into product claims.

Task chain:

1. Define and run a live operator smoke playbook.
2. Record explicit live API smoke evidence through opt-in gates.
3. Calibrate Combat Witness weapon/spike/repair metrics against real datasets.
4. Intake exact raw repair/healing fixtures before parser expansion.
5. Harden local metadata only for active consumers.
6. Record live findings, update doctrine, and retire stale gaps.

Autonomy envelope:

Dev may add live smoke playbooks, explicit opt-in smoke harnesses, curated fixtures, calibration tests, compact metadata adapters for active consumers, audits, failures, and state records.

Dev may not broaden collection, run live APIs in `verify:all`, add ESI killmail expansion by default, persist history, or import Atlas behavior.

Acceptance gate:

AURA-Sense has live/manual evidence and calibration decisions recorded without weakening offline verification or expanding product scope.

### Milestone 13: Aggressive Testing And Bug Hunting

Status: Complete in `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`.

Feature anchors:

- Element 1: Tactical HUD Shell
- Element 2: Combat Witness
- Element 5: Clipboard Acquisition
- Element 6: Diagnostics And Degraded State
- Element 7: Settings And Runtime Control
- Element 8: Local Metadata
- Element 9: External API Boundary
- Support Feature: Combat Logging Test Suite

Operational outcome:

AURA-Sense has an adversarial testing layer that actively tries to break tactical truth boundaries, runtime recovery, provider behavior, renderer isolation, and live-readiness assumptions.

Task chain:

1. Define an aggressive test harness matrix.
2. Add hostile parser fixtures.
3. Add gamelog watcher chaos tests.
4. Add renderer/preload boundary adversarial tests.
5. Add live IO provider fault injection.
6. Add Clipboard Acquisition race tests.
7. Add runtime settings and diagnostics fault tests.
8. Expand Electron visual state regression tests.
9. Harden local metadata/SDE builder behavior before broader reliance.
10. Add bug-hunt triage and failure-record discipline.

Autonomy envelope:

Dev may add verification scripts, fixtures, smoke permutations, fake provider clients, diagnostics tests, failure records, and metadata builder verification.

Dev may not make `verify:all` depend on live network, Electron, local EVE logs, or large SDE assets. Dev may not bless downloaded SDE artifacts without deterministic tests and a handover.

Acceptance gate:

Aggressive tests cover P0 invariants, findings are recorded, reusable failures become failure records, and `npm.cmd run verify:all` remains offline and passing.

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
