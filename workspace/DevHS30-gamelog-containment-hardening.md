# DevHS30: Gamelog Containment Hardening

Status: Complete - ready for Overseer review
Date: 2026-05-25
Role: AURA-Sense Dev

## Request

Execute the active M19 Dev runway for gamelog containment hardening. The packet focused on deterministic, fixture-only proof that configured gamelog folders and watched files stay within the accepted EVE gamelog structure and active folder boundary.

## Files Changed

- `src/combat/eveLogPaths.js`
- `src/combat/eveGamelogWatcher.js`
- `src/services/ipcPayloadValidation.js`
- `scripts/verify-gamelog-watcher.js`
- `scripts/verify-gamelog-watcher-chaos.js`
- `scripts/verify-combat-log-replay.js`
- `scripts/verify-combat-witness-core.js`
- `scripts/verify-combat-witness-runtime.js`
- `scripts/verify-runtime-control.js`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/current-state/current-implementation.md`
- `workspace/current.md`
- `workspace/DevHS30-gamelog-containment-hardening.md`

## Containment Policy Implemented

Configured gamelog folders must now resolve as real directories whose path structure ends in:

```txt
EVE/logs/Gamelogs
```

The policy does not hard-code `C:\Users\Battle_wrath` or any one user profile. It uses the accepted structure suffix as the portable rule and checks both normalized input path and real path where filesystem support is available.

`validateLogPathForWatcher` now delegates to the shared gamelog folder validator, so runtime settings, explicit configure/start calls, and watcher startup share the same folder policy.

## Path And File Read Hardening

- Watcher startup records the normalized active folder and its real path.
- Startup seeding validates each candidate `.txt` file before recording offsets.
- `fs.watch` filenames with separators or traversal-like segments are skipped before joining into a read path.
- `handleFile(filePath)` validates direct calls against the active folder before stat/range reads.
- Candidate files must be direct children of the active folder, real files, and remain inside the active folder real path.
- Symlink `.txt` files are skipped before read.
- Out-of-containment skips emit `file_skipped_outside_containment` traces without reading log content.

## Replacement Identity Behavior

The watcher now records a compact file identity from filesystem metadata when seeding or reading a log file. If a file at a watched path is replaced with a same-size or larger file, the watcher seeds the replacement at its current size, clears partial state for that path, emits `file_replaced`, and does not replay replacement tail content.

Truncation-smaller-than-offset behavior remains preserved and still emits `file_truncated`.

## Symlink/Junction Test Decision

Deterministic tests attempt symlink/junction coverage only inside repo/temp fixture paths:

- directory link/junction `Gamelogs` validation is attempted in `verify:gamelog-watcher`
- symlink `.txt` file skip is attempted in `verify:gamelog-watcher-chaos`

The tests skip those specific assertions if the local filesystem or privileges do not allow creating the link. No private operator folders or external filesystem probing are used.

## Verification

Passed:

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

Observed results:

- `verify:gamelog-watcher`: `gamelog watcher verified`
- `verify:gamelog-watcher-chaos`: `gamelog watcher chaos verified`
- `verify:combat-parser`: `combat parser verified`
- `verify:combat-parser-hostile`: `combat parser hostile fixtures verified: rejected=10`
- `verify:combat-replay`: `combat log replay verified: events=11 stream=10 watcher=3`
- `verify:diagnostics`: `diagnostics policy verified`
- `verify:protected-terms`: completed in working-set discovery mode with warning-only items; no protected-word files or renames were changed.
- `verify:all`: `all checks verified`
- `git status --short --branch`: branch `main...origin/main` with expected modified containment, fixture, docs, current-packet, and handoff files.

## Boundaries Preserved

- No private operator log folders inspected.
- No live EVE log ingestion.
- No manual filesystem probing outside repository/temp fixture paths.
- No live provider smoke.
- No manual shortcut validation.
- No real SDE refresh/download.
- No Lab face, adapter, display request, renderer, IPC, payload, service semantic, lane meaning, or UI copy work.

## Residual Risk

The structure policy now requires configured folders to end in `EVE/logs/Gamelogs`. That matches the accepted M19 input and default path, but intentionally rejects arbitrary custom folders that do not use the EVE gamelog structure.

Filesystem identity metadata is platform-provided. The deterministic replacement test covers same-size/larger replacement through fixture replacement, but platform edge cases around unusual filesystems can still be revisited in a future explicitly authorized operator-validation packet.

