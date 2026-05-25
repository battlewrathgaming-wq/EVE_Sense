# AURA-Sense Workspace Overview

Status: Active - M12B live API security review
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
| 12 | `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md` | Active/Gated | M12B is open as a security/engineering review before any live API execution. No live providers, operator gamelog smoke, manual shortcuts, real SDE refresh, calibration, or fixture intake work is authorized. |
| 13 | `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md` | Complete | Deterministic aggressive hardening accepted; live/manual validation remains gated for later operator-validation work. |
| 14 | `docs/roadmap/milestone-14-back-page-threat-intel-ux.md` | Complete | Back-page Threat Intel UX accepted; live/manual shortcut feel remains gated for optional later operator-validation work. |
| 15 | `docs/roadmap/milestone-15-display-request-response-fitness.md` | Parked | Lab-facing presentation response work is parked while Lab stabilizes its side. |
| 16 | `docs/roadmap/milestone-16-body-to-adapter-readiness.md` | Closed/Parked | Closed as a feature/request direction, not executed implementation. |
| 17 | `docs/roadmap/milestone-17-render-frame-performance-assurance.md` | Complete | Frame/window smoke hardening accepted; product-window bounds persistence and visual smoke restoration guard are verified. |
| 18 | `docs/roadmap/milestone-18-provider-fault-injection-hardening.md` | Complete | Fixture-only provider fault-injection verification accepted for Passive Telemetry and Threat Intel. |
| 19 | `docs/roadmap/milestone-19-gamelog-ingest-containment-and-fanout-assurance.md` | Complete | Gamelog ingest containment hardening accepted; explicit `EVE/logs/Gamelogs` structure policy and active-folder read guards are verified. |

## Active Milestone

Milestone: M12 - Live Validation And Tactical Calibration
Current packet: `workspace/current.md`
Current sequence: M12B live API security review open
Current executor: Security / Engineering review
Expected artifact: `workspace/SecEngHS38-m12b-live-api-security-review.md`
Latest M12 gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
Latest M12 prep Dev handoff: `workspace/DevHS34-m12-live-validation-harness-prep.md`
Latest M12 prep acceptance: `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
Latest M12A Dev handoff: `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
Latest M12A acceptance: `workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md`
Latest accepted handshake: `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`
Latest accepted prototype review: `workspace/OverseerHS02-passive-telemetry-readout-prototype-review.md`
Latest accepted face advisory: `workspace/OverseerHS03-sense-face-presentation-adoption-review.md`
Latest accepted face refinement: `workspace/OverseerHS04-sense-face-refinement-review.md`
Latest Lab M19 adoption review: `workspace/OverseerHS07-sense-m19-instrument-status-band-adoption-review.md`
Latest Passive band advisory review: `workspace/OverseerHS08-passive-telemetry-instrument-band-advisory-review.md`
Latest Passive band prototype acceptance: `workspace/OverseerHS10-passive-telemetry-instrument-band-prototype-review.md`
Latest M17 Dev handoff: `workspace/complete/milestone-17/DevHS21-frame-window-smoke-hardening.md`
Latest M17 acceptance: `workspace/complete/milestone-17/OverseerHS22-m17-frame-window-smoke-hardening-acceptance.md`
Latest scope review: `workspace/complete/milestone-18/EngTestHS23-next-scope-review.md`
Latest scope acceptance: `workspace/complete/milestone-18/OverseerHS24-next-scope-review-acceptance.md`
Latest M18 Dev handoff: `workspace/complete/milestone-18/DevHS25-provider-fault-injection-hardening.md`
Latest M18 acceptance: `workspace/complete/milestone-18/OverseerHS26-m18-provider-fault-hardening-acceptance.md`
Latest M19 scope: `workspace/complete/milestone-19/OverseerHS27-m19-gamelog-containment-scope.md`
Latest M19 review: `workspace/complete/milestone-19/SecEngHS28-gamelog-ingest-containment-review.md`
Latest M19 Dev handoff: `workspace/complete/milestone-19/DevHS30-gamelog-containment-hardening.md`
Latest M19 acceptance: `workspace/complete/milestone-19/OverseerHS31-m19-gamelog-containment-hardening-acceptance.md`
Latest roadmap reconciliation: `workspace/complete/milestone-19/OverseerHS32-roadmap-state-reconciliation.md`
Active runway: M12B live API security review before authorized execution

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
- `docs/adr/ADR-0004-sense-instrument-effect-presentation-boundary.md`
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

- After M12A, whether the next live/manual validation item should be authorized live API execution, live operator gamelog smoke, Combat Witness calibration, or raw repair/healing fixture intake.
- Whether Atlas/Lab first-pass terminology output requires Sense-local terminology updates.
- Whether the accepted Sense Face Refinement Pass should remain a bounded post-Milestone-14 prototype or become the first slice of a new Sense-local milestone.
- Whether the remaining focused protected-term baseline items need a terminology classification pass.
- Whether the accepted Passive Telemetry Instrument Band should get visual-density tuning, a dedicated Passive detail reveal, or remain parked.
- Whether a future Sense-local hardening packet should focus on operator validation, performance follow-up, or remain parked while Lab stabilizes.
- Whether future operator-environment gamelog validation should be opened as a live/manual packet.
