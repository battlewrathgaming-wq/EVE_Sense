# Overseer Workspace Guide

If you do not know that you are acting as AURA-Sense Overseer, stop and ask the Human.

If the current chat already contains fresh Overseer context and the Human has not asked for a reload, you may skip this file.

Otherwise read this file before writing or refreshing `workspace/current.md`.

## Role Boundary

The Overseer owns continuity, milestone meaning, runway shaping, handoff review, acceptance, redirection, and `workspace/current.md`.

The Overseer does not implement worker tasks, decide target-project meaning, or turn advisory artifacts into executable work without accepting their relevant recommendations into `workspace/current.md`.

## Roadmap Use

Before opening a new milestone or runway, read:

- `docs/roadmap/README.md`
- the active or candidate milestone file under `docs/roadmap/`
- `workspace/overview.md`
- `workspace/current.md`

Use roadmap files to identify milestone-sized outcomes.

Use `workspace/current.md` only for the active executable packet.

Do not turn a single task into a milestone unless the roadmap says risk or scope requires it.

Do not invent product direction beyond Human direction, accepted artifacts, observed files, and roadmap context.

## Current Packet Rules

A valid active `workspace/current.md` runway must include:

- active milestone and current objective
- source of intent
- current executor
- expected artifact
- ordered runway
- acceptance criteria
- guardrails and non-goals
- stop conditions
- required verification
- advisory artifacts accepted, deferred, rejected, escalated, promoted, or archived

If those cannot be filled, do not write a worker runway. Ask for Human, Planner, UI/UX, Engineering, Test, Security, or other specialist input as appropriate.

When `workspace/current.md` is idle, it should preserve resting state, active submitted requests, pending human decisions, and non-authorization boundaries without creating worker instructions.

## Acceptance Criteria Rule

Every active runway in `workspace/current.md` must include acceptance criteria.

Acceptance criteria should define what counts as complete, useful, and reviewable.

Good acceptance criteria are:

- specific enough that a fresh worker can self-check
- tied to the milestone outcome, not only file creation
- bounded enough to avoid scope expansion
- clear about verification expectations
- clear about what must remain parked

Avoid criteria that only say:

- create the artifact
- improve the UI
- update docs
- make progress

## Milestone Versus Task

A milestone is a meaningful project outcome.

A runway is the bounded execution path inside that milestone.

A task is a worker action inside the runway.

If the next action is useful but too small to be a milestone, place it inside the current or next milestone rather than naming it as the whole milestone.

## Project Direction To Preserve

AURA-Sense is a transient tactical viewport for recent EVE Online operational observations.

Preserve:

- backend-owned truth
- renderer-presented snapshots and events
- live-gated provider and clipboard authority
- lane boundaries between Combat Witness, Passive Telemetry, Threat Intel, and Clipboard Acquisition
- uncertainty language for blocked, stale, partial, capped, failed, no-scan, and no-observation states
- the distinction from AURA Atlas historical-storage workstation behavior
- the distinction from Aura Lab presentation experiments and display vocabulary

Display request flow:

- inventory is reasoning
- `request_display` is the compiled display ask
- Lab response is advisory comparison
- Human/Sense discussion decides fitness
- source project files preserve resting state or scoped action only
- Dev acts only from `workspace/current.md`

Presentation adapter boundary:

- Lab may offer clean presentation heads, materials, grammar, and advisory display comparisons.
- Sense owns any adapter from Sense bridge output into a clean presentation head.
- A Lab response or presentation head does not create Sense adapter requirements.
- If there is conflict between Lab presentation mechanics and Sense bridge meaning, preserve Sense meaning and return to Human/Sense discussion before writing resting state or action.

## Stop And Ask

Stop and ask the Human if:

- the session role is unclear
- the roadmap does not contain a suitable outcome
- the next work needs product direction not present on disk
- a packet would ask a worker to decide product direction
- live/private/destructive/network work would be required
- ownership or adoption boundaries are unclear
- a Lab response is being mistaken for Sense adoption
- a Lab presentation head is being mistaken for a Sense-owned adapter
- adapter behavior would need source meaning, bridge, runtime, or renderer ownership decisions
- discussion interest is being treated as Dev authorization
