# ADR-0001: Overseer Dev Handshake Workflow

Status: Accepted
Date: 2026-05-22

## Context

Aura projects may be worked by multiple focused chats or sessions. Atlas showed that this works best when the communication path is explicit:

- Overseer outlines milestones, guardrails, and actionable steps.
- Dev sessions pick up scoped tasks, implement, verify, and report.
- Overseer reviews handovers, accepts or redirects the work, troubleshoots, and chooses the next slice.

The Atlas audit trail and gap folders proved a useful pattern:

- `docs/gap/to-do` holds active task packets and milestone intent.
- `docs/gap/complete` holds completed implementation notes and completion signals.
- `docs/audits` holds review handshakes, milestone acceptance, handovers, and follow-up direction.
- `docs/current-state` records what is true now so stale assumptions do not silently steer new work.
- `docs/failures` records bug classes and architectural lessons that must not be rediscovered.

AURA-Sense should preserve this workflow as project doctrine.

## Decision

Aura projects will use an Overseer/Dev handshake workflow for multi-session development.

The workflow has four stages:

1. Overseer defines or refreshes the milestone.
2. Dev picks up one scoped gap or action packet.
3. Dev reports completion through verification, gap movement, current-state notes, or a handover audit.
4. Overseer reviews the handover, finalizes acceptance, troubleshoots drift, and chooses the next task packet.

## Roles

### Overseer

The Overseer owns direction and coherence.

Responsibilities:

- define milestone mission, scope, and non-goals
- create or refresh `docs/gap/to-do` items
- order active gaps when sequence matters
- accept, redirect, or retire Dev handovers
- troubleshoot doctrine drift and architectural ambiguity
- decide when a completed milestone becomes current state
- choose the next milestone or implementation slice

The Overseer does not need to implement every task. The Overseer keeps the project from becoming a pile of successful but incoherent changes.

### Dev

The Dev owns scoped execution.

Responsibilities:

- pick up one clear task packet or a small related group
- read the relevant current-state, contract, gap, and audit notes before changing code
- implement within the stated guardrails
- add or update verification
- move completed gaps to `docs/gap/complete` when completion signals are satisfied
- write a concise handover when the work changes milestone state, leaves risk behind, or needs Overseer review

The Dev should not silently expand scope just because adjacent work is visible.

## Document Flow

### Gap To-Do

Use `docs/gap/to-do` for active work packets.

Each gap should include:

- status
- priority
- milestone
- mission statement
- items for completion
- guardrails
- completion signal
- related documents

Gaps are not failures and not permanent roadmap commitments. They are practical work packets that can be accepted, changed, completed, or retired.

### Gap Complete

Move a gap to `docs/gap/complete` when its completion signal is met.

The completed note should preserve:

- what was implemented or decided
- what remains intentionally deferred
- verification signal
- related files and docs

Completed gaps become operational memory for future Dev sessions.

### Audit Handover

Use an audit handover when a Dev session needs Overseer review.

A handover should include:

- source task or reviewed scope
- summary of completed work
- verification commands and results
- concerns to carry forward
- blocked or deferred work
- recommended Overseer focus
- related files and docs

The goal is not ceremony. The goal is to let another session understand what changed, what is still risky, and what decision is needed next.

### Overseer Audit

Use an Overseer audit to accept, redirect, or reframe a handover.

An Overseer audit should include:

- whether the handover is accepted
- milestone verdict
- next milestone or next task slice
- risks and doctrine drift to watch
- active gap files to create, keep, or retire
- explicit deferrals

This audit is the handshake closure.

### Current State

Use `docs/current-state` when the project baseline changes.

Current-state notes should answer:

- what is true now?
- what is implemented?
- what remains deferred?
- what commands or verification establish confidence?
- what should the next Dev session assume?

### Failures

Use `docs/failures` for bug classes and architectural lessons.

Failures should be referenced by future gaps, audits, and contracts when the same class of risk appears again.

## Handshake Rules

- A Dev session should start from an accepted gap, current-state note, audit recommendation, or explicit user instruction.
- A Dev session should not treat a stale audit as current truth if a newer current-state or Overseer audit supersedes it.
- A completed implementation should leave a verification signal.
- A handover should name unresolved risks instead of burying them in a success summary.
- The Overseer should finalize or redirect after significant handovers.
- Active gaps should be refreshed after milestone acceptance so new Dev sessions do not pick up retired work.
- Completed gaps should not be deleted; they are context for future troubleshooting.
- Failure records should remain visible even after fixes land.

## Consequences

This workflow adds some documentation overhead, but it reduces cross-chat confusion and gives future sessions a reliable control surface.

Benefits:

- fewer stale assumptions
- clearer task pickup
- cleaner milestone boundaries
- better preservation of implementation context
- easier troubleshooting when doctrine drifts
- less pressure to keep every detail in conversational memory

Costs:

- small tasks may need a short gap or current-state note when they affect direction
- Dev sessions must pause to report rather than only code
- Overseer sessions must actively retire or reorder gaps

## Carry Forward From Atlas

Preserve the pattern, not the domain.

AURA-Sense should keep:

- milestone-driven `gap/to-do` work packets
- completed gap archive
- audit handovers
- Overseer acceptance audits
- current-state snapshots
- failure records
- verification signal in every substantial report

AURA-Sense should not copy Atlas-specific evidence, watch, queue, SDE, or retention semantics unless the tactical viewport explicitly needs an adapter or handoff.

