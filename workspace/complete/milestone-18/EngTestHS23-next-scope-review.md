# EngTest HS23 - Next Scope Review

Status: Complete
Date: 2026-05-25
Role: Engineering/Test scope reviewer
Packet: Read-only deterministic provider fault-injection hardening review

## 1. Current Packet Check

Reviewed `workspace/current.md`.

Current state is idle:

- Active milestone: none; M17 render/frame performance assurance is complete.
- Current runway: none.
- Current executor: none.
- Expected output in `workspace/current.md`: none.
- M17 accepted outcomes remain product-window bounds persistence, deterministic Frame verification, guarded visual smoke bounds restoration, renderer shell guard verification, and passing Electron visual smoke.

This review is therefore a Human-requested advisory artifact. It does not create Dev authorization, does not open a runway, and does not edit `workspace/current.md`.

Note: the Human asked to check `current.mb`; no such workspace file is present. This review treated that as `workspace/current.md`.

## 2. Files Reviewed

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/00-dot-protocol.md`
- `workspace/overseer.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`
- `scripts/verify-all.js`
- `scripts/verify-http-client.js`
- `scripts/verify-passive-telemetry.js`
- `scripts/verify-threat-intel.js`
- `scripts/verify-diagnostics-policy.js`
- `src/services/httpClient.js`
- `src/passive/liveIoGate.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/main/main.js`

## 3. Current Provider Failure Checks Summary

Existing failure checks are real but distributed across generic HTTP, Passive Telemetry, and Threat Intel checks.

`npm.cmd run verify:http` currently covers:

- HTTP timeout rejection with `HTTP_TIMEOUT`
- task cancellation through an HTTP request
- successful JSON parsing and request logging
- invalid JSON rejection with `HTTP_INVALID_JSON`
- 429 retry exhaustion and rate-limit diagnostic visibility
- 500 error visibility

`npm.cmd run verify:passive-telemetry` currently covers:

- Passive live IO blocked state
- blocked live IO preventing zKill and ESI calls
- unresolved system degraded state
- zKill synthetic fetch failure becoming Passive `degraded`
- zKill malformed refs becoming Passive `partial`
- stale partial context preserving partial metadata
- ESI system activity cache reuse
- ESI ETag revalidation
- ESI ETag revalidation failure visibility

`npm.cmd run verify:threat-intel` currently covers:

- Threat request validation and target resolution
- scoped zKill route construction
- malformed zKill refs becoming partial metadata
- non-array zKill normalization becoming partial/failure metadata
- blocked live IO preventing zKill calls
- successful deliberate scan and clipboard scan path basics

The open gap is not absence of provider failure testing. The open gap is the lack of one deterministic lane-level provider fault matrix that proves timeout, malformed, 429/500, stale-cache, and ETag failures remain visible through Passive Telemetry and Threat Intel snapshots without live network.

## 4. Smallest Useful Deterministic Hardening Scope

Recommended next bounded Dev scope, if Overseer opens it:

Add a fixture-only provider fault-injection verifier and wire it into offline verification.

Suggested command:

```powershell
npm.cmd run verify:provider-faults
```

Minimum useful checks:

| Area | Required cases |
| --- | --- |
| Passive zKill provider fault | injected timeout/error rejects and Passive snapshot becomes `degraded` with provider failure code/message preserved |
| Passive ESI provider fault | injected kills or jumps failure becomes Passive `degraded` with ESI failure code/message preserved |
| Passive malformed provider data | non-array zKill or ESI data becomes `partial`, not `fresh`, and failure counts remain visible |
| Passive stale cache / ETag | stale ESI revalidation failure remains visible and does not masquerade as fresh context |
| Threat zKill provider fault | injected timeout/429/500/invalid JSON becomes Threat scan `failed` with bounded failure metadata |
| Threat malformed provider data | non-array or malformed refs becomes `partial`, not `succeeded`, and capped/partial/failure metadata remains visible |
| Live IO gate split | blocked Passive does not call ESI/zKill; blocked Threat does not call zKill; app-wired Threat gate semantics preserve `THREAT_LIVE_IO_BLOCKED` where covered |

Keep this scope strictly deterministic: injected clients, fake fetch functions, deterministic clocks, and snapshot assertions only.

## 5. Files Likely Touched By A Future Dev Packet

Likely:

- `scripts/verify-provider-fault-injection.js`
- `package.json`
- `scripts/verify-all.js`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/current-state/current-implementation.md`

Possible, only if the new verifier reveals a real defect:

- `src/passive/passiveTelemetryService.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/services/httpClient.js`

Avoid touching renderer, Lab-facing display request files, adapter files, IPC/payload semantics, or live smoke tooling unless a later Human/Overseer packet explicitly opens that scope.

## 6. Fixture And Stub Strategy

Use injected fakes only:

- `HttpClient` with fake `fetchImpl` for timeout, invalid JSON, 429, 500, and retry behavior.
- Passive service injected with fake `esiActivityClient` and `zkillClient`.
- Threat service injected with fake `zkillClient`.
- deterministic `now()` functions and fixed `fetchedAt` values.
- explicit fake error codes such as `HTTP_TIMEOUT`, `HTTP_INVALID_JSON`, `ESI_REVALIDATION_FAILED`, `SYNTHETIC_ZKILL_FAILURE`, and lane-specific provider-failure codes.

Assertions should target backend snapshots and compact provider metadata, not renderer text.

Do not call real zKill, ESI, SDE, clipboard, Electron, local EVE logs, or operator-private files.

## 7. Verification Commands

Required after a future implementation packet:

```powershell
npm.cmd run verify:provider-faults
npm.cmd run verify:http
npm.cmd run verify:passive-telemetry
npm.cmd run verify:threat-intel
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

`npm.cmd run smoke:electron` is not required unless renderer-visible behavior or Electron-window behavior changes.

No live provider smoke, manual shortcut validation, or real SDE refresh/download should be run for this packet.

## 8. Guardrails And Non-Goals

- Do not implement code from this review alone.
- Do not open or rewrite `workspace/current.md` from this review.
- Do not run live provider smoke.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not adopt a Lab face.
- Do not create or implement a Sense adapter.
- Do not create additional Lab-facing display requests.
- Do not treat archived `docs/gap` files as active task queues.
- Do not collapse Combat Witness, Passive Telemetry, Threat Intel, and Clipboard Acquisition boundaries.
- Do not treat `Live IO blocked` as a provider failure.
- Do not treat provider failure, no scan, no observation, stale context, partial sample, or capped sample as interchangeable.
- Do not import Atlas evidence/history/storage semantics into Sense provider fault language.

## 9. Recommended Acceptance Criteria

A future Dev packet should be accepted only if:

- A deterministic provider fault-injection verification command exists.
- The command is fixture-only and does not use live network, Electron, local EVE logs, private operator state, or SDE assets.
- Passive Telemetry and Threat Intel provider failures are tested separately.
- Live IO blocked state remains distinct from provider failure.
- Passive zKill, Passive ESI, and Threat zKill failure paths preserve bounded failure code/message metadata.
- Malformed provider responses produce partial/degraded semantics as appropriate and do not become complete/fresh truth.
- Stale ESI cache and ETag failure behavior remains visible.
- The new command is included in `verify:all` only if it remains deterministic and offline.
- Documentation updates close or narrow the provider fault-injection gap without opening hidden task queues.

## 10. Recommended Next Owner

Overseer should decide whether to open a bounded Dev runway from this review.

Recommended executor for implementation, if opened: Dev.

Recommended expected Dev artifact name if opened:

`workspace/DevHS23-provider-fault-injection-hardening.md`
