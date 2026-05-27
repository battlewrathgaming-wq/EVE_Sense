# AURA-Sense Documentation

This folder records AURA-Sense product rules, contracts, current state, failures, and future work.

The authoritative implementation truth lives in `docs/current-state/current-implementation.md`. That file also records the current ADR-0008 reconciliation state for I/O ingest authority. The display pipeline current-state map lives in `docs/current-state/display-pipeline-inventory.md`. The current meaning-geometry workflow note lives in `docs/current-state/display-meaning-geometry-workflow.md`. Audit files are dated review records and should remain intact.

## Product Summary

AURA-Sense is a tactical viewport for recent EVE Online operational observations.

It is:

- tactical
- transient by default
- backend-owned
- renderer-presented
- low-retention
- uncertainty-aware
- live-gated

It is not:

- AURA Atlas
- a historical storage system
- a broad scraper
- a fleet command system
- a renderer-owned telemetry engine

## Folder Roles

| Folder | Role |
| --- | --- |
| `current-state/` | What the implementation currently does, including durable pipeline/display records. |
| `audits/` | Dated reviews and handovers. Do not rewrite as product copy. |
| `tenets/` | Stable project rules. |
| `contracts/` | Service, renderer, telemetry, and lane contracts. |
| `adr/` | Accepted architecture decisions, including tactical scope, target-owned presentation adapter ownership, Sense instrument-effect presentation boundaries, Clipboard Acquisition authority, gameplay-companion interaction, Combat Witness inference boundaries, and I/O ingest authority. |
| `features/` | Product capability goalposts. |
| `terms/` | Plain-language vocabulary. |
| `schemas/` | Data structures and snapshot/event shapes. |
| `roadmap/` | Feature-aligned milestones. |
| `archive/deprecated-gap-workflow-2026-05-23/` | Historical archive of the former gap task-file workflow. Not active execution. |
| `testing/` | Verification matrices and test strategy. |
| `statements/` | Operational doctrine. |
| `failures/` | Preserved bug classes. |
| `module/` | Reusable implementation module notes. |
| `Concept/` | High-level concept references. These must stay aligned with current state. |
| `research/` | Non-authoritative findings. |
| `templates/` | Document templates. |

Repo root:

| Path | Role |
| --- | --- |
| `workspace/` | Active agent coordination bridge. `workspace/current.md` is the only executable packet; handshakes are transaction notes. |

## Core Rules

- AURA-Sense observes now; AURA Atlas remembers later.
- AURA-Sense is a companion for existing EVE gameplay, not a second app loop.
- Renderer presents snapshots and events; it does not own telemetry truth.
- Combat Witness is rolling tactical telemetry, not stored history.
- Combat Witness displays log-derived observations and computations; the player infers tactical meaning.
- Passive Telemetry must not contaminate Threat Intel.
- Threat Intel scans are explicit and scoped.
- Clipboard Acquisition is armed, visible, short-lived, and sealed after use.
- I/O off means Sense is not allowed to ingest; older narrower gate decisions require reconciliation where applicable.
- Live APIs are opt-in and outside deterministic non-live verification.
- Local metadata is preferred for static type/system labels.
- UI copy must not overclaim certainty.

## Current Work

The current hardening lane is complete. Active execution is now carried by `workspace/current.md`; the former `docs/gap` task lifecycle is archived.

Start with:

- `workspace/README.md` when the user sends `.`
- `workspace/current.md` for the active overwriteable milestone/task packet
- `workspace/overseer.md` before opening or refreshing a runway when fresh Overseer context is not already present
- `docs/current-state/current-implementation.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/current-state/display-meaning-geometry-workflow.md`
- `docs/roadmap/README.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `workspace/overview.md`

## Update Rule

Update durable docs when the product meaning changes:

- lane boundaries
- contracts
- schemas
- feature goalposts
- failure lessons
- current implementation truth
- roadmap direction

Do not rewrite audits or current-state files during normal product-copy cleanup.

## Deprecated Gap Workflow

The former docs/gap/to-do and docs/gap/complete task files were moved to docs/archive/deprecated-gap-workflow-2026-05-23/. Treat them as historical context only unless workspace/current.md explicitly references an archived file.


