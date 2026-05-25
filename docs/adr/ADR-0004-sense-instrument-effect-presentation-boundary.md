# ADR-0004: Sense Instrument Effect Presentation Boundary

Status: Accepted
Date: 2026-05-25

## Context

AURA-Sense receives sensor-derived values from EVE combat/gamelogs, gated external API snapshots, and local lookup/materialization tables such as `System -> ID`.

The backend and bridge may use construction terms for parsers, watchers, resolvers, caches, providers, diagnostics, lane states, and snapshot fields. Those terms are useful for implementation and audit, but they are not automatically product language.

AURA-Sense is a transient tactical viewport, not an Atlas-owned Evidence workstation and not a Lab doctrine host. Its face should feel like an operational instrument: compact, value-forward, state-aware, and traceable.

## Decision

Sense presents sensor-derived values and instrument effects.

Backend state remains auditable source condition, but the user-facing face should not expose backend construction terminology, ontology labels, or internal state names unless that wording is required for operator trust, safety, or point-of-need diagnosis.

The preferred presentation path is:

```txt
source state
-> traceable display condition
-> value/effect on the face
```

Examples of value/effect presentation include:

- numeric or text readings, such as DPS, HPS, system names, counts, source names, weapon names, or scan targets
- compact state effects, such as glow, pulse, dimming, static `I/O`, edge treatment, sealed/snap-off behavior, or degraded visual weight
- secondary diagnostics or revealable details when trust requires explanation

These effects are presentation grammar. They must remain traceable to source state, but they do not become source meaning.

## Why

This keeps AURA-Sense from becoming a backend debug panel while also preventing purely decorative presentation.

It preserves the Sense distinction:

- Sense displays current tactical instrument readings.
- Atlas may surface historical storage and Atlas-owned Evidence doctrine.
- Lab may provide Bridge -> Interface presentation mechanics.
- Sense adapters own the mapping from Sense bridge output into any adopted presentation head.

This also makes adapter implementation simpler. The adapter does not have to display raw backend terms by default. It maps source-owned bridge output into readings, display conditions, and effects while preserving traceability.

## Consequences

Sense adapters should:

- pass domain values through as readings where useful
- map source, freshness, certainty, blocked, degraded, aged, partial, capped, failed, no-scan, and no-observation conditions into display conditions/effects
- keep diagnostics secondary unless operator trust requires them
- preserve a traceable source-state mapping for audit and verification
- avoid treating Lab display vocabulary as Sense bridge authority

Sense renderer/presentation work should:

- show values and effects before backend state names
- avoid surfacing parser, file-monitor, resolver, cache, provider, bridge, or diagnostic construction terms as primary UI copy
- avoid Atlas-owned Evidence or storage semantics unless a future explicit integration opens that scope
- avoid decorative effects that cannot be traced to source state

## Non-Goals

- Do not rename Sense backend, bridge, IPC, payload, schema, service, or contract terms.
- Do not make Lab owner of Sense adapter behavior.
- Do not create a universal Aura effect grammar.
- Do not make every visual effect a shared doctrine term.
- Do not hide required trust, basis, freshness, blocked, degraded, or failure information.
- Do not authorize renderer, adapter, or Lab-face implementation by this ADR alone.

## Review Rule

For any future Sense face or adapter work, ask:

```txt
What source state causes this displayed value or effect?
Is that mapping traceable?
Does the effect help the operator without exposing backend construction language?
Does it avoid Atlas-owned Evidence doctrine and Lab-owned meaning drift?
```

If the mapping is not traceable, the effect should be removed, demoted, or redesigned.

## Related Documents

- `docs/adr/ADR-0001-aura-sense-is-tactical-viewport.md`
- `docs/adr/ADR-0002-aura-sense-tactical-scope.md`
- `docs/adr/ADR-0003-target-owned-presentation-adapters.md`
- `docs/contracts/renderer-boundary-contract.md`
- `workspace/critical/critical-terms.md`
- `workspace/overseer.md`
