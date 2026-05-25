# AURA-Sense Workspace Overview

Status: Active
Last reviewed: 2026-05-25

## Vision Statement

AURA-Sense is a tactical viewport for recent EVE Online operational observations.

It should present compact, uncertainty-aware tactical state while staying transient, backend-owned, live-gated, and distinct from AURA Atlas historical storage.

## Coordination Model

- `workspace/current.md` is the only active executable work packet.
- `workspace/overseer.md` is the local Overseer guide for separating roadmap milestones from executable runways.
- `docs/roadmap/` defines milestone meaning and accepted direction.
- Handshake files in `workspace/` are active-milestone transaction notes.
- Completed milestone handshakes move in batch to `workspace/complete/milestone-XX/`.
- Former `docs/gap` task files are archived historical context only.

## Milestone Plan

| Milestone | Roadmap Source | Status | Notes |
| --- | --- | --- | --- |
| 13 | `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md` | Complete | Deterministic aggressive hardening accepted; live/manual validation remains gated for later operator-validation work. |
| 14 | `docs/roadmap/milestone-14-back-page-threat-intel-ux.md` | Complete | Back-page Threat Intel UX accepted; live/manual shortcut feel remains gated for optional later operator-validation work. |
| 15 | `docs/roadmap/milestone-15-display-request-response-fitness.md` | Parked | Lab-facing presentation response work is parked while Lab stabilizes its side. |
| 16 | `docs/roadmap/milestone-16-body-to-adapter-readiness.md` | Closed/Parked | Closed as a feature/request direction, not executed implementation. |
| 17 | `docs/roadmap/milestone-17-render-frame-performance-assurance.md` | Complete | Frame/window smoke hardening accepted; product-window bounds persistence and visual smoke restoration guard are verified. |
| 18 | `docs/roadmap/milestone-18-provider-fault-injection-hardening.md` | Complete | Fixture-only provider fault-injection verification accepted for Passive Telemetry and Threat Intel. |
| 19 | `docs/roadmap/milestone-19-gamelog-ingest-containment-and-fanout-assurance.md` | Active | Review gamelog ingest path containment, parser normalization, diagnostics sanitization, and shared fan-out safety. |

## Active Milestone

Milestone: 19 - Gamelog Ingest Containment And Fan-Out Assurance
Roadmap source: `docs/roadmap/milestone-19-gamelog-ingest-containment-and-fanout-assurance.md`
Current packet: `workspace/current.md`
Current sequence: Review-only security/engineering assurance for gamelog ingest containment, parser normalization, and shared fan-out
Latest accepted handshake: `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`
Latest accepted prototype review: `workspace/OverseerHS02-passive-telemetry-readout-prototype-review.md`
Latest accepted face advisory: `workspace/OverseerHS03-sense-face-presentation-adoption-review.md`
Latest accepted face refinement: `workspace/OverseerHS04-sense-face-refinement-review.md`
Latest Lab M19 adoption review: `workspace/OverseerHS07-sense-m19-instrument-status-band-adoption-review.md`
Latest Passive band advisory review: `workspace/OverseerHS08-passive-telemetry-instrument-band-advisory-review.md`
Latest Passive band prototype acceptance: `workspace/OverseerHS10-passive-telemetry-instrument-band-prototype-review.md`
Latest M17 Dev handoff: `workspace/DevHS21-frame-window-smoke-hardening.md`
Latest M17 acceptance: `workspace/OverseerHS22-m17-frame-window-smoke-hardening-acceptance.md`
Latest scope review: `workspace/EngTestHS23-next-scope-review.md`
Latest scope acceptance: `workspace/OverseerHS24-next-scope-review-acceptance.md`
Latest M18 Dev handoff: `workspace/DevHS25-provider-fault-injection-hardening.md`
Latest M18 acceptance: `workspace/OverseerHS26-m18-provider-fault-hardening-acceptance.md`
Latest M19 scope: `workspace/OverseerHS27-m19-gamelog-containment-scope.md`
Active runway: `workspace/SecEngHS28-gamelog-ingest-containment-review.md`

## Authority Notes

Human decision recorded 2026-05-24:

- Individual projects own internal -> Bridge connections.
- Bridge -> Interface presentation should be preserved unless there is conflict or human override.
- When Bridge -> Interface terminology needs ownership, Aura Lab owns user-facing terminology.

AURA-Sense therefore owns its lane semantics and internal-to-Bridge mapping. Lab-owned Interface terminology can be used for Bridge-facing presentation where it does not conflict with Sense doctrine, lane boundaries, or human direction.

## Durable Record Index

### Current State

- `docs/current-state/current-implementation.md`
- `docs/current-state/display-pipeline-inventory.md`

### Roadmap

- `docs/roadmap/README.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/roadmap/milestone-14-back-page-threat-intel-ux.md`
- `docs/roadmap/milestone-15-display-request-response-fitness.md`
- `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
- `docs/roadmap/milestone-17-render-frame-performance-assurance.md`
- `docs/roadmap/milestone-18-provider-fault-injection-hardening.md`
- `docs/roadmap/milestone-19-gamelog-ingest-containment-and-fanout-assurance.md`

### Contracts And Doctrine

- `docs/contracts/`
- `docs/adr/`
- `docs/adr/ADR-0003-target-owned-presentation-adapters.md`
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
- Whether Atlas/Lab first-pass terminology output requires Sense-local terminology updates.
- Whether the accepted Sense Face Refinement Pass should remain a bounded post-Milestone-14 prototype or become the first slice of a new Sense-local milestone.
- Whether the remaining focused protected-term baseline items need a terminology classification pass.
- Whether the accepted Passive Telemetry Instrument Band should get visual-density tuning, a dedicated Passive detail reveal, or remain parked.
- Whether a future Sense-local hardening packet should focus on operator validation, performance follow-up, or remain parked while Lab stabilizes.
