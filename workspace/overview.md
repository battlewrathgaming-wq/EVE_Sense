# AURA-Sense Workspace Overview

Status: Active
Last reviewed: 2026-05-24

## Vision Statement

AURA-Sense is a tactical viewport for recent EVE Online operational observations.

It should present compact, uncertainty-aware tactical state while staying transient, backend-owned, live-gated, and distinct from AURA Atlas historical evidence storage.

## Coordination Model

- `workspace/current.md` is the only active executable work packet.
- `docs/roadmap/` defines milestone meaning and accepted direction.
- Handshake files in `workspace/` are active-milestone transaction notes.
- Completed milestone handshakes move in batch to `workspace/complete/milestone-XX/`.
- Former `docs/gap` task files are archived historical context only.

## Milestone Plan

| Milestone | Roadmap Source | Status | Notes |
| --- | --- | --- | --- |
| 13 | `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md` | Complete | Offline aggressive hardening accepted; live/manual validation remains gated for later operator-validation work. |
| 14 | `docs/roadmap/milestone-14-back-page-threat-intel-ux.md` | Complete | Back-page Threat Intel UX accepted; live/manual shortcut feel remains gated for optional later operator-validation work. |

## Active Milestone

Milestone: None
Roadmap source: None
Current packet: `workspace/current.md`
Current sequence: Dev runway after accepted Passive Telemetry readout mapping
Latest accepted handshake: `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`
Active runway: Passive Telemetry Bridge State Readout prototype

## Authority Notes

Human decision recorded 2026-05-24:

- Individual projects own internal -> Bridge connections.
- Bridge -> Interface presentation should be preserved unless there is conflict or human override.
- When Bridge -> Interface terminology needs ownership, Aura Lab owns user-facing terminology.

AURA-Sense therefore owns its lane semantics and internal-to-Bridge mapping. Lab-owned Interface terminology can be used for Bridge-facing presentation where it does not conflict with Sense doctrine, lane boundaries, or human direction.

## Durable Record Index

### Current State

- `docs/current-state/current-implementation.md`

### Roadmap

- `docs/roadmap/README.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/roadmap/milestone-14-back-page-threat-intel-ux.md`

### Contracts And Doctrine

- `docs/contracts/`
- `docs/adr/`
- `docs/tenets/`
- `docs/statements/`
- `docs/features/`

### Verification

- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`

### Historical Archives

- `docs/archive/deprecated-gap-workflow-2026-05-23/`
- `docs/audits/`
- `workspace/archive/` legacy packet archive if present

### Shared Coordination Authority

- `F:\Projects\Docs\Aura-Agent-Coordination\workspace-structure-authority.md`
- `F:\Projects\Docs\Aura-Agent-Coordination\roles\README.md`
- `F:\Projects\Docs\Aura-Agent-Coordination\roles\[role]\README.md`
- `F:\Projects\Docs\Aura-Agent-Coordination\roles\[role]\prompt.md`

## Open Questions

- Which remaining live/manual validation items should move into a later operator-validation milestone?
- Whether Dev's Passive Telemetry Bridge State Readout prototype should be accepted after `workspace/DevHS01-passive-telemetry-readout-prototype.md`.
- What Sense-local milestone should open after the advisory review, if any?
