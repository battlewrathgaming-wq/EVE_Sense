# Audit: Threat Intel And Clipboard Acquisition Handover

Date: 2026-05-22
Owner: Dev execution under Overseer doctrine
Milestone: 09 - Scoped Threat Intel And Clipboard Acquisition
Status: Complete with live network smoke deferred

## Scope

Implemented the Milestone 09 foundation slice only:

- explicit Threat Intel search request/snapshot contract
- local/static target resolution for systems, pilots, corporations, alliances, and copied target text
- backend-only scoped zKill reference probe using bounded `pastSeconds` routes
- live IO gate and backend diagnostics for blocked/attempt/outcome paths
- compact renderer Threat Intel search surface
- Clipboard Acquisition lifecycle with visible listening/cooldown state
- preload bridge commands for renderer presentation only
- offline verification and Electron smoke coverage

## Request And Snapshot Contract

Threat Intel scans use a single backend request shape for typed search, pasted text, and clipboard acquisition:

```txt
targetText
targetKind?
inputSource: search | paste | clipboard
lookbackSeconds?
sampleLimit?
requestedAt?
```

The service returns explicit statuses rather than guessing:

```txt
empty | blocked | unresolved | ambiguous | unsupported | failed | partial | succeeded
```

Snapshots include request metadata, live IO state, resolved target, message, and optional normalized zKill metadata with provider, endpoint family, lookback, sample limit, selected/discovered/malformed/failed counts, cap/partial flags, failures, and normalized killmail references.

## Target Resolution

Resolution is local/static for this slice and fixture-backed by `fixtures/threat-intel-targets.json`.

Accepted categories:

- `system`
- `pilot`
- `corporation`
- `alliance`
- copied target text that resolves exactly to one of the supported categories

Prefix narrowing is supported for target text such as `system: Jita` or `pilot: Chribba`. Ambiguous, unresolved, and unsupported inputs remain explicit degraded states.

## zKill Boundary

The zKill client is backend-only and maps resolved target categories to scoped routes:

```txt
/api/systemID/{id}/pastSeconds/{lookbackSeconds}/
/api/characterID/{id}/pastSeconds/{lookbackSeconds}/
/api/corporationID/{id}/pastSeconds/{lookbackSeconds}/
/api/allianceID/{id}/pastSeconds/{lookbackSeconds}/
```

Non-array or malformed provider responses normalize into partial/degraded metadata. Renderer code receives only service snapshots and does not call zKill, ESI, fetch, filesystem, parser, watcher, or runtime modules.

## Clipboard Acquisition

Clipboard Acquisition is implemented as a short lived input workflow:

- `idle`
- `listening`
- `cooldown`

The listening window is 3 seconds. The cooldown is 5 seconds. The listener seals after capture, timeout, cancellation, or rejected clipboard content.

Clipboard content already present at arm time is treated as the baseline and ignored until the clipboard changes. This avoids immediately scanning stale or unrelated clipboard text when the operator arms acquisition.

Implementation caveat: Electron global shortcut registration uses `CommandOrControl+Shift+Space` rather than bare Ctrl+Shift. The HUD Arm control remains available. Electron smoke confirmed registration:

```txt
clipboard_acquisition_global_shortcut { accelerator: 'CommandOrControl+Shift+Space', registered: true }
```

## Verification Signals

Focused verification:

```txt
npm.cmd run verify:threat-intel
threat intel verified

npm.cmd run verify:renderer-shell
renderer shell verified

npm.cmd run verify:renderer-boundary
renderer boundary verified (4 files scanned)
```

Full offline verification:

```txt
npm.cmd run verify:all
all checks verified
```

Electron smoke:

```txt
npm.cmd run smoke:electron
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
```

Smoke artifact:

```txt
F:\Projects\AURA-Sense\.tmp\electron-visual-smoke\visual-smoke-result.json
status: passed
hasThreatSurface: true
threatText: Idle
```

## Documentation Updates

Updated:

- `docs/current-state/current-implementation.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/features/clipboard-acquisition.md`
- `docs/roadmap/feature-aligned-milestones.md`
- `docs/roadmap/milestone-09-scoped-threat-intel-and-clipboard-acquisition.md`
- `docs/gap/to-do/aura-sense-tactical-readiness.md`

Moved completed packets to `docs/gap/complete/`:

- `threat-intel-scan-request-contract.md`
- `threat-intel-target-resolution-boundary.md`
- `threat-intel-zkill-scoped-probe.md`
- `threat-intel-search-ui-surface.md`
- `clipboard-acquisition-workflow.md`
- `threat-intel-live-gate-and-observability.md`
- `threat-intel-renderer-boundary-verification.md`
- `readiness-05-zkill-ref-boundary.md`
- `readiness-06-threat-intel-sample-metadata.md`

## Deferred Risks And Concerns

- Live Threat Intel zKill network smoke remains deferred and must be run explicitly outside `verify:all`.
- ESI killmail expansion remains deferred.
- Atlas persistence, evidence queues, reports, and watch execution remain out of scope.
- Local type metadata remains open in `docs/gap/to-do/readiness-09-local-type-metadata.md` because this slice did not introduce a concrete type-label consumer.
- Bare Ctrl+Shift acquisition remains design intent, not current Electron accelerator behavior.
- The local resolver fixture is intentionally small and should not be treated as broad EVE metadata coverage.

## Next Overseer Review Point

Review whether Milestone 10 should compose Combat Witness, Passive Telemetry, and Threat Intel into one integrated tactical viewport, or whether a narrower hardening pass should first address live smoke policy and operator-facing request pulse diagnostics.
