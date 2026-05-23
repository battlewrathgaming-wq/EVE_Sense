# Gap To-Do: Integrated Viewport Lane Priority And Snapshot Contract

Status: Complete
Priority: P0
Milestone: 10 - Integrated Tactical Viewport

## Need

AURA-Sense now has multiple verified lanes. The integrated viewport needs an explicit presentation contract so the renderer composes lane snapshots without inventing tactical truth.

## Actionables

- Define the lane order and first-glance hierarchy for Combat Witness, Passive Telemetry, and Threat Intel.
- List the exact snapshot fields eligible for integrated display.
- Keep freshness, stale, partial, blocked, capped, and unavailable states lane-specific.
- Decide whether the integrated viewport reads existing snapshots directly or uses a backend presentation adapter.
- Leave Combat Witness spike outlier emphasis deferred until calibration evidence exists.

## Guardrails

- Do not merge lane state into one ambiguous global threat score.
- Do not move computation into renderer.
- Do not hide partial or blocked state to make the viewport look cleaner.
- Do not display provider data without provider/freshness/sample basis.

## Completion Signal

- Dev has a written lane display contract before layout work begins.
- Renderer presentation can be verified against backend-owned snapshot fields.
- `npm.cmd run verify:all` passes.

## Related Files

- `docs/roadmap/milestone-10-integrated-tactical-viewport.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/telemetry-lane-contract.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
