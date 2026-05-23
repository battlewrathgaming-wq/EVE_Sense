# Complete: IPC And Settings Validation

Status: Complete
Date: 2026-05-22

## Need

Renderer requests should not be able to put backend services into invalid or misleading states.

AURA-Sense is still seed-stage, so this slice validates the current IPC/service surface and adds reusable validators for the upcoming active scan and settings services without creating those services prematurely.

## Completed Work

- Added `src/services/ipcPayloadValidation.js`.
- Added service invocation request validation before dispatching to the service registry.
- Added structured validation result support in the service registry.
- Added `task.list` payload validation.
- Added `task.cancel` payload validation.
- Added reusable active scan payload validation.
- Added reusable settings payload validation.
- Added reusable log path validation before watcher restart.
- Preserved a safe User-Agent fallback when blank User-Agent input is provided.
- Added frame always-on-top payload validation for the current direct IPC frame command.
- Extended service and frame verification coverage for accepted and rejected payloads.

## Validators Added

- `validateServiceInvokeRequest`
- `validateTaskListPayload`
- `validateTaskCancelPayload`
- `validateActiveScanPayload`
- `validateSettingsPayload`
- `validateLogPathForWatcher`

## IPC Commands Covered

Current active IPC/service surface:

- `aura:service:invoke`
- `task.list`
- `task.cancel`
- `util.checksum`
- `aura:window:set-always-on-top`

Prepared validator coverage for future services:

- active scan query and type hint payloads
- settings User-Agent payloads
- EVE gamelog folder paths before watcher restart

## Guardrails Preserved

- No active scan service was invented.
- No settings persistence service was invented.
- No live API behavior was added.
- Validation is permissive enough for normal EVE names while still rejecting blank or oversized query payloads.
- Blank User-Agent does not replace the safe fallback.
- Invalid log paths can be rejected before watcher restart.

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

## Deferred Risks

- Active scan, settings save, network toggle, and watcher restart services still need to be built or wired before these validators protect live runtime behavior.
- Electron IPC errors still surface through Electron's invoke rejection mechanism; no renderer-facing error envelope has been added yet.
- Frame minimize and close remain no-payload commands; they were not changed beyond the always-on-top payload guard.

## Related Files

- `src/services/ipcPayloadValidation.js`
- `src/services/serviceRegistry.js`
- `src/modules/Frame/windowShell.js`
- `scripts/verify-services.js`
- `scripts/verify-frame-module.js`
- `docs/audits/audit-2026-05-22-ipc-settings-validation-handover.md`
