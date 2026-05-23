# Gap To-Do: Clipboard Acquisition Race Tests

Status: Complete
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

## Completion Evidence

- Added `scripts/verify-clipboard-acquisition-race.js`.
- Added `npm.cmd run verify:clipboard-race`.
- Added the race verifier to `npm.cmd run verify:all`.
- Duplicate arm attempts during an active listening window now return explicit `already-listening` state without resetting the listening window.
- Scan exceptions now seal into cooldown with `scan-failed` metadata.
- Race coverage proves rapid arm/cancel/cooldown, successful capture, unchanged clipboard ignore, rejected content sealing, timeout sealing, scan failure sealing, and concurrent arm semantics.

## Verification Signal

Completed:

```powershell
npm.cmd run verify:clipboard-race
npm.cmd run verify:all
```

## Deferred Risks

- Electron/globalShortcut runtime behavior remains covered by Electron smoke and manual operator use, not this deterministic Node verifier.
- The race verifier exercises service-level concurrency semantics; renderer key timing remains presentation-layer behavior.
- Further provider failure detail belongs in `live-io-provider-fault-injection.md`.

## Related Files

- `src/threat/clipboardAcquisitionService.js`
- `scripts/verify-clipboard-acquisition-race.js`
- `scripts/verify-all.js`
- `package.json`
- `docs/gap/to-do/live-io-provider-fault-injection.md`
