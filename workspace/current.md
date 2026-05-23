# Current Workspace Packet

Status: Active
Updated: 2026-05-23
Owner: Overseer planning, Dev execution

## Purpose

This is the overwriteable current milestone/task packet.

Overseer may replace this file whenever the active milestone, task queue, or focus changes. Dev should treat this file as the current execution context when the user sends `.`.

## Current Milestone

Milestone 13: Aggressive Testing And Bug Hunting

Primary source:

- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`

## Intent

Increase confidence by trying to break AURA-Sense without adding product scope.

The current priority is adversarial verification:

- parser hostile inputs
- gamelog watcher chaos
- renderer/preload boundary misuse
- live IO/provider fault injection
- clipboard lifecycle races
- runtime settings/diagnostics faults
- visual state regressions
- local metadata/SDE hardening

## Tree Health Requirement

Before implementation, Dev must run:

```powershell
git status --short
```

Rules:

- Do not ignore dirty tree state.
- Preserve unrelated user/Dev changes.
- If changes overlap the task, inspect them and work with them.
- If generated SDE artifacts exist, do not stage them by default.
- If the tree is too ambiguous to proceed safely, return to chat.

## Source Documents

Read before implementation:

- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- latest relevant `docs/audits/` handover

## Guardrails

- Renderer presents; backend owns truth.
- Do not run live APIs inside `verify:all`.
- Do not add Atlas persistence.
- Do not broaden collection.
- Do not persist private logs.
- Do not weaken renderer boundary checks.
- Do not stage downloaded SDE ZIPs by default.
- Bug-hunting helpers are not product features unless explicitly accepted.

## Task Queue

Work top to bottom. Skip only with evidence and explanation.

### P0

1. Continue the first incomplete P0 aggressive-testing packet:
   - `docs/gap/to-do/aggressive-test-harness-matrix.md`
   - `docs/gap/to-do/combat-parser-hostile-fixtures.md`
   - `docs/gap/to-do/gamelog-watcher-chaos-tests.md`
   - `docs/gap/to-do/renderer-preload-boundary-adversarial-tests.md`
2. Add or update deterministic verification.
3. Run `npm.cmd run verify:all`.

### P1

Continue after P0 packets or explicit direction:

- `docs/gap/to-do/live-io-provider-fault-injection.md`
- `docs/gap/to-do/clipboard-acquisition-race-tests.md`
- `docs/gap/to-do/runtime-settings-diagnostics-fault-tests.md`
- `docs/gap/to-do/electron-visual-state-regression-tests.md`

### P2

Continue only after higher-priority work or explicit direction:

- `docs/gap/to-do/local-metadata-sde-builder-hardening.md`
- `docs/gap/to-do/bug-hunt-triage-and-failure-records.md`
- `docs/gap/to-do/native-gamelog-folder-picker.md`
- `docs/gap/to-do/active-scan-validator-reconciliation.md`

## Evidence

Dev updates this section before handoff.

Verification run:

```txt
Not yet run for this packet.
```

Files changed:

```txt
Not yet recorded.
```

Findings:

```txt
Not yet recorded.
```

Deferrals:

```txt
Not yet recorded.
```

## Dev Handoff

Dev fills this in when work is complete:

- completed tasks:
- tests added/updated:
- verification output:
- failures found:
- failure records created:
- docs/gaps moved or updated:
- remaining risk:

## Overseer Review

Overseer fills this in after Dev handoff:

- accepted / redirected:
- doctrine drift:
- architecture risk:
- state updates needed:
- next packet:
