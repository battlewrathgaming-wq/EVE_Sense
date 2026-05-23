# Current Workspace Packet

Status: Active
Updated: 2026-05-23
Owner: Overseer planning, Dev execution

## Coordination State

Active milestone: Milestone 13 - Aggressive Testing And Bug Hunting
Roadmap source: `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
Sequence: HS01
Previous accepted handshake: None under the new workspace handshake sequence
Current executor: Dev
Current focus: provider/live fault hardening and runtime diagnostics faults
Expected output: DevHS01-sense-aggressive-hardening-runway.md
Archive target on milestone completion: `workspace/complete/milestone-13/`

## Purpose

This is the only active executable work packet for AURA-Sense.

The former `docs/gap` task lifecycle has been archived under `docs/archive/deprecated-gap-workflow-2026-05-23/`. Those files are historical context only. This packet now carries the executable runway.

## Required Reading

- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/audits/audit-2026-05-23-active-todo-trail-review.md`
- `F:\Projects\Docs\Aura-Agent-Coordination\workspace-structure-authority.md`

## Runway Objective

Continue Milestone 13 by converting the next useful aggressive-testing work into deterministic, observable hardening without broadening AURA-Sense product scope.

Focus first on provider/live fault handling and runtime settings/diagnostics fault behavior. Treat live/manual packets as gated evidence work, not default Dev execution.

## Ordered Runway

1. Provider/live IO fault injection:
   - simulate blocked, timeout, cancel, retry exhaustion, 429, 500, malformed JSON, non-array provider responses, stale cache, and ETag/revalidation failure behavior where applicable
   - prove failures remain lane-specific and operator-visible
   - keep live APIs outside `verify:all`
2. Runtime settings and diagnostics fault tests:
   - cover corrupted JSON, schema drift, missing or invalid directories, permission-like failures, save/load race-like behavior, diagnostic limit enforcement, and sanitization/redaction behavior
3. Documentation/test index reconciliation:
   - update durable docs only if implementation truth, verification command inventory, or milestone meaning changes
   - do not recreate `docs/gap` task files
4. If the first two slices are completed cleanly and verification remains green, prepare the next runway recommendation for local metadata/SDE hardening and bug-hunt triage.

## Guardrails

- Renderer presents; backend owns truth.
- Do not run live APIs inside `verify:all`.
- Do not add Atlas persistence.
- Do not broaden collection.
- Do not persist private logs.
- Do not weaken renderer boundary checks.
- Do not stage downloaded SDE ZIPs by default.
- Bug-hunting helpers are not product features unless explicitly accepted.
- Archived gap files are historical context, not active work packets.

## Stop Conditions

Return to chat before continuing if:

- live network/API action is needed without explicit operator authorization
- a test failure reveals a doctrine or architecture decision
- current-state, roadmap, observed code, and this packet disagree materially
- generated SDE or private operator artifacts would need to be retained or staged
- the working tree contains overlapping unknown changes in files needed for this runway

## Verification Required

Run the focused verification added or affected by the work, then run:

```powershell
npm.cmd run verify:all
```

Do not run by default:

- `npm.cmd run smoke:electron` unless renderer/smoke behavior changes or Overseer requests it
- live API smoke unless explicitly gated with operator approval
- manual operator smoke

## Evidence

Dev updates this before handoff.

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
- handshake created:
- remaining risk:

## Overseer Review

Overseer fills this in after Dev handoff:

- accepted / redirected:
- doctrine drift:
- architecture risk:
- state updates needed:
- next packet:
