# AURA-Sense Documentation

This folder records AURA-Sense product rules, contracts, current state, failures, and future work.

The authoritative implementation truth lives in `docs/current-state/current-implementation.md`. Audit files are dated review records and should remain intact.

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
- a historical evidence store
- a broad scraper
- a fleet command system
- a renderer-owned telemetry engine

## Folder Roles

| Folder | Role |
| --- | --- |
| `current-state/` | What the implementation currently does. |
| `audits/` | Dated reviews and handovers. Do not rewrite as product copy. |
| `tenets/` | Stable project rules. |
| `contracts/` | Service, renderer, telemetry, and lane contracts. |
| `features/` | Product capability goalposts. |
| `terms/` | Plain-language vocabulary. |
| `schemas/` | Data structures and snapshot/event shapes. |
| `roadmap/` | Feature-aligned milestones. |
| `gap/to-do/` | Active work packets. |
| `gap/complete/` | Completed work packets. |
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
| `workspace/` | Dot-protocol attention and execution queue. When the user sends `.`, read this folder from top to bottom. |

## Core Rules

- AURA-Sense observes now; AURA Atlas remembers later.
- Renderer presents snapshots and events; it does not own telemetry truth.
- Combat Witness is rolling tactical telemetry, not evidence history.
- Passive Telemetry must not contaminate Threat Intel.
- Threat Intel scans are explicit and scoped.
- Clipboard Acquisition is armed, visible, short-lived, and sealed after use.
- Live APIs are opt-in and outside deterministic offline verification.
- Local metadata is preferred for static type/system labels.
- UI copy must not overclaim certainty.

## Current Work

The current hardening lane is aggressive testing and bug hunting.

Start with:

- `workspace/README.md` when the user sends `.`
- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/gap/to-do/README.md`

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
