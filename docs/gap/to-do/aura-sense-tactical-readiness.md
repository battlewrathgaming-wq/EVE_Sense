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
- Treat Passive Telemetry foundation and live-safe readiness as complete; live network smoke remains explicitly opt-in and deferred until `AURA_SENSE_LIVE_API=1`.
- Treat scoped Threat Intel and Clipboard Acquisition as complete for offline/gated foundation behavior; keep live Threat Intel zKill network smoke deferred until explicitly enabled and recorded.
- Keep ESI killmail expansion deferred until explicitly authorized.
- Keep local type metadata deferred until a concrete type-label consumer appears.
- Keep Combat Witness backend-owned normalized events, bounded rolling cache, and 5s/15s/30s snapshots as the foundation for future presentation.
- Treat Combat Witness weapon counts, source/target counts, repair balance, and spike outliers as backend-observed metrics; require copy/calibration guardrails before polished HUD emphasis.
- Keep live/API smoke checks separate from offline verification.
- Keep Electron visual smoke separate from offline verification.
- Treat Combat Logging Test Suite as complete with raw repair/healing parser support explicitly deferred until exact samples exist.
- Treat Passive Telemetry live-safe readiness as complete with live network smoke still deferred behind `AURA_SENSE_LIVE_API=1`.
- Proceed next with Milestone 10: integrated tactical viewport composition in `docs/roadmap/milestone-10-integrated-tactical-viewport.md`.
- After Milestone 10 acceptance, proceed to Milestone 11 operational hardening, then Milestone 12 live validation and tactical calibration.
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
- `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`
- `docs/roadmap/milestone-09-scoped-threat-intel-and-clipboard-acquisition.md`
- `docs/roadmap/milestone-10-integrated-tactical-viewport.md`
- `docs/roadmap/milestone-11-operational-hardening-and-runtime-control.md`
- `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
- `docs/audits/audit-2026-05-22-threat-intel-and-clipboard-handover.md`
- `docs/audits/audit-2026-05-22-post-threat-intel-combat-metrics-overseer-review.md`
- `docs/audits/audit-2026-05-22-next-two-milestones-overseer-scope.md`
- `docs/audits/audit-2026-05-22-post-passive-live-safe-next-runway.md`
- `docs/audits/audit-2026-05-22-next-dev-runway-handover.md`
- `docs/gap/complete/readiness-14-combat-witness-operational-loop.md`
- `docs/gap/complete/readiness-15-passive-telemetry-foundation.md`
- `docs/gap/complete/combat-log-dataset-fixture-ingestion.md`
- `docs/gap/complete/combat-log-event-coverage-matrix.md`
- `docs/gap/complete/combat-log-replay-harness.md`
- `docs/gap/complete/combat-log-golden-snapshot-tests.md`
- `docs/gap/complete/combat-log-repair-healing-fixtures.md`
- `docs/gap/complete/combat-log-replay-and-repair-balance-next-scope.md`
- `docs/gap/complete/passive-telemetry-local-system-resolver.md`
- `docs/gap/complete/passive-telemetry-esi-system-activity.md`
- `docs/gap/complete/passive-telemetry-scoped-zkill-route.md`
- `docs/gap/complete/passive-telemetry-live-io-gate.md`
- `docs/gap/complete/passive-telemetry-debugging-and-tracing.md`
- `docs/gap/complete/passive-telemetry-freshness-honesty.md`
- `docs/gap/complete/passive-telemetry-live-smoke-harness.md`
- `docs/gap/complete/threat-intel-scan-request-contract.md`
- `docs/gap/complete/threat-intel-target-resolution-boundary.md`
- `docs/gap/complete/threat-intel-zkill-scoped-probe.md`
- `docs/gap/complete/threat-intel-search-ui-surface.md`
- `docs/gap/complete/clipboard-acquisition-workflow.md`
- `docs/gap/complete/threat-intel-live-gate-and-observability.md`
- `docs/gap/complete/threat-intel-renderer-boundary-verification.md`
- `docs/gap/complete/readiness-05-zkill-ref-boundary.md`
- `docs/gap/complete/readiness-06-threat-intel-sample-metadata.md`
- `docs/gap/to-do/combat-window-weapon-spike-followups.md`
- `docs/roadmap/milestone-06-passive-telemetry-foundation.md`
- `docs/gap/complete/readiness-12-tactical-hud-first-light.md`
- `docs/gap/complete/readiness-13-electron-visual-smoke.md`
- `docs/roadmap/development-artifact-trail.md`

