# Current Workspace Packet

Status: Idle
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: None
Source of intent: Human chose live API execution as the next M12 direction, requested security review first, and M12B review accepted Threat-only default Jita as the recommended first live packet shape
Latest accepted slice: M12B live API security review before authorized execution
Latest accepted closure: `workspace/OverseerHS39-m12b-live-api-security-review-acceptance.md`
Latest security/engineering handoff: `workspace/SecEngHS38-m12b-live-api-security-review.md`
Latest M12A acceptance: `workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md`
Latest M12A Dev handoff: `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
Latest M12 prep acceptance: `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
Latest M12 gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
Current executor: None
Current status: Idle after M12B security review acceptance
Expected output: None

## Resting State

M12 remains the active/gated envelope for live/manual validation and tactical calibration, but no executable work is open right now.

M12B accepted the security/engineering recommendation:

- first live API smoke should be Threat-only
- use default `system:Jita`
- do not set `AURA_SENSE_THREAT_LIVE_TARGET`
- set `AURA_SENSE_LIVE_API=1` only for the named command invocation, then clear it
- run only `npm.cmd run smoke:threat-live-api`
- write only the standard `.tmp` live smoke result artifact
- stop on the strengthened M12 live API stop conditions

The review and this resting state do not authorize live execution by themselves.

## Preserved Guardrails

- Do not set `AURA_SENSE_LIVE_API=1` without a future active packet and explicit Human authorization.
- Do not run live zKill or ESI calls.
- Do not use `AURA_SENSE_THREAT_LIVE_TARGET` unless a future packet explicitly names target text and resolved kind.
- Do not run live EVE log ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not combine live API smoke with operator gamelog smoke, Combat calibration, raw fixture intake, renderer, Lab, adapter, or display work unless a future packet explicitly opens that scope.
- Do not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims.
- Do not promote refusal records or a future bounded live smoke into broad tactical/product claims.

## Candidate Next M12 Slices

Open only by Human/Overseer decision:

1. Threat-only default Jita live API smoke using the M12B accepted authorization and stop-condition shape.
2. Passive refusal artifact alignment so Passive records `live_io_enabled: false`, `no_live_call: true`, and `requestLogs: []` before later Passive live smoke.
3. Passive-only live API smoke after Threat-only live smoke is reviewed.
4. Live operator gamelog smoke playbook execution.
5. Combat Witness calibration from accepted real samples.
6. Raw repair/healing fixture intake from accepted samples.

## Work Record

Idle after Overseer acceptance.

Accepted handoff:

```txt
workspace/OverseerHS39-m12b-live-api-security-review-acceptance.md
```

## Handoff Requirements

None while idle.
