# DisplayInventoryQualitativeReportHS01: Ingest -> Transform -> Bridge -> Display

Status: Advisory audit artifact only, not project authority
Date: 2026-05-25
Role: Product development systems auditor for AURA-Sense
Companion audit table: `workspace/DisplayInventoryAuditHS01-ingest-transform-bridge-display.md`

## 1. Files Reviewed

Primary files reviewed: 32.

- `AGENTS.md`
- `workspace/current.md`
- `workspace/overview.md`
- `workspace/display_inventory.md`
- `workspace/request_display.md`
- `workspace/display-request-workflow-hardening-contract.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/OverseerHS11-display-inventory-pipeline-audit-runway.md`
- `docs/current-state/current-implementation.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/features/clipboard-acquisition.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/main/preload.js`
- `src/main/main.js`
- `src/services/serviceRegistry.js`
- `src/services/taskRunner.js`
- `src/passive/passiveTelemetryService.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelTargetResolver.js`
- `src/threat/clipboardAcquisitionService.js`
- `src/combat/combatWitnessService.js`
- `src/runtime/runtimeDiagnosticsService.js`
- `workspace/archive/SenseTerminologyStateBridgeAudit-2026-05-24.md`
- `workspace/OverseerHS05-sense-terminology-alignment-review.md`
- `workspace/SYSADHS01-protected-terms-sniffer-tune.md`

Additional source inventory scans were run across `src/combat/`, `src/passive/`, `src/threat/`, and `src/runtime/` to locate display-relevant ingest, transform, bridge, and target-like terms.

## 2. Current-State Understanding

AURA-Sense is a transient tactical viewport. Combat Witness is the time-sensitive primary lane, based on recent local gamelog observations. Passive Telemetry is current-system context triggered by local observation and enriched by gated zKill/ESI providers. Threat Intel is deliberate scoped inspection from manual or clipboard-acquired input. Clipboard Acquisition is a short visible authority window feeding Threat Intel. Runtime diagnostics/settings support trust and setup but should not become tactical meaning.

Renderer presentation consumes backend-owned snapshots and service commands. It does not own parser truth, provider calls, telemetry caches, or tactical computation.

## 3. Top 5 Display Overload Causes

1. Provider/source metadata is visible in the primary Passive band: zKill count, ESI activity, static lookup, sample state, and age can crowd the first read.
2. Threat back page combines acquisition, target type, provider basis, pulse, latest report, shortcut guidance, and state messages in one compact surface.
3. Provider pulse appears twice as a general concept: front glance chips and Threat zKill pulse, with possible live-heartbeat implications.
4. Target-like concepts overlap visually: observed source, current system, manual target, clipboard target, target type, provider sample target, and local/static resolver match.
5. Runtime authority and diagnostics terms such as IO, Runtime ready, Settings, Log Watcher, and System State sit close to tactical lanes and can read as tactical status.

## 4. Top 5 Safest Future Lab `request_display` Candidates

1. `sense.threat-latest-scan-review`: compare ways to present latest scan review without report/history/storage implication.
2. `sense.clipboard-window`: pressure-test the short visible clipboard authority window and shortcut feedback.
3. `sense.provider-pulse-row`: compare calmer provider/sample status wording against pulse wording.
4. `sense.passive.state-basis`: pressure-test Passive state/freshness/basis display after the accepted instrument band.
5. `sense.threat-acquisition-bar`: compare display/search/acquisition grouping for manual and clipboard targets.

No Lab request is created by this report.

## 5. Source-Owned Terms That Must Be Preserved

- `Combat Witness`
- `Passive Telemetry`
- `Threat Intel`
- `Clipboard Acquisition`
- `Live IO blocked`
- `Partial sample`
- `Capped sample`
- `No scan`
- `No observation`
- `Observed Source`
- `Observed Weapon`
- `Observed balance` / `Observed repair balance`
- `Gateway`, unless Human/Sense Overseer later allows translation

## 6. Surfaces That Must Stay Sense-Owned

- Lane names and lane separation.
- Snapshot meanings: `combat.witness.snapshot`, `passive.telemetry.snapshot`, `threat.intel.snapshot`, `clipboard.acquisition.snapshot`, `runtime.live-io.snapshot`.
- Live IO authority and blocked meanings.
- Clipboard Acquisition lifecycle and shortcuts.
- Threat target resolution, target kind, local/static resolver result, and scan contract.
- Passive current-system context, freshness, cap/partial/degraded/blocked states.
- Combat observed source/weapon/balance semantics.
- Runtime diagnostics sanitization and setup authority.

## 7. Backend/Runtime Metadata Currently Visible In Primary UI

- Top chrome `IO` authority and tooltip/aria authority state.
- Passive basis line exposes provider names/counts, ESI activity values, `Static lookup`, sample/cap/partial, and age.
- Front provider pulse chips expose Passive/Threat provider state.
- Threat acquisition surface exposes provider pulse, target type, sample counts, basis, and zKill one-hour pulse.
- `Runtime ready` appears in setup/runtime health after `seed.readiness`.
- `Log Watcher` status is visible in top chrome and setup.

## 8. Information That Needs Better Display, Not Deletion

- Passive provider/sample basis and freshness: trust-critical, but likely better as compact first-read plus reveal.
- Threat latest scan report: needed for deliberate review, but should avoid durable report/storage flavor.
- Clipboard Acquisition state: safety-critical and must remain visible, but boundedness should be clearer than any listening/monitoring implication.
- Local/static resolver basis: important to prevent target guessing, but not tactical truth.
- Live IO authority: must remain visible, but `IO` may need clearer Bridge -> Interface wording later.

## 9. Terminology Or Ownership Risks

- `Report persists until the next scan` and persistent report labels can drift toward Atlas history/storage semantics.
- `Provider pulse` and `zKill one hour pulse` can imply continuous live heartbeat or complete coverage.
- `Manual fallback target` can make fallback sound like alternate authority rather than manual input.
- `Observed Source` and `Observed Weapon` can become identity/type claims if `Observed` is removed.
- Lab labels can help presentation, but must not become Sense bridge fields, CSS/test identifiers, service names, or backend enums.

## 10. Parked Or Unknown Items

- Whether `Gateway` is preserve-exact for all future Lab-facing UI.
- Whether `Pulling`, `Listening`, and `Cooldown` should remain exact Clipboard copy or be restyled after bridge.
- Whether `Provider pulse` should remain visible wording.
- Whether `Al` abbreviation is acceptable for Alliance target type.
- Whether Passive needs a dedicated detail reveal beyond diagnostics.
- Whether real operator use will require different density for primary Passive basis and Threat report detail.

## 11. Recommended Next Bounded Action

Open one advisory scoping pass, not implementation: choose up to three request-ready surfaces from this audit and draft candidate `request_display` entries for Sense review only. The safest first bundle is latest Threat scan review, Clipboard Acquisition authority window, and Passive state/basis display. Keep them parked until Sense explicitly submits them to Lab.

## Verification

Run:

```powershell
npm.cmd run verify:protected-terms
```

Result:

- Passed in warning-only mode.
- Scanned 2 changed files: this qualitative report artifact and companion audit table artifact.
- Reported 29 warning-only items, concentrated in expected advisory terms: `Report`, `Fallback`, `Readout`, and `Coverage`.
- No renames were performed.
- No protected-word JSON updates were performed.
