# Gap To-Do: AURA-Sense Rewrite Readiness

Date: 2026-05-22
Status: Open

## Purpose

Track the work required before AURA-Sense can honestly claim Aura 7 tactical viewport parity.

## Actionables

- Keep package metadata mirrored to AURA-Sense and replace remaining user-facing seed shell text when product shell work begins.
- Keep `npm run verify:all` as the offline confidence command.
- Keep renderer boundary static checks in `npm run verify:all`.
- Add service command validation for scan, settings, network, and frame commands.
- Rebuild EVE log watcher behavior with parser fixtures.
- Rebuild Passive Telemetry with local-first system metadata.
- Rebuild Threat Intel with zKill discovery, ESI expansion, capped sample metadata, and freshness language.
- Rebuild Combat Witness as backend-owned normalized events, bounded rolling cache, and 5s/15s/30s snapshots.
- Keep live/API smoke checks separate from offline verification.
- Record completion evidence in `docs/gap/complete/` as gaps close.

## Guardrails

- Do not let renderer code parse logs, call zKill/ESI, or compute tactical truth.
- Do not merge Passive Telemetry, Threat Intel, and Combat Witness into one ambiguous global threat object.
- Do not copy Atlas persistence or watch execution into AURA-Sense core.
- Do not imply complete combat or intelligence certainty in UI language.
- Do not treat historical Aura 7 docs as proof of current AURA-Sense runtime behavior.

## Completion Signal

AURA-Sense has a verified tactical viewport skeleton with separated telemetry lanes, backend-owned snapshots, scoped external clients, and fixture-backed parser/service tests.

## Related Documents

- `docs/audits/audit-2026-05-22-aura7-scope-alignment.md`
- `docs/tenets/tenets.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`

