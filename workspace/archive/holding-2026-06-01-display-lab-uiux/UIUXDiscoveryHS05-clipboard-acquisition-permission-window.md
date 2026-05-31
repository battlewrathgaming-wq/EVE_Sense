# UIUXDiscoveryHS05: Clipboard Acquisition Permission Window

Status: Advisory discovery input, not project authority
Date: 2026-05-27
Surface: Clipboard Acquisition permission window and shortcut affordance
Source owner: AURA-Sense

## Grounding Records Reviewed

- `workspace/current.md`
- `workspace/critical/critical-terms.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/current-state/current-implementation.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `F:\Projects\Docs\Aura-Project-Orchestration\Projects\Sense\UXUI\Context_memory.md`

## User Task

Use an explicit keyboard permission action to acquire a target from clipboard for Threat Intel without creating background clipboard monitoring.

## What Is Visible Now

- Clipboard widget appears inside Threat Intel search/display bar.
- Key chips show `\` and `Ctrl`.
- Clipboard state label maps to `Idle`, `Pulling`, `Cooldown`, or `IO Off`.
- Shortcut message says `Ctrl+\ captures current clipboard or opens a 3 second scan window.`
- Global shortcut immediate capture is accepted when I/O authority is on and explicitly invoked.
- Focused/windowed acquisition without payload uses short listen/seal/cooldown behavior.
- M12H service-command gates prevent clipboard read/scan while Threat I/O is off.
- M12I broadens top-level I/O off to no ingest, while Clipboard Acquisition remains gated as an active permission path.

## What The User Needs To Understand

- Clipboard Acquisition is user-invited.
- `Control+\` is the permission action.
- Listening is short, visible, and bounded.
- Cooldown/seal prevents persistent listening or repeated capture.
- I/O off means Sense is not allowed to perform this acquisition.
- This feeds Threat Intel, not Passive Telemetry.

## First-Read Candidates

- Permission action state: idle, pulling/listening, cooldown, I/O off.
- Compact key affordance.
- Short visible authority window when active.
- Sealed/cooldown state after capture or timeout.
- Target captured signal only when a valid target was acquired.

## Detail / Diagnostic Candidates

- Last capture result shape, without raw clipboard history.
- Rejection reason.
- Timeout.
- Duplicate suppression.
- Shortcut availability/fallback status.
- Threat scan handoff result.

## Terms To Preserve

- `Clipboard Acquisition`
- `Control+\`
- `Pulling`
- `Listening`
- `Cooldown`
- `IO Off` or accepted I/O-off wording
- `Threat Intel`
- `Live IO blocked` where source state uses it

## Terms To Avoid Or Qualify

- Avoid `monitoring`, `watching`, `background listener`, or persistent listener language.
- Avoid raw clipboard history language.
- Avoid making `Listening` apply to global immediate capture if no listen window is active.
- Avoid mouse/search-button requirements as the assumed primary path.

## Risks / False Implications

- Clipboard widget inside Threat Intel can still feel like hidden monitoring if the authority window is not clear.
- `Pulling` and `Listening` may blur immediate global capture with focused/windowed listening.
- I/O off can be read as app failure instead of user authority.
- A visible input field can imply mouse-driven search is required.

## Possible request_display Candidate

Yes.

Existing candidate in display inventory:

```text
sense.clipboard-window
```

Request strength likely:

```text
pressure-test
```

## No Dev Authorization

No Dev authorization. This artifact does not request implementation, shortcut validation, clipboard capture, live/manual smoke, copy changes, or Lab submission.
