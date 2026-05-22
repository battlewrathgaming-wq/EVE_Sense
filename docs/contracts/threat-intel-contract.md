# Contract: Threat Intel Pipeline

Status: Draft - zKill-backed first surface
Date: 2026-05-22

## Purpose

Defines how AURA-Sense performs scoped tactical threat inspection.

## Flow

```txt
typed search or armed clipboard acquisition
-> local/static resolution where possible
-> scoped zKillmail query
-> sample/cap/failure/freshness metadata
-> tactical scan snapshot
-> HUD summary/search result
```

## Invariants

- Search is operator-initiated.
- zKillmail is the first scoped evidence source.
- zKillmail results require visible sample, cap, failure, and freshness metadata.
- ESI expansion is deferred until explicitly authorized by a future milestone or ADR.
- Static metadata should be resolved locally where possible.
- The scan must show scope, freshness, and partial status.
- Threat Intel should remain tactical and short-window, not historical analysis.

## Must Not Do

- Do not store zKill summaries as tactical truth.
- Do not imply complete coverage.
- Do not run broad background discovery without user/session intent.
- Do not add default ESI expansion inside the first search-bar scan.
- Do not turn AURA-Sense into Atlas.

