# ADR-0002: AURA-Sense Inherits Aura 7 Tactical Scope

Status: Accepted
Date: 2026-05-22

## Context

AURA-Sense is starting as a rewrite from the Aura Core seed while Aura 7 preserves the previous tactical overlay scope.

The project needs continuity of product intent without copying runtime-specific implementation weight too early.

## Decision

AURA-Sense inherits Aura 7's tactical viewport scope:

- transient real-time HUD
- passive telemetry
- scoped Threat Intel
- Combat Witness
- low cognitive load presentation
- respectful, cache-aware external API use
- renderer as presentation, not authority

AURA-Sense does not inherit Atlas persistence, watch execution, historical evidence modeling, or large static data assumptions as default seed behavior.

## Consequences

AURA-Sense documentation should describe the target tactical behavior while clearly separating current implementation state from inherited scope.

Copied Aura 7 docs are historical lineage unless adapted to say AURA-Sense and verified against the new runtime.

## Related Documents

- `docs/index.md`
- `docs/tenets/tenets.md`
- `docs/current-state/seed-current-state.md`
- `docs/audits/audit-2026-05-22-aura7-scope-alignment.md`
