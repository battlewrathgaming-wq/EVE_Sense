# M17 - Render And Frame Performance Assurance

Status: Active

## Outcome

AURA-Sense improves confidence in renderer functionality, runtime visual smoke, and Frame module manipulation before returning to presentation adoption work.

This milestone shifts the near focus from face/presentation design to the product shell underneath it:

```txt
Frame module
-> Electron window behavior
-> renderer boundary
-> renderer shell behavior
-> visual smoke and regression checks
-> performance/readiness observations
```

## Why This Is Milestone-Sized

This is more than a single bug fix because Sense already has a working tactical viewport, but future face/adaptor work will depend on a stable renderer and window shell.

The repo already has relevant foundations:

- `src/modules/Frame/`
- `src/main/main.js` visual smoke and window manipulation paths
- `src/renderer/`
- `scripts/verify-frame-module.js`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-renderer-boundary.js`
- `scripts/verify-renderer-boundary-adversarial.js`
- `scripts/electron-visual-smoke.ps1`

M17 should harden those foundations before Sense worries about Lab presentation mechanics again.

## Likely Runways

- Review Frame module behavior for bounds persistence, always-on-top state, minimize/close controls, and invalid stored state handling.
- Review renderer visual smoke checks for viewport states, narrow bounds, resize behavior, diagnostics takeover, and screenshot reliability.
- Identify deterministic performance/readiness checks that can run without live provider smoke.
- Add focused verification for frame manipulation or renderer readiness only where the audit finds a real untested risk.
- Record any Electron visual smoke flake classes or capture timing issues as runtime/smoke hardening work, not presentation design.

## Acceptance Criteria

M17 is complete when:

- Frame module behavior has been reviewed against current contracts and verification
- renderer shell and boundary checks still prove renderer-presented, backend-owned truth
- visual smoke checks are reviewed for functional readiness, not face taste
- any new checks are deterministic or explicitly labeled environment-sensitive
- performance/readiness observations are recorded without requiring Lab face adoption
- no SmokeFlash/Lab workshop tooling is imported into Sense
- no UI redesign, Lab face adoption, adapter implementation, provider behavior, IPC, payload, persistence, schema, or service change is implied unless a later `workspace/current.md` runway opens it

## Non-Goals

- Do not adopt or tune a Lab face.
- Do not implement adapter work.
- Do not remove or repair Lab SmokeFlash from Sense.
- Do not make presentation taste decisions.
- Do not run live provider smoke, manual shortcut validation, or real SDE refresh/download.
- Do not weaken renderer boundary rules to simplify tests.

## Dependencies

- `docs/current-state/current-implementation.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `src/modules/Frame/`
- `src/main/main.js`
- `src/renderer/`
- `package.json`
- Human decision to open a performance/render/frame assurance runway

## Verification Shape

Review-only packets:

- `npm.cmd run verify:protected-terms`
- `git status --short --branch`

Likely implementation or hardening packets:

- `npm.cmd run verify:frame`
- `npm.cmd run verify:renderer-shell`
- `npm.cmd run verify:renderer-boundary`
- `npm.cmd run verify:renderer-boundary-adversarial`
- `npm.cmd run verify:all`
- `npm.cmd run smoke:electron` when renderer-visible or Electron-window behavior changes

No live provider smoke, manual shortcut validation, or real SDE refresh/download is implied.
