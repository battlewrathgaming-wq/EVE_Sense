# Feature: Clipboard Acquisition

Status: Implemented Foundation
Date: 2026-05-22

## Purpose

Provide a brief, deliberate tactical acquisition window for copied EVE names or targets, then hand the captured target to the Threat Intel search box.

## User Value

Supports low-interaction tactical inquiry without keeping a passive clipboard listener active.

The operator should not need to focus the AURA-Sense window during fullscreen EVE use. Clipboard acquisition exists specifically to avoid breaking tactical flow with window focus changes.

## Intended Interaction

- The operator sees an acquisition indicator in the UI.
- The operator presses the global acquisition shortcut or uses the HUD Arm control.
- AURA-Sense opens a 3 second listening window.
- If a valid target is copied during that window, AURA-Sense inserts it into the search box and runs the scoped scan.
- Clipboard content already present before arming is ignored unless it changes during the listening window.
- The listener then seals and enters a 5 second cooldown.
- If nothing valid is captured, the listener times out, seals, and enters a 5 second cooldown.
- The cooldown applies after capture, timeout, cancellation, or rejected clipboard content.
- The scan remains a Threat Intel search-box workflow even when the search box is populated hands-free.

Implementation note: Electron registers `CommandOrControl+Shift+Space` for the current hands-free shortcut. Bare modifier-only Ctrl+Shift remains a design intent note, not the current runtime accelerator.

## Data Classification

Presentation/input workflow. Not evidence and not persistent intelligence.

## Must Not Do

- Do not listen indefinitely.
- Do not silently capture unrelated clipboard content.
- Do not trigger broad background scans.
- Do not bypass the search bar or Threat Intel boundary.
- Do not remain armed without a visible indicator.
- Do not require AURA-Sense window focus for the keyboard arming path.
- Do not re-arm immediately after capture or timeout.

## Related Documents

- `docs/Concept/Clipboard_listen_arming.md`

