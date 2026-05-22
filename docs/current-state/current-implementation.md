# Current State: AURA-Sense Implementation

Date: 2026-05-22
Status: Runtime foundation

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

## What Does Not Yet Exist

AURA-Sense has not yet completed the full tactical viewport scope.

Not yet proven in this codebase:

- Passive Telemetry lane
- Threat Intel scan lane
- zKill discovery to ESI expansion pipeline
- exact raw repair/healing parser coverage
- local EVE system/type metadata adapters
- network gate and live diagnostics for EVE APIs
- AURA-Sense production HUD renderer

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
-> low-frequency system stats lookup
-> passive snapshot
-> renderer panel
```

### Threat Intel

```txt
manual scoped scan
-> local/static resolution where possible
-> zKill discovery refs
-> ESI killmail expansion
-> local aggregation with sample/freshness metadata
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

Available seed command:

```powershell
npm run verify:all
```

This verifies the current utilities, service rigging, Combat Witness parser/watcher/core foundations, renderer shell, and renderer boundary static checks. It does not verify full tactical viewport readiness.

## Known Gaps

- some seed shell UI and fallback labels still reflect inherited rigging until product shell work begins
- no product-facing settings, Passive Telemetry, or Threat Intel runtime services yet
- no renderer diagnostics transport or diagnostics UI yet
- no renderer presentation for Combat Witness snapshots yet
- no active scan service wired to the prepared validator yet
- no settings save/restart service wired to the prepared validator yet
- no exact raw repair/healing fixtures yet
- historical Aura 7 docs remain in `docs/Concept`, `docs/research`, and historical audit files for lineage only

## Related Documents

- `docs/current-state/seed-current-state.md`
- `docs/audits/audit-2026-05-22-aura7-scope-alignment.md`
- `docs/audits/engineering_audit_contribution.md`
- `docs/audits/audit-2026-05-22-combat-parser-overseer-review.md`
- `docs/audits/audit-2026-05-22-combat-parser-hardening-handover.md`
- `docs/audits/audit-2026-05-22-combat-witness-core-handover.md`
- `docs/audits/audit-2026-05-22-ipc-settings-validation-handover.md`
- `docs/audits/audit-2026-05-22-diagnostics-throttling-handover.md`
- `docs/audits/audit-2026-05-22-runtime-error-handling-handover.md`
- `docs/audits/audit-2026-05-22-combat-witness-snapshot-bridge-handover.md`
- `docs/audits/audit-2026-05-22-artifact-and-first-light-handover.md`
- `docs/audits/audit-2026-05-22-documentation-drift-overseer-review.md`
- `docs/gap/to-do/aura-sense-rewrite-readiness.md`
- `docs/roadmap/milestone-02-runtime-observability.md`
- `docs/roadmap/milestone-03-tactical-viewport-first-light.md`
- `docs/roadmap/development-artifact-trail.md`
