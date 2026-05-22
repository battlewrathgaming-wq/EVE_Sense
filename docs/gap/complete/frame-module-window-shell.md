# Complete: Frame Module Window Shell

Status: Complete
Date: 2026-05-22

## Need

Unify the Atlas frameless/always-on-top toggle pattern and the EVE tactical HUD window posture into a reusable Aura Frame module.

## Completed Work

- Added `src/modules/Frame`.
- Added reusable frame state persistence.
- Added reusable frameless `BrowserWindow` creation.
- Added Frame IPC handlers for state, always-on-top, minimize, and close.
- Exposed `window.auraWindow` from preload.
- Updated the seed renderer with custom chrome, drag/no-drag regions, and pin/minimize/close controls.
- Added `verify:frame`.
- Moved Frame module documentation under `docs/module/Frame`.

## Verification

```powershell
npm run verify:frame
npm run verify:renderer-shell
npm run verify:all
```

## Related Files

- `src/modules/Frame/windowState.js`
- `src/modules/Frame/windowShell.js`
- `src/modules/Frame/index.js`
- `src/main/main.js`
- `src/main/preload.js`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `scripts/verify-frame-module.js`
- `docs/module/Frame/electron-frameless-window-shell.md`
