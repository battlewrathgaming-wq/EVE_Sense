# Gap To-Do: AURA-Sense Rewrite Readiness

Date: 2026-05-22
Status: Open

## Purpose

Track the work required before AURA-Sense can honestly claim tactical viewport readiness.

## Actionables

- Keep package metadata mirrored to AURA-Sense and replace remaining user-facing seed shell text when product shell work begins.
- Keep `npm run verify:all` as the offline confidence command.
- Keep renderer boundary static checks in `npm run verify:all`.
- Keep service command validation in place; attach prepared scan/settings validators as those runtime services are added.
- Rebuild EVE log watcher behavior with parser fixtures.
- Keep Combat Witness backend snapshots as the first runtime-lane foundation, but do not add presentation before diagnostics throttling.
- Use the proposed Tactical Viewport First Light milestone to introduce the first product-facing renderer surface after runtime error handling and snapshot bridge work.
- Rebuild Passive Telemetry with local-first system metadata.
- Rebuild Threat Intel with zKill discovery, ESI expansion, capped sample metadata, and freshness language.
- Keep Combat Witness backend-owned normalized events, bounded rolling cache, and 5s/15s/30s snapshots as the foundation for future presentation.
- Keep live/API smoke checks separate from offline verification.
- Record completion evidence in `docs/gap/complete/` as gaps close.

## Guardrails

- Do not let renderer code parse logs, call zKill/ESI, or compute tactical truth.
- Do not merge Passive Telemetry, Threat Intel, and Combat Witness into one ambiguous global threat object.
- Do not copy Atlas persistence or watch execution into AURA-Sense core.
- Do not imply complete combat or intelligence certainty in UI language.
- Do not treat historical lineage docs as proof of current AURA-Sense runtime behavior.
- Do not wire renderer Combat Witness presentation until diagnostics and runtime failure handling are ready enough to make degraded states visible.
- Do not treat Tactical Viewport First Light as full tactical viewport readiness; it is a narrow proof of renderer-owned presentation over backend-owned snapshots.

## Completion Signal

AURA-Sense has a verified tactical viewport skeleton with separated telemetry lanes, backend-owned snapshots, scoped external clients, and fixture-backed parser/service tests.

## Related Documents

- `docs/audits/audit-2026-05-22-aura7-scope-alignment.md`
- `docs/tenets/tenets.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/roadmap/milestone-02-runtime-observability.md`
- `docs/roadmap/milestone-03-tactical-viewport-first-light.md`
- `docs/roadmap/development-artifact-trail.md`

