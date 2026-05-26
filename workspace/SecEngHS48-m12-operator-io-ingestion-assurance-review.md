# SecEngHS48: M12 Operator I/O And Ingestion Assurance Review

Date: 2026-05-26
Role: AURA-Sense Security / Engineering Reviewer
Scope: Read-only audit and code review, except this requested review artifact

## 1. Files Reviewed

- `AGENTS.md`
- `workspace/current.md`
- `workspace/overview.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/DevHS46-m12g-clipboard-mode-gate-separation-hardening.md`
- `workspace/OverseerHS47-m12g-clipboard-gate-separation-acceptance.md`
- `workspace/SecEngHS44-m12f-operator-io-readiness-gate-separation-review.md`
- `docs/current-state/current-implementation.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/features/clipboard-acquisition.md`
- `docs/adr/ADR-0005-clipboard-acquisition-authority-and-cache.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/testing/live-api-smoke-transition-readiness.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `package.json`
- `src/main/main.js`
- `src/main/preload.js`
- `src/combat/eveLogPaths.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatLogParser.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessService.js`
- `src/passive/liveIoGate.js`
- `src/passive/passiveTelemetryService.js`
- `src/threat/clipboardAcquisitionService.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/runtime/runtimeSettingsService.js`
- `src/runtime/runtimeDiagnosticsService.js`
- `src/services/diagnosticsPolicy.js`
- `src/services/httpClient.js`
- `src/services/liveSmokeHttpClient.js`
- Verification scripts: `scripts/verify-gamelog-watcher.js`, `scripts/verify-gamelog-watcher-chaos.js`, `scripts/verify-operator-io-gate-separation.js`, `scripts/verify-threat-intel.js`, `scripts/verify-clipboard-acquisition-race.js`, `scripts/verify-passive-telemetry.js`, `scripts/verify-provider-fault-injection.js`, `scripts/verify-diagnostics-policy.js`, `scripts/verify-renderer-boundary.js`, `scripts/verify-renderer-boundary-adversarial.js`, `scripts/verify-runtime-control.js`, `scripts/smoke-passive-live-api.js`, `scripts/smoke-threat-live-api.js`

Note: the requested path `docs/adr/0005-clipboard-acquisition-authority.md` does not exist. The active matching ADR reviewed was `docs/adr/ADR-0005-clipboard-acquisition-authority-and-cache.md`.

## 2. Current-State Understanding

Repo-verified facts:

- M12 is active but idle; no live/manual run is currently open in `workspace/current.md`.
- M12G accepted the two-mode Clipboard Acquisition model: global `Control+\` may immediately capture current valid clipboard content when I/O is on, while focused/windowed acquisition without payload must baseline, ignore unchanged pre-arm content, then seal/cool down.
- Gamelog ingest is append-only from configured EVE `logs/Gamelogs` folders, with expected-structure validation, realpath checks, symlink skips, replacement identity seeding, and hash-only rejected-line evidence.
- Parser events feed Combat Witness runtime fan-out. Passive Telemetry observes `navigation.jump`. Threat Intel is invoked through explicit scan or Clipboard Acquisition paths, not parser fan-out.
- Passive and Threat live gates are separate backend gate instances in production wiring.

Assumptions:

- No live provider state, real operator gamelog folder, real clipboard content, or manual shortcut behavior was sampled by this review.
- Existing accepted handoffs are treated as project record, but code and active docs were preferred for current truth.

## 3. Findings

### P1 - Clipboard service commands can read clipboard while Threat I/O is off

`src/main/main.js:472-489` correctly blocks the global shortcut before `clipboard.readText()` when `threatLiveIoGate.status().enabled` is false. However, the exposed service commands do not enforce that backend gate:

- `src/main/preload.js:93-100` exposes `auraThreatIntel.armClipboard` and `captureClipboard` to the renderer.
- `src/main/main.js:344-351` registers `threat.clipboard.arm` and `threat.clipboard.capture` directly to `acquisition.arm(payload)` and `acquisition.capture(payload)`.
- `src/threat/clipboardAcquisitionService.js:26` reads the clipboard to establish the baseline when `arm()` is called without `clipboardText`.
- `src/threat/clipboardAcquisitionService.js:48` reads the clipboard during `capture()` when no explicit text is provided.

Impact: this violates the backend-owned authority invariant that I/O off prevents clipboard reads. The UI may avoid calling these paths while I/O is off, but the service boundary itself is exposed through preload and does not enforce the gate. This is security-relevant because Clipboard Acquisition authority should not rely on renderer behavior.

Recommended bounded packet: add backend gate enforcement around all Clipboard Acquisition service-command paths, then add deterministic coverage proving `threat.clipboard.arm` and `threat.clipboard.capture` do not call `readClipboard` while Threat I/O is off.

### P2 - Threat blocked-state unit coverage is partly production-inconsistent

`scripts/verify-threat-intel.js:64-80` creates a Threat Intel service with the default `createLiveIoGate({ enabled: false })`, then asserts the blocked code is `PASSIVE_LIVE_IO_BLOCKED`. Production wiring uses a threat-specific gate with `blockedCode: 'THREAT_LIVE_IO_BLOCKED'` at `src/main/main.js:36-40`, and `scripts/verify-provider-fault-injection.js:230-247` does verify that lane-specific code.

Impact: production behavior is covered elsewhere, so this is not a runtime blocker. The gap is verification clarity: the primary Threat Intel verifier normalizes a Passive blocked code into a Threat test, which weakens lane-specific regression confidence.

Recommended bounded packet: update the primary Threat verifier to use a production-like Threat gate or assert only lane-agnostic blocked behavior there while keeping the provider-fault test as the lane-code oracle.

### P3 - Live/manual operator artifact privacy is documented, not enforced by a dedicated harness

Docs require redaction by default: `docs/testing/live-operator-gamelog-smoke-playbook.md:24-29` forbids raw private gamelog lines, raw clipboard targets, and full private paths unless explicitly approved. Code paths can still surface private material to local runtime/UI snapshots:

- `src/combat/combatWitnessRuntime.js:96-117` includes configured watcher paths in runtime status.
- `src/main/main.js:250-263` returns the selected `gamelogFolder` from the native picker.
- `src/threat/clipboardAcquisitionService.js:102-124` includes `lastCapture.targetText` in active Clipboard Acquisition snapshots after capture/rejection/failure.

Impact: normal diagnostics are sanitized, but a future live/manual artifact author could still copy raw snapshots into a handoff. This is not evidence of current leakage in routine diagnostics; it is a live/manual readiness gap.

Recommended bounded packet: before any operator I/O smoke, define or implement a redaction-safe artifact template/harness that records path validation state, event counts, hashes, gate states, and stop reasons without raw private paths, raw gamelog lines, raw clipboard targets, screenshots, or renderer captures unless explicitly authorized.

## 4. Gamelog Containment Trace

No blocking issue found in the gamelog containment path.

- Expected folder shape is `EVE/logs/Gamelogs` in `src/combat/eveLogPaths.js:4`, with default folder construction at `src/combat/eveLogPaths.js:6-12`.
- Path normalization uses `path.resolve` in `src/combat/eveLogPaths.js:15-21`.
- Structure validation compares the case-insensitive trailing segments in `src/combat/eveLogPaths.js:24-35`.
- Folder validation rejects empty/missing paths, wrong structure, symlink folders, realpaths outside expected structure, and non-directories at `src/combat/eveLogPaths.js:37-80`.
- Runtime configuration calls `validateLogPathForWatcher` before accepting a gamelog folder at `src/combat/combatWitnessRuntime.js:41-58`.
- Watcher startup validates again and stores both configured path and realpath at `src/combat/eveGamelogWatcher.js:45-60`.
- Existing direct-child `.txt` files are seeded at current size, not replayed, in `src/combat/eveGamelogWatcher.js:84-101`.
- `fs.watch` filenames are rejected if they include separators, `.` / `..`, or `..` substrings via `containedFilenamePath` at `src/combat/eveGamelogWatcher.js:119-127` and `src/combat/eveGamelogWatcher.js:365-373`.
- Active file validation rejects outside-active-folder paths, symlink files, non-files, and realpath escapes at `src/combat/eveGamelogWatcher.js:303-334`.
- Replacement/truncation behavior seeds new identities or resets offset without replaying replacement content at `src/combat/eveGamelogWatcher.js:201-224`.
- Range reads only occur after containment validation, from prior offset to current size, at `src/combat/eveGamelogWatcher.js:235-246`.

Offline support:

- `scripts/verify-gamelog-watcher.js:28` covers traversal-resolved folder rejection.
- `scripts/verify-gamelog-watcher.js:48-76` covers seed-without-replay and newly discovered file seeding.
- `scripts/verify-gamelog-watcher-chaos.js:43-57` covers multi-file seed, future append, replacement seeding, and newly discovered file seeding.
- `scripts/verify-gamelog-watcher-chaos.js:102-117` covers outside-active-folder and symlink-file skips where feasible.
- `scripts/verify-gamelog-watcher-chaos.js:215-225` covers failed range-read offset safety.

Config recovery:

- Runtime settings validate persisted settings on load at `src/runtime/runtimeSettingsService.js:17-36`.
- Invalid settings degrade visibly without accepting the bad gamelog folder at `src/runtime/runtimeSettingsService.js:25-35`.
- `scripts/verify-runtime-control.js:25-38` covers corrupt JSON, schema drift, and missing persisted gamelog path degradation.

Privacy note: watcher trace payloads can include local paths, but diagnostics sanitization and live/manual playbook rules limit routine/artifact exposure. Future operator artifacts should avoid full private paths by default.

## 5. Parser-To-Event Spine Trace

No listener lane-crossing issue found in the parser-to-event spine.

- The watcher parses completed appended lines and calls `onEvent(event)` at `src/combat/eveGamelogWatcher.js:263-281`.
- Parser errors and unparsed lines report `rawLineHash`, not raw text, at `src/combat/eveGamelogWatcher.js:348-359`.
- Runtime `observeEvent` adds the event to Combat Witness, then notifies observers at `src/combat/combatWitnessRuntime.js:130-135`.
- Runtime observer failures are isolated by `try/catch` in `src/combat/combatWitnessRuntime.js:144-153`.
- Passive is wired as a runtime observer in `src/main/main.js:67-73`.
- Passive filters strictly to `navigation.jump` with `systemName` at `src/passive/passiveTelemetryService.js:27-31`.
- Combat Witness metric ownership remains in `CombatWitnessService`; parser non-combat jump events are not Threat scans.

Offline support:

- `scripts/verify-operator-io-gate-separation.js:18-80` proves parser jump updates Passive and does not invoke Threat scan.
- `scripts/verify-operator-io-gate-separation.js:83-146` proves Clipboard/Threat scan does not initialize Passive and Passive can later open from parser-observed jump.

## 6. Passive vs Active I/O Separation Trace

One authority issue exists in the Clipboard service-command path; otherwise lane separation is preserved.

Passive:

- Passive opens from parser-observed `navigation.jump`, sets `currentSystem`, emits pending/stale state, then refreshes with reason `system-change` at `src/passive/passiveTelemetryService.js:27-47`.
- Passive provider calls are gated by its own live gate at `src/passive/passiveTelemetryService.js:79-89`.
- Passive manual refresh also checks the gate before ESI activity revalidation at `src/passive/passiveTelemetryService.js:205-213`.

Threat / Active:

- Explicit scan is exposed as `threat.intel.scan` at `src/main/main.js:317-327` and uses `ThreatIntelService.scan`.
- Threat scan normalizes input, resolves target, checks its gate, and calls zKill only after the gate allows at `src/threat/threatIntelService.js:20-91`.
- Global shortcut is `Control+\` with fallback handling at `src/main/main.js:406-458`.
- Global shortcut blocks before clipboard read when Threat I/O is off at `src/main/main.js:472-489`.

Separation:

- Passive and Threat gate instances are distinct in production wiring at `src/main/main.js:33-40`.
- Aggregate `runtime.live-io.set-enabled` can intentionally set `all`, `passive`, or `threat` at `src/main/main.js:391-402`; this is shared control over separate backend gates, not a shared activation path.
- No parser path was found that invokes `threatIntelService.scan`.

Gap:

- `threat.clipboard.arm` and `threat.clipboard.capture` are exposed service paths that can read the clipboard without checking the Threat gate. See P1.

## 7. Clipboard Acquisition Authority Trace

Supported:

- Global `Control+\` immediate capture is accepted by `docs/adr/ADR-0005-clipboard-acquisition-authority-and-cache.md` and `workspace/OverseerHS47-m12g-clipboard-gate-separation-acceptance.md`.
- Focused/windowed no-payload `arm()` reads a baseline, enters a 3 second listening state, and ignores unchanged content during capture at `src/threat/clipboardAcquisitionService.js:18-50`.
- Immediate shortcut payload capture uses `arm({ clipboardText })` then `capture({ allowUnchanged: true })` at `src/threat/clipboardAcquisitionService.js:18-38`.
- Seal/cooldown is centralized in `seal()` with a 5 second cooldown at `src/threat/clipboardAcquisitionService.js:102-113`.
- Timeout/cancel/rejection/scan-failure all seal or remain bounded at `src/threat/clipboardAcquisitionService.js:47-89`.
- Duplicate suppression stores SHA-256 fingerprints only, with 10 second / 5 entry limits at `src/threat/clipboardAcquisitionService.js:1-4` and `src/threat/clipboardAcquisitionService.js:130-153`.
- Duplicate suppression does not expose `lastCapture.targetText` on duplicate skip at `src/threat/clipboardAcquisitionService.js:57-64`.

Not fully supported:

- I/O off prevents clipboard reads for the global shortcut path, but not for exposed service-command arm/capture paths. See P1.

Offline support:

- `scripts/verify-clipboard-acquisition-race.js:19-49` covers rapid arm/cancel/cooldown and successful changed-content capture.
- `scripts/verify-clipboard-acquisition-race.js:52-79` covers unchanged content, rejection, and timeout.
- `scripts/verify-clipboard-acquisition-race.js:83-103` covers scan-failure sealing.
- `scripts/verify-clipboard-acquisition-race.js:106-125` covers concurrent arm behavior.
- `scripts/verify-clipboard-acquisition-race.js:128-165` covers immediate shortcut capture and recent duplicate suppression.
- `scripts/verify-threat-intel.js:113-138` covers immediate shortcut acquisition, duplicate suppression, focused/windowed unchanged baseline behavior, cooldown, and timeout.

Coverage gap:

- No reviewed test proves service-command `threat.clipboard.arm` / `capture` refuse to read clipboard when Threat I/O is off.

## 8. Live Provider Gate Trace

No blocking provider-gate issue found.

- `createLiveIoGate` defaults to disabled and returns explicit blocked metadata from `check()` at `src/passive/liveIoGate.js:1-42`.
- Passive uses the gate before ESI/zKill fetch at `src/passive/passiveTelemetryService.js:79-89`.
- Threat uses the gate before zKill fetch at `src/threat/threatIntelService.js:43-55`.
- Production wiring creates separate Passive and Threat gate instances at `src/main/main.js:33-40`.
- Live API smoke scripts refuse unless `AURA_SENSE_LIVE_API === '1'` at `scripts/smoke-passive-live-api.js:15-26` and `scripts/smoke-threat-live-api.js:17-33`.

Distinct states:

- Threat `No scan` is represented by the empty snapshot message `No Threat Intel scan has run` at `src/threat/threatIntelService.js:155-167`.
- Threat blocked, failed, partial, and succeeded statuses are separate in `src/threat/threatIntelService.js:43-91`.
- Passive blocked, degraded, partial, fresh, stale, and unavailable are separate in `src/passive/passiveTelemetryService.js:27-153`.
- `scripts/verify-provider-fault-injection.js:43-67` verifies Passive provider faults degrade and are not live-I/O blocked.
- `scripts/verify-provider-fault-injection.js:223-248` verifies Passive and Threat blocked states keep lane gate codes and do not call providers.
- `scripts/verify-provider-fault-injection.js:266-272` verifies Threat provider faults are failed, not blocked.

## 9. Artifact And Privacy Safety Review

Routine diagnostics:

- Runtime diagnostics suppress low-value events including `tail_read`, `duplicate_suppressed`, and `http_request_success` at `src/runtime/runtimeDiagnosticsService.js:1-21`.
- Diagnostic payload sanitization redacts keys matching raw/line/content unless hash-like, truncates long strings, and collapses structured values at `src/runtime/runtimeDiagnosticsService.js:44-68`.
- Diagnostics policy classifies routine unparsed lines as low-value and parser errors as high-value at `src/services/diagnosticsPolicy.js:97-111`.
- HTTP request logging records metadata, not raw response bodies, at `src/services/httpClient.js:38-104`.
- Live smoke HTTP uses verbose diagnostics only for request metadata via `src/services/liveSmokeHttpClient.js:1-14`.

Gamelog privacy:

- Parser rejected lines use `rawLineHash`, not raw line text, at `src/combat/eveGamelogWatcher.js:348-359`.
- Hostile parser verification asserts hash-only rejection evidence and no raw leak at `scripts/verify-combat-parser-hostile.js:35-37`.

Clipboard privacy:

- Recent duplicate cache stores only fingerprints at `src/threat/clipboardAcquisitionService.js:130-153`.
- Active Clipboard Acquisition snapshots may include `lastCapture.targetText` after capture/rejection/failure at `src/threat/clipboardAcquisitionService.js:102-124`; this is acceptable for local workflow but not for default live/manual artifacts.

Path privacy:

- Runtime and picker status can include configured paths. Future artifacts must sanitize these unless explicitly accepted.

Screenshots/renderer:

- Electron visual smoke writes screenshots, but it is not part of `verify:all` and was not run. `docs/testing/aggressive-test-harness-matrix.md:14-18` keeps Electron smoke separate from offline confidence and live/manual operator smoke.

Provider bodies:

- Reviewed HTTP and smoke paths do not store raw provider bodies; smoke artifacts store bounded snapshot summaries and request logs.

## 10. Verification Coverage Map

Already proven offline by active scripts/docs:

- Gamelog expected structure, traversal resistance, append-only seeding, replacement handling, symlink-file skip where feasible, offset safety, and hash-only rejection evidence: `verify:gamelog-watcher`, `verify:gamelog-watcher-chaos`.
- Parser normalization and hostile/near-miss rejection: `verify:combat-parser`, `verify:combat-parser-hostile`, `verify:combat-coverage`.
- Combat Witness runtime fan-out and listener isolation: `verify:combat-runtime`, `verify:combat-witness`, watcher chaos checks.
- Passive current-system observation and provider gate behavior: `verify:passive-telemetry`.
- Passive/Threat provider failures distinct from blocked state: `verify:provider-faults`.
- Threat scan contract, target length cap, blocked calls, and Clipboard lifecycle semantics: `verify:threat-intel`, `verify:clipboard-race`.
- Parser jump / Passive / Threat gate separation: `verify:operator-io-gates`.
- Renderer/preload boundary and subscription cleanup: `verify:renderer-boundary`, `verify:renderer-boundary-adversarial`.
- Diagnostics sanitization: `verify:diagnostics`.
- Settings recovery/degraded behavior: `verify:runtime-control`.
- Aggregated offline confidence command includes relevant checks: `package.json` lists `verify:all`, and `scripts/verify-all.js` is recorded in M12G handoff as passing.

Live/manual gated or not proven here:

- Real operator EVE gamelog folder smoke.
- Real clipboard content capture.
- Manual `Control+\` OS-level accelerator feel/registration.
- Additional live Passive/Threat provider calls beyond accepted M12 records.
- Raw repair/healing calibration and full combat dataset calibration.
- Exact renderer screenshot output for this review.

Security-relevant gaps:

- Backend gate enforcement for Clipboard service-command reads while I/O is off.
- Production-consistent Threat blocked-code assertion in the primary Threat verifier.
- Redaction-safe live/manual operator artifact harness before any future operator smoke.

Calibration/product-readiness gaps:

- Combat Witness damage spike calibration from real accepted datasets.
- Raw repair/healing fixture intake and calibration.
- Manual shortcut feel validation.

## 11. Residual Risks And Unclear Areas

- The global shortcut path is service-level reviewed but not manually validated in this audit.
- The service-command Clipboard gate issue means renderer behavior cannot be treated as the authority boundary until backend enforcement is added.
- Full private path exposure in local UI/runtime status is operationally useful, but unsafe for default artifacts.
- Existing verification proves deterministic seams, not live operator environment behavior.
- Live smoke artifact request logs are metadata-only by current code review, but any future provider expansion should re-check that raw bodies are not added.

## 12. Recommended Next Bounded Packet

Open a Dev hardening packet before live/manual operator I/O smoke:

1. Enforce Threat I/O gate checks on all Clipboard Acquisition service-command paths before any clipboard read.
2. Add deterministic tests proving service-command `arm` and `capture` do not call `readClipboard` when Threat I/O is off.
3. Align the primary Threat verifier with production Threat blocked-code behavior or explicitly delegate lane-code assertion to the provider-fault verifier.
4. Define a redaction-safe operator I/O smoke artifact template/harness before any live/manual packet runs.

Do not open live/manual operator smoke until item 1 is fixed and verified.

## 13. Boundary Statement

No code was changed.

No live/manual/private I/O was run:

- Did not set `AURA_SENSE_LIVE_API=1`.
- Did not run Passive or Threat live API smoke.
- Did not read private/operator EVE gamelog folders.
- Did not run live EVE gamelog ingestion.
- Did not read clipboard content.
- Did not run manual shortcut validation.
- Did not run screenshots, renderer smoke, or Electron visual smoke.
- Did not create a Dev runway.

The only file created by this review was this requested artifact.
