# Current Workspace Packet

Status: Idle
Updated: 2026-06-01
Owner: Overseer

## Coordination State

Active milestone: M16 - Body-To-Adapter Readiness
Roadmap source: `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
Current runway: None
Current executor: None
Current status: Idle after M16E Passive Local Glass Trial acceptance
Expected output: None

Latest accepted slice: M16E - Passive Local Glass Trial
Latest Dev handoff: `workspace/DevHS69-passive-local-glass-trial.md`
Latest Overseer acceptance: `workspace/OverseerHS70-passive-local-glass-trial-acceptance.md`

Previous accepted slice: M16D - Passive Static Head Trial
Previous Dev handoff: `workspace/DevHS67-passive-static-head-trial.md`
Previous Overseer acceptance: `workspace/OverseerHS68-passive-static-head-trial-acceptance.md`

Source records:

- `workspace/DevHS63-passive-adapter-landing-pad.md`
- `workspace/OverseerHS64-passive-adapter-landing-pad-acceptance.md`
- `workspace/RelayReviewHS65-lab-static-starter-head.md`
- `workspace/OverseerHS66-lab-static-starter-head-relay-review-acceptance.md`
- `workspace/DevHS67-passive-static-head-trial.md`
- `workspace/OverseerHS68-passive-static-head-trial-acceptance.md`
- `workspace/DevHS69-passive-local-glass-trial.md`
- `workspace/OverseerHS70-passive-local-glass-trial-acceptance.md`
- `workspace/critical/critical-terms.md`

## Resting State

M16B, M16C, M16D, and M16E are accepted.

Accepted M16E flow:

```txt
Lab sense-trial-glass package
-> trials/passive-local-glass/
-> Passive fixture snapshot
-> mapPassiveTelemetryAdapter(snapshot)
-> mapPassiveStaticHeadTrial(adapter)
-> sense-trial-readouts.json
-> inspect-head.html
STOP
```

Current accepted posture:

- Passive Telemetry has a provisional mapper for future presentation-head readiness.
- `src/passive/passiveTelemetryAdapter.js` maps `passive.telemetry.snapshot` to `passive.telemetry.adapter` with `adapterPreview`.
- `src/passive/passiveStaticHeadTrial.js` maps accepted Passive adapter output into `passive.static-head-trial.input`.
- `trials/passive-local-glass/` stages Lab's glass locally and uses Sense-generated `sense-trial-readouts.json`.
- The local glass trial is inspectable without `F:\Projects\AURA- Lab`.
- The Lab selector page and Lab example JSON are not staged as the Sense view.
- No product UI adoption, renderer wiring, bridge/preload/IPC connection, runtime integration, live provider call, clipboard read, private path read, manual EVE gamelog ingest, symlink, package install, or cross-project runtime dependency is introduced.
- `adapterPreview` remains preserved.
- `displaySafe` and `certainty` remain absent.
- Fixture/offline verification covers fresh, stale, partial, capped, blocked/I/O-off, degraded, and no-observation/unavailable cases.
- Lab example labels and fields remain presentation examples only. They are not Sense contracts, state enums, runtime behavior, or adoption approval.

## Local Inspection

Open locally:

```txt
F:\Projects\AURA-Sense\trials\passive-local-glass\inspect-head.html
```

This page is a local static trial surface, not Sense product UI.

## Runway Shape

At idle, M16 can move next only by Human/Overseer decision.

Candidate next moves:

1. Human/Overseer/UI review the local inspection page.
2. Send lightweight package-fit feedback to Lab.
3. Park M16 until a product-facing visual/adoption packet is explicitly opened.

No Dev work is open right now.

## Preserved Guardrails

- Do not adopt a Lab face without a future active packet.
- Do not implement a renderer face without a future active packet.
- Do not integrate the local glass trial into product UI without a future active packet.
- Do not require `F:\Projects\AURA- Lab` or any other cross-project path at verification/demo time.
- Do not use symlinks or external path imports to reach Lab files.
- Do not turn the package into full renderer adoption, app shell replacement, routing/navigation, app-wide state management, or broad frontend architecture.
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
