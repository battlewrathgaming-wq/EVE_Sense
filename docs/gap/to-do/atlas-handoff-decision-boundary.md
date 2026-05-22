# Gap To-Do: Atlas Handoff Decision Boundary

Status: Open
Priority: P2
Milestone: 11 - Operational Hardening And Runtime Control

## Need

AURA-Sense should stay tactical and transient unless a real operator workflow justifies a narrow handoff to Atlas.

## Actionables

- Identify whether a concrete handoff workflow exists.
- If yes, write an ADR defining exported context, operator action, retention boundary, and Atlas ownership.
- If no, record that Atlas handoff remains deferred.
- Keep AURA-Sense free of Atlas persistence and watch execution.

## Guardrails

- Do not add queues, evidence stores, reports, or watch execution.
- Do not persist tactical observations by default.
- Do not blur tactical now with historical proof.

## Completion Signal

- Atlas handoff is explicitly deferred or bounded by ADR.
- No Atlas behavior enters AURA-Sense core without approval.
