# Current Workspace Packet

Status: Active
Updated: 2026-05-24
Owner: Overseer planning, Dev execution

## Coordination State

Active milestone: Milestone 13 - Aggressive Testing And Bug Hunting
Roadmap source: `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
Sequence: HS02
Previous accepted handshake: `workspace/DevHS01-sense-pre-bridge-hardening.md`
Current executor: Dev
Current focus: local metadata/SDE builder hardening and bug-hunt triage
Expected output: `DevHS02-sense-metadata-bughunt-hardening.md`
Archive target on milestone completion: `workspace/complete/milestone-13/`

## Purpose

This is the only active executable work packet for AURA-Sense.

HS01 is accepted. It hardened the Sense-local logger -> runtime -> snapshot -> preload bridge -> renderer path, added initial offline provider/runtime fault coverage, updated Evidence / Dev Handoff, and created `workspace/DevHS01-sense-pre-bridge-hardening.md`.

The former `docs/gap` task lifecycle has been archived under `docs/archive/deprecated-gap-workflow-2026-05-23/`. Those files are historical context only.

## Required Reading

- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `workspace/DevHS01-sense-pre-bridge-hardening.md`
- `workspace/OverseerHS02-sense-hs01-review-and-next-runway.md`

## Runway Objective

Continue Milestone 13 by hardening the remaining local metadata/SDE and bug-hunt evidence surfaces without broadening product scope.

This packet should make local metadata refresh helpers adversarially safe, then add a bug-hunt triage/failure-record pass that records reusable findings or explicit no-finding evidence. Keep all checks deterministic, offline, and separate from live/manual smoke.

## Overseer Review Of HS01

Decision: accepted.

Verification observed by Overseer:

```powershell
npm.cmd run verify:all
```

Result: passed.

HS01 accepted work:

- watcher status-only changes now emit renderer-facing Combat Witness snapshots
- gamelog tail offsets advance only after appended bytes are read successfully
- Combat Witness bridge validates sender before backend service subscription
- renderer Combat Witness state reconciles watcher state with freshness
- runtime settings write failures degrade visibly
- offline provider/runtime fault tests were expanded
- `workspace/DevHS01-sense-pre-bridge-hardening.md` was created

Residual note:

- watcher start may emit duplicate operational snapshots through both watcher callback and runtime start publication. This is not blocking because snapshot bridge throttling and idempotent renderer rendering keep it safe, but it can be cleaned up if it becomes noisy.

## Ordered Runway

1. Local metadata/SDE builder hardening:
   - stress source-bundle staging/cleanup and local type metadata refresh helpers with deterministic fixtures only
   - cover malformed JSONL, duplicate type IDs, invalid rows, missing required fields, unsupported compression or malformed ZIP/source payloads where applicable, huge-entry/path-boundary behavior, cleanup after failure, and provenance/status reporting
   - do not download real SDE assets by default
   - do not stage generated large SDE outputs by default
2. Local metadata consumer behavior:
   - prove read-only lookup behavior remains bounded for unresolved IDs, malformed artifacts, missing artifacts, duplicate records, and stale/static fixture artifacts
   - keep local metadata as helper context, not tactical truth
3. Bug-hunt triage and failure records:
   - perform a scoped offline bug-hunt pass over the Milestone 13 hardening surfaces already touched
   - record reusable bug classes in `docs/failures/` only when a real reusable failure is found
   - if no reusable failure is found, record explicit no-finding evidence in the Dev handoff
   - keep exploratory bug-hunt notes distinct from product claims
4. Provider/runtime follow-up only if still bounded:
   - add narrow offline provider trace assertions if HS01 left an obvious lane-specific visibility gap
   - do not reopen live API smoke, Electron smoke, or manual operator smoke unless explicitly authorized
5. Documentation/test index reconciliation:
   - update durable docs only if implementation truth, verification command inventory, or milestone meaning changed
   - do not recreate `docs/gap` task files
6. Next-runway recommendation:
   - recommend whether Milestone 13 is ready for closure review, needs another bug-hunt pass, or should defer remaining live/manual validation to a later operator-validation milestone

## Guardrails

- Renderer presents; backend owns truth.
- Keep this Sense-local.
- Do not create shared Aura doctrine.
- Do not create Lab/Core adapters or reusable bridge packages.
- Do not run live APIs inside `verify:all`.
- Do not add Atlas persistence.
- Do not broaden collection.
- Do not persist private logs.
- Do not weaken renderer boundary checks.
- Do not stage downloaded SDE ZIPs or large generated metadata by default.
- Bug-hunting helpers are not product features unless explicitly accepted.
- Archived gap files are historical context, not active work packets.

## Stop Conditions

Return to chat before continuing if:

- live network/API action is needed without explicit operator authorization
- real SDE downloads or large generated artifacts would need to be retained or staged
- a metadata hardening fix would require product semantics beyond local helper lookup
- a bug-hunt finding reveals a doctrine or architecture decision
- current-state, roadmap, observed code, and this packet disagree materially
- the working tree contains overlapping unknown changes in files needed for this runway

## Verification Required

Run focused verification added or affected by the work, then run:

```powershell
npm.cmd run verify:all
```

Likely focused commands, depending on files touched:

```powershell
npm.cmd run verify:local-type-metadata
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
