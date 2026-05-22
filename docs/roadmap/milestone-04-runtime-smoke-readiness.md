# Milestone 04: Runtime Smoke Readiness

Status: Complete
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

AURA-Sense now has a first product-facing viewport. The next risk is not missing panels; it is believing the UI works because offline checks pass.

Milestone 04 should make the product shell observable as a running Electron app:

```txt
Launch the real shell.
Capture the real viewport.
Prove the bridge is present.
Exit cleanly.
Keep it separate from offline verification.
```

## Reference

AURA Atlas already uses the correct shape:

```powershell
npm.cmd run smoke:electron
```

That smoke launches Electron with explicit environment flags, writes artifacts under `.tmp\electron-visual-smoke`, captures screenshots/results, and exits with a clear status.

AURA-Sense should adapt the pattern, not copy Atlas domain behavior.

## Completion Verdict

Milestone 04 is complete with caveats.

AURA-Sense now exposes `npm.cmd run smoke:electron`, launches the real Electron shell under explicit smoke flags, verifies the first-light viewport and preload bridges, captures `first-light.png`, writes `visual-smoke-result.json`, and exits cleanly.

Debugging also found and fixed a Frame module null-bounds bug that prevented `BrowserWindow` construction when no persisted bounds existed.

## Instructional Slices

### Slice 1: Smoke Harness Contract

- Define AURA-Sense smoke environment flags.
- Define `.tmp\electron-visual-smoke` as the artifact root.
- Define the expected result file shape.
- Keep the smoke outside `verify:all`.

Status: Complete.

### Slice 2: Electron Smoke Runner

- Add `scripts/electron-visual-smoke.ps1`.
- Add `smoke:electron` to `package.json`.
- Launch `npm.cmd run start` under explicit smoke flags.
- Avoid hardcoded drive paths.

Status: Complete.

### Slice 3: Main Process Smoke Mode

- Detect the explicit smoke flag in `src/main/main.js`.
- Wait until the renderer finishes loading.
- Run checks against the loaded window.
- Capture success and failure screenshots.
- Exit with success/failure status.

Status: Complete.

### Slice 4: Static Verification

- Extend `scripts/verify-renderer-shell.js` to assert smoke wiring exists.
- Keep renderer boundary verification intact.
- Keep `npm.cmd run verify:all` offline and passing.

Status: Complete.

## Completion Signal

Milestone 04 is complete when AURA-Sense has a verified `smoke:electron` command that captures first-light visual evidence and exits cleanly without live network, live logs, or user settings mutation.

## Explicit Deferrals

- Playwright automation
- live EVE log integration
- Passive Telemetry UI
- Threat Intel UI
- multi-lane visual regression coverage
- CI integration

## Related Packets

- `docs/gap/complete/readiness-13-electron-visual-smoke.md`
- `docs/gap/complete/readiness-12-tactical-hud-first-light.md`
- `docs/audits/audit-2026-05-22-electron-smoke-overseer-handover.md`
- `docs/audits/audit-2026-05-22-electron-visual-smoke-handover.md`
- `docs/features/vision.md`
