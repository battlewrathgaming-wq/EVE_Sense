# Audit: Operational Hardening And Runtime Control Handover

Date: 2026-05-22
Owner: Dev execution under Overseer doctrine
Milestone: 11 - Operational Hardening And Runtime Control
Status: Complete with live operator validation deferred to Milestone 12

## Scope

Implemented the Milestone 11 runtime hardening slice:

- backend-owned runtime settings persistence
- startup recovery for valid persisted gamelog folder settings
- visible live IO policy control for Passive Telemetry and Threat Intel
- compact sanitized diagnostics review surface
- smoke policy documentation
- failure record for transient Electron capture errors
- ADR deferring Atlas handoff

No tactical telemetry, combat history, Atlas data, reports, queues, or watch execution were persisted.

## Persisted Settings

Storage path:

```txt
Electron app userData/runtime-settings.json
```

Persisted keys:

- `schemaVersion`
- `savedAt`
- `settings.gamelogFolder`
- `settings.userAgent`

The gamelog folder is validated through the backend settings validator before save or startup recovery. Valid paths are configured into Combat Witness but do not auto-start the watcher. Missing or invalid persisted paths produce a degraded settings snapshot and do not start watchers.

## Runtime Control Surface

Renderer-visible runtime controls are still service-backed:

- settings state: `Missing`, `Ready`, `Recovered`, or `Degraded`
- live IO state: `Enabled` or `Disabled`
- diagnostics state: `Quiet` or count of retained diagnostics
- live IO toggle calls backend `runtime.live-io.set-enabled`

Passive Telemetry and Threat Intel live IO gates remain backend-owned and disabled by default.

## Diagnostics Surface

Diagnostics are recorded through `traceRuntimeDiagnostic`, sanitized, bounded, and exposed through `runtime.diagnostics.snapshot`.

Low-value routine events are suppressed. Raw line/content fields are redacted unless they are hash evidence.

## Smoke And Atlas Policy

Smoke policy:

- `verify:all` remains offline and deterministic.
- `smoke:electron` remains Electron/manual and writes to `.tmp\electron-visual-smoke`.
- live API smoke remains explicit and outside `verify:all`.
- live operator smoke remains manual and must not collect broad private history.

Atlas decision:

- Atlas handoff is deferred in `docs/adr/adr-2026-05-22-atlas-handoff-deferred.md`.
- No Atlas behavior entered AURA-Sense core.

## Verification Signals

Focused verification:

```txt
npm.cmd run verify:runtime-control
runtime control verified

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
hasRuntimeControl: true
settingsStateText: Missing
liveIoStateText: Disabled
diagnosticsStateText: 1 noted
```

## Completed Packets

Moved to `docs/gap/complete/`:

- `runtime-settings-persistence.md`
- `runtime-live-io-control-policy.md`
- `runtime-diagnostics-review-surface.md`
- `runtime-startup-and-session-recovery.md`
- `runtime-smoke-policy-and-failure-records.md`
- `atlas-handoff-decision-boundary.md`

## Deferred Risks

- Live operator validation and live API smoke evidence remain Milestone 12 work.
- Combat metric calibration against real datasets remains open.
- Raw repair/healing parser intake remains open until exact samples exist.
- Local metadata hardening remains open for active consumers only.
- Native folder picker remains unimplemented.

## Recommendation For Overseer Review

Proceed to Milestone 12 only when live/manual smoke can be run intentionally. Avoid promoting live behavior into product claims until the evidence is recorded in audit form.
