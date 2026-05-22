# Gap To-Do: Integrated Viewport Smoke And Boundary Verification

Status: Open
Priority: P1
Milestone: 10 - Integrated Tactical Viewport

## Need

Milestone 10 changes the visible product surface. Verification must prove the integrated viewport still respects backend ownership and renders useful evidence.

## Actionables

- Extend renderer-shell checks for integrated viewport selectors and expected lane labels.
- Keep renderer boundary checks active for renderer and preload files.
- Extend Electron visual smoke result assertions for Combat Witness, Passive Telemetry, Threat Intel, and Clipboard Acquisition visibility.
- Capture screenshot evidence under `.tmp/electron-visual-smoke`.
- Keep live API smoke separate from `verify:all`.

## Guardrails

- Do not make `verify:all` depend on Electron, local EVE logs, or live network.
- Do not weaken renderer boundary checks to make layout work pass.
- Do not hardcode machine-specific paths in smoke scripts.

## Completion Signal

- `npm.cmd run verify:all` passes.
- `npm.cmd run smoke:electron` passes.
- Smoke result records integrated viewport evidence.

## Related Files

- `scripts/verify-renderer-shell.js`
- `scripts/verify-renderer-boundary.js`
- `scripts/electron-visual-smoke.ps1`
- `src/renderer/index.html`
- `src/renderer/app.js`
