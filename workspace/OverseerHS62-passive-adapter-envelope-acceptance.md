# OverseerHS62 - Passive Adapter Envelope Acceptance

Date: 2026-05-31
Role: AURA-Sense Overseer
Status: M16A accepted; ready for future tiny Dev packet

## Reviewed

- `workspace/EngSpecHS60-passive-telemetry-adapter-envelope.md`
- `workspace/TermAuditHS61-passive-adapter-wording-collision-review.md`
- `workspace/EngAuditHS58-backend-to-adapter-readiness-conformance.md`
- `workspace/OverseerHS59-backend-to-adapter-readiness-audit-acceptance.md`
- `workspace/current.md`
- `workspace/critical/critical-terms.md`

## Acceptance

M16A is accepted.

Passive Telemetry is ready for a future tiny Sense-owned adapter implementation packet, provided that packet remains:

- Passive-only
- provisional
- fixture/offline verified
- owned by Sense
- stopped before renderer face adoption
- stopped before Lab starter-kit adoption

Accepted adapter-shaping decisions:

- Prefer `adapterPreview` over `displaySafe`.
- Do not add a `certainty` slot for Passive Telemetry.
- Use `basis + freshness + warnings + gaps` as the Passive trust/limit model.
- Preserve `blocked`, `no observation`, `unavailable`, `degraded`, `stale`, `partial`, and `capped` as distinct states or warnings.
- Preserve ADR-0008: I/O off means Sense is not allowed to ingest.
- Treat `I/O off - ingest blocked` as the preferred future authority wording candidate.
- Keep `I/O Isolated` as a possible compact label, pending Human/Overseer decision.
- Avoid `Live Feed` / `Live Feed Isolated` for Passive because it can imply continuous feed/background monitoring.

## Lab Acknowledgement

Human relayed Lab acknowledgement:

- Lab starter-kit shape remains an example, not a Sense bridge/runtime contract.
- Lab `state`, `availability`, `NO DATA`, and `UNAVAILABLE` remain display example fields/labels, not target bridge enums.
- Sense-owned placeholders such as `blocked`, `no-scan`, and `degraded` stay source-owned and qualified.
- Lab will not recommend mapping Lab `NO DATA` over Sense `blocked`, `no observation`, or `unavailable`.
- No Sense implementation instruction is implied.

Accepted as useful downstream boundary confirmation only.

## Critical-Term Blueprint

`workspace/critical/critical-terms.md` now records the Passive adapter provisional terms so future Dev does not lose the blueprint.

## Next Decision Point

M16A does not automatically open Dev.

Next valid moves:

1. Park ready until presentation-head timing.
2. Open a tiny Dev packet for a Passive-only provisional adapter mapper with fixture/offline tests.
3. Do a final Human/Overseer wording call on `I/O off - ingest blocked` versus `I/O Isolated` before implementation.

## Guardrails

- Do not broaden into Combat Witness, Threat Intel, Clipboard Acquisition, or universal Aura adapter doctrine.
- Do not modify Lab files.
- Do not treat Lab starter-kit examples as Sense contracts.
- Do not run live/manual I/O.
- Do not adopt a renderer face from this acceptance.
