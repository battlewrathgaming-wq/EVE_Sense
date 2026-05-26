# Current Workspace Packet

Status: Active
Updated: 2026-05-26
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: M12H - Clipboard service-command I/O gate hardening
Source of intent: `workspace/SecEngHS48-m12-operator-io-ingestion-assurance-review.md` accepted by `workspace/OverseerHS49-m12h-operator-io-ingestion-assurance-acceptance.md`
Latest accepted slice: M12G Clipboard Acquisition mode and gate-separation hardening
Latest review input: `workspace/SecEngHS48-m12-operator-io-ingestion-assurance-review.md`
Latest Overseer acceptance: `workspace/OverseerHS49-m12h-operator-io-ingestion-assurance-acceptance.md`
Latest accepted closure: `workspace/OverseerHS47-m12g-clipboard-gate-separation-acceptance.md`
Latest Dev handoff: `workspace/DevHS46-m12g-clipboard-mode-gate-separation-hardening.md`
Latest M12G acceptance: `workspace/OverseerHS47-m12g-clipboard-gate-separation-acceptance.md`
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
Current status: Open for narrow hardening before any live/manual operator I/O smoke
Expected output: `workspace/DevHS50-m12h-clipboard-service-io-gate-hardening.md`

## Active Runway

M12 remains the active/gated envelope for live/manual validation and tactical calibration. M12H is a pre-live hardening packet only. It does not authorize live/manual smoke.

Problem to fix:

- The global `Control+\` shortcut path blocks before reading clipboard content when Threat I/O is off.
- The exposed `threat.clipboard.arm` and `threat.clipboard.capture` service-command paths currently call Clipboard Acquisition directly.
- Clipboard Acquisition can read clipboard content internally when arm/capture are invoked without explicit text.
- Because those commands are reachable through preload, backend I/O authority must be enforced before those service-command paths can read clipboard content.

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

M12G accepted:

- Global shortcut immediate capture is documented/verified as explicit operator-invited behavior.
- Focused/windowed acquisition without payload still ignores unchanged pre-arm clipboard content.
- A 10 second / 5 entry in-memory fingerprint cache suppresses recent duplicate captures without storing raw clipboard history.
- Operator I/O gate-separation verification now proves Passive jump-triggered context remains independent from Clipboard Acquisition and Threat scan state.
- Future live/manual operator smoke artifact redaction expectations are documented.
- Threat Intel target text is capped at 256 characters.

## Runway Shape

Ordered Dev runway:

1. Read the accepted review and acceptance:
   - `workspace/SecEngHS48-m12-operator-io-ingestion-assurance-review.md`
   - `workspace/OverseerHS49-m12h-operator-io-ingestion-assurance-acceptance.md`
2. Trace current Clipboard Acquisition command paths:
   - global shortcut path
   - `threat.clipboard.arm`
   - `threat.clipboard.capture`
   - preload exposure
   - `readClipboard` injection
3. Enforce Threat I/O gate checks on all Clipboard Acquisition service-command paths before any clipboard read.
4. Return the existing blocked Clipboard Acquisition snapshot shape, or an equivalent compatible blocked shape, when Threat I/O is off.
5. Preserve accepted I/O-on behavior:
   - global `Control+\` may immediately capture current valid clipboard content
   - focused/windowed acquisition without payload baselines, listens briefly, ignores unchanged pre-arm content, seals, and cools down
   - duplicate suppression remains fingerprint-only, 10 seconds, 5 entries
6. Add deterministic verification proving service-command `arm` and `capture` do not call clipboard read while Threat I/O is off.
7. Align primary Threat blocked-code verification with production Threat gate behavior, or explicitly make the primary Threat verifier lane-agnostic while preserving provider-fault verification as the lane-code oracle.
8. Add or clarify a redaction-safe operator I/O smoke artifact shape before any future live/manual operator smoke.
9. Run required verification and write the Dev handoff.

## Acceptance Criteria

M12H is complete when:

- Clipboard service-command `arm` and `capture` paths cannot read clipboard content while Threat I/O is off.
- The blocked service-command result is compatible with existing Clipboard Acquisition blocked state handling.
- Global shortcut I/O-off behavior remains no-read.
- Global shortcut I/O-on immediate capture remains supported.
- Focused/windowed no-payload acquisition still baselines and ignores unchanged pre-arm clipboard content.
- Seal/cooldown behavior is unchanged.
- Duplicate suppression remains fingerprint-only and bounded.
- Threat blocked-code verification no longer implies Passive gate ownership in the primary Threat verifier.
- Future operator I/O smoke has a redaction-safe artifact shape or documentation that avoids raw private paths, raw gamelog lines, raw clipboard targets, screenshots, renderer output, Lab/adaptor output, calibration data, fixture intake, product claims, and raw provider bodies unless a future packet explicitly authorizes them.
- The Dev handoff names exact files changed, behavior changed, verification run, and any residual risk.

## Required Verification

Run:

```powershell
npm.cmd run verify:threat-intel
npm.cmd run verify:clipboard-race
npm.cmd run verify:operator-io-gates
npm.cmd run verify:provider-faults
npm.cmd run verify:all
```

If any verification fails, stop and record the failure in the Dev handoff. Do not run live/manual fallback checks.

## Stop Conditions

Stop and return to Overseer/Human if:

- the fix requires reading real clipboard content
- the fix requires live/manual smoke
- the fix requires changing bridge names, IPC names, payload names, persistence, schemas, or lane ownership
- the fix would merge Passive and Threat gates
- the fix would weaken global shortcut immediate capture while I/O is on
- the fix would store raw clipboard history
- verification reveals unrelated behavioral drift outside the M12H scope

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

## Candidate Next M12 Slices

Parked while M12H is active:

1. Live/manual operator I/O smoke with redacted artifacts and explicit Human authorization.
2. Manual shortcut feel/OS accelerator validation, only if explicitly authorized.
3. Combat Witness calibration from accepted real samples.
4. Raw repair/healing fixture intake from accepted samples.

## Work Record

M12H opened after security/engineering review found a pre-live authority-boundary gap.

Accepted handoff:

```txt
workspace/SecEngHS48-m12-operator-io-ingestion-assurance-review.md
workspace/OverseerHS49-m12h-operator-io-ingestion-assurance-acceptance.md
```

## Handoff Requirements

Dev must create:

```txt
workspace/DevHS50-m12h-clipboard-service-io-gate-hardening.md
```

The handoff must include:

- files changed
- service-command gate trace
- clipboard read/no-read proof
- behavior preserved
- verification commands and results
- residual risks, if any
