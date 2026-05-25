# Overseer HS18 - Lab Parked And Render/Frame Pivot

Status: Resting direction record, not executable authority
Date: 2026-05-25
Role: AURA-Sense Overseer

## Human Direction

Lab will be parked for a bit while Lab-side matters are fixed:

- SmokeFlash needs to be removed from Lab export/workshop concerns.
- Lab still needs rendering functionality and frame manipulation improvement/testing.

For AURA-Sense, the near direction is:

```txt
sprint on performance, worry about presentation later
```

The Human is comfortable closing M16 as mainly a feature/request direction.

## Sense Interpretation

M16 is closed as parked direction, not executed implementation.

Sense keeps:

- target-owned adapter ADR
- body-before-face principle
- future possible body-to-adapter trace idea

Sense parks:

- Lab face adoption
- adapter implementation
- new Lab-facing display requests
- M16 body-to-adapter trace runway

## Next Candidate Direction

The next useful Sense-local direction is M17:

```txt
Render and Frame performance assurance
```

Focus:

- Frame module behavior
- Electron window manipulation and persistence
- renderer shell readiness
- renderer boundary safety
- visual smoke reliability
- performance/readiness observations

This should happen before presentation adoption resumes.

## Important Boundary

SmokeFlash removal is a Lab-side matter unless a future Sense packet explicitly imports or depends on a Lab renderer/head export.

Sense should not remove, repair, or model Lab SmokeFlash locally from this artifact.

## Candidate First Runway

When the Human opens cross-agent or Dev work, shape a bounded M17 packet around:

```txt
Frame module + renderer smoke assurance review
```

Likely verification:

- `npm.cmd run verify:frame`
- `npm.cmd run verify:renderer-shell`
- `npm.cmd run verify:renderer-boundary`
- `npm.cmd run verify:renderer-boundary-adversarial`
- `npm.cmd run verify:all`
- `npm.cmd run smoke:electron` only if renderer-visible or Electron-window behavior changes, or if the packet explicitly asks for runtime smoke

## Guardrails

- Do not open Dev work from this artifact alone.
- Do not adopt a Lab face.
- Do not implement a Sense adapter.
- Do not create additional Lab-facing requests while Lab is parked.
- Do not run live provider smoke, manual shortcut validation, or real SDE refresh/download.
- Do not weaken renderer boundary rules for convenience.
- Keep `workspace/current.md` as the only executable runway.
