# DevHS25: Provider Fault-Injection Hardening

Status: Complete - ready for Overseer review
Date: 2026-05-25
Role: AURA-Sense Dev

## Request

Execute the active M18 Dev runway for deterministic provider fault-injection hardening. This packet was test hardening first: add `verify:provider-faults`, wire it into `verify:all`, update docs, and only touch service code if the new verifier exposed a real bug.

## Files Changed

- `scripts/verify-provider-fault-injection.js`
- `package.json`
- `scripts/verify-all.js`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/current-state/current-implementation.md`
- `workspace/current.md`
- `workspace/DevHS25-provider-fault-injection-hardening.md`

## Provider Fault Cases Covered

- Passive zKill injected timeout/error becomes `degraded` and preserves bounded failure code/message metadata.
- Passive ESI injected failure becomes `degraded` and preserves bounded failure code/message metadata.
- Passive malformed zKill and ESI provider data becomes `partial`, not `fresh`, and preserves failure counts.
- Passive stale ESI cache / ETag revalidation failure remains visible through a degraded backend snapshot with `ESI_REVALIDATION_FAILED`.
- Threat zKill HTTP timeout becomes `failed` with `HTTP_TIMEOUT`.
- Threat zKill 429 and 500 responses become `failed` with bounded `THREAT_INTEL_SCAN_FAILED` metadata and provider status in the message.
- Threat zKill invalid JSON becomes `failed` with `HTTP_INVALID_JSON`.
- Threat malformed zKill refs become `partial`, not `succeeded`, and preserve malformed/failure metadata.
- Passive live IO blocked does not call ESI or zKill and remains distinct from provider failure.
- Threat live IO blocked does not call zKill and remains distinct from provider failure, with the lane-specific `THREAT_LIVE_IO_BLOCKED` code when the gate is wired with that code.

## Implementation Defects Fixed

None. The new verifier passed against existing service/client behavior, so no service, runtime, renderer, IPC, payload, schema, lane-meaning, or provider runtime behavior was changed.

## Verification

Passed:

```powershell
npm.cmd run verify:provider-faults
npm.cmd run verify:http
npm.cmd run verify:passive-telemetry
npm.cmd run verify:threat-intel
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Observed results:

- `verify:provider-faults`: `provider fault injection verified`
- `verify:http`: `HTTP client verified`
- `verify:passive-telemetry`: `passive telemetry verified`
- `verify:threat-intel`: `threat intel verified`
- `verify:protected-terms`: completed in working-set discovery mode with warning-only items; no protected-word files or renames were changed.
- `verify:all`: `all checks verified`, including `provider fault injection verified`
- `git status --short --branch`: branch `main...origin/main` with expected modified verifier, package/full-suite wiring, docs, current-packet, and handoff files.

## Boundaries Preserved

- No live provider smoke.
- No manual shortcut validation.
- No real SDE refresh/download.
- No Lab face, adapter, display request, renderer, Electron, or UI work.
- No service/runtime behavior changes because the verifier did not expose a defect.
- No lane collapse between Combat Witness, Passive Telemetry, Threat Intel, and Clipboard Acquisition.

## Residual Risk

The verifier is fixture-only by design. It improves deterministic confidence for provider failure semantics but does not replace future explicitly authorized live provider validation.

