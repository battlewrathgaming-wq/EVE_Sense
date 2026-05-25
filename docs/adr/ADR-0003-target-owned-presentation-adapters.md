# ADR-0003: Target-Owned Presentation Adapters

Status: Accepted
Date: 2026-05-25

## Context

Aura Lab develops portable post-bridge presentation materials and may later offer clean presentation heads or renderer candidates for other Aura projects to adopt.

AURA-Sense owns its internal meaning, source terms, runtime behavior, data authority, lane semantics, and bridge emission. Lab owns only Bridge -> Interface presentation language and display mechanics after Sense meaning is preserved.

Without an explicit adapter boundary, a Lab display response or presentation head could be mistaken for Sense adapter authority, source meaning, or implementation authorization.

## Decision

AURA-Sense must develop and own its own presentation adapters.

Lab may provide:

- reusable display materials
- presentation grammar
- clean presentation head candidates
- examples of how source-owned terms can be preserved in a display
- advisory comparison of possible Bridge -> Interface treatments

Lab must not provide or own:

- Sense internal -> Bridge mappings
- Sense adapter implementations as Lab authority
- Sense data semantics
- Sense runtime behavior
- Sense navigation or product doctrine
- Sense acceptance/adoption decisions

## Adapter Boundary

The Sense-owned adapter is the layer that connects:

```txt
Sense bridge output -> clean Lab presentation head
```

The adapter should translate Sense-owned bridge output into the clean presentation head's expected display input while preserving Sense meaning.

The adapter belongs in AURA-Sense unless the Human explicitly opens a different ownership packet.

## Why

This keeps Lab portable without becoming Sense authority.

It also prevents accidental doctrine drift:

- Sense keeps Combat Witness, Passive Telemetry, Threat Intel, Clipboard Acquisition, Live IO, sample/freshness states, and lane semantics.
- Lab keeps slim product-agnostic display language for Lab-owned defaults.
- Shared spelling does not imply shared meaning.

## Consequences

Before Sense adopts Lab presentation work:

1. Lab may provide a clean presentation head, material pattern, or advisory display comparison.
2. Workshop/test tooling must not become a Sense runtime or renderer requirement unless Sense opens that scope.
3. Sense must create its own adapter or adoption layer if implementation is desired.
4. Sense must review and accept the result locally.
5. Implementation must happen through Sense `workspace/current.md`.

Lab may advise, compare, or prototype with neutral material, but Sense owns final meaning, adapter behavior, and adoption.

## Non-Goals

- Do not create a universal Aura adapter.
- Do not create a shared bridge contract from Lab material schemas.
- Do not make Lab the owner of Sense terms.
- Do not treat Lab request or response artifacts as implementation authorization.
- Do not make Central Orchestration the owner of Sense display meaning.

## Related Documents

- `workspace/request_display.md`
- `workspace/display-request-workflow-hardening-contract.md`
- `workspace/overseer.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/roadmap/milestone-15-display-request-response-fitness.md`
