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
npm.cmd run smoke:threat-live-api
```

Live API smoke must stay explicit, opt-in, and outside `verify:all`. These commands write refusal artifacts by default when `AURA_SENSE_LIVE_API` is not `1`; refusal records are not live execution evidence.

Live operator smoke:

Manual live operator smoke belongs to a future explicitly opened M12/operator-validation packet and must not collect broad private history. The scaffold lives at `docs/testing/live-operator-gamelog-smoke-playbook.md`; it is not active authorization by itself. Historical playbook references under `docs/gap/*` are not active authorization by themselves.

## Artifact Policy

- `.tmp` is the default artifact location for local smoke output.
- Durable smoke evidence belongs in an audit note, not hidden runtime state.
- Refusal-path smoke artifacts record default-safe blocking only.
- Live execution artifacts require explicit opt-in records and must identify the authorized boundary.
- Private gamelog content must not be stored as a smoke artifact.
- Scripts must not hardcode machine-specific paths.

## Failure Records

Reusable smoke/runtime failure classes belong in `docs/failures`.
