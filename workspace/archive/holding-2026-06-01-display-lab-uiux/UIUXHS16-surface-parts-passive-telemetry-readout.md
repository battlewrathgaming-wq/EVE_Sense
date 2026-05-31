# UIUXHS16: Surface Parts Capture - Passive Telemetry Readout

Status: UI/UX advisory, Shape See / Pane Board surface-parts capture, not implementation authority
Date: 2026-05-26
Role: AURA-Sense UI/UX advisory reviewer
Surface: Passive Telemetry compact readout / current-system context

## Request Received

Create a Sense-owned UI/UX advisory before Pane Board layout work.

The goal is to identify meaningful display parts first, then arrange them later. This is a first workflow test for projecting Sense meaning into a universal shaping UI where interpreted parts may be placed as focus shapes and bounded shadow context.

This artifact is:

- not implementation
- not adapter work
- not a bridge/runtime contract
- not product adoption
- not generated UI
- not a Dev runway
- not a Lab request

Sense keeps source meaning and final adoption.

## Files Reviewed

- `AGENTS.md`
- `workspace/current.md`
- `workspace/overview.md`
- `workspace/critical/critical-terms.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/current-state/current-implementation.md`
- `docs/contracts/telemetry-lane-contract.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `workspace/UIUXHS03-passive-telemetry-instrument-band-advisory.md`

## Intent / Focus Slice

Focus slice:

```txt
Passive Telemetry compact readout / current-system context
```

User task:

```txt
Help the operator understand current-system context at a glance while staying in EVE flow.
```

Why this is the first Shape See test:

- Passive Telemetry has many trust and freshness distinctions.
- It is less authority-risky than Clipboard Acquisition.
- It already has a compact band in the renderer.
- Its meaning depends heavily on nearby lane separation, which makes it a good test for focus shapes plus shadow panes.

Primary meaning to protect:

```txt
Passive Telemetry is low-frequency current-system context derived from local observation and scoped provider samples.
```

It must not become:

- complete system awareness
- background Threat Intel
- tactical risk score
- provider truth

## Sense Principle

Universalize structure, not meaning.

Pane Board may arrange interpreted parts. It must not turn raw backend fields into UI copy, shared doctrine, a bridge contract, or source truth.

Shape See should treat this artifact as a semantic staging map:

```txt
Sense-owned meaning -> interpreted focus parts -> bounded shadow context -> later layout exploration
```

## Focus Shapes

These are the meaning-bearing parts for the first board. They should be solid, legible, and available for layout experiments.

| Focus shape id | Display part | Meaning | Suggested board role | Weight |
| --- | --- | --- | --- | --- |
| `passive.lane-label` | `Passive Telemetry` | Names the lane and prevents context from reading as Threat Intel or Combat Witness. | `status-band` | primary |
| `passive.current-system` | `Current system` + system label | The first-read subject of the band. | `central-readout` | primary |
| `passive.activity-kills` | `Kills` | ESI aggregate activity support context. | `context-rail` | support |
| `passive.activity-jumps` | `Jumps` | ESI aggregate activity support context. | `context-rail` | support |
| `passive.activity-ratio` | `Ratio` | Derived support context; should not become a risk score. | `context-rail` | quiet-support |
| `passive.state` | `Fresh context`, `Stale context`, etc. | Sense-owned freshness/sample/gate state. | `status-band` | primary |
| `passive.basis` | source / basis / freshness line | Explains what the readout rests on. | `context-rail` | support-critical |
| `passive.gap-edge` | gap/warning marker | Reveals stale, partial, capped, blocked, degraded, no-provider, or no-observation limits. | `warning-gap-edge` | support-critical |
| `passive.detail` | diagnostics/detail reveal | Holds secondary source/freshness/sample/gate facts. | `detail-drawer` | hidden-support |

First-read grouping:

```txt
Passive Telemetry
-> Current system
-> Sense state
-> basis/freshness
```

Supporting read:

```txt
Kills / Jumps / Ratio
-> source and sample context
-> warning or gap edge
```

## Focus State Parts

These state parts should stay distinct on the board. Do not collapse them into a single generic unavailable/no-data condition.

| State part | Meaning to preserve | Board treatment |
| --- | --- | --- |
| `Fresh context` | Passive context is fresh within this lane's basis. | Calm positive, not global truth. |
| `Stale context` | Existing context is aged beyond freshness expectation. | Caution, not failure. |
| `Partial sample` | Provider/sample response is incomplete. | Caution near sample/basis. |
| `Capped sample` | Sample/display was capped. | Caution near sample count. |
| `Live IO blocked` | Backend authority gate prevented live provider IO. | Authority edge; distinct from failure. |
| `Degraded` | Provider/runtime/resolution impairment. | Impairment; distinct from blocked and stale. |
| `No observation` | No current-system observation exists for Passive context. | Quiet absence; not no-data generic. |
| `No provider sample yet` | Current system may exist, but provider context is absent/pending. | Basis/gap detail, not the whole lane state. |

## Supporting Source / Basis Parts

These are not headline meanings by themselves. They should remain attached to basis/freshness/detail zones.

| Source/basis part | Meaning | Placement guidance |
| --- | --- | --- |
| `ESI activity` | Aggregate system kills/jumps source. | Support rail or detail; never risk score. |
| `zKill system context` | Scoped system context sample. | Basis/detail with sample/cap/partial caveat. |
| `local/static resolver status` | Local/static lookup for system identity. | Basis/detail; only show as static/local when source supports it. |
| `freshness/age` | How old the current provider/context basis is. | Near state or basis, not hidden in diagnostics only. |
| `provider/sample basis` | What supports the visible readout. | Always reachable from the focus shape. |

## Avoid Or Qualify

Avoid as default board/display language:

- `No data`
- bare `Current`
- bare `Threat`
- bare `Intel`
- `Evidence`
- `Watch`
- `Monitoring`
- `Truth`
- `Verified`
- `Certainty`
- `Fallback`
- `Pulse`

Allowed only when qualified:

- `Threat Intel` as the Sense-owned deliberate scan lane.
- `No scan` as a Threat Intel shadow state, not a Passive state.
- `Static lookup` or local/static resolver wording only when source fields support it.
- Provider/sample terms only with scope, partial, cap, freshness, or blocked context where relevant.

## Shadow State Rule

Shadow states are allowed for context, not full capture.

Use shadows to prevent misread of Passive Telemetry. They should be translucent, lower-weight, and relationship-labeled. They are not the focus and should not pull detail work into this slice.

Allowed shadow panes:

- Combat Witness summary shadow
- Threat Intel / No scan shadow
- Clipboard Acquisition authority shadow
- Runtime IO authority shadow
- Diagnostics shadow

Highest-priority shadows:

1. Runtime IO authority shadow, because it separates `Live IO blocked` from provider failure or `No observation`.
2. Threat Intel shadow, because it separates Passive context from deliberate scan / `No scan`.

## Shadow Panes

| Shadow pane id | Why it matters | One-line meaning | Must not be confused with Passive Telemetry | Adjacency recommendation |
| --- | --- | --- | --- | --- |
| `shadow.runtime-io-authority` | Explains `Live IO blocked` as authority state. | Backend live IO policy can allow or block provider/clipboard actions. | Provider failure, no provider sample, no observation. | Adjacent to `passive.gap-edge`; keep visible even in narrow mode. |
| `shadow.threat-intel-no-scan` | Prevents Passive from reading as scan/intel. | Threat Intel is deliberate operator-initiated inspection; `No scan` means none has run. | Passive current-system context, ESI/zKill aggregate support, background scan. | Separate lane shadow; visible as boundary marker, hidden detail in narrow. |
| `shadow.combat-witness-summary` | Shows primary tactical face pressure without absorbing Passive. | Combat Witness is recent observed combat-log pressure/repair state. | Current-system context, provider sample, system activity. | Keep outside Passive group; can be quiet in narrow. |
| `shadow.clipboard-acquisition-authority` | Shows active permission path is separate from Passive observation. | Clipboard Acquisition is an I/O-gated operator permission action feeding Threat Intel. | Passive parser-observed current-system context. | Keep separated from Passive; hide in narrow unless comparing Active/Passive boundaries. |
| `shadow.diagnostics` | Shows where deeper basis/gaps live. | Diagnostics support trust and detail without owning first glance. | Primary readout, source truth, generated certainty. | Attach as reveal target; hidden in narrow until invoked. |

## Relationship Types

Recommended relationship vocabulary for Shape See:

| Relationship | Use |
| --- | --- |
| `contains` | A band or drawer contains focus parts. |
| `qualifies` | State/basis/gap modifies a primary value. |
| `supports` | Activity/source parts support the readout but are not the claim. |
| `gates` | Runtime authority affects provider availability. |
| `separates-from` | Shadow pane prevents semantic bleed. |
| `reveals-detail` | Detail drawer exposes diagnostics/basis. |
| `must-not-collapse` | Two states must remain distinct. |
| `hide-in-narrow` | Shadow/detail can drop out under space pressure. |

Critical relationships:

- `passive.state` qualifies `passive.current-system`.
- `passive.basis` supports `passive.state`.
- `passive.gap-edge` must-not-collapse `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, and `No observation`.
- `shadow.runtime-io-authority` gates provider availability but does not define provider health.
- `shadow.threat-intel-no-scan` separates Passive context from deliberate scan state.

## Spatial Grouping Ideas

Recommended Pane Board groups:

- `status-band`: lane label + state + gap marker
- `central-readout`: current system
- `context-rail`: kills, jumps, ratio
- `warning-gap-edge`: stale, partial, capped, blocked, degraded, no-observation markers
- `detail-drawer`: source, basis, freshness, resolver, provider sample details
- `diagnostics`: secondary runtime/source facts
- `actions`: none for this slice unless later adopted; Passive should not become an action surface by default
- `shadow-context`: bounded nearby panes for separation and crowding judgment

Stable spatial recommendation:

```txt
[status-band]
  Passive Telemetry | state | gap edge

[central-readout]
  Current system

[context-rail]
  Kills | Jumps | Ratio

[detail-drawer]
  basis / freshness / source / resolver / sample details

[shadow-context]
  Runtime IO authority + Threat Intel No scan as nearest shadows
```

## Advisory JSON Sketch

This JSON is a Shape See/Panes advisory sketch only. It is not runtime payload, adapter schema, bridge contract, or generated UI.

```json
{
  "board_intent": {
    "project": "AURA-Sense",
    "surface": "Passive Telemetry compact readout",
    "mode": "surface-parts-capture",
    "authority": "Sense-owned meaning; Pane Board arranges interpreted parts only",
    "not_authorized": [
      "implementation",
      "adapter work",
      "bridge contract",
      "runtime contract",
      "product adoption",
      "generated UI",
      "Dev runway"
    ]
  },
  "focus": [
    {
      "id": "passive.lane-label",
      "label": "Passive Telemetry",
      "meaning": "low-frequency current-system context lane",
      "group": "status-band",
      "weight": "primary",
      "preserve_exact": true
    },
    {
      "id": "passive.current-system",
      "label": "Current system",
      "meaning": "first-read current-system context from local observation",
      "group": "central-readout",
      "weight": "primary",
      "must_not_imply": ["complete system awareness"]
    },
    {
      "id": "passive.activity",
      "label": "Kills / Jumps / Ratio",
      "meaning": "supporting aggregate activity context",
      "group": "context-rail",
      "weight": "support",
      "must_not_imply": ["tactical risk score", "provider truth"]
    },
    {
      "id": "passive.state",
      "label": "Fresh context / Stale context / Partial sample / Capped sample / Live IO blocked / Degraded / No observation",
      "meaning": "Sense-owned state distinction",
      "group": "status-band",
      "weight": "support-critical",
      "must_not_collapse": true
    },
    {
      "id": "passive.basis",
      "label": "source / basis / freshness",
      "meaning": "what supports the visible context",
      "group": "context-rail",
      "weight": "support-critical"
    },
    {
      "id": "passive.gap-edge",
      "label": "warning / gap edge",
      "meaning": "visible limits: stale, partial, capped, blocked, degraded, absent",
      "group": "warning-gap-edge",
      "weight": "support-critical"
    }
  ],
  "shadow": [
    {
      "id": "shadow.runtime-io-authority",
      "why_it_matters": "separates Live IO blocked from provider failure or no observation",
      "meaning": "backend live IO authority state",
      "must_not_confuse_with_passive": "provider health or Passive absence",
      "adjacency": "near warning-gap-edge; visible in narrow"
    },
    {
      "id": "shadow.threat-intel-no-scan",
      "why_it_matters": "separates Passive context from deliberate scan state",
      "meaning": "Threat Intel is operator-initiated; No scan means none has run",
      "must_not_confuse_with_passive": "current-system context or provider sample",
      "adjacency": "near but visually separated; collapse detail in narrow"
    },
    {
      "id": "shadow.combat-witness-summary",
      "why_it_matters": "shows the primary tactical lane competing for attention",
      "meaning": "recent observed combat-log pressure summary",
      "must_not_confuse_with_passive": "system context or provider activity",
      "adjacency": "quiet outer shadow"
    },
    {
      "id": "shadow.clipboard-acquisition-authority",
      "why_it_matters": "keeps Active permission actions separate from Passive observation",
      "meaning": "I/O-gated operator permission action feeding Threat Intel",
      "must_not_confuse_with_passive": "parser-observed current-system context",
      "adjacency": "separate lane shadow; hide unless comparing Active/Passive"
    },
    {
      "id": "shadow.diagnostics",
      "why_it_matters": "holds deeper basis and trust detail",
      "meaning": "support surface for source/freshness/gap review",
      "must_not_confuse_with_passive": "first glance or source truth",
      "adjacency": "detail reveal target"
    }
  ],
  "relationships": [
    { "from": "passive.state", "to": "passive.current-system", "type": "qualifies" },
    { "from": "passive.basis", "to": "passive.state", "type": "supports" },
    { "from": "passive.gap-edge", "to": "passive.state", "type": "must-not-collapse" },
    { "from": "shadow.runtime-io-authority", "to": "passive.gap-edge", "type": "gates" },
    { "from": "shadow.threat-intel-no-scan", "to": "passive.lane-label", "type": "separates-from" },
    { "from": "shadow.diagnostics", "to": "passive.basis", "type": "reveals-detail" }
  ]
}
```

## Pane Board Test Guidance

For the first board test, do not try to recreate the current renderer.

Instead, test whether the board can answer:

1. What is the focus?
2. What are the focus parts?
3. Which state distinctions must remain visibly separate?
4. Which shadow panes prevent misreading?
5. What can be hidden in narrow mode without losing meaning?

Success looks like:

- `Passive Telemetry` remains the lane anchor.
- `Current system` is the central readout.
- `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, and `No observation` remain distinct.
- Runtime IO authority and Threat Intel shadows clarify meaning rather than adding clutter.
- Kills, jumps, and ratio read as support context, not a score.

## Risks

- The board may overfit geometry before meaning is stable.
- Shadow panes may become full capture surfaces and overcrowd the focus.
- `Current system` may be read as complete system awareness if freshness/basis is too far away.
- `Ratio` may be read as a tactical risk score.
- `Live IO blocked` may be misread as provider failure if runtime authority is not nearby.
- `No observation` may be collapsed into generic `No data`.
- Threat shadow may accidentally make Passive look like background Threat Intel.
- Provider/source words may imply truth or verification if not qualified.

## Parked Items

- Actual Pane Board layout.
- Bitmap generation.
- JSON adapter/schema work.
- Dev implementation.
- Lab request submission.
- Clipboard Acquisition surface parts capture.
- Threat Intel latest-scan surface parts capture.
- Provider pulse row review.
- Dedicated Passive detail reveal design.

## Verification

No verification commands were run.

Reason:

```txt
This is a Sense-local UI/UX advisory artifact only. It changes no implementation, runtime behavior, bridge contract, payload, IPC channel, source term, or UI copy.
```

Recommended later checks only if this becomes implementation or formal display workflow input:

- `npm.cmd run verify:protected-terms` for terminology review.
- Renderer shell / visual smoke only if a future Dev packet changes renderer layout or copy.

## Recommended Next Move

Use this artifact as the first Shape See / Pane Board test input.

Recommended test:

```txt
Render focus shapes first.
Add only Runtime IO authority and Threat Intel / No scan as highest-priority shadows.
Then add remaining shadows one at a time to test crowding and semantic bleed.
```

If the workflow feels good, the next advisory prompt can use the same structure for `Clipboard Acquisition` or `Threat Intel latest scan`.
