# Context

Status: Active

## Project Frame

AURA-Sense is a tactical cognition and situational awareness system.

It should answer:

```txt
What is happening around me right now?
What must I notice?
What is stale, partial, unavailable, or uncertain?
```

## Non-Negotiables

- Renderer presents; backend owns truth.
- Combat Witness, Passive Telemetry, and Threat Intel remain separate lanes.
- Clipboard Acquisition is armed, visible, short-lived, sealed, and cooldown-bound.
- Live APIs are explicit, gated, scoped, and outside offline verification.
- Atlas persistence remains absent unless an ADR authorizes a narrow handoff.
- SDE downloads are generated artifacts and should not be staged by default.

## Current Entry Points

- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/roadmap/feature-aligned-milestones.md`
- `docs/roadmap/development-artifact-trail.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- latest relevant file in `docs/audits/`

## Verification Defaults

Offline confidence:

```powershell
npm.cmd run verify:all
```

Electron/manual smoke:

```powershell
npm.cmd run smoke:electron
```

Live API smoke:

```powershell
npm.cmd run smoke:passive-live-api
```

Live API smoke must stay explicit and gated.
