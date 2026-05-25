# Current Workspace Packet

Status: Idle
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: None
Source of intent: Human chose M12 live/manual validation first, then calibration; M12A completed the refusal-to-live API transition readiness map without live provider execution
Latest accepted slice: M12A live API smoke transition readiness
Latest accepted closure: `workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md`
Latest Dev handoff: `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
Latest M12 prep acceptance: `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
Latest M12 gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
Current executor: None
Current status: Idle between M12 slices
Expected output: None

## Resting State

M12 remains the correct envelope for live/manual validation and tactical calibration, but no executable work is open right now.

M12A is accepted. Sense now has:

- refusal-first Passive and Threat live API smoke commands
- default-safe refusal artifacts under `.tmp`
- a durable transition readiness map at `docs/testing/live-api-smoke-transition-readiness.md`
- documented future live API provider routes, target bounds, artifact classification, minimum authorization wording, and stop conditions

The readiness map does not authorize live execution by itself.

## Preserved Guardrails

- Do not set `AURA_SENSE_LIVE_API=1` without a future active packet and explicit Human authorization.
- Do not run live zKill or ESI calls.
- Do not run live EVE log ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not combine live API smoke with operator gamelog smoke, Combat calibration, raw fixture intake, renderer, Lab, adapter, or display work unless a future packet explicitly opens that scope.
- Do not promote refusal records into live execution evidence.

## Candidate Next M12 Slices

Open only by Human/Overseer decision:

1. Authorized live API execution for Passive and/or Threat using `docs/testing/live-api-smoke-transition-readiness.md`.
2. Live operator gamelog smoke playbook execution using `docs/testing/live-operator-gamelog-smoke-playbook.md`.
3. Combat Witness calibration from accepted real samples.
4. Raw repair/healing fixture intake from accepted samples.

## Work Record

Idle after Overseer acceptance.

Accepted handoff:

```txt
workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md
```

## Handoff Requirements

None while idle.
