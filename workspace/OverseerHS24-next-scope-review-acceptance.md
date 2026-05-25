# Overseer HS24 - Next Scope Review Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer
Reviewed handoff: `workspace/EngTestHS23-next-scope-review.md`

## Decision

Accepted.

HS23 identifies a good Sense-local next scope while Lab-facing presentation work remains parked:

```txt
deterministic provider fault-injection hardening
```

This is a suitable next packet because it strengthens backend truth and state boundaries without requiring Lab, UI redesign, live providers, manual validation, or adapter work.

## Accepted Scope

Open M18:

```txt
Provider Fault-Injection Hardening
```

Expected Dev output:

```txt
workspace/DevHS25-provider-fault-injection-hardening.md
```

## Accepted Requirements

- Add a fixture-only `verify:provider-faults` command.
- Test Passive Telemetry and Threat Intel provider failures separately.
- Keep live IO blocked distinct from provider failure.
- Preserve no scan, no observation, stale context, partial sample, capped sample, degraded, and failed semantics.
- Use injected fakes, deterministic clocks, and snapshot assertions.
- Add the new deterministic verifier to `verify:all`.
- Update testing/current-state documentation.

## Guardrails

- Do not run live provider smoke.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not adopt a Lab face.
- Do not implement adapter work.
- Do not create additional Lab-facing display requests.
- Do not touch renderer behavior unless a defect forces a separate scoped packet.
- Do not import Atlas historical proof, storage, or assessment semantics.

## Next State

`workspace/current.md` should open a bounded M18 Dev runway for provider fault-injection hardening.
