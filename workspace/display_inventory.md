# Display Inventory

Status: Source-project display inventory scaffold
Date: 2026-05-25
Owner: AURA-Sense Overseer

## Purpose

This inventory is the upstream side of the Sense `request_display` workflow.

It helps AURA-Sense identify what is currently user-facing, where it appears, what source data it reflects, what role it plays, and whether it is a candidate for a later scoped `request_display` entry to Aura Lab.

This is orchestration advisory only. It is not implementation work, UI redesign, terminology rename work, Lab adoption, a Dev runway, or a queue of active Lab tasks.

## Files Reviewed

Project authority and coordination:

- `AGENTS.md`
- `workspace/current.md`
- `workspace/overview.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/request_display.md`
- `workspace/display-request-workflow-hardening-contract.md`

Current visible/presentation sources:

- `docs/current-state/current-implementation.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/features/vision.md`
- `docs/features/clipboard-acquisition.md`
- `src/renderer/index.html`
- `src/renderer/app.js`

Terminology/audit review inputs:

- `workspace/archive/README.md`
- `workspace/archive/SenseTerminologyStateBridgeAudit-2026-05-24.md`
- `workspace/OverseerHS05-sense-terminology-alignment-review.md`
- `workspace/SYSADHS01-protected-terms-sniffer-tune.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\Sense-Terminology-Boundary-Requirements-2026-05-24.md`

Lab request workflow:

- `F:\Projects\AURA- Lab\workspace\request_display.md`
- `F:\Projects\AURA- Lab\workspace\display-request-cooperation-contract.md`

## Authority Boundary

Sense owns:

- internal -> Bridge meaning
- source terms
- data meaning
- lane and state semantics
- runtime behavior
- final adoption

Lab may:

- compare Bridge -> Interface display methods
- suggest grouping, reveal/collapse, density, motion, or display patterns
- map scoped problems to Lab slots, display types, and material sets
- identify presentation risks and missing state/field needs

Lab must preserve Sense meaning. Lab does not own Sense terms, backend behavior, contracts, payloads, implementation, or adoption.

## How This Feeds `request_display`

Use this inventory before drafting a `request_display` entry.

1. Identify a user-facing surface or field here.
2. Confirm its Sense-owned meaning, source data, role, and state/freshness/basis needs.
3. Mark it `needs-scope` or `request-ready` only after the display problem is bounded.
4. Compile a separate `request_display` ask only when Lab comparison would help.
5. Keep active Lab review to five Sense requests or fewer unless the Human or Sense Overseer explicitly overrides the cap.

Rows in this file are reasoning-layer inventory. A row becomes a Lab request only after Sense writes a scoped `request_display` artifact and submits the compiled ask.

## Audit And Terminology Classification

| File | Classification | Inventory Use |
| --- | --- | --- |
| `AGENTS.md` | Accepted local workflow authority | Source/Lab ownership split, critical-term reading rules, no hidden task queues. |
| `workspace/current.md` | Current project truth | Sense is idle after accepted Passive Telemetry Instrument Band; no Dev runway is open. |
| `workspace/overview.md` | Current project overview | Sense is a transient tactical viewport, distinct from Atlas historical proof storage. |
| `workspace/critical/critical-terms.md` | Sense-local term authority pending broader review | Preserve lane names and blocked/partial/capped/no-scan distinctions. |
| `workspace/critical/critical-assets.md` | Sense-local handling reference | Identifies renderer, bridge, lane, live-IO, and diagnostics assets to avoid casual change. |
| `workspace/display-request-workflow-hardening-contract.md` | Active Sense-local advisory workflow contract | Defines source -> Lab -> source direction and request strength levels. |
| `workspace/request_display.md` | Active Sense-local pointer | Shows how Sense should frame later Lab requests. |
| `workspace/archive/SenseTerminologyStateBridgeAudit-2026-05-24.md` | Archived advisory audit awaiting authority | Requirements/history input for why observed, sample, blocked, stale, partial, and latest-scan boundaries matter. Not active work. |
| `workspace/OverseerHS05-sense-terminology-alignment-review.md` | Advisory alignment input, not Sense authority | Preserve-exact and Lab-translatable recommendations for future review. |
| `workspace/SYSADHS01-protected-terms-sniffer-tune.md` | Completed tooling history/input | Shows the protected-term checker is warning-only and not a rename queue. |
| `F:\Projects\Docs\Aura-Project-Orchestration\terminology\Sense-Terminology-Boundary-Requirements-2026-05-24.md` | Project-specific advisory requirements input | Explains Sense terminology risks; not active Dev instruction unless accepted in a packet. |
| Cross-project synthesis/frequency records referenced by critical terms | Synthesis or diagnostic input | May inform risk awareness, but must not be treated as authority or an active queue. |

Terminology/audit conclusion:

- Accepted authority comes from current Sense workspace files and the accepted terminology ruleset.
- Project-specific advisory files can explain why a display boundary matters.
- Archived audit files are history/reference input only unless `workspace/current.md` reopens them.
- Sniffer output is warning-only review input, not a rewrite mandate.
- Frequency/synthesis records do not define product authority.

## Display-Role Taxonomy

Use these Sense-local roles when classifying inventory rows:

| Role | Meaning |
| --- | --- |
| `tactical-primary` | First-read operational state the operator may need under pressure. |
| `tactical-context` | Nearby context that supports the primary tactical read without overriding it. |
| `deliberate-inspection` | Operator-initiated inspection or search workflow. |
| `acquisition-control` | Short visible input authority or capture workflow. |
| `authority-control` | Live IO, shortcut, bridge, or runtime authority visible to the operator. |
| `source-basis` | Source, sample, freshness, lookback, cap, or provider basis for a claim. |
| `uncertainty-state` | Blocked, stale, partial, capped, degraded, failed, unavailable, no-scan, or no-observation wording. |
| `diagnostic-support` | Review/detail/health data that supports trust but should not dominate the tactical face. |
| `setup-control` | Operator setup path such as gamelog folder or watcher start/stop. |
| `internal-hidden` | Implementation or bridge detail that should not become normal operator copy. |
| `lab-display-candidate` | A bounded presentation problem that may later benefit from Lab comparison. |

These roles are Sense-specific. Do not copy Atlas roles such as durable proof, discovery, or assessment into Sense unless a future Human decision changes Sense doctrine.

## Inventory Status Model

| Status | Meaning |
| --- | --- |
| `identified` | Visible surface or field has been captured in inventory. |
| `needs-scope` | Candidate needs a narrower display problem before any Lab request. |
| `request-ready` | Candidate is scoped enough to draft a `request_display` entry. |
| `submitted` | A scoped request has been sent to Lab. Counts toward active cap. |
| `active-review` | Lab or an assigned advisory role is reviewing the submitted ask. |
| `answered` | Lab response exists as advisory comparison, not adoption. |
| `discussion-needed` | Human/source-project discussion is needed for fitness, taste, flow, or action decision. |
| `parked` | Kept for later; not active Lab review. |
| `implementation-packet-ready` | Source-project discussion produced a stable action that may be written into `workspace/current.md`; Dev is still not authorized until current.md opens it. |
| `implemented` | A later Sense-local Dev packet implemented the accepted runway. |
| `deprecated` | Surface or field is no longer relevant. |

## Initial Extraction Candidates

These are likely current user-facing surfaces or fields. They are not active Lab tasks.

| ID | Surface / Field | Where Visible | Current User-Facing Copy | Data / Source | Display Role | Inventory Status | Lab Candidate? | Notes / Risks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sense.passive.instrument-band` | Passive Telemetry instrument band | Front glance strip | `Passive Telemetry`, `Current system`, `No observation`, kills, jumps, ratio | `passive.telemetry.snapshot`, current system, zKill sample, ESI activity | `tactical-context`, `source-basis`, `uncertainty-state` | `identified` | Later, yes | Accepted recent prototype. Keep Sense states distinct; do not import generic no-data/current labels. |
| `sense.passive.readout-state` | Passive readout state and basis | Front glance strip | `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, `Provider pending`, `No observation` | Passive snapshot status, freshness, provider metadata, live-IO gate | `uncertainty-state`, `source-basis` | `identified` | Later, yes | Strong candidate for pressure-test after more real use; preserve lane-specific meanings. |
| `sense.provider-pulse-row` | Passive and Threat provider pulse chips | Front glance strip | `Passive --`, `Threat --`, threat/passive sampled/blocked/partial labels | Passive and Threat provider/sample summaries | `source-basis`, `diagnostic-support` | `needs-scope` | Possible | Current `pulse` wording may imply live heartbeat; needs scoped question before Lab. |
| `sense.front-context-tile` | Configurable tactical context tile | Front left stack | `Observed Weapon`, `Observed Source`, `Repair Balance`, `Weapon`, `Source`, `Balance` | Combat Witness 15s window source/weapon/balance | `tactical-context` | `identified` | Possible | User-facing labels should keep `Observed` where source certainty is limited. |
| `sense.observed-source-chip` | Observed Source utility chip | Front left stack | `Observed Source`, `--` | Combat Witness observed incoming source label/count | `tactical-context` | `identified` | Possible | Must not become actor identity, hostile label, or durable tracking. |
| `sense.combat-pressure-face` | Combat Witness first-read face | Main surface | `Combat Witness`, `15s rolling observed window`, `Observed balance`, `Incoming DPS`, `Repair HPS` | `combat.witness.snapshot`, rolling 15s damage/repair windows | `tactical-primary`, `uncertainty-state` | `identified` | Later, maybe | Preserve observed-only repair balance; do not imply survival, safety, or complete fight state. |
| `sense.combat-event-stream` | Recent combat event list | Diagnostics panel | Event labels such as incoming damage/repair/miss | Bounded Combat Witness event stream | `diagnostic-support` | `identified` | Parked | Useful trust detail, not a primary display candidate until scoped. |
| `sense.threat-drawer-summary` | Threat Intel back-page summary | Collapsible drawer summary | `Threat Intel`, Gateway chip, `Back page` | Threat Intel snapshot and drawer state | `deliberate-inspection`, `authority-control` | `identified` | Possible | Keep Threat Intel deliberate and scoped; do not make it background monitoring. |
| `sense.threat-acquisition-bar` | Threat search/display bar | Threat drawer | `Search / Display`, `Idle`, target text, manual target placeholder | Manual input, target kind, Threat snapshot | `deliberate-inspection`, `acquisition-control` | `needs-scope` | Yes | Good future Lab request if the display/search wording needs comparison. |
| `sense.clipboard-window` | Clipboard Acquisition widget | Threat acquisition bar | `Pulling`, `Listening`, `Cooldown`, `Idle`, key chips | Clipboard Acquisition snapshot, shortcut status, live-IO state | `acquisition-control`, `authority-control`, `uncertainty-state` | `submitted` | Active ask | HS16 compiled and submitted to Lab as `workspace/RequestDisplayHS16-clipboard-window.md`; safety-critical, must remain a short visible authority window, not background clipboard monitoring. |
| `sense.gateway-marker` | Gateway marker and slash key affordance | Threat drawer and summary | `Gateway`, `\`, `Ctrl+\` message | Threat drawer state, shortcut status | `authority-control`, `deliberate-inspection` | `needs-scope` | Possible | Sense-owned unless Human/Sense Overseer allows translation; keep separate from live IO gate. |
| `sense.target-kind-selector` | Threat target type selector | Threat drawer | `Pilot`, `System`, `Corp`, `Al`, `Wrong type` | Threat target kind state and resolver feedback | `deliberate-inspection`, `uncertainty-state` | `identified` | Possible | Needs preserve/translate decision for abbreviations and wrong-type feedback. |
| `sense.threat-latest-scan-review` | Latest Threat Intel scan review surface | Threat drawer | `Target`, `Status`, `Target type`, `Basis`, `Sample`, `State`, latest-scan persistence message | `threat.intel.snapshot`, target resolution, zKill sample metadata | `deliberate-inspection`, `source-basis`, `uncertainty-state` | `needs-scope` | Yes | Current visible wording has history/storage flavor; inventory treats it as latest scan review only. |
| `sense.threat-pulse` | zKill one-hour pulse visual | Threat drawer | `zKill one hour pulse` | Threat zKill sample count/lookback | `source-basis`, `diagnostic-support` | `needs-scope` | Possible | Pulse can imply live continuity; needs basis/freshness framing if revisited. |
| `sense.live-io-control` | Live IO authority control | Top chrome and diagnostics | `IO`, `Enable IO authority`, `On - network and clipboard enabled`, `Off - network and clipboard blocked` | `runtime.live-io.snapshot`, gate policy | `authority-control`, `uncertainty-state` | `identified` | Possible | Must stay backend-owned authority; do not collapse with provider failure or no scan. |
| `sense.log-watcher-indicator` | Log watcher status | Top chrome and diagnostics | `Log Watcher`, `Watching`, `Stopped`, `Blocked`, `Degraded`, `Unavailable` | Combat watcher status | `authority-control`, `diagnostic-support` | `identified` | Possible | `Watcher` is allowed only for gamelog watcher; do not bleed into clipboard or Threat Intel. |
| `sense.diagnostics-panel` | Diagnostics review surface | Diagnostics overlay | `Diagnostics`, `System State`, `Quiet`, `Return` | Runtime diagnostics snapshot and lane summaries | `diagnostic-support` | `identified` | Later, maybe | Diagnostic detail can be visually demoted but must preserve trust-critical source/freshness/gap facts. |
| `sense.log-setup-controls` | Gamelog folder setup | Diagnostics panel | `Log Setup`, `Checking`, `Browse`, `Start`, `Stop`, folder placeholder | Runtime settings, watcher service | `setup-control`, `authority-control` | `identified` | Parked | Setup path is not a Lab display priority unless operator friction appears. |
| `sense.passive-diagnostics` | Passive diagnostics grid fields | Diagnostics panel | `Passive State`, `Passive Sample`, `Passive Activity`, `Passive Freshness`, `Passive Age`, `Passive Basis`, `Passive Gap`, `Passive Pulse` | Passive snapshot and provider metadata | `diagnostic-support`, `source-basis`, `uncertainty-state` | `identified` | Possible | Useful as input for future Passive detail reveal; not a request by itself. |
| `sense.threat-diagnostics` | Threat diagnostics grid fields | Diagnostics panel | `Threat Provider`, `Threat Sample`, `Threat Basis`, `Threat Pulse`, `Scan State` | Threat snapshot and provider metadata | `diagnostic-support`, `source-basis`, `uncertainty-state` | `identified` | Possible | Keep deliberate scan and sample basis visible; do not imply complete coverage. |
| `sense.runtime-settings-state` | Runtime settings status | Diagnostics panel | `Settings`, `Loading`, `Ready`, `Recovered`, `Degraded`, `Missing` | Runtime settings snapshot | `diagnostic-support`, `setup-control` | `identified` | Parked | Avoid tactical-readiness implication; belongs in diagnostics/setup. |
| `sense.shortcut-message` | Shortcut guidance | Diagnostics panel / threat flow | `Ctrl+\ opens a 3 second clipboard scan window, then listening stops.` | Shortcut registration status and Clipboard Acquisition lifecycle | `authority-control`, `acquisition-control` | `needs-scope` | Possible | Must match runtime shortcut behavior; not a Lab display sample yet. |

## Request Response Tracking

This inventory currently has one compiled Sense `request_display` ask submitted to Lab.

Use this table only for compiled asks and Lab responses. Lab response is advisory comparison; Human/source-project discussion decides fitness before any resting/action record is needed.

| Request ID | Source Inventory ID | Submitted Date | Lab Response Record | Answered Date | Candidate Methods | Discussion / Resting State | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `sense.clipboard-window` | `sense.clipboard-window` | 2026-05-25 | pending Lab response | _n/a_ | pending | pending Lab advisory comparison, then Human/Sense discussion | Submitted via `workspace/RequestDisplayHS16-clipboard-window.md`; no adoption or Dev authorization. |

## Request Requirement Capture

Use this section to qualify candidate `request_display` intent before anything is submitted to Lab.

The durable source reference is:

`docs/current-state/display-pipeline-inventory.md`

Each candidate should answer:

- What display problem is Sense asking Lab to compare?
- Which Sense-owned source terms and meanings must survive?
- Which fields, states, freshness, basis, missing-state notes, or caution text are required?
- What must not be implied?
- What would Sense need to discuss before any resting state or scoped action?
- What verification would be needed if a later Sense-local implementation packet opens?

| Candidate ID | Source Inventory ID | Current Status | Request Strength | Display Problem To Scope | Source Terms To Preserve | Required State / Basis Slots | Must Not Imply | Sense Decision Needed | Verification If Implemented |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sense.threat-latest-scan-review` | `sense.threat-latest-scan-review` | `needs-scope` | `comparative` | Present the latest Threat Intel scan review without storage/history flavor. | Threat Intel; No scan; Scoped sample; Partial sample; Capped sample; Live IO blocked. | target, target type, source/provider, lookback, sample count, cap, partial, blocked, failed, stale/no-scan reason. | Historical proof, durable storage, broad intelligence, complete provider view. | Whether Sense wants Lab comparison for latest-scan review wording/density. | Renderer shell and Electron smoke for state labels; protected-term check. |
| `sense.clipboard-window` | `sense.clipboard-window` | `submitted` | `pressure-test` | Preserve the short visible clipboard authority window while improving boundedness and shortcut feedback. | Clipboard Acquisition; Pulling; Listening; Cooldown. | current lifecycle state, shortcut status, live IO block, capture result, cooldown/timeout/rejection reason. | Background clipboard monitoring, persistent listener mode, hidden scan. | Await Lab advisory comparison, then Human/Sense discussion on fitness and whether `Pulling`/`Listening`/`Cooldown` are preserve-exact or Lab-translatable. | Clipboard race verification, renderer shell/smoke if UI changes, protected-term check. |
| `sense.provider-pulse-row` | `sense.provider-pulse-row` | `needs-scope` | `formative` or `comparative` | Compare calmer provider/sample status display against current pulse wording. | Passive Telemetry; Threat Intel; Partial sample; Capped sample; Live IO blocked. | source/provider, freshness/age, sample count, cap, partial, blocked, failed/degraded, no observation/no scan. | Continuous live heartbeat, complete provider view, provider truth. | Whether pulse remains user-facing or becomes source/sample state wording. | Renderer shell/smoke for Passive and Threat provider states; protected-term check. |
| `sense.passive.state-basis` | `sense.passive.state-basis` / `sense.passive-diagnostics` | `needs-scope` | `pressure-test` | Reduce first-read density while preserving Passive state, freshness, source, cap, partial, blocked, and degraded meaning. | Passive Telemetry; Fresh context; Stale context; Partial sample; Capped sample; Live IO blocked; No observation. | current system, state, source basis, activity, sample count, age/freshness, cap, partial, blocked, degraded, no observation. | Generic absence/unavailable/current wording that hides known state; background Threat Intel. | Whether Passive needs a dedicated detail reveal beyond diagnostics. | Passive telemetry verification, renderer shell/smoke, protected-term check. |
| `sense.threat-acquisition-bar` | `sense.threat-acquisition-bar` | `needs-scope` | `comparative` | Clarify manual and clipboard target acquisition without creating background-scan implication. | Threat Intel; target type; manual target; clipboard-acquired target; No scan. | input source, target text, target kind, resolver result, scan state, no-scan reason, blocked/failed/ambiguous/unresolved/unsupported. | Automatic target finding, hidden provider calls, target guessing, complete intelligence. | Whether search/display/acquisition grouping should be compared by Lab. | Threat Intel verification, clipboard race verification if affected, renderer shell/smoke, protected-term check. |

Rows other than `sense.clipboard-window` remain parked request-capture candidates. They are not active Lab requests and do not count toward the five-active-request cap.

## Likely First Request Candidates

These are not active requests. They are candidates to scope later:

1. `sense.threat-latest-scan-review`: compare ways to present latest-scan review without history/storage implication.
2. `sense.clipboard-window`: submitted as HS16 to pressure-test short visible clipboard authority states and shortcut feedback.
3. `sense.provider-pulse-row`: compare calmer source/sample status wording versus pulse wording.
4. `sense.passive.state-basis`: pressure-test Sense-owned Passive state/freshness/basis display after the accepted instrument band.
5. `sense.threat-acquisition-bar`: compare display/search/acquisition grouping for the back-page Threat Intel surface.

Keep the active Lab cap at five. Do not submit these automatically.

## Ownership And Terminology Risks

- Sense lane names and lane semantics must remain Sense-owned.
- `Live IO blocked`, provider failure, unavailable source, no scan, no observation, stale, partial, capped, and degraded must stay distinct.
- Combat Witness must remain recent local observation, not complete combat history or survival truth.
- Passive Telemetry must remain current-system context, not background Threat Intel.
- Threat Intel must remain deliberate scoped inspection, not complete intelligence or historical proof.
- Clipboard Acquisition must remain a short visible authority window, not clipboard monitoring.
- Lab vocabulary may help the interface, but must not become Sense bridge, backend, service, payload, or runtime terminology.
- Archived terminology/audit material explains risks but does not create active work.

## Verification

After creating or editing this inventory, run:

```powershell
npm.cmd run verify:protected-terms
```

This warning-only check is for review evidence. It must not rename Sense terms or update protected-word JSON automatically.
