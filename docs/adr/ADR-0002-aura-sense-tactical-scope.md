# ADR-0002: AURA-Sense Tactical Scope

Status: Accepted
Date: 2026-05-22

## Context

AURA-Sense needs a clear product scope before implementation expands.

The project should not be framed as a port, parity target, or inherited implementation. It is the current tactical viewport product, built from explicit contracts, feature goalposts, current-state truth, and verified runtime behavior.

## Decision

AURA-Sense owns this tactical viewport scope:

- transient real-time HUD
- Passive Telemetry
- scoped Threat Intel
- Combat Witness
- deliberate tactical acquisition workflows
- low cognitive load presentation
- respectful, cache-aware external API use
- renderer as presentation, not authority
- backend-owned snapshots and bounded event streams

AURA-Sense does not own Atlas persistence, watch execution, historical evidence modeling, recommendations, or broad background scraping as core behavior.

## Consequences

AURA-Sense documentation must speak in current product terms.

Imported, older, or seed-origin phrasing must be reconceptualized before it guides work.

Feature documents define goalposts. Current-state records define what exists. Contracts define ownership boundaries. Verification defines confidence.

## Related Documents

- `docs/index.md`
- `docs/tenets/tenets.md`
- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/contracts/threat-intel-contract.md`
