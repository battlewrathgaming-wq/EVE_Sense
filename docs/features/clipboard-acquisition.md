# Feature: Clipboard Acquisition

Status: Implemented Foundation
Date: 2026-05-22

## Purpose

Provide a brief, deliberate tactical acquisition moment for copied EVE names or targets, then hand the captured target to the Threat Intel search box.

## User Value

Supports low-interaction tactical inquiry without keeping a passive clipboard listener active.

The operator should not need to focus or click the AURA-Sense window during fullscreen EVE use. Clipboard Acquisition exists specifically to avoid breaking tactical flow with window focus changes.

## Intended Interaction

- The operator sees an acquisition indicator in the UI.
- The operator manually enables I/O authority before clipboard or live-provider I/O can run.
- The operator presses the global acquisition shortcut, currently `Control+\`. This uncommon key combination is intentional: it is the explicit permission action.
- If the current clipboard already contains a valid target, AURA-Sense may insert it into the search box and run the scoped scan immediately.
- If no valid current target is available, AURA-Sense opens a visible 3 second listening window.
- In the focused/windowed arm path without a provided clipboard payload, clipboard content already present before arming is ignored unless it changes during the listening window.
- A short in-memory rolling cache suppresses repeated captures of the same normalized target for 10 seconds. The cache stores target fingerprints only, not raw clipboard history.
- The listener then seals and enters a 5 second cooldown.
- If nothing valid is captured, the listener times out, seals, and enters a 5 second cooldown.
- The cooldown applies after capture, timeout, cancellation, or rejected clipboard content.
- The scan remains a Threat Intel search-box workflow even when the search box is populated hands-free.

Implementation note: Electron registers `Control+\` as the preferred hands-free shortcut and reports fallback status if the runtime must use `Control+Alt+Space`. Bare modifier-only Ctrl+Shift remains a design intent note, not the current runtime accelerator.

## Data Classification

Presentation/input workflow. Not evidence and not persistent intelligence.

## Must Not Do

- Do not listen indefinitely.
- Do not read clipboard when I/O authority is off.
- Do not silently capture unrelated clipboard content outside the `Control+\` permission action or the visible short acquisition window.
- Do not persist clipboard history.
- Do not trigger broad background scans.
- Do not bypass the search bar or Threat Intel boundary.
- Do not remain armed without a visible indicator.
- Do not require AURA-Sense window focus for the keyboard arming path.
- Do not re-arm immediately after capture or timeout.

## Related Documents

- `docs/Concept/Clipboard_listen_arming.md`

