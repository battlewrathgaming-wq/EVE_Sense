# AURA-Sense Workspace Handshake

This folder is the repo-local attention bridge between Overseer, Dev, and the user.

When the user sends this exact signal:

```txt
.
```

it means:

```txt
Read this workspace folder from top to bottom.
Execute the queue.
Return to chat only for blockers, unsafe ambiguity, permission/live-network needs, or final handover.
```

## Read Order

1. `00-dot-protocol.md`
2. `10-attention.md`
3. `20-queue.md`
4. `30-context.md`
5. `90-done.md`

Then cross-check:

1. `docs/current-state/current-implementation.md`
2. the active roadmap milestone
3. relevant `docs/gap/to-do` packets
4. latest relevant `docs/audits` handover

## Rule

This folder tells Dev where to look and what to do next. It does not override current-state, contracts, live IO policy, renderer boundary doctrine, or user instructions in the active chat.
