# EngAuditHS58 - Backend-To-Adapter Readiness Conformance

Date: 2026-05-31
Role: Sense Engineering / Systems auditor
Status: Read-only audit complete

## Goal

Assess whether a target-owned Sense adapter can map current bridge output into a future presentation head without guessing, inventing meaning, overclaiming, or merging lanes.

This audit stops at the target-owned adapter boundary:

```txt
Sense bridge output -> Sense-owned adapter boundary -> future presentation head
```

It treats Lab presentation heads and materials as future downstream consumers only, not Sense authority. It treats M16 body-to-adapter readiness as parked context, not active implementation authority.

## Scope Boundaries

Reviewed:

- Combat Witness
- Passive Telemetry
- Threat Intel
- Clipboard Acquisition
- bridge/preload/service outputs currently available to a future adapter
- renderer behavior only as evidence of current consumption, not as adapter authority

Did not:

- implement code
- edit project authority files
- create a Dev runway
- run live provider smoke
- run live/manual EVE gamelog ingestion
- inspect private/operator EVE log folders
- run manual shortcut validation
- capture clipboard content
- run real SDE refresh/download
- adopt or design a renderer face
- modify Lab files
- rename Sense contracts, IPC channels, payload fields, services, schemas, CSS/test selectors, or user-facing terms
- import Atlas evidence/discovery/watch/assessment/storage semantics

## Files Reviewed

Authority and current state:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
- `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/adr/ADR-0003-target-owned-presentation-adapters.md`
- `docs/adr/ADR-0008-io-off-means-no-ingest.md`
- `package.json`

Runtime/source:

- `src/main/main.js`
- `src/main/preload.js`
- `src/combat/combatLogParser.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessService.js`
- `src/combat/combatRollingWindow.js`
- `src/combat/combatWitnessBridge.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/liveIoGate.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/zKillSystemContextClient.js`
- `src/passive/esiSystemActivityClient.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/threat/threatIntelTargetResolver.js`
- `src/threat/clipboardAcquisitionService.js`
- `src/threat/clipboardAcquisitionGate.js`
- `src/renderer/app.js`

## Current-State Readback

Repo-verified facts:

- `workspace/current.md` is idle after accepted M12I ADR-0008 I/O authority reconciliation.
- No active Dev runway is open.
- M12 remains the active/gated envelope for live/manual validation and tactical calibration.
- M16 is closed/parked as future body-to-adapter readiness direction, not active implementation authority.
- ADR-0003 says AURA-Sense must own its own presentation adapters.
- ADR-0008 says I/O off means Sense is not allowed to ingest.
- Renderer boundary doctrine says renderer presents backend-owned state and must not own ingest, provider calls, parser behavior, computation, or telemetry truth.

Audit conclusion:

A Sense-owned adapter can begin from current bridge output without inventing meaning if it preserves lane namespace, source/basis/freshness slots, and authority state. Passive Telemetry and Clipboard Acquisition are the cleanest first proof candidates. Threat Intel is traceable but needs scoped-sample and freshness care. Combat Witness is structurally traceable but higher-risk because observed metrics can be overclaimed if adapter copy loses rolling/recent/log-derived context.

## Lane Trace Table

| Lane | Ingest | Transformation | State Owner | Bridge / Preload / Service Output | Adapter-Relevant Fields | Field Classes | Risks / Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Combat Witness | `EveGamelogWatcher` reads admitted gamelog appends; `parseEveLogLine` emits normalized `navigation.jump`, `combat.damage`, and `combat.miss`; `combatWitnessRuntime.observeEvent` enforces runtime ingest authority. | `CombatWitnessService` and `CombatRollingWindow` compute 5s/15s/30s rolling windows, bounded event stream, freshness, source/weapon counts, spike summaries, and repair balance over admitted events. | `combatWitnessRuntime` owns ingest authority/watcher status; `CombatWitnessService` owns snapshots and computation. | `window.auraCombatWitness.getSnapshot()`, `window.auraCombatWitness.subscribeSnapshots()`, IPC `aura:combat-witness:*`; service commands `combat.witness.status/start/stop`. | `kind`, `observedAt`, `windows`, `eventStream`, `freshness`, `operational.watcher`. | Domain fact, derived computation, state marker, freshness/source/basis slot, warning/gap slot, diagnostic-ish watcher state. | Must remain log-derived, recent, and not ship state. `balance`, spike fields, source labels, and weapon labels are observed computations, not survival claims or complete combat truth. |
| Passive Telemetry | Admitted `navigation.jump` events flow from Combat runtime observers to `passiveTelemetryService.observeEvent`; provider refresh is live-gate checked. | Local/static system resolver, scoped ESI activity client, scoped zKill system-context client, freshness expiry, partial/capped/degraded/blocked state computation. | `passiveTelemetryService`. | `window.auraPassiveTelemetry.getSnapshot()`, `window.auraPassiveTelemetry.subscribeSnapshots()`, IPC `aura:passive-telemetry:*`; service commands `passive.telemetry.snapshot/refresh/live-io.*`. | `kind`, `observedAt`, `currentSystem`, `zkill`, `activity`, `gate`, `freshness`, `status`, `message`, `failure`. | Domain fact, source/basis slot, freshness slot, warning/gap slot, state marker, diagnostic/failure slot. | Best state-envelope proof candidate. Adapter must preserve current-system context and must not imply background Threat Intel or complete awareness. |
| Threat Intel | Deliberate scan via renderer/service request or Clipboard Acquisition result; no scan on focus alone. | Request normalization, target resolution, live I/O gate check, scoped zKill ref normalization, partial/capped/failure status. | `threatIntelService`. | `window.auraThreatIntel.getSnapshot()`, `window.auraThreatIntel.scan()`, service commands `threat.intel.snapshot/scan/live-io.*`. | `kind`, `observedAt`, `request`, `target`, `gate`, `zkill`, `freshness`, `status`, `message`, `failure`. | Deliberate request fact, resolved-target fact, provider sample basis, freshness/source slot, warning/gap slot, state marker. | Must remain operator-initiated scoped inspection. `zkill.refs` are provider artifacts and must not become complete tactical intelligence. |
| Clipboard Acquisition | Explicit `Control+\`, focused/windowed arm/capture, or service path; service and shortcut paths are gated by Threat live I/O before clipboard reads. | Short listening window, immediate valid-target capture where allowed, unchanged-content rejection, fingerprint-only duplicate suppression, seal/cooldown lifecycle. | `clipboardAcquisitionService`; gate wrapper in `clipboardAcquisitionGate`; shortcut orchestration in `src/main/main.js`. | `window.auraThreatIntel.getClipboardState()`, `armClipboard()`, `captureClipboard()`, `cancelClipboard()`, `getShortcutStatus()`, `subscribeClipboardSnapshots()`; service commands `threat.clipboard.*`. | `kind`, `state`, `message`, `reason`, `listeningUntilMs`, `cooldownUntilMs`, `lastCapture.result`. | Authority lifecycle state, warning/gap slot, display timing hint, optional linked scan result. | Best authority-window proof candidate. `lastCapture.targetText` is transient/sensitive and should not become durable or adapter-general input. |

## Adapter Field Classification

| Field Group | Class | Safe Adapter Use |
| --- | --- | --- |
| Snapshot `kind` values such as `combat.witness.snapshot`, `passive.telemetry.snapshot`, `threat.intel.snapshot`, `clipboard.acquisition.snapshot` | Domain/source identity | Map as lane identity. Preserve Sense meaning and do not rename from Lab terms. |
| `status`, `state`, `message`, `reason` | State marker and warning/gap slot | Safe only with lane namespace. `blocked`, `stale`, `empty`, and `degraded` are lane-specific meanings. |
| `observedAt`, `eventTime`, `fetchedAt`, `freshness.*`, cache age fields | Freshness/source/basis slot | Safe if the adapter distinguishes observed log time from provider fetch time and display render time. |
| Combat `windows.*.damage`, `windows.*.repair`, `windows.*.balance` | Derived computation | Safe with "observed", "recent", "rolling window", and "log-derived" context. Unsafe as survival/tank/ship-state truth. |
| Combat `eventStream`, source/target/weapon counts, spike summaries | Domain observation and volatile detail | Safe for compact observed labels. Not safe as history, evidence, or complete actor truth. |
| Combat `operational.watcher` | Diagnostic / source availability / warning slot | Safe as source availability, not tactical meaning. |
| Passive `currentSystem` | Domain fact from local observation | Safe as observed current-system context. |
| Passive `zkill` and `activity` | Provider basis and uncertainty slot | Safe if sample/cap/partial/cache/failure stay visible. |
| Passive `gate` and `failure` | Authority state and warning/gap slot | Safe as ingest/provider authority and failure metadata. |
| Threat `request` and `target` | Deliberate request and resolution fact | Safe if operator-initiated scan basis remains visible. |
| Threat `zkill` counts/cap/partial fields | Provider sample basis | Safe for scoped sample. Unsafe as complete intelligence or full coverage. |
| Threat `zkill.refs` | Provider artifact | Do not map by default. If later used, keep as diagnostic/detail-only references. |
| Clipboard `state`, `message`, `reason`, timers | Authority lifecycle and display timing hint | Safe for authority-window proof. Timers are display/lifecycle aids, not domain facts. |
| Clipboard `lastCapture.targetText` | Sensitive transient input | Do not map as adapter-general field. Use only for immediate target echo under explicit UI need. |
| Renderer helper labels/classes | Display hint | Evidence of current UI treatment only. Do not treat as bridge contract authority. |
| Service registry classifications and diagnostics | Internal-only / diagnostic | Do not map to presentation head except through a deliberate diagnostics surface. |

## Lane Separation Findings

Repo-verified facts:

- Combat Witness snapshots are produced from admitted parser events and rolling computation in backend services.
- Passive Telemetry consumes admitted `navigation.jump` events through the Combat runtime observer path and does not depend on Clipboard Acquisition or Threat scan state.
- Threat Intel scan flow is deliberate through `threat.intel.scan` or Clipboard Acquisition capture.
- Clipboard Acquisition is an I/O-gated permission workflow with bounded listening/cooldown behavior and fingerprint-only duplicate suppression.
- Renderer uses bridge/preload APIs and service calls; it does not directly parse logs, read files, or call zKill/ESI.

Finding:

Lane separation is currently strong enough for an adapter proof if the adapter preserves lane identity on every mapped state and does not collapse Passive zKill context with Threat zKill inspection.

## State Honesty Findings

Current distinguishable states:

- Combat Witness: `recent`, `stale`, `empty`, `blocked`, `degraded`, `unavailable`; watcher state lives under `operational.watcher`.
- Passive Telemetry: `fresh`, `partial`, `stale`, `blocked`, `degraded`, `unavailable`; `capped` is represented through `zkill.capped`.
- Threat Intel: `empty`, `blocked`, `unresolved`, `ambiguous`, `unsupported`, `failed`, `partial`, `succeeded`, and transient `pending`.
- Clipboard Acquisition: `idle`, `listening`, `cooldown`, `blocked`.

ADR-0008 caution:

Current visible language still mixes "Live IO blocked", "IO Off", and "gamelog ingest is blocked". This is acceptable as current bridge behavior, but a future adapter should preserve the broader accepted meaning: I/O off means ingest is not allowed. It must not present authority-off as provider failure, no observation, or missing truth.

## Adapter Contract Gaps

1. There is no single neutral adapter envelope for `lane`, `source`, `basis`, `freshness`, `certainty`, `warning`, and `gap`.
2. `blocked` and "Live IO blocked" require lane context to be safe under ADR-0008.
3. Threat Intel `freshness` is thin; scan recency mostly lives in `observedAt` and provider recency under `zkill.fetchedAt`.
4. Combat Witness exposes useful rolling metrics but not an explicit certainty/calibration slot.
5. Renderer labels are useful proof of current presentation, but they are not adapter contract fields.
6. Clipboard `lastCapture` mixes transient target text and scan result. A future adapter should split lifecycle state from target echo/result.
7. Provider sample refs and diagnostics need an explicit "detail/diagnostic only" decision before any adapter maps them.

## Do-Not-Map / Internal-Only List

Do not map by default:

- private/operator paths
- raw gamelog lines
- raw clipboard content or durable target text history
- `rawLineHash` as interface meaning
- zKill `refs` as tactical truth
- provider request logs
- raw provider bodies
- service registry internals
- task classifications
- polling timers as product semantics
- shortcut registration plumbing beyond explicit availability/status
- CSS classes and test selectors
- renderer-only helper labels as bridge authority
- `seed.readiness` as product doctrine
- Lab slim/lab-term as Sense internal or Project -> Bridge authority
- Atlas `Evidence`, `Discovery`, `Watch`, `Assessment`, or durable storage semantics

## Verification Commands Available But Not Run

No verification commands were run for this read-only audit.

Available relevant commands:

```powershell
npm.cmd run verify:all
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:passive-telemetry
npm.cmd run verify:threat-intel
npm.cmd run verify:clipboard-race
npm.cmd run verify:operator-io-gates
npm.cmd run verify:combat-runtime
```

Live/manual commands remain out of scope and require a future active packet plus explicit Human authorization.

## Smallest Safe Proof Path Recommendation

Recommended first proof: Passive Telemetry, if the goal is state-envelope pressure.

Why:

- it has the richest current state matrix
- source/basis/freshness/warning slots are already present
- it exercises `fresh`, `stale`, `partial`, `capped`, `blocked`, `degraded`, and `no observation`
- it can prove adapter discipline without live/manual I/O or Lab face adoption

Alternate first proof: Clipboard Acquisition, if the goal is authority-window proof.

Why:

- it is smaller
- it directly tests permission-action semantics
- it proves "not clipboard monitoring" if `lastCapture.targetText` is excluded from adapter-general mapping

Defer Combat Witness adapter proof until a lower-risk lane proves the adapter envelope. Combat is structurally ready to trace, but observed metrics and repair balance need strong copy/field guardrails to avoid overclaiming.

## Acceptance Criteria Check

- Names concrete files/modules for every traced lane: met.
- Separates repo-verified facts from recommendations: met.
- Identifies whether at least one lane is ready for adapter proof: met; Passive Telemetry and Clipboard Acquisition are ready candidates under scoped proof conditions.
- Preserves Sense-owned meaning and Project -> Bridge authority: met.
- Preserves renderer boundary rules: met.
- Preserves ADR-0008: met.
- Does not turn M16 parked context into active implementation work: met.
- Does not require Lab, Atlas, live/manual I/O, or presentation adoption: met.

## Risks, Blockers, And Human Decisions Needed

Risks:

- A generic adapter could flatten lane-specific `blocked`, `empty`, `stale`, or `degraded` into ambiguous global states.
- Passive and Threat both use zKill-backed samples; a downstream consumer could merge their meanings unless lane identity is explicit.
- Combat metrics could be read as ship state or survival truth if observed/recent/calibration context is dropped.
- Clipboard `lastCapture.targetText` could become accidental clipboard history if mapped durably.

Human / Overseer decisions needed before a future implementation packet:

- choose Passive Telemetry or Clipboard Acquisition as the first adapter proof lane
- decide whether future adapter copy should normalize current "Live IO blocked" wording toward broader ADR-0008 "I/O off / ingest blocked" language
- decide whether Combat needs explicit certainty/calibration fields before adapter proof
- decide whether `Gateway`, `Pulling`, `Cooldown`, and `Live IO blocked` are preserve-exact or adapter-translatable
- decide whether adapter proof should create a neutral envelope doc before code

## Handoff

This is an advisory workshop artifact only. It does not update `workspace/current.md`, create a Dev runway, modify contracts, or authorize M16 implementation.
