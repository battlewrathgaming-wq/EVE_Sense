# Audit: Electron Smoke Overseer Handover

Date: 2026-05-22
Scope: Answer Dev's `smoke:electron` question by checking AURA Atlas, then set AURA-Sense sequencing, work product, state, and handoff.

## Verdict

Proceed, but keep the boundary clean.

AURA Atlas has the right smoke pattern for an Electron runtime check. AURA-Sense should adopt the pattern now that First Light exists, but it must remain a runtime/visual smoke separate from offline `verify:all`.

## Atlas Reference Reviewed

Location:

```txt
F:\Projects\AURA-Atlas
```

Relevant files:

- `package.json`
- `scripts/electron-visual-smoke.ps1`
- `src/main/main.js`
- `scripts/verify-renderer-shell.js`
- `docs/current-state/current-ipc-ui-preparation.md`
- `docs/gap/complete/electron-app-visual-smoke.md`

Observed pattern:

- `npm.cmd run smoke:electron` launches the real Electron app.
- The PowerShell runner derives project paths.
- Smoke artifacts live under `.tmp\electron-visual-smoke`.
- Explicit environment flags put the app into smoke mode.
- Main process waits for renderer load, captures screenshots, writes `visual-smoke-result.json`, and exits.
- Static renderer verification confirms smoke wiring remains present.

## AURA-Sense State

Current state:

- Milestone 03 is complete.
- A first product-facing Combat Witness viewport exists.
- `npm.cmd run verify:all` verifies offline contracts, parser/watcher/core foundations, Combat Witness first-light surface, renderer shell, and renderer boundary checks.

Missing state:

- AURA-Sense does not yet expose `smoke:electron`.
- The Electron runtime shell is not visually smoked.
- `.tmp\electron-visual-smoke` artifacts are not produced.
- There is no smoke-mode result file or screenshot evidence.

## Work Product Created

- `docs/gap/to-do/readiness-13-electron-visual-smoke.md`
- `docs/roadmap/milestone-04-runtime-smoke-readiness.md`

## Milestone Control

Milestone 04 is now the active next infrastructure milestone before broader UI expansion.

Reason:

First Light moved AURA-Sense from pure foundation into visible product shell. The next Dev slice should prove the running shell before adding Passive Telemetry, Threat Intel, or richer HUD surfaces.

## Handoff To Dev

Authorized next slice:

```txt
docs/gap/to-do/readiness-13-electron-visual-smoke.md
```

Sequence:

1. Add `smoke:electron` and `scripts/electron-visual-smoke.ps1`.
2. Add explicit AURA-Sense smoke flags.
3. Add main-process smoke mode after renderer load.
4. Capture screenshot and structured result under `.tmp\electron-visual-smoke`.
5. Add static verification that smoke wiring exists.
6. Run `npm.cmd run verify:all`.
7. Run `npm.cmd run smoke:electron`.
8. Update current-state and move the gap to complete if successful.

Do not:

- add smoke to `verify:all`
- require live EVE logs
- call zKill or ESI
- mutate real user settings
- implement new product panels inside the smoke slice
- copy Atlas domain checks

## Expected Closeout Evidence

Dev handover should include:

- files touched
- smoke output directory
- result JSON summary
- screenshot names
- `verify:all` output
- `smoke:electron` output
- explicit deferrals preserved
