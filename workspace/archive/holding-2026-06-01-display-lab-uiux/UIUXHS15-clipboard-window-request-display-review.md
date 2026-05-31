# UIUXHS15: Clipboard Window Request Display Review

Status: UI/UX advisory review only, not a RequestDisplay artifact
Role: AURA-Sense UI/UX advisory reviewer
Date: 2026-05-25
Candidate: `sense.clipboard-window`

## Request Received

Review `sense.clipboard-window` as a review-only display-request pointer candidate.

Decision required:

```txt
needs-scope | request-ready | parked | needs Sense meaning clarification
```

Guardrails honored:

- No `RequestDisplayHS##-clipboard-window.md` artifact was created.
- Nothing was submitted to Aura Lab.
- No code was implemented.
- No UI copy or runtime behavior was changed.
- No Sense terms, contracts, payloads, IPC channels, CSS/test identifiers, services, or source meanings were renamed.

## Files Reviewed

Sense authority and workflow:

- `AGENTS.md`
- `workspace/current.md`
- `workspace/display_inventory.md`
- `workspace/request_display.md`
- `workspace/display-request-workflow-hardening-contract.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`

Current state, feature, and contracts:

- `docs/current-state/display-pipeline-inventory.md`
- `docs/current-state/current-implementation.md`
- `docs/features/clipboard-acquisition.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/threat-intel-contract.md`

Current renderer presentation:

- `src/renderer/index.html`
- `src/renderer/app.js`

Display request workflow context:

- `F:\Projects\Docs\Aura-Project-Orchestration\known-workflows\display-request-conformity-brief.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\known-workflows\display_request.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\workflow-maps\display-request-space-to-state.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\templates\request_display-template.md`
- `F:\Projects\AURA- Lab\workspace\request_display.md`
- `F:\Projects\AURA- Lab\workspace\display-request-cooperation-contract.md`

## Current-State Understanding

`sense.clipboard-window` is an inventory row for the visible Clipboard Acquisition widget inside the Threat Intel acquisition bar. It is not an active Lab request.

Current pipeline:

```txt
operator shortcut or UI arm
-> short Clipboard Acquisition authority window
-> clipboard snapshot / capture result
-> Threat Intel scan request only when a valid target is captured
-> renderer displays state, target, shortcut, and blocked/cooldown feedback
```

Current UI surface:

- The Threat drawer contains `#threat-acquisition-bar`.
- The clipboard widget is `#clipboard-listen` with key chips and `#clipboard-state`.
- The acquisition bar also shows `#threat-acquisition-status` and `#threat-display-target`.
- Diagnostics include `#shortcut-message`.
- Live IO state can mark the widget unsupported/blocked through the runtime authority control.

Current implementation facts from renderer/docs:

- Preferred shortcut is `Control+\`.
- Fallback shortcut status may report `Control+Alt+Space`; manual operation remains available.
- Clipboard Acquisition opens a 3 second listening window.
- It ignores unchanged clipboard content from before arming.
- It seals after capture, rejection, timeout, or cancellation.
- It enforces a 5 second cooldown before re-arming.
- The scan remains a Threat Intel search-box workflow.

## Clipboard Acquisition Display Problem

The display problem is bounded and real:

```txt
Show the short clipboard authority window clearly enough that the operator trusts what is happening, without making it feel like background clipboard monitoring.
```

Specific presentation tensions:

- The widget must be compact enough for the overlay.
- The user needs to see when authority is active, blocked, cooling down, or idle.
- The state must explain shortcut fallback and live IO authority without becoming a diagnostics panel.
- Captured target flow must feel deliberate, not like a hidden scan.
- Current renderer behavior can expose both `Listening` in the acquisition bar and `Pulling` in the widget, which is a useful candidate for Lab pressure-testing but not a reason to rename Sense terms here.

## Source-Owned Terms And Lifecycle States

Sense-owned terms to preserve or qualify:

- `Clipboard Acquisition`
- `Threat Intel`
- `Live IO blocked`
- `No scan`
- `Control+\`
- `Control+Alt+Space`, when fallback status applies
- `Pulling`
- `Listening`
- `Cooldown`
- `Idle`
- `blocked`
- `clipboard.acquisition.snapshot`

Lifecycle states and meanings:

| State / display term | Meaning to preserve |
| --- | --- |
| `Idle` | No active clipboard authority window. |
| `Pulling` | Operator-visible acquisition motion/copy for the clipboard target path. Must remain bounded. |
| `Listening` | The short active window in which changed clipboard content may be captured. |
| `Cooldown` | Deliberate safety interval after capture, rejection, timeout, or cancellation. |
| `blocked` / `Live IO blocked` | Backend authority gate prevents clipboard/provider IO. Not provider failure and not no scan. |
| `No scan` | No deliberate Threat Intel scan result exists yet. Not clipboard failure. |

Meaning clarification is not blocking this request, but the future request should ask Sense Overseer/Human to decide whether `Pulling`, `Listening`, and `Cooldown` are preserve-exact after the bridge or may be translated by Lab while preserving the same lifecycle meaning.

## State/Basis/Authority Needs

A future scoped request must require Lab to preserve these needs.

State cases:

- idle
- pulling / arming
- listening, 3 second window
- captured target
- scan pending after capture
- rejected clipboard content
- unchanged clipboard content ignored
- timeout
- cancellation
- cooldown, 5 second interval
- live IO blocked
- shortcut registered
- shortcut fallback registered
- shortcut unavailable / manual path

Basis needs:

- The widget is based on `clipboard.acquisition.snapshot`.
- Captured target text belongs to the Threat Intel search flow.
- Shortcut status comes from runtime shortcut reporting, not Lab or renderer guesswork.
- Live IO authority comes from backend runtime policy.
- The renderer displays state; it does not own capture authority.

Authority needs:

- Show when the operator has opened a short authority window.
- Show when authority is closed or cooling down.
- Show when live IO prevents clipboard acquisition.
- Keep manual search available as a separate deliberate fallback path.
- Keep the back-page Threat Intel boundary visible enough that acquisition does not feel like background scanning.

## Must-Not-Imply Constraints

The future request must not imply:

- background clipboard monitoring
- persistent listener mode
- hidden scan
- scan on focus alone
- automatic provider calls without operator/session intent
- broad target discovery
- guessed target identity
- Lab-owned runtime authority
- Atlas-style history, storage, proof, assessment, or watch semantics
- that cooldown is a failure
- that live IO blocked is provider failure
- that manual fallback is a Lab `FALLBACK` state

## Recommended Lifecycle Status

Recommended status:

```txt
request-ready
```

Reason:

`sense.clipboard-window` is narrow enough to become a local scoped `RequestDisplayHS##-clipboard-window.md` artifact. The current inventory row already identifies the surface, source terms, state/basis needs, must-not-imply constraints, likely request strength, and verification expectations. The remaining wording question around `Pulling` / `Listening` / `Cooldown` should be captured inside the future local request, not treated as a blocker.

Important boundary:

```txt
request-ready != submitted to Lab
request-ready != accepted Lab recommendation
request-ready != Dev authorization
```

## Recommended Request Strength

Recommended request strength:

```txt
pressure-test
```

Rationale:

Sense already has a likely direction: compact visible authority window inside the Threat acquisition surface. The useful Lab contribution would be to stress that direction against state clarity, shortcut fallback, density, warning language, and narrow overlay constraints.

## Required Contents For A Future RequestDisplayHS##-clipboard-window.md

A future local request artifact should include:

- advisory preamble stating no implementation is authorized
- source inventory ID: `sense.clipboard-window`
- request ID: `sense.clipboard-window`
- status: `request-ready` or `queued`, depending on Overseer decision
- request strength: `pressure-test`
- source owner: `AURA-Sense`
- product area: `Threat Intel / Clipboard Acquisition`
- surface: clipboard widget inside Threat acquisition bar
- user task: understand whether clipboard acquisition is idle, active, blocked, captured, cooling down, or available through shortcut/manual path
- scope boundary: one flow slice, not the whole Threat Intel drawer
- included items:
  - clipboard widget
  - key chips
  - acquisition status label
  - target display transition after capture
  - shortcut/fallback status
  - live IO blocked display
  - timeout/rejection/cooldown states
- excluded items:
  - Threat Intel provider result layout
  - full Threat acquisition bar redesign
  - Gateway marker semantics
  - shortcut behavior changes
  - runtime/live IO policy changes
  - backend, bridge, IPC, payload, schema, service, provider, or persistence changes
- source-owned terms to preserve or qualify:
  - `Clipboard Acquisition`
  - `Threat Intel`
  - `Pulling`
  - `Listening`
  - `Cooldown`
  - `Live IO blocked`
  - `No scan`
  - `Control+\`
- known fields/display facts:
  - clipboard snapshot state
  - snapshot message/reason where available
  - last captured target text where available
  - shortcut registered/fallback/manual status
  - live IO enabled/blocked state
  - current Threat target display
- state cases:
  - idle, pulling, listening, captured, rejected, timeout, cancellation, cooldown, blocked, fallback shortcut, manual path
- basis/authority needs:
  - short 3 second window
  - 5 second cooldown
  - unchanged clipboard ignored
  - backend authority owns clipboard read
  - renderer is presentation-only
- warning/gap needs:
  - no background monitoring
  - no hidden scan
  - no provider call unless deliberate Threat Intel scan path starts
- density/layout constraints:
  - compact overlay
  - narrow viewport
  - visible state text, not color alone
  - no layout shift from long fallback shortcut copy
- response expectation:
  - compare up to three display methods
  - identify wording risks
  - identify missing state cases or fields needed for display
  - return advisory options only
- adoption reviewer:
  - Sense Overseer / Human
- verification if later implemented:
  - clipboard race verification
  - renderer shell check
  - Electron visual smoke if layout/CSS changes
  - protected-term check

## Up To Three Possible Lab Comparison Questions

1. How can Sense show a 3 second active clipboard authority window and 5 second cooldown in a compact widget without implying background clipboard monitoring?
2. What display method best separates shortcut availability, fallback shortcut, live IO blocked, and manual path without turning the widget into diagnostics?
3. How should the captured-target transition into Threat Intel be shown so the operator sees deliberate acquisition, not a hidden scan?

## Risks

- Lab could translate `Listening` into ongoing monitoring language.
- Lab could collapse `Pulling` and `Listening` in a way that hides the 3 second authority window.
- Lab could treat live IO blocked as provider failure or generic unavailable state.
- A request that includes the whole Threat acquisition bar could become too broad and should be narrowed.
- The current UI's split between acquisition bar status and widget state can be confusing if not explicitly scoped.
- Shortcut fallback copy can become visually too long for the compact widget.
- Captured target display can look like an automatic scan if the Threat Intel boundary is not preserved.
- Manual fallback wording can be mistaken for Lab-style `FALLBACK` unless framed as manual input fallback only.

## Parked Items

- Full `sense.threat-acquisition-bar` comparison.
- `sense.gateway-marker` translation or preserve-exact decision.
- Full shortcut documentation/runtime validation beyond display scoping.
- Threat latest-scan review.
- Provider pulse row wording.
- Live IO control redesign.
- Any Dev implementation runway.
- Any Aura Lab request submission.

## Verification Results

Ran:

```powershell
npm.cmd run verify:protected-terms
git status --short --branch
```

Results:

- `npm.cmd run verify:protected-terms` passed in warning-only mode.
- Protected-term discovery scanned 1 changed file and reported 18 warning-only items.
- Warnings were expected review cues around Atlas-owned `Discovery` / `Watch`, Sense `Report`, and Sense `Fallback` wording. In this artifact those terms are used as qualified risk/non-goal, display workflow reporting, or shortcut/manual fallback discussion, not as rename instructions or new Sense meaning.
- The verifier confirmed no renames were performed and no protected-word JSON updates were performed.
- `git status --short --branch` returned `## main...origin/main` and one untracked artifact: `workspace/UIUXHS15-clipboard-window-request-display-review.md`.

No live provider smoke, manual shortcut validation, real SDE refresh/download, implementation verification suite, or Electron smoke is required for this review-only artifact.
