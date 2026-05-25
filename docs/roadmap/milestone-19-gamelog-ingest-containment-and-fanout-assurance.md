# M19 - Gamelog Ingest Containment And Fan-Out Assurance

Status: Active

## Outcome

AURA-Sense has a security and engineering review of the EVE gamelog ingest path from configured destination through file monitoring, parser normalization, and shared event fan-out.

The review should determine whether the current implementation and deterministic tests prove that Sense cannot escape the expected log file structure, leak raw/private file content, or let malformed input poison downstream services.

## Why This Is Milestone-Sized

The gamelog ingest lane is a trust boundary:

```txt
configured/pointed log destination
-> path validation and containment
-> file-monitor filesystem access
-> parser normalization
-> shared event fan-out
-> listening services
```

It touches filesystem authority, parser rejection, diagnostics sanitization, shared channel isolation, and service listeners. That is broader than a single parser test.

## Likely Runways

- Security/Engineering-Test review of the current gamelog ingest path and existing tests.
- If accepted, a bounded Dev hardening packet for missing deterministic containment or fan-out tests.
- Optional later operator-validation planning only if explicitly authorized.

## Acceptance Criteria

M19 is complete when:

- the configured log destination path is traced from setting/input through file-monitor access
- path normalization and containment assumptions are documented
- symlink, junction, traversal, rotation, replacement, deletion, truncation, partial-line, oversized-line, and startup-offset behavior are reviewed
- parser rejection and diagnostics sanitization are reviewed
- shared event fan-out and listener isolation are reviewed
- existing deterministic tests are mapped to the trust boundary
- missing deterministic adversarial tests are identified
- no live EVE logs, private files, manual filesystem probing outside the repo, live providers, Lab work, renderer work, or SDE refresh are run

## Non-Goals

- Do not implement code in the review packet.
- Do not run live EVE log ingestion.
- Do not inspect private operator log folders.
- Do not manually probe outside repository/temp fixture paths.
- Do not run live provider smoke.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not adopt a Lab face or implement adapter work.
- Do not change renderer behavior.

## Dependencies

- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `workspace/current.md`
- gamelog file-monitor/parser/service source files identified by the reviewer
- existing gamelog, parser, replay, and diagnostics verification scripts identified by the reviewer

## Verification Shape

Review-only packet:

```powershell
npm.cmd run verify:protected-terms
git status --short --branch
```

If the reviewer chooses to rerun existing deterministic checks for context:

```powershell
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:gamelog-watcher-chaos
npm.cmd run verify:combat-parser
npm.cmd run verify:combat-parser-hostile
npm.cmd run verify:combat-replay
npm.cmd run verify:diagnostics
```

No live/manual/private filesystem work is implied.
