# Gap To-Do: Clipboard Acquisition Workflow

Status: Complete
Priority: P1
Milestone: 09 - Scoped Threat Intel And Clipboard Acquisition

## Need

Fullscreen EVE use should not require focusing AURA-Sense to run a tactical target scan. Clipboard Acquisition provides a visible, deliberate, hands-free input path.

## Actionables

- Implement Ctrl+Shift hands-free acquisition without requiring AURA-Sense window focus.
- Show visible armed, listening, sealed, and cooldown state.
- Open a 3 second clipboard listening window.
- Validate and classify copied target text.
- Insert valid captured target into the Threat Intel search box and run the same scoped backend scan contract.
- Seal after capture, timeout, cancellation, or rejected content.
- Enforce a 5 second cooldown after seal before re-arming.
- Add verification for lifecycle, timeout, rejected content, cooldown, and no indefinite listening.

## Guardrails

- Do not listen indefinitely.
- Do not silently capture unrelated clipboard content.
- Do not bypass the search box / Threat Intel scan boundary.
- Do not trigger broad background scans.
- Do not require AURA-Sense window focus for the primary arming workflow.
- Do not re-arm during cooldown.

## Completion Signal

- Ctrl+Shift acquisition can capture one valid target, populate search, run the scoped scan, seal, and enter cooldown.
- Timeout/rejected/cancelled paths also seal and enter cooldown.
- Verification proves lifecycle and cooldown behavior.
- `npm.cmd run verify:all` passes.

## Related Files

- `docs/features/clipboard-acquisition.md`
- `docs/audits/audit-2026-05-22-clipboard-acquisition-cooldown-intent.md`
- future clipboard acquisition files
- future renderer/preload bridge files

