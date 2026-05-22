# Gap To-Do: Clipboard Acquisition Race Tests

Status: Open
Priority: P1
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

Clipboard Acquisition is intentionally short-lived. Race tests should prove it cannot become silent or indefinite under rapid operator input.

## Actionables

- Test rapid arm, cancel, capture, timeout, and rejected-content paths.
- Test cooldown prevents immediate re-arm.
- Test unchanged clipboard baseline remains ignored.
- Test scan failure during capture seals the listener.
- Test concurrent global shortcut and UI Arm behavior.

## Guardrails

- Do not listen indefinitely.
- Do not capture unrelated clipboard content silently.
- Do not bypass the Threat Intel scan contract.

## Completion Signal

- Race tests prove visible lifecycle states and cooldown behavior.
- Failed scan paths seal cleanly.
- `npm.cmd run verify:all` passes.
