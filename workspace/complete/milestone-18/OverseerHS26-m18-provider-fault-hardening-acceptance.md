# Overseer HS26 - M18 Provider Fault Hardening Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer
Reviewed handoff: `workspace/DevHS25-provider-fault-injection-hardening.md`

## Decision

Accepted.

The Dev packet completed the bounded M18 provider fault-injection hardening runway.

## Accepted Changes

- Added fixture-only `npm.cmd run verify:provider-faults`.
- Wired `verify:provider-faults` into `npm.cmd run verify:all`.
- Added deterministic provider fault checks for Passive Telemetry and Threat Intel.
- Updated the aggressive test harness matrix.
- Updated current implementation docs.

## Accepted Provider Fault Cases

- Passive zKill injected timeout/error becomes `degraded` and preserves bounded failure metadata.
- Passive ESI injected failure becomes `degraded` and preserves bounded failure metadata.
- Passive malformed zKill and ESI provider data becomes `partial`, not `fresh`, and preserves failure counts.
- Passive stale ESI cache / ETag revalidation failure remains visible through a degraded backend snapshot.
- Threat zKill HTTP timeout becomes `failed` with `HTTP_TIMEOUT`.
- Threat zKill 429 and 500 responses become `failed` with bounded failure metadata.
- Threat zKill invalid JSON becomes `failed` with `HTTP_INVALID_JSON`.
- Threat malformed zKill refs become `partial`, not `succeeded`, and preserve malformed/failure metadata.
- Passive live IO blocked does not call ESI or zKill and remains distinct from provider failure.
- Threat live IO blocked does not call zKill and remains distinct from provider failure.

## Verification

Overseer reran:

```powershell
npm.cmd run verify:provider-faults
npm.cmd run verify:http
npm.cmd run verify:passive-telemetry
npm.cmd run verify:threat-intel
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Results:

- `verify:provider-faults`: passed.
- `verify:http`: passed.
- `verify:passive-telemetry`: passed.
- `verify:threat-intel`: passed.
- `verify:protected-terms`: passed, warning-only. No protected-word files, renames, or terminology authority changes were made.
- `verify:all`: passed and includes `provider fault injection verified`.
- `git status --short --branch`: expected modified packet files before acceptance commit.

## Scope Preserved

- No live provider smoke.
- No manual shortcut validation.
- No real SDE refresh/download.
- No Lab face, adapter, display request, renderer, Electron, or UI work.
- No service/runtime behavior changes were needed.
- Combat Witness, Passive Telemetry, Threat Intel, and Clipboard Acquisition boundaries remain distinct.

## Residual Risk

The new verifier is fixture-only by design. It improves deterministic confidence for provider failure semantics but does not replace future explicitly authorized live provider validation.

## Next State

M18 can close.

`workspace/current.md` should return to idle with no active executable runway.
