# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: M12F - Operator I/O readiness and gate separation review
Source of intent: Human/Overseer agreed that the next M12 hinge is local operator I/O: Passive gamelog-driven flow should wrap the operator without disruption, while Active clipboard/search flow should remain explicitly invited, time-gated, and sealed
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
Current executor: Security/Engineering specialist
Current status: Active review packet; no implementation or live/manual I/O execution
Expected output: `workspace/SecEngHS44-m12f-operator-io-readiness-gate-separation-review.md`

## Review Objective

Produce a read-only Security/Engineering review of local operator I/O readiness before any live operator gamelog smoke, clipboard manual validation, or Dev hardening.

Core rule:

```txt
Passive I/O wraps the operator flow.
Active I/O is explicitly invited.
Both may feed the same event spine.
They must not share the same gate.
Shared display/fixture treatment is not assumed.
```

The review should trace how gamelog watcher/parser events and clipboard/search acquisition enter Sense, how they are gated, what events/snapshots they emit, and what must be preserved before any future live/manual I/O smoke.

## Runway Shape

- current packet: M12F read-only Security/Engineering review of operator I/O readiness and gate separation.
- likely next packet if accepted: bounded Dev hardening for any concrete gate, privacy, containment, diagnostics, or verification gaps found by M12F.
- follow-up packet if clean: deterministic/offline verification of the hardening, then Human decision on whether to authorize live/manual operator I/O smoke.
- stop or Human decision point: any live/manual EVE folder use, clipboard capture, provider calls, manual shortcut validation, display/adapter convergence, or product decision about Passive/Active gate behavior.

This M12F packet is one review step in a larger validation runway, not milestone completion by itself.

## Context To Preserve

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

Human discussion to preserve:

- Passive aggregate/context should open from parser-observed system jump.
- Passive aggregate/context must not depend on clipboard listening or active scan state.
- Active scan should open from Clipboard Acquisition or explicit search only.
- Clipboard Acquisition has a listening window and seal behavior; this should be reviewed as a safety/trust boundary.
- Both surfaces can feed the same internal observation/event channel, but their activation gates remain separate.
- Returns must not automatically feed the same fixtures/display assumptions; this is adjacent display/adapter work and should not be decided inside M12F.

## Required Read

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-assets.md`
- `workspace/critical/critical-terms.md`
- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/features/clipboard-acquisition.md`
- `src/combat/`
- `src/passive/`
- `src/threat/`
- `src/main/main.js`
- `src/main/preload.js`
- `package.json`

## Ordered Runway

1. Confirm cwd, repo state, and that this is a read-only review packet.
2. Map gamelog I/O from configured folder/path policy through watcher/parser into emitted combat/navigation events.
3. Map Passive Telemetry trigger behavior from parser-observed system jump into Passive aggregate/context update.
4. Map Clipboard Acquisition and explicit search trigger behavior, including listening window, cooldown/seal behavior, shortcuts, and scan dispatch.
5. Identify the shared internal observation/event channel or equivalent fanout points, if present.
6. Confirm gate separation:
   - Passive gamelog/jump-driven flow is hands-free and not bound to Clipboard Acquisition.
   - Active clipboard/search flow is deliberate, time-gated, and sealed.
   - Parser jumps do not trigger active Threat scans.
   - Clipboard/search does not become a prerequisite for Passive aggregate/context.
7. Review containment/privacy posture:
   - expected `EVE/logs/Gamelogs` structure and path containment
   - append-only/read scope
   - no broad private log storage
   - clipboard payload limits and no indefinite background capture
   - sanitized diagnostics/artifact expectations
8. Identify risks, missing tests, or Dev hardening needs before live/manual operator I/O smoke.
9. Keep display/fixture convergence out of scope except as a risk note.
10. Write `workspace/SecEngHS44-m12f-operator-io-readiness-gate-separation-review.md`.

## Required Output

The handoff must include:

1. Files reviewed.
2. Current operator I/O model.
3. Gamelog watcher/parser trace.
4. Passive Telemetry trigger trace from system jump.
5. Clipboard Acquisition/search trigger trace.
6. Shared event-spine/fanout points, if any.
7. Gate separation findings.
8. Clipboard listening window and seal findings.
9. Containment/privacy findings.
10. Display/fixture boundary risks that are explicitly out of M12F scope.
11. Bugs, gaps, or ambiguity.
12. Required Dev hardening before live/manual operator I/O smoke, if any.
13. Suggested verification for a future Dev packet.
14. Stop conditions for future live/manual operator I/O validation.
15. Clear recommendation: proceed to Dev hardening, proceed to live/manual smoke, pause for design decision, or park.

## Acceptance Criteria

M12F review is complete when:

- gamelog I/O, Passive jump-triggered aggregate/context, Clipboard Acquisition, and explicit search triggers are traced from code/docs
- the review states whether Passive and Active gates are currently separated
- the review states whether Passive remains hands-free and non-disruptive
- the review states whether Clipboard Acquisition remains explicit, time-bounded, and sealed
- path containment and private-content handling risks are identified
- future live/manual operator I/O smoke boundaries are concrete enough for Overseer to open or reject the next packet
- no code, contracts, bridge payloads, IPC channels, schemas, runtime behavior, UI copy, fixtures, displays, or Dev runway are changed by the specialist
- no live EVE folders, clipboard content, screenshots, provider calls, manual shortcuts, or private/operator paths are inspected or captured

## Preserved Guardrails

- Do not set `AURA_SENSE_LIVE_API=1` without a future active packet and explicit Human authorization.
- Do not run additional live zKill or ESI calls without a future active packet.
- Do not use `AURA_SENSE_THREAT_LIVE_TARGET` unless a future packet explicitly names target text and resolved kind.
- Do not run live EVE log ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not capture clipboard content.
- Do not execute live/manual I/O smoke.
- Do not implement code.
- Do not rename source-owned terms.
- Do not change bridge contracts, IPC, payloads, persistence, schemas, services, or backend behavior.
- Do not combine live API smoke with operator gamelog smoke, Combat calibration, raw fixture intake, renderer, Lab, adapter, or display work unless a future packet explicitly opens that scope.
- Do not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims.
- Do not promote a bounded live smoke into broad tactical/product claims.
- Do not decide display/fixture convergence inside this packet.
- Do not run terminology/protected-term checks unless the review discovers terminology, adapter, display-copy, bridge-facing label, source-owned meaning, or critical-asset work that requires a future packet. This packet is read-only I/O readiness review.

## Non-Goals

- Do not run the live operator gamelog smoke playbook.
- Do not run clipboard/manual shortcut validation.
- Do not run Passive or Threat live API smoke.
- Do not create raw repair/healing fixtures.
- Do not calibrate Combat Witness metrics.
- Do not decide Lab/adapter/display treatment.
- Do not create a broad security review beyond operator I/O readiness.

## Stop Conditions

Return to Overseer/Human if:

- the code requires live/private operator folders to answer the review
- clipboard content or private paths would need to be captured
- Passive and Active gates appear coupled in a way that requires product direction
- a shared event spine cannot be identified from code/docs
- display/fixture assumptions are required to answer I/O safety
- live/manual execution appears necessary
- contract or runtime changes seem necessary before the review can be complete

## Work Record

Active review packet opened by Overseer.

Expected handoff:

```txt
workspace/SecEngHS44-m12f-operator-io-readiness-gate-separation-review.md
```

## Handoff Requirements

The specialist handoff must restate the request answered and provide a recommendation for the next bounded M12 move.
