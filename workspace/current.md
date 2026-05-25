# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: M12G - Clipboard acquisition mode alignment and gate-separation verification
Source of intent: M12F accepted a read-only Security/Engineering review; Human clarified global shortcut immediate clipboard capture is intended, and that the operator-facing Active permission action is `Ctrl+\`, not a click-driven search-button workflow
Latest accepted slice: M12F operator I/O readiness and gate separation review
Latest accepted closure: `workspace/OverseerHS45-m12f-operator-io-readiness-review-acceptance.md`
Latest Dev handoff: `workspace/DevHS41-m12d-live-smoke-request-log-hardening.md`
Latest M12F review: `workspace/SecEngHS44-m12f-operator-io-readiness-gate-separation-review.md`
Latest M12F acceptance: `workspace/OverseerHS45-m12f-operator-io-readiness-review-acceptance.md`
Latest M12E live smoke record: `workspace/OverseerHS43-m12e-passive-live-api-smoke.md`
Latest M12C live smoke record: `workspace/OverseerHS40-m12c-threat-live-api-smoke.md`
Latest M12B acceptance: `workspace/OverseerHS39-m12b-live-api-security-review-acceptance.md`
Latest M12B security/engineering handoff: `workspace/SecEngHS38-m12b-live-api-security-review.md`
Latest M12A acceptance: `workspace/OverseerHS37-m12a-live-api-transition-readiness-acceptance.md`
Latest M12A Dev handoff: `workspace/DevHS36-m12a-live-api-smoke-transition-readiness.md`
Latest M12 prep acceptance: `workspace/OverseerHS35-m12-live-validation-harness-prep-acceptance.md`
Latest M12 gate trace: `workspace/OverseerHS33-m12-live-validation-gate-trace.md`
Current executor: Dev
Current status: Active Dev hardening/docs packet; no live/manual I/O execution
Expected output: `workspace/DevHS46-m12g-clipboard-mode-gate-separation-hardening.md`

## Dev Objective

Align Clipboard Acquisition docs/tests with the intended two-mode behavior, and add gate-separation verification before any live/manual operator I/O smoke.

Core rule:

```txt
Passive I/O wraps the operator flow.
Active I/O is explicitly invited.
Both may feed the same event spine.
They must not share the same gate.
Shared display/fixture treatment is not assumed.
```

Human design clarification:

- Global shortcut immediate capture of the current clipboard is intended.
- It is acceptable because pressing the global shortcut is an explicit operator invitation.
- It must remain IO-gated, visible through Clipboard Acquisition state, and sealed/cooldown-bounded.
- Focused/windowed acquisition without a provided payload remains different: it should establish a baseline, listen for a changed valid clipboard target, then seal/cool down.
- A small rolling acquisition cache may be useful as duplicate-suppression/throttle control, but it must not become hidden clipboard history, a shared Passive gate, or a display/fixture source.
- In this M12 operator-flow context, Active means the operator permission action currently bound to `Ctrl+\`. Do not assume a click/search-button workflow; clicking the Sense window can disrupt the primary game.
- Search-field delivery is a result of the permission action, not a requirement for mouse-driven interaction.

Dev should not remove global shortcut immediate capture. Dev should make the intended distinction explicit in docs and deterministic checks, while preserving Passive/Active gate separation.

## Runway Shape

- current packet: M12G Dev hardening/docs for Clipboard Acquisition mode alignment, gate-separation tests, and redaction-safe future smoke guidance.
- likely next packet if accepted: Overseer review of Dev handoff and decision whether operator I/O smoke is ready to authorize.
- follow-up packet if clean: Human decision on whether to authorize live/manual operator I/O smoke.
- stop or Human decision point: any live/manual EVE folder use, clipboard capture, provider calls, manual shortcut validation, display/adapter convergence, or product decision about Passive/Active gate behavior.

This M12G packet is hardening work only. It does not authorize live/manual operator I/O smoke.

## Context To Preserve

M12F accepted:

- Gamelog parser events fan out through the Combat Witness runtime observer path.
- Passive Telemetry observes `navigation.jump` events and does not depend on Clipboard Acquisition state.
- Threat Intel scans are invoked through Clipboard Acquisition/global shortcut flow, focused renderer keyboard flow, or service/preload calls. M12G should not assume a mouse search-button UX.
- Passive and Threat live provider gates are separate backend gate instances.
- Parser jumps were not found to trigger Threat scans.
- Clipboard/search was not found to be a prerequisite for Passive current-system observation.
- Human clarified global shortcut immediate capture of existing clipboard content is intended when explicitly invoked.
- The remaining gap is docs/tests alignment so immediate global shortcut capture and focused/windowed listening are not collapsed into one rule.

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
- Active scan should open from the operator permission action, currently `Ctrl+\`, or equivalent keyboard/service path. Do not require a mouse click.
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
- `workspace/SecEngHS44-m12f-operator-io-readiness-gate-separation-review.md`
- `workspace/OverseerHS45-m12f-operator-io-readiness-review-acceptance.md`
- `src/combat/`
- `src/passive/`
- `src/threat/`
- `src/main/main.js`
- `src/main/preload.js`
- `package.json`

## Ordered Runway

1. Confirm cwd, repo state, and active M12G packet.
2. Preserve global shortcut immediate capture as explicit operator-invited behavior.
3. Preserve blocked behavior: when IO authority is off, the shortcut must not read clipboard content.
4. Preserve focused renderer acquisition behavior and the 3 second listening / 5 second cooldown lifecycle.
5. Update existing tests that encode immediate shortcut capture if they conflict with the accepted trust boundary.
6. Add deterministic verification for the global shortcut or an equivalent extracted seam proving:
   - non-empty current clipboard content can be captured only through explicit shortcut invocation when IO authority allows it
   - focused/windowed acquisition without provided payload ignores unchanged pre-arm clipboard content
   - changed clipboard content during the focused/windowed listening window can still be captured
   - timeout/cooldown still seals the window
7. Add deterministic gate-separation verification proving:
   - parser `navigation.jump` can update Passive without invoking Threat scan
   - Clipboard Acquisition/global shortcut or equivalent service scan does not initialize or gate Passive current-system observation
8. Add or update documentation for future live/manual operator I/O smoke artifact redaction:
   - no raw private gamelog lines
   - no raw private local paths unless explicitly approved
   - no clipboard target text unless explicitly approved
   - hashes/status/counts/sanitized state only by default
9. Evaluate a small rolling Clipboard Acquisition cache for repeat-target suppression:
   - use it only as a bounded duplicate/throttle aid
   - avoid storing raw clipboard history beyond what is needed for the active/cooldown window
   - do not make it a Passive gate, display fixture, or durable record
   - implement if low-risk, otherwise document a deferred design note
10. Evaluate whether a direct Threat scan `targetText` length limit fits cleanly. Implement if low-risk, otherwise document as deferred in the handoff.
11. Run required offline verification.
12. Update Evidence and Dev Handoff sections in this file.
13. Write `workspace/DevHS46-m12g-clipboard-mode-gate-separation-hardening.md`.

## Required Output

The handoff must include:

1. Files reviewed.
2. Files changed.
3. Description of the two intended Clipboard Acquisition modes.
4. Gate-separation verification added or updated.
5. Redaction/artifact documentation added or updated.
6. Threat target length decision: implemented or deferred with reason.
7. Rolling cache decision: implemented or deferred with reason.
8. Verification commands and summarized results.
9. Boundary confirmation.
10. Residual risks and recommended next M12 move.

## Acceptance Criteria

M12G is complete when:

- global shortcut immediate capture is documented/verified as explicit operator-invited behavior
- global shortcut immediate capture remains IO-gated and sealed/cooldown-bounded
- focused/windowed acquisition without payload still ignores unchanged pre-arm clipboard content
- changed valid clipboard content during the focused/windowed listening window can still be captured
- any rolling cache, if implemented, is bounded and used only for duplicate suppression/throttle behavior
- IO-off global shortcut behavior still does not read clipboard content
- Clipboard Acquisition remains explicit, time-bounded, and sealed
- Passive jump-triggered aggregate/context remains independent from Clipboard Acquisition and Threat scan state
- parser `navigation.jump` does not trigger Threat scan
- Clipboard Acquisition/global shortcut or equivalent service scan does not become a prerequisite for Passive observation
- future live/manual operator smoke artifact redaction expectations are recorded
- no live/manual/private/provider execution is performed

## Preserved Guardrails

- Do not set `AURA_SENSE_LIVE_API=1` without a future active packet and explicit Human authorization.
- Do not run additional live zKill or ESI calls without a future active packet.
- Do not use `AURA_SENSE_THREAT_LIVE_TARGET` unless a future packet explicitly names target text and resolved kind.
- Do not run live EVE log ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not capture real clipboard content.
- Do not execute live/manual I/O smoke.
- Do not rename source-owned terms.
- Do not change bridge contracts, IPC, payloads, persistence, schemas, services, or backend behavior.
- Do not combine live API smoke with operator gamelog smoke, Combat calibration, raw fixture intake, renderer, Lab, adapter, or display work unless a future packet explicitly opens that scope.
- Do not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims.
- Do not promote a bounded live smoke into broad tactical/product claims.
- Do not decide display/fixture convergence inside this packet.
- Do not run terminology/protected-term checks unless the implementation changes terminology, adapter mappings, display copy, bridge-facing labels, source-owned meanings, or critical assets beyond the active packet.

## Non-Goals

- Do not run the live operator gamelog smoke playbook.
- Do not run clipboard/manual shortcut validation.
- Do not run Passive or Threat live API smoke.
- Do not create raw repair/healing fixtures.
- Do not calibrate Combat Witness metrics.
- Do not decide Lab/adapter/display treatment.
- Do not create a broad security review beyond operator I/O readiness.
- Do not redesign the renderer live IO toggle unless required to complete the accepted mode-alignment work.
- Do not make lane-specific UI controls unless explicitly opened later.
- Do not remove global shortcut immediate capture; Human clarified it is intended.

## Stop Conditions

Return to Overseer/Human if:

- the fix requires live/private operator folders to verify
- clipboard content or private paths would need to be captured
- Passive and Active gates appear coupled in a way that requires product direction
- display/fixture assumptions are required to answer I/O safety
- live/manual execution appears necessary
- contract or runtime changes seem necessary before the review can be complete
- aligning docs/tests would require changing the intended Clipboard Acquisition lifecycle

## Work Record

M12F accepted:

```txt
workspace/OverseerHS45-m12f-operator-io-readiness-review-acceptance.md
```

Active M12G Dev packet opened by Overseer.

Expected handoff:

```txt
workspace/DevHS46-m12g-clipboard-mode-gate-separation-hardening.md
```

## Evidence

Commands run without `AURA_SENSE_LIVE_API=1`, without live/manual operator folders, and without real clipboard capture:

```powershell
npm.cmd run verify:clipboard-race
npm.cmd run verify:threat-intel
npm.cmd run verify:operator-io-gates
npm.cmd run verify:all
```

Results:

- `verify:clipboard-race`: passed; clipboard acquisition race verified.
- `verify:threat-intel`: passed; threat intel verified.
- `verify:operator-io-gates`: passed; operator IO gate separation verified.
- `verify:all`: passed; all checks verified.

## Dev Handoff

Completed M12G:

- preserved global shortcut immediate capture as the explicit `Ctrl+\` permission action
- preserved focused/windowed acquisition baseline behavior
- added a 10 second / 5 entry in-memory fingerprint-only rolling cache for duplicate suppression
- added operator I/O gate-separation verification
- added direct Threat Intel target text length validation
- updated Clipboard Acquisition and future smoke redaction docs
- created `workspace/DevHS46-m12g-clipboard-mode-gate-separation-hardening.md`

## Handoff Requirements

Dev handoff must restate the request answered and provide a recommendation for the next bounded M12 move.
