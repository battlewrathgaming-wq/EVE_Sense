# Audit: Combat Window Weapon And Spike Followups Handover

Date: 2026-05-23
Status: Complete

## Scope

Close the deterministic fixture, semantics, copy, and bounds work from `combat-window-weapon-spike-followups.md`.

Real-world calibration remains explicitly deferred to `combat-metric-calibration-real-datasets.md`.

## Work Product

- Added `scripts/verify-combat-window-weapon-spike-followups.js`.
- Added `npm.cmd run verify:combat-window-followups`.
- Added the verifier to `npm.cmd run verify:all`.
- Verified repeated weapon count behavior, deterministic tie handling, missing weapon-label behavior, outgoing spike label semantics, 15 second pruning, max-event bounds, and spike outlier cap.
- Closed the broad followup packet into `docs/gap/complete`.

## Verification Signals

Completed:

```powershell
npm.cmd run verify:combat-window-followups
npm.cmd run verify:all
```

Scoped `git diff --check` for this slice also passed. Full-tree whitespace checking is still blocked by unrelated unstaged documentation edits in `docs/current-state/combat-metrics.md` and `docs/schemas/hud-snapshot.md`.

## Concerns

- The current spike rule remains `average + standard deviation`.
- This pass uses deterministic synthetic normalized events, not real combat datasets.
- Existing dirty documentation edits in `docs/current-state/combat-metrics.md` and `docs/schemas/hud-snapshot.md` were preserved and not staged as part of this slice.

## Deferred Risks

- Real-dataset calibration remains open.
- Raw repair/healing fixture intake remains open.
- Replay system channel remains open and is a backend/system packet before any UI work.

## Affected Systems And Files

- `scripts/verify-combat-window-weapon-spike-followups.js`
- `scripts/verify-all.js`
- `package.json`
- `docs/gap/complete/combat-window-weapon-spike-followups.md`
- `docs/gap/to-do/combat-metric-calibration-real-datasets.md`

## Recommendation For Overseer Review

Treat backend weapon/spike semantics as fixture-proven for exact observed labels. Do not authorize stronger spike HUD emphasis until real-dataset calibration is complete.
