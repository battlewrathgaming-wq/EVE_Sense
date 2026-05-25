# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M17 - Render and Frame performance assurance
Roadmap source: `docs/roadmap/milestone-17-render-frame-performance-assurance.md`
Current runway: Review-only assurance packet for Frame module, renderer shell, renderer boundary, visual smoke readiness, and performance/readiness observations
Latest closed milestone: Milestone 14 - Back-Page Threat Intel UX
Latest resting pivot: `workspace/OverseerHS18-lab-parked-render-frame-pivot.md`
Current executor: Engineering/Test assurance reviewer
Current status: Open
Expected output: `workspace/EngTestHS19-render-frame-assurance-review.md`

## Purpose

Run a bounded assurance review of the AURA-Sense renderer and Frame foundations before any future presentation/adaptor work resumes.

This is not a UI redesign, Lab face adoption, adapter implementation, or product direction change.

Primary focus:

```txt
Frame module
-> Electron window behavior
-> renderer boundary
-> renderer shell behavior
-> visual smoke and regression checks
-> performance/readiness observations
```

Lab-facing presentation work remains parked. The submitted `sense.clipboard-window` request remains advisory and does not authorize implementation.

## Required Reading

Boot and coordination:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/prompts.md`
- `workspace/overseer.md`
- `workspace/OverseerHS18-lab-parked-render-frame-pivot.md`

M17 direction:

- `docs/roadmap/README.md`
- `docs/roadmap/milestone-17-render-frame-performance-assurance.md`
- `docs/current-state/current-implementation.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/testing/aggressive-test-harness-matrix.md`

Implementation surfaces to inspect:

- `src/modules/Frame/`
- `src/main/main.js`
- `src/main/preload.js`
- `src/renderer/`
- `scripts/verify-frame-module.js`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-renderer-boundary.js`
- `scripts/verify-renderer-boundary-adversarial.js`
- `scripts/electron-visual-smoke.ps1`
- `package.json`

## Runway

1. Review the Frame module for bounds persistence, always-on-top state, minimize/close controls, invalid stored state handling, and IPC handler safety.
2. Review main-process window behavior in `src/main/main.js`, including presentation pause during move/resize, visual smoke hooks, screenshot capture, and restoration of bounds after smoke states.
3. Review preload and renderer boundary rules to confirm the renderer remains presentation-only and cannot take backend ownership.
4. Review renderer shell checks and visual smoke state checks for functional readiness, narrow bounds, resize behavior, diagnostics takeover, and screenshot reliability.
5. Identify performance/readiness risks that are visible from current code and tests, such as timer churn, unnecessary renderer work, repeated DOM pressure, window resize instability, screenshot timing fragility, or stale state during window manipulation.
6. Run deterministic verification commands listed below.
7. Run `npm.cmd run smoke:electron` only if the reviewer believes environment-sensitive runtime smoke is necessary for this assurance pass. If skipped, state why.
8. Write the expected handoff artifact with findings, risk level, verification results, and recommended next packet if any.

## Acceptance Criteria

The packet is complete when `workspace/EngTestHS19-render-frame-assurance-review.md`:

- lists files reviewed
- describes current Frame and renderer assurance posture
- identifies any bugs, missing checks, flaky smoke risks, or performance/readiness risks with file/line references where possible
- distinguishes review findings from implementation recommendations
- confirms renderer-presented, backend-owned truth remains protected
- states whether `smoke:electron` was run or intentionally skipped
- records exact verification commands and outcomes
- recommends one bounded next packet if work is needed, or says no follow-up is needed
- does not authorize UI redesign, Lab face adoption, adapter implementation, or live/manual validation

## Guardrails

- Do not implement code in this packet.
- Do not edit source files, contracts, IPC, payloads, persistence, schemas, services, backend behavior, provider behavior, shortcut behavior, or UI copy.
- Do not adopt or tune a Lab face.
- Do not create or implement a Sense adapter.
- Do not create additional Lab-facing display requests.
- Do not remove or repair Lab SmokeFlash from Sense.
- Do not weaken renderer boundary rules to simplify testing.
- Do not run live provider smoke unless explicitly authorized by the Human.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Treat archived docs as historical context only unless this packet explicitly references them.

## Stop Conditions

Stop and hand off if:

- deterministic verification fails in a way that needs source edits
- runtime smoke would require environment setup or interactive action not already available
- the review discovers a boundary issue that needs Human/Overseer scoping before Dev
- the work would need Lab repository changes
- the work would require live provider, manual shortcut, or real SDE actions

## Required Verification

Run:

```powershell
npm.cmd run verify:frame
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:protected-terms
git status --short --branch
```

Run if the reviewer chooses to include full deterministic assurance:

```powershell
npm.cmd run verify:all
```

Optional environment-sensitive runtime smoke:

```powershell
npm.cmd run smoke:electron
```

If `smoke:electron` is skipped, the handoff must explain whether it was skipped because this is review-only, because no renderer-visible/window-behavior changes were made, or because the environment was not appropriate.

## Handoff Requirements

Create:

```txt
workspace/EngTestHS19-render-frame-assurance-review.md
```

The handoff should include:

1. Files reviewed.
2. Commands run and results.
3. Frame module findings.
4. Main-process window and smoke findings.
5. Renderer boundary and shell findings.
6. Performance/readiness observations.
7. Environment-sensitive smoke decision.
8. Risks and blockers.
9. Recommended next bounded packet, if any.

## Overseer Review

Pending. This packet is open for an Engineering/Test assurance reviewer.
