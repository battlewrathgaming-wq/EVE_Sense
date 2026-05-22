# Milestone 01: Startup Rigging And Current-State Alignment

Status: Active
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Milestone Overview

This milestone gets AURA-Sense safely moving from a verified Aura Core seed into the first AURA-Sense-specific runtime work.

The goal is not Aura 7 parity yet. The goal is to establish a clean starting line: current-state truth is explicit, historical Aura 7 notes are treated as lineage rather than proof, the renderer boundary remains guarded, and service/IPC validation is strong enough that future telemetry lanes cannot be driven into invalid or misleading states from the UI.

AURA-Sense should start boring and observable. The first Dev slices should reduce ambiguity before adding tactical features. If a task requires Passive Telemetry, Threat Intel, zKill, ESI, settings persistence, or Combat Witness runtime behavior that does not yet exist in this seed, Dev should either create the smallest explicit contract/gap for that missing boundary or defer the task until the runtime lane exists.

Milestone success means a new Dev session can answer:

```txt
What is implemented now?
What is only inherited scope?
What boundary is being hardened next?
What verification proves it?
What must remain deferred?
```

## Current Starting Truth

- AURA-Sense is currently a rewrite seed, not Aura 7 runtime parity.
- `npm.cmd run verify:all` is the offline confidence command.
- Seed verification covers core utilities, services, HTTP client behavior, Frame module behavior, renderer shell behavior, and renderer boundary static checks.
- EVE runtime lanes are not rebuilt yet.
- Historical Aura 7 audits and concept docs are useful context, but current-state notes and the docs context handover take precedence.

## Doctrine Guardrails

- Renderer presents snapshots and events; it must not own telemetry authority.
- Passive Telemetry, Threat Intel, and Combat Witness stay separate.
- zKill is discovery only; ESI-expanded killmails are the source of truth for scoped Threat Intel.
- Combat Witness remains transient observed telemetry, not evidence-grade history.
- UI language must remain observation-safe: observed, scoped, recent, partial, witnessed, stale, expired.
- Do not import Atlas persistence, watch execution, retention, queue, or historical evidence semantics into AURA-Sense core.
- Do not create placeholder runtime systems that make the docs sound more implemented than the code.

## Ranked Dev Task Lines

### P0: Establish Current-State Control

- P0-01: Run `npm.cmd run verify:all` before and after any milestone change; record failures with the exact failing check.
- P0-02: Treat `docs/audits/audit-2026-05-22-docs-context-handover.md` as the active handover for this milestone.
- P0-03: Treat older Aura 7 implementation audits as historical where they conflict with `docs/current-state/current-implementation.md`.
- P0-04: Update `docs/contracts/renderer-boundary-contract.md` so its verification section names `npm run verify:renderer-boundary`.
- P0-05: Keep `docs/gap/complete/readiness-01-verification-harness.md` and `docs/gap/complete/readiness-02-renderer-boundary-static-checks.md` retired as complete; do not reopen them unless verification regresses.
- P0-06: Fix or replace references to missing docs such as `Docs/terms/metadata.md` before assigning a Dev slice that depends on them.

### P1: Harden The Existing Service Boundary

Status: Complete in `docs/gap/complete/readiness-03-ipc-settings-validation.md`.

- P1-01: Scope `readiness-03-ipc-settings-validation.md` to the current seed boundary before implementation. Complete.
- P1-02: Validate `aura:service:invoke` request shape before dispatch: command must be a non-empty string, payload must be object-like, task flags must be boolean, and unknown fields must not silently change execution class.
- P1-03: Validate existing command payloads first, especially `util.checksum`, `task.list`, and `task.cancel`.
- P1-04: Add verification for accepted and rejected service payloads without launching Electron.
- P1-05: Preserve stable service error taxonomy for validation failures.
- P1-06: Do not implement AURA-Sense settings, active scan, or watcher restart services until those runtime-lane gaps exist. Complete; validators are prepared, but product services were not invented.
- P1-07: After validation lands, update the service command contract with the real enforced request and failure shapes. Complete.

### P2: Prepare Runtime-Lane Entry Without Building Ahead Of The Boundary

- P2-01: Define the first AURA-Sense settings/runtime contract only when a concrete settings service is introduced.
- P2-02: Keep diagnostics throttling next after IPC validation, but apply it only to existing diagnostics paths unless a runtime lane is being added in the same scoped slice.
- P2-03: Defer zKill discovery-ref normalization until a Threat Intel client or adapter exists in AURA-Sense.
- P2-04: Defer Threat Intel sample metadata until zKill discovery and ESI expansion exist in AURA-Sense.
- P2-05: Defer Combat Witness rolling cache implementation until log observation and parser fixture boundaries are defined.
- P2-06: When the first runtime lane begins, create fixtures before UI expansion.

### P3: Documentation And Continuity Cleanup

- P3-01: Add or update terms for `metadata`, `AURA-Sense`, and `core seed` so gap references resolve cleanly.
- P3-02: Mark historical audits as historical snapshots if they mention old Aura 7 files, old script names, or missing `verify:all`.
- P3-03: Keep `docs/current-state/current-implementation.md` updated after each meaningful implementation change.
- P3-04: Move completed gap packets to `docs/gap/complete` with verification output and deferred risks.
- P3-05: Do not delete historical concept docs; add precedence notes where confusion is likely.

## Authorized First Slice

Completed:

```txt
docs/gap/complete/readiness-03-ipc-settings-validation.md
```

Overseer constraint:

```txt
Validation for the current seed service boundary landed first.
Settings, scans, zKill, ESI, and renderer-facing runtime behavior were not invented inside this slice.
```

Observed verification:

```powershell
npm.cmd run verify:all
```

Handover:

- `docs/audits/audit-2026-05-22-ipc-settings-validation-handover.md`

## Milestone Completion Signal

This milestone is complete when:

- renderer boundary contract reflects existing verification
- missing documentation references are resolved or corrected
- current seed service IPC validation is implemented and verified
- `verify:all` remains offline and passing
- docs clearly distinguish implemented seed behavior from inherited Aura 7 tactical scope
- the next milestone can start one runtime lane without ambiguity about ownership or verification

## Explicit Deferrals

- Aura 7 runtime parity
- Passive Telemetry implementation
- Threat Intel zKill/ESI implementation
- Combat Witness parser/cache/snapshot implementation as milestone startup work; future presentation remains deferred
- Atlas persistence or handoff model
- production HUD expansion
- live API smoke checks inside `verify:all`

## Source Notes

- `docs/audits/audit-2026-05-22-docs-context-handover.md`
- `docs/current-state/current-implementation.md`
- `docs/current-state/seed-current-state.md`
- `docs/gap/to-do/performance-stability-compute-readiness.md`
- `docs/gap/complete/readiness-03-ipc-settings-validation.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/service-command-contract.md`
