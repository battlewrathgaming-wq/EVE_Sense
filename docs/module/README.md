# Modules

This folder holds reusable implementation modules that future Aura projects may adopt.

A module note should explain:

- purpose
- donor/reference implementations
- recommended Aura shape
- guardrails
- verification expectations
- what not to copy yet

Modules are not domain features. They are reusable app rigging that can be lifted into project-specific code when needed.

## Current Modules

- `Frame`: Electron frameless window shell, always-on-top toggle, and HUD window configuration.
