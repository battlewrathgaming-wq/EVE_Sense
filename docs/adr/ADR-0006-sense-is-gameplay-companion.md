# ADR-0006 - Sense Is A Gameplay Companion

Date: 2026-05-27
Status: Accepted

## Context

AURA-Sense runs beside EVE Online as an overlay. During real play, clicking or managing the Sense panel can interrupt or minimize the game. The product therefore cannot assume ordinary app interaction patterns as the primary path.

Human product direction clarifies that Sense should become part of natural player flow, not a second activity the player has to operate.

Sense has two main in-moment modes:

- In flight, Sense provides a current-system vibe check and hands-free access to scoped lookup/display paths.
- In combat, Sense interprets local combat logs and surfaces observed/computed hints that can support player inference.

Sense is not a full ship-system instrument panel, fleet command surface, historical workstation, or replacement for the EVE UI.

## Decision

AURA-Sense is a companion for existing gameplay.

Primary flows should be hands-free, keyboard-first, event-driven, or explicitly invited by the operator. Sense should wrap around existing player actions such as jumping systems, copying a target name, approaching a gate, taking heavy damage, or reviewing combat pressure.

Success means the player can forget they downloaded an app because Sense quietly joins their normal flow.

## Product Implications

In flight:

- Passive Telemetry should wake around observed navigation/current-system changes.
- The current-system display should feel like a lightweight vibe check, using current available ESI/provider context with visible freshness and limits.
- Threat lookup should support copied names and explicit operator invitation without requiring mouse-driven panel interaction.

In combat:

- Combat Witness should expose useful observed facts and computed hints such as incoming pressure, repair balance, observed weapon/source patterns, outgoing pressure, and hit quality.
- These outputs should support player inference and tactical adjustment.
- They must not claim complete combat awareness, survival truth, or full ship-system state.

## Interaction Principle

Because Sense overlays the game, primary workflows must avoid requiring the player to click into the panel.

Accepted examples:

- `Control+\` as an explicit operator permission action for Clipboard Acquisition.
- Passive Telemetry opening from parser-observed system jumps.
- Keyboard/service-driven Threat Intel paths.
- Quiet state effects that indicate I/O, freshness, blocked, degraded, or stale conditions without demanding mouse attention.

Future UI or adapter work should treat mouse/panel interaction as secondary support unless the Human explicitly accepts a different workflow.

## Presentation Principle

Sense should feel calm, predictable, and repeatable.

It may include feature-rich moments that feel satisfying, such as Passive Telemetry becoming live after a gate jump, but those moments should support flow rather than steal attention.

Sense should present values, effects, and traceable state cues before backend construction terms. Presentation must remain source-traceable and uncertainty-aware.

## Non-Goals

- Do not make Sense a second cockpit the player must operate.
- Do not require mouse-driven search or panel interaction for primary tactical workflows.
- Do not turn Sense into an Atlas-style historical or evidence workstation.
- Do not turn Sense into a broad recommendation engine.
- Do not turn Combat Witness into a full ship-system instrument panel.
- Do not hide source, freshness, blocked, stale, partial, capped, degraded, or no-observation limits.
- Do not treat this ADR as implementation authorization.

## Review Rule

For future Sense feature, UI, adapter, or Lab presentation work, ask:

```txt
Does this help the player stay in their existing EVE flow?
Does it avoid requiring unnecessary panel interaction?
Does it surface useful inference without overclaiming truth?
Does it remain calm and predictable under pressure?
```

If the answer is no, narrow, park, or redesign the work before implementation.

## Related

- `docs/adr/ADR-0001-aura-sense-is-tactical-viewport.md`
- `docs/adr/ADR-0002-aura-sense-tactical-scope.md`
- `docs/adr/ADR-0004-sense-instrument-effect-presentation-boundary.md`
- `docs/adr/ADR-0005-clipboard-acquisition-authority-and-cache.md`
- `docs/features/vision.md`
- `docs/current-state/display-meaning-geometry-workflow.md`
