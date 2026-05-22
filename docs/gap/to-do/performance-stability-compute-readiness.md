# Gap To-Do: Performance, Stability, And Compute Readiness

Date: 2026-05-22
Status: Open

## Purpose

Prepare AURA-Sense for heavier tactical computing without violating its core doctrine:

```txt
Observe conservatively.
Compute in backend.
Present tactically.
Do not overclaim.
Keep telemetry transient.
```

Related audit:

- `docs/audits/audit-2026-05-22-performance-stability-readiness.md`

## Priority 1: Verification Harness

Status: Complete in `docs/gap/complete/readiness-01-verification-harness.md`.

### Actionables

- Keep `npm run verify:all`.
- Include all current offline verification scripts as they are added.
- Keep any future live/API smoke checks separate.
- Add verification as each readiness gap closes.

### Completion Signal

One command proves the offline confidence set before larger refactors.

## Priority 2: IPC And Settings Validation

Status: Complete in `docs/gap/complete/readiness-03-ipc-settings-validation.md`.

### Actionables

- Validate active scan payloads.
- Add max query length.
- Validate type hints.
- Validate settings before save.
- Preserve safe User-Agent fallback.
- Validate log path before watcher restart or return a clear warning.

### Completion Signal

Renderer requests cannot put backend services into invalid or misleading states.

## Priority 3: Diagnostics Throttling

### Actionables

- Add diagnostic levels or categories.
- Disable low-value cache hit/miss trace spam by default.
- Throttle diagnostics sent to renderer.
- Preserve high-value errors, blocked requests, throttles, and degraded states.

### Completion Signal

Normal operation does not flood console or renderer diagnostics, while degraded states remain visible.

## Priority 4: zKill Discovery Ref Boundary

Status: Deferred until Threat Intel client/service exists.

### Actionables

- Normalize zKill output inside `ZKillClient`.
- Return only discovery refs needed for ESI expansion.
- Guard non-array responses.
- Guard missing `killmail_id` or missing hash.
- Add warnings/counts for malformed refs.

### Completion Signal

Threat Intel receives a clean ref list:

```txt
[{ killmailId, hash }]
```

and never treats zKill summary payloads as tactical truth.

## Priority 5: Threat Intel Sample Metadata

Status: Deferred until Threat Intel runtime exists.

### Actionables

- Add discovered ref count.
- Add selected/expanded count.
- Add failed expansion count.
- Add cap skipped count.
- Add partial/complete sample status.
- Render this compactly in the HUD.

### Completion Signal

Every scan makes its evidence basis clear without turning the HUD into an Atlas report.

## Priority 6: Renderer Boundary Static Checks

Status: Complete in `docs/gap/complete/readiness-02-renderer-boundary-static-checks.md`.

### Actionables

- Verify renderer does not call `fetch`.
- Verify renderer does not import main-process modules.
- Verify renderer does not read logs or filesystem.
- Verify renderer does not contain combat parser regexes.

### Completion Signal

Renderer remains presentation-only as the app grows.

## Priority 7: Combat Witness Core

Status: Complete in `docs/gap/complete/readiness-07-combat-witness-core.md`.

### Actionables

- Add normalized combat event shape.
- Add backend rolling cache with bounded retention.
- Add computed snapshot windows.
- Emit compact snapshots to renderer.
- Keep one-shot event streams separate from snapshot metrics.
- Add chokidar-style watcher behavior or a polling fallback so log observation remains reliable when `fs.watch` is weak.

### Completion Signal

Backend can answer:

```txt
What has been observed in the last 5/15/30 seconds?
```

without renderer owning the computation.

Log observation remains append-only and fixture-backed under the selected watcher strategy or fallback.

## Priority 8: Combat Parser Fixture Tests

Status: Complete in `docs/gap/complete/readiness-08-combat-parser-fixtures.md`.

### Actionables

- Add fixture log lines for jump detection.
- Add fixture log lines for incoming damage variants.
- Add malformed/long/duplicate lines.
- Verify duplicate suppression.
- Verify partial-line buffering behavior.

### Completion Signal

Log parsing changes are testable without launching Electron.

## Priority 9: Runtime Error Handling

### Actionables

- Add unhandled rejection logging.
- Add uncaught exception logging.
- Add renderer crash/gone handling.
- Surface degraded state where useful.

### Completion Signal

Long sessions fail visibly and diagnostically rather than silently.

## Priority 10: Combat Witness Snapshot Bridge

Status: Open in `docs/gap/to-do/readiness-11-combat-witness-snapshot-bridge.md`.

### Actionables

- Expose backend-owned Combat Witness snapshots through a service/preload boundary.
- Keep renderer presentation-only.
- Add subscription cleanup and update cadence control.
- Verify renderer does not compute Combat Witness metrics.

### Completion Signal

The renderer can receive compact Combat Witness snapshots without owning parser, cache, or metric computation.

## Priority 11: Local Type Metadata

Status: Deferred until Threat Intel timelines or type-label consumers exist.

### Actionables

- Add compact local type lookup.
- Resolve ship labels locally.
- Display `Name [typeID: id]` where available.
- Keep unresolved IDs visible.

### Completion Signal

Threat Intel avoids `Type <id>` where local metadata can provide a readable label.

## Recommended Order

This overview has been split into individual task files so each line can be implemented, reviewed, and moved to `docs/gap/complete/` independently.

1. `readiness-04-diagnostics-throttling.md`
2. `readiness-10-runtime-error-handling.md`
3. `readiness-11-combat-witness-snapshot-bridge.md`
4. `readiness-05-zkill-ref-boundary.md`
5. `readiness-06-threat-intel-sample-metadata.md`
6. `readiness-09-local-type-metadata.md`

This sequence improves safety before adding heavier combat features.

