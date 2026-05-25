# EngTest HS19 - Render Frame Assurance Review

Status: Complete
Date: 2026-05-25
Role: Engineering/Test assurance reviewer
Packet: M17 review-only assurance packet

## 1. Files reviewed

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `workspace/current.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/prompts.md`
- `workspace/overseer.md`
- `workspace/OverseerHS18-lab-parked-render-frame-pivot.md`
- `docs/roadmap/milestone-17-render-frame-performance-assurance.md`
- `docs/current-state/current-implementation.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`
- `src/modules/Frame/index.js`
- `src/modules/Frame/windowShell.js`
- `src/modules/Frame/windowState.js`
- `src/main/main.js`
- `src/main/preload.js`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `scripts/verify-frame-module.js`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-renderer-boundary.js`
- `scripts/verify-renderer-boundary-adversarial.js`
- `scripts/electron-visual-smoke.ps1`

## 2. Commands run and results

All required deterministic verification passed.

```powershell
npm.cmd run verify:frame
```

Result: passed. Output ended with `Frame module verified`.

```powershell
npm.cmd run verify:renderer-shell
```

Result: passed. Output ended with `renderer shell verified`.

```powershell
npm.cmd run verify:renderer-boundary
```

Result: passed. Output ended with `renderer boundary verified (4 files scanned)`.

```powershell
npm.cmd run verify:renderer-boundary-adversarial
```

Result: passed. Output ended with `renderer boundary adversarial checks verified`.

```powershell
npm.cmd run verify:protected-terms
```

Result: passed. Working-set mode scanned 0 changed files and completed without findings or mutations.

```powershell
git status --short --branch
```

Result before this handoff file was created: clean branch state, `## main...origin/main`.

Full deterministic assurance was also run:

```powershell
npm.cmd run verify:all
```

Result: passed. Output ended with `all checks verified`.

## 3. Frame module findings

- No blocking Frame module defect found in the reviewed code or deterministic checks.
- Bounds handling is defensive at the helper layer. `loadFrameState` falls back to default state on missing, invalid, or unreadable JSON, and `normalizeFrameState` routes bounds through `normalizeBounds`; invalid or non-positive width/height becomes `null` instead of being applied (`src/modules/Frame/windowState.js:9`, `src/modules/Frame/windowState.js:39`, `src/modules/Frame/windowState.js:46`, `src/modules/Frame/windowState.js:67`).
- Bounds persistence exists but is opt-in. The shell default is `persistBounds: false`; persisted bounds are written on close only when that option is enabled (`src/modules/Frame/windowShell.js:15`, `src/modules/Frame/windowShell.js:49`). The current main window creation does not pass `persistBounds: true`, so the product window restores always-on-top state but not window bounds under the current wiring (`src/main/main.js:113`, `src/main/main.js:121`).
- Always-on-top state is safer than bounds persistence in current wiring. The IPC handler validates boolean payloads, applies `window.setAlwaysOnTop`, and persists the updated frame state even when bounds persistence is disabled (`src/modules/Frame/windowShell.js:66`, `src/modules/Frame/windowShell.js:75`, `src/modules/Frame/windowShell.js:79`).
- Minimize and close controls are narrow and main-process owned. Renderer UI calls the preload bridge, and the Frame IPC handlers check for a live, non-destroyed window before mutating it (`src/renderer/app.js:145`, `src/renderer/app.js:146`, `src/main/preload.js:33`, `src/main/preload.js:34`, `src/modules/Frame/windowShell.js:85`, `src/modules/Frame/windowShell.js:93`).
- The focused Frame verifier covers helper normalization, null bounds, frameless construction, always-on-top restoration, invalid always-on-top rejection, drag/no-drag regions, and absence of direct Electron APIs in renderer code (`scripts/verify-frame-module.js:17`, `scripts/verify-frame-module.js:29`, `scripts/verify-frame-module.js:39`, `scripts/verify-frame-module.js:52`, `scripts/verify-frame-module.js:67`).

## 4. Main-process window and smoke findings

- No blocking main-process window defect found.
- Window creation is centralized through the Frame module, with compact bounds and narrow minimum dimensions for smoke/overlay readiness (`src/main/main.js:112`, `src/main/main.js:114`, `src/main/main.js:117`).
- Move/resize presentation pause is implemented in main and renderer. Main emits `aura:window:presentation-pause` on move/resize and resumes after 180 ms; renderer also pauses on drag pointer-down and flushes queued lane updates after resume (`src/main/main.js:168`, `src/main/main.js:189`, `src/renderer/app.js:162`, `src/renderer/app.js:204`, `src/renderer/app.js:210`).
- Visual smoke uses explicit opt-in flags, isolated user data, structured result output, screenshot capture retries, and named visual regression states (`src/main/main.js:540`, `src/main/main.js:592`, `src/main/main.js:618`, `src/main/main.js:638`, `src/main/main.js:937`, `scripts/electron-visual-smoke.ps1:15`, `scripts/electron-visual-smoke.ps1:31`).
- Screenshot reliability has an explicit retry path for `UnknownVizError`, which is a good sign that prior capture fragility is handled in the smoke harness (`src/main/main.js:937`).
- Assurance gap: `captureVisualRegressionStates` restores the original bounds after the state loop, but the restoration is not inside a `finally`. If an assertion or screenshot capture fails after `window.setSize` or `window.setBounds`, the failure artifact may be captured from the mutated state and the in-process window may not restore before app exit (`src/main/main.js:638`, `src/main/main.js:849`, `src/main/main.js:858`, `src/main/main.js:867`). Because smoke uses isolated user data and current product bounds persistence is disabled, this is a smoke reliability/readability risk rather than a durable user-state corruption risk.

## 5. Renderer boundary and shell findings

- Renderer-presented, backend-owned truth remains protected by code shape and verification.
- Preload exposes a fixed renderer service allowlist and rejects generic service commands outside that set (`src/main/preload.js:3`, `src/main/preload.js:14`, `src/main/preload.js:16`). The adversarial verifier compares this allowlist to expected renderer authority and ensures the full backend service inventory is not exposed (`scripts/verify-renderer-boundary-adversarial.js:65`, `scripts/verify-renderer-boundary-adversarial.js:105`).
- Preload lane APIs expose snapshot requests/subscriptions and service requests, not parser/provider ownership. Subscription callbacks are type-checked and listener cleanup is present for Combat Witness, Passive Telemetry, clipboard snapshots, and target-kind toggles (`src/main/preload.js:48`, `src/main/preload.js:64`, `src/main/preload.js:79`, `src/main/preload.js:108`, `src/main/preload.js:118`).
- Renderer uses backend snapshots and preload service calls for Combat Witness, Passive Telemetry, Threat Intel, runtime controls, and Frame controls. Direct Node/Electron APIs remain absent from renderer code under both static boundary verifiers (`src/renderer/app.js:67`, `src/renderer/app.js:76`, `src/renderer/app.js:93`, `src/renderer/app.js:725`, `scripts/verify-renderer-boundary.js:8`, `scripts/verify-renderer-boundary-adversarial.js:84`).
- Renderer DOM updates use `textContent`/controlled class changes rather than `innerHTML`, and the shell verifier explicitly guards that (`src/renderer/app.js:1346`, `scripts/verify-renderer-shell.js:239`).
- Event-list rendering is bounded to five event stream items and replaces children each render, limiting repeated DOM growth (`src/renderer/app.js:325`, `src/renderer/app.js:841`, `src/renderer/app.js:842`).

## 6. Performance/readiness observations

- Positive: presentation pause queues only the latest update per lane key while the window is being dragged/resized, reducing renderer churn during manipulation (`src/renderer/app.js:204`, `src/renderer/app.js:210`).
- Positive: main-process capture retry is bounded to three attempts and only special-cases `UnknownVizError`; other screenshot failures fail fast (`src/main/main.js:937`).
- Positive: renderer event-list DOM pressure is bounded and rebuilt from a small event slice (`src/renderer/app.js:325`, `src/renderer/app.js:841`).
- Review item: move/resize pause events can fire repeatedly during active manipulation, and each event resets a main-process timer and sends IPC (`src/main/main.js:168`, `src/main/main.js:176`, `src/main/main.js:189`). This is intentional but worth load-checking if future renderer work increases snapshot or animation density.
- Review item: renderer Threat Intel keeps a 1s clipboard state poll after boot and uses a 1s capture poll while manual acquisition is active; main process also polls clipboard capture every 400 ms during shortcut acquisition (`src/renderer/app.js:109`, `src/renderer/app.js:446`, `src/main/main.js:512`). This is bounded by acquisition state, but idle polling should remain visible in future performance reviews.
- Review item: smoke uses fixed waits around viewport changes and screenshot capture (`src/main/main.js:849`, `src/main/main.js:934`). Current retries reduce flake risk, but layout/canvas/GPU timing remains environment-sensitive by nature.

## 7. Environment-sensitive smoke decision

`npm.cmd run smoke:electron` was intentionally skipped.

Reason: this was a review-only packet with no renderer-visible or Electron-window behavior changes made in this session. The required deterministic checks and `verify:all` passed, and `smoke:electron` is explicitly environment-sensitive and excluded from local deterministic assurance in `docs/testing/aggressive-test-harness-matrix.md`.

The smoke harness itself was reviewed for readiness and remains available for the next renderer-visible/window-behavior implementation packet.

## 8. Risks and blockers

- Blockers: none found.
- Medium assurance question: product window bounds persistence is not currently enabled in `createWindow`, despite the Frame module supporting persisted bounds. If M17 acceptance expects user window position/size restoration, a later bounded implementation packet should make that intent explicit and add deterministic checks around main-window option wiring.
- Low smoke reliability risk: visual regression bounds restoration is not protected by `finally`, so failed smoke states may leave failure artifacts in a mutated viewport state before process exit.
- Low performance review item: repeated move/resize IPC and idle clipboard-state polling are acceptable at current scale but should be revisited before heavier presentation/adaptor work resumes.

## 9. Recommended next bounded packet

Recommended next packet: Frame/window smoke hardening implementation.

Scope:

- Decide whether AURA-Sense product window should enable `persistBounds: true`.
- If yes, wire it in `src/main/main.js` and add deterministic verification that main-window Frame options enable bounds persistence.
- Add a `try/finally` restoration guard around visual regression smoke bounds mutation.
- Keep the packet limited to Frame/window smoke hardening and rerun `verify:frame`, `verify:renderer-shell`, `verify:renderer-boundary`, `verify:renderer-boundary-adversarial`, `verify:protected-terms`, `verify:all`, and `smoke:electron` if the environment is appropriate.

Do not include Lab face adoption, adapter work, provider/live IO changes, payload/schema changes, UI redesign, live provider smoke, manual shortcut validation, or real SDE refresh/download.
