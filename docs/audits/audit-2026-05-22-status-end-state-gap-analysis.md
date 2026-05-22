# Audit: Status, End State, And Gap Analysis

Date: 2026-05-22
Role: Overseer
Scope: Review current project status, define the intended end state, and analyze remaining gaps.

## Current Status

AURA-Sense has crossed from foundation into live-readiness work.

Accepted current state:

- Combat Witness backend observation, parser fixtures, watcher strategies, rolling windows, and integrated HUD presentation exist.
- Passive Telemetry lane exists with local/static system resolution, scoped zKill context, ESI aggregate system activity, ETag-aware cache behavior, and backend live IO gate.
- Threat Intel exists as a deliberate search/clipboard lane with scoped zKill-backed samples, local/static target resolution, sample/cap/failure metadata, and renderer isolation.
- Clipboard Acquisition exists as a visible short-lived acquisition workflow using `CommandOrControl+Shift+Space` plus the in-window Arm control.
- Integrated Tactical Viewport exists and keeps Combat Witness, Passive Telemetry, and Threat Intel as separate lanes.
- Operational hardening exists: persisted runtime settings, live IO control, diagnostics review, startup recovery, smoke policy, and Atlas handoff deferral.
- `verify:all` remains offline and passes in the current repo state.

Milestone state:

- Milestones 05 through 11 are complete with live/manual evidence caveats where recorded.
- Milestone 12, Live Validation And Tactical Calibration, is the active next runway.

## Defined End State

AURA-Sense reaches its current product end state when it can be trusted as a live tactical cognition viewport for an operator session.

End state means:

1. The operator can start AURA-Sense, recover from missing configuration, and understand degraded state without reading a console.
2. Combat Witness can observe future appended EVE gamelog lines, compute bounded 5s/15s/30s snapshots, and present recent pressure/repair context without claiming complete combat truth.
3. Passive Telemetry can detect current-system changes, resolve system identity where practical, and present scoped current-system ESI activity and zKill context through visible live IO policy.
4. Threat Intel can run deliberate scoped zKill-backed probes from search or clipboard acquisition, with sample/freshness/cap/failure language.
5. Clipboard Acquisition remains deliberate, visible, short-lived, and sealed after capture/timeout/rejection.
6. Runtime settings, live IO gates, diagnostics, and smoke policy are explicit and backend-owned.
7. Live operator smoke, live API smoke, and real-data calibration evidence are recorded before product claims rely on live behavior.
8. Atlas handoff remains absent unless a future ADR authorizes a narrow operator action and boundary.

End state does not mean:

- complete battlefield knowledge
- historical intelligence storage
- Atlas reporting
- default ESI killmail expansion
- broad polling
- renderer-owned telemetry
- hidden clipboard or background intelligence collection

## Gap Analysis

### P0: Live Evidence Gaps

The system is well verified offline, but not yet proven in live operator conditions.

Open packets:

- `docs/gap/to-do/live-operator-smoke-playbook.md`
- `docs/gap/to-do/live-api-smoke-evidence.md`

Required evidence:

- live operator smoke against real EVE gamelog append behavior
- explicit live-gated Passive Telemetry provider smoke
- explicit live-gated Threat Intel provider smoke
- recorded blocked/refused behavior when live gates are disabled

Risk if skipped:

- AURA-Sense may be technically correct in fixtures but still untrusted in actual play conditions.

### P1: Tactical Calibration Gaps

Combat Witness has richer metrics, but the most interpretation-sensitive parts still need real-data calibration.

Open packets:

- `docs/gap/to-do/combat-metric-calibration-real-datasets.md`
- `docs/gap/to-do/combat-window-weapon-spike-followups.md`
- `docs/gap/to-do/repair-healing-raw-fixture-intake.md`

Required decisions:

- whether the current damage spike rule is acceptable
- whether spike display needs a higher minimum sample count
- whether weapon labels remain exact observed labels or gain a separate normalized field
- whether raw repair/healing support remains deferred or becomes fixture-backed

Risk if skipped:

- The HUD may accidentally make lightweight observations look like tactical conclusions.

### P1: Provider Visibility Gap

The viewport has compact provider/basis labels, but not a full provider request pulse.

Open packet:

- `docs/gap/to-do/provider-request-pulse-ui.md`

Required behavior:

- show recent provider attempts, blocked/cached/succeeded/failed states, and request freshness without turning the HUD into a log stream
- feed the pulse from backend diagnostics/snapshot metadata only

Risk if skipped:

- live API failures may be technically recorded but not sufficiently legible to the operator.

### P2: Runtime Ergonomics Gap

Runtime settings persist, but gamelog folder selection still uses typed path input.

Open packet:

- `docs/gap/to-do/native-gamelog-folder-picker.md`

Required behavior:

- native folder picker backed by existing path validation
- no watcher restart until backend accepts the path

Risk if skipped:

- setup remains more error-prone than the rest of the hardened runtime surface.

### P2: Local Metadata Gap

Local metadata remains intentionally small and conditional.

Open packets:

- `docs/gap/to-do/local-metadata-consumer-hardening.md`
- `docs/gap/to-do/readiness-09-local-type-metadata.md`

Required decision:

- add compact metadata only for visible consumers that need readable IDs/labels
- keep unresolved IDs visible

Risk if skipped:

- some Threat Intel or future calibration output may stay less readable, but this is not a live-readiness blocker unless a concrete consumer needs it.

### P3: Documentation And Legacy Surface Gap

Some inherited seed concepts still exist below the product surface.

Open packet:

- `docs/gap/to-do/active-scan-validator-reconciliation.md`

Required decision:

- retire the old generic active-scan validator language, or explicitly map it to the current Threat Intel scan contract if still useful

Risk if skipped:

- future Dev sessions may mistake inherited seed validator residue for a missing product lane.

## Recommended Sequence

1. Complete P0 live operator smoke playbook.
2. Complete P0 live API smoke evidence.
3. Complete P1 provider request pulse only if live smoke shows the current provider basis is too thin.
4. Complete P1 combat metric calibration and repair/healing fixture intake.
5. Complete P2 native folder picker for setup ergonomics.
6. Complete P2 local metadata only for visible consumers.
7. Complete P3 active-scan validator reconciliation and stale-doc cleanup.

## Doctrine Check

The project direction remains coherent.

No current gap requires:

- Atlas persistence
- default ESI killmail expansion
- renderer network calls
- long-term history
- broad polling
- hidden clipboard surveillance

The next risk is not architecture sprawl. The next risk is accepting unproven live behavior as product truth.
