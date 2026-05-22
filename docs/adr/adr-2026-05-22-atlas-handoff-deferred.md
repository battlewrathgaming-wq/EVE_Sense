# ADR: Atlas Handoff Deferred

Date: 2026-05-22
Status: Accepted

## Context

AURA-Sense is currently a tactical, transient situational awareness viewport. No concrete operator workflow has been identified that requires handing tactical observations to Atlas for persistence, reports, queues, or watch execution.

## Decision

Atlas handoff remains deferred.

AURA-Sense must not add Atlas persistence, evidence stores, reports, queues, watch execution, or background historical handoff behavior without a future ADR that names:

- the operator action that triggers handoff
- the exact exported context
- the retention boundary
- Atlas ownership after handoff
- verification proving AURA-Sense remains tactical and transient by default

## Consequences

- Milestone 11 runtime settings persist only product runtime configuration, not tactical observations.
- Diagnostics review remains a short, sanitized runtime review surface, not evidence storage.
- Future Atlas work needs Overseer approval and a narrow implementation slice.
