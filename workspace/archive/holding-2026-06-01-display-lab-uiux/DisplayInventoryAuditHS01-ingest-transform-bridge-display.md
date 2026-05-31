# DisplayInventoryAuditHS01: Ingest -> Transform -> Bridge -> Display

Status: Advisory audit only, not project authority
Date: 2026-05-25
Role: Product development systems auditor for AURA-Sense
Output: `workspace/DisplayInventoryAuditHS01-ingest-transform-bridge-display.md`

## Scope

This audit maps current user-facing Sense information from ingest through transformation, bridge, and renderer display. It does not authorize implementation, UI copy changes, contract changes, Lab requests, or product direction changes.

Sense owns internal -> Bridge meaning, source terms, data meaning, lane/state semantics, runtime behavior, and final adoption. Lab may later compare Bridge -> Interface display methods only after Sense meaning is preserved.

## Audit Table

| Surface / Use Case | Ingest | Transformation | Bridge | User Display | Source Terms | Display Role | Visibility Decision | Risks / Notes | Candidate request_display? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Combat Witness first-read face | Newly appended EVE gamelog combat lines through watcher/parser. | Parser normalizes `combat.damage`, `combat.repair`, and `combat.miss`; Combat Witness computes 15s rolling incoming DPS, repair HPS, and observed repair balance. | `combat.witness.snapshot` via `auraCombatWitness.getSnapshot` / `aura:combat-witness:snapshot`; renderer state in `renderCombatWitness`. | Main combat surface: `Combat Witness`, `15s rolling observed window`, `Incoming DPS`, `Repair HPS`, `Observed balance`. | Combat Witness; observed; Incoming DPS; Repair HPS; Observed balance. | tactical-primary, uncertainty-state | operator-facing | Repair balance can be misread as survival/tank truth if observed qualifier is lost. | no - meaning is already tightly bounded. |
| Observed Source front chip | Combat log event `sourceLabel` on incoming damage/repair events. | Rolling window counts source labels and chooses `topSource`; labels are not durable identities. | `windows.15s.damage.incoming.topSource` in `combat.witness.snapshot`; renderer `observedCountLabel`. | Front utility chip and diagnostics: `Observed Source`, `--` / label plus count. | Observed Source; observed source label. | tactical-context | point-of-need | Target-like label could drift into hostile/enemy/actor identity if `Observed` is dropped. | parked - possible later density/wording comparison. |
| Observed Weapon configurable tile | Combat log event `weaponLabel` on damage/miss events. | Rolling window counts weapon labels and selects `mostObservedWeaponType`; current meaning is observed label, not normalized type. | `windows.15s.damage.incoming.mostObservedWeaponType`; renderer configurable front context tile. | Configurable tile default `Observed Weapon`; menu option `Weapon`; diagnostics `Observed Weapon`. | Observed Weapon; Most observed weapon. | tactical-context | point-of-need | Backend field says `Type`, but display should not imply normalized EVE item type. | parked - candidate only if weapon/source/balance tile needs Lab comparison. |
| Repair Balance configurable tile | Combat rolling window balance fields. | Computes observed incoming repair HPS minus observed incoming DPS. | `windows.15s.balance.receivedRepairMinusDamagePerSecond`; renderer `signedRate`. | Configurable tile menu `Balance`, value `+/-N /s`; diagnostics `Repair Balance`. | Observed repair balance; Repair Balance. | tactical-context | point-of-need | `Balance` alone loses observed/source-basis nuance and can imply tactical verdict. | parked - possible tile-label pressure test. |
| Combat event stream | Bounded recent combat events accepted by Combat Witness. | Compacts event kind, direction, source/target labels, amount, hit quality, weapon label. | `eventStream` in `combat.witness.snapshot`; renderer `renderEventList`. | Diagnostics Event Stream: `Incoming damage`, `Incoming repair`, `Incoming miss`, actor arrow detail. | Combat Witness; observed combat event. | diagnostic-support | diagnostic-only | Useful trust detail; primary display would overload and imply history if promoted. | no - keep diagnostics unless a future operator task appears. |
| Log Watcher status | Runtime gamelog folder watcher state and settings recovery. | Normalizes watcher states to Watching/Stopped/Blocked/Degraded/Unavailable and messages. | `combat.witness.status` service command and decorated Combat snapshot `operational.watcher`. | Top chrome indicator; diagnostics `Log Watcher`, `Start`/`Stop`, watcher message. | Log Watcher; Watching; Degraded; Unavailable. | authority-control, setup-control | operator-facing | `Watcher` must remain gamelog-only; do not bleed into clipboard or Threat Intel. | parked - setup/control polish only. |
| Passive current system band | `navigation.jump` events from gamelog parser observed by Passive service. | Stores current system label/from/event time; local/static resolver adds system ID and resolver source. | `passive.telemetry.snapshot` via `auraPassiveTelemetry`; renderer `renderPassiveTelemetry`. | Passive band: `Passive Telemetry`, `Current system`, system label or `No observation`. | Passive Telemetry; current system; No observation. | tactical-context | operator-facing | Current system can look like complete location truth; needs observed/current-system basis nearby. | yes - safe future Passive state/basis display pressure test. |
| Passive system activity chips | Current system ID from local/static resolver; ESI system kills/jumps endpoints when live IO allows. | ESI aggregate activity is normalized, cached, partially marked, and summarized as ship kills, jumps, ratio. | `activity.shipKills`, `activity.jumps`, `activity.cache` in `passive.telemetry.snapshot`; renderer signal chips. | Band chips: `Kills`, `Jumps`, `Ratio`; diagnostics `Passive Activity`. | Passive Telemetry; ESI; activity; current system. | tactical-context, source-basis | operator-facing | Ratio can overstate tactical risk without source age and aggregate scope. | parked - better display may be useful after real use. |
| Passive readout state | Passive service status/freshness/gate/provider flags. | Maps `fresh`, `stale`, `partial`, `degraded`, `blocked`, cached/pending/capped states into Sense-owned labels. | Snapshot fields `status`, `freshness`, `zkill`, `activity`, `gate`; renderer `passiveReadoutFromSnapshot`. | `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, `Provider pending`, `No observation`. | Fresh context; Stale context; Partial sample; Capped sample; Live IO blocked; Degraded; No observation. | uncertainty-state, source-basis | operator-facing | High label density; blocked, stale, partial, capped, degraded, no-observation must not collapse. | yes - strong later pressure-test candidate. |
| Passive basis/freshness line | zKill scoped system context, ESI activity, local/static resolver, cache freshness. | Formats provider count, ESI activity, static lookup, cap/partial, and age. | `zkill.sampleCount`, `activity`, `currentSystem.resolverSource`, `freshness.cacheAgeMs`; renderer `passiveBasis` / `passiveBandBasis`. | Passive readout basis: e.g. `zKill N + ESI K / J + Static lookup | Xm old`. | zKill; ESI; Static lookup; sample; freshness. | source-basis | provenance-detail | Provider/source metadata is visible in primary UI and can crowd first read. | yes - safe candidate for collapse/reveal comparison. |
| Passive provider pulse chip | Passive snapshot status and provider/cache state. | Converts provider/sample/gate/freshness conditions into chip label and diagnostic detail. | Renderer `providerPulseFromPassive` and `renderProviderPulse`; detail mirrored to diagnostics. | Glance strip `Passive --`, `Fresh context`, `Cached activity`, `Partial sample`, `Capped sample`, etc. | Provider pulse; Fresh context; Partial sample; Capped sample. | source-basis, diagnostic-support | provenance-detail | `Pulse` can imply live heartbeat even when cached/stale; primary row duplicates readout state. | yes - candidate to compare calmer provider-state display. |
| Passive diagnostics grid | Passive snapshot fields and messages. | Renderer formats state, sample, activity, freshness, age, basis, gap, pulse detail. | Same `passive.telemetry.snapshot` through renderer diagnostics state. | Diagnostics: `Passive State`, `Passive Sample`, `Passive Activity`, `Passive Freshness`, `Passive Age`, `Passive Basis`, `Passive Gap`, `Passive Pulse`; `passive-message`. | Passive Telemetry; Passive Basis; Passive Gap; Passive Pulse. | diagnostic-support, source-basis | diagnostic-only | This is the right home for provenance detail, but it may be the only available detail path. | parked - input to future Passive detail reveal. |
| Threat Intel back-page summary | Latest Threat Intel snapshot and drawer state. | Renderer keeps front surface quiet and routes detail into back-page drawer. | `threat.intel.snapshot` via `auraThreatIntel.getSnapshot`; renderer drawer state. | Collapsed drawer: `Threat Intel`, Gateway chip, `Back page`. | Threat Intel; Gateway; Back page. | deliberate-inspection, authority-control | point-of-need | Must remain deliberate inspection, not background monitoring. | no - accepted current boundary. |
| Manual Threat Intel target | Operator types target in search/display input and submits form. | Scan request normalizes `targetText`, `targetKind`, `inputSource: search`, lookback, sample limit. | `threat.intel.scan` service command through preload `auraThreatIntel.scan`; renderer `submitThreatSearch`. | Back page acquisition bar: `Search / Display`, manual input placeholder `Manual fallback target`, display target. | Threat Intel target; manual target; search; scan. | deliberate-inspection, acquisition-control | operator-facing | `fallback` wording is collision-prone and can imply lower-authority truth source. | yes - acquisition bar is a safe Lab comparison candidate. |
| Clipboard-acquired target | Clipboard content read only during armed/listening window or shortcut path. | Ignores unchanged content, validates non-empty text, scans through Threat Intel contract, seals into cooldown. | `clipboard.acquisition.snapshot`; `threat.clipboard.*` commands; `aura:threat-clipboard:snapshot`; renderer `consumeClipboardCapture`. | Clipboard widget and input population; messages such as `Pulling`, `Clipboard target captured; scan pending.` | Clipboard Acquisition; Pulling; Listening; Cooldown; clipboard-acquired target. | acquisition-control, authority-control | operator-facing | Safety-critical; any background-listening implication would break trust. | yes - safe candidate for short authority-window presentation. |
| Clipboard lifecycle state | Clipboard service state, global shortcut status, live IO gate status. | `idle`, `listening`, `cooldown`, `blocked` mapped to `Idle`, `Pulling`, `Cooldown`, `IO Off`; shortcut fallback labels. | `threat.clipboard.snapshot`, `threat.clipboard.shortcut-status`, event channel and renderer polling. | Widget state, key chips, shortcut message `Ctrl+\ opens a 3 second clipboard scan window...`. | Clipboard Acquisition; Pulling; Listening; Cooldown; IO Off. | authority-control, uncertainty-state | point-of-need | Renderer uses both `Listening` and `Pulling`; must keep bounded window clear. | yes - pressure-test candidate. |
| Threat target type selector | Operator clicks or `Alt+\` cycles local target kind. | Local renderer state sets one of system/pilot/corporation/alliance; resolver uses it to classify exact local/static match. | Renderer state `state.threatTargetKind`; shortcut event `aura:threat-target-kind:toggle`; included in `threat.intel.scan`. | Buttons `Pilot`, `System`, `Corp`, `Al`; status `System` or `Wrong type`. | target type; System; Pilot; Corp; Alliance; Wrong type. | deliberate-inspection, uncertainty-state | point-of-need | Abbreviation `Al` and `Wrong type` may confuse, but resolver boundary is important. | parked - possible scoped selector wording request. |
| Local/static Threat resolver match | Fixture/static resolver metadata for systems, pilots, corporations, alliances. | Parses prefixes, normalizes kind, returns resolved/local-static, ambiguous, unresolved, unsupported; does not guess. | `target` object in `threat.intel.snapshot`; renderer report target/type/status. | Report target/type, target label row, messages for ambiguous/unresolved/unsupported. | local/static resolver match; unresolved target; ambiguous target; unsupported target. | source-basis, uncertainty-state | provenance-detail | Local/static match is a basis, not freshness or provider truth. | yes - if resolver basis needs more visible display. |
| Provider sample target in Threat Intel | Resolved target passed to zKill route for selected kind. | zKill client normalizes discovered/selected refs, cap/partial/failure, lookback/sample limit. | `zkill` section in `threat.intel.snapshot`; renderer `threatBasis`, pulse, report sample. | `Basis`, `Sample`, `zKill 1h sample/partial/capped`, `Scoped sample`, `Capped sample`. | zKill; scoped sample; sample; capped; partial; provider sample target. | source-basis, deliberate-inspection | provenance-detail | Sample counts can be read as complete coverage unless scoped/cap/freshness remain visible. | yes - latest scan report/source-basis candidate. |
| Threat latest scan report | Last Threat Intel scan snapshot retained by service and renderer. | Status mapped into report state/message; target, type, basis, selected/discovered sample retained until next scan. | `threat.intel.snapshot`; renderer `renderThreatReport`. | Back-page report: `Target`, `Status`, `Target type`, `Basis`, `Sample`, `State`, `Report persists until the next scan.` | Threat Intel; latest scan; No scan; Scoped sample; Partial sample; Live IO blocked. | deliberate-inspection, source-basis, uncertainty-state | Lab display candidate | `Report persists` and persistent report aria label carry history/storage flavor. | yes - safest high-value Lab request candidate. |
| Threat provider pulse and zKill pulse | Threat snapshot zKill counts/lookback/status. | Provider pulse maps scan statuses; pulse dots scale discovered count and selected count. | Renderer `providerPulseFromThreat`, `renderThreatPulse`; diagnostics detail. | Glance chip `Threat --`, `Threat sampled`, `Threat capped`; drawer `zKill one hour pulse`. | Provider pulse; zKill one hour pulse; Threat sampled. | source-basis, diagnostic-support | provenance-detail | `Pulse` suggests continuous live status; one-hour visual can imply complete recent activity. | yes - candidate for calmer sample-state wording. |
| Threat blocked/failed/unresolved states | Live IO gate, resolver, provider failures, validation. | Threat service statuses `empty`, `blocked`, `unresolved`, `ambiguous`, `unsupported`, `failed`, `partial`, `succeeded`; renderer maps to Idle/Blocked/Degraded and report details. | `threat.intel.snapshot`; renderer report and message functions. | Scan state `Idle`, `Blocked`, `Degraded`, report state `Provider failed`, `Ambiguous target`, `Unresolved target`, etc. | No scan; Live IO blocked; Provider failed; Ambiguous target; Unresolved target; Unsupported target. | uncertainty-state, deliberate-inspection | operator-facing | Top-level `Degraded` can hide specific provider failure unless report remains visible. | parked - better display, not deletion. |
| Runtime Live IO authority | Operator toggle or startup default in main process gates. | Main process sets Passive and Threat live IO gates together; snapshot merges both gate statuses. | `runtime.live-io.snapshot` / `runtime.live-io.set-enabled`; preload allowlist; renderer `renderLiveIoPolicy`. | Top `IO` button; diagnostics `Live IO`; `On - network and clipboard enabled` / `Off - network and clipboard blocked`. | Live IO; IO authority; Live IO blocked. | authority-control, uncertainty-state | operator-facing | `IO` is backend/runtime wording in primary UI; can hide difference between network and clipboard authority. | parked - possible authority wording comparison. |
| Runtime settings and gamelog setup | Runtime settings file and native folder picker. | Validates/persists gamelog folder; maps settings status missing/ready/recovered/degraded. | `runtime.settings.snapshot`, `runtime.gamelog-folder.pick`, Combat runtime configure/start. | Diagnostics setup: `Log Setup`, `Checking`, `Browse`, `Start`/`Stop`, `Settings`, `Ready/Recovered/Degraded/Missing`. | Runtime settings; Log Setup; Log Watcher. | setup-control, diagnostic-support | diagnostic-only | Runtime readiness can be misread as tactical readiness if promoted. | no - setup surface should remain Sense-owned. |
| Runtime diagnostics summary | Runtime diagnostics service records sanitized non-low-value events. | Redacts raw/content/line payloads, caps records, exposes count/status only to renderer. | `runtime.diagnostics.snapshot`; renderer `renderDiagnostics`. | Diagnostics header `System State`, `Quiet` or `N noted`; event details not currently rendered. | Diagnostics; System State; Quiet; observed diagnostics. | diagnostic-support | diagnostic-only | Good demotion today; avoid turning diagnostics into primary tactical signal. | no - keep diagnostic. |
| Service/task backend vocabulary | Service registry and optional task runner commands/results. | Classifies commands as read-only/local mutation/external IO; task statuses queued/running/succeeded/failed/partial/capped. | General service IPC `aura:service:invoke`; preload allowlist exposes only selected commands. | Mostly hidden; `Runtime ready` comes from `seed.readiness`; no normal task list UI. | seed.readiness; task status; service command. | internal-hidden, diagnostic-support | hidden/internal | Inherited `seed` and task terms should not become product copy. | no - keep internal. |
| Gateway marker and shortcut affordance | Renderer keyboard state and main shortcut registration events. | `\` opens/focuses Threat back page; `Ctrl+\` arms clipboard; `Alt+\` cycles target type. | Renderer key handlers, `aura:threat-target-kind:toggle`, shortcut status service. | Gateway chip `\`, label `Gateway`, key chips `Ctrl` / `\`, summary marker. | Gateway; Control+\; Alt+\; target kind toggle. | authority-control, deliberate-inspection | point-of-need | Gateway must stay distinct from Live IO gate; shortcut copy must match runtime. | parked - preserve unless Human/Overseer opens translation choice. |

## Qualitative Report

### 1. Files Reviewed

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

### 2. Current-State Understanding

AURA-Sense is a transient tactical viewport. Combat Witness is the time-sensitive primary lane, based on recent local gamelog observations. Passive Telemetry is current-system context triggered by local observation and enriched by gated zKill/ESI providers. Threat Intel is deliberate scoped inspection from manual or clipboard-acquired input. Clipboard Acquisition is a short visible authority window feeding Threat Intel. Runtime diagnostics/settings support trust and setup but should not become tactical meaning.

Renderer presentation consumes backend-owned snapshots and service commands. It does not own parser truth, provider calls, telemetry caches, or tactical computation.

### 3. Top 5 Display Overload Causes

1. Provider/source metadata is visible in the primary Passive band: zKill count, ESI activity, static lookup, sample state, and age can crowd the first read.
2. Threat back page combines acquisition, target type, provider basis, pulse, latest report, shortcut guidance, and state messages in one compact surface.
3. Provider pulse appears twice as a general concept: front glance chips and Threat zKill pulse, with possible live-heartbeat implications.
4. Target-like concepts overlap visually: observed source, current system, manual target, clipboard target, target type, provider sample target, and local/static resolver match.
5. Runtime authority and diagnostics terms such as IO, Runtime ready, Settings, Log Watcher, and System State sit close to tactical lanes and can read as tactical status.

### 4. Top 5 Safest Future Lab `request_display` Candidates

1. `sense.threat-latest-scan-review`: compare ways to present latest scan review without report/history/storage implication.
2. `sense.clipboard-window`: pressure-test the short visible clipboard authority window and shortcut feedback.
3. `sense.provider-pulse-row`: compare calmer provider/sample status wording against pulse wording.
4. `sense.passive.state-basis`: pressure-test Passive state/freshness/basis display after the accepted instrument band.
5. `sense.threat-acquisition-bar`: compare display/search/acquisition grouping for manual and clipboard targets.

No Lab request is created by this audit.

### 5. Source-Owned Terms That Must Be Preserved

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

### 6. Surfaces That Must Stay Sense-Owned

- Lane names and lane separation.
- Snapshot meanings: `combat.witness.snapshot`, `passive.telemetry.snapshot`, `threat.intel.snapshot`, `clipboard.acquisition.snapshot`, `runtime.live-io.snapshot`.
- Live IO authority and blocked meanings.
- Clipboard Acquisition lifecycle and shortcuts.
- Threat target resolution, target kind, local/static resolver result, and scan contract.
- Passive current-system context, freshness, cap/partial/degraded/blocked states.
- Combat observed source/weapon/balance semantics.
- Runtime diagnostics sanitization and setup authority.

### 7. Backend/Runtime Metadata Currently Visible In Primary UI

- Top chrome `IO` authority and tooltip/aria authority state.
- Passive basis line exposes provider names/counts, ESI activity values, `Static lookup`, sample/cap/partial, and age.
- Front provider pulse chips expose Passive/Threat provider state.
- Threat acquisition surface exposes provider pulse, target type, sample counts, basis, and zKill one-hour pulse.
- `Runtime ready` appears in setup/runtime health after `seed.readiness`.
- `Log Watcher` status is visible in top chrome and setup.

### 8. Information That Needs Better Display, Not Deletion

- Passive provider/sample basis and freshness: trust-critical, but likely better as compact first-read plus reveal.
- Threat latest scan report: needed for deliberate review, but should avoid durable report/storage flavor.
- Clipboard Acquisition state: safety-critical and must remain visible, but boundedness should be clearer than any listening/monitoring implication.
- Local/static resolver basis: important to prevent target guessing, but not tactical truth.
- Live IO authority: must remain visible, but `IO` may need clearer Bridge -> Interface wording later.

### 9. Terminology Or Ownership Risks

- `Report persists until the next scan` and persistent report labels can drift toward Atlas history/storage semantics.
- `Provider pulse` and `zKill one hour pulse` can imply continuous live heartbeat or complete coverage.
- `Manual fallback target` can make fallback sound like alternate authority rather than manual input.
- `Observed Source` and `Observed Weapon` can become identity/type claims if `Observed` is removed.
- Lab labels can help presentation, but must not become Sense bridge fields, CSS/test identifiers, service names, or backend enums.

### 10. Parked Or Unknown Items

- Whether `Gateway` is preserve-exact for all future Lab-facing UI.
- Whether `Pulling`, `Listening`, and `Cooldown` should remain exact Clipboard copy or be restyled after bridge.
- Whether `Provider pulse` should remain visible wording.
- Whether `Al` abbreviation is acceptable for Alliance target type.
- Whether Passive needs a dedicated detail reveal beyond diagnostics.
- Whether real operator use will require different density for primary Passive basis and Threat report detail.

### 11. Recommended Next Bounded Action

Open one advisory scoping pass, not implementation: choose up to three request-ready surfaces from this audit and draft candidate `request_display` entries for Sense review only. The safest first bundle is latest Threat scan review, Clipboard Acquisition authority window, and Passive state/basis display. Keep them parked until Sense explicitly submits them to Lab.

## Verification

Run:

```powershell
npm.cmd run verify:protected-terms
```

Result:

- Passed in warning-only mode.
- Scanned 1 changed file: `workspace\DisplayInventoryAuditHS01-ingest-transform-bridge-display.md`.
- Reported 21 warning-only items, concentrated in expected advisory terms: `Report`, `Fallback`, `Readout`, and `Coverage`.
- No renames were performed.
- No protected-word JSON updates were performed.
