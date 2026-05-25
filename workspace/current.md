# Current Workspace Packet

Status: Idle
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: None
Source of intent: Human explicitly authorized Threat-only default Jita live API smoke; M12C completed one live zKill Threat smoke and recorded the standard `.tmp` artifact summary
Latest accepted slice: M12C Threat-only default Jita live API smoke
Latest live smoke record: `workspace/OverseerHS40-m12c-threat-live-api-smoke.md`
Latest M12B acceptance: `workspace/OverseerHS39-m12b-live-api-security-review-acceptance.md`
Latest security/engineering handoff: `workspace/SecEngHS38-m12b-live-api-security-review.md`
Latest M12A acceptance: `workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md`
Latest M12A Dev handoff: `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
Latest M12 prep acceptance: `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
Latest M12 gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
Current executor: None
Current status: Idle after M12C Threat live API smoke
Expected output: None

## Resting State

M12 remains the active/gated envelope for live/manual validation and tactical calibration, but no executable work is open right now.

M12C completed:

- one authorized live Threat Intel smoke
- default `system:Jita`
- no `AURA_SENSE_THREAT_LIVE_TARGET`
- one command: `npm.cmd run smoke:threat-live-api`
- standard artifact: `.tmp\threat-live-api-smoke\result.json`
- result: `passed`
- live provider: zKill
- selected bounded sample: 3 killmail refs for Jita in the 1 hour lookback

The live smoke record is not a broad product claim and does not authorize additional live calls by itself.

## Preserved Guardrails

- Do not set `AURA_SENSE_LIVE_API=1` without a future active packet and explicit Human authorization.
- Do not run additional live zKill or ESI calls without a future active packet.
- Do not use `AURA_SENSE_THREAT_LIVE_TARGET` unless a future packet explicitly names target text and resolved kind.
- Do not run live EVE log ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not combine live API smoke with operator gamelog smoke, Combat calibration, raw fixture intake, renderer, Lab, adapter, or display work unless a future packet explicitly opens that scope.
- Do not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims.
- Do not promote a bounded live smoke into broad tactical/product claims.

## Candidate Next M12 Slices

Open only by Human/Overseer decision:

1. Review or harden the empty `requestLogs` observation from the successful Threat live artifact.
2. Passive refusal artifact alignment so Passive records `live_io_enabled: false`, `no_live_call: true`, and `requestLogs: []` before later Passive live smoke.
3. Passive-only live API smoke after any desired Threat artifact review.
4. Live operator gamelog smoke playbook execution.
5. Combat Witness calibration from accepted real samples.
6. Raw repair/healing fixture intake from accepted samples.

## Work Record

Idle after M12C live smoke record.

Accepted/live smoke record:

```txt
workspace/OverseerHS40-m12c-threat-live-api-smoke.md
```

## Handoff Requirements

None while idle.
