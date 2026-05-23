# Graphical Vision

Status: Active reference
Updated: 2026-05-23

AURA-Sense presentation must support tactical readability first.

## Principle

```text
Presentation must not compete with telemetry.
```

The HUD should remain useful when animation is disabled.

## Current Visual Direction

- compact tactical viewport
- lane overview
- Combat Witness primary
- Passive Telemetry and Threat Intel as supporting lanes
- explicit provider/basis/freshness display
- degraded and unavailable states visible
- restrained motion

## Visual Priority

When space or performance is constrained, preserve:

1. critical text
2. telemetry values
3. freshness/degraded state
4. provider/source basis
5. controls needed to recover or inspect state
6. motion and atmosphere last

## Render Tiers

Future rendering may use tiers:

- full
- reduced
- minimal
- static

Static mode must remain usable.

## Must Not Do

- hide telemetry behind decorative effects
- rely on motion to communicate meaning
- overlap critical text
- animate continuously without tactical purpose
- make the renderer own telemetry truth

## Verification Expectations

Visual smoke and future visual regression checks should cover:

- empty state
- stale state
- degraded state
- partial state
- long labels
- narrow viewport
- provider unavailable
- diagnostics visible
