# Gap To-Do: AURA-Sense Tactical Readiness

Date: 2026-05-22
Status: Open

## Purpose

Track the work required before AURA-Sense can honestly claim tactical viewport readiness.

## Actionables

- Keep package metadata mirrored to AURA-Sense and keep remaining inherited seed service names below the visible product surface until those services are replaced.
- Keep `npm run verify:all` as the offline confidence command.
- Keep renderer boundary static checks in `npm run verify:all`.
- Keep service command validation in place; attach prepared scan/settings validators as those runtime services are added.
- Rebuild EVE log watcher behavior with parser fixtures.
- Keep Combat Witness backend snapshots and the first-light renderer surface as the first runtime-lane foundation.
- Keep Combat Witness runtime path control and watcher lifecycle backend-owned.
- Treat Tactical Viewport First Light as complete, not as full tactical viewport readiness.
- Rebuild Passive Telemetry with local-first system metadata.
- Treat Passive Telemetry foundation as complete; local metadata-backed resolver and live smoke remain future hardening.
- Rebuild Threat Intel around a search-bar zKillmail probe with capped sample metadata and freshness language; keep ESI expansion deferred until explicitly authorized.
- Keep Combat Witness backend-owned normalized events, bounded rolling cache, and 5s/15s/30s snapshots as the foundation for future presentation.
- Keep live/API smoke checks separate from offline verification.
- Keep Electron visual smoke separate from offline verification.
- Treat Combat Logging Test Suite as complete with raw repair/healing parser support explicitly deferred until exact samples exist.
- Use feature-aligned milestones for implementation sequencing instead of assigning one-off micro-tasks.
- Record completion evidence in `docs/gap/complete/` as gaps close.

## Guardrails

- Do not let renderer code parse logs, call zKill/ESI, or compute tactical truth.
- Do not merge Passive Telemetry, Threat Intel, and Combat Witness into one ambiguous global threat object.
- Do not copy Atlas persistence or watch execution into AURA-Sense core.
- Do not imply complete combat or intelligence certainty in UI language.
- Do not treat older imported docs as proof of current AURA-Sense runtime behavior.
- Do not treat Tactical Viewport First Light as full tactical viewport readiness; it is a narrow proof of renderer-owned presentation over backend-owned snapshots.

## Completion Signal

AURA-Sense has a verified tactical viewport skeleton with separated telemetry lanes, backend-owned snapshots, scoped external clients, and fixture-backed parser/service tests.

## Related Documents

- `docs/audits/audit-2026-05-22-aura-sense-scope-alignment.md`
- `docs/tenets/tenets.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/roadmap/milestone-02-runtime-observability.md`
- `docs/roadmap/milestone-03-tactical-viewport-first-light.md`
- `docs/roadmap/feature-aligned-milestones.md`
- `docs/roadmap/milestone-05-combat-witness-operational-loop.md`
- `docs/gap/complete/readiness-14-combat-witness-operational-loop.md`
- `docs/gap/complete/readiness-15-passive-telemetry-foundation.md`
- `docs/gap/complete/combat-log-dataset-fixture-ingestion.md`
- `docs/gap/complete/combat-log-event-coverage-matrix.md`
- `docs/gap/complete/combat-log-replay-harness.md`
- `docs/gap/complete/combat-log-golden-snapshot-tests.md`
- `docs/gap/complete/combat-log-repair-healing-fixtures.md`
- `docs/roadmap/milestone-06-passive-telemetry-foundation.md`
- `docs/gap/complete/readiness-12-tactical-hud-first-light.md`
- `docs/gap/complete/readiness-13-electron-visual-smoke.md`
- `docs/roadmap/development-artifact-trail.md`

