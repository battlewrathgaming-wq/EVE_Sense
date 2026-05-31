# UIUXHS18: Meaning Geometry Capture - Passive Telemetry Lab Prep

Status: Meaning Geometry Capture, advisory preparation only
Date: 2026-05-26
Role: UX/UI Lead / Meaning Geometry Reviewer
Meaning owner / source context: Sense
Surface: Passive Telemetry compact readout / current-system context
Downstream use: Prepare for possible Lab spatial/presentation comparison

## 1. Request Received

The scoped request is to run the project-agnostic Meaning Geometry Capture workflow against the Sense Passive Telemetry compact readout / current-system context.

User task:

```txt
Help later spatial/presentation agents understand what Passive Telemetry means before arranging or comparing it.
```

Authority boundary:

- Human owns vision, intended experience, priority, and acceptance.
- Sense owns project-owned terms, lane meaning, source facts, contracts, emitted payload meaning, and final adoption.
- Lab may later compare presentation patterns only if a separate request is made.
- This work product does not create a Lab request, Dev runway, implementation plan, generated UI, bridge contract, adapter schema, runtime schema, or adoption decision.

Special source constraints applied:

- Preserve project-owned terms.
- Do not create Lab request.
- Do not create Dev runway.
- Use source facts only.
- Work pipeline is in process. If ownership, meaning, or scope is unclear, flag it rather than inventing.

Input correction:

The target card repeated `Known ambiguity / human note:`. This capture normalizes that duplicate label and preserves the note's meaning.

## 2. Files Reviewed

Input / workflow prompt:

- `F:\Projects\Docs\Tmp\Prompt_meaning-geometry-agnostic.txt`

Authority and current-state records:

- `AGENTS.md`
- `workspace/current.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `docs/current-state/current-implementation.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/features/vision.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`

Source/runtime facts:

- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/passive/liveIoGate.js`

Visible UI facts:

- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`

Advisory or historical material:

- None used as authority for this capture.

## 3. Surface Facts From Source

What exists today:

- Passive Telemetry is a backend-owned snapshot lane for current-system context and low-frequency environmental awareness.
- Passive Telemetry observes local navigation/current-system changes, resolves the current system where possible, and can request scoped ESI/zKill context when live IO authority allows it.
- The Passive snapshot is emitted as `passive.telemetry.snapshot` through the Passive Telemetry bridge and `auraPassiveTelemetry`.
- Renderer presentation consumes snapshots. It must not parse EVE logs, call zKill/ESI, own telemetry truth, or create evidence.
- The current compact readout already exists in the integrated viewport.

What is visible today:

- Lane label: `Passive Telemetry`.
- Subject label: `Current system`.
- Absence value: `No observation`.
- Activity values: `Kills`, `Jumps`, `Ratio`.
- State/basis readout: `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, `No observation`, and `Provider pending` where the renderer path supports it.
- Basis/gap detail: `No provider sample yet`, `Static lookup`, zKill sample count, ESI kills/jumps, age, partial/capped markers, and provider/sample detail.
- Diagnostics: Passive state, sample, activity, freshness, age, basis, gap, and pulse detail.

Source/runtime facts that inform it:

- `passiveTelemetryService.observeEvent` accepts `navigation.jump` events with `systemName`.
- `currentSystem` stores `label`, `fromSystemName`, `eventTime`, `observedAt`, `systemId`, `resolved`, and `resolverSource`.
- `status` can become `unavailable`, `stale`, `blocked`, `degraded`, `partial`, or `fresh` from source behavior.
- `zkill` exposes `systemId`, `fetchedAt`, `pastSeconds`, `sampleCount`, `capped`, `partial`, and `failureCount`.
- `activity` exposes `shipKills`, `podKills`, `npcKills`, `jumps`, `partial`, `failureCount`, and `cache`.
- `gate` exposes live IO authority state.
- `freshness` exposes `status`, `cacheAgeMs`, and `freshnessMs`.
- `message` and `failure` expose source-owned detail for blocked/degraded/stale cases.

Out of scope:

- No code implementation.
- No UI redesign or final layout.
- No Lab submission.
- No Dev runway.
- No live provider smoke.
- No manual shortcut validation.
- No contract, IPC, payload, CSS/test ID, or service rename.

## 3A. Slim Surface Reference Index

These references are for Lab spatial guide discussion only. They are pointer labels, not new UI copy, source terms, payload fields, adapter keys, or shared terminology.

Use the slim `#NN` reference when pointing to a surface-facing part in a guide. Preserve the Sense-owned meaning from the rest of this artifact.

| Ref | Surface-facing part | Meaning owner / layer | Current visible wording or value | Slot | Reference guidance |
| --- | --- | --- | --- | --- | --- |
| `#01` | Passive lane anchor | Sense / lane meaning | `Passive Telemetry` | `context-anchor` | Use when pointing to the lane label or the lane identity. Do not rename to generic telemetry or intel. |
| `#02` | Current-system label | Sense / display label | `Current system` | `context-anchor` | Use when pointing to the subject label. Keep attached to Passive lane context. |
| `#03` | Current-system value | Sense / observed value | system label, or `No observation` | `context-anchor` | Use when pointing to the displayed system name/value. Do not imply complete location truth. |
| `#04` | State qualifier | Sense / lane state | `Fresh context`, `Stale context`, `No observation`, etc. | `usability-cue` | Use for the primary freshness/usability state near the current-system read. |
| `#05` | Kills value | Sense / activity texture | `Kills` value | `activity-texture` | Use when pointing to aggregate activity texture. Do not style as a risk score. |
| `#06` | Jumps value | Sense / activity texture | `Jumps` value | `activity-texture` | Use when pointing to aggregate movement/activity texture. Do not imply completeness. |
| `#07` | Ratio value | Sense / derived activity texture | `Ratio` value | `activity-texture` | Use when pointing to the derived texture. Keep quieter than raw kills/jumps unless later accepted. |
| `#08` | Sample/completeness marker | Sense / sample limit state | `Partial sample`, `Capped sample`, `No provider sample yet`, `Provider pending` | `completeness-cue` | Use for visible sample limits. Do not collapse with stale, blocked, degraded, or no observation. |
| `#09` | Live IO authority marker | Sense / runtime authority | `Live IO blocked` | `authority-cue` | Use when pointing to authority-blocked provider access. Do not translate to provider failure. |
| `#10` | Degraded marker | Sense / impairment cue | `Degraded` | `impairment-cue` | Use when pointing to runtime/provider/resolution impairment. Do not style as tactical danger. |
| `#11` | Basis/freshness line | Sense / support detail | source, basis, freshness, age, static lookup, sample count | `source-detail-reveal` | Use for compact support copy or reveal handle. Keep near active gaps/warnings when needed. |
| `#12` | Detail/diagnostics reveal | Sense / diagnostics support | Passive state, sample, activity, gate, freshness, failure detail | `source-detail-reveal` | Use for collapsed inspection space. Do not make it first-read by default. |
| `#13` | Boundary marker | Sense / adjacent lane separation | `Threat Intel`, `No scan`, `Combat Witness`, `Clipboard Acquisition`, `Live IO` as shadow context | `boundary-marker` | Use only as shadow/context. Do not import adjacent lane terms into Passive focus copy. |

First-read reference cluster:

```txt
#01 Passive lane anchor
-> #02 Current-system label
-> #03 Current-system value
-> #04 State qualifier
```

Activity texture cluster:

```txt
#05 Kills
-> #06 Jumps
-> #07 Ratio
-> #08 Sample/completeness marker when active
```

Trust/limit cluster:

```txt
#09 Live IO authority marker
-> #10 Degraded marker
-> #11 Basis/freshness line
-> #12 Detail/diagnostics reveal
```

Boundary context:

```txt
#13 Boundary marker
```

## 4. Human Meaning Summary

Plain-language readback:

```txt
Passive Telemetry tells the operator what current-system context Sense has from local observation, plus low-frequency provider/sample texture when available.
```

The user should understand:

- which current system this Passive read is about
- whether the read should be treated as fresh enough or stale
- whether the provider/sample texture is partial, capped, pending, or absent
- whether absence is caused by live IO authority rather than provider failure
- whether a source/runtime impairment exists
- what kills/jumps/ratio texture says without turning it into a risk score
- where to inspect source, basis, freshness, gate, and failure detail if needed

The surface helps the user notice context and trust limits. It should not make the user believe Sense has complete awareness, provider truth, background Threat Intel, historical proof, or tactical recommendation authority.

Single primary moment:

```txt
Passive Telemetry + Current system + state qualifier
```

## 5. Intent Slots

| Slot id | Label | Plain-language intent | User inference | Likely visual weight | Default visibility |
| --- | --- | --- | --- | --- | --- |
| `context-anchor` | Context Anchor | Anchor what Passive Telemetry is about. | "Which current-system context is this?" | `primary` | visible |
| `usability-cue` | Usability Cue | Show whether the read can be used casually or cautiously. | "Is this fresh enough, or stale?" | `support-critical` | visible |
| `completeness-cue` | Completeness Cue | Show whether provider/sample texture is limited or missing. | "Am I seeing a complete-enough sample, or is it partial/capped/pending?" | `support-critical` | visible when active |
| `authority-cue` | Authority Cue | Show when live IO authority blocks provider access. | "Is this absent because Sense is not allowed to look?" | `quiet-critical` | visible when active |
| `impairment-cue` | Impairment Cue | Show degraded behavior without making it tactical danger. | "Is something impaired, but not necessarily absent?" | `quiet-critical` | visible when active |
| `activity-texture` | Activity Texture | Provide low-frequency background activity texture. | "What recent aggregate context exists around this system?" | `support` | visible |
| `source-detail-reveal` | Source Detail Reveal | Hold source/basis/freshness details for inspection. | "Why does this read look this way?" | `hidden-support` | collapsed |
| `boundary-marker` | Boundary Marker | Keep Passive separate from nearby active or tactical lanes. | "This is not Threat Intel or Combat Witness." | `quiet` | visible only if confusion risk rises |

## 6. State Tokens By Slot

| Slot id | State tokens | Meaning in this context | Must not be confused with |
| --- | --- | --- | --- |
| `context-anchor` | `Passive Telemetry`, `Current system`, `No observation` | The lane and subject of the read, or absence of local current-system observation. | Complete location truth, background scan, provider result. |
| `usability-cue` | `Fresh context`, `Stale context` | Whether the sampled context is fresh within Passive lane expectations or should be treated cautiously. | Global truth, safety, complete provider freshness. |
| `completeness-cue` | `Partial sample`, `Capped sample`, `No provider sample yet`, `Provider pending` | Whether provider/sample texture is incomplete, bounded, not yet available, or pending. | No local observation, Live IO blocked, provider truth. |
| `authority-cue` | `Live IO blocked` | Backend live IO gate intentionally prevented provider access. | Provider failure, no observation, unavailable bridge. |
| `impairment-cue` | `Degraded` | Resolution/provider/runtime impairment exists. | Live IO blocked, stale context, no observation, tactical danger. |
| `activity-texture` | `Kills`, `Jumps`, `Ratio` | Aggregate activity texture from ESI activity and renderer-derived ratio. | Tactical risk score, recommendation, complete intelligence. |
| `source-detail-reveal` | `source`, `basis`, `freshness`, `ESI activity`, `zKill system context`, `Static lookup`, `cache`, `failure` | Inspectable explanation of the readout's basis. | Product copy by default, raw provider truth, required first glance. |
| `boundary-marker` | `Threat Intel`, `No scan`, `Combat Witness`, `Clipboard Acquisition`, `Live IO` | Nearby lane meanings that prevent Passive misread. | Passive focus copy, source states, shared doctrine. |

## 7. Source Bindings By Slot

| Slot id | Source bindings | UI copy allowed? | Notes |
| --- | --- | --- | --- |
| `context-anchor` | `passive.telemetry.snapshot.kind`; `currentSystem.label`; `currentSystem.observedAt`; `currentSystem.eventTime`; `currentSystem.fromSystemName` | Partly | `Passive Telemetry`, `Current system`, and system label are visible. Binding paths are not UI copy. |
| `usability-cue` | `status`; `freshness.status`; `freshness.cacheAgeMs`; `freshness.freshnessMs`; `zkill.fetchedAt`; `activity.fetchedAt` | Partly | Use Sense labels like `Fresh context` / `Stale context`; avoid bare `Current` or generic `Aged`. |
| `completeness-cue` | `zkill.sampleCount`; `zkill.capped`; `zkill.partial`; `zkill.failureCount`; `activity.partial`; `activity.failureCount`; missing `zkill`; missing `activity` | Partly | `Partial sample`, `Capped sample`, and `No provider sample yet` are allowed; failure counts belong in detail. |
| `authority-cue` | `status`; `gate.state`; `gate.enabled`; `gate.message`; `message`; gate-related `failure.code` | Partly | `Live IO blocked` is preserve-exact Sense meaning. Do not translate to generic offline without authority meaning. |
| `impairment-cue` | `status`; `message`; `failure.code`; `failure.message`; `currentSystem.resolved`; `currentSystem.systemId`; `currentSystem.resolverSource` | Partly | `Degraded` is allowed. Failure messages may be detail, not first-glance headline unless carefully sanitized. |
| `activity-texture` | `activity.shipKills`; `activity.jumps`; renderer-derived ratio; `activity.podKills`; `activity.npcKills`; `activity.cache` | Partly | `Kills`, `Jumps`, and `Ratio` are visible. Pod/NPC/cache details should normally stay in diagnostics/detail. |
| `source-detail-reveal` | full `currentSystem`; full `zkill`; full `activity`; `gate`; `freshness`; `message`; `failure` | No by default | Details inform explanation. Do not turn raw field paths, cache internals, ETags, or failure codes into first-read copy. |
| `boundary-marker` | `threat.intel.snapshot`; `clipboard.acquisition.snapshot`; `runtime.live-io.snapshot`; `combat.witness.snapshot`; lane contracts | Partly | Use only as shadow context. Do not import adjacent lane terms into Passive focus meaning. |

Source/internal names that need presentation caution:

- `passive.telemetry.snapshot` is a bridge/source term, not normal operator copy.
- `Provider pulse` can imply continuous heartbeat; safer downstream wording may be provider/sample state if Sense accepts it.
- `Cached activity` is useful detail, but should not become a new first-glance Passive state unless accepted.
- `resolverSource` can support `Static lookup` only when the field actually says `local-static`.

## 8. Visual Weight / Loudness Guidance

Primary:

- `context-anchor` is the main human read.
- The system label and `Current system` context should be clearer than provider mechanics.
- `Passive Telemetry` must remain attached enough to the readout that it cannot be mistaken for Threat Intel.

Support-critical:

- `usability-cue` should stay near the current-system read.
- `completeness-cue` should appear near activity/sample values when partial, capped, pending, or absent.
- `Stale context` should read as caution, not failure.
- `Partial sample` and `Capped sample` should be at least as visible as the numbers they qualify.

Quiet-critical:

- `Live IO blocked` needs a visible authority cue when active, but should not dominate normal Passive use.
- `Degraded` should be visible without becoming an alarm unless the source meaning supports alarm.

Support:

- `Kills`, `Jumps`, and `Ratio` provide texture only.
- `Ratio` should stay quieter than raw values and should not look like a score, recommendation, or tactical verdict.

Hidden-support:

- Source, basis, freshness threshold, cache detail, provider failure count, resolver detail, and failure metadata belong in detail/diagnostics unless they explain an active warning.

## 9. Shadow Slots And Relationships

| Shadow id | Why it matters | One-line meaning | Must not be confused with focus | Relationship to focus | Placement guidance |
| --- | --- | --- | --- | --- | --- |
| `runtime-io-authority-shadow` | Separates `Live IO blocked` from provider failure/no observation. | Runtime live IO authority controls whether provider/clipboard-enabled actions may run. | Provider health, no provider sample, no current-system observation. | `gates` `authority-cue` | Adjacent when blocked; collapsed when inactive. |
| `threat-intel-shadow` | Prevents Passive from reading as background scan. | Threat Intel is deliberate operator-initiated inspection. | Passive current-system context, ESI/zKill aggregate support, no observation. | `separates-from` `context-anchor` | Visually separated; collapse first in narrow layout. |
| `combat-witness-shadow` | Prevents Passive from absorbing the primary tactical combat face. | Combat Witness is recent local combat-log observation. | Current-system context or provider activity texture. | `competes-for-attention` | Keep outside Passive group; quiet or hidden in narrow layout. |
| `clipboard-acquisition-shadow` | Separates active permission action from Passive observation. | Clipboard Acquisition is I/O-gated and operator-invited. | Passive parser-observed system context. | `separates-from` `authority-cue` | Hidden unless comparing Active/Passive boundaries. |
| `diagnostics-shadow` | Provides a home for trust/support details. | Diagnostics explain source, freshness, gate, and failure without owning first glance. | Primary readout or source truth. | `reveals-detail` | Collapsed detail reveal. |

## 10. Must-Not-Imply Constraints

The Passive Telemetry compact readout must not imply:

- complete awareness
- complete location truth
- continuous system monitoring
- background Threat Intel
- source/provider truth
- verified certainty
- historical proof
- Atlas evidence or storage
- tactical risk score
- safety, danger, or recommendation
- complete provider view
- all recent kills
- hidden provider calls
- hidden clipboard capture
- action authorization
- source binding as UI copy
- renderer-owned telemetry truth

Avoid or qualify:

- `No data`
- bare `Current`
- `Fallback`
- `Verified`
- `Truth`
- `Evidence`
- `Watch`
- `Monitoring`
- unqualified `Intel`
- unqualified `Threat`

## 11. Spatial Handoff Guidance

This is not a layout. It is guidance for a later board/layout pass.

Keep close:

- `context-anchor` and `usability-cue`
- `completeness-cue` and `activity-texture`
- `authority-cue` and `runtime-io-authority-shadow` when blocked
- `source-detail-reveal` and any active warning/gap cue

Visually separate:

- `threat-intel-shadow` from Passive focus
- `combat-witness-shadow` from Passive focus
- `clipboard-acquisition-shadow` from Passive focus
- diagnostics/source details from the primary read

Remain visible in narrow layout:

- `Passive Telemetry`
- `Current system` and system label or `No observation`
- one state qualifier
- active `Live IO blocked`, `Degraded`, `Partial sample`, `Capped sample`, or `Stale context` marker

Collapse into detail/diagnostics:

- ESI/zKill source detail
- resolver detail
- cache state and ETag-like internals
- failure counts
- raw field names
- shadow explanations once boundaries are clear

Stay parked:

- Lab comparison request
- generated bitmap/UI
- Dev implementation runway
- bridge/schema changes
- live/manual validation
- Clipboard Acquisition and Threat Intel full meaning captures

## 12. Advisory JSON Sketch

This sketch is advisory only. It is not a bridge contract, runtime schema, adapter schema, implementation target, or generated UI spec.

```json
{
  "artifact": {
    "project": "AURA-Sense",
    "meaning_owner": "Sense",
    "surface": "Passive Telemetry compact readout / current-system context",
    "mode": "meaning-geometry-capture",
    "downstream_use": "possible Lab spatial/presentation comparison",
    "status": "advisory-preparation-only"
  },
  "processing_rules": {
    "meaning_owner_prepares_meaning": true,
    "slot_is_stable": true,
    "state_is_variable": true,
    "source_binding_is_not_ui_copy": true,
    "shadow_is_context_not_focus": true,
    "layout_is_not_meaning": true,
    "human_inference_drives_layout": true,
    "downstream_tools_must_not_infer_owner_meaning": true,
    "meaning_owner_retains_adoption_authority": true,
    "universalize_capture_grammar_not_captured_meaning": true
  },
  "slots": [
    {
      "id": "context-anchor",
      "label": "Context Anchor",
      "intent": "Anchor what Passive Telemetry is about.",
      "human_inference": "Which current-system context is this?",
      "allowed_terms": ["Passive Telemetry", "Current system", "No observation"],
      "state_tokens": ["No observation"],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.currentSystem.label",
          "meaning": "Observed current-system label from the Passive lane.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "primary",
      "spatial_role": "central-readout",
      "default_visibility": "visible",
      "stability": "stable-slot-variable-state",
      "must_not_imply": ["complete awareness", "background Threat Intel", "source/provider truth"],
      "allowed_agent_ops": ["position", "scale", "group", "emphasize", "deemphasize"],
      "forbidden_agent_ops": ["rename-owner-term", "invent-state", "merge-surface", "convert-source-binding-to-copy"],
      "ambiguity_notes": []
    },
    {
      "id": "usability-cue",
      "label": "Usability Cue",
      "intent": "Show whether the read can be used casually or cautiously.",
      "human_inference": "Is this fresh enough, or stale?",
      "allowed_terms": ["Fresh context", "Stale context"],
      "state_tokens": ["Fresh context", "Stale context"],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.freshness.cacheAgeMs",
          "meaning": "Age of the current provider/sample context where available.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "support-critical",
      "spatial_role": "status-band",
      "default_visibility": "visible",
      "stability": "stable-slot-variable-state",
      "must_not_imply": ["verified truth", "safety", "complete provider freshness"],
      "allowed_agent_ops": ["position", "scale", "group", "emphasize", "deemphasize"],
      "forbidden_agent_ops": ["rename-owner-term", "invent-state", "merge-surface", "convert-source-binding-to-copy"],
      "ambiguity_notes": []
    },
    {
      "id": "completeness-cue",
      "label": "Completeness Cue",
      "intent": "Show whether provider/sample texture is limited or missing.",
      "human_inference": "Is the sample partial, capped, pending, or absent?",
      "allowed_terms": ["Partial sample", "Capped sample", "No provider sample yet", "Provider pending"],
      "state_tokens": ["Partial sample", "Capped sample", "No provider sample yet", "Provider pending"],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.zkill.capped",
          "meaning": "Scoped zKill sample was capped.",
          "ui_copy_allowed": false
        },
        {
          "source": "passive.telemetry.snapshot.activity.partial",
          "meaning": "ESI activity response was partial.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "support-critical",
      "spatial_role": "warning-gap-edge",
      "default_visibility": "visible-when-active",
      "stability": "stable-slot-variable-state",
      "must_not_imply": ["complete provider view", "no activity", "no observation"],
      "allowed_agent_ops": ["position", "scale", "group", "emphasize", "deemphasize"],
      "forbidden_agent_ops": ["rename-owner-term", "invent-state", "merge-surface", "convert-source-binding-to-copy"],
      "ambiguity_notes": ["Provider pending is allowed only when the active renderer/snapshot path supports it."]
    },
    {
      "id": "authority-cue",
      "label": "Authority Cue",
      "intent": "Show when live IO authority blocks provider access.",
      "human_inference": "Is Sense not allowed to look?",
      "allowed_terms": ["Live IO blocked"],
      "state_tokens": ["Live IO blocked"],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.gate.enabled",
          "meaning": "Backend live IO authority state.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "quiet-critical",
      "spatial_role": "edge-indicator",
      "default_visibility": "visible-when-active",
      "stability": "stable-slot-variable-state",
      "must_not_imply": ["provider failure", "no observation", "tactical safety"],
      "allowed_agent_ops": ["position", "scale", "group", "emphasize", "deemphasize"],
      "forbidden_agent_ops": ["rename-owner-term", "invent-state", "merge-surface", "convert-source-binding-to-copy"],
      "ambiguity_notes": []
    },
    {
      "id": "activity-texture",
      "label": "Activity Texture",
      "intent": "Provide low-frequency background activity texture.",
      "human_inference": "What aggregate activity context exists around this system?",
      "allowed_terms": ["Kills", "Jumps", "Ratio"],
      "state_tokens": ["Kills", "Jumps", "Ratio"],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.activity.shipKills",
          "meaning": "ESI aggregate ship kills for the resolved system.",
          "ui_copy_allowed": false
        },
        {
          "source": "passive.telemetry.snapshot.activity.jumps",
          "meaning": "ESI aggregate jumps for the resolved system.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "support",
      "spatial_role": "context-rail",
      "default_visibility": "visible",
      "stability": "stable-slot-variable-state",
      "must_not_imply": ["risk score", "recommendation", "complete intelligence"],
      "allowed_agent_ops": ["position", "scale", "group", "emphasize", "deemphasize"],
      "forbidden_agent_ops": ["rename-owner-term", "invent-state", "merge-surface", "convert-source-binding-to-copy"],
      "ambiguity_notes": ["Ratio is renderer-derived texture, not source truth."]
    }
  ],
  "shadows": [
    {
      "id": "runtime-io-authority-shadow",
      "label": "Runtime IO Authority Shadow",
      "why_it_matters": "Separates Live IO blocked from provider failure or no observation.",
      "one_line_meaning": "Runtime live IO authority can allow or block provider actions.",
      "must_not_confuse_with_focus": ["provider health", "No observation", "No provider sample yet"],
      "relationship": "gates",
      "adjacent_to": ["authority-cue", "completeness-cue"],
      "visual_weight": "quiet-critical",
      "narrow_behavior": "Preserve only when blocked."
    },
    {
      "id": "threat-intel-shadow",
      "label": "Threat Intel Shadow",
      "why_it_matters": "Separates Passive context from deliberate scan state.",
      "one_line_meaning": "Threat Intel is operator-initiated inspection, not ambient Passive context.",
      "must_not_confuse_with_focus": ["Passive Telemetry", "Current system", "provider sample"],
      "relationship": "separates-from",
      "adjacent_to": ["context-anchor"],
      "visual_weight": "quiet",
      "narrow_behavior": "Collapse first unless Passive reads as background scan."
    }
  ],
  "relationships": [
    { "from": "usability-cue", "to": "context-anchor", "type": "qualifies" },
    { "from": "activity-texture", "to": "context-anchor", "type": "supports" },
    { "from": "completeness-cue", "to": "activity-texture", "type": "qualifies" },
    { "from": "authority-cue", "to": "completeness-cue", "type": "gates" },
    { "from": "source-detail-reveal", "to": "completeness-cue", "type": "reveals-detail" },
    { "from": "threat-intel-shadow", "to": "context-anchor", "type": "separates-from" }
  ]
}
```

## 13. Input Corrections / Ambiguity Notes

Input corrections:

- The target card used `Sense` as shorthand. This capture treats that as `AURA-Sense` as meaning owner / source context.
- The target card duplicated `Known ambiguity / human note:`. This was normalized.
- `Downstream use` is preparation for possible Lab comparison only; it does not create a Lab request.
- `Do not create Dev runway` is translated in this capture as no implementation runway of any kind.

Ambiguity notes:

- `Provider pending` exists in renderer mapping, but should be used only where the active snapshot/readout path supports current system with no provider sample yet.
- `Provider pulse` is current visible wording but remains presentation-risky because it can imply a continuous provider heartbeat.
- `Cached activity` appears in renderer sample-state handling. It is acceptable as detail/basis but should not become a first-glance Passive state without owner acceptance.
- Any Lab comparison must preserve Sense-owned meanings and should not import Lab terminology as Sense state names.

## 14. Risks

- Owner/layer risk: Lab comparison could accidentally treat Passive bridge/source terms as Lab-owned UI terms.
- Wording risk: `Fresh context` could be read as verified current truth if basis/freshness is hidden.
- State collapse risk: `No observation`, `No provider sample yet`, `Live IO blocked`, `Degraded`, `Partial sample`, `Capped sample`, and `Stale context` could be flattened into generic unavailable/no-data language.
- Shadow confusion risk: Threat Intel shadow could make Passive look like background scan or intelligence.
- Activity risk: `Ratio` could become a risk score if visually overemphasized.
- Authority risk: `Live IO blocked` could be softened into generic offline wording and lose user-authority meaning.
- Detail risk: source/basis/failure details could overwhelm the primary read and make normal operation feel broken.

## 15. Parked Items

- Lab request artifact.
- Lab submission.
- Generated UI or bitmap.
- Pane Board layout.
- Shape See adapter/schema work.
- Dev implementation runway.
- Renderer copy/layout changes.
- Contract, IPC, payload, service, CSS/test ID, or backend state changes.
- Passive live provider smoke.
- Live/manual operator smoke.
- Manual shortcut validation.
- Dedicated captures for Clipboard Acquisition, Threat Intel latest scan, Combat Witness, Runtime IO authority, or provider pulse row.

## 16. Verification Note

No implementation, downstream submission, generated UI, live/manual operation, source adapter, or implementation runway was created.

No verification commands were run.

Reason:

```txt
This is an advisory preparation artifact only. It changes no runtime code, renderer behavior, bridge contract, payload, IPC channel, service, CSS/test identifier, backend state field, source term, Lab file, or Dev runway.
```

Recommended only if this later becomes implementation or formal display workflow input:

```powershell
npm.cmd run verify:protected-terms
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-shell
```

Do not run live provider smoke, live API calls, private-state checks, real SDE refresh, manual shortcut validation, or Lab submission from this capture.
