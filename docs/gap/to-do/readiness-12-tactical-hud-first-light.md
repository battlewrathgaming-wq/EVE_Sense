# Gap To-Do: Tactical HUD First Light

Date: 2026-05-22
Status: Open
Priority: P4

Current sequencing: Active next slice after Milestone 02 completion.

## Need

AURA-Sense needs a first product-facing tactical viewport that proves the doctrine without pretending to be full tactical viewport readiness.

This is not a landing page, dashboard demo, or rich combat UI. It is the first low-cognitive-load renderer surface consuming backend-owned snapshots.

## Actionables

- Replace remaining seed-shell product copy only where it appears in the first operational surface.
- Present Combat Witness snapshot state from the snapshot bridge.
- Show observed/recent/stale/empty language.
- Keep the layout compact and stable under stress.
- Avoid investigative density and historical framing.
- Keep renderer state presentation-only.
- Add renderer verification for boundary and wording expectations.
- Preserve `npm run verify:all` as the offline confidence command.

## Guardrails

- Do not add pressure gauges, EWAR, topology, or recommendations.
- Do not call APIs from renderer.
- Do not parse logs in renderer.
- Do not persist Combat Witness history.
- Do not imply complete combat truth.
- Do not build Passive Telemetry or Threat Intel inside this slice.

## Completion Signal

The first viewport can answer a narrow version of:

```txt
What has been observed recently?
Is the signal fresh, stale, or empty?
```

without renderer-owned telemetry computation.

## Evidence Of Completion

When complete, record:

- renderer files touched
- snapshot fields consumed
- wording used for fresh/stale/empty states
- verification output
- any visual smoke evidence if run

## Related Documents

- `docs/roadmap/milestone-03-tactical-viewport-first-light.md`
- `docs/roadmap/milestone-02-runtime-observability.md`
- `docs/audits/audit-2026-05-22-artifact-and-first-light-handover.md`
- `docs/audits/audit-2026-05-22-documentation-drift-overseer-review.md`
- `docs/gap/complete/readiness-11-combat-witness-snapshot-bridge.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/schemas/hud-snapshot.md`
