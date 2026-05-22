# Gap To-Do: Renderer Preload Boundary Adversarial Tests

Status: Open
Priority: P0
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

Renderer isolation is product doctrine. Static checks exist, but adversarial patterns should be tested so future UI changes cannot smuggle telemetry authority into the renderer.

## Actionables

- Extend boundary checks for provider route strings, filesystem access, parser terms, runtime modules, Node/Electron globals, and raw log patterns.
- Test preload API shape for narrow allowed commands.
- Verify subscription cleanup paths do not leak listeners.
- Verify renderer does not compute Combat Witness, Passive Telemetry, or Threat Intel truth.

## Guardrails

- Do not weaken existing boundary rules.
- Do not move service ownership into preload.
- Do not add provider logic to renderer for convenience.

## Completion Signal

- Boundary tests catch representative adversarial patterns.
- Renderer remains presentation-only.
- `npm.cmd run verify:all` passes.
