# OverseerHS01: Passive Telemetry Readout Mapping Review

Status: Accepted for bounded Dev runway
Date: 2026-05-24
Role: AURA-Sense Overseer
Reviewed artifact: `workspace/SenseUIUXHS01-passive-telemetry-bridge-state-readout.md`

## Verdict

The UI/UX mapping is accepted.

Passive Telemetry is the right first Sense lane for a Bridge State Readout trial because the existing snapshot already carries status, provider basis, sample/cap/partial flags, freshness, cache age, gate state, and failure metadata without requiring contract changes.

## Accepted Decisions

- First trial lane: Passive Telemetry.
- Fresh label: `Fresh context`.
- Stale label: `Stale context`.
- Partial label: `Partial sample`.
- Blocked label: `Live IO blocked`.
- Unavailable label: `No observation` when no current system has been observed.
- Provider-pulse user-facing copy may become `Provider state` or `Sample state`, but code identifiers should not be renamed for terminology preference alone.
- `Static lookup` is acceptable only when `currentSystem.resolverSource` or equivalent snapshot evidence supports it.

## Preserved Boundaries

- Renderer remains presentation-only.
- Passive Telemetry remains current-system context, not Threat Intel.
- Existing contracts, IPC channels, payload names, service names, CSS/test identifiers, and provider behavior remain stable.
- Lab readout language may shape the interface only where Sense meaning remains traceable.
- Atlas evidence/storage/watch semantics remain out of scope.

## Dev Readiness

Ready for a narrow Dev packet.

The Dev packet should update Passive Telemetry renderer presentation only, using existing `passive.telemetry.snapshot` fields. It should not run live provider smoke or manual validation.

## Required Verification For Dev

```powershell
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Electron smoke is required because the accepted work changes renderer visual state expectations.

