# SecEngHS38: M12B Live API Security Review

Status: Complete
Date: 2026-05-25
Role: AURA-Sense Security / Engineering reviewer

## Purpose

Review M12B live API security readiness before any authorized live provider execution.

This was a review-only pass. No implementation, live provider smoke, live operator gamelog smoke, calibration, fixture intake, renderer work, Lab work, adapter work, manual shortcut validation, private-folder inspection, or real SDE work was run.

## Files Reviewed

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/overseer.md`
- `docs/roadmap/README.md`
- `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
- `docs/roadmap/runtime-smoke-policy.md`
- `docs/testing/live-api-smoke-transition-readiness.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
- `workspace/DevHS34-m12-live-validation-harness-prep.md`
- `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
- `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
- `workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`
- `scripts/smoke-passive-live-api.js`
- `scripts/smoke-threat-live-api.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/passive/liveIoGate.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/threat/threatIntelTargetResolver.js`
- `src/services/httpClient.js`
- `src/services/diagnosticsPolicy.js`
- `fixtures/threat-intel-targets.json`

## Passive Live Path Risk Trace

Command gate: `scripts/smoke-passive-live-api.js` refuses unless `process.env.AURA_SENSE_LIVE_API === '1'`. The refusal writes `.tmp/passive-live-api-smoke/result.json` and returns before constructing the HTTP client or provider clients. This confirms default no-live behavior. Minor hardening gap: Passive refusal does not record `live_io_enabled: false`, `no_live_call: true`, or `requestLogs: []`, while Threat does. This is not a blocker because the branch exits before any live client construction, but it should be aligned before or during the next non-live hardening slice.

Enabled route path: if explicitly enabled in a future packet, the script constructs a smoke-local `PassiveTelemetryService` with `createLiveIoGate({ enabled: true })`, static system resolver, `PassiveEsiSystemActivityClient`, and `ZKillSystemContextClient`. It observes one fixture `navigation.jump` from `Perimeter` to `Jita`; local resolution should map Jita to system ID `30000142`.

Provider routes: Passive would call ESI aggregate routes `https://esi.evetech.net/latest/universe/system_kills/` and `https://esi.evetech.net/latest/universe/system_jumps/`, plus zKill `https://zkillboard.com/api/systemID/30000142/pastSeconds/3600/`. No ESI killmail expansion appears in this path.

Target/system bounds: the live smoke target is fixed by the fixture event and local system resolver. `ZKillSystemContextClient` requires a positive integer system ID and normalizes `pastSeconds` to the 60..86400 range with default 3600. The smoke sets zKill limit 5. ESI aggregate calls are broad provider aggregate endpoints by ESI design, but the artifact only normalizes the resolved target system row.

Timeout/retry behavior: the smoke HTTP client uses timeout 10000 ms and max attempts 2. `HttpClient` retries 420, 429, and 503 while attempts remain, honors `Retry-After`, marks rate-limited 420/429 in logs, and treats timeout/cancel/invalid JSON as non-retryable where applicable.

Cache/ETag behavior: `PassiveEsiSystemActivityClient` has a 60 minute in-instance cache. Fresh cache returns without live ESI re-fetch. Stale cached ETag sends `If-None-Match`; two 304 responses revalidate cached activity. A first smoke process normally records refreshed cache because the cache is process-local.

Request log fields: `HttpClient.log()` emits metadata only through `diagnosticsPolicy.wrapRequestLog`: `requested_at`, `diagnostic_event`, `provider`, `endpoint`, `method`, `statusCode`, `durationMs`, `retryCount`, plus `cached`, `rateLimited`, and `errorMessage` where applicable. It does not log request headers, response bodies, secrets, clipboard content, or private gamelog lines.

Artifact shape: enabled Passive would write status, checked time, output path, compact snapshot fields (`status`, `message`, `currentSystem`, `activity`, `zkill`, `gate`, `failure`), and request logs. Snapshot summaries include zKill killmail refs only as normalized refs inside the provider context before compaction; the smoke artifact uses `snapshot.zkill` from the service, which includes counts/cap/partial/failure count rather than raw provider bodies.

Privacy/security risks: acceptable for a future authorized single-lane smoke if the active packet is exact. The largest Passive-specific risks are provider aggregate endpoint exposure to live network, rate-limit handling under live zKill/ESI conditions, and the less explicit refusal artifact. No private operator paths, clipboard content, or gamelog lines are reachable from this smoke script.

## Threat Live Path Risk Trace

Command gate: `scripts/smoke-threat-live-api.js` refuses unless `process.env.AURA_SENSE_LIVE_API === '1'`. The refusal artifact explicitly records `live_io_enabled: false`, `no_live_call: true`, target settings, empty `requestLogs`, and output path.

Enabled route path: if explicitly enabled in a future packet, the script constructs a smoke-local `ThreatIntelService` with a live-enabled gate, local static target resolver, and `ThreatIntelZkillClient`. It runs one backend `scan()` call with `inputSource: 'search'`.

Route family: Threat is zKill-only. `ThreatIntelZkillClient.ROUTES` maps resolved target kinds to `systemID`, `characterID`, `corporationID`, or `allianceID`. It does not perform ESI killmail expansion.

Target override behavior: default target is `system:Jita`. `AURA_SENSE_THREAT_LIVE_TARGET` can override target text, but resolution is local/static through `fixtures/threat-intel-targets.json`. Unknown, ambiguous, unsupported, or copied free text resolves before the live gate/provider call and does not fetch. This meaningfully limits accidental arbitrary zKill route construction. The override still broadens target class from a single system to pilot/corporation/alliance if the fixture contains that exact target, so future authorization should name whether overrides are allowed and should require the resolved target to be echoed before accepting a live artifact.

Lookback/sample bounds: the smoke passes lookback 3600 and sample limit 5. `ThreatIntelService.normalizeScanRequest()` clamps lookback to 60..86400 and sample limit to 1..50; the smoke-local values are stricter. `ThreatIntelZkillClient` also normalizes past seconds through the Passive zKill helper.

Request log fields: same shared `HttpClient` metadata policy as Passive. No raw provider bodies, headers, secrets, clipboard content, or private gamelog lines are logged by default.

Artifact shape: enabled Threat would write status, checked time, `live_io_enabled: true`, output path, request target/lookback/sample, compact snapshot fields (`status`, `message`, `target`, `gate`, `zkill`, `failure`), and request logs. The compact zKill probe includes endpoint family, counts, cap/partial flags, and selected killmail refs (`killmailId`, `hash`), not raw bodies.

Privacy/security risks: acceptable for a future authorized Threat-only smoke if override is either disabled or explicitly named. The highest Threat-specific risk is that an environment override can switch from default Jita to a pilot/corp/alliance target present in local fixtures; this is bounded but should be intentional because target identity can be more person/entity-specific than a system route.

## Artifact And Privacy Classification Findings

Refusal records: default-safe smoke records. Threat refusal is strong because it records no-live-call and empty logs. Passive refusal is safe by source trace but should be made equally explicit.

Live request logs: live provider metadata. Current logging is acceptable under explicit authorization because it records endpoint, provider, method, status, timing, retry/cache/rate-limit/error metadata only. Endpoints may encode target IDs and route family, so classify as live provider metadata, not public product truth.

Provider result summaries: bounded tactical sample summaries. Passive summarizes activity counts and zKill count/cap/failure metadata. Threat includes selected killmail refs. These are acceptable only as smoke evidence and must not be presented as complete intelligence.

Diagnostics: sanitized runtime/provider metadata. The reviewed diagnostics policy suppresses low-value successes by default and does not add bodies. Keep diagnostics separate from tactical claims.

Raw provider bodies: not stored by default in reviewed scripts/services. Future raw body capture should require separate Human authorization for a narrow failure artifact.

Operator gamelog lines: not reachable from live API smoke and must remain out of artifacts.

Clipboard content: not reachable from live API smoke and must remain out of artifacts.

Machine-specific paths: smoke artifacts include workspace-local `.tmp` output paths. They do not hardcode private EVE folders. Treat absolute workspace paths in local artifacts/handoffs as low sensitivity project-machine metadata; do not add operator private paths.

## Authorization Wording Review

The current minimum wording is close, but not precise enough for a future live packet because it says `and/or`, does not pin the exact lane/command list, does not state target override handling, and uses `M12A` even though the current gate has advanced to M12B review.

Recommended replacement wording for a future live packet:

```txt
Authorize M12 live API smoke for [Threat only / Passive only / both] now. Set AURA_SENSE_LIVE_API=1 only for the named command invocation(s), then clear it. Run only [exact command(s)]. Use default Jita target unless this authorization explicitly names a different target. Do not use AURA_SENSE_THREAT_LIVE_TARGET unless the target text is named here. Write only the standard .tmp live smoke result artifact(s). Do not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims. Stop on the documented M12 live API stop conditions and record the stop reason.
```

If both lanes are authorized, the packet should still list the commands separately and define whether failure/degradation in the first command stops the second.

## Stop Condition Review

The existing stop conditions are directionally correct. Strengthen them with:

- Stop if the exact command list is not named; do not interpret `and/or`.
- Stop if a Threat target override is present but not explicitly authorized by target text and resolved kind.
- Stop if the resolved Threat target is pilot, corporation, or alliance and the authorization only named default Jita/system smoke.
- Stop if Passive emits more than the one fixture navigation event or attempts more than the mapped ESI aggregate and zKill system routes.
- Stop after any provider 420/429, repeated 5xx, timeout, malformed response, or retry exhaustion unless the active packet explicitly says to continue to the next named lane.
- Stop if any artifact would include raw provider bodies, request/response headers with secrets, clipboard text, private gamelog lines, private EVE folder paths, or unrelated operator state.
- Stop if `AURA_SENSE_LIVE_API=1` cannot be scoped to the single command invocation(s) and cleared afterward.
- Stop if the run requires renderer, bridge, IPC, Lab, adapter, operator gamelog, calibration, fixture intake, SDE refresh, or product-claim work.

## Recommended Next Live API Packet Shape

Recommendation: Threat-only live API smoke first, with default `system:Jita`, no `AURA_SENSE_THREAT_LIVE_TARGET`, and one command:

```powershell
npm.cmd run smoke:threat-live-api
```

The active packet should authorize setting `AURA_SENSE_LIVE_API=1` only for that command invocation.

Rationale: Threat-only exercises the zKill live path with the smaller provider surface: one provider, one route, one target, one backend scan, no ESI aggregate calls, no cache/ETag complexity, no operator/private inputs. Passive should follow as a separate packet after Threat proves the shared HTTP/request-log artifact path under live zKill conditions.

Do not run both lanes in one first live smoke. Combining them would blur provider/rate-limit failure attribution and make ESI cache/ETag behavior compete with first zKill readiness evidence.

## Blockers, Recommended Hardening, And Optional Improvements

Blockers before Threat-only default Jita live smoke: none found, provided the future packet uses the strengthened authorization and stop conditions above.

Recommended before Passive live smoke: align Passive refusal artifact with Threat by adding `live_io_enabled: false`, `no_live_call: true`, and `requestLogs: []`. This is an audit clarity improvement, not evidence that the current Passive refusal path calls live providers.

Recommended before any Threat override smoke: require active-packet authorization to name target text and resolved kind, or add a script-level allowlist/default-only mode for live smoke.

Optional improvements:

- Include a `cleared_live_env_expected: true` note or post-run env check instruction in future live packets.
- Include endpoint-family summaries beside request logs so reviewers can classify routes without reading full endpoints.
- Add `no_raw_provider_bodies: true` to refusal and live artifacts as an explicit artifact-policy assertion.
- Add a one-line artifact classification banner to each smoke result.

## Verification Commands And Results

Required review-safe commands were run without setting `AURA_SENSE_LIVE_API=1`:

```powershell
npm.cmd run smoke:passive-live-api
```

Result: exited 0; refused and wrote `.tmp\passive-live-api-smoke\result.json`.

```powershell
npm.cmd run smoke:threat-live-api
```

Result: exited 0; refused and wrote `.tmp\threat-live-api-smoke\result.json`.

```powershell
npm.cmd run verify:protected-terms
```

Result: exited 0; no protected-word JSON updates or renames were performed.
Observed output: working-set mode scanned 1 file, reported 0 warning-only items, and confirmed advisory evidence only.

```powershell
git status --short --branch
```

Result after creating this review artifact: branch `main...origin/main [ahead 1]`; untracked review artifact `workspace/SecEngHS38-m12b-live-api-security-review.md` present.

`verify:all` was not run because this was a review-only packet and no code/runtime behavior was changed.

## Boundary Confirmation

Confirmed:

- Did not set `AURA_SENSE_LIVE_API=1`.
- Did not run live zKill calls.
- Did not run live ESI calls.
- Did not run live EVE log ingestion.
- Did not inspect private/operator EVE log folders.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not change code or provider semantics.
- Did not change renderer UI/face behavior.
- Did not create Lab, adapter, display, or bridge-contract work.
- Did not run operator gamelog smoke.
- Did not perform Combat Witness calibration.
- Did not perform raw fixture intake.
- Did not inspect clipboard content.
