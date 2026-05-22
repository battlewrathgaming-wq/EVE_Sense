# Gap To-Do: Native Gamelog Folder Picker

Status: Open
Priority: P2
Milestone: Post-12 Runtime Ergonomics

## Need

The runtime settings surface can persist and validate a typed gamelog folder path, but a native folder picker would reduce setup errors.

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

## Completion Signal

- Operator can choose the EVE `Gamelogs` folder through a native dialog.
- The selected path is validated by backend services before mutation.
- `npm.cmd run verify:all` passes.
