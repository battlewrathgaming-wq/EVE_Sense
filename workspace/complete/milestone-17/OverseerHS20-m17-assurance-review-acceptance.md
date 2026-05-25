# Overseer HS20 - M17 Assurance Review Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer
Reviewed handoff: `workspace/EngTestHS19-render-frame-assurance-review.md`

## Decision

Accepted.

The M17 Engineering/Test assurance review completed the review-only packet and found no blockers.

The handoff is specific, file-grounded, and suitable to convert into one bounded Dev packet.

## Accepted Findings

No blocking Frame, renderer boundary, renderer shell, or deterministic verification defect was found.

Accepted follow-up items:

- Product window bounds persistence is supported by the Frame module but is not currently enabled in main-window wiring. This is a product/runtime behavior decision and should be made explicit in the next Dev packet.
- Visual regression smoke mutates window bounds and restores them after the state loop, but restoration is not guarded by `finally`. This is a smoke reliability hardening item.
- Move/resize IPC, clipboard polling, and smoke fixed waits are current performance review items, not immediate blockers.

Accepted verification record:

- `npm.cmd run verify:frame` passed.
- `npm.cmd run verify:renderer-shell` passed.
- `npm.cmd run verify:renderer-boundary` passed.
- `npm.cmd run verify:renderer-boundary-adversarial` passed.
- `npm.cmd run verify:protected-terms` passed in the reviewer context.
- `npm.cmd run verify:all` passed.
- `npm.cmd run smoke:electron` was intentionally skipped because the packet was review-only and made no renderer-visible or Electron-window behavior changes.

## Next Runway

Open a bounded M17 Dev packet:

```txt
Frame/window smoke hardening
```

The packet should:

- decide and implement whether the AURA-Sense product window should enable Frame bounds persistence
- add or update deterministic verification for the chosen product-window bounds persistence behavior
- add `try/finally` restoration around visual regression smoke window bounds mutation
- keep all work inside Frame/window smoke hardening

## Guardrails

- Do not adopt or tune a Lab face.
- Do not implement adapter work.
- Do not change provider/live IO behavior.
- Do not change payloads, schemas, service semantics, or lane meanings.
- Do not run live provider smoke, manual shortcut validation, or real SDE refresh/download.
- Run `smoke:electron` only after renderer-visible or Electron-window behavior changes, if the environment supports it.

## Resting State

M17 remains active.

`workspace/current.md` should move from Engineering/Test review to a bounded Dev implementation packet for the accepted hardening items.
