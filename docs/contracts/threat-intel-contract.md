# Contract: Threat Intel Pipeline

Status: Implemented - zKill-backed first surface
Date: 2026-05-22

## Purpose

Defines how AURA-Sense performs scoped tactical threat inspection.

## Flow

```txt
keyboard-first Clipboard Acquisition or explicit renderer/service scan request
-> local/static resolution where possible
-> scoped zKillmail query
-> sample/cap/failure/freshness metadata
-> tactical scan snapshot
-> HUD summary/search result
```

## Request Shape

The backend Threat Intel service accepts one deliberate scan request shape for renderer/service requests and clipboard-acquired targets:

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

Clipboard Acquisition is an input workflow feeding the same scan contract. It is gated by backend I/O authority. When I/O is off, the shortcut path must not read clipboard content.

The implemented preferred global shortcut is `Control+\`. That chord is the explicit operator permission action. If the current clipboard contains a valid target, the global shortcut may capture and scan it immediately. If no valid current target is available, or when the focused/windowed path arms without a provided clipboard payload, Clipboard Acquisition opens a visible 3 second listening window, ignores unchanged content from before arming, seals after capture/rejection/timeout/cancel, and enforces a 5 second cooldown before re-arming.

Clipboard Acquisition keeps only short-lived in-memory state. Duplicate suppression uses a small fingerprint-only rolling cache, currently 10 seconds and 5 entries. It is not a clipboard history.

If `Control+\` cannot be registered, Electron reports fallback status and attempts `Control+Alt+Space`. Focused overlay controls also support local keyboard affordances. The renderer/service scan request path remains available for deliberate operation.

## Invariants

- Search is operator-initiated.
- Search focus alone must not scan.
- `Control+\` is an explicit permission action, not continuous clipboard monitoring.
- I/O off must prevent clipboard reads and live provider calls.
- Duplicate suppression must not store raw clipboard history.
- zKillmail is the first scoped provider source.
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
- Do not add default ESI expansion inside the first scoped Threat Intel scan.
- Do not keep Clipboard Acquisition listening continuously or read clipboard content while I/O authority is off.
- Do not turn AURA-Sense into Atlas.

