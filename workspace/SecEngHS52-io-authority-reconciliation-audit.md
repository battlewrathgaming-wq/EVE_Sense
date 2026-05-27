# SecEngHS52 - I/O Authority Reconciliation Audit

Date: 2026-05-27
Role: Security / Engineering reviewer
Status: Read-only audit complete

## 1. Files Reviewed

Authority / project state:

- `AGENTS.md`
- `workspace/current.md`
- `workspace/overview.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `docs/adr/ADR-0008-io-off-means-no-ingest.md`
- `docs/adr/ADR-0005-clipboard-acquisition-authority-and-cache.md`
- `docs/current-state/current-implementation.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/features/vision.md`
- `docs/features/clipboard-acquisition.md`
- `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/testing/live-api-smoke-transition-readiness.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `package.json`

Runtime / source:

- `src/main/main.js`
- `src/main/preload.js`
- `src/passive/liveIoGate.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/passive/localSystemResolver.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/threat/threatIntelTargetResolver.js`
- `src/threat/clipboardAcquisitionService.js`
- `src/threat/clipboardAcquisitionGate.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/eveLogPaths.js`
- `src/combat/combatLogParser.js`
- `src/combat/combatWitnessService.js`
- `src/runtime/runtimeSettingsService.js`
- `src/runtime/runtimeDiagnosticsService.js`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`

Verification / smoke scripts:

- `scripts/verify-all.js`
- `scripts/verify-runtime-control.js`
- `scripts/verify-gamelog-watcher.js`
- `scripts/verify-gamelog-watcher-chaos.js`
- `scripts/verify-combat-witness-runtime.js`
- `scripts/verify-passive-telemetry.js`
- `scripts/verify-threat-intel.js`
- `scripts/verify-clipboard-acquisition-race.js`
- `scripts/verify-operator-io-gate-separation.js`
- `scripts/verify-provider-fault-injection.js`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-renderer-boundary.js`
- `scripts/verify-renderer-boundary-adversarial.js`
- `scripts/smoke-passive-live-api.js`
- `scripts/smoke-threat-live-api.js`
- `scripts/electron-visual-smoke.ps1`

## 2. Current Understanding Of ADR-0008

ADR-0008 changes the trust model from "live provider and Clipboard Acquisition are gated" to "I/O is the user's ultimate authority over ingest behavior on their machine."

Target meaning:

- I/O off means Sense must not ingest from logs, clipboard, providers, or other local/input/live sources.
- Existing displayed state may remain visible as last observed/resting state.
- I/O off is not provider failure, no observation, no provider data, or app malfunction.
- Default I/O should be off unless a later accepted settings policy changes that.
- If an ingest-dependent action is attempted while I/O is off, the UI should show an authority-blocked response without making the lane look broken.

This audit treats ADR-0008 as target authority and does not assume the current implementation is aligned.

## 3. Ingest Path Table

| path / behavior | source files | current I/O control | ADR-0008 target behavior | current gap or conflict | likely future code change | likely future test/doc change | risk / notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Runtime I/O control snapshot and toggle | `src/main/main.js`, `src/passive/liveIoGate.js`, `src/renderer/app.js`, `src/main/preload.js` | `runtime.live-io.set-enabled` toggles Passive and Threat live gate objects. It does not control Combat Witness watcher/parser ingest. | One operator authority state should stop all ingest-capable behavior, including log ingest, provider calls, clipboard reads, and parser-fed observations. | Runtime copy still says "network and clipboard" and command descriptions say provider lanes. It is narrower than ADR-0008. | Extend runtime policy application to Combat Witness watcher/parser lifecycle and perhaps expose richer lane impact in snapshot without renaming bridge fields casually. | Add runtime-control tests proving I/O off blocks watcher start or stops/pauses active watcher. Update renderer-shell assertions for broader copy. | High trust risk because the visible IO button can imply all ingest is off while logs may still ingest. |
| Gamelog folder selection / persisted settings | `src/main/main.js`, `src/runtime/runtimeSettingsService.js`, `src/combat/eveLogPaths.js`, `src/renderer/app.js` | Selection/configuration is allowed regardless of I/O. Startup recovery configures valid persisted path but does not start watcher. | Support-only configuration can remain allowed while I/O is off if it does not read gamelog contents beyond validation/stat/realpath. Watcher start/read must remain blocked. | Mostly compatible. Folder picker returns full path to renderer and settings persist local path; this is configuration, not ingest, but user copy should avoid implying watching starts while off. | Keep configure/persist allowed. Gate only start/active read behavior. Consider setting watcher state to authority-blocked when start is requested with I/O off. | Add test that persisted settings recovery configures but does not ingest when I/O is off. Update live operator playbook to distinguish configure from ingest. | Full private path exposure is local UI/settings behavior already noted by prior review; future smoke artifacts must avoid raw paths. |
| Gamelog watcher start/stop lifecycle | `src/main/main.js`, `src/combat/combatWitnessRuntime.js`, `src/combat/eveGamelogWatcher.js`, `src/renderer/app.js` | `combat.witness.start` is exposed through renderer service allowlist and starts watcher from configured folder independent of live I/O. | I/O off should prevent starting watcher or should immediately stop/pause active watcher. I/O on may allow existing start rules. | Direct conflict: watcher can watch local gamelog while I/O is off. Runtime I/O toggle does not stop an already watching watcher. | Inject runtime I/O authority into Combat Witness runtime/start command. On disabling I/O, stop watcher or put it in blocked/stopped authority state. Decide exact restart behavior when I/O returns on. | Add `verify:operator-io-gates` or new watcher gate test: start rejected while off, no fs.watch/poll/read, active watcher stopped on toggle off. Visual state smoke should cover watcher blocked by IO off. | Highest ADR-0008 implementation gap. This is machine-local ingest. |
| Parser file reads and append handling | `src/combat/eveGamelogWatcher.js`, `src/combat/combatLogParser.js`, `src/combat/lineBuffer.js` | Append reads occur after watcher start using containment/offset checks; no live I/O gate is checked before `readRange`, parse, or `onEvent`. | No file tail reads or parser event emission while I/O is off. Existing offsets may remain as support state if no content is ingested. | Direct conflict if watcher is running when I/O turns off, or if start is allowed off. | Gate before `readRange` and/or centralize by stopping watcher. If not stopping, `handleFile` must early-return authority-blocked before reading bytes. | Add no-read injected `readRange` counter tests for I/O off, including polling/fs-watch event path and active toggle-off path. | Containment is strong but separate from authority. Do not confuse "safe folder" with "allowed to ingest." |
| Combat Witness event ingestion | `src/combat/combatWitnessRuntime.js`, `src/combat/combatWitnessService.js`, `src/combat/eveGamelogWatcher.js` | Watcher `onEvent` calls `runtime.observeEvent`, then `service.addEvent`, then observer fan-out. Independent of I/O. | No new Combat Witness events should be added from local logs while I/O is off. Last snapshot may remain visible as resting state. | Direct conflict: active watcher events can update rolling windows while I/O is off. | Gate `observeEvent` or upstream watcher. If I/O off, either drop/ignore new events before service mutation or prevent source reads entirely. | Add tests proving event count/window/snapshot does not change from parser path while off. Add docs for last observed Combat Witness state while off. | Avoid erasing previous snapshot unless product decides. The key is no fresh ingest. |
| Combat Witness direct runtime observer calls in tests/harnesses | `src/combat/combatWitnessRuntime.js`, verification scripts | Tests can call `runtime.observeEvent` directly with fixture events. No I/O policy exists in runtime. | Fixture-only deterministic tests may remain exempt/support-only when not representing machine/local ingest; runtime production observer should obey authority. | Ambiguity: direct `observeEvent` is useful for offline tests but may become an un-gated injection surface if exposed in future. | If gating `observeEvent`, provide explicit test-only injected authority or a support-only path clearly not reachable from operator machine sources. | Document fixture/replay exemption. Tests should make clear fixture event injection is not live/local ingest. | Do not break offline verification by treating fixture tests as live I/O. |
| Passive Telemetry navigation/current-system observation | `src/main/main.js`, `src/combat/combatWitnessRuntime.js`, `src/passive/passiveTelemetryService.js` | Combat runtime observers pass parser events to `passiveTelemetryService.observeEvent`. Provider refresh inside `observeEvent` is live-gated, but currentSystem is set before gate check. | I/O off should prevent parser-observed current-system ingest. Last current system may remain visible as last observed/resting state. | Conflict: with I/O off and parser event delivered, Passive still records a new current system and then reports blocked for provider calls. This is still ingest under ADR-0008. | Gate before Passive `observeEvent` mutates state, preferably by stopping log ingest. If event reaches service while off, ignore or return authority-blocked without updating `currentSystem`. | Add test: I/O-off parser jump must not change Passive currentSystem and must not fetch providers. Update operator gate tests that currently prove Passive is independent of Clipboard/Threat, not global I/O. | Important wording risk: current `blocked` after a new jump could look like "observed system but providers blocked"; ADR-0008 says the local observation itself should not be fresh. |
| Passive manual/current refresh | `src/passive/passiveTelemetryService.js`, `src/main/main.js`, `src/main/preload.js` | `passive.telemetry.refresh` checks live I/O before provider calls, after requiring existing currentSystem. Not exposed in renderer service allowlist, but available through service registry/preload lane APIs indirectly by snapshots only. | If refresh would fetch providers, it must remain blocked while off. Snapshot reads are allowed. | Provider call side is currently aligned. It may refresh cached activity if gate allows only. | Preserve gate. Consider making status/copy distinguish authority-off from no current observation under the broader ADR. | Existing Passive/provider tests help; add explicit "no provider and no current-system mutation while off" case. | Reading existing in-memory snapshot is not ingest and may remain allowed. |
| Passive ESI/zKill provider calls | `src/passive/passiveTelemetryService.js`, `src/passive/esiSystemActivityClient.js`, `src/passive/zKillSystemContextClient.js` | `liveIoGate.check({ providers: ['esi', 'zkill'] })` blocks provider calls. Tests assert zero calls when disabled. | Provider calls must not run while I/O is off. | Mostly aligned for provider calls. Naming remains "live IO" and lane-specific rather than global ingest authority. | Keep provider gate, probably wire it to the broader runtime authority object. | Keep provider fault tests. Add global I/O authority tests that prove Passive providers blocked from runtime toggle. | Cache reads are support/local memory, not new provider ingest. ETag revalidation is ingest and must stay gated. |
| Threat Intel typed/search scan provider path | `src/threat/threatIntelService.js`, `src/threat/threatIntelZkillClient.js`, `src/renderer/app.js`, `src/main/preload.js` | Request validation and local/static target resolution can run before live gate; zKill call is blocked by Threat gate. Renderer focus does not scan. | I/O off should block external provider ingest. Whether local/static target resolution is allowed for typed user input while off is a product question; provider calls are definitely blocked. | Provider side aligned. Potential wording gap: search action with I/O off is "blocked" but might still resolve typed target locally before gate. | Keep zKill gate. Decide whether local resolver work from explicit typed input is support-only or ingest-dependent. | Add test for runtime all-off typed scan returning blocked and zero provider calls. Document local resolver exemption if accepted. | Typed input is operator-provided, but ADR says ingest-dependent action while off should be blocked. Separate "validation" from "scan." |
| Threat Intel clipboard scan path | `src/threat/clipboardAcquisitionService.js`, `src/threat/threatIntelService.js`, `src/threat/clipboardAcquisitionGate.js`, `src/main/main.js` | M12H gate blocks service-command arm/capture before clipboard reads. Global shortcut checks Threat gate before `clipboard.readText()`. Threat scan also blocks zKill while off. | No clipboard read and no provider call while I/O is off. | Currently aligned for known service-command and global shortcut paths. `threat.clipboard.cancel` and snapshot are non-ingest and ungated. | Preserve. Consider moving from Threat-only gate wording to shared global I/O authority while preserving lane semantics. | Existing operator I/O gate and clipboard race tests help. Add regression for global shortcut no-read if feasible without manual/private clipboard. | Strongest aligned area. Keep the "no read before gate" property. |
| Clipboard focused/windowed listen/poll path | `src/renderer/app.js`, `src/main/preload.js`, `src/threat/clipboardAcquisitionService.js`, `src/main/main.js` | Focused `Ctrl+\` calls `threat.clipboard.arm`; renderer schedules capture polling. Gate wrapper blocks arm/capture while Threat I/O off, returning blocked snapshot without read. | No clipboard baseline or poll reads while I/O off. | Currently aligned for service commands. UI sets unsupported when live I/O off. | Preserve gate on both arm and capture. If global I/O becomes broader, use same authority source. | Keep race tests; add no-read test around capture polling while off if not already explicit. | The service itself reads in `arm()` before state set when ungated, so all external callers must stay wrapped. |
| Clipboard Acquisition snapshot/cancel/shortcut status | `src/threat/clipboardAcquisitionService.js`, `src/main/preload.js`, `src/renderer/app.js` | Snapshot uses `tick()` and may transition listening/cooldown to idle; cancel seals state. No clipboard content read. Shortcut status reads registration state only. | These are support-only and may remain allowed while I/O is off. | No ADR conflict if they do not read clipboard or trigger scan. | Keep allowed; ensure cancel clears any active authority window when I/O turns off. | Add test: toggle I/O off during listening cancels/stops polling and no further clipboard reads. | State cleanup is important if an active listener exists when I/O is disabled. |
| Startup recovery behavior | `src/main/main.js`, `src/runtime/runtimeSettingsService.js`, `src/combat/combatWitnessRuntime.js` | `recoverRuntimeSettings()` loads persisted settings and configures gamelog path if valid; it does not start watcher. Live I/O gates default disabled. | Compatible: recover settings, but do not ingest until I/O on and explicit start policy allows it. | Mostly aligned. Future change must avoid auto-starting watcher when I/O defaults off. | Preserve no-autostart. If active watcher state is ever persisted, do not restore active ingest while off. | Add regression test for startup recovery: configured path, watcher stopped/unavailable, I/O off. | Good support-only baseline. |
| Renderer IO/off/blocked/unavailable/no observation copy | `src/renderer/index.html`, `src/renderer/app.js`, `src/renderer/styles.css`, `scripts/electron-visual-smoke.ps1` | IO off copy says "network and clipboard blocked"; Passive blocked maps to "Live IO blocked"; Clipboard blocked maps to "IO Off"; watcher has generic unavailable/blocked labels but no I/O-off watcher state. | UI should communicate "Sense is not allowed to ingest" without making lanes look failed or empty. Last observed state must be distinguishable from fresh ingest. | Copy is narrower than ADR-0008 and can mislead about logs still ingesting. Some blocked labels differ: `Live IO blocked`, `IO Off`, `Threat blocked`, generic `Blocked`. | Add global authority copy/state mapping. Add watcher/log ingest blocked presentation. Keep provider failure, unavailable, and no observation distinct. | Update renderer-shell and visual state smoke to cover I/O-off no-ingest state across watcher, Passive, Threat, Clipboard. | Product wording decision needed: preserve `Live IO blocked` exact meaning or introduce broader "I/O off" while retaining authority meaning. |
| Smoke/playbook docs for live/manual I/O | `docs/testing/live-api-smoke-transition-readiness.md`, `docs/testing/live-operator-gamelog-smoke-playbook.md`, `docs/testing/aggressive-test-harness-matrix.md` | Live API docs require explicit `AURA_SENSE_LIVE_API=1`. Operator gamelog playbook starts without enabling live providers, selects folder, starts watcher, then observes appends. | Docs should treat I/O as authority for both providers and local log ingest. Live operator gamelog smoke should explicitly enable I/O authority if ingest is intended. | Gamelog playbook still separates provider authorization from gamelog ingest and does not reflect ADR-0008 fully. | No code change here, but future docs should align after implementation or in same runway. | Update playbook: I/O off refusal/no-ingest case, then explicit I/O-on start. Update matrix "Live IO gate" to "I/O ingest authority" or equivalent if accepted. | Documentation could otherwise authorize a live gamelog smoke that violates the new trust model. |
| Live API smoke scripts | `scripts/smoke-passive-live-api.js`, `scripts/smoke-threat-live-api.js` | Refuse unless `AURA_SENSE_LIVE_API=1`; use live gate enabled in smoke-local service when authorized. | Live provider ingest remains explicit opt-in and must not run by default. | Compatible with provider side. Naming is narrower than global app I/O, but smoke is already a separate operator authorization layer. | Preserve refusal path. Consider artifact field names if global authority language changes. | Update docs to clarify `AURA_SENSE_LIVE_API=1` is not the app IO toggle and does not authorize gamelog/clipboard. | Do not run live smoke during reconciliation audit. |
| Local/static metadata reads for resolver | `src/passive/localSystemResolver.js`, `src/threat/threatIntelTargetResolver.js` | Resolver can read bundled/local metadata JSON from app files. It is not controlled by I/O. | Likely support-only if reading project-owned static metadata, not user machine input. | No clear conflict unless metadata path is operator-provided or refreshed from live/source bundle. | Document exemption if future ADR/runway accepts it. Keep SDE refresh/download separately gated. | Add docs note that static lookup is support-only, while SDE refresh/live metadata acquisition remains explicit. | Do not over-gate app-owned static resources; ADR targets ingest from user/local/live sources. |

## 4. Behaviors That Are Not Ingest And May Remain Allowed While I/O Is Off

- Reading existing in-memory lane snapshots for display.
- Rendering last observed/resting Combat Witness, Passive, Threat, Clipboard, settings, and diagnostics state.
- Loading and validating runtime settings, including persisted gamelog path existence/structure checks, if no log file content is read.
- Opening the folder picker and configuring a folder path, as long as watcher start/file reads remain blocked.
- Showing shortcut registration status.
- Returning Clipboard Acquisition snapshot/cooldown/idle state.
- Cancelling an existing Clipboard Acquisition window, especially when I/O is turned off.
- Reading bundled/static app metadata for local resolver support, if accepted as support-only.
- Running offline fixture verification that creates temporary test folders/files and does not inspect real operator folders.
- Default-refusal live smoke scripts when `AURA_SENSE_LIVE_API` is not set, except for their safe artifact writes.

## 5. Already-Displayed Last Observed / Resting State Guidance

ADR-0008 allows existing displayed state to remain visible while I/O is off. The target behavior should be:

- Preserve last observed Combat Witness metrics as resting/last observed, not freshly witnessed.
- Preserve last Passive current-system/provider sample as last observed/resting context, with an I/O-off authority marker if ingest is disabled.
- Preserve latest Threat Intel report until next scan, but attempts to rescan while off should show authority blocked.
- Preserve Clipboard Acquisition cooldown/idle state, but any active listener should be cancelled or made blocked without reading.
- Do not clear state in a way that makes I/O off look like "no observation" or "no provider data."
- Do not age or refresh provider/sample context through live calls while I/O is off.
- Display copy should avoid implying the watcher is still watching, providers are still polling, or clipboard is still being listened to while I/O is off.

## 6. User-Facing State / Copy Risks

I/O off:

- Current top-level copy says "Off - network and clipboard blocked." Under ADR-0008 this is too narrow because log ingest is also governed.
- Clipboard uses "IO Off", Passive uses "Live IO blocked", Threat can use "Threat blocked", and watcher has no clear I/O-off state. This risks state fragmentation.

No observation:

- `No observation` currently means no Passive current-system observation or no combat events. It must not be reused for I/O-off lanes.
- If I/O off blocks a new parser jump, the UI should not show a newly observed system and then merely block providers.

Provider failed:

- Provider failure is `failed` / `degraded`, not authority block. Existing provider fault tests protect this, but copy like "No provider" can still be ambiguous if I/O is off.

Unavailable:

- `Unavailable` currently covers missing bridge, missing watcher/path, and some Combat states. Future I/O-off watcher blocking should not be presented as bridge/runtime unavailable.

Blocked:

- `Live IO blocked` is a protected authority meaning, but ADR-0008 may require broader "I/O off / ingest blocked" copy. This needs Human/Overseer wording authority before renaming user-facing terms.
- Avoid "offline" unless authority meaning is preserved; offline can sound like provider/network failure.

## 7. Existing Tests That Already Help

- `npm.cmd run verify:operator-io-gates`
  - Proves parser jump feeds Passive independently of Clipboard/Threat.
  - Proves Clipboard arm/capture service commands do not read clipboard or scan Threat while Threat I/O is off.
  - This currently documents the old separation model and should be revised for global I/O authority.
- `npm.cmd run verify:clipboard-race`
  - Covers short listening window, unchanged baseline, rejection, timeout, scan failure, cooldown, duplicate suppression, concurrent arm behavior.
- `npm.cmd run verify:threat-intel`
  - Covers Threat live I/O blocked state, zero zKill calls while disabled, clipboard input using same scan contract.
- `npm.cmd run verify:passive-telemetry`
  - Covers Passive provider blocking, zero ESI/zKill calls while disabled, stale/partial/degraded states.
- `npm.cmd run verify:provider-faults`
  - Keeps authority-blocked distinct from provider failures and malformed provider data.
- `npm.cmd run verify:gamelog-watcher`
  - Covers expected folder structure, append-only seeding, and watcher basics.
- `npm.cmd run verify:gamelog-watcher-chaos`
  - Covers containment, symlink skips where feasible, replacement/truncation handling, polling fallback, listener/parser failure isolation, hash-only rejection evidence.
- `npm.cmd run verify:runtime-control`
  - Covers settings persistence/recovery/degraded behavior.
- `npm.cmd run verify:renderer-shell`
  - Static coverage for IO control, distinct Passive labels, renderer boundary, visual state smoke hooks.
- `npm.cmd run verify:renderer-boundary` and `npm.cmd run verify:renderer-boundary-adversarial`
  - Protect renderer from direct provider, filesystem, watcher, parser, and clipboard authority bypasses.
- `smoke:electron` visual state scenarios include blocked, unavailable, degraded, partial/capped, clipboard listening, cooldown, diagnostics, settings degraded, and narrow viewport states, but this audit did not run Electron smoke.

## 8. Tests Likely Needed Later

- Runtime authority test: default I/O off prevents Combat Witness watcher start.
- Runtime authority test: toggling I/O off while watcher is active stops/pauses watcher and prevents further file reads.
- Watcher no-read test: injected `readRange` is not called when I/O is off, including fs-watch and polling paths.
- Parser no-ingest test: appending a valid navigation/combat line while I/O is off does not mutate Combat Witness or Passive currentSystem.
- Passive no-local-observation test: parser jump delivered while I/O is off does not update `currentSystem` and does not call providers.
- Last-observed display test: I/O off preserves prior displayed state but marks it as resting/authority-off rather than fresh.
- Clipboard transition test: turning I/O off during listening cancels/blocks polling and no further `readClipboard` occurs.
- Renderer copy/static test: top IO copy reflects no-ingest authority, not just network/clipboard.
- Visual state smoke: I/O-off global ingest-blocked state for watcher, Passive, Threat, and Clipboard without collapsing to unavailable/no observation/provider failed.
- Live operator playbook refusal test or dry-run artifact shape: I/O-off operator gamelog smoke must record blocked/no-ingest without reading private folders.

## 9. Docs Likely Needing Reconciliation

- `docs/current-state/current-implementation.md`
  - Update after implementation to claim or not claim ADR-0008 alignment.
- `docs/current-state/display-pipeline-inventory.md`
  - Broaden runtime I/O authority row beyond provider/clipboard and update ingest rows.
- `docs/features/vision.md`
  - Element 7 already notes ADR-0008; later update current-state bullets after code alignment.
- `docs/features/clipboard-acquisition.md`
  - Keep accepted Clipboard details; align "I/O authority" language with broader no-ingest model.
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
  - Explicitly require I/O authority on for gamelog ingest, and add I/O-off refusal/no-ingest case.
- `docs/testing/live-api-smoke-transition-readiness.md`
  - Clarify live API env authorization versus app runtime I/O authority.
- `docs/testing/aggressive-test-harness-matrix.md`
  - Rename/expand gate coverage description from live provider gate to global ingest authority if accepted.
- `docs/contracts/combat-witness-contract.md`
  - Add I/O-off no-ingest behavior for watcher/parser.
- `docs/contracts/telemetry-lane-contract.md`
  - Clarify Passive current-system observation is I/O-governed under ADR-0008.
- `docs/contracts/threat-intel-contract.md`
  - Preserve clipboard/provider gate behavior and align blocked wording if broader terms are adopted.
- `workspace/current.md`
  - Do not edit from this audit, but future Overseer runway should reference ADR-0008 reconciliation explicitly.

## 10. Recommended Future Dev Runway Shape

Suggested bounded runway:

1. Introduce a single runtime I/O authority application point that the existing Passive and Threat gates still use, while adding Combat Witness watcher/parser enforcement.
2. Gate `combat.witness.start` when I/O is off and decide one behavior for an active watcher on I/O-off toggle: recommended stop watcher and emit authority-blocked/stopped status.
3. Add a defensive no-read guard before watcher tail reads if the watcher can remain constructed while I/O is off.
4. Prevent Passive `observeEvent` from mutating currentSystem when the event source is parser/log ingest and I/O is off, unless source reads have already been blocked upstream.
5. Preserve read-only/support operations: settings load/save/validate, folder picker/configure, snapshots, diagnostics, shortcut status, cancel.
6. Update renderer copy/state mapping so I/O off means ingest authority disabled across logs, clipboard, and providers without collapsing to no observation, unavailable, or provider failed.
7. Add focused deterministic tests first; run full offline verification after code changes.
8. Update docs/playbooks after tests settle the exact behavior.

Recommended acceptance checks:

- I/O defaults off.
- With I/O off, watcher start does not call `fs.watch`, polling, or `readRange`.
- With I/O off, appending or injecting a parser event through production watcher path does not update Combat Witness or Passive.
- With I/O off, clipboard arm/capture/global shortcut still do not read clipboard.
- With I/O off, Passive/Threat provider calls remain zero.
- With I/O off, UI distinguishes authority blocked from no observation, unavailable, and provider failure.
- With I/O on, existing append-only watcher containment, Passive provider gating, Clipboard Acquisition, and Threat scan behavior remain preserved.

## 11. Stop Conditions / Open Questions

Stop conditions for future implementation:

- Any change requires reading real operator EVE folders, real clipboard content, or live provider data.
- A code change would rename bridge-facing snapshot kinds, IPC commands, or protected terms without Human/Overseer authority.
- The desired behavior for active watcher on I/O-off toggle is unclear.
- Product copy requires choosing between preserve-exact `Live IO blocked` and broader `I/O off / ingest blocked` wording.
- A test needs live/manual/private I/O to prove behavior.
- Implementation would make settings/folder configuration impossible while I/O is off, rather than only blocking ingest.

Open questions:

- Should disabling I/O stop the Combat Witness watcher, leave it configured but blocked, or pause it with resumable offsets?
- When I/O is re-enabled, should a previously active watcher require an explicit new Start action, or may it resume because the operator had previously started it?
- Should `combat.witness.start` return watcher state `blocked`, `unavailable`, or a new authority-specific status when I/O is off?
- Should `Live IO blocked` remain user-facing exact copy, or should renderer copy move to a broader authority phrase while preserving the existing backend gate codes?
- Is local/static resolver lookup from app-owned metadata explicitly support-only while I/O is off?
- Should a manual typed Threat Intel target be allowed to validate locally while I/O is off, or should the whole scan action return blocked before resolution?
- Should I/O-off last-observed state visibly freeze age/freshness, or continue aging as stale without new ingest?

## Verification

Read-only/static inspection commands run:

- `Get-Content` on required authority docs, implementation files, tests, and playbooks.
- `rg` static searches across `src`, `scripts`, `docs`, and `workspace` for I/O gates, watcher/parser reads, clipboard acquisition, Passive/Threat provider calls, renderer states, tests, and smoke docs.
- `git status --short --branch` before writing this artifact.

No live/manual/private I/O was run. No real EVE log folders were inspected. No clipboard content was captured. No live provider smoke was run. No code was changed.
