# Gap Analysis: Implementation Alignment

Date: 2026-05-22
Status: Open

## Purpose

This gap analysis turns the current-state audit into actionable rigging work.

The aim is not to make AURA-Sense bigger. The aim is to keep the rushed prototype aligned with the documentation before more UI or tactical features are added.

Related audit:

- `docs/audits/audit-2026-05-22-current-state-alignment.md`

## Priority 1: UI Language And Certainty Contract

### Actionables

- Replace overclaiming labels with observation-safe labels.
- Add evidence/sample wording to Threat Intel.
- Add stale/recent/observed wording to Combat Witness.
- Define approved terms for tactical UI copy.

### Current Examples

Potentially overclaiming:

- `Primary Hostile Corp`
- `Primary Aggressor`
- `Active Pilots`
- `Threat Intel` without sample/cap detail

Preferred direction:

- `Observed Corp`
- `Top Observed Attacker`
- `Observed Pilots`
- `Scoped Threat Scan`
- `Partial sample`
- `Expanded N of M discovered refs`

### Completion Signal

Renderer labels follow AURA-Sense's doctrine:

```txt
observed, recent, scoped, partial, witnessed
```

instead of implying complete certainty, hostility, or persistent state.

## Priority 2: Threat Intel Evidence Basis

### Actionables

- Include discovered ref count, expanded killmail count, failed expansion count, and scope window in scan result.
- Distinguish discovered zKill refs from expanded ESI evidence in the returned payload.
- Show partial sample status in the HUD.
- Guard zKill non-array responses before slicing.
- Preserve the rule that tactical summaries come from expanded ESI killmails.

### Current Gap

`IntelService` currently uses:

- zKill count as `activity.killCount`
- first 8 refs for ESI expansion
- recent activity from expanded killmails

The UI does not explain that the scan may be capped or partial.

### Completion Signal

Every active scan can answer:

```txt
Scope: 1h
Discovered refs: N
Expanded evidence: M
Failed expansions: X
Sample status: partial/complete
```

## Priority 3: Combat Witness Backend Model

### Actionables

- Introduce a normalized combat event object.
- Add backend rolling witness cache.
- Add short-window snapshot computations.
- Separate snapshot metrics from one-shot event streams.
- Add fixture tests for parsed combat lines and expiry behavior.

### Current Gap

Combat Witness currently emits parsed combat lines directly to the renderer and displays a six-item recent feed.

It does not yet provide:

- rolling DPS/HPS windows
- pressure gauge
- EWAR observations
- combat topology
- alpha spike event stream
- stale/expired state handling

### Completion Signal

Combat Witness can produce backend-owned snapshots such as:

```txt
receivedDps15s
observedRepairs15s
pressureState
recentEwar
recentSpikeEvents
```

The renderer only presents these snapshots/events.

## Priority 4: Renderer Boundary Verification

### Actionables

- Add static checks that renderer does not call `fetch`.
- Add static checks that renderer does not import main-process modules.
- Add static checks that renderer does not parse logs.
- Add verification that combat and threat state in renderer are presentation-only.

### Current Gap

The architecture mostly follows the boundary, but the verification is partial and focused on passive isolation.

### Completion Signal

A verification script proves renderer remains presentation-only for known boundaries.

## Priority 5: IPC / Service Contract Hardening

### Actionables

- Define command request/response shapes for current IPC calls.
- Validate active scan payloads.
- Validate settings payloads.
- Add action classes: local-only, live-network, telemetry, window, settings.
- Make network/live requirement explicit in command responses.

### Current Gap

The preload API is small and safe-ish, but IPC handlers are direct feature handlers, not a formal service contract.

### Completion Signal

Each IPC action has:

- command name
- input shape
- output shape
- live API requirement
- failure shape
- verification

## Priority 6: Local Metadata Expansion

### Actionables

- Add local ship/type lookup metadata.
- Replace `Type <id>` UI output with `Name [typeID: id]` where available.
- Keep unresolved IDs visible when labels are missing.

### Current Gap

System names are local-first. Ship/type labels are not.

### Completion Signal

Threat Intel timelines show readable ship labels without live ESI type lookups.

## Priority 7: Verification Grouping

Status: Complete for the current seed harness in `docs/gap/complete/readiness-01-verification-harness.md`.

### Actionables

- Keep `verify:all` as the grouped offline confidence command.
- Keep live/network-free checks separate from any real live smoke.
- Include all existing verification scripts.
- Add future checks as contracts harden.

### Current Gap

Verification grouping exists for the current Aura Core seed checks. The remaining gap is to extend that harness as AURA-Sense-specific contracts are implemented.

### Completion Signal

One command verifies the current offline confidence set.

Suggested initial group:

```txt
verify:entity
verify:network
verify:rendering
verify:network-rendering
verify:passive-isolation
verify:compact-hud
```

## Priority 8: Settings And Operational Safety

### Actionables

- Validate settings payloads before saving.
- Preserve safe defaults if user-agent is blank.
- Consider path existence feedback before restarting watcher.
- Decide whether dev runtime storage should avoid unexpected C: writes, as Atlas did.

### Current Gap

Settings are simple and functional, but not strongly validated.

### Completion Signal

Settings changes cannot silently put services into an invalid or misleading state.

## Priority 9: Documentation Follow-Through

### Actionables

- Promote implemented current-state details into `docs/current-state/`.
- Add failure records when gaps are fixed because of discovered drift.
- Update contracts from `Seed` to `Active` as implementation verifies them.

### Current Gap

The docs structure exists, but most current-state and contract docs are still seed-level.

### Completion Signal

Docs explain both:

```txt
what AURA-Sense intends
what AURA-Sense currently does
```

without relying on concept docs alone.

## Recommended Implementation Order

1. Add UI language/evidence-basis pass.
2. Add renderer boundary verification.
3. Add IPC payload validation.
4. Add Combat Witness normalized event + rolling cache.
5. Add Combat Witness fixture tests.
6. Add local ship/type metadata lookup.
7. Re-audit before richer HUD modes.

This order keeps the product from drifting while still allowing practical incremental development.


