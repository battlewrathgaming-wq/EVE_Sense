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
| 14 | `docs/roadmap/milestone-14-back-page-threat-intel-ux.md` | Active | Threat Intel back-page UX slice after hardening acceptance. |

## Active Milestone

Milestone: 14 - Back-Page Threat Intel UX
Roadmap source: `docs/roadmap/milestone-14-back-page-threat-intel-ux.md`
Current packet: `workspace/current.md`
Current sequence: HS01
Latest accepted handshake: Milestone 13 archived under `workspace/complete/milestone-13/`

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
- After Milestone 14 HS01, does the back-page workflow need a second renderer polish packet or a gated Electron/manual validation packet?
