# Audit: Active To-Do Trail Review

Date: 2026-05-23
Status: Complete

## Scope

Review active packets in `docs/gap/to-do` before continuing implementation, so completed work is not duplicated and stale packets are not treated as fresh direction.

## Findings

The active to-do directory still contains true implementation work, coordination packets, and live/manual packets. Completed implementation packets have generally been moved to `docs/gap/complete` with audit trails.

## Confirmed Open Implementation Packets

- `provider-request-pulse-ui.md`: Open. Compact provider basis labels exist, but the operator still needs clearer lane-specific blocked/cached/succeeded/failed/partial/stale pulse state.
- `clipboard-acquisition-race-tests.md`: Open. Clipboard lifecycle exists, but adversarial rapid arm/capture/failure race coverage is still pending.
- `live-io-provider-fault-injection.md`: Open. Provider clients have baseline checks, but hostile timeout/429/500/non-array/stale/ETag failure matrix is not yet complete.
- `runtime-settings-diagnostics-fault-tests.md`: Open. Happy-path runtime settings and diagnostics verification exists; corrupted settings, race-like save/load, and redaction fault tests remain.
- `http-endpoint-client-hardening.md`: Open. Tactical HTTP client has core hardening, but endpoint inventory and SDE/source-bundle download hardening remain.
- `local-metadata-sde-builder-hardening.md`: Open. Local metadata consumer exists; adversarial SDE ZIP/source-bundle verification remains.
- `combat-witness-replay-system-channel.md`: Open. This is a backend/system channel and explicitly defers UI.
- `repair-healing-raw-fixture-intake.md`: Open pending exact raw EVE repair/healing fixtures.
- `combat-metric-calibration-real-datasets.md`: Open pending longer real datasets and calibration decisions.
- `combat-window-weapon-spike-followups.md`: Open. Backend metrics exist, but calibration, fixture expansion, semantics, copy rules, and stress review remain.
- `active-scan-validator-reconciliation.md`: Open documentation/legacy cleanup.
- `bug-hunt-triage-and-failure-records.md`: Open process hardening.

## Live Or Manual Evidence Packets

- `live-api-smoke-evidence.md`: Open. Requires explicit live API opt-in evidence or recorded safe refusal.
- `live-operator-smoke-playbook.md`: Open. Requires manual operator-machine smoke steps and artifact trail.
- `live-findings-audit-and-doctrine-update.md`: Open. Should follow live validation evidence, not precede it.

## Coordination / Umbrella Packets

- `aura-sense-tactical-readiness.md`: Still useful as the broad readiness tracker. It contains several completed trail references and should stay open until Overseer declares tactical viewport readiness.
- `performance-stability-compute-readiness.md`: Mostly a historical readiness overview. Many priorities inside it are complete and split into individual packets. Keep it as an open/legacy coordination record unless Overseer authorizes retirement.
- `ux-handover-current-overlay-and-next-ui-slices.md`: Active coordination packet. Current recommended sequence starts with provider request pulse UI, then clipboard race tests.

## Recently Completed Trail Confirmed

- `combat-metrics-presentation-audit.md`
- `native-gamelog-folder-picker.md`
- `electron-visual-state-regression-tests.md`

Each has a complete packet and audit/handover trail.

## Next Work Recommendation

Proceed with `provider-request-pulse-ui.md` first. It is the top UX handover slice, has clear guardrails, and can be implemented using backend-owned snapshot metadata already exposed to the renderer.

Follow-through:

- `provider-request-pulse-ui.md` was completed after this audit and moved to `docs/gap/complete/provider-request-pulse-ui.md`.
- Completion handover: `docs/audits/audit-2026-05-23-provider-request-pulse-ui-handover.md`.

## Guardrails For Next Slice

- Do not add renderer provider calls.
- Do not display raw provider payloads.
- Do not introduce broad polling or retries.
- Keep Passive Telemetry and Threat Intel pulse state lane-specific.
- Keep live/API smoke outside `verify:all`.
