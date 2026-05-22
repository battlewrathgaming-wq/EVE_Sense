# Gap To-Do: Combat Witness Snapshot Bridge

Date: 2026-05-22
Status: Open
Priority: P3

## Need

Combat Witness now has backend-owned snapshots, but the renderer does not yet have a safe subscription path for them.

This gap should be implemented after diagnostics throttling and runtime error handling so snapshot delivery and degraded states are observable without noisy renderer traffic.

## Actionables

- Add a backend service or IPC boundary for Combat Witness snapshot subscription.
- Expose only compact snapshot output to preload/renderer.
- Keep raw parser events and rolling metric computation in backend code.
- Add unsubscribe/cleanup behavior for renderer consumers.
- Add a bounded update cadence if snapshots can emit rapidly.
- Add verification that renderer does not import `src/combat` modules.
- Add verification that renderer does not compute Combat Witness metrics.
- Keep the initial renderer presentation minimal and observation-safe if a visual surface is added.
- Preserve snapshot freshness fields so the renderer can show stale/empty states without inventing meaning.
- Keep event stream items bounded in the renderer view model.

## Guardrails

- Do not parse logs in renderer.
- Do not let renderer subscribe directly to raw watcher callbacks.
- Do not add pressure, EWAR, topology, or tactical recommendations in this slice.
- Do not persist Combat Witness history.
- Do not flood renderer with one IPC message per raw combat event.
- Do not display Combat Witness as complete battlefield truth; labels must remain observed/recent/witnessed.

## Completion Signal

The renderer can receive backend-owned Combat Witness snapshots through an explicit boundary without owning telemetry computation.

## Evidence Of Completion

When complete, record:

- service or IPC boundary added
- snapshot shape exposed
- subscription/unsubscribe behavior
- update cadence or throttling policy
- renderer files touched
- verification output
- stale/empty snapshot behavior

## Related Documents

- `docs/roadmap/milestone-02-runtime-observability.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/gap/complete/readiness-07-combat-witness-core.md`
- `docs/schemas/hud-snapshot.md`
