# Contract: Threat Intel Pipeline

Status: Seed
Date: 2026-05-22

## Purpose

Defines how AURA-Sense performs scoped tactical threat inspection.

## Flow

```txt
user/scoped query
-> local/static resolution where possible
-> typed ESI resolution when needed
-> zKill discovery refs
-> ESI expanded killmails
-> local tactical aggregation
-> HUD summary
```

## Invariants

- zKill is discovery only.
- Expanded ESI killmails are the source of truth for scoped Threat Intel.
- Static metadata should be resolved locally where possible.
- The scan must show scope, freshness, and partial status.
- Threat Intel should remain tactical and short-window, not historical analysis.

## Must Not Do

- Do not store zKill summaries as tactical truth.
- Do not imply complete coverage.
- Do not run broad background discovery without user/session intent.
- Do not turn AURA-Sense into Atlas.

