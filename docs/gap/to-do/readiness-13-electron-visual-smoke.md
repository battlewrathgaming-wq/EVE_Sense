# Gap To-Do: Electron Visual Smoke

Date: 2026-05-22
Status: Open
Priority: P0 for post-First-Light UI expansion

## Need

AURA-Sense has crossed into a product-facing Electron viewport. Offline verification proves contracts and renderer boundaries, but it does not prove the packaged Electron shell can launch, render the viewport, capture a usable surface, and exit cleanly under an explicit smoke mode.

Atlas already uses this pattern through `npm.cmd run smoke:electron`. AURA-Sense should adopt the pattern only as a runtime/visual smoke, not as part of `verify:all`.

## Reference Pattern From AURA Atlas

Observed in `F:\Projects\AURA-Atlas`:

- `package.json` exposes `smoke:electron`.
- `scripts/electron-visual-smoke.ps1` derives project paths and writes artifacts under `.tmp\electron-visual-smoke`.
- The smoke script sets explicit environment flags before launching `npm.cmd run start`.
- `src/main/main.js` detects the smoke flag after renderer load.
- The app captures screenshots, writes `visual-smoke-result.json`, and exits with success/failure.
- Renderer-shell verification checks that the smoke mode and smoke script remain wired.

## AURA-Sense Actionables

- Add `smoke:electron` to `package.json`.
- Add `scripts/electron-visual-smoke.ps1`.
- Use AURA-Sense-specific environment flags, for example:
  - `AURA_SENSE_ELECTRON_VISUAL_SMOKE=1`
  - `AURA_SENSE_VISUAL_SMOKE_DIR=.tmp\electron-visual-smoke`
- Keep all smoke artifacts under project `.tmp`.
- Add explicit smoke-mode handling in `src/main/main.js` after the renderer finishes loading.
- Capture at least:
  - first-light viewport screenshot
  - failure screenshot on error
  - `visual-smoke-result.json`
- Assert the smoke output proves:
  - preload bridge exists
  - renderer has no Node `require`
  - Combat Witness surface exists
  - freshness/status text exists
  - event list surface exists
  - no renderer-owned parser/runtime module is exposed
- Update `scripts/verify-renderer-shell.js` to check the smoke script and smoke flag wiring.
- Keep `npm.cmd run verify:all` offline and passing.

## Guardrails

- Do not put Electron smoke inside `verify:all`.
- Do not require live EVE logs, zKill, ESI, or network access.
- Do not use smoke mode to invent runtime behavior.
- Do not make smoke mode mutate real user settings.
- Do not hardcode drive paths.
- Do not treat screenshot existence alone as enough; write a structured result file.

## Completion Signal

`npm.cmd run smoke:electron` launches AURA-Sense in explicit smoke mode, captures first-light visual evidence under `.tmp\electron-visual-smoke`, writes a structured result file, exits cleanly, and is documented as a runtime smoke separate from offline verification.

## Expected Verification

```powershell
npm.cmd run verify:all
npm.cmd run smoke:electron
```

## Related Documents

- `docs/roadmap/milestone-04-runtime-smoke-readiness.md`
- `docs/audits/audit-2026-05-22-electron-smoke-overseer-handover.md`
- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/gap/complete/readiness-12-tactical-hud-first-light.md`
