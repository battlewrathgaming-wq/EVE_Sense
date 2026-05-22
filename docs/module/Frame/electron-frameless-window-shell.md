# Module: Electron Frameless Window Shell

Status: Implemented Seed Slice
Date: 2026-05-22

## Purpose

Provide a reusable Electron Frame module for Aura projects that need a borderless utility window, draggable custom chrome, minimize/close controls, and optional always-on-top behavior.

The module keeps window controls separate from domain services so pinning, minimizing, and closing cannot mutate project data or trigger live work.

## Reference Review

### Atlas

Atlas is the primary donor for the reusable pattern:

- frameless `BrowserWindow`
- user-controlled always-on-top toggle
- persisted always-on-top state
- preload-only window bridge
- renderer pin button that reflects main-process state
- renderer verification for Electron boundary safety

Key donor files:

- `F:\Projects\AURA-Atlas\src\main\main.js`
- `F:\Projects\AURA-Atlas\src\main\preload.js`
- `F:\Projects\AURA-Atlas\src\main\windowState.js`
- `F:\Projects\AURA-Atlas\src\renderer\app.js`
- `F:\Projects\AURA-Atlas\src\renderer\styles.css`
- `F:\Projects\AURA-Atlas\scripts\verify-renderer-shell.js`

### EVE Tactical Overlay

EVE tactical is the primary donor for HUD configuration:

- compact frameless window
- `transparent: true`
- `alwaysOnTop: true`
- transparent background
- drag/no-drag CSS regions
- close/minimize bridge

Key donor files:

- `F:\Projects\EVE-Threat-Overlay\src\main\main.js`
- `F:\Projects\EVE-Threat-Overlay\src\preload\preload.js`
- `F:\Projects\EVE-Threat-Overlay\src\main\ipcRouter.js`
- `F:\Projects\EVE-Threat-Overlay\src\renderer\styles.css`

## Aura Implementation

Implemented code:

```txt
src/modules/Frame/windowState.js
src/modules/Frame/windowShell.js
src/modules/Frame/index.js
```

Seed integration:

- `src/main/main.js` creates the window through `createFrameWindow`.
- `src/main/main.js` registers Frame IPC through `registerFrameWindowHandlers`.
- `src/main/preload.js` exposes `window.auraWindow`.
- `src/renderer/index.html` includes custom Frame chrome.
- `src/renderer/app.js` toggles always-on-top through `window.auraWindow`.
- `src/renderer/styles.css` defines drag/no-drag regions.

## API Shape

Main process:

```js
const { createFrameWindow, registerFrameWindowHandlers } = require('../modules/Frame');
```

Preload bridge:

```js
window.auraWindow = {
  getState(),
  setAlwaysOnTop(enabled),
  minimize(),
  close()
}
```

Default IPC:

```txt
aura:window:get-state
aura:window:set-always-on-top
aura:window:minimize
aura:window:close
```

## Configuration

Default seed rigging posture:

```js
{
  frame: false,
  transparent: false,
  defaultAlwaysOnTop: false
}
```

Optional HUD posture:

```js
{
  transparent: true,
  backgroundColor: '#00000000',
  defaultAlwaysOnTop: true
}
```

Always-on-top should be user-visible and toggleable even when a HUD starts pinned by default.

## Guardrails

- Renderer must not import Electron.
- Renderer must not see raw `ipcRenderer`.
- Window controls must use `window.auraWindow`.
- Window controls must not invoke domain services.
- App startup and window-state restore must not trigger live/network/domain work.
- Transparent mode is opt-in.
- Click-through mode is not part of the seed module.

## Verification

Static verification:

```powershell
npm run verify:frame
npm run verify:renderer-shell
```

`verify:frame` checks:

- Frame channel naming
- HUD option support
- state normalization
- main process uses the Frame module
- Frame module creates frameless windows
- Frame module restores/toggles always-on-top
- preload exposes `auraWindow`
- renderer uses `window.auraWindow.setAlwaysOnTop`
- renderer CSS contains drag/no-drag regions
- renderer does not import Electron or backend modules

## Decision

seed rigging now unifies Atlas and EVE window-shell behavior into the Frame module.

Atlas supplies the default reusable toggle/persistence pattern. EVE supplies optional transparent pinned HUD configuration.
