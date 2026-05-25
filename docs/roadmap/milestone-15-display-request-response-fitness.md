# M15 - Display Request Response Fitness

Status: Candidate

## Outcome

AURA-Sense can receive Lab advisory display comparisons, discuss fitness with the Human/source project, and decide whether to park, refine, or convert the result into local action without treating Lab response as adoption or Dev authorization.

## Why This Is Milestone-Sized

This is more than a single display request because it establishes the source-project side of the new display request loop:

- inventory remains reasoning
- `request_display` remains compiled ask
- Lab response remains advisory comparison
- Human/Sense discussion decides fitness
- project files preserve only resting state or scoped action
- Dev opens only through `workspace/current.md`

The first pressure test is `sense.clipboard-window`, but the milestone outcome is the repeatable Sense-side response/fitness path.

## Likely Runways

- Review Lab response to `sense.clipboard-window` for source-meaning preservation, display fitness, and must-not-imply risks.
- Hold or summarize Human/Sense fitness discussion into a local resting/action record only if stable state or scoped action exists.
- If action-worthy, shape a bounded `workspace/current.md` runway with acceptance criteria and verification.
- Park or narrow the response if it is useful but not action-ready.

## Acceptance Criteria

M15 is complete when:

- a Lab response to `sense.clipboard-window` has been reviewed as advisory comparison, not adoption
- Human/Sense discussion has decided whether the direction is useful, wrong, too broad, too narrow, worth refining, worth parking, or action-worthy
- any local record created from the response preserves Sense-owned meanings and states
- no Dev work is authorized unless `workspace/current.md` contains a bounded executable runway
- Clipboard Acquisition remains a short visible authority window, not background monitoring
- `Live IO blocked`, `No scan`, cooldown, shortcut/manual path, and captured-target transition remain distinct
- verification expectations are named for any later implementation packet

## Non-Goals

- Do not implement UI changes from a Lab response directly.
- Do not treat Lab response as Sense adoption.
- Do not create broad Threat Intel drawer redesign.
- Do not rename Sense-owned terms from Lab vocabulary.
- Do not change backend, bridge, IPC, payload, persistence, schema, service, provider, shortcut, or runtime behavior unless a later accepted runway explicitly opens that scope.
- Do not submit more display requests automatically.

## Dependencies

- `workspace/RequestDisplayHS16-clipboard-window.md`
- `workspace/display_inventory.md`
- `workspace/request_display.md`
- `workspace/display-request-workflow-hardening-contract.md`
- `workspace/UIUXHS15-clipboard-window-request-display-review.md`
- `workspace/OverseerHS15-clipboard-window-request-display-review-acceptance.md`
- Lab advisory response to `sense.clipboard-window`
- Human/Sense discussion of fitness

## Verification Shape

For review-only packets:

- `npm.cmd run verify:protected-terms`
- `git status --short --branch`

For later implementation packets, the active runway should choose exact commands. Likely candidates include:

- `npm.cmd run verify:clipboard-race`
- `npm.cmd run verify:renderer-shell`
- `npm.cmd run smoke:electron` if layout/CSS changes
- `npm.cmd run verify:protected-terms`

No live provider smoke, manual shortcut validation, real SDE refresh/download, or broader verification is implied by this candidate milestone unless a future runway explicitly opens it.
