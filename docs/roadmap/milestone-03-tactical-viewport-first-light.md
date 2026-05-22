# Milestone 03: Tactical Viewport First Light

Status: Complete
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

AURA-Sense exists to decompress cognition under pressure.

The product vision is not "more panels" and not "more intelligence." It is a trustworthy tactical viewport that answers:

```txt
What is happening around me right now?
What must I do?
```

The first light milestone should prove that vision in the smallest honest way: a renderer surface that consumes backend-owned Combat Witness snapshots and presents recent observation state without overclaiming, persisting, or calculating tactical truth in the renderer.

The mantra remains:

```txt
Observe conservatively.
Compute in backend.
Present tactically.
Do not overclaim.
Keep telemetry transient.
Prefer actionable clarity over information density.
```

## Starting Conditions

This milestone should not begin until Milestone 02 has completed:

- diagnostics throttling
- runtime error handling
- Combat Witness snapshot bridge

Milestone 02 is complete as of the current handover.

## Completion Verdict

Milestone 03 first light is complete with caveats.

The renderer now presents a compact Combat Witness surface through the preload snapshot bridge. It consumes backend-owned freshness status and rolling metrics, keeps the event stream bounded, and preserves renderer boundary verification.

This is not full tactical viewport readiness. Threat Intel, Passive Telemetry, pressure, EWAR, topology, recommendations, and production watcher lifecycle wiring remain deferred.

The milestone began with:

- backend Combat Witness snapshots
- a safe preload/service subscription path
- diagnostics that preserve degraded states
- renderer boundary static verification

## Product Direction

The first viewport should feel like a tactical instrument, not a report.

Prioritize:

- one glanceable Combat Witness surface
- fresh/stale/empty state clarity
- stable layout
- small labels
- restrained visual hierarchy
- no historical framing

Avoid:

- pressure gauges before pressure semantics are proven
- EWAR/topology inference
- broad Threat Intel expansion
- Atlas-style evidence language
- decorative UI work that does not improve tactical clarity

## Instructional Slices

### Slice 1: Snapshot Contract Confirmation

- Confirm the exact snapshot fields exposed by the bridge.
- Update `docs/schemas/hud-snapshot.md` if the renderer-facing shape changed.
- Define fresh/stale/empty wording before UI work.
- Add fixture or static verification for the expected snapshot shape.

Status: Complete.

### Slice 2: Minimal Renderer Consumption

- Render Combat Witness snapshot state only.
- Keep computation in backend.
- Keep event stream display bounded.
- Show empty state honestly when no recent events exist.
- Show stale state from freshness metadata rather than renderer guesses.

Status: Complete.

### Slice 3: Presentation Boundary Verification

- Extend renderer boundary checks if needed to reject Combat Witness metric computation in renderer.
- Verify renderer does not import `src/combat`.
- Verify renderer does not contain parser regexes or raw log parsing signals.
- Keep `npm.cmd run verify:all` offline and passing.

Status: Complete.

### Slice 4: Product Language Pass

- Replace any seed-shell labels visible in the first operational viewport.
- Use observed, recent, witnessed, stale, expired, and unavailable language.
- Avoid hostile, primary, confirmed, or complete unless the backend can prove it.
- Record the approved copy in the completion handover.

Status: Complete.

## Completion Signal

Milestone 03 is complete when the first renderer viewport can present backend-owned Combat Witness snapshot state with clear freshness and no renderer-owned telemetry authority.

This does not mean full tactical viewport readiness.

This does mean AURA-Sense has crossed from seed rigging into the first honest tactical product surface.

## Explicit Deferrals

- Threat Intel zKill/ESI scans
- Passive Telemetry system stats
- pressure gauges
- EWAR observations
- combat topology
- recommendations or AI tactical advice
- Atlas persistence or export handoff

## Related Packets

- `docs/gap/complete/readiness-12-tactical-hud-first-light.md`
- `docs/audits/audit-2026-05-22-tactical-hud-first-light-handover.md`
- `docs/gap/complete/readiness-11-combat-witness-snapshot-bridge.md`
- `docs/roadmap/milestone-02-runtime-observability.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/schemas/hud-snapshot.md`
