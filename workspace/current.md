# Current Workspace Packet

Status: Idle
Updated: 2026-06-01
Owner: Overseer

## Coordination State

Active milestone: M16 - Body-To-Adapter Readiness
Roadmap source: `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
Current runway: None
Current executor: None
Current status: Idle after M16D Passive Static Head Trial acceptance
Expected output: None

Latest accepted slice: M16D - Passive Static Head Trial
Latest Dev handoff: `workspace/DevHS67-passive-static-head-trial.md`
Latest Overseer acceptance: `workspace/OverseerHS68-passive-static-head-trial-acceptance.md`

Previous accepted slice: M16B - Passive Adapter Landing Pad
Previous Dev handoff: `workspace/DevHS63-passive-adapter-landing-pad.md`
Previous Overseer acceptance: `workspace/OverseerHS64-passive-adapter-landing-pad-acceptance.md`
Latest relay review: `workspace/RelayReviewHS65-lab-static-starter-head.md`
Latest relay acceptance: `workspace/OverseerHS66-lab-static-starter-head-relay-review-acceptance.md`

Source records:

- `workspace/EngAuditHS58-backend-to-adapter-readiness-conformance.md`
- `workspace/OverseerHS59-backend-to-adapter-readiness-audit-acceptance.md`
- `workspace/EngSpecHS60-passive-telemetry-adapter-envelope.md`
- `workspace/TermAuditHS61-passive-adapter-wording-collision-review.md`
- `workspace/OverseerHS62-passive-adapter-envelope-acceptance.md`
- `workspace/DevHS63-passive-adapter-landing-pad.md`
- `workspace/OverseerHS64-passive-adapter-landing-pad-acceptance.md`
- `workspace/RelayReviewHS65-lab-static-starter-head.md`
- `workspace/OverseerHS66-lab-static-starter-head-relay-review-acceptance.md`
- `workspace/DevHS67-passive-static-head-trial.md`
- `workspace/OverseerHS68-passive-static-head-trial-acceptance.md`
- `workspace/critical/critical-terms.md`

## Resting State

M16B, M16C, and M16D are accepted.

Accepted M16D flow:

```txt
Passive fixture snapshot
-> mapPassiveTelemetryAdapter(snapshot)
-> mapPassiveStaticHeadTrial(adapter)
-> passive.static-head-trial.input
STOP
```

Current accepted posture:

- Passive Telemetry has a provisional mapper for future presentation-head readiness.
- `src/passive/passiveTelemetryAdapter.js` maps `passive.telemetry.snapshot` to `passive.telemetry.adapter` with `adapterPreview`.
- `src/passive/passiveStaticHeadTrial.js` maps accepted Passive adapter output into `passive.static-head-trial.input`.
- Both mappers are Passive-only and fixture/offline verified.
- Neither mapper is connected to runtime, bridge, preload, renderer, Lab, or a presentation head.
- `adapterPreview` remains preserved.
- `displaySafe` and `certainty` remain absent.
- Fixture/offline verification covers fresh, stale, partial, capped, blocked/I/O-off, degraded, and no-observation/unavailable cases.
- Lab's static starter head remains acceptable as a display-only offer for a future Passive-only visual trial, with cautions.
- Lab example labels and fields remain presentation examples only. They are not Sense contracts, state enums, runtime behavior, or adoption approval.

## Runway Shape

At idle, M16 can move next only by Human/Overseer decision.

Candidate next moves:

1. Ask Lab for a clean packaged static/React pane head for a future local visual demo.
2. Ask UI/UX to review the `passive.static-head-trial.input` shape before visual packaging.
3. Park M16 until Lab package timing is right.

No Dev work is open right now.

## Preserved Guardrails

- Do not adopt a Lab face without a future active packet.
- Do not implement a renderer face without a future active packet.
- Do not integrate Lab starter-kit files without a future active packet.
- Do not require `F:\Projects\AURA- Lab` or any other cross-project path at verification/demo time.
- Do not use symlinks or external path imports to reach Lab files.
- Do not turn a React starter pane into full renderer adoption, app shell replacement, routing/navigation, app-wide state management, or broad frontend architecture.
- Do not treat Lab `CURRENT`, `AGED`, `PARTIAL`, `UNAVAILABLE`, `FALLBACK`, `NO DATA`, `availability`, or `coverage` as Sense bridge/runtime contracts.
- Do not map Sense `No observation`, `I/O off - ingest blocked`, `Degraded`, or unavailable states directly to Lab absence labels without Sense-owned reason-first translation.
- Do not modify Lab files.
- Do not create a universal Aura adapter.
- Do not broaden into Combat Witness, Threat Intel, or Clipboard Acquisition.
- Do not rename Sense contracts, IPC channels, payload fields, services, schemas, CSS/test selectors, or user-facing terms.
- Do not change Passive Telemetry runtime/provider behavior without a future active packet.
- Do not run live provider smoke without explicit Human authorization.
- Do not run live/manual EVE gamelog ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not capture clipboard content.
- Do not run real SDE refresh/download.

## Preserved M12 Resting State

M12 remains the live/manual validation and tactical calibration envelope, but no live/manual M12 work is open.

Preserve:

- `workspace/DevHS56-m12i-io-authority-reconciliation.md`
- `workspace/OverseerHS57-m12i-io-authority-reconciliation-acceptance.md`
- ADR-0008: I/O off means Sense is not allowed to ingest
- no live provider calls, real clipboard capture, private EVE log inspection, manual shortcut validation, or live operator smoke without future explicit Human authorization

## Handoff Requirements

None while idle.
