# OverseerHS45: M12F Operator I/O Readiness Review Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer

## Reviewed

- `workspace/current.md`
- `workspace/SecEngHS44-m12f-operator-io-readiness-gate-separation-review.md`
- `package.json`

## Acceptance

M12F operator I/O readiness and gate separation review is accepted.

The specialist answered the active packet with actual code/doc traces, separated verified facts from risks, and preserved the intended Sense rule:

```txt
Passive I/O wraps the operator flow.
Active I/O is explicitly invited.
Both may feed the same event spine.
They must not share the same gate.
Shared display/fixture treatment is not assumed.
```

## Accepted Findings

- Gamelog parser events fan out through the Combat Witness runtime observer path.
- Passive Telemetry observes `navigation.jump` events from that fanout and does not depend on Clipboard Acquisition state.
- Threat Intel scans are invoked through Clipboard Acquisition/global shortcut flow, focused renderer keyboard flow, or service/preload calls. M12G should not assume a mouse search-button UX.
- Passive and Threat live provider gates are separate backend gate instances.
- Parser jumps were not found to trigger Threat scans.
- Clipboard/search was not found to be a prerequisite for Passive current-system observation.
- Gamelog path containment and append-only watcher behavior are already meaningfully hardened.
- Diagnostics avoid raw private line content by hashing/sanitizing.

## Human Design Clarification

The global shortcut path can read current clipboard content before arming and pass it as `clipboardText`, causing immediate capture/scan for non-empty pre-existing clipboard content.

Human clarified this behavior is intended.

Human later clarified that, for the M12 operator flow, Active means the operator permission action currently bound to `Ctrl+\`. Do not assume a click-driven search-button workflow; clicking the Sense window can disrupt the primary game. Search-field delivery is the result of the permission action, not a mouse interaction requirement.

Overseer disposition:

- Do not remove immediate global-shortcut capture as a bug.
- Treat it as an intentional explicit-invitation mode: pressing the global shortcut may consume the current clipboard target immediately when IO authority allows it.
- Preserve the focused/windowed acquisition behavior separately: arming without a provided payload should establish a baseline and ignore unchanged pre-arm content.
- Align docs and verification so the two active acquisition modes are not mistaken for one rule.
- Keep the operator-facing path keyboard-first and hands-free; do not introduce or require search-button interaction in M12G.

## Accepted Dev Needs

Proceed to Dev hardening/documentation for:

1. Documenting and verifying the intended two-mode Clipboard Acquisition behavior.
2. Deterministic coverage that global shortcut immediate capture remains explicit, IO-gated, and sealed.
3. Deterministic coverage that focused/windowed acquisition still ignores unchanged pre-arm clipboard content.
4. Gate-separation coverage proving parser `navigation.jump` can update Passive without invoking Threat scan.
5. Coverage or documentation proving Clipboard Acquisition/global shortcut or equivalent service scan does not gate Passive observation.
6. Redaction-safe future operator smoke artifact expectations.
7. Evaluation of a small rolling Clipboard Acquisition cache as duplicate-suppression/throttle control, without creating hidden clipboard history or display/fixture semantics.

## Deferred Or Parked

- Lane-specific visible IO controls are not required for the next Dev packet. The shared UI toggle is a trust/clarity risk, but backend gates remain separate.
- Threat scan target length limiting is a useful follow-up if it fits cleanly, but it is not the core M12G purpose.
- Display/fixture convergence remains out of scope.
- Live/manual operator I/O smoke remains unauthorized.

## Verification Evidence From Specialist

The specialist reported these non-live checks passed:

```powershell
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:gamelog-watcher-chaos
npm.cmd run verify:passive-telemetry
npm.cmd run verify:threat-intel
npm.cmd run verify:clipboard-race
npm.cmd run verify:diagnostics
```

No live EVE folder ingestion, private/operator folder inspection, clipboard content capture, manual shortcut validation, live API smoke, `AURA_SENSE_LIVE_API=1`, or real SDE refresh was performed.

## Next Packet

Open M12G Dev hardening for Clipboard Acquisition mode alignment and gate-separation verification.
