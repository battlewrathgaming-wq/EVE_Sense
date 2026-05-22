# Audit: Overseer Runtime Observability Review

Date: 2026-05-22
Scope: Review of latest Dev handovers, current-state notes, active gap queue, milestone direction, and readiness for next Dev session.

## Readiness Verdict

Ready with caveats.

Milestone 01 startup rigging is complete. AURA-Sense now has a verified seed baseline, IPC/service validation, Combat Witness parser fixtures, watcher strategy fallback, and backend Combat Witness snapshots.

The next milestone should not jump directly into richer UI. Runtime observability and controlled snapshot presentation must come first.

## Milestone Progress

Accepted as complete:

- `readiness-01-verification-harness.md`
- `readiness-02-renderer-boundary-static-checks.md`
- `readiness-03-ipc-settings-validation.md`
- `readiness-07-combat-witness-core.md`
- `readiness-08-combat-parser-fixtures.md`

Milestone 01 is now closed in:

- `docs/roadmap/milestone-01-startup-rigging.md`

Milestone 02 is now active in:

- `docs/roadmap/milestone-02-runtime-observability.md`

## Doctrine Drift

No blocking doctrine drift found.

The current implementation still respects:

- renderer as presentation, not telemetry authority
- Combat Witness as transient observed telemetry
- no Atlas persistence
- no zKill/ESI claims before Threat Intel exists
- fixture-first backend runtime foundations

Main drift pressure:

- Combat Witness has backend snapshots now, so renderer work may be tempting. That work must wait until diagnostics throttling is in place and must consume snapshots only.
- Threat Intel and metadata packets remain open, but should not be implemented against placeholder services.

## Architectural Risk

### P1: Diagnostics are not yet governed

Current trace paths exist in:

- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatWitnessService.js`
- `src/services/httpClient.js`

Without levels/categories and throttling defaults, polling ticks, routine reads, duplicate suppression, and future HTTP request logs could become noisy or expensive once renderer diagnostics exist.

### P2: Combat Witness presentation boundary is not wired

Backend Combat Witness snapshots exist, but no renderer subscription path exists. The next presentation slice must go through an explicit service/preload boundary and preserve renderer static checks.

### P2: Runtime error handling remains minimal

Long-session behavior still needs unhandled rejection, uncaught exception, and renderer process failure handling.

### P3: Threat Intel packets are future-facing

zKill ref normalization, sample metadata, and local type metadata should stay deferred until Threat Intel runtime services exist.

## Work Retired

Retired as superseded:

- `docs/gap/to-do/implementation-alignment-gap-analysis.md`

Replacement sources:

- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-02-runtime-observability.md`
- `docs/gap/to-do/performance-stability-compute-readiness.md`

## Refreshed Gap Packets

- `readiness-04-diagnostics-throttling.md`: refreshed with concrete files, event classes, and verification expectations.
- `readiness-05-zkill-ref-boundary.md`: marked deferred until Threat Intel client exists.
- `readiness-06-threat-intel-sample-metadata.md`: marked deferred until Threat Intel runtime exists.
- `readiness-09-local-type-metadata.md`: marked deferred until Threat Intel timelines/type-label consumers exist.
- `readiness-11-combat-witness-snapshot-bridge.md`: created for future renderer snapshot subscription after diagnostics throttling.

## Next Dev Handoff

Next authorized slice:

```txt
docs/gap/to-do/readiness-04-diagnostics-throttling.md
```

Mission:

```txt
Add a backend diagnostics policy that preserves high-value runtime signals while suppressing or sampling low-value normal chatter by default.
```

Start with:

- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatWitnessService.js`
- `src/services/httpClient.js`

Expected work:

- add levels/categories or equivalent diagnostic classification
- add throttling/sampling for low-value events
- preserve error/degraded/fallback signals
- add focused offline verification
- include the check in `npm.cmd run verify:all`

Do not do:

- no renderer diagnostics drawer yet
- no Combat Witness UI widgets
- no pressure/EWAR/topology work
- no Threat Intel zKill/ESI work
- no live API smoke inside `verify:all`

Expected verification:

```powershell
npm.cmd run verify:all
```

Expected handover:

- diagnostic policy added
- files/events covered
- default suppression/throttle behavior
- preserved high-priority events
- verification output
- remaining diagnostics gaps

## Follow-Up Sequence

1. Diagnostics throttling.
2. Runtime error handling.
3. Combat Witness snapshot bridge.
4. Re-audit before any richer Combat Witness presentation.

## Verification

Documentation review and queue refresh. Runtime verification should be run after edits:

```powershell
npm.cmd run verify:all
```
