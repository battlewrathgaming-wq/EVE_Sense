# Display Meaning Geometry Workflow

Status: Durable current-state workflow note
Date: 2026-05-27
Owner: AURA-Sense Overseer

## Purpose

This document records the current Sense-side workflow for using meaning captures, slim surface references, and Lab spatial tools without transferring Sense meaning or implementation authority.

It is documentation alignment only. It is not a Dev runway, Lab request, renderer design, adapter implementation, bridge contract, runtime schema, or product adoption.

## Current Rule

Use this workflow when Sense wants help discussing a display surface before implementation:

```txt
Sense-owned meaning
-> surface-facing meaning capture
-> slim #NN reference index
-> Lab handles-only spatial pass
-> Human shape feedback
-> Project UX review
-> Overseer accepts, adapts, parks, rejects, or opens a later runway
```

Lab is a human-driven communication resource for making display relationships easier to discuss across many projects. Lab does not own Sense meaning, Sense adapters, source terms, lane states, bridge output, runtime behavior, or adoption decisions.

## What The Slim References Are

Slim references such as `#01`, `#02`, or `#07` are pointer labels for discussion.

They are allowed to identify surface-facing parts in a spatial guide without copying Sense UI copy onto the board.

They are not:

- new UI copy
- source terms
- payload fields
- adapter keys
- shared terminology
- Lab-owned meaning
- implementation requirements

The accepted Passive Telemetry prep artifact currently defines the reference index:

```txt
workspace/UIUXHS18-meaning-geometry-passive-telemetry-lab-prep.md
```

## What Lab May Do

Lab may use slim handles to discuss:

- adjacency
- grouping
- density
- hierarchy
- reveal/collapse behavior
- spatial pressure
- narrow/overlay fit
- relative quietness or prominence as presentation pressure

Lab may save board JSON, screenshots, relationship notes, or pattern observations as advisory review material.

## What Lab May Not Do

Lab may not:

- rename Sense terms
- redefine Sense meanings
- convert `#NN` handles into Lab-owned terms
- turn board geometry into production dimensions
- turn board position into final layout authority
- create bridge, IPC, payload, schema, persistence, service, provider, shortcut, or runtime requirements
- create Sense adapter ownership
- authorize Dev work
- treat sandpit review material as product adoption

## Current Passive Telemetry Proof

The current proof material is a Lab sandpit handoff:

```txt
F:\Projects\AURA- Lab\workspace\pane-board\concepts\shape-see-passive-telemetry-handoff.md
```

Lab tested a handles-only Shape See / Pane Board pass for Passive Telemetry using Sense `#NN` handles. The useful relationship shape found was:

```txt
plate-plus-stack with detail affordance
```

Current read:

- `#01` acts as the Passive read envelope.
- `#02` needs long-name room as the current-system subject.
- `#05` and `#06` can form a compact activity texture stack.
- `#07` should remain quieter than raw activity values so Ratio does not become a score.
- A future detail/support affordance may be useful, but it is not accepted UI.

This is advisory review material only. It is not final UI, not accepted Sense presentation, and not a Dev packet.

## Sense Review Bar

Before any Lab spatial pattern becomes Sense action, Project UX or Overseer review should ask:

- Does the shape preserve Sense meaning?
- Does it keep Passive Telemetry separate from Threat Intel, Combat Witness, Clipboard Acquisition, and Runtime IO?
- Does it avoid turning activity texture into a tactical score?
- Does it preserve source, basis, freshness, stale, partial, capped, blocked, degraded, and no-observation distinctions?
- Does it keep diagnostics and detail secondary without hiding operator trust information?
- Does it simplify future work, or does it add process weight?

Reject or park anything that complicates the Sense workflow without improving communication, reviewability, or operator clarity.

## Current Disposition

Accepted as durable workflow:

- Sense owns meaning.
- Lab may use slim handles for spatial discussion.
- Meaning capture should happen before spatial arrangement.
- `#NN` references are handles, not translation tables.
- Lab spatial output returns as advisory review material.
- Sense adoption and Dev authorization remain local.

Parked as advisory review material:

- Passive Telemetry `plate-plus-stack with detail affordance`.
- Any Pane Board / Shape See layout, dimensions, or geometry.
- Any implementation derived from the proof.

Rejected as durable workflow:

- Requiring Lab/project pipeline synchronization before a scoped sandpit proof can be reviewed.
- Treating every Lab proof as a formal `request_display`.
- Treating role labels or geometry labels as source meaning.
- Turning sandpit boards into active backlog.
- Importing Lab vocabulary into Sense bridge or adapter authority.

## Related Documents

- `docs/current-state/display-pipeline-inventory.md`
- `docs/adr/ADR-0003-target-owned-presentation-adapters.md`
- `docs/adr/ADR-0004-sense-instrument-effect-presentation-boundary.md`
- `workspace/UIUXHS18-meaning-geometry-passive-telemetry-lab-prep.md`
- `workspace/display-request-workflow-hardening-contract.md`
- `docs/roadmap/milestone-15-display-request-response-fitness.md`
- `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
