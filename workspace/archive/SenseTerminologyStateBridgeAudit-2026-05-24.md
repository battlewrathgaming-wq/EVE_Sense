# AURA-Sense Terminology And State Bridge Audit

Date: 2026-05-24
Role: terminology/state auditor
Status: Advisory audit, no implementation

## 1. Files Reviewed

Authority and coordination:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/00-dot-protocol.md`
- `workspace/prompts.md`

Current-state, feature, schema, contract, and roadmap sources:

- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/features/clipboard-acquisition.md`
- `docs/schemas/hud-snapshot.md`
- `docs/schemas/combat-event.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/contracts/service-command-contract.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/roadmap/milestone-14-back-page-threat-intel-ux.md`
- `package.json`

Implementation and verification files inspected:

- `src/main/preload.js`
- `src/main/main.js`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `src/services/taskRunner.js`
- `src/services/messageTaxonomy.js`
- `src/services/serviceRegistry.js`
- `src/services/ipcPayloadValidation.js`
- `src/services/httpClient.js`
- `src/combat/combatWitnessService.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatRollingWindow.js`
- `src/combat/combatLogParser.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatWitnessBridge.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/liveIoGate.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/passive/localSystemResolver.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelTargetResolver.js`
- `src/threat/threatIntelZkillClient.js`
- `src/threat/clipboardAcquisitionService.js`
- `src/runtime/runtimeSettingsService.js`
- `src/runtime/runtimeDiagnosticsService.js`
- `src/metadata/localTypeMetadata.js`
- `src/metadata/sdeJsonlZip.js`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-renderer-boundary.js`
- `scripts/verify-renderer-boundary-adversarial.js`
- `scripts/verify-threat-intel.js`
- `scripts/verify-passive-telemetry.js`
- `scripts/verify-runtime-control.js`
- `scripts/verify-combat-witness-core.js`
- `scripts/verify-combat-witness-bridge.js`
- `scripts/verify-combat-witness-runtime.js`
- `scripts/verify-combat-window-weapon-spike-followups.js`
- `scripts/verify-clipboard-acquisition-race.js`
- `scripts/verify-local-type-metadata.js`

Verification was not run, per audit guardrail.

## 2. Short Current-State Understanding

AURA-Sense is idle after accepted Milestone 13 and Milestone 14 closure. It is a transient tactical viewport for recent EVE Online operational observations. The current product shape is backend-owned, live-gated, uncertainty-aware, and explicitly distinct from Atlas evidence storage and Lab presentation mechanics.

The renderer presents snapshots, user interaction, and visual state. Backend/main-process services own ingestion, normalization, caching, computation, live API orchestration, and bridge payloads.

## 3. Repo-Verified Facts

- `workspace/current.md` says no active milestone, no current executor, and no active Dev runway.
- Milestone 13 is complete and focused on offline aggressive hardening, hostile inputs, renderer/preload boundary attacks, visual state smoke, clipboard race checks, and deterministic verification.
- Milestone 14 is complete and establishes back-page Threat Intel UX, display-first acquisition, gateway semantics, target-type local controls, clipboard authority visuals, and latest scan report persistence.
- `docs/current-state/current-implementation.md` still has a header saying Milestone 14 is active, but `workspace/current.md`, `workspace/overview.md`, and `docs/roadmap/milestone-14-back-page-threat-intel-ux.md` mark it closed.
- Combat Witness snapshots use `kind: combat.witness.snapshot`, `freshness.status` values `empty`, `recent`, and `stale`, rolling `5s`, `15s`, and `30s` windows, and a bounded event stream.
- Passive Telemetry snapshots use `kind: passive.telemetry.snapshot` and statuses `unavailable`, `fresh`, `stale`, `partial`, `degraded`, and `blocked`.
- Threat Intel snapshots use `kind: threat.intel.snapshot` and statuses `empty`, `blocked`, `unresolved`, `ambiguous`, `unsupported`, `failed`, `partial`, and `succeeded`; `pending` appears as base/freshness state during scan setup and renderer state mapping.
- Clipboard Acquisition snapshots use `kind: clipboard.acquisition.snapshot` and service states `idle`, `listening`, and `cooldown`; `sealed` is a lifecycle message/reason, not a persistent state field.
- Runtime settings snapshots use `kind: runtime.settings.snapshot` and statuses `missing`, `ready`, `recovered`, and `degraded`.
- Runtime diagnostics snapshots use `kind: runtime.diagnostics.snapshot` and statuses `quiet` and `observed`.
- Live IO gates default disabled and return `live-enabled`, `live-disabled`, or check result `blocked`.
- Renderer boundary verification forbids renderer/preload provider calls, filesystem/log access, parser ownership, and tactical computation ownership.
- Preload exposes a narrow allowlist for general service commands and separate lane-specific snapshot bridges.
- Renderer user copy already bridges several backend states: Threat `succeeded` becomes `Sampled`, Threat `failed` becomes `Degraded` in the scan state, Clipboard `listening` becomes `Pulling`, and report state uses `Scoped sample`, `Partial sample`, `Capped sample`, and `Live IO blocked`.

## 4. Assumptions Or Inferred Context

- This audit may create a workspace advisory artifact because the user requested a terminology/state audit and provided an artifact name.
- Existing strings, bridge fields, CSS classes, and verification phrases are treated as stable until a future Dev packet explicitly authorizes changes.
- `docs/current-state/current-implementation.md` header drift is documentary drift, not active milestone authority.
- User-facing copy should favor operational clarity over raw backend status names, but verification scripts should continue to assert stable bridge and CSS terms.
- "Report persists" is intended as latest-snapshot review state, not durable history.

## 5. Terminology/State Bridge Table

| backend/domain term | service/bridge term | renderer/user term | meaning | user-facing? | allowed use | avoid/conflicts | recommended disposition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `combat.witness.snapshot` | `auraCombatWitness.getSnapshot`, `aura:combat-witness:snapshot` | Combat Witness | Short-window local combat-log observation summary. | Yes, as lane name | Keep as stable lane and bridge term. | Do not call it a combat record or evidence archive. | Preserve. |
| `combat.damage`, `combat.miss`, `combat.repair` | bounded `eventStream` | Event Stream, Incoming damage, Repair | Normalized observed combat log events. | Partly | User can see compact labels; details stay internal. | Do not imply complete fight truth or unseen state. | Preserve internally, bridge as observed events. |
| `navigation.jump` | passive observer input | System | Observed current-system change from local log. | Bridged | Use to feed Passive Telemetry. | Do not present as permanent route history. | Preserve internal. |
| `observedAt` | snapshot `observedAt`, diagnostics `observedAt` | Observed, Witnessed | Time AURA-Sense observed/processed data. | Yes, with care | Use for freshness/certainty. | Do not collapse with EVE event time. | Preserve and document distinction. |
| `eventTime` | Combat event field | Latest observed combat event | EVE log timestamp after strict validation. | Rare | Use in diagnostics/reviewer docs. | Do not use as provider fetch time. | Keep internal or diagnostic. |
| `rawLineHash` | rejected line diagnostics | Hash/reference | Private-log-safe fingerprint. | No | Diagnostics and verification only. | Do not show raw line text or call it durable evidence. | Keep internal. |
| `freshness.status: recent` | Combat Witness freshness | Recent, Witnessed | Latest combat event is within 15 seconds. | Yes | Combat-only freshness. | Do not reuse `fresh` here unless schema changes. | Preserve; bridge as "Recent combat." |
| `freshness.status: fresh` | Passive freshness | Passive fresh | Provider/current-system context is within freshness window. | Yes | Passive-only provider/context freshness. | Do not imply tactical truth is complete. | Preserve; qualify by lane. |
| `freshness.status: stale` | lane freshness | Stale | Data exists but age exceeded freshness window. | Yes | Use with lane and source. | Do not hide partial/capped metadata when stale. | Preserve. |
| `empty` | Combat/Threat snapshot status | Empty, No scan, Idle | No bounded event or no scan request/result. | Yes, bridged | Use as internal status; user copy should explain lane-specific absence. | Do not use "empty" for provider failure. | Preserve internal; bridge user copy. |
| `unavailable` | Combat/Passive status | Unavailable | Bridge/input/source missing or no current system. | Yes | Use for absent capability/source. | Do not use for live IO disabled or failed provider. | Preserve. |
| `blocked` | gate/check status | Live IO blocked, Blocked, IO Off | Explicit authority/gate prevents live/provider action. | Yes | Use when live IO or task lock refuses action. | Do not use for missing path or provider failure. | Preserve and keep authority-specific. |
| `degraded` | service/message severity, runtime/settings/passive status | Degraded, Provider failed in pulse | Error/failure with partial or retained operation. | Yes | Runtime health, settings, provider/watcher failure. | Do not overuse as generic "bad." | Preserve; define narrowly. |
| `failed` | Threat status, task status | Provider failed, Degraded | Attempt completed unsuccessfully. | Yes, bridged | Internal status and report state. | Avoid making scan state say only "Degraded" when operator needs provider failed reason. | Preserve internal; bridge to provider-failed where specific. |
| `partial` | provider/sample/task status | Partial sample | Some refs malformed/incomplete or task result incomplete. | Yes | Use with sample/source details. | Do not imply overall tactical partialness without lane. | Preserve; always pair with what is partial. |
| `capped` | provider/sample/task status | Capped sample | Sample limit truncated result set. | Yes | Threat/Passive provider basis and report state. | Do not call capped results complete. | Preserve; user-facing with "sample." |
| `succeeded` | Threat/task status | Sampled, Scoped sample | Scan/task completed and returned normalized result. | Yes, bridged | Internal/task status and provider pulse. | Do not render as "success = safe/clear." | Preserve internal; bridge as sample/result. |
| `pending` | task/base snapshot/freshness | Pending, Scanning | Request exists and work not complete yet. | Yes | Visual scan/request progress. | Do not use for idle waiting-for-operator. | Preserve. |
| `queued`, `running`, `cancelled` | `TASK_STATES` | Not currently prominent | Generic service task lifecycle. | No/diagnostic | Task runner and tests. | Avoid exposing task-runner mechanics in HUD. | Keep internal unless diagnostics need it. |
| `live-enabled`, `live-disabled` | `runtime.live-io.snapshot`, gate status | IO authority On/Off, Enable IO/Disable IO | Backend live-provider authority state. | Yes | Operator control and blocked explanation. | "IO" is technical; do not imply Atlas or storage authority. | Preserve bridge; consider alias "Live provider access" later. |
| `gate` | snapshot `gate` | Live IO blocked | Authority check and reason. | Partly | Internal field and blocked state source. | Do not make "gate" a broad product metaphor outside Milestone 14 gateway. | Keep internal except blocked copy. |
| `provider` | zKill/ESI/http fields | Provider, zKill, ESI | External data source family. | Yes | Basis/pulse diagnostics. | Do not imply provider data is verified truth. | Preserve with source/sample qualifiers. |
| `endpointFamily`, scoped route | zKill compact probe | Basis/scope | Route family used for scoped provider query. | No/diagnostic | Verification and debugging. | Do not expose route jargon in normal HUD. | Keep internal; bridge as target type and lookback. |
| `lookbackSeconds`, `pastSeconds` | Threat/Passive zKill options | 1h, one-hour pulse | Provider query time window. | Yes, bridged | Use as source scope. | Do not call it complete one-hour truth. | Preserve internal; bridge as "lookback." |
| `sampleLimit` | Threat probe limit | Sample cap | Max refs selected for display. | Partly | Report/diagnostics where capped. | Do not hide cap. | Preserve. |
| `discoveredCount`, `selectedCount` | Threat `zkill` counts | Sample `selected / discovered` | Provider returned count vs valid selected rows. | Yes | Latest report and diagnostics. | Do not render discovered as total EVE activity. | Preserve; user copy should say sample. |
| `malformedCount`, `failedCount`, `failures` | provider failure metadata | Partial/provider failed reason | Malformed refs or failed normalization. | Diagnostic/user on failure | Keep as reasons. | Do not surface raw provider payload. | Preserve internal; bridge summarized. |
| `targetText`, `targetKind`, `inputSource` | Threat scan request | Target, Target type, Manual/clipboard | Operator-supplied target and local classification. | Yes | Back-page controls and report. | Do not treat target kind toggle as network authority. | Preserve. |
| `requestedAt`, `resolvedAt` | Threat contract | Not currently prominent | Request/resolution times. | No/diagnostic | Future diagnostics if needed. | Do not overcomplicate HUD. | Keep internal. |
| local/static resolution | resolver `source: local-static` | Target type, Wrong type | Local ID lookup before provider scan. | Partly | Report/debug copy. | Do not call local static resolution fresh. | Preserve; bridge as "local target match." |
| `unresolved` | Threat resolution status | Unresolved target, Idle scan state | No local match. | Yes | Report state and message. | Do not label as provider failure. | Preserve; user-facing in report. |
| `ambiguous` | Threat resolution status | Ambiguous target | Multiple possible local matches or kind required. | Yes | Report state and message. | Do not guess target. | Preserve. |
| `unsupported` | Threat resolution status | Unsupported target | Prefix/kind/text not supported for zKill scan. | Yes | Report state and message. | Do not auto-convert into broad text scan. | Preserve. |
| `armedAt`, `armedClipboardText` | Clipboard service internals | Not shown | Baseline content used to ignore unchanged clipboard. | No | Service/verification only. | Do not surface as long-running arm mode. | Keep internal. |
| `listening` | Clipboard snapshot state | Pulling, Listening | Three-second clipboard authority window. | Yes, carefully | Use for active authority visual only. | Avoid "watching clipboard" or mode-like copy. | Preserve service; bridge to "Pulling" where possible. |
| `sealedReason`, `sealedAt` | Clipboard lifecycle | Sealed, Cooldown | Listener closed after capture/reject/timeout/cancel. | Yes as event/copy | Use to explain snap-off and cooldown. | Do not make "sealed" look like active state. | Preserve as lifecycle word, not CSS/state enum. |
| `cooldown` | Clipboard state | Cooldown | Temporary constraint before re-arm. | Yes | Amber exterior only. | Do not make cooldown look like active listening. | Preserve. |
| `watching` | watcher state | Log Watcher Watching | Gamelog watcher running. | Yes | Only for log watcher. | Do not use for clipboard or Threat Intel background behavior. | Preserve with lane qualifier. |
| `missing`, `invalid`, `error` | low-level watcher/settings validation | Missing, Degraded, Unavailable | Low-level path/file failure states. | Mostly bridged | Internal validation and diagnostics. | Do not expose `invalid` as tactical state. | Keep internal/diagnostic. |
| `ready`, `recovered`, `missing` | runtime settings status | Ready, Recovered, Missing | Runtime settings load/save health. | Yes in diagnostics | Diagnostics panel. | Do not imply tactical readiness. | Preserve in runtime lane only. |
| `quiet`, `observed` | runtime diagnostics status | Quiet, Observed | Diagnostic record count state. | Yes in diagnostics | Diagnostics header. | Do not use observed as proof of tactical event truth. | Preserve. |
| `cache`, `etag`, `conditional`, `revalidated` | ESI activity cache | Cached, Passive cached | Provider cache behavior. | Partly | Diagnostics/pulse details. | Do not expose HTTP mechanics as primary HUD. | Preserve internal; bridge as cached/revalidated if needed. |
| `SDE`, metadata artifact, type lookup | local metadata files | Type label fallback | Read-only local type labels. | No/rare | Verification and future diagnostics. | Do not claim current SDE freshness by default. | Keep internal. |
| `Type <id>` fallback | type lookup | Type ID fallback | Unresolved type remains visible. | Diagnostic/user if surfaced | Safe fallback. | Do not hide unresolved IDs. | Preserve. |
| `seed.readiness` | preload allowlist | Runtime ready/blocked | Inherited seed readiness check. | Bridged | Runtime health bootstrap. | "Seed" should not become user-facing product term. | Keep internal; future rename optional. |
| `validateActiveScanPayload` | unused/inherited validator | None | Inherited active scan validator. | No | Current-state known gap. | Could conflict with Threat Intel scan contract. | Defer/reconcile in future packet. |
| `report` | latest Threat snapshot review | Persistent Threat Intel report | Renderer latest-scan review state. | Yes | Back-page latest scan only. | Do not imply historical intelligence store or evidence report. | Preserve with "latest" qualifier. |
| `basis` | renderer/provider summary | Basis | Source/count/lookback summary. | Yes in back page/diagnostics | Report and diagnostic detail. | Too abstract for prime HUD. | Preserve but consider alias "Source basis." |
| `provider pulse` | renderer chips/timeline | Provider pulse, zKill one hour pulse | Compact provider/sample state signal. | Yes | Lane-specific provider health/sample context. | Could sound like live heartbeat even when cached/stale. | Preserve with lane/source/freshness qualifiers. |
| `gateway` | renderer back-page marker | Gateway | Back-page context binding marker for `\`. | Yes | Milestone 14 keyboard model. | Do not confuse with live IO gate. | Preserve user-facing; keep "gate" internal. |
| `repair balance` | Combat `balance.*` | Observed repair balance, Net repair minus incoming damage | Observed incoming repair HPS minus incoming DPS. | Yes | Combat Witness only. | Do not call safety, tank, survival, stability. | Preserve with observed qualifier. |
| `spikeThreshold`, `spikeOutliers` | Combat rolling window | Not displayed prominently | Lightweight outlier detection. | No for now | Tests/docs only until calibrated. | Do not promote as warning/prediction. | Keep internal/deferred. |
| `mostObservedWeaponType` | Combat window field | Most observed weapon, Observed Weapon | Most frequent observed weapon label. | Yes | User copy should avoid normalized "type" claim. | "Weapon type" overstates normalization. | Bridge to "Most observed weapon." |

## 6. Overloaded Or Risky Terms

- Evidence: docs use it in limited reviewer sense for local log evidence, but user-facing product must not imply Atlas evidence doctrine, storage, or assessment.
- Intel / Threat Intel: accepted lane name, but "intel" can imply completeness. Keep paired with scoped scan, sample, provider basis, cap/freshness.
- Report: safe only as latest scan review state. Risky if paired with history, archive, evidence, or records.
- Persistent: safe only as "persists until next scan." Risky if read as durable storage.
- Provider pulse: useful but abstract; could imply continuous heartbeat. Qualify with stale/cached/no scan.
- Fresh / recent / stale: lane-specific meanings differ. Combat uses recent/stale; Passive uses fresh/stale. Avoid global freshness.
- Partial / capped / failed: safe with sample/source details; risky without lane or provider context.
- Blocked / unavailable / degraded: must stay distinct: authority off, absent source, failed/degraded operation.
- Watcher / watching: safe for gamelog watcher, unsafe for clipboard.
- Listening / pulling / armed / sealed: must preserve brief clipboard authority window; do not make listening a mode.
- Live IO / IO authority: useful in current UI but technical. Avoid implying storage or broad automation authority.
- Scan / search / display: backend scans, UI searches/displays. Avoid visible web-form "Search" as primary workflow.
- Gateway: accepted UI term for `\`, but keep separate from backend `gate`.
- Basis: useful but abstract; keep mostly report/diagnostic, not prime HUD.
- Scope: valuable safe-word for provider lookback/route; should not imply complete coverage.
- Observed / source: must not imply identity uniqueness or durable actor.
- Repair balance: safe only as observed HPS-DPS.
- Spike: uncalibrated; do not elevate.
- Weapon type: backend field name overstates type normalization. User-facing should say weapon or weapon label.
- Metadata / hydration / SDE: internal tooling terms, not operator trust claims.
- Readiness: inherited seed term; user should see runtime ready/blocked, not seed readiness.
- Runtime state / diagnostics: safe as compact review, not developer console stream.
- Record / history / storage: avoid unless explicitly saying not present or deferred.

## 7. Terms/States That Should Remain Internal

- `rawLineHash`, raw parser envelope details, `rawColor`, parser regex concepts.
- `TASK_STATES`, `queued`, `running`, `cancelled`, `scope_key`, lock keys, task IDs except diagnostic tooling.
- `seed.*`, `util.checksum`, `task.*`, full service inventory.
- `endpointFamily`, exact zKill route names, `pastSeconds`, `sampleLimit` as raw field names.
- `etag`, `conditional`, HTTP retry count, request headers, cache implementation details.
- `armedAt`, `armedClipboardText`, `listeningUntilMs`, `cooldownUntilMs` except derived UI state.
- `sealedReason` values except summarized capture/timeout/rejected/cooldown copy.
- SDE ZIP internals, JSONL builder terms, compression/path-hardening details.
- `spikeThreshold` and `spikeOutliers` until real dataset calibration justifies display.
- `validateActiveScanPayload` / active scan validator language until reconciled.

## 8. Terms/States That Should Be User-Facing

- Lane names: Combat Witness, Passive Telemetry, Threat Intel, Clipboard Acquisition when needed.
- Source/freshness labels: Recent, Fresh, Stale, Cached, No scan, No provider, Live IO blocked.
- Uncertainty labels: Partial sample, Capped sample, Capped partial sample, Provider failed, Ambiguous target, Unresolved target, Unsupported target.
- Authority/workflow labels: Gateway, Pulling, Listening, Scanning, Cooldown, IO authority, Target type.
- Runtime health labels in diagnostics: Ready, Recovered, Missing, Degraded, Quiet, Observed.
- Combat labels: Observed source, Most observed weapon, Incoming pressure, Repair throughput, Observed repair balance.
- Current system/activity labels: System, Kills, Jumps, Ratio, Passive basis.

## 9. State Model Review

- loading: Present as renderer/settings "Checking" or `Loading`. Safe as a renderer boot state only. Do not add backend `loading` unless async snapshot contract needs it.
- idle: Safe for UI waiting state and Clipboard idle. For Threat Intel, renderer maps unresolved/unsupported/empty to Idle; report should still show exact reason.
- empty: Correct as backend absence status. User copy should be No scan, No combat events observed yet, or Idle depending on lane.
- missing: Correct for runtime settings or paths. Avoid using it as tactical lane state.
- ready: Correct for runtime/settings and local interaction readiness. Avoid "ready" as tactical safety.
- recovered: Correct for settings loaded with warnings. Keep diagnostic.
- quiet: Correct for diagnostics/combat title when no active signal. Avoid using it as proof of no threat.
- observed: Correct as uncertainty qualifier. Maintain "observed label/source/weapon" language.
- recent: Correct for Combat Witness freshness. Do not use for provider result unless source/age is shown.
- fresh: Correct for Passive provider/current-system context. Do not use for Combat Witness unless schema changes.
- stale: Correct and important. Preserve lane-specific stale copy.
- pending: Correct for scan/request/task in progress. Do not use for idle awaiting operator.
- listening: Correct only during active clipboard authority. Use visible bounded state.
- pulling: Good user-facing bridge for clipboard acquisition, especially hands-free capture. It is less mode-like than "watching."
- scanning: Correct after capture/submit while provider scan is running.
- sealed: Good lifecycle word, not a durable state enum. Use to explain listener snap-off.
- cooldown: Correct temporary constraint. Visual must remain amber exterior only.
- populated: Not a current stable status. Avoid adding unless it means renderer has displayable data.
- succeeded: Correct internal/task/provider status. Bridge to Sampled or Scoped sample.
- failed: Correct internal/provider status. Bridge to Provider failed where possible.
- partial: Correct with provider/sample metadata. Preserve.
- capped: Correct with sample cap. Preserve.
- gated: Avoid as user status because Live IO gate and Gateway already compete. Use blocked/user authority copy.
- blocked: Correct for authority or lock refusal. Preserve.
- unavailable: Correct for no bridge/source/current system. Preserve.
- degraded: Correct for failed or impaired source/runtime. Preserve, but avoid catch-all use.
- ambiguous: Correct for resolver ambiguity. Preserve and expose.
- unresolved: Correct for local resolver miss. Preserve and expose.
- unsupported: Correct for target kind/prefix unsupported. Preserve and expose.

## 10. Source/Freshness/Certainty Wording Review

What exists now:

- Combat docs repeatedly use "observed", "recent", "short-lived", "not complete fight record", and "not survival truth."
- Passive exposes `currentSystem`, zKill sample count, ESI activity, cache/freshness, gate, failure, and stale/partial metadata.
- Threat exposes provider, endpoint family, lookback, discovered/selected/malformed/failed counts, capped/partial flags, target resolution status, and latest report.
- Renderer copy includes `zKill 1h sample`, `zKill 1h partial`, `Live IO blocked`, `Partial sample`, `Capped sample`, `Scoped sample`, `No provider`, and `No scan`.
- Renderer title text includes "zKill one hour pulse" and provider pulse chips.

What is safe:

- "Observed source", "Most observed weapon", "Incoming pressure", "Repair throughput", and "Observed repair balance."
- "Scoped sample", "Partial sample", "Capped sample", "Provider failed."
- "Report persists until the next scan" when coupled to latest-snapshot review state.
- "Live IO blocked" when the backend gate has refused provider/clipboard scan flow.
- "No provider" and "No scan" as distinct null states.

What overstates truth or risks drift:

- "Weapon type" can overstate normalized type identity; current backend stores observed weapon labels.
- "Intel" and "report" can overstate completeness if not paired with sample/source/cap/freshness.
- "zKill one hour pulse" may imply live continuous pulse even when no scan or stale/cached context exists.
- "Evidence" in user copy would import Atlas semantics.
- "Runtime ready" can be misread as tactical readiness; it only means seed/runtime checks passed.

What must be bridged or demoted:

- Backend `succeeded` should continue to bridge to `Sampled` or `Scoped sample`.
- Backend `failed` should bridge to `Provider failed` in report/pulse contexts, and `Degraded` only in broader lane health.
- Backend `empty` should bridge to lane-specific absence copy.
- `mostObservedWeaponType` should bridge to "Most observed weapon."
- `endpointFamily`, `pastSeconds`, `sampleLimit`, ETag, and route details should stay diagnostic or become "source basis/lookback/sample cap."

## 11. Lane-Boundary Wording Review

Combat Witness:

- Good: "Combat Witness", "witnessed", "observed", "recent", "rolling windows", "Incoming pressure", "Repair throughput."
- Keep internal: raw parser details, raw-line hashes, spike threshold/outliers until calibrated.
- Watch risk: "Log Watcher" is acceptable for gamelog watcher but should not bleed into clipboard.
- Required bridge: `recent` means combat recency, not provider freshness.

Passive Telemetry:

- Good: "current-system context", "activity", "fresh/stale/partial/degraded/blocked", "zKill context", "ESI activity."
- Keep explicit: live IO gate, cache/freshness metadata, current-system observation.
- Watch risk: "Passive" must not imply background Threat Intel scans.
- Required bridge: `fresh` is source/context freshness, not tactical certainty.

Threat Intel:

- Good: "deliberate scoped scan", "Target type", "Sample", "Basis", "Scoped sample", "Partial sample."
- Keep explicit: operator initiation, local/static resolution, live IO blocked state, cap/failure/freshness.
- Watch risk: "Intel" and "Report" can sound historical or complete.
- Required bridge: "scan" is backend/provider action; "display/search" is UI surface.

Clipboard Acquisition:

- Good: "Pulling", "Listening", "Cooldown", "sealed", "clipboard authority window."
- Keep explicit: three-second window, unchanged content ignored, cooldown after capture/timeout/rejection/cancel.
- Watch risk: "watching clipboard", "monitoring", or persistent listener language.
- Required bridge: `listening` is a state, not a mode.

Runtime diagnostics/settings:

- Good: "Diagnostics", "System State", "Runtime ready", "Settings Missing/Ready/Recovered/Degraded", "Quiet/Observed."
- Keep explicit: sanitized bounded diagnostics, no raw logs.
- Watch risk: developer noise in HUD and runtime ready implying tactical ready.
- Required bridge: diagnostics are trust/health context, not tactical evidence.

Local metadata:

- Good: "local/static", "local type metadata", "unresolved ID fallback."
- Keep internal: SDE builder, hydration, ZIP/JSONL hardening.
- Watch risk: claiming current SDE freshness or hiding unresolved IDs.
- Required bridge: local labels are convenience labels, not live provider truth.

## 12. Deletion/Retention/History Wording Review

What exists now:

- Combat Witness keeps rolling windows and a bounded event stream.
- Passive Telemetry caches current-system provider context and ESI activity with cache/freshness metadata.
- Threat Intel keeps the latest scan snapshot, and renderer keeps the latest report until next scan.
- Clipboard Acquisition keeps short lifecycle state and last capture in snapshot during cooldown.
- Runtime diagnostics keep bounded sanitized records.
- Runtime settings persist validated configuration.

What is blocked/deferred:

- Atlas handoff and persistence.
- Historical intelligence storage.
- Broad background discovery.
- ESI killmail expansion.
- Live provider smoke unless explicitly gated with `AURA_SENSE_LIVE_API=1`.
- Manual operator shortcut-feel validation.
- Real SDE refresh/download by default.

What must not be implied:

- No permanent combat history.
- No Atlas evidence store.
- No historical Threat Intel repository.
- No full provider coverage.
- No background clipboard monitoring.
- No complete fight report.
- No survival/tank-state verdict.
- No renderer-owned telemetry cache.

## 13. Recommended Rewrites Or Bridge Aliases

High-value future rewrite candidates:

- `Persistent Threat Intel report` -> `Latest Threat Intel report` or `Latest scan report` in user-facing labels. Keep "persists until next scan" in explanatory copy.
- `Report persists until the next scan.` -> `Latest scan stays here until the next scan.` This avoids storage flavor.
- `Most observed weapon type` -> `Most observed weapon` everywhere user-facing.
- `zKill one hour pulse` -> `zKill 1h sample pulse` or `zKill 1h sample` to reduce heartbeat/completeness implication.
- `Provider pulse` -> `Provider state` in diagnostic labels if users find pulse too abstract; keep CSS/verification names stable until authorized.
- `Basis` -> `Source basis` in report/diagnostics if more clarity is needed.
- `Runtime ready` -> `Runtime checks ready` if tactical readiness confusion appears.
- `Off - network and clipboard blocked` -> `Off - live provider scans blocked` if future product separates local clipboard capture from live scan authority.
- Threat `failed` renderer scan state currently maps to `Degraded`; consider report/pulse copy `Provider failed` as the more specific operator-facing bridge.
- Active scan validator language should be reconciled with Threat Intel scan contract in a future technical cleanup, not renamed opportunistically.

Aliases to preserve mentally:

- `succeeded` -> Sampled / Scoped sample.
- `failed` -> Provider failed / degraded lane health.
- `empty` -> No scan / no observed events / idle absence.
- `listening` -> Pulling / active clipboard authority.
- `gate blocked` -> Live IO blocked.
- `local-static` -> local target match / local resolver.
- `freshness.status` -> lane-specific recency/freshness, never global truth.

## 14. Bridge/State/Smoke Verification Terms That Should Stay Stable

Keep stable unless a future Dev packet updates tests and contracts together:

- Service/bridge names: `combat.witness.snapshot`, `passive.telemetry.snapshot`, `threat.intel.snapshot`, `runtime.settings.snapshot`, `runtime.diagnostics.snapshot`.
- Preload APIs: `auraCombatWitness.getSnapshot`, `auraCombatWitness.subscribeSnapshots`, `auraPassiveTelemetry.getSnapshot`, `auraPassiveTelemetry.subscribeSnapshots`, `auraThreatIntel.getSnapshot`, `auraThreatIntel.scan`, clipboard methods and snapshot subscriptions.
- IPC/event channels: `aura:combat-witness:snapshot`, `aura:passive-telemetry:snapshot`, `aura:threat-clipboard:snapshot`, `aura:threat-target-kind:toggle`.
- Renderer command allowlist terms asserted by adversarial boundary checks.
- CSS/visual classes: `is-unavailable`, `is-empty`, `is-fresh`, `is-stale`, `is-partial`, `is-capped`, `is-succeeded`, `is-pending`, `is-blocked`, `is-failed`, `is-degraded`, `is-idle`, `is-listening`, `is-pulling`, `is-scanning`, `is-cooldown`, `is-unsupported`, `is-authority`, `is-gateway-active`, `is-local-change`, `is-watching`, `diagnostics-open`, `io-off`.
- Smoke state artifact names: `state-unavailable.png`, `state-stale.png`, `state-degraded.png`, `state-blocked.png`, `state-partial-capped.png`, `state-clipboard-listening.png`, `state-cooldown.png`, `state-diagnostics-open.png`, `state-settings-degraded.png`, `state-narrow-viewport.png`.
- Verification phrases that assert doctrine: no renderer provider calls, no filesystem/log access, no parser ownership, no tactical computation ownership, no scan on focus, listener-active visuals snap off.

## 15. Risks/Blockers

- Documentation drift: `docs/current-state/current-implementation.md` header says Milestone 14 active while current workspace and roadmap mark Milestone 14 complete.
- Gate code drift: Threat Intel using a `createLiveIoGate` default can expose `PASSIVE_LIVE_IO_BLOCKED` in tests unless instantiated with Threat-specific code; main does instantiate a Threat-specific gate. This is not user-facing in normal runtime but is terminology drift in generic service tests.
- "Persistent Threat Intel report" is accepted Milestone 14 wording but remains the biggest Atlas-adjacent user-facing risk. It should always be framed as latest-scan review state.
- "Provider pulse" and "zKill one hour pulse" are useful but abstract. If future UX reports confusion, prefer sample/source wording.
- `validateActiveScanPayload` remains inherited active-scan language and is already listed as a current-state gap. It can confuse future service terminology if reused.
- "Weapon type" remains in backend field `mostObservedWeaponType`; user-facing copy should avoid type-normalization claims.
- Live/manual validation remains gated and should not be inferred from offline verification.

## 16. Suggested Next Bounded Packet

Suggested Overseer packet, if the human wants follow-up work:

Terminology cleanup planning only, no implementation:

1. Update `docs/current-state/current-implementation.md` header/status to reflect Milestone 14 closure.
2. Prepare a small rename/alias proposal for user-facing copy only: latest scan report, source basis, zKill sample pulse, most observed weapon.
3. Review `PASSIVE_LIVE_IO_BLOCKED` leakage in Threat Intel service tests and decide whether a future Dev cleanup should pass a Threat-specific gate in all Threat test fixtures.
4. Reconcile inherited `validateActiveScanPayload` language with the Threat Intel scan contract, or document it as retained seed/internal utility.
5. Leave bridge names, snapshot fields, CSS classes, and verification state terms unchanged unless a Dev packet explicitly includes coordinated test updates.

