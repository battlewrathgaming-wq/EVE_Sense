# Current Workspace Packet

Status: Active
Updated: 2026-05-24
Owner: Overseer planning, Dev execution

## Coordination State

Active milestone: Milestone 14 - Back-Page Threat Intel UX
Roadmap source: `docs/roadmap/milestone-14-back-page-threat-intel-ux.md`
Sequence: HS02
Previous accepted handshake: `workspace/DevHS01-sense-back-page-threat-intel-foundation.md`
Current executor: Dev
Current focus: back-page Threat Intel polish and validation readiness
Expected output: `DevHS02-sense-back-page-polish-validation.md`
Archive target on milestone completion: `workspace/complete/milestone-14/`

## Purpose

This is the only active executable work packet for AURA-Sense.

Milestone 14 HS01 is accepted. It established the back-page Threat Intel foundation, display-first acquisition bar, gateway marker, local target-type controls, clipboard visual grammar, persistent latest scan report, and Electron visual smoke coverage.

HS02 should polish the back-page experience and close remaining verification gaps without broadening provider behavior or turning the report into historical storage.

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
- `workspace/DevHS01-sense-back-page-threat-intel-foundation.md`
- `workspace/OverseerHS01-sense-back-page-foundation-review.md`

## Runway Objective

Finish the operator-facing polish needed for Milestone 14 acceptance while keeping the scope renderer/presentation-oriented.

This packet should improve clarity, density, state copy, and validation coverage for the back-page Threat Intel workflow. It should not expand providers, add historical storage, or create shared presentation abstractions.

## Ordered Runway

1. Report density and basis copy:
   - make the persistent report easier to scan in the compact overlay
   - keep target, target type, status, provider basis, sample/cap/partial/blocked/failure state, and message copy visible
   - avoid `Threat score`, `Complete result`, `Primary hostile`, or evidence-storage language
2. Gateway and target type affordance polish:
   - make `\` gateway state legible without implying clipboard authority
   - keep target type cycling visibly teal/local
   - ensure `Alt+\` changes target type without scanning
   - ensure `Ctrl+\` is the only active clipboard/API chord in the focused path
3. Clipboard authority visual cleanup:
   - ensure amber interior appears only during active clipboard authority
   - ensure cooldown uses amber exterior only
   - ensure listener-active visuals snap off on capture/search start
   - remove or rename stale `peek` implementation terms if doing so is low risk and improves maintainability
4. Verification and smoke completeness:
   - extend renderer shell/static checks for final copy/state expectations
   - extend Electron smoke state coverage if selectors or visual states change
   - run focused checks, `npm.cmd run verify:all`, and `npm.cmd run smoke:electron`
5. Milestone closure recommendation:
   - recommend whether Milestone 14 is ready for closure review
   - if live/manual shortcut feel remains unproven, recommend a separate gated operator-validation packet rather than folding it into `verify:all`

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

- the polish requires changing the accepted front/back split
- global shortcut behavior requires live/operator validation
- a renderer change would weaken boundary checks
- a report persistence choice starts resembling Atlas evidence storage
- current-state, roadmap, observed code, and this packet disagree materially
- the working tree contains overlapping unknown changes in files needed for this runway

## Verification Required

Run focused verification added or affected by the work, then run:

```powershell
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Likely focused commands, depending on files touched:

```powershell
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:threat-intel
```

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
