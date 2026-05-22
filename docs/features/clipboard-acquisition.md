# Feature: Clipboard Acquisition

Status: Conceptual Goalpost
Date: 2026-05-22

## Purpose

Provide a brief, deliberate tactical acquisition window for copied EVE names or targets, then hand the captured target to the Threat Intel search box.

## User Value

Supports low-interaction tactical inquiry without keeping a passive clipboard listener active.

## Intended Interaction

- The operator sees an acquisition indicator in the UI.
- The operator presses Ctrl+Shift to arm clipboard acquisition.
- AURA-Sense opens a 3 second listening window.
- If a valid target is copied during that window, AURA-Sense inserts it into the search box and runs the scoped scan.
- The listener then seals and enters cooldown.
- If nothing valid is captured, the listener times out and seals.

## Data Classification

Presentation/input workflow. Not evidence and not persistent intelligence.

## Must Not Do

- Do not listen indefinitely.
- Do not silently capture unrelated clipboard content.
- Do not trigger broad background scans.
- Do not bypass the search bar or Threat Intel boundary.
- Do not remain armed without a visible indicator.

## Related Documents

- `docs/Concept/Clipboard_listen_arming.md`

