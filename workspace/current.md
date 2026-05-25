# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer planning, UI/UX advisory execution

## Coordination State

Active milestone: Milestone 15 - Display Request Scoping Review
Roadmap source: post-Milestone-14 display inventory and request workflow hardening
Sequence: HS15
Previous accepted handshake: `workspace/OverseerHS14-workflow-documentation-sweep.md`
Current executor: UI/UX advisory reviewer
Current objective: review the first Sense `request_display` pointer candidate before any Lab submission
Expected output: `workspace/UIUXHS15-clipboard-window-request-display-review.md`
Archive target on milestone completion: `workspace/complete/milestone-15/`
Runway type: UIUX advisory / request-display scoping

## Purpose

This is the only active work packet.

The packet asks for a review-only UI/UX advisory pass on the first Sense display-request candidate:

```txt
sense.clipboard-window
```

The goal is to decide whether Clipboard Acquisition is ready to become a local scoped `RequestDisplayHS##-[topic].md` artifact for Sense review.

This packet does not submit anything to Aura Lab. It does not authorize implementation, UI copy changes, bridge changes, IPC changes, payload changes, persistence changes, schemas, services, provider behavior, runtime behavior, or a Dev runway.

## Required Reading

Boot and coordination:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`

Display/request workflow:

- `workspace/display_inventory.md`
- `workspace/request_display.md`
- `workspace/display-request-workflow-hardening-contract.md`
- `docs/current-state/display-pipeline-inventory.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\known-workflows\display-request-conformity-brief.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\known-workflows\display_request.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\workflow-maps\display-request-space-to-state.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\templates\request_display-template.md`

Current product context:

- `docs/current-state/current-implementation.md`
- `docs/features/clipboard-acquisition.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `src/renderer/index.html`
- `src/renderer/app.js`

Lab context, advisory only:

- `F:\Projects\AURA- Lab\workspace\request_display.md`
- `F:\Projects\AURA- Lab\workspace\display-request-cooperation-contract.md`

## Advisory Request

Request:

- Review `sense.clipboard-window` as the first Sense display-request pointer candidate.
- Determine whether it is ready to become a local scoped request artifact named like `workspace/RequestDisplayHS##-clipboard-window.md`.
- Keep the review bounded to Clipboard Acquisition presentation and authority-state clarity.
- Recommend request strength: likely `pressure-test`, unless the reviewer finds `formative` or `comparative` more accurate.
- Identify what Sense must preserve before any Lab display comparison.
- Identify what Lab could usefully compare later, without creating the request or submitting it.

Expected artifact:

```txt
workspace/UIUXHS15-clipboard-window-request-display-review.md
```

Required artifact section:

```txt
Request Received
```

The artifact should restate this request so Overseer can trace what was answered.

Breadth allowed:

- Clipboard Acquisition widget and its adjacent Threat Intel acquisition context.
- The current `display_inventory.md` row for `sense.clipboard-window`.
- Short lifecycle states such as `Pulling`, `Listening`, `Cooldown`, `Idle`, blocked, timeout, and rejection reasons.
- Shortcut status and live-IO authority visibility where they affect Clipboard Acquisition presentation.
- Narrow or overlay behavior only where it affects the bounded authority window.

Authority limits:

- Do not decide Sense adoption.
- Do not create or submit a `request_display` entry.
- Do not write a `RequestDisplayHS##` artifact.
- Do not treat Lab vocabulary as Sense authority.
- Do not rename Sense terms.
- Do not recommend backend, bridge, IPC, payload, schema, persistence, service, provider, or runtime changes.

## Advisory Artifact Review

Overseer checks this before writing or refreshing any next packet.

Active advisory artifacts reviewed:

- None yet for HS15.

Relevant unresolved inactive items checked in `workspace/archive/`:

- None required unless the reviewer finds Clipboard Acquisition terminology unclear from active docs.

Disposition:

- accepted into this packet: Clipboard Acquisition request-display scoping review
- deferred: Threat latest-scan review, Passive state/basis, Threat acquisition bar, provider pulse row
- rejected: none
- escalated to human: preserve-exact versus Lab-translatable lifecycle wording, if unclear
- promoted into durable docs: none from this packet unless Overseer later accepts a truth change
- left inactive in archive: archived terminology audits unless explicitly reopened

## Advisory Objective

Produce a review-only recommendation that tells Sense whether `sense.clipboard-window` is ready for a local scoped request artifact, and what that artifact should require if opened later.

The review should preserve this pipeline:

```txt
display_inventory row
-> local RequestDisplayHS##-[topic].md
-> submitted Lab request_display entry
-> Lab recommendation
-> Sense adoption review
-> optional Sense current.md Dev runway
```

## Ordered Runway

1. Read the required files and confirm the current active work is advisory review only.
2. Inspect the current Clipboard Acquisition presentation and adjacent Threat Intel acquisition context.
3. Map the current Clipboard Acquisition display problem against source-owned Sense terms, known fields, lifecycle states, authority states, risks, and non-goals.
4. Decide whether `sense.clipboard-window` should be:
   - `needs-scope`
   - `request-ready`
   - `parked`
   - returned to Sense for meaning clarification
5. If request-ready, outline the required contents for a future local `RequestDisplayHS##-clipboard-window.md` artifact without writing it.
6. Recommend up to three display-comparison questions Lab could answer later, if Sense chooses to submit.
7. Record risks, parked items, and required verification expectations for any later implementation packet.
8. Create `workspace/UIUXHS15-clipboard-window-request-display-review.md`.

## Acceptance Criteria

HS15 can be accepted if the UI/UX artifact:

- clearly states it is advisory review only
- reviews Clipboard Acquisition as a bounded Sense-owned display problem
- preserves the distinction between inventory row, local request artifact, submitted Lab request, accepted recommendation, and Dev authorization
- identifies whether `sense.clipboard-window` is `needs-scope`, `request-ready`, `parked`, or needs meaning clarification
- names the source-owned terms and lifecycle states that must be preserved or qualified
- explains what must not be implied, especially background clipboard monitoring, persistent listener mode, hidden scan, automatic provider call, or Lab-owned runtime authority
- recommends request strength if a future local request artifact is opened
- lists the minimum fields, state cases, freshness/basis/authority notes, and non-goals needed in a future `RequestDisplayHS##-clipboard-window.md`
- proposes no more than three bounded Lab comparison questions
- does not create active Lab requests or Dev work
- includes verification expectations only for a possible later implementation packet

Reject or redirect if the artifact:

- submits or drafts a Lab request directly
- treats Lab response as adoption or implementation approval
- renames Sense terms
- changes product direction beyond Clipboard Acquisition presentation
- imports Atlas-owned historical proof, storage, assessment, routine-check, or stored-record semantics
- requires backend, bridge, IPC, payload, persistence, schema, service, provider, runtime, or shortcut behavior changes

## Guardrails

- Advisory review only.
- Do not implement code.
- Do not edit renderer copy.
- Do not create or submit `request_display` items.
- Do not create a Dev runway.
- Do not modify Aura Lab.
- Do not rename Sense contracts, bridge fields, IPC channels, CSS/test identifiers, services, payloads, or source terms.
- Do not treat archived docs as active task queues.
- Do not import Atlas-owned historical proof, storage, tracking, assessment, routine-check, attention-marker, stored-record, or source-candidate semantics.
- Do not treat Lab state grammar, fixtures, or display slots as Sense authority.
- Preserve Clipboard Acquisition as a short visible authority window, not background monitoring.

## Stop Conditions

Return to chat before continuing if:

- Clipboard Acquisition runtime meaning is unclear from current docs and renderer.
- The review would require manual shortcut validation.
- The review would require live provider smoke or real clipboard capture.
- The reviewer cannot preserve the difference between short authority-window states and persistent monitoring.
- The reviewer believes a backend, bridge, IPC, payload, persistence, schema, service, provider, runtime, or shortcut behavior change is required.

## Verification Required

Run after creating the UI/UX artifact:

```powershell
npm.cmd run verify:protected-terms
git status --short --branch
```

Do not run:

- live provider smoke
- manual shortcut validation
- real SDE refresh or download
- implementation verification suites unless a future packet opens Dev

## Advisory Record

The UI/UX reviewer updates this before handoff.

Verification run:

```txt
Not yet run for this packet.
```

Files changed:

```txt
Not yet recorded.
```

Findings:

```txt
Not yet recorded.
```

Deferrals:

```txt
Not yet recorded.
```

## UI/UX Handoff

UI/UX creates:

```txt
workspace/UIUXHS15-clipboard-window-request-display-review.md
```

Handoff must include:

- request received
- files reviewed
- current-state understanding
- Clipboard Acquisition display problem
- source-owned terms and lifecycle states
- state/basis/authority needs
- must-not-imply constraints
- recommended lifecycle status for `sense.clipboard-window`
- recommended request strength
- required contents for a future local `RequestDisplayHS##-clipboard-window.md`
- up to three possible Lab comparison questions
- risks
- parked items
- verification results

## Overseer Review

Overseer fills this in after UI/UX handoff:

- accepted / redirected:
- request readiness:
- doctrine drift:
- source meaning risk:
- next packet:
