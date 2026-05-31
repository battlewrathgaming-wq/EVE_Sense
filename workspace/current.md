# Current Workspace Packet

Status: Idle
Updated: 2026-05-31
Owner: Overseer

## Coordination State

Active milestone: M16 - Body-To-Adapter Readiness
Roadmap source: `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
Current runway: None
Current executor: None
Current status: Idle after M16A Passive Telemetry adapter envelope acceptance
Expected output: None

Latest accepted slice: M16A - Passive Telemetry adapter envelope proof
Latest accepted spec: `workspace/EngSpecHS60-passive-telemetry-adapter-envelope.md`
Latest terminology audit: `workspace/TermAuditHS61-passive-adapter-wording-collision-review.md`
Latest Overseer acceptance: `workspace/OverseerHS62-passive-adapter-envelope-acceptance.md`

Source records:

- `workspace/EngAuditHS58-backend-to-adapter-readiness-conformance.md`
- `workspace/OverseerHS59-backend-to-adapter-readiness-audit-acceptance.md`
- `workspace/EngSpecHS60-passive-telemetry-adapter-envelope.md`
- `workspace/TermAuditHS61-passive-adapter-wording-collision-review.md`
- `workspace/OverseerHS62-passive-adapter-envelope-acceptance.md`
- `workspace/critical/critical-terms.md`

## Resting State

M16A is accepted.

Passive Telemetry is ready for a future tiny Sense-owned adapter implementation packet if the Human/Overseer chooses to open one later.

The future implementation packet should remain:

- Passive-only
- provisional
- fixture/offline verified
- Sense-owned
- stopped before renderer face adoption
- stopped before Lab starter-kit adoption

Current accepted adapter-shaping decisions:

- Prefer `adapterPreview` over `displaySafe`.
- Do not add a `certainty` slot for Passive Telemetry.
- Use `basis + freshness + warnings + gaps` as the Passive trust/limit model.
- Preserve `blocked`, `no observation`, `unavailable`, `degraded`, `stale`, `partial`, and `capped` as distinct states or warnings.
- Preserve ADR-0008: I/O off means Sense is not allowed to ingest.
- Treat `I/O off - ingest blocked` as the preferred future authority wording candidate.
- Keep `I/O Isolated` as a possible compact label, pending Human/Overseer decision.
- Avoid `Live Feed` / `Live Feed Isolated` for Passive because it can imply continuous feed/background monitoring.

Lab acknowledgement has been accepted as downstream boundary confirmation only:

- Lab starter-kit shapes are examples, not Sense bridge/runtime contracts.
- Lab states and labels such as `state`, `availability`, `NO DATA`, and `UNAVAILABLE` are display examples, not Sense enums.
- Lab will not recommend mapping Lab `NO DATA` over Sense `blocked`, `no observation`, or `unavailable`.
- No Sense implementation instruction is implied.

## Runway Shape

At idle, M16 can move next only by Human/Overseer decision.

Candidate next moves:

1. Park ready until presentation-head timing.
2. Open a tiny Dev packet for a Passive-only provisional adapter mapper with fixture/offline tests.
3. Do a final Human/Overseer wording call on `I/O off - ingest blocked` versus `I/O Isolated`.

No Dev work is open right now.

## Preserved M12 Resting State

M12 remains the live/manual validation and tactical calibration envelope, but no live/manual M12 work is open.

Preserve:

- `workspace/DevHS56-m12i-io-authority-reconciliation.md`
- `workspace/OverseerHS57-m12i-io-authority-reconciliation-acceptance.md`
- ADR-0008: I/O off means Sense is not allowed to ingest
- no live provider calls, real clipboard capture, private EVE log inspection, manual shortcut validation, or live operator smoke without future explicit Human authorization

## Preserved Guardrails

- Do not set `AURA_SENSE_LIVE_API=1` without a future active packet and explicit Human authorization.
- Do not run additional live zKill or ESI calls without a future active packet.
- Do not run live EVE log ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not capture real clipboard content.
- Do not execute live/manual I/O smoke.
- Do not rename source-owned terms.
- Do not change bridge contracts, IPC payload meanings, persistence schemas, services, or backend behavior without an active packet.
- Do not broaden Passive adapter readiness into Combat Witness, Threat Intel, Clipboard Acquisition, display design, Lab adoption, or universal Aura adapter doctrine.
- Do not treat Lab starter-kit examples as Sense contracts.
- Do not adopt a renderer face from M16A acceptance.

## Candidate Next M16 Slice

Open only by Human/Overseer decision:

Tiny Dev packet for a Passive-only provisional adapter mapper that:

- maps current `passive.telemetry.snapshot` into a Sense-owned envelope
- uses `adapterPreview`, not `displaySafe`
- preserves basis, freshness, warnings, gaps, diagnostics, and authority state
- keeps all verification fixture/offline
- does not change bridge contracts, renderer face, Lab files, or live/manual behavior

## Handoff Requirements

None while idle.
