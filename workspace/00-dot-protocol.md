# Dot Protocol

Status: Active
Signal: `.`

## Meaning

If the user sends only `.` in a Dev chat, Dev should treat it as an execution signal:

1. Read every file in `workspace/` in numbered order.
2. Read linked source-of-truth docs.
3. Execute the queued work from top to bottom.
4. Ask the user only when blocked by real ambiguity, unsafe/destructive action, live network requirements, missing artifacts, or permission escalation.
5. Update relevant artifacts after meaningful change.
6. Run the required verification.
7. Return a concise handover.

## Must Do

- Preserve existing user/Dev changes.
- Check `git status --short` before edits.
- Treat `workspace/10-attention.md` as the immediate attention layer.
- Treat `workspace/20-queue.md` as the ordered task queue.
- Use gap packets and roadmap docs for implementation detail.
- Move completed gap packets only when completion evidence exists.
- Record failures in `docs/failures` when a reusable bug class is found.

## Must Not Do

- Do not treat this folder as product doctrine.
- Do not ignore `docs/current-state/current-implementation.md`.
- Do not run live APIs unless explicitly gated and authorized.
- Do not stage generated SDE artifacts by default.
- Do not broaden scope beyond the queued work.
- Do not ask the user to relay information that is already in this folder.

## Return Conditions

Return to chat immediately if:

- queue instructions conflict with current-state or user direction
- a live network/API action is needed
- an operation is destructive or would mutate external/private data
- required input/artifact is missing
- a test failure reveals a doctrine or architecture decision

Otherwise continue until the queued slice is complete.
