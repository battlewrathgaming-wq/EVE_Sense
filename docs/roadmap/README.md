# AURA-Sense Roadmap

Status: Durable roadmap scaffold
Last reviewed: 2026-05-25

## Purpose

This folder stores milestone-sized direction for AURA-Sense.

Use it to prevent single tasks from becoming whole milestones by accident. A roadmap milestone should describe a meaningful project outcome. `workspace/current.md` should then choose one executable runway inside that outcome.

Roadmap files are not executable authority. Implementation truth lives in `docs/current-state/current-implementation.md`, and active execution lives only in `workspace/current.md`.

## Current Phase

Post-Milestone-14 display/request alignment and tactical presentation refinement.

Current resting state:

- Milestone 13 aggressive hardening is complete.
- Milestone 14 back-page Threat Intel UX is complete.
- `sense.clipboard-window` has been submitted to Aura Lab as an advisory `request_display` pressure test.
- No Dev runway is open.

## Near Outcomes

- Evaluate Lab advisory display responses through Human/Sense fitness discussion before creating resting state or action.
- Prove selected Sense lanes from ingest through bridge output up to the target-owned adapter boundary before fitting a Lab face.
- Keep Clipboard Acquisition, Threat Intel, Passive Telemetry, and Combat Witness meanings distinct while improving presentation.
- Preserve the display request flow without turning Lab response into adoption or Dev authorization.
- Keep live/manual validation gated until a future operator-validation milestone explicitly opens it.

## Candidate Milestones

| Milestone | Outcome | Status | File |
| --- | --- | --- | --- |
| 13 | Aggressive testing and bug hunting | Complete | `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md` |
| 14 | Back-page Threat Intel UX | Complete | `docs/roadmap/milestone-14-back-page-threat-intel-ux.md` |
| 15 | Display request response fitness and action shaping | Candidate | `docs/roadmap/milestone-15-display-request-response-fitness.md` |
| 16 | Body-to-adapter readiness | Candidate | `docs/roadmap/milestone-16-body-to-adapter-readiness.md` |

## Promotion Gates

### Display Response Fitness Gate

Ready when:

- Lab returns an advisory response to a scoped Sense display request.
- The response can be discussed by Human/Sense without requiring immediate implementation.
- Sense-owned meanings, states, and must-not-imply boundaries can be checked from disk.

### Implementation Packet Gate

Ready when:

- Human/Sense discussion produces stable action.
- Overseer can write a bounded `workspace/current.md` runway with acceptance criteria.
- Required verification commands are known.
- Scope does not require backend, bridge, IPC, payload, persistence, schema, service, provider, shortcut, or runtime changes unless explicitly authorized.

### Body-To-Adapter Readiness Gate

Ready when:

- Human/Sense chooses a first lane to trace.
- The trace can stop at the target-owned adapter boundary without adopting a Lab face.
- Required source, transformation, bridge, and state files can be reviewed from disk.
- Verification can remain deterministic unless live/manual work is explicitly authorized.

### Operator Validation Gate

Ready when:

- Human explicitly authorizes live/manual validation.
- The active runway names the manual or live boundary.
- Stop conditions and verification records are explicit.

## Parked Work

- Additional `request_display` asks beyond `sense.clipboard-window`.
- Passive Telemetry visual-density tuning.
- Threat latest-scan review display comparison.
- Provider pulse wording.
- Full Threat acquisition bar comparison.
- Manual shortcut validation.
- Live provider smoke.
- Broad face redesign.
- Lab face adoption before Sense body-to-adapter readiness is proven.

## Roadmap Use

Before opening a new milestone or runway, the Overseer should read this file and the candidate milestone file.

Use roadmap files to identify outcome-sized work.

Use `workspace/current.md` only for the active executable packet.

Use workspace handoff/review files for transaction records.

Do not use this folder as a hidden backlog.

## Key Files

- `feature-aligned-milestones.md`
- `milestone-12-live-validation-and-tactical-calibration.md`
- `milestone-13-aggressive-testing-and-bug-hunting.md`
- `milestone-14-back-page-threat-intel-ux.md`
- `milestone-15-display-request-response-fitness.md`
- `milestone-16-body-to-adapter-readiness.md`
- `passive-telemetry-live-readiness-interlock.md`
- `runtime-smoke-policy.md`
