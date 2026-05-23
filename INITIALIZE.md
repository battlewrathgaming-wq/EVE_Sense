# AURA-Sense Initialization Note

Status: Historical seed reference
Updated: 2026-05-23

AURA-Sense is already initialized. Do not treat this repository as an unbooted Aura Core seed.

## Current Rule

Use this repository as AURA-Sense:

- tactical viewport
- Combat Witness
- Passive Telemetry
- Threat Intel
- Clipboard Acquisition
- runtime diagnostics
- local metadata

Do not run a seed bootstrap process that renames the project or resets product identity.

## Normal Development Commands

```powershell
npm install
npm run verify:all
npm.cmd run smoke:electron
npm start
```

## Source Of Truth

Use these docs for current behavior:

- `README.md`
- `docs/current-state/current-implementation.md`
- `docs/tenets/tenets.md`
- `docs/features/vision.md`
- `docs/gap/to-do/README.md`

The old seed rule still applies as an implementation warning:

```text
Borrow proven rigging. Do not import domain weight before the domain has earned it.
```
