# Current State: AURA-Sense Implementation

Date: 2026-05-22
Status: Rewrite seed

## What Exists

AURA-Sense currently exists as an Aura Core-based Electron seed with AURA-Sense tactical viewport documentation.

The current implementation includes:

- minimal Electron shell
- preload bridge boundary
- renderer shell verification
- renderer boundary static verification
- generic service command registry
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

## What Does Not Yet Exist

AURA-Sense has not yet rebuilt Aura 7 runtime parity.

Not yet proven in this codebase:

- Passive Telemetry lane
- Threat Intel scan lane
- zKill discovery to ESI expansion pipeline
- formal normalized event bus/fan-out service
- Combat Witness snapshot emission service
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
-> 15s computed metrics foundation
-> future 5s/15s/30s computed snapshots
-> compact renderer update
```

## Current Verification

Available seed command:

```powershell
npm run verify:all
```

This verifies the current seed utilities, service rigging, Combat Witness parser/watcher foundations, renderer shell, and renderer boundary static checks. It does not verify Aura 7 feature parity.

## Known Gaps

- some seed shell UI and fallback labels still reflect Aura Core until product shell work begins
- no AURA-Sense runtime services yet
- no formal Combat Witness event bus yet
- no Combat Witness snapshot service yet
- no chokidar-style watcher adapter or polling fallback yet; current watcher relies on `fs.watch`
- no exact raw repair/healing fixtures yet
- historical Aura 7 docs remain in `docs/Concept`, `docs/research`, and historical audit files for reference

## Related Documents

- `docs/current-state/seed-current-state.md`
- `docs/audits/audit-2026-05-22-aura7-scope-alignment.md`
- `docs/audits/engineering_audit_contribution.md`
- `docs/audits/audit-2026-05-22-combat-parser-overseer-review.md`
- `docs/audits/audit-2026-05-22-combat-parser-hardening-handover.md`
- `docs/gap/to-do/aura-sense-rewrite-readiness.md`
