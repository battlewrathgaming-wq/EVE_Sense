# M16 - Body-To-Adapter Readiness

Status: Active bounded adapter-readiness lane

Reopened note: 2026-06-01 - Human direction reopened a bounded Sense-owned adapter-readiness lane after M16A accepted Passive Telemetry as ready for a future tiny adapter implementation packet. Lab-facing presentation adoption remains parked. This milestone now covers only body-to-adapter readiness work owned by Sense.

## Outcome

AURA-Sense can prove selected lanes from ingest through transformation, Sense-owned state semantics, and bridge output up to the target-owned adapter boundary before adopting or fitting a Lab face.

This milestone validates the Sense body before presentation adoption:

```txt
ingest/source
-> transformation
-> Sense-owned state semantics
-> bridge snapshot/event output
-> target-owned adapter boundary
STOP
```

## Why This Is Milestone-Sized

This is more than a display request or a single UI task because it checks whether the product body is coherent enough for later presentation work:

- source data enters through the expected lane boundary
- transformations preserve Sense meaning
- emitted bridge state contains enough source, freshness, certainty, basis, warning, and gap information for an adapter
- domain facts remain separate from display hints
- Lab slim display language stays after the Sense-owned adapter boundary
- Atlas historical-proof semantics stay out unless a future explicit integration opens them

The point is not to build the face. The point is to know that the body is truthful, bounded, and ready for a future adapter.

## Likely Runways

- Audit Clipboard Acquisition from source/runtime state through bridge output and identify the minimum adapter input envelope.
- Audit Passive Telemetry from sample source through freshness, stale, partial, capped, blocked, degraded, and no-observation bridge states.
- Review Combat Witness only after lower-risk lanes prove the shape, because combat display carries higher overclaim and tactical-certainty risk.
- Classify current bridge-facing fields as Sense domain facts, display hints, diagnostics, or adapter-needed slots.
- Add or refine deterministic verification that proves bridge output shape and state transitions without live provider smoke or manual shortcut validation.
- Implement a tiny Passive-only provisional adapter mapper after the Passive envelope is accepted, stopping before renderer face adoption or Lab integration.

## Acceptance Criteria

M16 is complete when:

- at least one bounded lane has a documented ingest -> transformation -> bridge -> adapter-boundary trace
- the trace identifies which fields are Sense-owned facts versus display hints or diagnostics
- the trace identifies the minimum neutral adapter input envelope needed by a future face without turning Lab material schemas into Sense bridge contracts
- blocked, stale, partial, capped, failed, no-scan, and no-observation states remain lane-specific where applicable
- Lab slim/lab-term remains interface-side language after the adapter boundary, not Sense bridge authority
- Atlas terminology is not treated as a live Sense conflict unless a future UDP/TCP integration is explicitly opened
- verification expectations are named and avoid live/manual work unless separately authorized
- no renderer face adoption, UI redesign, contract rewrite, or Dev implementation is implied without a later `workspace/current.md` packet
- any implementation slice remains tiny, lane-specific, fixture/offline verified, and reversible

## Non-Goals

- Do not adopt a Lab face.
- Do not build a universal Aura adapter.
- Do not rename Sense bridge fields or contracts from Lab display language.
- Do not run live provider smoke, manual shortcut validation, or real SDE refresh/download.
- Do not import Atlas historical proof, discovery, assessment, watch, storage, or workstation semantics.
- Do not treat Lab slim/lab-term as Sense internal or bridge authority.
- Do not create implementation authority outside `workspace/current.md`.

## Dependencies

- `docs/adr/ADR-0003-target-owned-presentation-adapters.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/current-state/current-implementation.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `workspace/display_inventory.md`
- `workspace/request_display.md`
- `workspace/display-request-workflow-hardening-contract.md`
- Lab advisory response to `sense.clipboard-window`, if the first slice uses Clipboard Acquisition
- Human/Sense decision on which first lane to trace

## Suggested First Slice

Start with Clipboard Acquisition if the goal is a compact body-to-adapter proof:

- it is already scoped by `sense.clipboard-window`
- it has clear authority-window and cooldown behavior
- it has strong must-not-imply boundaries around background clipboard monitoring
- it can stop at adapter readiness without adopting a face

Start with Passive Telemetry if the goal is harder state-pressure:

- it stresses freshness, stale, partial, capped, blocked, degraded, and no-observation states
- it is a stronger test of the neutral state envelope
- it carries more display-density and hierarchy risk than Clipboard Acquisition

## Verification Shape

For review-only packets:

- `npm.cmd run verify:protected-terms`
- `git status --short --branch`

For implementation or verification runways, the active `workspace/current.md` packet should choose exact commands. Likely candidates include:

- `npm.cmd run verify:clipboard-race`
- `npm.cmd run verify:passive-telemetry`
- `npm.cmd run verify:renderer-boundary`
- `npm.cmd run verify:renderer-shell`
- `npm.cmd run verify:all`

No live provider smoke, manual shortcut validation, or real SDE refresh/download is implied by this candidate milestone.

## Current State

M16A is accepted:

- `workspace/EngAuditHS58-backend-to-adapter-readiness-conformance.md`
- `workspace/OverseerHS59-backend-to-adapter-readiness-audit-acceptance.md`
- `workspace/EngSpecHS60-passive-telemetry-adapter-envelope.md`
- `workspace/TermAuditHS61-passive-adapter-wording-collision-review.md`
- `workspace/OverseerHS62-passive-adapter-envelope-acceptance.md`

Accepted M16A outcome:

- Passive Telemetry is ready for a future tiny Sense-owned adapter implementation packet.
- Future adapter work should use `adapterPreview`, not `displaySafe`.
- Passive should use `basis + freshness + warnings + gaps`, not a `certainty` slot.
- Adapter work must remain Sense-owned and stop before renderer face adoption, Lab starter-kit adoption, live/manual I/O, or universal adapter doctrine.

M16B is accepted:

- `workspace/DevHS63-passive-adapter-landing-pad.md`
- `workspace/OverseerHS64-passive-adapter-landing-pad-acceptance.md`

Accepted M16B outcome:

- A tiny Sense-owned Passive adapter landing pad exists at `src/passive/passiveTelemetryAdapter.js`.
- It maps `passive.telemetry.snapshot` to `passive.telemetry.adapter` with `adapterPreview`.
- It is Passive-only, isolated, fixture/offline verified, and stops before renderer, bridge, preload, runtime, Lab, or presentation-head integration.

M16C advisory relay review is accepted:

- `workspace/RelayReviewHS65-lab-static-starter-head.md`
- `workspace/OverseerHS66-lab-static-starter-head-relay-review-acceptance.md`

Accepted M16C outcome:

- Lab's static starter head is usable with cautions as a display-only offer for a future Sense-owned Passive static trial.
- Any trial should use static fixture output from `passive.telemetry.adapter`.
- Lab example labels and fields remain presentation examples only, not Sense state enums, bridge/runtime contracts, or adoption approval.
- No renderer face, Lab starter-kit adoption, UI redesign, or Dev implementation is open without a future `workspace/current.md` packet.

M16D is accepted:

- `workspace/DevHS67-passive-static-head-trial.md`
- `workspace/OverseerHS68-passive-static-head-trial-acceptance.md`

Accepted M16D outcome:

- A Sense-local Passive static head trial mapper exists at `src/passive/passiveStaticHeadTrial.js`.
- It maps accepted `passive.telemetry.adapter` output into `passive.static-head-trial.input`.
- It proves the Sense-side seam for future packaged presentation-head inspection.
- It does not import Lab files, copy Lab files, connect runtime, connect renderer, adopt a Lab face, or create product UI.
- The verifier is included in `verify:all` and covers fresh, stale, partial, capped, blocked/I/O-off, degraded, and no-observation/unavailable cases.

M16E is accepted:

- `workspace/DevHS69-passive-local-glass-trial.md`
- `workspace/OverseerHS70-passive-local-glass-trial-acceptance.md`

Accepted M16E outcome:

- Lab's `sense-trial-glass` package is staged locally under `trials/passive-local-glass/`.
- The local glass uses Sense-generated `sense-trial-readouts.json`, not Lab example JSON.
- The Lab selector page is not staged as the Sense view.
- The local inspection page is available at `trials/passive-local-glass/inspect-head.html`.
- The package remains a static local glass trial only; no product UI adoption, runtime connection, renderer wiring, or Lab authority transfer is implied.
- `verify:passive-local-glass` is included in `verify:all`.

Do not keep active without `workspace/current.md`:

- Lab face adoption
- broad body-to-adapter trace runway
- adapter implementation beyond the named active packet
- additional display requests derived from M16
