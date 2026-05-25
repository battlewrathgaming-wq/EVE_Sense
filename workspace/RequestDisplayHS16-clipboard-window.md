# Request Display HS16: Clipboard Acquisition Authority Window

Status: submitted advisory display request, not implementation approval
Project: AURA-Sense
Source owner: AURA-Sense
Request owner: AURA-Sense Overseer
Date: 2026-05-25
Request id: `sense.clipboard-window`
Request strength: `pressure-test`
Active Sense request count: 1 of 5
Expected Lab response location: `F:\Projects\AURA- Lab\workspace\request_display.md` or a Lab-owned response artifact

## Request Received

Create a scoped Sense-owned `request_display` entry for `sense.clipboard-window`, using the accepted UI/UX HS15 review as the source. Submit it to Aura Lab for advisory Bridge -> Interface display comparison only.

This request does not authorize implementation, source-term renames, UI copy changes, bridge changes, IPC changes, payload changes, persistence changes, schema changes, service changes, provider behavior changes, shortcut behavior changes, runtime changes, or Sense adoption.

## Source Meaning To Preserve

Clipboard Acquisition is a short visible authority window for clipboard-based target acquisition inside the Threat Intel acquisition flow.

Sense meaning to preserve:

- The operator opens a bounded authority window.
- Clipboard Acquisition is not background clipboard monitoring.
- Changed clipboard content may be captured only during the active window.
- Unchanged clipboard content from before arming is ignored.
- Capture, rejection, timeout, or cancellation seals the window.
- Cooldown is a deliberate safety interval, not a failure.
- Captured target text enters the deliberate Threat Intel search flow.
- Backend/runtime authority owns clipboard read permission and live IO blocking.
- Renderer display is presentation only.

## Source-Owned Terms

| Term | Owner | Preserve Rule | Notes |
| --- | --- | --- | --- |
| `Clipboard Acquisition` | AURA-Sense | Preserve or explicitly qualify. | Short visible authority window, not monitoring. |
| `Threat Intel` | AURA-Sense | Preserve. | Deliberate scoped inspection, not background intelligence. |
| `Live IO blocked` | AURA-Sense | Preserve meaning exactly. | Backend authority block, not provider failure. |
| `No scan` | AURA-Sense | Preserve meaning exactly. | No deliberate Threat Intel scan exists yet. |
| `Pulling` | AURA-Sense | Preserve lifecycle meaning; Lab may propose safer visible wording if qualified. | Operator-visible acquisition motion/copy. |
| `Listening` | AURA-Sense | Preserve lifecycle meaning; avoid ongoing-monitoring language. | Three-second active capture window. |
| `Cooldown` | AURA-Sense | Preserve lifecycle meaning. | Five-second safety interval after the window closes. |
| `Idle` | AURA-Sense | Preserve lifecycle meaning. | No active clipboard authority window. |
| `Control+\` | AURA-Sense | Preserve when naming preferred shortcut. | Current preferred shortcut label. |
| `Control+Alt+Space` | AURA-Sense | Preserve only when alternate shortcut status applies. | Alternate shortcut status, not a new interaction doctrine. |
| `clipboard.acquisition.snapshot` | AURA-Sense | Preserve as source basis. | Snapshot basis for widget display. |

## Display Problem

Show the short clipboard authority window clearly enough that the operator trusts what is happening, without making it feel like background clipboard monitoring.

Current pressure points:

- Compact overlay space.
- Short active window needs visible state.
- Cooldown and blocked states need to feel intentional, not broken.
- Alternate shortcut/manual path needs to be visible without becoming diagnostics.
- Captured target transition must feel deliberate, not like a hidden scan.
- Existing `Pulling` and `Listening` wording may need pressure-testing against monitoring implications.

## User-Facing Goal

The operator should be able to tell whether clipboard acquisition is idle, active, blocked, captured, rejected, timed out, cooling down, available by shortcut, available by alternate shortcut, or available through manual input.

The operator should also understand that a captured target does not equal an automatic hidden scan.

## Bounded Ask

Aura Lab should compare up to three Bridge -> Interface display methods for one flow slice:

```txt
Clipboard Acquisition widget inside the Threat Intel acquisition bar
```

Candidate comparison questions:

1. How can Sense show a three-second active clipboard authority window and five-second cooldown in a compact widget without implying background clipboard monitoring?
2. What display method best separates shortcut availability, alternate shortcut, `Live IO blocked`, and manual path without turning the widget into diagnostics?
3. How should the captured-target transition into Threat Intel be shown so the operator sees deliberate acquisition, not a hidden scan?

## Scope

In scope:

- Clipboard widget.
- Key chips / shortcut indicator.
- Acquisition status label.
- Clipboard lifecycle states.
- Captured target transition into Threat Intel.
- Alternate shortcut status.
- Manual input path as a deliberate alternate input.
- `Live IO blocked` display.
- Timeout, rejection, cancellation, and cooldown states.
- Compact/narrow overlay behavior.

Out of scope:

- Threat Intel provider result layout.
- Full Threat Intel drawer redesign.
- Gateway marker semantics.
- Shortcut behavior changes.
- Runtime/live IO policy changes.
- Backend, bridge, IPC, payload, schema, service, provider, persistence, or renderer behavior changes.
- New data fields or runtime requirements.
- Sense adoption or implementation.

## Known Fields And Display Facts

- Clipboard snapshot state.
- Snapshot message or reason, where available.
- Captured target text, where available.
- Shortcut registered state.
- Alternate shortcut status.
- Shortcut unavailable / manual path state.
- Live IO enabled or blocked.
- Current Threat target display.
- Three-second active window.
- Five-second cooldown.
- Unchanged clipboard ignored after arming.

## State Cases

- idle
- pulling / arming
- listening, three-second window
- captured target
- scan pending after capture
- rejected clipboard content
- unchanged clipboard content ignored
- timeout
- cancellation
- cooldown, five-second interval
- `Live IO blocked`
- shortcut registered
- alternate shortcut registered
- shortcut unavailable / manual path

## Freshness / Basis / Authority Needs

- Show that the widget is based on `clipboard.acquisition.snapshot`.
- Show active authority only while the short window is open.
- Show closed/cooldown/blocked states distinctly.
- Keep manual input visible as deliberate alternate input.
- Keep backend/runtime authority distinct from renderer presentation.
- Keep Threat Intel scan initiation distinct from clipboard capture.

## Must Not Imply

- background clipboard monitoring
- persistent listener mode
- hidden scan
- scan on focus alone
- automatic provider calls
- broad target identification
- guessed target identity
- Lab-owned runtime authority
- Atlas-owned historical proof, storage, assessment, routine-check, or stored-record semantics
- cooldown as failure
- `Live IO blocked` as provider failure
- manual path as a Lab-owned alternate-truth state

## Non-Goals

- Do not redefine Sense meaning.
- Do not rename source-owned terms unless proposing clearly qualified visible wording options for Sense review.
- Do not create a Dev runway.
- Do not create a durable bridge contract.
- Do not turn inventory rows into active work.
- Do not submit follow-up requests automatically.
- Do not create implementation requirements.

## Context / Sources

Sense source artifacts:

- `workspace/display_inventory.md`
- `workspace/request_display.md`
- `workspace/display-request-workflow-hardening-contract.md`
- `workspace/UIUXHS15-clipboard-window-request-display-review.md`
- `workspace/OverseerHS15-clipboard-window-request-display-review-acceptance.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/features/clipboard-acquisition.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `src/renderer/index.html`
- `src/renderer/app.js`

Lab workflow context:

- `F:\Projects\AURA- Lab\workspace\request_display.md`
- `F:\Projects\AURA- Lab\workspace\display-request-cooperation-contract.md`

## Adoption Reviewer

Sense Overseer / Human.

Lab response is advisory only. Sense must accept, adapt, reject, park, or return the response before any implementation packet exists.

## Response Expectations

The Lab response should include:

- scope readback
- source terms to preserve or qualify
- up to three candidate display methods
- state clarity risks
- wording risks
- density/narrow overlay risks
- missing state or field needs, if any
- what should remain parked
- recommended disposition: accept candidate, adapt, split, narrow, park, or return to Sense

## Optional Lab Mapping

Lab may map this request through its own display-planning vocabulary:

- display slots
- display types
- material sets
- candidate display methods

These are optional Lab tools. They are not Sense bridge fields, payload fields, runtime states, or Sense doctrine.

## Verification If Later Implemented

If Sense later accepts a Lab direction and opens Dev work, likely verification should include:

- clipboard race verification
- renderer shell check
- Electron visual smoke if layout/CSS changes
- protected-term check

No live provider smoke, manual shortcut validation, real SDE refresh/download, or implementation verification is authorized by this request.
