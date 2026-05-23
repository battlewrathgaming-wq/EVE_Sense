# Milestone 13: Aggressive Testing And Bug Hunting

Status: Planned / Parallel Hardening Runway
Date: 2026-05-23
Owner: Overseer direction, Dev execution

## Vision Setting

Milestone 13 exists to find bugs before live pressure finds them.

AURA-Sense has a strong deterministic verification spine. This milestone makes it adversarial: hostile inputs, race surfaces, corrupted settings, provider failure sequences, renderer boundary attacks, visual state permutations, and emerging metadata/SDE hardening.

This milestone does not add product features. It adds confidence under pressure.

## Feature Anchors

- `docs/features/vision.md` Element 1: Tactical HUD Shell
- `docs/features/vision.md` Element 2: Combat Witness
- `docs/features/vision.md` Element 5: Clipboard Acquisition
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/vision.md` Element 7: Settings And Runtime Control
- `docs/features/vision.md` Element 8: Local Metadata
- `docs/features/vision.md` Element 9: External API Boundary
- `docs/features/combat-logging-test-suite.md`

## Operational Outcome

AURA-Sense has an adversarial testing layer that actively tries to break tactical truth boundaries, runtime recovery, provider behavior, renderer isolation, and live-readiness assumptions.

## Priority Task Chain

### P0 Task 1: Aggressive Test Harness Matrix

- Define what belongs in `verify:all`, Electron smoke, live API smoke, live operator smoke, and manual bug hunts.
- Add a matrix that maps each invariant to its verification command.
- Keep `verify:all` offline and deterministic.

Task packet: `docs/gap/complete/aggressive-test-harness-matrix.md`.

Status: Complete in `docs/gap/complete/aggressive-test-harness-matrix.md`; matrix lives in `docs/testing/aggressive-test-harness-matrix.md`.

### P0 Task 2: Combat Parser Hostile Fixtures

- Add malformed, near-miss, oversized, timestamp-edge, duplicate, private-content, and misleading combat lines.
- Prove rejection, hashing, and diagnostic behavior.
- Avoid widening parser claims without exact accepted fixtures.

Task packet: `docs/gap/complete/combat-parser-hostile-fixtures.md`.

Status: Complete in `docs/gap/complete/combat-parser-hostile-fixtures.md`; focused command is `npm.cmd run verify:combat-parser-hostile`.

### P0 Task 3: Gamelog Watcher Chaos Tests

- Stress offset seeding, append-only reads, partial lines, truncation, rotation, duplicate suppression, deleted files, fallback strategy, and listener failures.
- Prove no old-file replay and no raw-line diagnostic leakage.

Task packet: `docs/gap/complete/gamelog-watcher-chaos-tests.md`.

Status: Complete in `docs/gap/complete/gamelog-watcher-chaos-tests.md`; focused command is `npm.cmd run verify:gamelog-watcher-chaos`.

### P0 Task 4: Renderer/Preload Boundary Adversarial Tests

- Attempt renderer misuse patterns against service bridge, preload API, provider strings, filesystem access, parser ownership, and subscription cleanup.
- Preserve renderer presentation-only doctrine.

Task packet: `docs/gap/complete/renderer-preload-boundary-adversarial-tests.md`.

Status: Complete in `docs/gap/complete/renderer-preload-boundary-adversarial-tests.md`; focused command is `npm.cmd run verify:renderer-boundary-adversarial`.

### P1 Task 5: Live IO Provider Fault Injection

- Simulate blocked, timeout, cancel, retry exhaustion, 429, 500, malformed JSON, non-array zKill/ESI responses, stale cache, and ETag revalidation failures.
- Prove failures remain lane-specific and operator-visible.

Task packet: `docs/gap/to-do/live-io-provider-fault-injection.md`.

### P1 Task 6: Clipboard Acquisition Race Tests

- Stress rapid arm/cancel/capture, unchanged clipboard, rejected content, cooldown re-arm, scan failure during capture, and concurrent global shortcut/UI arm paths.

Task packet: `docs/gap/complete/clipboard-acquisition-race-tests.md`.

Status: Complete in `docs/gap/complete/clipboard-acquisition-race-tests.md`; focused command is `npm.cmd run verify:clipboard-race`.

### P1 Task 7: Runtime Settings And Diagnostics Fault Tests

- Test corrupted JSON, schema drift, missing directories, permission-like failures, save/load races, diagnostic limit enforcement, and sanitization.

Task packet: `docs/gap/to-do/runtime-settings-diagnostics-fault-tests.md`.

### P1 Task 8: Electron Visual State Regression Tests

- Expand smoke coverage across stale, degraded, blocked, partial, cooldown, diagnostics, settings, and narrow viewport states.
- Record artifacts without making Electron a dependency of `verify:all`.

Task packet: `docs/gap/complete/electron-visual-state-regression-tests.md`.

Status: Complete in `docs/gap/complete/electron-visual-state-regression-tests.md`; focused command is `npm.cmd run smoke:electron`.

### P2 Task 9: Local Metadata / SDE Builder Hardening

- Verify local metadata and SDE ZIP/source helpers before acceptance.
- Bound downloads, ZIP parsing, cleanup, path handling, malformed JSONL, duplicate IDs, unsupported compression, and huge-entry behavior.
- Keep this outside product runtime until a real consumer and verification exist.

Task packet: `docs/gap/to-do/local-metadata-sde-builder-hardening.md`.

### P2 Task 10: Bug Hunt Triage And Failure Records

- Add a bug triage protocol.
- Convert reusable failures into `docs/failures`.
- Keep bug-hunt artifacts distinct from product claims.

Task packet: `docs/gap/to-do/bug-hunt-triage-and-failure-records.md`.

## Autonomy Envelope

Dev may touch:

- verification scripts
- fixture datasets
- smoke scripts
- diagnostics tests
- parser/watcher tests
- provider fake clients and test harnesses
- docs/failures and audits
- metadata builder verification and SDE artifact provenance checks

Dev may not:

- make `verify:all` depend on live network, Electron, local EVE logs, or large external SDE assets
- add broad background collection
- add Atlas persistence
- weaken renderer boundary checks
- persist private logs
- promote uncalibrated tactical claims
- silently accept downloaded SDE artifacts as product truth

## Acceptance Gate

Milestone 13 is complete when:

- adversarial tests cover P0 invariants
- at least one bug-hunt pass records findings or explicit no-finding evidence
- reusable bug classes are captured in `docs/failures`
- `npm.cmd run verify:all` passes
- Electron smoke remains separate and passes if renderer/smoke behavior changes
- live/manual tests stay outside `verify:all`

## Expected Handover

Dev handover should include:

- tests added by category
- failures found and fixes applied
- failure records created
- tests intentionally kept outside `verify:all`
- metadata/SDE hardening findings and artifact retention decision
- verification output
- remaining risk
