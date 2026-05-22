# Runtime Smoke Policy

Date: 2026-05-22
Status: Active

## Command Classes

Offline deterministic verification:

```powershell
npm.cmd run verify:all
```

This must not depend on Electron, local EVE logs, live network, or private operator state.

Electron/manual smoke:

```powershell
npm.cmd run smoke:electron
```

This launches Electron, captures visual evidence, and writes artifacts under `.tmp\electron-visual-smoke`.

Live API smoke:

```powershell
npm.cmd run smoke:passive-live-api
```

Live API smoke must stay explicit, opt-in, and outside `verify:all`.

Live operator smoke:

Manual live operator smoke is governed by `docs/gap/to-do/live-operator-smoke-playbook.md` and must not collect broad private history.

## Artifact Policy

- `.tmp` is the default artifact location for local smoke output.
- Durable smoke evidence belongs in an audit note, not hidden runtime state.
- Private gamelog content must not be stored as a smoke artifact.
- Scripts must not hardcode machine-specific paths.

## Failure Records

Reusable smoke/runtime failure classes belong in `docs/failures`.
