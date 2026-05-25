# Development Artifact Trail

Status: Durable guidance - updated after M19
Date: 2026-05-22

## Purpose

This note identifies where AURA-Sense preserves development memory.

It exists so future Dev and Overseer sessions can find the current truth without treating every historical note as equally authoritative.

## Current Entry Points

Start here:

1. `workspace/README.md` and `workspace/overseer.md` for role/workspace rules
2. `workspace/current.md` for the active executable packet, or idle resting state when no packet is open
3. `docs/current-state/current-implementation.md`
4. `docs/roadmap/README.md`
5. active or candidate milestone under `docs/roadmap/`
6. latest accepted workspace handoff/review artifact when `workspace/current.md` references it

## Artifact Roles

- `docs/current-state/`: what is true now
- `docs/audits/`: Dev handovers and Overseer reviews
- `docs/archive/deprecated-gap-workflow-2026-05-23/`: historical gap workflow context only unless `workspace/current.md` explicitly references a file
- `docs/roadmap/`: milestone direction and sequencing
- `workspace/`: dot-protocol attention bridge, current packet, and transaction notes
- `workspace/complete/`: accepted workspace packets grouped by milestone when archived in batch
- `workspace/archive/`: legacy or parked workspace packets retained when they are useful evidence
- `docs/contracts/`: stable ownership boundaries
- `docs/schemas/`: stable data/interface shapes
- `docs/terms/`: shared vocabulary
- `docs/failures/`: reusable failure classes
- `docs/Concept/`: AURA-Sense concept doctrine and design notes
- `docs/terms/development-artifact.md`: plain-language rule for when new memory is warranted

## Rules

- Current-state beats historical audits when they conflict.
- Latest Overseer handover beats older Dev recommendations when sequencing changed.
- Historical gap files should not be treated as active queues.
- Stale active work should be retired or reframed through roadmap/current-state docs and an accepted workspace record.
- Verification output belongs in completion notes and handovers.
- New artifacts are warranted when future sessions would otherwise make the wrong architectural or tactical choice.
- When the user sends `.`, Dev should read `workspace/README.md`, `workspace/00-dot-protocol.md`, and `workspace/current.md` before choosing work.
- `workspace/current.md` may be overwritten by Overseer when focus changes; durable truth remains in current-state, accepted workspace records, audits, failures, contracts, schemas, terms, and roadmap docs.

## Current Assessment

AURA-Sense is keeping a sufficient artifact trail.

The risk is not absence of documentation. The risk is stale documentation being treated as current. Use the entry points above to avoid that drift.

After M19, the current rule is: `workspace/current.md` is the only executable packet. Roadmap files shape milestone-sized outcomes. Historical gap files and older advisory artifacts are context, not queues.
