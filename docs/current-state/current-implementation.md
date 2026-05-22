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

## What Does Not Yet Exist

AURA-Sense has not yet rebuilt Aura 7 runtime parity.

Not yet proven in this codebase:

- EVE gamelog watcher
- Passive Telemetry lane
- Threat Intel scan lane
- zKill discovery to ESI expansion pipeline
- Combat Witness parser, rolling cache, and snapshots
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
-> compact renderer update
```

## Current Verification

Available seed command:

```powershell
npm run verify:all
```

This verifies the current seed utilities, service rigging, renderer shell, and renderer boundary static checks. It does not verify Aura 7 feature parity.

## Known Gaps

- some seed shell UI and fallback labels still reflect Aura Core until product shell work begins
- no AURA-Sense runtime services yet
- no EVE fixtures wired into verification yet
- historical Aura 7 docs remain in `docs/Concept`, `docs/research`, and historical audit files for reference

## Related Documents

- `docs/current-state/seed-current-state.md`
- `docs/audits/audit-2026-05-22-aura7-scope-alignment.md`
- `docs/gap/to-do/aura-sense-rewrite-readiness.md`
