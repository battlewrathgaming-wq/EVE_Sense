# Current Workspace Packet

Status: Active
Updated: 2026-05-24
Owner: Overseer planning, Dev execution

## Coordination State

Active milestone: None - bounded post-Milestone-14 prototype
Current runway: Sense Face Refinement Pass - Combat Witness + Passive Telemetry
Latest closed milestone: Milestone 14 - Back-Page Threat Intel UX
Latest accepted closure: `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`
Accepted UI/UX mapping: `workspace/SenseUIUXHS01-passive-telemetry-bridge-state-readout.md`
Overseer review: `workspace/OverseerHS01-passive-telemetry-readout-mapping-review.md`
Latest Dev handoff: `workspace/DevHS01-passive-telemetry-readout-prototype.md`
Latest prototype acceptance: `workspace/OverseerHS02-passive-telemetry-readout-prototype-review.md`
Latest face advisory: `workspace/UIUXHS02-sense-face-presentation-advisory.md`
Latest Lab advisory input: `F:\Projects\AURA- Lab\workspace\SenseImportAdvisoryHS65-lab-presentation-adoption.md`
Latest Overseer acceptance: `workspace/OverseerHS03-sense-face-presentation-adoption-review.md`
Current executor: Dev
Current focus: renderer-only Combat Witness and Passive Telemetry first-read face refinement
Expected output: `workspace/DevHS02-sense-face-refinement-pass.md`

## Purpose

This is the only active executable packet for AURA-Sense.

The Passive Telemetry readout prototype has been accepted. A new Sense-owned face presentation advisory has also been reviewed and accepted as bounded renderer direction.

This runway adapts selected Lab presentation ideas through Sense-owned meaning. It is not a Lab import, not a Core adapter, not shared doctrine, not a contract rename, and not a broad redesign.

Authority split:

```txt
Sense owns internal -> Bridge meaning.
Lab owns Bridge -> Interface presentation terminology where Sense meaning is preserved and no Human/Sense conflict exists.
Shared spelling does not imply shared meaning.
```

## Required Reading

Boot and coordination:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/prompts.md`

Accepted direction:

- `workspace/UIUXHS02-sense-face-presentation-advisory.md`
- `workspace/OverseerHS03-sense-face-presentation-adoption-review.md`
- `workspace/SenseUIUXHS01-passive-telemetry-bridge-state-readout.md`
- `workspace/OverseerHS01-passive-telemetry-readout-mapping-review.md`
- `workspace/SenseAdoptionHS01-aura-lab-presentation-mechanics-review.md`
- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`

Implementation targets:

- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `src/main/main.js` only if Electron visual smoke fixture states need selector/text updates
- `scripts/verify-renderer-shell.js`

Reference-only source facts:

- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/liveIoGate.js`
- `scripts/verify-passive-telemetry.js`
- `src/main/preload.js`

External advisory input, not Sense authority:

- `F:\Projects\AURA- Lab\workspace\SenseImportAdvisoryHS65-lab-presentation-adoption.md`

## Runway Objective

Implement a compact Sense Face Refinement Pass for Combat Witness and Passive Telemetry using existing renderer surfaces and existing backend-owned snapshot fields only.

The prototype should make the current Combat Witness pressure/repair readout and Passive Telemetry context easier to understand at a glance without changing backend contracts, provider behavior, bridge names, or lane meaning.

## Ordered Runway

1. Combat Witness first-read hierarchy:
   - keep Combat Witness as the primary lane
   - make `Incoming DPS`, `Repair HPS`, and `Observed balance` readable as the first pressure/repair read
   - keep observed source and observed weapon visible as compact context
   - preserve recent/observed/rolling-window wording
   - do not present repair balance as safe, stable, surviving, breaking, or tank state
2. Passive Telemetry compact support:
   - preserve the accepted Passive readout labels: `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, and `No observation`
   - keep Passive in the glance strip or equivalent compact support surface
   - keep system, kills, jumps, ratio, and one concise provider/sample basis visible
   - show `Static lookup` or `Local lookup` only when resolver/source fields support it
   - avoid generic `NO DATA`, `CURRENT`, `AGED`, and `FALLBACK` as user-facing Passive copy
3. Face composition:
   - preserve the existing lane structure and overlay density
   - do not add a large front-page card or full app redesign
   - demote diagnostics visually without hiding source, freshness, basis, gaps, warnings, live IO, watcher, or provider state
   - keep Threat Intel and Clipboard Acquisition mostly unchanged except for visual consistency at touch points
   - keep Threat Intel as deliberate scan/back-page behavior and Clipboard Acquisition as a short authority window
4. Boundary preservation:
   - do not change `passive.telemetry.snapshot` shape
   - do not change `combat.witness.snapshot` shape
   - do not rename bridge APIs, IPC channels, service commands, payload fields, CSS/test identifiers, provider clients, or backend state fields
   - do not call zKill, ESI, filesystem, parser, watcher, or runtime modules from the renderer
   - do not merge Passive Telemetry with Combat Witness, Threat Intel, or Clipboard Acquisition
5. Verification and smoke:
   - extend renderer shell checks for the accepted Combat Witness and Passive face expectations
   - extend Electron visual smoke state coverage if selector/text/layout states change
   - keep narrow viewport containment covered
   - run all required verification commands
6. Handoff:
   - update Evidence and Dev Handoff in this packet
   - create `workspace/DevHS02-sense-face-refinement-pass.md`
   - recommend accept/redirect and note any remaining risks

## Guardrails

- Renderer presents; backend owns truth.
- Passive Telemetry remains current-system context.
- Do not turn Passive Telemetry into Threat Intel.
- Do not turn Combat Witness into Atlas evidence, historical proof, or predictive combat assessment.
- Do not imply complete system awareness.
- Do not present zKill/ESI sample data as durable evidence.
- Do not import Atlas evidence, watch, report, storage, or assessment semantics.
- Do not import Lab fixtures or Lab product semantics.
- Do not import Lab neutral state labels where Sense lane-specific labels are more precise.
- Do not create shared Aura doctrine.
- Do not broaden into Combat Witness, Threat Intel, Clipboard Acquisition, Core, Atlas, or Lab work.
- Do not run live provider smoke unless explicitly authorized by the human.
- Do not run manual shortcut validation.
- Do not use archived docs/gap as active queues.

## Stop Conditions

Return to chat before continuing if:

- implementation requires changing Passive Telemetry backend contracts or provider behavior
- implementation requires changing Combat Witness backend contracts, parser behavior, or rolling-window computation
- renderer would need to compute Passive truth instead of presenting snapshot fields
- renderer would need to compute Combat Witness truth instead of presenting snapshot fields
- `blocked`, `partial`, `degraded`, `unavailable`, `stale`, and `fresh` cannot remain distinct
- visual changes crowd or demote Combat Witness priority
- Lab/Core/shared doctrine decisions become necessary
- live provider smoke appears necessary

## Verification Required

Run:

```powershell
npm.cmd run verify:combat-witness
npm.cmd run verify:combat-bridge
npm.cmd run verify:combat-runtime
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:protected-terms
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Do not run by default:

- live provider smoke
- manual operator shortcut validation
- real SDE refresh/download

## Evidence

Dev updates this before handoff.

Verification run:

```txt
npm.cmd run verify:renderer-shell
npm.cmd run verify:combat-witness
npm.cmd run verify:combat-bridge
npm.cmd run verify:combat-runtime
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:protected-terms
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Files changed:

```txt
src/renderer/index.html
src/renderer/app.js
src/renderer/styles.css
src/main/main.js
scripts/verify-renderer-shell.js
workspace/current.md
workspace/DevHS02-sense-face-refinement-pass.md
```

Findings:

```txt
Implemented renderer-only Sense face refinement.
Combat Witness now keeps Combat Witness primary while showing Incoming DPS, Repair HPS, Observed balance, and 15s rolling observed window copy in the first read.
Observed source and observed weapon compact context remain visible through the existing front tiles and diagnostics.
Passive Telemetry compact support was preserved with accepted labels and basis behavior unchanged.
Renderer shell and Electron visual smoke now assert the new Combat Witness face copy/selectors.
The active-packet Lab advisory path was read at F:\Projects\AURA- Lab\workspace\SenseImportAdvisoryHS65-lab-presentation-adoption.md, and Lab remote-consumer conformance guidance was copied locally as workspace/LabRemoteConsumerConformanceHS66.md.
Protected-term discovery completed in warning-only mode with 900 warnings and no renames/protected-word JSON changes after handoff files were included. The optional --quarantine sniff remains available for low-confidence Lab quarantine terms.
```

Deferrals:

```txt
No live provider smoke, manual shortcut validation, or real SDE refresh/download was run.
No backend contracts, bridge APIs, IPC channels, service commands, payload fields, provider clients, parser/watcher/runtime behavior, or snapshot shapes were changed.
```

## Dev Handoff

Dev fills this in when work is complete:

- completed tasks: Compact Combat Witness first-read hierarchy updated; Passive Telemetry accepted compact readout preserved; face composition kept within existing overlay structure; boundary-preserving renderer-only implementation completed.
- tests added/updated: `scripts/verify-renderer-shell.js` now checks Combat Witness rolling observed window, Incoming DPS, Repair HPS, Observed balance, signed observed balance rendering, and bounded detail copy. `src/main/main.js` Electron smoke now asserts `#pressure-window` and `#net-pressure-label` across first-light/regression/narrow states.
- verification output: All required commands passed: `verify:combat-witness`, `verify:combat-bridge`, `verify:combat-runtime`, `verify:passive-telemetry`, `verify:renderer-shell`, `verify:renderer-boundary`, `verify:renderer-boundary-adversarial`, `verify:protected-terms`, `verify:all`, and `smoke:electron`.
- failures found: None during final verification. Protected-term discovery remains warning-only and reported 900 warning-only items after handoff files were included; optional `--quarantine` mode remains available for low-confidence Lab quarantine terms.
- handshake created: `workspace/DevHS02-sense-face-refinement-pass.md`
- remaining risk: Gauge center copy is deliberately compact and smoke-covered, but future visual review may still tune exact typography. Combat Witness still inherits existing internal `is-stable` CSS class naming, intentionally not renamed because this packet protects CSS/test identifiers.

## Overseer Review

Overseer fills this in after Dev handoff:

- accepted / redirected:
- doctrine drift:
- architecture risk:
- state updates needed:
- next packet:
