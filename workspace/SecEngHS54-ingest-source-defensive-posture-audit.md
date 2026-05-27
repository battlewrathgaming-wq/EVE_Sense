# SecEngHS54 - Ingest Source Defensive Posture Audit

Date: 2026-05-27
Role: Security / Engineering reviewer
Status: Read-only audit complete

## Goal

Assess each ingest-capable source by defensive posture, not only by current I/O gating:

- can it escape expected paths?
- can it read more than intended?
- can it store private/raw data?
- can it trigger provider calls unexpectedly?
- can renderer/service commands bypass authority?
- are artifacts redacted?
- are tests proving the right refusal shape?

This audit separates current posture from ADR-0008 target behavior. It does not implement changes.

## Files Reviewed

Authority and test docs:

- `docs/adr/ADR-0008-io-off-means-no-ingest.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/testing/live-api-smoke-transition-readiness.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `package.json`

Runtime/source:

- `src/main/main.js`
- `src/main/preload.js`
- `src/services/serviceRegistry.js`
- `src/services/taskRunner.js`
- `src/services/ipcPayloadValidation.js`
- `src/services/httpClient.js`
- `src/services/liveSmokeHttpClient.js`
- `src/services/diagnosticsPolicy.js`
- `src/runtime/runtimeSettingsService.js`
- `src/runtime/runtimeDiagnosticsService.js`
- `src/combat/eveLogPaths.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatLogParser.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessService.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/passive/localSystemResolver.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/threat/threatIntelTargetResolver.js`
- `src/threat/clipboardAcquisitionService.js`
- `src/threat/clipboardAcquisitionGate.js`
- `src/metadata/localTypeMetadata.js`
- `src/metadata/sdeJsonlZip.js`
- `src/util/sdeSourceBundle.js`
- `src/util/tempPaths.js`
- `src/renderer/app.js`
- `src/renderer/index.html`

Scripts/tests:

- `scripts/verify-all.js`
- `scripts/verify-gamelog-watcher.js`
- `scripts/verify-gamelog-watcher-chaos.js`
- `scripts/verify-combat-parser.js`
- `scripts/verify-combat-parser-hostile.js`
- `scripts/verify-combat-log-replay.js`
- `scripts/verify-passive-telemetry.js`
- `scripts/verify-threat-intel.js`
- `scripts/verify-provider-fault-injection.js`
- `scripts/verify-clipboard-acquisition-race.js`
- `scripts/verify-operator-io-gate-separation.js`
- `scripts/verify-renderer-boundary.js`
- `scripts/verify-renderer-boundary-adversarial.js`
- `scripts/verify-renderer-shell.js`
- `scripts/verify-local-type-metadata.js`
- `scripts/verify-runtime-control.js`
- `scripts/verify-diagnostics-policy.js`
- `scripts/smoke-passive-live-api.js`
- `scripts/smoke-threat-live-api.js`
- `scripts/electron-visual-smoke.ps1`
- `scripts/build-local-type-metadata.js`

## Posture Table

| source | current guardrails | known tests | current gaps | ADR-0008 impact | future hardening priority |
| --- | --- | --- | --- | --- | --- |
| Gamelog folder/path selection | `validateGamelogFolder` requires tail structure `EVE/logs/Gamelogs`, rejects empty/missing/non-directory paths, symlink folder paths, and realpath structure escapes. Runtime validates before accepting `gamelogFolder`; startup recovery configures valid persisted settings without auto-starting watcher. | `verify:runtime-control`, `verify:gamelog-watcher`, `verify:gamelog-watcher-chaos`, `verify:services`, renderer-shell checks for picker/service boundary. | Path validation uses expected tail structure, not a user-confirmed root allowlist. Full configured path can live in local settings/UI/runtime status. Folder picker/configuration is not I/O gated, though it does not read log content. | Configuration may remain support-only while I/O is off, but start/read must be blocked. Docs should separate configure from ingest. | Medium. Preserve current validation; add explicit no-ingest behavior around start/read and path-redacted operator artifacts. |
| Gamelog watcher/file tail reads | Watcher seeds offsets for existing `.txt` files, avoids replaying existing content, handles future appends only, rejects unsafe fs-watch filenames with separators/dot-dot, checks direct child path, lstat/stat, symlink files, realpath containment, replacement identity, truncation, partial lines, duplicate TTL, read failure offset safety, and parser/listener failure isolation. | `verify:gamelog-watcher`, `verify:gamelog-watcher-chaos`, `verify:combat-log-replay`, `verify:combat-witness-core`. | Not controlled by current runtime I/O authority. Once watcher starts, `readRange` can read appended bytes while IO is off. Polling fallback may keep reading until stopped. Diagnostics can include file paths, though raw line content is hashed/redacted. | Direct ADR-0008 gap. I/O off must prevent watcher start and active tail reads. | P0. Gate at watcher start and active read boundary; stop/pause active watcher on I/O-off transition; add no-read tests with injected `readRange`. |
| Parser line acceptance/rejection | Parser validates strict EVE timestamp envelope, recognized event families, oversized/hostile/near-miss rejection. Watcher rejection evidence records `rawLineHash`, reason, and message, not raw line text. Diagnostics policy treats unparsed rejection as low value and high-value parser errors as hash-only. | `verify:combat-parser`, `verify:combat-parser-hostile`, `verify:combat-coverage`, `verify:gamelog-watcher-chaos`, `verify:combat-log-replay`. | Parser is not an authority gate; if file bytes were read, parsing has already ingested local content. Accepted events include source/target/weapon labels as tactical observations. | Under ADR-0008 parser should only run over admitted bytes/events. Internal parsing can remain pure after source gate. | Medium/P0 dependency. Do not scatter I/O checks through parser; prevent unauthorized file reads before parser. Keep hash-only rejection evidence. |
| Shared event spine admission | Production spine is `EveGamelogWatcher -> combatWitnessRuntime.observeEvent -> CombatWitnessService.addEvent + notifyObservers -> Passive observeEvent`. Combat service admits only combat stream events; Passive observes navigation jumps through runtime observer path. | `verify:operator-io-gates`, `verify:combat-witness-runtime`, `verify:combat-log-replay`; trace artifact `workspace/EngTraceHS53-gamelog-event-spine-trace.md`. | `observeEvent` has no I/O authority check. Gating only `CombatWitnessService.addEvent` would not stop Passive navigation updates, because observers are notified from runtime. | Runtime admission guard is useful defense in depth, but file/read gate is more central for privacy. | P0/P1. Gate source/read first; add runtime admission guard only as fallback. Tests should prove both Combat and Passive do not mutate from local log events while off. |
| Combat Witness computation/storage | Rolling windows and bounded event stream only; no historical storage; event stream limit defaults to 30; compact events omit raw line text and retain observed labels/amount/timing. | `verify:combat-witness`, `verify:combat-window-followups`, `verify:combat-golden`, `verify:combat-replay`, renderer-shell copy checks. | It stores recent private/local observations in memory and renderer snapshots once admitted. Not currently frozen/blocked by I/O off if watcher continues. | Existing last observed/resting state may remain visible while off, but no fresh computation should occur. | Medium. Keep computation pure over admitted events; add last-observed/resting copy tests after gate implementation. |
| Passive provider calls | Passive only calls providers from `refresh` after a current system exists and after `liveIoGate.check({ providers: ['esi', 'zkill'] })`. Disabled gate yields blocked snapshot and zero ESI/zKill calls. ESI cache revalidation is gated. Provider failures become degraded/partial, distinct from blocked. | `verify:passive-telemetry`, `verify:provider-faults`, `verify:http`, live API refusal docs/scripts. | Passive `observeEvent` mutates `currentSystem` before provider gate. Thus local observation can update while providers are blocked. Provider gate is lane-specific and narrower than global ADR-0008. | Provider call side is mostly aligned; parser-observed current-system ingest is not. | P1 after watcher gate. Preserve provider gate and add global I/O tests that distinguish no local observation from provider block. |
| Threat provider calls | `threatIntelService.scan` validates bounded target text, resolves locally, checks Threat live gate before zKill call. Disabled gate returns `blocked` with `THREAT_LIVE_IO_BLOCKED` and zero calls. HTTP client bounds timeout/retry and logs request metadata, not raw bodies. | `verify:threat-intel`, `verify:provider-faults`, `verify:http`, `verify:operator-io-gates`, live API refusal docs/scripts. | Renderer/preload exposes `auraThreatIntel.scan` directly, so backend gate is the real authority. Local target resolution can run before gate. Threat live smoke can store target text in artifact, default `system:Jita`, or env override if authorized. | Provider calls must remain blocked while off. Product decision needed on whether local resolution for typed input while off is support-only or blocked-before-resolution. | Medium. Keep backend gate; add runtime-all-off scan refusal tests; document typed/local resolver semantics. |
| Clipboard Acquisition reads/listen/cooldown | Global shortcut checks Threat gate before `clipboard.readText()`. Renderer service `arm` and `capture` commands are wrapped by `runClipboardAcquisitionWithGate`, returning blocked snapshot before `readClipboard`. Listening window is 3s, cooldown 5s, duplicate cache is 10s/5 entries and fingerprint-only. No raw clipboard history is durable. | `verify:operator-io-gates`, `verify:clipboard-race`, `verify:threat-intel`, renderer-shell checks, protected-term checks. | `clipboardAcquisitionService` itself reads immediately in `arm()`/`capture()` if called ungated; safety depends on all external callers staying wrapped. Snapshots can expose `lastCapture.targetText` in memory/UI for captured/rejected/failed content. Turning I/O off during an already listening window needs explicit stop/no-further-read coverage. | Mostly aligned for known entry points. ADR-0008 reinforces no read while off and requires active listener cleanup on off. | P1. Add tests for toggle-off during listening and ensure all future callers use gate wrapper. Consider redaction rules for artifacts with `targetText`. |
| Static metadata lookup | Passive system resolver and Threat target resolver read bundled fixture/static JSON files and fall back to unresolved/empty on malformed/missing metadata. Local type lookup reads compact app metadata and returns unresolved labels when missing/malformed. | `verify:passive-telemetry`, `verify:threat-intel`, `verify:local-type-metadata`. | Static metadata reads are not I/O-gated. If metadataPath became operator-provided, it could become local file ingest. Current defaults are app-owned fixture paths. | Likely support-only exemption should be documented. ADR-0008 should apply to external refresh/download and operator-provided source paths, not app-owned bundled lookup. | Low/Medium. Document support-only status; keep metadata path internal; avoid exposing arbitrary metadataPath through renderer/service commands. |
| SDE refresh/build path | `build-local-type-metadata` is explicit script only, not runtime renderer path. `prepareSdeSourceBundle` keeps cache under project `.tmp` by default, rejects source/cache outside project unless explicit allow flag/env, records checksums/provenance, cleans staged source unless keep flag set. ZIP reader rejects unsafe entry paths, oversized entries, unsupported compression, malformed ZIP bounds. | `verify:local-type-metadata`; aggressive matrix says full SDE assets are excluded from `verify:all` dependencies. | If run without `--source`, it downloads latest SDE metadata/zip from live URLs. This is external ingest but separate from runtime I/O UI and currently controlled by explicit command/operator packet, not app I/O. `--allow-external-source` can read outside project if explicitly passed. | Future ADR-0008 docs should clarify SDE refresh as explicit non-runtime ingest requiring its own authorization, not covered by the app IO button unless integrated later. | Medium. Keep out of renderer/runtime. Add docs/stop condition that SDE refresh remains explicit and not part of `verify:all` or app I/O smoke. |
| Smoke/artifact output paths | Live API smoke refuses by default unless `AURA_SENSE_LIVE_API=1`, writes `.tmp/*-live-api-smoke/result.json` with `no_live_call: true` and empty `requestLogs` on refusal. Live operator playbook requires path/line/clipboard redaction. Electron visual smoke writes under `.tmp/electron-visual-smoke`, uses isolated user data, and clears only that smoke directory. | `verify:renderer-shell` checks visual smoke state names; live smoke docs; current-state docs; no live smoke run in this audit. | Live API success artifacts include snapshot metadata and request logs; Threat live smoke records `targetText`. Electron smoke captures screenshots and is not suitable for private operator sessions. `electron-visual-smoke.ps1` deletes the smoke root contents but path is fixed under project `.tmp`. | ADR-0008 does not forbid support artifacts, but live/manual artifacts must not become hidden ingest or private raw storage. Gamelog smoke playbook needs ADR-0008 update to require I/O authority for log ingest. | Medium. Add refusal-shape tests for smoke artifacts if not already covered. Keep live/manual smoke explicitly authorized and redaction-safe. |
| Renderer/preload/service command exposure | Renderer files are statically checked against direct fetch/fs/parser/computation. Preload generic `aura.invokeService` allowlist exposes only seed/readiness, runtime settings snapshot, folder picker, live-io snapshot/set, diagnostics snapshot, combat status/start/stop. Full service inventory is not exposed. Threat bridge exposes scan and clipboard commands intentionally through backend service invoke. Service registry validates request shape. Task runner locks task classes. | `verify:renderer-boundary`, `verify:renderer-boundary-adversarial`, `verify:renderer-shell`, `verify:services`. | Any preload-exposed Threat command bypasses the generic allowlist by design, so backend validation/gating must remain complete. `combat.witness.start` is exposed to renderer and currently not I/O-gated. `runtime.live-io.set-enabled` toggles provider/clipboard gates only. | ADR-0008 makes exposed `combat.witness.start` the most important renderer-reachable authority gap. | P0 for `combat.witness.start`; P1 for broader service command refusal shape and renderer copy alignment. |

## Cross-Source Findings

1. Path containment is strongest in the gamelog watcher, not in I/O authority.
   The watcher does a good job preventing path escape and replay, but it currently treats a valid watched folder as authorization to ingest.

2. Provider and clipboard refusal shapes are much stronger than local log refusal.
   Passive/Threat provider calls and Clipboard Acquisition have explicit no-call/no-read tests. Local gamelog ingest has containment tests but not I/O-off no-read tests.

3. Raw/private storage is mostly avoided, but in-memory and local artifacts still need context.
   Rejected gamelog lines are hash-only. Diagnostics redact raw/content/line keys. Combat/Passive/Threat snapshots can still contain observed labels, system names, target text, provider counts, and local paths in status/settings surfaces.

4. Renderer does not own ingest.
   Static boundary tests cover direct provider endpoints, filesystem access, parser ownership, tactical computation, preload network/filesystem access, service allowlist, and subscriptions. The main remaining issue is that renderer can ask backend to start a currently ungated watcher.

5. Artifact posture depends on command class.
   Offline tests use fixtures and `.tmp`. Live API smoke refuses by default. Electron smoke writes screenshots and must stay outside private/manual operator validation unless explicitly authorized. The live operator gamelog playbook has strong redaction language but now needs ADR-0008 alignment.

6. Static metadata is not the same risk class as operator-machine ingest.
   Bundled fixture/static lookup is support-only in current code. SDE refresh/build is an explicit external/source ingest command and should remain separately authorized.

## Current Gaps Ranked

P0:

- `combat.witness.start` and active watcher tail reads are not governed by runtime I/O authority.
- Turning I/O off does not stop/pause active local log ingest.
- Parser-derived Passive current-system observation can update from local logs while I/O is off if events reach the service.

P1:

- No no-read/no-mutation tests for I/O-off watcher/read/admitted event refusal.
- No toggle-off-during-clipboard-listening test proving no further clipboard reads.
- Renderer copy still says I/O off blocks "network and clipboard", not all ingest.
- Live operator gamelog playbook does not yet require app I/O authority for log ingest under ADR-0008.

P2:

- Clarify typed Threat local resolver behavior while I/O is off.
- Document static metadata lookup as support-only and SDE refresh as explicit external/source ingest.
- Add smoke artifact refusal-shape tests for default live API refusal if desired.
- Consider redaction/fingerprints for local path display in any future operator artifacts.

## Recommended Future Dev Hardening Shape

1. Gate source/read first:
   - block `combat.witness.start` while I/O authority is off
   - stop or pause active watcher when I/O turns off
   - defensively block `readRange` / event emission if authority is off

2. Keep computation pure:
   - `CombatWitnessService.addEvent`
   - Passive `refresh`
   - renderer snapshot mapping
   should operate over admitted state, not each invent separate source authority rules.

3. Preserve existing guardrails:
   - path containment
   - append-only offset seeding
   - hash-only rejection evidence
   - provider gates
   - clipboard gate wrappers
   - renderer/preload allowlists

4. Add refusal-shape verification:
   - watcher start while off returns authority-blocked shape
   - active watcher disabled by I/O-off transition emits no further reads/events
   - Combat and Passive snapshots do not mutate from local log appends while off
   - provider and clipboard existing no-call/no-read assertions still pass

5. Reconcile copy/docs:
   - I/O off means no ingest, not "network and clipboard blocked"
   - `No observation`, `Unavailable`, `Provider failed`, and `Live IO blocked` stay distinct
   - live operator playbook requires I/O-on for gamelog ingest and records I/O-off refusal as blocked/no-ingest

## Verification

Static/read-only commands run:

- `Get-Content` on the listed source, scripts, and docs.
- `rg` searches across `src`, `scripts`, and `docs/testing` for filesystem reads/writes, watcher paths, provider calls, clipboard reads, service command exposure, artifact writes, raw/private indicators, and smoke/live flags.

No code was changed. No tests were run for this audit. No live/manual/private I/O was run. No real EVE log folders were inspected. No clipboard content was captured. No live provider smoke was run.
