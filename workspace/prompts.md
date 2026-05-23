# Conversational Prompts

Status: Active

Use these prompts to reduce user relay work between Overseer and Dev chats.

## User To Overseer: Plan Or Refresh

```txt
Overseer: audit current repo state and docs against AURA-Sense doctrine.
Check tree health.
Define or refresh the next milestone in workspace/current.md.
Keep it feature-aligned, with prioritized tasks and guardrails.
Update current-state/docs only if truth changed.
Commit if appropriate.
```

## User To Dev: Execute Current Packet

```txt
.
```

Meaning:

```txt
Read workspace/README.md, workspace/00-dot-protocol.md, and workspace/current.md.
Read linked docs.
Check git status.
Execute the task queue top to bottom.
Update Evidence and Dev Handoff in workspace/current.md.
Run required verification.
Return only for blockers or final handoff.
```

## User To Dev: Narrow Execution

```txt
Dev: use the dot protocol, but only execute P0 in workspace/current.md.
Leave evidence and verification output in the packet.
```

## User To Overseer: Review Dev Work

```txt
Overseer: review Dev handoff in workspace/current.md.
Audit tree health and verification.
Judge against docs/features/vision.md, current-state, contracts, and active milestone.
Accept, redirect, or rewrite the packet.
Archive completed packet if accepted.
Update current-state/audits/gaps as needed.
Commit if appropriate.
```

## User To Overseer: Create Next Packet

```txt
Overseer: archive or retire the current workspace packet if complete.
Overwrite workspace/current.md with the next milestone/task packet.
Prioritize tasks by implementation importance.
Include guardrails, evidence requirements, and Dev handoff fields.
```

## User To Dev: Blocker Response

```txt
Dev: stop execution and report only:
- blocker
- file or command involved
- safest options
- recommended next action
```

## User To Overseer: State Reset

```txt
Overseer: perform a state reset.
Read current-state, latest audits, workspace/current.md, and git status.
Resolve documentation drift.
Rewrite workspace/current.md to match current truth.
```

## Handoff Shape

Dev handoff should include:

- what changed
- why it stayed in scope
- files changed
- tests run
- artifacts produced
- failures found
- gap packets moved or left open
- remaining risk

Overseer review should include:

- accepted or redirected
- doctrine drift
- architecture risk
- state/doc updates
- next work packet
