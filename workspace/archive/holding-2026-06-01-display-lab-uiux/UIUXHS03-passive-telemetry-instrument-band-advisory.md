# UIUXHS03: Passive Telemetry Instrument Band Advisory

Status: Advisory only, not Sense authority
Scope note: UI/UX advisory, Sense-local, not implementation authority
Role: AURA-Sense UI/UX advisory worker
Date: 2026-05-25
Scope: Passive Telemetry presentation concept only

## Request Received

Produce a Sense-local UI/UX advisory for adapting Aura Lab's accepted M19 Instrument Status Band grammar into a Passive Telemetry instrument band.

Outcome already decided:

```txt
Adapt, do not adopt wholesale.
```

This artifact is advisory only. It does not implement code, rename contracts, create a durable bridge contract, edit Lab, or open a Dev runway. Any future implementation requires Human or Sense Overseer acceptance into `workspace/current.md`.

## 1. Files Reviewed

Sense authority and workspace:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/OverseerHS07-sense-m19-instrument-status-band-adoption-review.md`

Sense current-state, feature, and contract docs:

- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `package.json`

Sense renderer and Passive Telemetry source facts:

- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/liveIoGate.js`
- `src/main/preload.js`
- `scripts/verify-passive-telemetry.js`

Lab advisory input only:

- `F:\Projects\AURA- Lab\workspace\LabRemoteConsumerConformanceHS66.md`
- `F:\Projects\AURA- Lab\workspace\archive\cross-project-relay\SenseImportAdvisoryHS65-lab-presentation-adoption.md`
- `F:\Projects\AURA- Lab\docs\current-state\m19-instrument-status-band-current-state.md`
- `F:\Projects\AURA- Lab\workspace\DevHS68-instrument-status-band-prototype.md`
- `F:\Projects\AURA- Lab\workspace\OverseerHS71-m19-acceptance.md`

Role and terminology authority:

- `F:\Projects\Docs\Aura-Agent-Coordination\roles\common-role-contract.md`
- `F:\Projects\Docs\Aura-Agent-Coordination\roles\ui-ux\README.md`
- `F:\Projects\Docs\Aura-Agent-Coordination\roles\ui-ux\prompt.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\TerminologyAuthorityRuleset-2026-05-24.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\Sense-Terminology-Boundary-Requirements-2026-05-24.md`

## 2. Current Passive Telemetry Presentation Understanding

Passive Telemetry is the Sense lane for current-system context and low-frequency environmental awareness. It is not Threat Intel, not Atlas Evidence, not historical storage, and not complete system awareness.

The current renderer already presents Passive Telemetry in the compact tactical viewport:

- `#passive-system` shows the current system label.
- `#system-shipkills`, `#system-jumps`, and `#system-ratio` show compact activity signals.
- `#passive-readout-state` shows a Sense-owned state label.
- `#passive-readout-basis` shows provider/sample basis.
- `#passive-provider-pulse` shows a lane-specific provider/sample chip.
- Diagnostics expose Passive state, sample, activity, freshness, age, basis, gap, and pulse detail.

The current snapshot source is backend-owned `passive.telemetry.snapshot`, delivered through the Passive Telemetry bridge and `window.auraPassiveTelemetry`. The renderer presents existing snapshot fields; it must not compute provider truth, fetch live providers, or own telemetry history.

Current visible Sense labels in renderer logic include:

- `Fresh context`
- `Stale context`
- `Partial sample`
- `Capped sample`
- `Live IO blocked`
- `Degraded`
- `No observation`
- `Provider pending`

## 3. What Lab Grammar Is Safe To Adapt

Lab M19 is safe as presentation grammar only:

- compact band
- primary value/status
- state marker with text, not color alone
- basis/freshness line
- gaps/warnings marker
- compact detail reveal
- calm instrument-like visual density
- stable dimensions for overlay/narrow viewports
- diagnostic detail below the first glance

For Sense, these mechanics should become a Passive Telemetry presentation shape, not a Lab state model.

## 4. What Lab Grammar Must Be Rejected Or Translated

Do not import Lab M19 state labels as Sense enums or Passive Telemetry copy:

| Lab label | Sense treatment |
| --- | --- |
| `CURRENT` | Translate only to `Fresh context` when Passive snapshot freshness supports it. Avoid global-current certainty. |
| `UPDATING` | Do not import as a Passive state. If needed, use `Provider pending` only where existing fields support pending provider/sample behavior. |
| `AGED` | Translate to `Stale context`, preferably with lane/source age. |
| `PARTIAL` | Use `Partial sample`, not generic partial state. |
| `UNAVAILABLE` | Use lane-specific absence or impairment wording such as `No observation`, `Degraded`, or bridge unavailable, depending on existing fields. |
| `FALLBACK` | Do not import. Use `Static lookup` or `Local lookup` only when existing resolver/source fields support that basis. |
| `NO DATA` | Do not import. Use `No observation`, `No provider sample yet`, or other lane-specific absence language. |

Also reject or translate:

- Lab fixture semantics.
- Lab `fallback` review data.
- Lab source coverage as provider completeness.
- Any visual treatment that makes Passive Telemetry look like continuous Threat Intel.
- Any wording that implies durable evidence, historical memory, verified truth, or complete system awareness.

## 5. Proposed Passive Telemetry Instrument Band Structure

The Passive Telemetry band should be a compact support instrument inside the existing tactical viewport, likely replacing or consolidating the current Passive readout plus activity strip rather than adding a new large surface.

Closed band structure:

| Slot | Purpose | Preferred display |
| --- | --- | --- |
| Lane label | Anchor source meaning | `Passive Telemetry` |
| Primary value | The single first-glance subject | Current system label, or `No observation` when no system exists |
| State marker | Qualify the primary value | Sense-owned state label, text visible |
| Activity mini-values | Low-frequency context | Kills, jumps, ratio, kept visually secondary |
| Basis/freshness line | Explain what supports the display | zKill sample + ESI activity + Static lookup, with age when available |
| Gap/warning marker | Reveal trust limits | Partial, capped, blocked, degraded, stale, no provider sample |
| Detail reveal | Inspect secondary context | Existing diagnostics fields or a compact Passive detail drawer |

Primary moment:

```txt
Current system + Passive state
```

The user should understand within five seconds: "This is Passive Telemetry for the current system, and this is how fresh/limited/blocked it is."

## 6. State Treatment

| Sense state | First-glance treatment | Basis/freshness treatment | Gap/warning treatment |
| --- | --- | --- | --- |
| `Fresh context` | Calm ready state. Current system remains primary. | Show provider/sample basis and recent age when available. | No warning unless capped/partial also exists. |
| `Stale context` | Warning state, not failure. Keep previous system visible if snapshot has it. | Show age and stale wording together. | Use `Stale context`; if partial metadata remains, use `Partial sample is stale`. |
| `Partial sample` | Warning state. Do not make counts look complete. | Keep provider/sample count visible. | Show `Partial sample` near sample count and detail reason/failure count when available. |
| `Capped sample` | Warning state. Counts are bounded display/sample context. | Show sample count and cap marker. | Show `Capped sample`; avoid language like "all kills". |
| `Live IO blocked` | Authority-block state. Should be more visually explicit than stale. | Basis becomes `Live IO blocked`; do not show as provider failure. | Show backend gate message if available. |
| `Degraded` | Impairment state. Distinct from blocked and stale. | Preserve any source/basis still present, but mark impairment. | Show sanitized failure message/code in detail; avoid raw provider payloads. |
| `No observation` | Absence state. Quiet but legible. | `No provider sample yet` or `No passive provider context`, depending on fields. | Avoid generic `NO DATA`; show lane-specific absence. |
| `Provider pending` | Interim state if applicable. | Use only when existing snapshot/render logic supports current system with no provider sample yet. | Keep calm; do not imply provider activity is continuous or guaranteed. |

Visual priority:

- Fresh is calm, not celebratory.
- Stale, partial, capped, and pending are caution states.
- Blocked and degraded are authority/impairment states and need stronger contrast.
- No observation is quiet absence, not an error.

## 7. Field-To-Display Mapping Assumptions

Use existing `passive.telemetry.snapshot` fields only.

| Snapshot field | Display use | Notes |
| --- | --- | --- |
| `kind` | Diagnostics/source confirmation only | Do not rename or surface as product copy unless needed for detail. |
| `observedAt` | Detail freshness aid | Secondary to `freshness.cacheAgeMs` for provider age. |
| `currentSystem.label` | Primary value | Use `No observation` only when absent. |
| `currentSystem.systemId` | Detail only | Useful for diagnostics, not first glance. |
| `currentSystem.resolved` | Detail or gap | Avoid implying provider failure if local resolution failed. |
| `currentSystem.resolverSource` | Basis | `Static lookup` only when the field supports `local-static`. |
| `status` | State marker | Map through Sense labels only. |
| `message` | Detail/gap copy | Use if it preserves state meaning and does not overclaim. |
| `failure.code` / `failure.message` | Degraded detail | Sanitized detail only; first glance remains `Degraded`. |
| `freshness.status` | Fresh/stale qualifier | Do not translate to Lab `CURRENT` or `AGED`. |
| `freshness.cacheAgeMs` | Age line | Use compact age such as `45s old`, `3m old`. |
| `freshness.freshnessMs` | Detail threshold | Detail only unless a future UX pass needs threshold copy. |
| `zkill.sampleCount` | Sample basis | Pair with partial/capped markers where present. |
| `zkill.pastSeconds` | Detail/basis | If shown, frame as lookback/sample scope, not complete coverage. |
| `zkill.capped` | Warning marker | `Capped sample`. |
| `zkill.partial` | Warning marker | `Partial sample`. |
| `zkill.failureCount` | Detail warning | Keep out of primary band unless high value for operator trust. |
| `activity.shipKills` | Activity mini-value | Label as kills/system activity, not threat verdict. |
| `activity.podKills` | Detail value | Secondary unless future Human direction promotes it. |
| `activity.npcKills` | Detail value | Secondary diagnostics/context. |
| `activity.jumps` | Activity mini-value | Pair with kills/ratio. |
| `activity.partial` | Warning marker | `Partial sample`. |
| `activity.failureCount` | Detail warning | Secondary diagnostic. |
| `activity.cache.state` | Basis/detail | Present as cache/source behavior, not a primary Passive state unless Sense accepts it. |
| `activity.cache.cacheAgeMs` | Detail age | Use only if clearer than `freshness.cacheAgeMs`. |
| `activity.cache.etag` | Diagnostics only | Do not surface in the operator band. |
| `gate.state` / `gate.enabled` | Authority state | Supports `Live IO blocked` and IO-on/off detail. |
| `gate.message` | Detail or warning | Preserve authority meaning. |

Source-meaning concern for Sense Overseer/Human:

The current renderer has a derived `cached` visual state path for Passive activity cache behavior. `Cached activity` can be useful as detail/basis language, but it should not become a new Passive state label unless Sense accepts that meaning. For first glance, cache behavior should normally sit under basis/freshness.

## 8. Basis/Freshness/Sample/Cap/Gap/Warning Language

Preferred first-glance language:

- `Fresh context`
- `Stale context`
- `Partial sample`
- `Capped sample`
- `Live IO blocked`
- `Degraded`
- `No observation`
- `Provider pending`
- `No provider sample yet`
- `Static lookup`
- `zKill 3 + ESI 2 / 18`
- `45s old`

Allowed with context:

- `Cached activity`, detail or basis only.
- `Local lookup`, only if an existing field supports that source meaning.
- `Bridge unavailable`, only when the Passive bridge itself is unavailable.

Avoid:

- `CURRENT`
- `UPDATING`
- `AGED`
- `UNAVAILABLE`
- `FALLBACK`
- `NO DATA`
- `Verified`
- `Complete`
- `All clear`
- `System threat`
- `Evidence`
- `Intel`
- `Monitoring`
- `History`

Copy rule:

```txt
State copy should describe the lane condition, not the world.
```

For example, prefer `Fresh context from scoped provider sample` over `Current system truth`.

## 9. Detail Reveal Behavior

The detail reveal should be compact and inspectable without becoming a second Passive page. It may reuse the existing diagnostics panel or become a small Passive-only reveal if Human/Overseer later wants one.

Recommended detail contents:

- Passive state
- current system label and system ID
- resolver source and resolved flag
- provider/sample basis
- freshness status and cache age
- zKill sample count, lookback, capped, partial, failure count
- ESI ship kills, pod kills, NPC kills, jumps, partial, failure count
- ESI cache state and age
- live IO gate state/message
- sanitized failure code/message
- backend snapshot message

Do not include:

- raw provider payloads
- private logs
- API trace noise
- historical route or evidence storage
- Threat Intel scan results
- Atlas-style provenance language

Interaction:

- Closed by default.
- One deliberate reveal affordance.
- Closing returns to the same compact band state.
- Detail should explain first-glance warning markers, not introduce contradictory state labels.

## 10. Narrow/Overlay Behavior

The band must respect the existing tactical viewport:

- Combat Witness remains the primary face.
- Passive Telemetry stays compact support in the glance strip or equivalent compact area.
- The current system label should truncate cleanly before activity numbers collapse.
- State marker text must remain visible; color alone is not enough.
- On narrow widths, stack basis under primary value rather than shrinking text into unreadability.
- Activity mini-values should keep stable widths so changing numbers do not shift the band.
- Gap/warning marker should wrap or truncate with a title/detail reveal, not overlap the primary value.
- Detail reveal should not cover the main Combat Witness pressure read unless explicitly opened.
- Reduced-motion behavior should be preserved.

Suggested narrow hierarchy:

```txt
Passive Telemetry | State
Current system
Kills | Jumps | Ratio
Basis/freshness
Gap/warning
```

## 11. What Must Stay Sense-Specific

These terms and meanings stay Sense-owned:

- `Passive Telemetry`
- `passive.telemetry.snapshot`
- `auraPassiveTelemetry`
- Passive Telemetry bridge IPC channels
- `Fresh context`
- `Stale context`
- `Partial sample`
- `Capped sample`
- `Live IO blocked`
- `Degraded`
- `No observation`
- `Provider pending`, if used from existing renderer/snapshot support
- provider/sample/live-IO meaning
- current-system context
- backend-owned freshness, sample, gate, and failure truth

The renderer may improve presentation hierarchy, but it must not redefine these meanings.

## 12. Risks And Stop Conditions

Risks:

- Lab state labels could drift into Sense as accidental enums.
- `Fresh context` could be read as complete current system truth.
- `Capped sample` or `Partial sample` could be visually too quiet beside numeric activity.
- `Live IO blocked` could be softened into generic offline/unavailable language.
- `No observation` could be collapsed into provider failure or no provider sample.
- Passive Telemetry could start to look like continuous Threat Intel.
- Provider/sample counts could be mistaken for durable Atlas Evidence.
- Diagnostics could become so quiet that blocked/degraded/freshness truth is hidden.

Stop if:

- a prototype requires backend contract or payload changes
- renderer would need to call zKill, ESI, logs, provider clients, parser, watcher, or runtime modules
- Passive states cannot keep fresh, stale, partial, capped, blocked, degraded, no observation, and pending distinct
- Lab labels would become Sense bridge fields, enums, service names, CSS/test IDs, or payload names
- copy implies complete awareness, verified truth, evidence, monitoring, or historical storage
- live provider smoke, live API calls, private-state checks, real SDE refresh, or manual shortcut validation become necessary

## 13. Smallest Safe Dev Prototype

Draft recommendation only. This is not a Dev runway.

If Human/Sense Overseer chooses Dev next, the smallest safe prototype is:

```txt
Passive Telemetry Instrument Band, renderer-only
```

Scope:

- use existing `passive.telemetry.snapshot` fields only
- keep Passive Telemetry in the existing compact tactical viewport
- preserve bridge APIs, IPC channels, service commands, payload fields, CSS/test identifiers, and backend state fields
- do not change provider behavior, live IO policy, cache behavior, or snapshot shape
- do not import Lab fixtures or Lab state labels
- do not touch Atlas, Core, or Lab files

Prototype acceptance checks:

- closed band shows `Passive Telemetry`
- current system is the primary value when present
- `No observation` is shown when no current system exists
- Sense state label is visible and not color-only
- basis/freshness is visible in one compact line or accessible via title/detail
- partial/capped/stale/blocked/degraded states remain visibly distinct
- `Live IO blocked` is authority wording, not provider failure
- detail reveal explains basis, freshness, sample, cap, gap, gate, and failure without raw/private payloads
- narrow viewport has no overlap or unreadable text

## 14. Recommended Sense-Local Verification

No verification was run for this advisory, per request.

If a future accepted implementation changes renderer presentation, recommended Sense-local verification:

```powershell
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:protected-terms
```

Run Electron visual smoke only if visible renderer/CSS layout changes are made:

```powershell
npm.cmd run smoke:electron
```

Run `npm.cmd run verify:all` only if the accepted Sense packet asks for broad regression.

Do not run for this Passive Telemetry instrument band prototype by default:

- `npm.cmd run smoke:passive-live-api`
- live provider smoke
- live API calls
- private-state checks
- real SDE refresh/download
- manual shortcut validation

## Recommended Next Role/Action

Recommended next action:

```txt
Sense Overseer reviews this advisory and decides whether to accept it, narrow it, park it, or open a small renderer-only Dev packet.
```

UI/UX recommendation:

Proceed to Dev only if Human/Sense Overseer wants the Passive Telemetry band as the next visible slice. Otherwise park this as the Sense-local mapping for future Passive Telemetry presentation work.
