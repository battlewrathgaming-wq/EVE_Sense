# Development Artifact Trail

Status: Active
Date: 2026-05-22

## Purpose

This note identifies where AURA-Sense preserves development memory.

It exists so future Dev and Overseer sessions can find the current truth without treating every historical note as equally authoritative.

## Current Entry Points

Start here:

1. `workspace/README.md` when the user sends `.`
2. `docs/current-state/current-implementation.md`
3. latest Overseer audit in `docs/audits/`
4. active milestone in `docs/roadmap/`
5. active packets in `docs/gap/to-do/`

## Artifact Roles

- `docs/current-state/`: what is true now
- `docs/audits/`: Dev handovers and Overseer reviews
- `docs/gap/to-do/`: active or deferred implementation packets
- `docs/gap/complete/`: completed work with verification evidence
- `docs/roadmap/`: milestone direction and sequencing
- `workspace/`: dot-protocol attention and execution queue
- `docs/contracts/`: stable ownership boundaries
- `docs/schemas/`: stable data/interface shapes
- `docs/terms/`: shared vocabulary
- `docs/failures/`: reusable failure classes
- `docs/Concept/`: AURA-Sense concept doctrine and design notes
- `docs/terms/development-artifact.md`: plain-language rule for when new memory is warranted

## Rules

- Current-state beats historical audits when they conflict.
- Latest Overseer handover beats older Dev recommendations when sequencing changed.
- Completed gaps should remain archived.
- Stale active work should be retired into `docs/gap/complete` with a superseded note.
- Verification output belongs in completion notes and handovers.
- New artifacts are warranted when future sessions would otherwise make the wrong architectural or tactical choice.
- When the user sends `.`, Dev should read `workspace/` from top to bottom before choosing work.

## Current Assessment

AURA-Sense is keeping a sufficient artifact trail.

The risk is not absence of documentation. The risk is stale documentation being treated as current. Use the entry points above to avoid that drift.
