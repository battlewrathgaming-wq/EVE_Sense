# Contract: Threat Intel Pipeline

Status: Implemented - zKill-backed first surface
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

## Request Shape

The backend Threat Intel service accepts one deliberate scan request shape for typed, pasted, and clipboard-acquired targets:

```txt
{
  targetText,
  targetKind?,
  inputSource: search | paste | clipboard,
  lookbackSeconds?,
  sampleLimit?,
  requestedAt?
}
```

Accepted target categories are `system`, `pilot`, `corporation`, `alliance`, and copied target text that resolves to one of those categories. Prefixes such as `system: Jita` or `pilot: Chribba` may narrow resolution. Resolution is local/static for the current slice and returns explicit `empty`, `unresolved`, `ambiguous`, or `unsupported` statuses instead of guessing.

## Snapshot Shape

Threat Intel snapshots expose:

```txt
{
  status,
  message,
  requestedAt,
  resolvedAt,
  liveIo,
  request,
  target,
  zkill?
}
```

`status` may be `empty`, `blocked`, `unresolved`, `ambiguous`, `unsupported`, `failed`, `partial`, or `succeeded`.

The `zkill` section includes provider, endpoint family, scoped target route, lookback seconds, sample limit, discovered/selected/malformed/failed counts, capped/partial flags, failure metadata, and normalized killmail reference rows.

## Clipboard Acquisition

Clipboard Acquisition is an input workflow feeding the same scan contract. It has visible `idle`, `listening`, and `cooldown` states, opens a 3 second listening window, ignores unchanged clipboard content from before arming, seals after capture/rejection/timeout/cancel, and enforces a 5 second cooldown before re-arming.

The implemented global shortcut is `CommandOrControl+Shift+Space`. This preserves hands-free acquisition in Electron while avoiding a bare modifier-only accelerator. The in-window Arm control remains available.

## Invariants

- Search is operator-initiated.
- Search focus alone must not scan.
- zKillmail is the first scoped evidence source.
- zKillmail results require visible sample, cap, failure, and freshness metadata.
- Live zKill calls are blocked unless the backend live IO gate is enabled.
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

