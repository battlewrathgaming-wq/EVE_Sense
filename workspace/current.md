# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M17 - Render and Frame performance assurance
Roadmap source: `docs/roadmap/milestone-17-render-frame-performance-assurance.md`
Current runway: Frame/window smoke hardening implementation
Latest closed milestone: Milestone 14 - Back-Page Threat Intel UX
Latest resting pivot: `workspace/OverseerHS18-lab-parked-render-frame-pivot.md`
Latest assurance review: `workspace/EngTestHS19-render-frame-assurance-review.md`
Latest Overseer acceptance: `workspace/OverseerHS20-m17-assurance-review-acceptance.md`
Current executor: Dev
Current status: Open
Expected output: `workspace/DevHS21-frame-window-smoke-hardening.md`

## Purpose

Implement the bounded M17 hardening items accepted from the Engineering/Test assurance review.

This packet is focused on Frame/window smoke hardening only:

```txt
Frame product-window bounds persistence decision
-> deterministic verification for chosen behavior
-> visual smoke bounds restoration guard
```

Lab-facing presentation work remains parked. This packet does not adopt a Lab face, create an adapter, redesign UI, or change Sense lane meanings.

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

M17 and accepted review:

- `docs/roadmap/README.md`
- `docs/roadmap/milestone-17-render-frame-performance-assurance.md`
- `workspace/EngTestHS19-render-frame-assurance-review.md`
- `workspace/OverseerHS20-m17-assurance-review-acceptance.md`
- `docs/current-state/current-implementation.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/testing/aggressive-test-harness-matrix.md`

Implementation surfaces:

- `src/modules/Frame/`
- `src/main/main.js`
- `scripts/verify-frame-module.js`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-renderer-boundary.js`
- `scripts/verify-renderer-boundary-adversarial.js`
- `scripts/electron-visual-smoke.ps1`
- `package.json`

## Runway

1. Review the accepted HS19 findings and confirm the narrow implementation target.
2. Decide whether the AURA-Sense product window should enable Frame bounds persistence.
3. If bounds persistence is enabled, wire the main-window Frame option explicitly and add deterministic verification that proves the intended product-window option is present.
4. If bounds persistence is intentionally left disabled, add deterministic verification or documentation that makes the decision explicit.
5. Add a `try/finally` restoration guard around visual regression smoke window bounds mutation so smoke state failures restore original bounds before the smoke process exits where possible.
6. Keep edits limited to the minimum files needed for these hardening items.
7. Run required verification.
8. Create the expected Dev handoff artifact with files changed, behavior changed, verification results, and any residual risk.

## Acceptance Criteria

The packet is complete when:

- the product-window bounds persistence decision is explicit in code verification or documentation
- if bounds persistence is enabled, the main-window wiring and deterministic verification prove it
- if bounds persistence remains disabled, the decision is explicit and deterministic verification protects it
- visual regression smoke bounds restoration uses `try/finally` or an equivalent reliable restoration guard
- renderer boundary and shell verification still pass
- `verify:all` passes
- `smoke:electron` is run if the environment supports runtime smoke after Electron-window behavior changes, or the Dev handoff clearly explains why it was skipped
- no Lab face, adapter, provider/live IO, payload/schema, service-semantic, lane-meaning, or UI redesign work is included

## Guardrails

- Do not adopt or tune a Lab face.
- Do not implement adapter work.
- Do not change provider/live IO behavior.
- Do not change payloads, schemas, service semantics, lane meanings, or UI copy.
- Do not weaken renderer boundary rules to simplify testing.
- Do not run live provider smoke unless explicitly authorized by the Human.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Treat archived docs as historical context only unless this packet explicitly references them.

## Stop Conditions

Stop and hand off if:

- enabling or disabling bounds persistence needs product direction beyond HS19/HS20
- the smoke restoration change requires broad visual smoke restructuring
- deterministic verification fails in a way that is outside Frame/window smoke hardening
- `smoke:electron` requires environment setup or interactive action not already available
- work would need Lab repository changes
- work would require live provider, manual shortcut, or real SDE actions

## Required Verification

Run:

```powershell
npm.cmd run verify:frame
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Run if the environment supports runtime smoke after the Electron-window behavior change:

```powershell
npm.cmd run smoke:electron
```

If `smoke:electron` is skipped, the Dev handoff must explain why.

## Handoff Requirements

Create:

```txt
workspace/DevHS21-frame-window-smoke-hardening.md
```

The handoff should include:

1. Files changed.
2. Product-window bounds persistence decision.
3. Smoke restoration hardening summary.
4. Verification commands and results.
5. `smoke:electron` decision and result, if run.
6. Residual risks or follow-up recommendations.

## Overseer Review

Pending. This packet is open for Dev.
