# UIUXHS17: Source Meaning Geometry Capture - Passive Telemetry

Status: Source Meaning Geometry Capture, Sense-local UI/UX advisory, not implementation authority
Date: 2026-05-26
Role: Source Meaning Geometry Reviewer
Project: AURA-Sense
Surface: Passive Telemetry compact readout / current-system context

## Request Received

Prepare Sense-owned meaning in-house before Pane Board, Shape See, Lab, or any downstream presentation tool touches the surface.

This capture turns the current Passive Telemetry surface into stable intent slots, state tokens, source bindings, visual weight guidance, and bounded shadow context. The goal is to communicate source meaning clearly so later layout or comparison agents can arrange the surface without inferring, flattening, or misrepresenting Sense.

Core principle:

```txt
Sense prepares meaning.
Pane Board arranges meaning.
Lab may compare presentation later.
Sense keeps adoption authority.
```

This artifact is:

- not implementation
- not generated UI
- not adapter work
- not a bridge/runtime contract
- not a Lab request
- not a Dev runway
- not product adoption authority

## Files Reviewed

- `F:\Projects\Docs\Tmp\Prompt_pre-labs.txt`
- `AGENTS.md`
- `workspace/current.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `docs/current-state/current-implementation.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/features/vision.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/passive/liveIoGate.js`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `workspace/UIUXHS03-passive-telemetry-instrument-band-advisory.md`
- `workspace/UIUXHS16-surface-parts-passive-telemetry-readout.md`

## Surface Facts From Project

Passive Telemetry is the Sense lane for current-system context and low-frequency environmental awareness. It is derived from local observation of navigation/current-system changes and scoped provider samples. It must not become background Threat Intel, complete system awareness, an Atlas evidence surface, or a tactical risk score.

Current Passive flow:

```txt
local parser/navigation observation
-> Passive Telemetry service
-> local/static system resolution
-> backend-gated ESI system activity
-> backend-gated zKill system context
-> passive.telemetry.snapshot
-> renderer presentation
```

Current renderer facts:

- The compact band is labeled `Passive Telemetry`.
- The primary subject is `Current system` with a system label or `No observation`.
- Activity texture is shown as `Kills`, `Jumps`, and `Ratio`.
- The readout state maps existing snapshot state into Sense labels such as `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, `No observation`, and `Provider pending`.
- The basis line can show zKill sample count, ESI kills/jumps, `Static lookup`, cap/partial markers, and age.
- Diagnostics expose Passive state, sample, activity, freshness, age, basis, gap, and provider/sample detail.
- Runtime live IO authority is separate from Passive presentation, but can affect Passive provider availability.

Current source fields from `passive.telemetry.snapshot`:

- `kind`
- `observedAt`
- `currentSystem.label`
- `currentSystem.fromSystemName`
- `currentSystem.eventTime`
- `currentSystem.observedAt`
- `currentSystem.systemId`
- `currentSystem.resolved`
- `currentSystem.resolverSource`
- `zkill.systemId`
- `zkill.fetchedAt`
- `zkill.pastSeconds`
- `zkill.sampleCount`
- `zkill.capped`
- `zkill.partial`
- `zkill.failureCount`
- `activity.systemId`
- `activity.fetchedAt`
- `activity.shipKills`
- `activity.podKills`
- `activity.npcKills`
- `activity.jumps`
- `activity.partial`
- `activity.failureCount`
- `activity.cache`
- `gate.state`
- `gate.enabled`
- `gate.message`
- `freshness.status`
- `freshness.cacheAgeMs`
- `freshness.freshnessMs`
- `status`
- `message`
- `failure`

## Source-Owned Meaning Summary

Passive Telemetry should help the operator understand:

```txt
What current-system context is Sense showing me, and how cautiously should I treat it?
```

The first-read meaning is not provider detail. The first-read meaning is current-system context in EVE flow.

Stable source meaning:

- `Passive Telemetry` is the lane anchor.
- `Current system` is the first-read subject.
- `Fresh context` and `Stale context` describe usability caution, not absolute truth.
- `Partial sample`, `Capped sample`, and `No provider sample yet` describe completeness limits.
- `Live IO blocked` describes authority blocking, not provider failure.
- `Degraded` describes impairment, not absence.
- `Kills`, `Jumps`, and `Ratio` are activity texture, not a tactical verdict.
- Source, basis, freshness, ESI, zKill, resolver, cache, and failure detail are inspectable support, not first-glance copy by default.

Single primary moment:

```txt
Current system + Passive state
```

Everything else should either support, qualify, or explain that moment.

## Inferred Intent Slots

| Slot id | Label | Intent | Visual weight | Spatial role | Default visibility |
| --- | --- | --- | --- | --- | --- |
| `context-anchor` | Context Anchor | Anchor the operator's current-system context to the Passive lane. | `primary` | `central-readout` | visible |
| `usability-feel` | Usability Feel | Show whether the current read can be used casually or should be treated cautiously. | `support-critical` | `status-band` | visible |
| `completeness-feel` | Completeness Feel | Show whether the visible sample is limited, capped, or absent. | `support-critical` | `warning-gap-edge` | visible when active |
| `authority-hint` | Offline / Authority Hint | Show that absence can be caused by user-controlled live IO authority. | `quiet-critical` | `edge-indicator` | visible when active |
| `impairment-cue` | Impairment Cue | Show that something is working badly without turning it into tactical danger. | `quiet-critical` | `warning-gap-edge` | visible when active |
| `activity-texture` | Activity Texture | Add low-frequency background texture through kills, jumps, and ratio. | `support` | `context-rail` | visible |
| `source-detail-reveal` | Source Detail Reveal | Let the operator inspect why the read looks the way it does. | `hidden-support` | `detail-drawer` | collapsed |

## State Tokens By Slot

| Slot id | State tokens |
| --- | --- |
| `context-anchor` | `Passive Telemetry`, `Current system`, `No observation` |
| `usability-feel` | `Fresh context`, `Stale context` |
| `completeness-feel` | `Partial sample`, `Capped sample`, `No provider sample yet`, `Provider pending` if supported by the active snapshot/readout path |
| `authority-hint` | `Live IO blocked` |
| `impairment-cue` | `Degraded` |
| `activity-texture` | `Kills`, `Jumps`, `Ratio` |
| `source-detail-reveal` | `source`, `basis`, `freshness`, `ESI activity`, `zKill system context`, `local/static resolver status`, `cache`, `failure` |

Do not use state names as the stable layout model. The stable model is the human-intent slot. The state token is the variable condition passing through that slot.

Example correction:

```txt
Do not model "fresh state" as a layout slot.
Model "Usability Feel" as the slot, with Fresh context and Stale context as possible state tokens.
```

## Source Bindings By Slot

| Slot id | Source bindings | Meaning |
| --- | --- | --- |
| `context-anchor` | `passive.telemetry.snapshot.currentSystem.label`; `currentSystem.observedAt`; `currentSystem.eventTime`; `currentSystem.fromSystemName`; `status` | Parser-observed current-system context upstream of provider display. |
| `usability-feel` | `status`; `freshness.status`; `freshness.cacheAgeMs`; `freshness.freshnessMs`; `zkill.fetchedAt`; `activity.fetchedAt` | Fresh/stale is a usability cue based on lane freshness and provider/sample timing. |
| `completeness-feel` | `zkill.sampleCount`; `zkill.capped`; `zkill.partial`; `zkill.failureCount`; `activity.partial`; `activity.failureCount`; missing `zkill`; missing `activity` | Sample is present, limited, capped, partial, or absent. |
| `authority-hint` | `status`; `gate.state`; `gate.enabled`; `gate.message`; `message`; `failure.code` when gate-related | Provider absence may be caused by backend live IO authority, not provider health. |
| `impairment-cue` | `status`; `message`; `failure.code`; `failure.message`; unresolved `currentSystem.systemId`; `currentSystem.resolved` | Something in resolution/provider/runtime is impaired. |
| `activity-texture` | `activity.shipKills`; `activity.jumps`; derived ratio; `activity.podKills`; `activity.npcKills`; `activity.cache` | Low-frequency activity texture only; ratio is not a risk score. |
| `source-detail-reveal` | `kind`; `observedAt`; full `currentSystem`; full `zkill`; full `activity`; `gate`; `freshness`; `message`; `failure` | Inspectable support details for trust, debugging, and explanation. |

Source bindings are project facts. They are not UI copy by default.

## Human Inference Per Slot

| Slot id | Human inference |
| --- | --- |
| `context-anchor` | "What system is this Passive read about, according to local observation?" |
| `usability-feel` | "Can I use this read now, or should I treat it cautiously?" |
| `completeness-feel` | "Am I seeing enough texture, or is the sample limited/missing?" |
| `authority-hint` | "Is this absent because Sense is not allowed to look?" |
| `impairment-cue` | "Is something working badly without necessarily being absent?" |
| `activity-texture` | "What background activity gives this context texture?" |
| `source-detail-reveal` | "Can I inspect why this looks the way it does if it matters?" |

User-story correction applied:

Freshness should not be dramatized as if Sense can know the world is newly true. Passive provider data is always a sampled context. Prefer calm freshness/basis language, with fetched age/timestamp available, over global certainty language.

## Visual Weight / Loudness Guidance

Primary:

- `Context Anchor` owns the first glance.
- The current system label should be visually clearer than provider mechanics.
- `Passive Telemetry` should stay near the current-system label so the read cannot drift into Threat Intel or Combat Witness meaning.

Support-critical:

- `Usability Feel` should sit adjacent to the current-system readout.
- `Completeness Feel` should be visible when partial, capped, pending, or no provider sample changes how the operator should trust the read.
- `Stale context` should feel cautious, not broken.
- `Partial sample` and `Capped sample` should not be quieter than the values they qualify.

Quiet-critical:

- `Live IO blocked` should be discreet but unmistakable when active. It is an authority state, not provider failure and not no observation.
- `Degraded` needs careful handling because humans may read it as "buggy." It should show impairment without becoming tactical danger styling.

Support:

- `Kills`, `Jumps`, and `Ratio` should be readable but secondary.
- `Ratio` should be visually quieter than raw kills/jumps unless Human later promotes it. It must not look like a recommendation, score, threat level, or safety signal.

Hidden-support:

- ESI, zKill, resolver, cache, failure count, raw status, and provider timing belong in detail or diagnostics unless they explain an active warning.
- Source detail should behave like a tire-pressure light: quiet during normal use, reachable when something feels wrong.

## Shadow Slots And Relationships

Shadow slots are context only. They prevent Passive Telemetry from being misread; they are not second focus surfaces.

| Shadow id | Why it matters | One-line meaning | Must not be confused with focus | Relationship | Adjacent to | Visual weight | Narrow behavior |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `runtime-io-authority-shadow` | Separates `Live IO blocked` from provider failure, no provider sample, or no observation. | Runtime live IO authority can allow or block provider/clipboard actions. | Passive provider health, Passive absence, ESI/zKill failure. | `gates` | `authority-hint`, `completeness-feel` | `quiet-critical` | Preserve a minimal marker when blocked; otherwise collapse. |
| `threat-intel-shadow` | Separates Passive context from deliberate scan / `No scan`. | Threat Intel is operator-initiated inspection, not ambient Passive context. | Passive Telemetry, Current system, provider sample. | `separates-from` | `context-anchor`, `usability-feel` | `quiet` | Collapse first unless Passive reads as background scan. |
| `combat-witness-shadow` | Prevents Passive from absorbing the primary tactical face. | Combat Witness is recent local combat-log observation. | Current-system context, provider sample, system activity. | `competes-for-attention` | outer edge of Passive group | `quiet` | Hide or reduce under crowding. |
| `clipboard-acquisition-shadow` | Separates active clipboard permission from Passive observation. | Clipboard Acquisition is an I/O-gated permission action feeding Threat Intel. | Parser-observed Passive current-system context. | `separates-from` | outside Passive group | `quiet` | Hide unless comparing Active/Passive boundaries. |
| `diagnostics-shadow` | Gives source/basis/failure detail a home without overcrowding first glance. | Diagnostics explain trust, gaps, and runtime health. | Primary readout, provider truth, generated certainty. | `reveals-detail` | `source-detail-reveal` | `hidden-support` | Collapsed by default; reveal on intent. |

Relationship rules:

- `usability-feel` qualifies `context-anchor`.
- `completeness-feel` qualifies `activity-texture` and `source-detail-reveal`.
- `authority-hint` gates `completeness-feel` but does not define provider health.
- `impairment-cue` must-not-collapse with `authority-hint`, `usability-feel`, or `context-anchor`.
- `activity-texture` supports `context-anchor` but does not feed a recommendation.
- `source-detail-reveal` reveals-detail for all warning and gap slots.
- `threat-intel-shadow` separates-from `context-anchor` and should never donate `Intel`, `Threat`, `No scan`, or scan semantics into Passive.

## Must-Not-Imply Constraints

Passive Telemetry must not imply:

- complete system awareness
- continuous location tracking
- background Threat Intel
- tactical risk score
- provider truth
- verified certainty
- all kills or all jumps
- durable evidence
- Atlas historical storage
- monitoring or watcher semantics
- hidden live provider calls
- hidden clipboard action
- renderer-owned telemetry truth
- recommendation or behavior command

Language to avoid or qualify:

- Avoid `No data`; prefer lane-specific absence such as `No observation` or `No provider sample yet`.
- Avoid bare `Current`; prefer `Current system` with Passive lane context.
- Avoid `Threat`, `Intel`, `Evidence`, `Watch`, `Monitoring`, `Truth`, `Verified`, `Certainty`, and `Fallback` inside Passive focus copy.
- Treat `Pulse` cautiously. If used, it should mean provider/sample state and should not imply continuous heartbeat truth.
- Use `Static lookup` only when `currentSystem.resolverSource` supports that meaning.

## Advisory Schema / JSON Sketch

This JSON is advisory input for source meaning geometry only. It is not runtime data, not a bridge contract, not adapter work, and not generated UI.

```json
{
  "artifact": {
    "project": "AURA-Sense",
    "surface": "Passive Telemetry compact readout / current-system context",
    "mode": "source-meaning-geometry-capture",
    "authority": "Sense prepares meaning; downstream tools arrange interpreted parts only",
    "status": "advisory-not-implementation"
  },
  "processing_rules": {
    "source_project_prepares_meaning": true,
    "slot_is_stable": true,
    "state_is_variable": true,
    "source_binding_is_not_ui_copy": true,
    "shadow_is_context_not_focus": true,
    "human_inference_drives_layout": true,
    "downstream_tools_must_not_infer_source_meaning": true,
    "sense_retains_adoption_authority": true
  },
  "allowed_agent_ops": [
    "position",
    "scale",
    "group",
    "emphasize",
    "deemphasize",
    "hide-when-inactive",
    "reveal-detail"
  ],
  "forbidden_agent_ops": [
    "rename-source-term",
    "invent-state",
    "merge-lane",
    "convert-source-binding-to-copy",
    "promote-shadow-to-focus",
    "create-dev-runway",
    "submit-to-lab",
    "generate-final-ui"
  ],
  "slots": [
    {
      "id": "context-anchor",
      "label": "Context Anchor",
      "intent": "Anchor the operator's current-system context to the Passive lane.",
      "human_inference": "What system is this Passive read about, according to local observation?",
      "allowed_terms": [
        "Passive Telemetry",
        "Current system",
        "No observation"
      ],
      "state_tokens": [
        "No observation"
      ],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.currentSystem.label",
          "meaning": "Parser-observed current system label upstream of provider context.",
          "ui_copy_allowed": false
        },
        {
          "source": "passive.telemetry.snapshot.currentSystem.observedAt",
          "meaning": "When the local observation was recorded.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "primary",
      "spatial_role": "central-readout",
      "default_visibility": "visible",
      "stability": "stable-slot-variable-state",
      "must_not_imply": [
        "complete system awareness",
        "provider truth",
        "background scan"
      ]
    },
    {
      "id": "usability-feel",
      "label": "Usability Feel",
      "intent": "Show whether the current read can be used casually or should be treated cautiously.",
      "human_inference": "Can I use this read now, or should I treat it cautiously?",
      "allowed_terms": [
        "Fresh context",
        "Stale context"
      ],
      "state_tokens": [
        "Fresh context",
        "Stale context"
      ],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.status",
          "meaning": "Backend-owned Passive state.",
          "ui_copy_allowed": false
        },
        {
          "source": "passive.telemetry.snapshot.freshness.cacheAgeMs",
          "meaning": "Provider/sample age available for calm freshness context.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "support-critical",
      "spatial_role": "status-band",
      "default_visibility": "visible",
      "stability": "stable-slot-variable-state",
      "must_not_imply": [
        "current truth",
        "verified system safety",
        "complete provider freshness"
      ]
    },
    {
      "id": "completeness-feel",
      "label": "Completeness Feel",
      "intent": "Show whether the visible provider/sample texture is limited, capped, pending, or absent.",
      "human_inference": "Am I seeing enough texture, or is the sample limited or missing?",
      "allowed_terms": [
        "Partial sample",
        "Capped sample",
        "No provider sample yet",
        "Provider pending"
      ],
      "state_tokens": [
        "Partial sample",
        "Capped sample",
        "No provider sample yet",
        "Provider pending"
      ],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.zkill.sampleCount",
          "meaning": "Scoped zKill context sample count.",
          "ui_copy_allowed": false
        },
        {
          "source": "passive.telemetry.snapshot.zkill.capped",
          "meaning": "Sample was capped by the scoped route/limit.",
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
      "must_not_imply": [
        "complete provider view",
        "all recent kills",
        "no activity in system"
      ]
    },
    {
      "id": "authority-hint",
      "label": "Offline / Authority Hint",
      "intent": "Show that absence can be caused by user-controlled live IO authority.",
      "human_inference": "Is this absent because Sense is not allowed to look?",
      "allowed_terms": [
        "Live IO blocked"
      ],
      "state_tokens": [
        "Live IO blocked"
      ],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.gate.enabled",
          "meaning": "Backend live IO authority state.",
          "ui_copy_allowed": false
        },
        {
          "source": "passive.telemetry.snapshot.gate.message",
          "meaning": "Authority explanation when live IO is blocked.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "quiet-critical",
      "spatial_role": "edge-indicator",
      "default_visibility": "visible-when-active",
      "stability": "stable-slot-variable-state",
      "must_not_imply": [
        "provider failure",
        "no observation",
        "system is safe"
      ]
    },
    {
      "id": "impairment-cue",
      "label": "Impairment Cue",
      "intent": "Show that something is working badly without treating it as absence or danger.",
      "human_inference": "Is something impaired, but not necessarily absent?",
      "allowed_terms": [
        "Degraded"
      ],
      "state_tokens": [
        "Degraded"
      ],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.failure",
          "meaning": "Sanitized backend failure metadata.",
          "ui_copy_allowed": false
        },
        {
          "source": "passive.telemetry.snapshot.currentSystem.resolved",
          "meaning": "Whether the observed system resolved to an ID for provider context.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "quiet-critical",
      "spatial_role": "warning-gap-edge",
      "default_visibility": "visible-when-active",
      "stability": "stable-slot-variable-state",
      "must_not_imply": [
        "tactical danger",
        "authority block",
        "no observation"
      ]
    },
    {
      "id": "activity-texture",
      "label": "Activity Texture",
      "intent": "Provide low-frequency background activity texture.",
      "human_inference": "What background activity gives this context texture?",
      "allowed_terms": [
        "Kills",
        "Jumps",
        "Ratio"
      ],
      "state_tokens": [
        "Kills",
        "Jumps",
        "Ratio"
      ],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot.activity.shipKills",
          "meaning": "ESI aggregate ship kills for the resolved system.",
          "ui_copy_allowed": false
        },
        {
          "source": "passive.telemetry.snapshot.activity.jumps",
          "meaning": "ESI aggregate ship jumps for the resolved system.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "support",
      "spatial_role": "context-rail",
      "default_visibility": "visible",
      "stability": "stable-slot-variable-state",
      "must_not_imply": [
        "risk score",
        "recommendation",
        "complete tactical intelligence"
      ]
    },
    {
      "id": "source-detail-reveal",
      "label": "Source Detail Reveal",
      "intent": "Let the operator inspect why the read looks the way it does.",
      "human_inference": "Can I inspect why this looks the way it does if it matters?",
      "allowed_terms": [
        "source",
        "basis",
        "freshness",
        "ESI activity",
        "zKill system context",
        "local/static resolver status"
      ],
      "state_tokens": [
        "source",
        "basis",
        "freshness",
        "cache",
        "failure"
      ],
      "source_bindings": [
        {
          "source": "passive.telemetry.snapshot",
          "meaning": "Backend-owned Passive snapshot fields for inspectable support detail.",
          "ui_copy_allowed": false
        }
      ],
      "visual_weight": "hidden-support",
      "spatial_role": "detail-drawer",
      "default_visibility": "collapsed",
      "stability": "stable-slot-variable-state",
      "must_not_imply": [
        "operator must inspect every read",
        "raw provider truth",
        "debug surface as tactical command"
      ]
    }
  ],
  "shadows": [
    {
      "id": "runtime-io-authority-shadow",
      "label": "Runtime IO Authority Shadow",
      "why_it_matters": "Separates Live IO blocked from provider failure or no observation.",
      "one_line_meaning": "Runtime live IO authority can allow or block provider and clipboard actions.",
      "must_not_confuse_with_focus": [
        "provider health",
        "No observation",
        "No provider sample yet"
      ],
      "relationship": "gates",
      "adjacent_to": [
        "authority-hint",
        "completeness-feel"
      ],
      "visual_weight": "quiet-critical",
      "narrow_behavior": "Preserve minimal blocked marker only when active."
    },
    {
      "id": "threat-intel-shadow",
      "label": "Threat Intel Shadow",
      "why_it_matters": "Separates Passive context from deliberate scan / No scan.",
      "one_line_meaning": "Threat Intel is operator-initiated inspection, not ambient Passive context.",
      "must_not_confuse_with_focus": [
        "Passive Telemetry",
        "Current system",
        "provider sample"
      ],
      "relationship": "separates-from",
      "adjacent_to": [
        "context-anchor",
        "usability-feel"
      ],
      "visual_weight": "quiet",
      "narrow_behavior": "Collapse first unless Passive reads as background scan."
    }
  ],
  "relationships": [
    {
      "from": "usability-feel",
      "to": "context-anchor",
      "type": "qualifies"
    },
    {
      "from": "activity-texture",
      "to": "context-anchor",
      "type": "supports"
    },
    {
      "from": "completeness-feel",
      "to": "activity-texture",
      "type": "qualifies"
    },
    {
      "from": "authority-hint",
      "to": "completeness-feel",
      "type": "gates"
    },
    {
      "from": "impairment-cue",
      "to": "authority-hint",
      "type": "must-not-collapse"
    },
    {
      "from": "source-detail-reveal",
      "to": "completeness-feel",
      "type": "reveals-detail"
    },
    {
      "from": "threat-intel-shadow",
      "to": "context-anchor",
      "type": "separates-from"
    }
  ]
}
```

## Input Corrections Or Ambiguity Notes

Input correction:

The provided prompt still contained `[Surface name]`. Based on the active conversation and the included Passive Telemetry examples, this capture treats the named surface as:

```txt
Passive Telemetry compact readout / current-system context
```

Meaning correction:

- Do not frame this as UI/UX asking Lab to infer Sense meaning. This is in-house Sense meaning capture before any Lab comparison.
- Do not treat backend fields as UI copy. Source bindings inform slots; they are not copy strings by default.
- Do not create state-based layout slots where a human-intent slot is clearer.
- Do not collapse `No observation`, `No provider sample yet`, `Live IO blocked`, `Degraded`, `Partial sample`, `Capped sample`, `Fresh context`, and `Stale context`.
- Do not promote shadows into full capture surfaces. Shadow panes exist only to prevent Passive misread.

Passive-specific ambiguity notes:

- `Provider pending` is visible in renderer labeling support, but the current service path most clearly supports `No provider sample yet` and stale/blocked/degraded distinctions. Treat `Provider pending` as applicable only where an active snapshot/readout path supports it.
- `Cached activity` appears in the renderer provider/sample presentation path. It is useful basis/detail language, but should not become a new first-glance Passive state unless Human/Overseer accepts that meaning.
- `Ratio` is derived presentation from kills and jumps. It should remain activity texture, not source truth.
- Freshness should be calm. Since Passive uses scoped provider samples, `Fresh context` means fresh within lane/sample basis, not world truth.

## Risks

- A downstream board could overemphasize provider/source machinery and bury the current-system read.
- `Fresh context` could be misread as complete or verified current truth.
- `Stale context` could be made too alarming even though it is a caution state, not a failure state.
- `Live IO blocked` could be softened into generic offline/no-data wording and lose authority meaning.
- `Degraded` could be read as tactical danger or a user fault if styled too loudly.
- `No observation` and `No provider sample yet` could be merged even though one is local-observation absence and the other is provider/sample absence.
- `Ratio` could accidentally become a risk score.
- Threat Intel shadow could pull `Threat`, `Intel`, or `No scan` into Passive focus copy.
- Detail reveal could become so dense that normal operation feels broken or developer-facing.

## Parked Items

- Generated bitmap or final UI mockup.
- Pane Board geometry layout.
- Shape See JSON adapter work.
- Lab comparison request.
- Dev implementation.
- Dev runway.
- Renderer copy changes.
- Runtime/bridge/payload changes.
- Live provider smoke.
- Manual shortcut validation.
- Clipboard Acquisition meaning geometry capture.
- Threat Intel latest-scan meaning geometry capture.

## Verification Note

No verification commands were run.

Reason:

```txt
This is a Sense-local advisory artifact only. It changes no runtime code, renderer behavior, bridge contract, payload, IPC channel, service, CSS/test identifier, backend state field, or Lab project file.
```

Recommended only if this later becomes implementation or formal display workflow input:

```powershell
npm.cmd run verify:protected-terms
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-shell
```

Do not run live provider smoke, live API calls, private-state checks, real SDE refresh, or manual shortcut validation for this capture.
