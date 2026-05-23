# Clipboard Acquisition Concept

Status: Active, aligned to implemented lifecycle
Updated: 2026-05-23

## Purpose

Clipboard Acquisition gives the operator a short, deliberate way to capture a copied EVE target for Threat Intel search.

It is not persistent clipboard surveillance.

## Current Implementation Direction

The implemented global shortcut is:

```text
CommandOrControl+Shift+Space
```

The UI Arm control remains available.

The lifecycle is:

```text
sealed
-> armed/listening
-> captured, timed out, cancelled, or rejected
-> sealed
-> cooldown
```

## Rules

- Listener state must be visible.
- The listening window must be short-lived.
- Invalid or excessive clipboard content must be rejected.
- Capture must route through the Threat Intel scan boundary.
- Cooldown prevents repeated scan spam.

## Must Not Do

- listen indefinitely
- hide active clipboard state
- scan without validation
- bypass Threat Intel request contracts
- re-arm during cooldown
- treat copied text as evidence

## Current Open Testing

Race tests remain active work:

- rapid arm/cancel/capture
- unchanged clipboard
- rejected content
- scan failure during capture
- concurrent shortcut/UI arm paths
