# Gap To-Do: Native Gamelog Folder Picker

Status: Complete
Priority: P2
Milestone: Post-12 Runtime Ergonomics

## Need

The runtime settings surface can persist and validate a typed gamelog folder path, but a native folder picker reduces setup errors.

## Actionables

- Add a native folder selection flow through the main process.
- Reuse existing backend log path validation before saving or configuring Combat Witness.
- Keep typed path input as fallback.
- Do not start or restart watchers until the selected path is validated.
- Add renderer-shell and smoke checks if the UI changes.

## Guardrails

- Do not let renderer access filesystem APIs directly.
- Do not accept invalid paths silently.
- Do not scan selected folders for historical replay.
- Do not store private log contents.

## Completion Evidence

- `runtime.gamelog-folder.pick` is registered in the main-process service registry.
- The handler opens `dialog.showOpenDialog` with `openDirectory`, then calls the existing Combat Witness runtime validation/configuration path before saving settings.
- The renderer invokes the picker through `window.aura.invokeService('runtime.gamelog-folder.pick')`.
- The typed gamelog path input remains available as fallback.
- Preload allowlist and adversarial boundary verification include `runtime.gamelog-folder.pick`.
- Renderer-shell verification asserts the main/preload/renderer folder picker boundary.

## Verification Signal

Required verification:

```powershell
npm.cmd run verify:renderer-shell
npm.cmd run verify:all
```

Manual/UI evidence remains useful because native dialogs are operator-environment behavior:

```powershell
npm.cmd run smoke:electron
```

## Deferred Risks

- Native dialog success is environment-dependent and not exercised inside `verify:all`.
- Manual operator smoke should still confirm a real EVE `Gamelogs` folder can be selected on the target machine.
- The picker configures the path and the renderer starts the watcher after a successful selection; invalid selections still rely on backend status reporting to prevent unsafe mutation.

## Related Files

- `src/main/main.js`
- `src/main/preload.js`
- `src/renderer/app.js`
- `src/renderer/index.html`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-renderer-boundary-adversarial.js`
- `docs/current-state/current-implementation.md`
