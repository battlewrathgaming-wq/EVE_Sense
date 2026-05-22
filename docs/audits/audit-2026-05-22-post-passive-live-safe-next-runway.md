# Audit: Post Passive Live-Safe Next Runway

Date: 2026-05-22
Role: Overseer
Scope: Review completed Milestone 08 and hand Dev the next milestone sequence.

## Current Truth

Milestone 08, Passive Telemetry Live-Safe Readiness, is complete with a live network smoke caveat.

Accepted implementation state:

- local/static Passive Telemetry system resolver
- backend-owned Passive Telemetry live IO gate
- scoped Passive Telemetry zKill `pastSeconds` route
- ESI aggregate system kills/jumps activity client
- one-hour ESI activity cache with ETag revalidation behavior
- Passive Telemetry request/freshness metadata
- explicit opt-in Passive Telemetry live API smoke command

Deferred:

- live zKill/ESI smoke execution with `AURA_SENSE_LIVE_API=1`
- Threat Intel search
- Clipboard Acquisition
- ESI killmail expansion
- Atlas persistence/evidence behavior
- broad polling
- renderer network calls

## Milestone Sequence

### Active: Milestone 09

`docs/roadmap/milestone-09-scoped-threat-intel-and-clipboard-acquisition.md`

Build deliberate scoped Threat Intel and hands-free Clipboard Acquisition.

Work packets:

- `docs/gap/to-do/threat-intel-scan-request-contract.md`
- `docs/gap/to-do/threat-intel-target-resolution-boundary.md`
- `docs/gap/to-do/threat-intel-zkill-scoped-probe.md`
- `docs/gap/to-do/threat-intel-search-ui-surface.md`
- `docs/gap/to-do/clipboard-acquisition-workflow.md`
- `docs/gap/to-do/threat-intel-live-gate-and-observability.md`
- `docs/gap/to-do/threat-intel-renderer-boundary-verification.md`
- `docs/gap/to-do/readiness-05-zkill-ref-boundary.md`
- `docs/gap/to-do/readiness-06-threat-intel-sample-metadata.md`
- `docs/gap/to-do/readiness-09-local-type-metadata.md` only if a real type-label consumer appears

### Next: Milestone 10

Integrated Tactical Viewport.

This should not start until Milestone 09 has a backend-owned Threat Intel snapshot and verified clipboard lifecycle. Milestone 10 should compose lanes, not invent new truth models.

### Later: Milestone 11

Operational Hardening And Handoff Boundaries.

This should harden settings persistence, diagnostics review, live smoke policy, provider pulse presentation, and Atlas handoff decisions only after lane behavior is stable.

## Dev Instruction

Start with Milestone 09 Task 1.

The first implementation slice should define the Threat Intel scan request/snapshot contract and target resolution boundary before adding renderer surface or clipboard hooks. The search box and clipboard flow should both call the same backend scan path.

## Non-Negotiables

- Search focus alone must not call APIs.
- Clipboard listening must be visible, armed, short, sealed, and followed by 5 second cooldown.
- Renderer must not call zKill, ESI, fetch, filesystem, parser, watcher, or runtime modules directly.
- zKill results are sampled context, not complete truth.
- ESI killmail expansion remains deferred unless a future Overseer milestone explicitly authorizes it.
- `verify:all` remains offline.

## Expected Dev Handover

- milestone and task packets completed
- request/snapshot contract
- target categories and resolution behavior
- zKill route/lookback/sample behavior
- clipboard lifecycle states
- live gate blocked behavior
- renderer boundary verification
- `verify:all` result
- `smoke:electron` result if renderer changed
- live smoke status if any live check was run
- completed packets moved to `docs/gap/complete`
- current-state updates

