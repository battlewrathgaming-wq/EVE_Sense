# Current Workspace Packet

Status: Active
Updated: 2026-05-24
Owner: Overseer planning, Dev execution

## Coordination State

Active milestone: Milestone 14 - Back-Page Threat Intel UX
Roadmap source: `docs/roadmap/milestone-14-back-page-threat-intel-ux.md`
Sequence: HS01
Previous accepted handshake: Milestone 13 complete; handshakes archived under `workspace/complete/milestone-13/`
Current executor: Dev
Current focus: back-page Threat Intel composition and display-first acquisition bar foundation
Expected output: `DevHS01-sense-back-page-threat-intel-foundation.md`
Archive target on milestone completion: `workspace/complete/milestone-14/`

## Purpose

This is the only active executable work packet for AURA-Sense.

Milestone 13 is accepted complete. Milestone 14 now begins the back-page Threat Intel UX slice.

The first Milestone 14 runway should establish the overlay-native back-page composition and display-first Threat Intel acquisition surface without broadening provider behavior, adding Atlas persistence, or creating Lab/Core/shared presentation adapter work.

## Required Reading

- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-14-back-page-threat-intel-ux.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/schemas/hud-snapshot.md`
- `docs/features/clipboard-acquisition.md`

## Runway Objective

Begin Milestone 14 by reshaping Threat Intel toward an overlay-native back-page workflow while preserving the current backend-owned scan contract.

The front page should remain the live tactical read. The back page should become the deliberate Threat Intel review and acquisition surface. This packet should establish the layout/state foundation and verification hooks, not complete the whole milestone unless the work remains smaller than expected.

## Ordered Runway

1. Back-page composition foundation:
   - keep front page focused on travel/general telemetry, Combat Witness pressure/repair, incoming source/contact context, and only trust-affecting runtime health
   - move or stage Threat Intel search/report behavior as back-page first
   - preserve lane separation and backend-owned snapshots
   - do not trigger provider requests merely by opening/closing the back page
2. Display-first search/display bar:
   - convert the visible Threat Intel search surface into a display-first acquisition bar
   - remove visible/manual Search button intent as the primary overlay workflow
   - support idle target, listening/pulling, scanning, cooldown, and last captured target states
   - keep focused/manual entry available only as a fallback if needed by existing implementation
3. Gateway and target-type controls:
   - treat `\` as gateway/back-page context
   - keep `\ + CTRL` as clipboard acquire + scan
   - keep `\ + ALT` as target type cycle
   - ensure target type change is local classification only and does not scan
   - do not run scans on focus alone
4. Clipboard visual state grammar:
   - teal means ready/local interaction
   - amber interior means active clipboard authority
   - amber exterior means cooldown/temporary constraint
   - listener-active visuals must snap off on capture or scan start
   - Listening is a state, not a mode
5. Persistent report foundation:
   - render last Threat Intel scan report below the search/display bar
   - keep it stable until the next scan replaces it
   - keep provider/sample/cap/partial/blocked/failure basis visible and honest
   - do not turn the report into historical intelligence storage
6. Verification:
   - extend renderer/static or shell checks for display-first bar, target pill, gateway semantics, report persistence, and absence of renderer provider calls
   - run focused checks and then `npm.cmd run verify:all`
   - run `npm.cmd run smoke:electron` only if renderer/smoke behavior changes enough to require visual validation; if skipped, explain why

## Guardrails

- Renderer presents; backend owns truth.
- Keep this Sense-local.
- Do not create shared Aura doctrine.
- Do not create Lab/Core adapters or reusable bridge packages.
- Do not call zKill, ESI, fetch, filesystem, parser, watcher, or runtime modules from the renderer.
- Do not add manual background scans.
- Do not make search focus trigger a scan.
- Do not leave clipboard listening beyond the sealed acquisition window.
- Do not add Atlas persistence, reports, watch execution, evidence stores, or historical intelligence storage.
- Do not make cooldown look like active listening.
- Keep live provider smoke separate from `verify:all`.

## Stop Conditions

Return to chat before continuing if:

- the front/back split requires a product decision not already covered by the roadmap
- global shortcut behavior requires live/operator validation
- a renderer change would weaken boundary checks
- a report persistence choice starts resembling Atlas evidence storage
- current-state, roadmap, observed code, and this packet disagree materially
- the working tree contains overlapping unknown changes in files needed for this runway

## Verification Required

Run focused verification added or affected by the work, then run:

```powershell
npm.cmd run verify:all
```

Likely focused commands, depending on files touched:

```powershell
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:threat-intel
```

Conditionally run:

```powershell
npm.cmd run smoke:electron
```

Run Electron smoke if the shell/global shortcut behavior, visual smoke selectors, or substantive renderer visual states changed.

Do not run by default:

- live API smoke unless explicitly gated with operator approval
- manual operator smoke

## Evidence

Dev updates this before handoff.

Verification run:

```txt
Not yet run for this packet.
```

Files changed:

```txt
Not yet recorded.
```

Findings:

```txt
Not yet recorded.
```

Deferrals:

```txt
Not yet recorded.
```

## Dev Handoff

Dev fills this in when work is complete:

- completed tasks:
- tests added/updated:
- verification output:
- failures found:
- handshake created:
- remaining risk:

## Overseer Review

Overseer fills this in after Dev handoff:

- accepted / redirected:
- doctrine drift:
- architecture risk:
- state updates needed:
- next packet:
