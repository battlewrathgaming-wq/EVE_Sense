# Gap To-Do: IPC And Settings Validation

Date: 2026-05-22
Status: Open

## Actionables

- Validate active scan payloads.
- Add a max query length.
- Validate type hints.
- Validate settings before save.
- Preserve a safe User-Agent fallback.
- Validate log path before watcher restart or return a clear warning.
- Add verification for accepted and rejected payloads.

## Task Requirements

Renderer requests should not be able to put backend services into invalid or misleading states.

The first implementation can use small local validator helpers. A full schema library is not required unless the codebase naturally grows toward one.

## Guardrails

- Do not make validation so strict that normal EVE names fail.
- Do not silently discard invalid settings.
- Do not restart the log watcher on a clearly invalid path without returning a warning.
- Do not allow blank User-Agent to replace the safe default.

## Completion Signal

IPC handlers return predictable success/error shapes and reject invalid input before it reaches service logic.

## Evidence Of Completion

When complete, record:

- validators added
- IPC commands covered
- tests added
- verification output

## Related Documents

- `Docs/contracts/renderer-boundary-contract.md`
- `Docs/gap/to-do/performance-stability-compute-readiness.md`


