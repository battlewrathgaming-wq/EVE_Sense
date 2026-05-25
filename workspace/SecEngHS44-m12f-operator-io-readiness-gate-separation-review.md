# SecEngHS44 - M12F Operator I/O Readiness And Gate Separation Review

Date: 2026-05-25
Role: Security/Engineering specialist
Scope: Read-only review, except this requested artifact
Recommendation: Proceed to Dev hardening before live/manual operator I/O smoke

## 1. Request Answered

Answered the M12F request: trace actual code/docs for local operator I/O readiness before live operator gamelog smoke, clipboard manual validation, or Dev hardening.

Core rule tested:

```txt
Passive I/O wraps the operator flow.
Active I/O is explicitly invited.
Both may feed the same event spine.
They must not share the same gate.
Shared display/fixture treatment is not assumed.
```

Verified fact: Passive and Active provider gates are separate backend gate instances in `src/main/main.js:33-40`, wired into different services at `src/main/main.js:42-60`.

Verified fact: parser-observed events fan out through `combatWitnessRuntime` observers, and Passive Telemetry is attached there at `src/main/main.js:67-73`.

Verified fact: Threat Intel scan is only wired through explicit service commands and Clipboard Acquisition paths at `src/main/main.js:317-362` and `src/main/preload.js:79-121`.

Primary hardening finding: the global shortcut path reads the current clipboard before arming and passes it as `clipboardText`, which causes immediate capture/scan for non-empty pre-existing clipboard content (`src/main/main.js:489-494`, `src/threat/clipboardAcquisitionService.js:13-34`). This conflicts with the documented safety rule that unchanged clipboard content from before arming is ignored unless it changes during the listening window (`docs/features/clipboard-acquisition.md:20-25`, `docs/contracts/threat-intel-contract.md:61`).

## 2. Files Reviewed

Required coordination/docs:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `workspace/current.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-assets.md`
- `workspace/critical/critical-terms.md`
- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/features/clipboard-acquisition.md`
- `package.json`

Required source and supporting implementation:

- `src/main/main.js`
- `src/main/preload.js`
- `src/combat/combatLogParser.js`
- `src/combat/combatWitnessBridge.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessService.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/eveLogPaths.js`
- `src/passive/liveIoGate.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/passiveTelemetryService.js`
- `src/threat/clipboardAcquisitionService.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelTargetResolver.js`
- `src/threat/threatIntelZkillClient.js`
- `src/runtime/runtimeDiagnosticsService.js`
- `src/services/diagnosticsPolicy.js`
- `src/services/ipcPayloadValidation.js`
- `src/renderer/app.js` and `src/renderer/index.html` as supporting evidence for explicit search/keyboard UI wiring

## 3. Current Operator I/O Model

Current model, verified from code:

- Local gamelog I/O is configured through Combat Witness runtime commands and the native folder picker (`src/main/main.js:194-263`).
- The watcher validates the configured folder, seeds existing file offsets, and reads only future appended ranges (`src/combat/eveGamelogWatcher.js:50-63`, `src/combat/eveGamelogWatcher.js:84-101`, `src/combat/eveGamelogWatcher.js:216-270`).
- Parser output includes `navigation.jump` from EVE jump messages and combat events from combat log lines (`src/combat/combatLogParser.js:66-102`).
- Combat Witness accepts only combat stream events for its rolling windows; `navigation.jump` does not enter Combat Witness metrics (`src/combat/combatWitnessService.js:32-47`, `src/combat/combatWitnessService.js:207-214`).
- Passive Telemetry observes the runtime event fanout and filters to `navigation.jump` (`src/main/main.js:67-73`, `src/passive/passiveTelemetryService.js:27-31`).
- Active Threat Intel scans are invoked through explicit renderer search, Clipboard Acquisition, or service/preload calls (`src/renderer/app.js:409-427`, `src/renderer/app.js:430-461`, `src/main/preload.js:79-121`).
- Live provider I/O is disabled by default and backend-gated for Passive and Threat separately (`src/passive/liveIoGate.js:1-42`, `src/main/main.js:33-60`).

Docs align at the lane level: `docs/contracts/telemetry-lane-contract.md` separates Passive Telemetry, Threat Intel, and Combat Witness and says UI mode changes must not affect collection authority.

## 4. Gamelog Watcher/Parser Trace

Trace:

1. Renderer/user configuration reaches `combat.witness.configure`, `combat.witness.start`, or `runtime.gamelog-folder.pick` (`src/main/main.js:194-263`).
2. Runtime validates path using `validateLogPathForWatcher`, stores `configuredPath`, and starts the watcher only when configured (`src/combat/combatWitnessRuntime.js:41-88`).
3. Path validation requires a real folder whose path and realpath end in `EVE/logs/Gamelogs`, rejects folder symlinks, and rejects non-directories (`src/combat/eveLogPaths.js:37-80`).
4. Watcher seeds offsets for existing `.txt` files instead of reading full history (`src/combat/eveGamelogWatcher.js:84-101`).
5. `fs.watch` or polling calls `handleFile`; new files are seeded at current size, replacements/truncations reset offset, and only appended byte ranges are read (`src/combat/eveGamelogWatcher.js:105-156`, `src/combat/eveGamelogWatcher.js:186-246`).
6. Completed lines are parsed; unparsed/parser-error lines are reported by hash, not raw line text (`src/combat/eveGamelogWatcher.js:248-306`).
7. Parser emits `navigation.jump` for `Jumping from ... to ...` or `Jumping to ...`; combat damage/miss parsing is restricted to combat-channel lines after navigation parsing (`src/combat/combatLogParser.js:66-102`).
8. Watcher calls `onEvent(event)`, which reaches runtime `observeEvent` (`src/combat/eveGamelogWatcher.js:273-281`, `src/combat/combatWitnessRuntime.js:28-31`).

Containment checks inside file handling reject unsafe filenames, symlink files, files outside the active folder, non-files, and realpath escapes (`src/combat/eveGamelogWatcher.js:111-127`, `src/combat/eveGamelogWatcher.js:309-334`).

## 5. Passive Telemetry Trigger Trace From System Jump

Trace:

1. `createCombatWitnessRuntime` is constructed with an observer that calls `passiveTelemetryService.observeEvent(event)` (`src/main/main.js:67-73`).
2. Runtime `observeEvent` first calls `service.addEvent(event)`, then `notifyObservers(event)` (`src/combat/combatWitnessRuntime.js:130-135`).
3. Combat Witness ignores `navigation.jump` because `isCombatWitnessEvent` only accepts combat stream events (`src/combat/combatWitnessService.js:207-214`).
4. Passive `observeEvent` ignores all non-`navigation.jump` events and jump events without `systemName` (`src/passive/passiveTelemetryService.js:27-31`).
5. On a jump, Passive sets `currentSystem`, emits a stale/pending snapshot, and calls `refresh({ reason: 'system-change' })` (`src/passive/passiveTelemetryService.js:33-47`).
6. `refresh` resolves the current system locally, then checks the Passive live I/O gate for `esi` and `zkill` before provider calls (`src/passive/passiveTelemetryService.js:65-89`).
7. If the gate is blocked, Passive emits `blocked` with gate/failure metadata; if enabled, it fetches ESI activity and zKill system context in parallel (`src/passive/passiveTelemetryService.js:82-116`).

Verified fact: Passive aggregate/context opens from parser-observed system jump and does not require Clipboard Acquisition state.

Important nuance: Passive provider fetching still depends on its own live I/O gate. The local current-system observation itself is independent of clipboard/listening/active scan state.

## 6. Clipboard Acquisition/Search Trigger Trace

Explicit search:

1. Renderer registers submit handling for `#threat-search` (`src/renderer/app.js:81`).
2. Submit calls `window.auraThreatIntel.scan({ targetText, targetKind, inputSource: 'search' })` (`src/renderer/app.js:409-427`).
3. Preload exposes `auraThreatIntel.scan` to the service invoke channel with command `threat.intel.scan` (`src/main/preload.js:79-88`).
4. Main registers `threat.intel.scan` as an external-I/O command handled by `threatIntelService.scan` (`src/main/main.js:324-327`).
5. `ThreatIntelService.scan` normalizes target text/source, resolves target, checks the Threat live I/O gate, then calls scoped zKill only if the gate allows (`src/threat/threatIntelService.js:20-91`, `src/threat/threatIntelService.js:113-131`).

Clipboard Acquisition:

1. Main creates the service with `scan: (request) => threatIntelService.scan(request)` and `readClipboard: () => clipboard.readText()` (`src/main/main.js:62-66`).
2. Service constants are `LISTENING_MS = 3000` and `COOLDOWN_MS = 5000` (`src/threat/clipboardAcquisitionService.js:1-2`).
3. `arm()` records baseline clipboard content when no explicit `clipboardText` is passed, enters `listening`, and returns a snapshot (`src/threat/clipboardAcquisitionService.js:13-34`).
4. `capture()` rejects capture while not listening, seals on timeout, ignores unchanged baseline content, rejects invalid target text, or calls `scan({ targetText, inputSource: 'clipboard' })` (`src/threat/clipboardAcquisitionService.js:38-67`).
5. `seal()` always enters `cooldown` and records `lastCapture` when target text exists (`src/threat/clipboardAcquisitionService.js:89-113`).
6. Renderer focused shortcut `Ctrl+\` calls `armClipboardAcquisition()`, then polls `captureClipboard()` every 400ms (`src/renderer/app.js:430-461`, `src/renderer/app.js:862-869`).
7. Main global shortcut is registered as `Control+\`, with `Control+Alt+Space` fallback and `Alt+\` target-kind toggle (`src/main/main.js:405-458`).
8. Main global shortcut blocks when Threat live I/O is off and does not read the clipboard in that branch (`src/main/main.js:473-487`).

Finding: when Threat live I/O is on, the global shortcut reads current clipboard and passes non-empty text as `clipboardText`, causing immediate capture with `allowUnchanged: true` (`src/main/main.js:489-494`, `src/threat/clipboardAcquisitionService.js:31-34`). This is different from the renderer focused path, which calls `armClipboard()` without payload and therefore preserves baseline-ignore behavior.

## 7. Shared Event-Spine/Fanout Points

Identified shared internal event spine:

- `EveGamelogWatcher` parses appended lines and calls `onEvent(event)` (`src/combat/eveGamelogWatcher.js:273-281`).
- Runtime `observeEvent(event)` adds valid combat events to Combat Witness and then notifies observers of all parser events (`src/combat/combatWitnessRuntime.js:130-135`, `src/combat/combatWitnessRuntime.js:142-151`).
- Passive Telemetry is registered as one observer in main (`src/main/main.js:67-73`).

This is a shared internal observation/fanout point, not shared display semantics. Combat Witness filters to combat events; Passive filters to `navigation.jump`. Threat Intel is not attached to this event spine.

Bridge fanout is separate per lane:

- Combat snapshots use `aura:combat-witness:*` channels (`src/combat/combatWitnessBridge.js:3-8`).
- Passive snapshots use `aura:passive-telemetry:*` channels (`src/passive/passiveTelemetryBridge.js:1-6`).
- Clipboard lifecycle snapshots use `aura:threat-clipboard:snapshot` (`src/main/main.js:25`, `src/main/preload.js:108-116`).
- Threat Intel snapshot/scan uses service invoke commands (`src/main/preload.js:79-107`).

## 8. Gate Separation Findings

Verified:

- Passive gamelog/jump flow is hands-free once the watcher is configured/running. It is not bound to Clipboard Acquisition service state.
- Passive current-system observation is triggered from parser `navigation.jump` only (`src/passive/passiveTelemetryService.js:27-47`).
- Passive provider refresh checks the Passive gate instance (`src/main/main.js:33`, `src/main/main.js:42-53`, `src/passive/passiveTelemetryService.js:82-89`).
- Threat scan checks the Threat gate instance (`src/main/main.js:36-40`, `src/main/main.js:54-60`, `src/threat/threatIntelService.js:42-55`).
- Parser jumps do not call `threatIntelService.scan`; no code path was found from `navigation.jump` to Threat scan.
- Clipboard/search does not become a prerequisite for Passive aggregate/context; Passive is connected to runtime observer fanout, not Threat/Clipboard state.

Ambiguity/risk:

- `runtime.live-io.set-enabled` defaults to lane `all`, and the visible IO toggle flips Passive and Threat together (`src/main/main.js:391-402`, `src/renderer/app.js:814-828`). This does not collapse activation gates in code, but it does make the operator-visible authority control shared by default. For M12F's core rule, the gates remain separate instances; for operator trust, Dev should consider whether live/manual smoke needs lane-explicit status capture or lane-specific toggles.

## 9. Clipboard Listening Window And Seal Findings

Verified:

- Service-level listening window is 3 seconds; cooldown is 5 seconds (`src/threat/clipboardAcquisitionService.js:1-2`).
- `arm()` enters `listening`; `capture()` seals on timeout and `tick()` moves cooldown back to idle after expiry (`src/threat/clipboardAcquisitionService.js:13-34`, `src/threat/clipboardAcquisitionService.js:69-86`).
- `capture()` explicitly ignores unchanged clipboard content when a baseline was recorded and `allowUnchanged` is false (`src/threat/clipboardAcquisitionService.js:47-50`).
- Capture/rejection/scan-failure/cancel/timeout all seal into cooldown (`src/threat/clipboardAcquisitionService.js:51-67`, `src/threat/clipboardAcquisitionService.js:69-99`).
- Focused renderer shortcut/HUD arm path uses `armClipboard()` without a payload and polls `captureClipboard()`, so it follows baseline-ignore/listening-window behavior (`src/renderer/app.js:430-461`, `src/renderer/app.js:862-869`).

Bug/hardening required:

- Global shortcut path currently reads existing clipboard immediately and passes it to `arm({ clipboardText })`; service then immediately captures it with `allowUnchanged: true` (`src/main/main.js:489-494`, `src/threat/clipboardAcquisitionService.js:31-34`). This can scan clipboard content that was present before arming, contradicting the documented trust boundary.

Additional privacy note:

- `clipboard.acquisition.snapshot.lastCapture.targetText` carries captured target text through service snapshots (`src/threat/clipboardAcquisitionService.js:98-113`). This is expected for the search-box workflow, but diagnostics/artifacts should not persist these snapshots wholesale during live/manual validation unless the target text is operator-approved or redacted.

## 10. Containment/Privacy Findings

Gamelog path/read containment:

- Expected path structure is explicitly `EVE/logs/Gamelogs` (`src/combat/eveLogPaths.js:4`).
- Validation rejects empty/missing paths, wrong structure, symlink folder, realpath outside expected structure, and non-directory paths (`src/combat/eveLogPaths.js:37-80`).
- Watcher reads only `.txt` direct child files and rejects unsafe names (`src/combat/eveGamelogWatcher.js:111-127`).
- Active folder checks reject files outside the configured folder, symlink files, non-files, and realpath escapes (`src/combat/eveGamelogWatcher.js:309-334`).
- Existing files are offset-seeded, so normal watcher start should not replay broad history (`src/combat/eveGamelogWatcher.js:84-101`, `src/combat/eveGamelogWatcher.js:186-216`).
- Rejected/parser-error lines are reported by hash (`rawLineHash`), not raw content (`src/combat/eveGamelogWatcher.js:288-306`).

Diagnostics/artifacts:

- Runtime diagnostics retain a bounded 30 records by default (`src/runtime/runtimeDiagnosticsService.js:1-27`).
- Diagnostic sanitizer redacts keys matching raw/line/content unless the key is a hash, truncates long strings, and replaces structured payloads with `[structured]` (`src/runtime/runtimeDiagnosticsService.js:44-68`).
- Normal diagnostics suppress low-value `tail_read`, `poll_tick`, duplicate, and HTTP-success chatter (`src/services/diagnosticsPolicy.js:3-11`, `src/runtime/runtimeDiagnosticsService.js:3-21`).

Live/manual smoke docs:

- Playbook forbids broad private gamelog collection, raw private line artifacts, hardcoded machine paths, live provider calls without separate authorization, and historical replay beyond append-only startup seeding (`docs/testing/live-operator-gamelog-smoke-playbook.md:23-27`, `docs/testing/live-operator-gamelog-smoke-playbook.md:58-66`).

Privacy risks/gaps:

- Runtime status and settings can expose configured local gamelog paths to the renderer/settings field (`src/combat/combatWitnessRuntime.js:105-117`, `src/renderer/app.js:788-793`). This is acceptable for local UI operation, but future artifacts should sanitize or avoid full private paths.
- `runtime.gamelog-folder.pick` returns `gamelogFolder` directly (`src/main/main.js:236-263`). Future smoke artifact capture should not store this raw path except under explicit operator approval.
- Clipboard captured target text can be stored in `lastCapture` snapshots. Future manual validation artifacts must avoid capturing clipboard contents or redact them unless the operator explicitly approves the exact target.

## 11. Display/Fixture Boundary Risks Out Of M12F Scope

Out of scope but worth preserving:

- Shared event spine does not imply shared fixture/display treatment. Combat, Passive, Threat, and Clipboard have separate bridge surfaces and snapshot semantics.
- Renderer currently uses a combined visual IO state label, `On - network and clipboard enabled` / `Off - network and clipboard blocked` (`src/renderer/app.js:798-808`). That presentation can obscure separate backend gates, but deciding Lab/adapter/display convergence is out of M12F scope.
- Provider pulse/readout convergence between Passive and Threat is display/adapter work, not an operator I/O safety decision.
- Any future fixture convergence must preserve that Passive jump observations and Threat scans have different activation gates and different meanings.

## 12. Bugs, Gaps, Or Ambiguity

1. Required hardening: global shortcut can immediately scan pre-existing clipboard content when live I/O is enabled. This violates the documented unchanged-pre-arm clipboard rule and weakens the trust boundary.

2. Operator-control ambiguity: the top-level live IO toggle turns Passive and Threat gates on/off together by default. Code gates remain separate, but the visible control may make it unclear whether Passive live provider refresh and Threat/Clipboard authority were both enabled for a future smoke.

3. Artifact privacy gap: current runtime/service snapshots can include private local paths and clipboard target text. The playbook says future artifacts should sanitize, but there is not yet a dedicated live/manual artifact harness enforcing redaction for operator gamelog path and clipboard capture.

4. Test gap: deterministic clipboard race tests validate baseline-ignore behavior at service level, but do not cover the Electron main global shortcut path that passes `clipboardText`.

5. Test gap: gate-separation tests should assert parser `navigation.jump` updates Passive without invoking Threat scan and that Clipboard/search scan does not become a prerequisite for Passive current-system observation.

6. Ambiguity: `threat.intel.scan` bounds lookback/sample count but does not impose a target text max length in `normalizeScanRequest` (`src/threat/threatIntelService.js:113-131`). The inherited `MAX_SCAN_QUERY_LENGTH` validator exists for older active scan payloads (`src/services/ipcPayloadValidation.js:4-63`) but is not applied to Threat Intel scan requests. This is not a gate-separation blocker, but Dev may want a deliberate payload limit for manual/clipboard trust.

## 13. Required Dev Hardening Before Live/Manual Operator I/O Smoke

Required before live/manual operator I/O smoke:

1. Fix or intentionally redesign the global shortcut path so it opens a 3 second acquisition window and ignores unchanged pre-arm clipboard content. It should not immediately scan current clipboard content merely because it is non-empty.

2. Add deterministic coverage for the Electron main global shortcut acquisition behavior or equivalent unit seam, specifically proving no pre-existing clipboard content is captured/scanned on arm.

3. Add gate-separation verification that a parser `navigation.jump` can drive Passive current-system observation without calling Threat scan, and that Clipboard/search scan does not initialize or gate Passive observation.

4. Add or document a redaction-safe artifact shape for future live/manual operator I/O smoke: no raw private gamelog lines, no raw private paths unless approved, no clipboard target text unless approved, hashes/status/counts only by default.

Recommended before smoke:

- Make future smoke instructions require explicit capture of per-lane live IO state (`passive.enabled`, `threat.enabled`) rather than only the aggregate UI label.
- Consider applying a bounded `targetText` limit directly in Threat Intel scan normalization.

## 14. Suggested Verification For A Future Dev Packet

Suggested non-live verification:

- `npm.cmd run verify:gamelog-watcher`
- `npm.cmd run verify:gamelog-watcher-chaos`
- `npm.cmd run verify:passive-telemetry`
- `npm.cmd run verify:threat-intel`
- `npm.cmd run verify:clipboard-race`
- `npm.cmd run verify:diagnostics`
- New deterministic test: global shortcut arming with non-empty clipboard does not capture unchanged clipboard.
- New deterministic test: `navigation.jump` observer refreshes Passive and never calls Threat scan.
- New deterministic test: explicit Threat scan and Clipboard Acquisition do not affect Passive `currentSystem` prerequisites.
- Optional final sweep: `npm.cmd run verify:all`.

Suggested future live/manual smoke verification, only under a future authorized packet:

- Record authorization reference, artifact directory, commands, per-lane live IO state, watcher state, event counts, sanitized path validation status, stop reason, and no raw private lines.
- Confirm future appends only after watcher start.
- Confirm Passive observation can open from a parser-observed jump without clipboard/listening/scan state.
- Keep manual shortcut validation separate unless explicitly authorized.

## 15. Stop Conditions For Future Live/Manual Operator I/O Validation

Stop immediately if:

- Selected folder fails `EVE/logs/Gamelogs` structure validation.
- Watcher attempts to read outside the active folder or follows a symlink file.
- Historical files are replayed beyond append-only startup seeding.
- Raw private gamelog lines, full private local paths, screenshots, or clipboard contents would need to be stored.
- Global shortcut still captures/scans pre-existing clipboard content.
- Passive aggregate/context appears to require Clipboard Acquisition or Threat scan state.
- Parser jumps trigger Threat Intel scans.
- Clipboard/search actions modify Passive current-system prerequisites.
- Live provider calls become necessary without a separate active packet and explicit authorization.
- Display/adapter/fixture convergence must be decided to answer I/O safety.
- Operator revokes authorization.

## 16. Clear Recommendation

Proceed to Dev hardening before live/manual smoke.

Do not proceed directly to live/manual operator gamelog smoke until the global shortcut clipboard pre-arm capture issue is fixed or explicitly redesigned, and until gate-separation/redaction verification exists for the future smoke packet.

## Verification Performed

Confirmed cwd/repo state:

- `Get-Location` -> `F:\Projects\AURA-Sense`
- `git branch --show-current` -> `main`
- `git status --short` -> no output; clean before artifact creation

Read-only/non-live checks run:

- `npm.cmd run verify:gamelog-watcher` -> passed, `gamelog watcher verified`
- `npm.cmd run verify:gamelog-watcher-chaos` -> passed, `gamelog watcher chaos verified`
- `npm.cmd run verify:passive-telemetry` -> passed, `passive telemetry verified`
- `npm.cmd run verify:threat-intel` -> passed, `threat intel verified`
- `npm.cmd run verify:clipboard-race` -> passed, `clipboard acquisition race verified`
- `npm.cmd run verify:diagnostics` -> passed, `diagnostics policy verified`

Not run:

- No live EVE folder ingestion.
- No private/operator EVE log folders inspected.
- No clipboard content captured.
- No manual shortcut validation.
- No Passive or Threat live API smoke.
- `AURA_SENSE_LIVE_API=1` was not set.
- No real SDE refresh/download.
