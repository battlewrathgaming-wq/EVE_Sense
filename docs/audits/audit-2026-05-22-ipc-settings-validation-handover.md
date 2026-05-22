# Audit: IPC And Settings Validation Handover

Date: 2026-05-22
Scope: Current IPC/service payload validation and reusable validators for upcoming active scan/settings services.

## Readiness Verdict

Ready with caveats.

The current service IPC boundary now rejects malformed service invoke requests before dispatch, validates current task command payloads, validates the direct frame always-on-top IPC payload, and provides reusable active scan/settings/log path validators for the next runtime services.

## Completed Work

- Added `ipcPayloadValidation` helpers.
- Added service invoke request validation.
- Added structured validator support in `ServiceRegistry`.
- Added validation for `task.list` and `task.cancel`.
- Added active scan query/type hint validation helpers.
- Added settings User-Agent fallback validation.
- Added log path validation before watcher restart.
- Added frame always-on-top boolean validation.
- Added accepted/rejected payload verification.

## Verification

Executed:

```powershell
npm.cmd run verify:services
npm.cmd run verify:frame
npm.cmd run verify:all
```

Observed:

```txt
services verified
Frame module verified
core utilities verified
combat parser verified
combat witness core verified
gamelog watcher verified
services verified
HTTP client verified
Frame module verified
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
```

## Concerns

- The validators for active scan and settings are prepared but not yet attached to product services because those services do not exist in the seed runtime.
- Renderer-facing error envelopes are still deferred; invalid IPC calls reject with coded errors through the existing service path.
- Future settings save behavior must avoid silently discarding invalid fields when persistence is added.

## Deferred Work

- Implement active scan service and attach `validateActiveScanPayload`.
- Implement settings save/restart service and attach `validateSettingsPayload`.
- Add network toggle validation when network gate service exists.
- Add renderer-facing error presentation once the product HUD shell exists.

## Recommended Next Slice

Continue the active readiness queue:

```txt
docs/gap/to-do/readiness-04-diagnostics-throttling.md
```
