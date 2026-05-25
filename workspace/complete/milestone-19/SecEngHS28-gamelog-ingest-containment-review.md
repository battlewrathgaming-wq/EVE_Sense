# SecEng HS28 - Gamelog Ingest Containment Review

Status: Complete
Date: 2026-05-25
Role: Security/Engineering-Test reviewer
Packet: M19 review-only gamelog ingest containment and fan-out assurance

## 1. Files Reviewed

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/prompts.md`
- `workspace/overseer.md`
- `workspace/OverseerHS27-m19-gamelog-containment-scope.md`
- `docs/roadmap/README.md`
- `docs/roadmap/milestone-19-gamelog-ingest-containment-and-fanout-assurance.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`
- `src/combat/eveLogPaths.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatLogParser.js`
- `src/combat/lineBuffer.js`
- `src/combat/recentEventDeduper.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessService.js`
- `src/combat/combatWitnessBridge.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/services/ipcPayloadValidation.js`
- `src/services/diagnosticsPolicy.js`
- `src/runtime/runtimeDiagnosticsService.js`
- `src/runtime/runtimeSettingsService.js`
- `src/main/main.js`
- `scripts/verify-gamelog-watcher.js`
- `scripts/verify-gamelog-watcher-chaos.js`
- `scripts/verify-combat-parser.js`
- `scripts/verify-combat-parser-hostile.js`
- `scripts/verify-combat-log-replay.js`
- `scripts/verify-combat-witness-runtime.js`
- `scripts/verify-combat-witness-core.js`
- `scripts/verify-diagnostics-policy.js`
- `scripts/verify-services.js`

## 2. Current Ingest/Fan-Out Path Map

Current path:

```txt
renderer/preload service request or native folder picker
-> service registry command `combat.witness.configure` / `combat.witness.start`
-> `validateLogPathForWatcher`
-> `createCombatWitnessRuntime.configure/start`
-> `EveGamelogWatcher.start`
-> `normalizeGamelogFolder`
-> `validateGamelogFolder`
-> `seedOffsets`
-> fs-watch or polling
-> `handleFile`
-> `readUtf8Range`
-> `collectCompleteLines`
-> `parseEveLogLine`
-> watcher `onEvent`
-> `combatWitnessRuntime.observeEvent`
-> `CombatWitnessService.addEvent`
-> Combat Witness event/snapshot listeners and bridge subscribers
-> runtime observer set
-> Passive Telemetry observer in `src/main/main.js`
```

The shared event fan-out is backend-owned. Renderer receives snapshots through the Combat Witness bridge. Passive Telemetry listens to normalized navigation events through the runtime observer registered in `src/main/main.js`.

## 3. Path Containment Findings

Finding: current validation proves that the configured path exists and is a directory, but it does not prove containment inside an expected EVE gamelog root.

Observed behavior:

- `defaultGamelogFolder` points at `Documents/EVE/logs/Gamelogs`.
- `normalizeGamelogFolder` trims and `path.resolve`s input.
- `validateLogPathForWatcher` uses `fs.statSync(value)` and accepts any existing directory.
- `validateGamelogFolder` similarly accepts any existing directory.
- Runtime settings persist the accepted path.
- The native folder picker can select any directory because it uses `openDirectory` without post-selection ancestry enforcement beyond the same validator.

Security implication:

The current implementation prevents blank, missing, and non-directory paths. It does not prevent a configured absolute path, traversal-resolved path, symlink target, or junction target from pointing outside `Documents/EVE/logs/Gamelogs` or another accepted gamelog root. That is a containment proof gap.

This does not automatically mean raw contents leak downstream: only `.txt` files are considered, existing content is offset-seeded, lines must parse as EVE-like log envelopes, and rejected lines are hash-only. But the filesystem authority boundary is broader than the M19 stated expectation.

## 4. Symlink/Junction/Traversal And Rotation/Replacement Findings

Symlink/junction/traversal:

- No `fs.realpathSync`, `fs.lstatSync`, or ancestry comparison is present in the path validators.
- `fs.statSync` follows symlinks/reparse points on supported platforms, so a symlink or junction directory can be accepted as a directory.
- `path.resolve` collapses traversal syntactically but does not enforce that the resolved target remains under an expected EVE gamelog root.
- The watcher joins folder path plus filename from `fs.watch` or `readdirSync`, but there is no explicit post-join containment check.
- Polling uses `Dirent.isFile()`, which avoids ordinary subdirectories; direct symlink-file handling depends on platform/Dirent behavior and is not covered by current tests.
- `handleFile(filePath)` itself is public and only checks `.txt` and existence before `statSync` and range reads. It does not confirm the file is inside `this.folderPath`.

Rotation/replacement/deletion/truncation:

- Startup offset seeding is covered: existing files seed at current size and are not replayed.
- New files seed at current size and are not replayed until future appends.
- Deletion events are harmless because `handleFile` exits if the path no longer exists.
- Truncation/replacement with a smaller size clears partial state and does not replay replacement content.
- Tail read failure does not advance the offset, so unread bytes can be consumed on a later successful read.

Remaining replacement gap:

If a watched `.txt` file is replaced with a different file whose size is greater than or equal to the prior offset, current logic does not prove file identity and may read from the prior offset into the replacement file. Existing tests cover truncation/replacement smaller than the previous offset; they do not cover same-size/larger replacement identity changes. Parser normalization and hash-only rejection reduce content leakage risk, but this is still an ingest trust-boundary gap.

## 5. Parser Rejection And Raw-Line Handling Findings

Positive findings:

- `parseEveLogLine` rejects blank and over-4096-character lines.
- The parser requires an EVE-style timestamp envelope and strict UTC timestamp validation.
- Non-combat channels only produce navigation events for accepted jump phrases.
- Combat events require supported damage/miss patterns and accepted hit-quality/color/relation semantics.
- Accepted events carry normalized fields and `rawLineHash`, not raw line text.
- Rejected watcher lines produce `{ filePath, rawLineHash, reason, message }` and do not retain the raw line text.
- Parser exceptions become rejected-line evidence and do not stop later lines.
- `collectCompleteLines` holds incomplete lines until newline and drops oversized partials.
- Deduplication suppresses duplicate recent events by id/raw hash.

Security interpretation:

Malformed, oversized, private-content lookalike, partial-line, and near-miss inputs are largely handled at the parser and watcher evidence layer. The parser is not a content exfiltration path by itself because unsupported lines become hash-only rejection evidence.

Remaining parser/fan-out nuance:

Navigation events are emitted to runtime observers but are not included in Combat Witness `eventStream` because the Combat Witness service only streams combat damage/miss/repair. Passive Telemetry consumes navigation events. This separation is intentional and should remain visible in future tests.

## 6. Diagnostics Sanitization Findings

Positive findings:

- `DiagnosticsPolicy` suppresses low-value watcher chatter by default.
- `line_rejected` with reason `unparsed` is low priority by default; parser errors remain high priority.
- `runtimeDiagnosticsService.sanitizePayload` redacts payload keys matching raw/line/content unless the key also includes hash.
- String payload values are capped at 180 characters.
- Rejection and parser-error tests assert raw line text is absent and raw hashes are present.

Residual privacy note:

Diagnostics can still include `filePath`, configured watcher path, and short error messages. That is useful operational evidence, but it means local path disclosure is expected inside Sense diagnostics. No current deterministic check proves path redaction because current design does not redact path fields.

## 7. Shared Fan-Out Listener Map

Watcher-level:

- `EveGamelogWatcher.onEvent` calls runtime `observeEvent`.
- Watcher catches `onEvent` listener exceptions and traces `listener_error`.
- Watcher parser exceptions are caught per line and become rejected-line evidence.

Runtime-level:

- `createCombatWitnessRuntime.observeEvent` sends every normalized event to `CombatWitnessService.addEvent`.
- Runtime then notifies `runtime.observers`.
- Runtime catches observer exceptions and traces `combat_runtime_observer_error`.

Service-level:

- `CombatWitnessService.addEvent` ignores non-combat-witness events for Combat Witness metrics.
- Combat Witness event listeners are isolated with `combat_event_listener_error`.
- Combat Witness snapshot sink/listeners are isolated with `combat_snapshot_sink_error` and `combat_snapshot_listener_error`.

Main listeners:

- `src/main/main.js` registers a runtime observer that calls `passiveTelemetryService.observeEvent(event)`.
- That observer attaches `.catch(...)` and records `passive_observer_error`, so async Passive failures should not poison Combat Witness runtime.

Bridge:

- `combatWitnessBridge` subscribes to Combat Witness snapshots, throttles sends, removes destroyed web contents, and sends snapshot-only payloads to renderer subscribers.

## 8. Existing Deterministic Test Map

Commands run in this review:

```powershell
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:gamelog-watcher-chaos
npm.cmd run verify:combat-parser
npm.cmd run verify:combat-parser-hostile
npm.cmd run verify:combat-replay
npm.cmd run verify:diagnostics
```

Results: all passed.

Coverage map:

| Boundary | Current deterministic coverage |
| --- | --- |
| Default gamelog folder | `verify:gamelog-watcher` checks Windows default path string. |
| Blank/missing path | `verify:gamelog-watcher`, `verify:services`, and runtime checks cover blank/missing rejection. |
| Directory versus file | validators check directory status; direct test coverage exists for missing/blank but not all containment variants. |
| Startup offset | `verify:gamelog-watcher`, `verify:gamelog-watcher-chaos`, and `verify:combat-replay` cover seed-without-replay. |
| New file behavior | watcher tests cover seed current content then parse future append. |
| Append-only reads | watcher and replay tests cover future appended lines. |
| Partial lines | parser/watcher/replay tests cover hold-until-newline and oversized partial drop. |
| Truncation/replacement smaller than offset | chaos test covers no replay and `file_truncated` trace. |
| Deletion | chaos test covers harmless deleted-file event. |
| Tail read failure | chaos test proves offset is not advanced on failed read. |
| Parser hostile input | parser hostile fixtures cover malformed envelopes, timestamp edges, near-misses, private-content lookalikes, and oversized generated lines. |
| Raw-line leakage in rejection | watcher, chaos, replay, and hostile parser tests cover hash-only rejection evidence. |
| Listener isolation | watcher, Combat Witness service, and runtime replay tests cover parser, listener, snapshot, and observer isolation. |
| Diagnostics policy | diagnostics verifier covers priority filtering and high-value error preservation. |

## 9. Missing Adversarial Tests

Priority 1:

- Realpath containment validation for configured gamelog folder.
- Symlink or junction directory pointing outside an accepted root should be rejected or explicitly documented as allowed.
- Traversal-resolved folder such as an input ending in `..\outside` should be rejected if outside accepted root.
- `handleFile` or watcher dispatch should reject/read-skip file paths that are not contained under the active folder after normalization/realpath.

Priority 2:

- Same-size or larger replacement file should not let Sense read arbitrary replacement tail content under an old offset.
- fs-watch filename containing path separators or traversal-like segments should not escape the watched folder.
- Symlink `.txt` file inside the folder pointing outside the folder should be rejected or covered according to accepted policy.

Priority 3:

- Runtime diagnostics path exposure should be explicitly accepted or redacted according to Sense policy.
- Polling and fs-watch should share the same containment helper so future behavior does not diverge.

## 10. Risks/Blockers

Blocker for claiming full M19 containment: current code/tests do not prove that configured paths, symlink directories, junction directories, or traversal-resolved paths cannot escape the expected EVE gamelog structure.

Risk: any existing directory can be configured as the gamelog folder. Sense will then watch `.txt` files in that directory. Parser rejection and hash-only diagnostics reduce raw-content leakage, but the filesystem authority is wider than the stated trust boundary.

Risk: same-size/larger replacement files are not identity-checked. A replacement file under a watched name may be read from the previous offset if its size is not smaller.

Not a blocker: malformed line handling, oversized line handling, partial-line handling, truncation-smaller-than-offset behavior, deletion handling, raw-line rejection evidence, diagnostics filtering, and listener isolation all have meaningful deterministic coverage.

## 11. Recommended Next Bounded Packet

Recommended next packet: deterministic gamelog containment hardening.

Suggested Dev artifact:

`workspace/DevHS29-gamelog-containment-hardening.md`

Suggested scope:

- Add a shared path containment helper for gamelog folder and file paths.
- Decide and encode the accepted root policy, likely defaulting to the expected EVE `Documents/EVE/logs/Gamelogs` structure unless Human/Overseer accepts custom roots.
- Use `realpath`/`lstat`-aware checks to reject symlink/junction escapes where feasible on Windows.
- Re-check containment after path join and before range reads.
- Add deterministic tests for traversal, symlink/junction escape, direct `handleFile` outside-folder calls, fs-watch separator-like filenames, and same-size/larger replacement identity behavior.
- Keep verification offline and fixture-only.

Required verification for that future packet should include:

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

Non-goals for the next packet:

- no live EVE log ingestion
- no private operator log folders
- no manual filesystem probing outside repo/temp fixtures
- no live provider smoke
- no manual shortcut validation
- no real SDE refresh/download
- no Lab face, adapter, request display, renderer behavior, IPC payload, or UI copy changes

