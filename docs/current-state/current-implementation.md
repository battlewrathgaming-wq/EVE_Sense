# Current State: AURA-Sense Implementation

Date: 2026-05-22
Status: Scoped Threat Intel and Clipboard Acquisition foundation complete with live network smoke deferred

## What Exists

AURA-Sense currently has a verified Electron runtime foundation for an EVE tactical viewport. It originated from reusable seed rigging, but current AURA-Sense docs and verification define the live project state.

The current implementation includes:

- minimal Electron shell
- preload bridge boundary
- renderer shell verification
- renderer boundary static verification
- generic service command registry
- service IPC payload validation helpers
- generic task runner and status vocabulary
- message taxonomy utilities
- HTTP client wrapper utilities
- Frame module documentation for borderless and always-on-top windows
- fixture-first offline verification command
- fixture-backed EVE combat log parser boundary
- configurable EVE gamelog folder watcher
- 15 second rolling Combat Witness damage/repair metrics
- strict EVE timestamp validation for parsed log envelopes
- watcher parser/listener failure isolation
- rolling metric prune-on-add and retained-event cap
- backend Combat Witness event and snapshot fan-out service
- 5s/15s/30s Combat Witness rolling snapshots
- bounded Combat Witness one-shot event stream
- fs-watch and polling gamelog watcher strategies with diagnostics
- shared diagnostics policy for watcher, Combat Witness, and HTTP request logs
- runtime error handling diagnostics for unhandled rejections, uncaught exceptions, and renderer process exits
- reusable active scan, settings, and log path validators
- frame always-on-top payload validation
- Combat Witness snapshot IPC/preload bridge
- first product-facing Combat Witness viewport
- backend-owned Combat Witness freshness status
- Electron visual smoke command with first-light screenshot/result artifacts
- session-scoped Combat Witness gamelog path control
- backend-owned Combat Witness watcher lifecycle
- Combat Witness HUD watcher unavailable/degraded/watching status
- Passive Telemetry backend snapshot lane
- backend zKill system-context normalization boundary
- Passive Telemetry preload bridge and compact HUD panel
- normalized gamelog event fan-out from the existing backend watcher path
- Passive Telemetry stale-partial state honesty for expired partial zKill context
- local/static Passive Telemetry system resolver
- backend-owned Passive Telemetry live IO gate
- scoped Passive Telemetry zKill `pastSeconds` route
- Passive Telemetry ESI aggregate system kills/jumps activity client
- one-hour Passive Telemetry ESI activity cache with ETag revalidation behavior
- explicit opt-in Passive Telemetry live API smoke command
- backend Threat Intel scan request and snapshot contract
- local/static Threat Intel target resolver for systems, pilots, corporations, alliances, and copied text
- backend-only scoped Threat Intel zKill `pastSeconds` probe
- Threat Intel live IO gate with visible blocked state when live calls are disabled
- compact Threat Intel search surface that scans only on explicit submit
- Clipboard Acquisition service with armed/listening/sealed/cooldown lifecycle
- global clipboard arming shortcut registered as `CommandOrControl+Shift+Space`
- Threat Intel preload bridge with no renderer-owned provider calls
- curated combat-log fixture ingestion with raw-line hash drift checks
- machine-readable combat-log event coverage matrix
- offline combat-log replay harness for parser/runtime/service semantics
- deterministic Combat Witness golden snapshot verification

## What Does Not Yet Exist

AURA-Sense has not yet completed the full tactical viewport scope.

Not yet proven in this codebase:

- live zKill-backed Threat Intel search and optional ESI expansion pipeline
- exact raw repair/healing parser coverage
- local EVE system/type metadata adapters
- production-grade multi-lane HUD renderer
- persistent product settings for gamelog folder
- native folder picker for gamelog folder
- live EVE gamelog operational smoke against an operator machine
- full provider request pulse UI
- live zKill/ESI smoke execution with `AURA_SENSE_LIVE_API=1`
- live Threat Intel zKill smoke execution with `AURA_SENSE_LIVE_API=1`
- exact Ctrl+Shift-only accelerator capture; Electron runtime uses `CommandOrControl+Shift+Space` for the global shortcut and the UI Arm control remains available

## Intended Runtime Flow

Target shape:

```txt
main process services
-> collect logs / call scoped clients / compute snapshots
-> service command and event boundary
-> preload API
-> renderer HUD presentation
```

Renderer flow:

```txt
renderer UI
-> preload API
-> service command or event subscription
-> backend-owned service/client
-> snapshot or response back to renderer
```

## Target Data Lanes

### Passive Telemetry

```txt
EVE location/log observation
-> backend normalization
-> current-system Passive Telemetry snapshot
-> scoped ESI system kills/jumps activity where system ID is resolved
-> scoped zKillmail system context where system ID is resolved
-> passive snapshot
-> renderer panel
```

### Threat Intel

```txt
explicit search submit or armed clipboard acquisition
-> local/static resolution where possible
-> zKill discovery refs
-> bounded zKillmail-backed sample with cap/failure/freshness metadata
-> optional ESI killmail expansion only if a future milestone authorizes it
-> Threat Intel snapshot
```

### Combat Witness

```txt
new combat log line
-> parser fixture-backed normalization
-> rolling backend cache
-> 5s/15s/30s computed snapshots
-> compact renderer-facing snapshot output
```

## Current Verification

Available command:

```powershell
npm run verify:all
```

This verifies the current utilities, service rigging, Combat Witness parser/watcher/runtime foundations, Combat Logging Test Suite offline checks, Passive Telemetry foundation, Threat Intel request/resolution/zKill normalization/clipboard lifecycle checks, renderer shell, and renderer boundary static checks. It does not verify full tactical viewport readiness.

Runtime visual smoke is implemented as a separate environment-sensitive command:

```powershell
npm.cmd run smoke:electron
```

It writes artifacts under `.tmp\electron-visual-smoke` and is intentionally not included in `verify:all`.

## Known Gaps

- some inherited seed service names remain below the visible product surface
- no product-facing settings persistence yet
- no renderer diagnostics transport or diagnostics UI yet
- no active scan service wired to the prepared validator yet
- no persistent settings save/restart service yet
- no native folder picker yet
- local metadata resolver is fixture/static only and intentionally small
- no full provider request pulse UI yet
- live zKill/ESI smoke command exists but live network run is deferred until `AURA_SENSE_LIVE_API=1`
- Threat Intel live zKill network run is deferred until explicitly enabled and recorded outside `verify:all`
- Threat Intel ESI killmail expansion remains deferred
- local type metadata remains deferred until a concrete type-label consumer appears
- no exact raw repair/healing fixtures yet; raw `combat.repair` parser support remains deferred
- concept and research docs are AURA-Sense product doctrine or evidence notes; older audit records may still describe past cleanup work

## Related Documents

- `docs/current-state/seed-current-state.md`
- `docs/audits/audit-2026-05-22-aura-sense-scope-alignment.md`
- `docs/audits/engineering_audit_contribution.md`
- `docs/audits/audit-2026-05-22-combat-parser-overseer-review.md`
- `docs/audits/audit-2026-05-22-combat-parser-hardening-handover.md`
- `docs/audits/audit-2026-05-22-combat-witness-core-handover.md`
- `docs/audits/audit-2026-05-22-ipc-settings-validation-handover.md`
- `docs/audits/audit-2026-05-22-diagnostics-throttling-handover.md`
- `docs/audits/audit-2026-05-22-runtime-error-handling-handover.md`
- `docs/audits/audit-2026-05-22-combat-witness-snapshot-bridge-handover.md`
- `docs/audits/audit-2026-05-22-tactical-hud-first-light-handover.md`
- `docs/audits/audit-2026-05-22-artifact-and-first-light-handover.md`
- `docs/audits/audit-2026-05-22-documentation-drift-overseer-review.md`
- `docs/audits/audit-2026-05-22-aura-sense-reconceptualization-handover.md`
- `docs/audits/audit-2026-05-22-electron-smoke-overseer-handover.md`
- `docs/audits/audit-2026-05-22-electron-visual-smoke-handover.md`
- `docs/audits/audit-2026-05-22-combat-witness-operational-loop-handover.md`
- `docs/audits/audit-2026-05-22-architecture-and-passive-telemetry-handover.md`
- `docs/audits/audit-2026-05-22-passive-telemetry-foundation-handover.md`
- `docs/audits/audit-2026-05-22-combat-log-test-suite-milestone-handover.md`
- `docs/audits/audit-2026-05-22-combat-log-test-suite-handover.md`
- `docs/audits/audit-2026-05-22-passive-telemetry-live-readiness-endpoint-io.md`
- `docs/audits/audit-2026-05-22-next-dev-runway-handover.md`
- `docs/audits/audit-2026-05-22-passive-telemetry-state-doc-pass.md`
- `docs/audits/audit-2026-05-22-api-function-runway-smoke-handover.md`
- `docs/audits/audit-2026-05-22-passive-telemetry-live-safe-readiness-handover.md`
- `docs/audits/audit-2026-05-22-post-passive-live-safe-next-runway.md`
- `docs/audits/audit-2026-05-22-threat-intel-and-clipboard-handover.md`
- `docs/gap/to-do/aura-sense-tactical-readiness.md`
- `docs/gap/to-do/readiness-09-local-type-metadata.md`
- `docs/gap/complete/threat-intel-scan-request-contract.md`
- `docs/gap/complete/threat-intel-target-resolution-boundary.md`
- `docs/gap/complete/threat-intel-zkill-scoped-probe.md`
- `docs/gap/complete/threat-intel-search-ui-surface.md`
- `docs/gap/complete/clipboard-acquisition-workflow.md`
- `docs/gap/complete/threat-intel-live-gate-and-observability.md`
- `docs/gap/complete/threat-intel-renderer-boundary-verification.md`
- `docs/gap/complete/readiness-05-zkill-ref-boundary.md`
- `docs/gap/complete/readiness-06-threat-intel-sample-metadata.md`
- `docs/gap/complete/passive-telemetry-local-system-resolver.md`
- `docs/gap/complete/passive-telemetry-esi-system-activity.md`
- `docs/gap/complete/passive-telemetry-scoped-zkill-route.md`
- `docs/gap/complete/passive-telemetry-live-io-gate.md`
- `docs/gap/complete/passive-telemetry-debugging-and-tracing.md`
- `docs/gap/complete/passive-telemetry-freshness-honesty.md`
- `docs/gap/complete/passive-telemetry-live-smoke-harness.md`
- `docs/gap/complete/combat-log-dataset-fixture-ingestion.md`
- `docs/gap/complete/combat-log-event-coverage-matrix.md`
- `docs/gap/complete/combat-log-replay-harness.md`
- `docs/gap/complete/combat-log-golden-snapshot-tests.md`
- `docs/gap/complete/combat-log-repair-healing-fixtures.md`
- `docs/gap/complete/readiness-15-passive-telemetry-foundation.md`
- `docs/gap/complete/readiness-14-combat-witness-operational-loop.md`
- `docs/gap/complete/readiness-13-electron-visual-smoke.md`
- `docs/features/vision.md`
- `docs/features/combat-logging-test-suite.md`
- `docs/roadmap/feature-aligned-milestones.md`
- `docs/roadmap/architecture-needs-review-2026-05-22.md`
- `docs/roadmap/milestone-02-runtime-observability.md`
- `docs/roadmap/milestone-03-tactical-viewport-first-light.md`
- `docs/roadmap/milestone-04-runtime-smoke-readiness.md`
- `docs/roadmap/milestone-05-combat-witness-operational-loop.md`
- `docs/roadmap/milestone-06-passive-telemetry-foundation.md`
- `docs/roadmap/milestone-07-combat-logging-test-suite.md`
- `docs/roadmap/milestone-08-passive-telemetry-live-safe-readiness.md`
- `docs/roadmap/milestone-09-scoped-threat-intel-and-clipboard-acquisition.md`
- `docs/roadmap/passive-telemetry-live-readiness-interlock.md`
- `docs/roadmap/development-artifact-trail.md`
