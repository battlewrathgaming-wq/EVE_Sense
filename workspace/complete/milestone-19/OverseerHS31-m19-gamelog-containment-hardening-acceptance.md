# OverseerHS31: M19 Gamelog Containment Hardening Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer

## Reviewed

- `workspace/current.md`
- `workspace/DevHS30-gamelog-containment-hardening.md`
- `workspace/SecEngHS28-gamelog-ingest-containment-review.md`
- `workspace/OverseerHS29-m19-containment-review-acceptance.md`
- `src/combat/eveLogPaths.js`
- `src/combat/eveGamelogWatcher.js`
- `src/services/ipcPayloadValidation.js`
- `scripts/verify-gamelog-watcher.js`
- `scripts/verify-gamelog-watcher-chaos.js`
- `scripts/verify-combat-log-replay.js`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`

## Acceptance

M19 is accepted as complete.

The Dev packet implemented the accepted containment hardening for the EVE gamelog ingest lane. Configured gamelog folders now share a structure policy that requires the resolved folder and real path to end in `EVE/logs/Gamelogs`, without hard-coding the Human's profile path as the only valid location.

The watcher now validates active-folder file reads before range reads, rejects symlink `.txt` files, skips separator/traversal-like `fs.watch` filenames before joining paths, and treats same-size/larger file replacement as a new identity that should be seeded rather than replayed from an old offset.

## Accepted Evidence

- Runtime settings validation and watcher startup use the same gamelog folder validator.
- Startup seeding validates `.txt` candidates before recording offsets.
- Direct `handleFile` calls outside the active folder are skipped before file range reads.
- Realpath-aware checks are used where filesystem support is available.
- Deterministic tests cover traversal/structure rejection, active-folder containment, unsafe watcher filenames, symlink/link escape attempts where locally feasible, and replacement identity behavior.
- Parser rejection, diagnostics sanitization, replay, runtime, and existing witness behavior remained verified.

## Verification

Overseer reran the required verification on 2026-05-25:

```powershell
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:gamelog-watcher-chaos
npm.cmd run verify:combat-parser
npm.cmd run verify:combat-parser-hostile
npm.cmd run verify:combat-replay
npm.cmd run verify:diagnostics
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Results:

- `verify:gamelog-watcher`: passed
- `verify:gamelog-watcher-chaos`: passed
- `verify:combat-parser`: passed
- `verify:combat-parser-hostile`: passed, `rejected=10`
- `verify:combat-replay`: passed, `events=11 stream=10 watcher=3`
- `verify:diagnostics`: passed
- `verify:protected-terms`: exited 0 as warning-only discovery; 225 warning-only items, no renames and no protected-word JSON updates
- `verify:all`: passed, `all checks verified`

## Boundaries Preserved

- No private operator folders were inspected.
- No live EVE log ingestion was run.
- No manual filesystem probing outside repository/temp fixture paths was run.
- No live provider smoke, manual shortcut validation, or real SDE refresh was run.
- No Lab, adapter, renderer, IPC, payload, lane meaning, or UI copy work was included.

## Residual Risk

The structure policy intentionally rejects arbitrary custom folders that do not end in `EVE/logs/Gamelogs`. That is accepted for M19 because it matches the Human-provided path structure and keeps the file monitor inside the expected EVE log shape.

Platform-specific filesystem identity behavior remains dependent on OS/file metadata. The deterministic replacement tests cover the accepted fixture behavior; any operator-environment validation should be opened later as a separate live/manual packet.

## Resting State

M19 may be marked complete.

`workspace/current.md` should return to idle with no active executor. Future work should not continue from the M19 Dev packet unless Human explicitly opens a new milestone/runway.
