# Frame Module

Status: Proposed / Implemented Seed Slice
Date: 2026-05-22

The Frame module contains reusable Electron window-shell rigging:

- frameless `BrowserWindow` creation
- preload-only window controls
- always-on-top state read/toggle
- optional transparent/HUD configuration
- persisted frame state
- static verification

Implementation:

- `src/modules/Frame/windowState.js`
- `src/modules/Frame/windowShell.js`
- `src/modules/Frame/index.js`

Verification:

```powershell
npm run verify:frame
```

Design note:

- `electron-frameless-window-shell.md`
