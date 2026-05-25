# Current Workspace Packet

Status: Idle
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: None
Source of intent: M12C completed the first Threat-only live zKill smoke; M12D hardened future live-smoke request metadata capture and aligned Passive refusal artifacts; M12E completed the first Passive-only live API smoke
Latest accepted slice: M12E Passive-only live API smoke
Latest accepted closure: `workspace/OverseerHS43-m12e-passive-live-api-smoke.md`
Latest Dev handoff: `workspace/DevHS41-m12d-live-smoke-request-log-hardening.md`
Latest M12E live smoke record: `workspace/OverseerHS43-m12e-passive-live-api-smoke.md`
Latest M12C live smoke record: `workspace/OverseerHS40-m12c-threat-live-api-smoke.md`
Latest M12B acceptance: `workspace/OverseerHS39-m12b-live-api-security-review-acceptance.md`
Latest M12B security/engineering handoff: `workspace/SecEngHS38-m12b-live-api-security-review.md`
Latest M12A acceptance: `workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md`
Latest M12A Dev handoff: `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
Latest M12 prep acceptance: `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
Latest M12 gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
Current executor: None
Current status: Idle after M12E acceptance
Expected output: None

## Resting State

M12 remains the active/gated envelope for live/manual validation and tactical calibration, but no executable work is open right now.

M12E accepted:

- Passive-only live API smoke ran once under explicit Human authorization.
- `AURA_SENSE_LIVE_API=1` was scoped to the command invocation and cleared afterward.
- Default Passive fixture path observed a `navigation.jump` from `Perimeter` to `Jita`.
- ESI `system_kills`, ESI `system_jumps`, and zKill Jita system context returned bounded successful request metadata.
- The standard artifact was written to `.tmp\passive-live-api-smoke\result.json`.

M12D remains accepted:

- smoke-local verbose HTTP request metadata capture for future authorized live smoke artifacts
- normal runtime diagnostics unchanged
- Passive refusal artifact aligned with Threat refusal artifact fields
- deterministic fake-HTTP verification of successful smoke request metadata capture

M12C's first live Threat smoke remains the only authorized Threat live provider execution so far. No additional live calls are authorized by this resting state.

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

1. Live operator gamelog smoke playbook execution.
2. Combat Witness calibration from accepted real samples.
3. Raw repair/healing fixture intake from accepted samples.
4. Threat-only default Jita live smoke rerun only if the Human wants another live request-metadata confirmation.

## Work Record

Idle after Overseer acceptance.

Accepted handoff:

```txt
workspace/OverseerHS43-m12e-passive-live-api-smoke.md
```

## Handoff Requirements

None while idle.
