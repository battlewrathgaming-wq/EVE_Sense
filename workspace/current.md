# Current Workspace Packet

Status: Idle
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: None - bounded post-Milestone-14 prototype
Current runway: None - Passive Telemetry Instrument Band prototype accepted
Latest closed milestone: Milestone 14 - Back-Page Threat Intel UX
Latest accepted closure: `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`
Latest Lab advisory input: `F:\Projects\AURA- Lab\workspace\OverseerHS71-m19-acceptance.md`
Latest Lab remote-consumer SLA receipt: `workspace/OverseerHS06-lab-remote-consumer-sla-review.md`
Latest M19 adoption review: `workspace/OverseerHS07-sense-m19-instrument-status-band-adoption-review.md`
Latest Passive band advisory: `workspace/UIUXHS03-passive-telemetry-instrument-band-advisory.md`
Latest Passive band advisory review: `workspace/OverseerHS08-passive-telemetry-instrument-band-advisory-review.md`
Latest Dev handoff: `workspace/DevHS03-passive-telemetry-instrument-band-prototype.md`
Latest prototype acceptance: `workspace/OverseerHS10-passive-telemetry-instrument-band-prototype-review.md`
Current executor: None
Current focus: Awaiting human direction
Expected output: None

## Purpose

There is no active executable packet for AURA-Sense.

The Passive Telemetry Instrument Band prototype has been accepted. It adapts Lab M19 presentation grammar through Sense-owned meaning. It is not a Lab import, not a backend contract, not a provider behavior change, not a shared Aura doctrine update, and not an Atlas/Core task.

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

Accepted Sense direction:

- `workspace/OverseerHS07-sense-m19-instrument-status-band-adoption-review.md`
- `workspace/UIUXHS03-passive-telemetry-instrument-band-advisory.md`
- `workspace/OverseerHS08-passive-telemetry-instrument-band-advisory-review.md`
- `workspace/SenseUIUXHS01-passive-telemetry-bridge-state-readout.md`
- `workspace/OverseerHS01-passive-telemetry-readout-mapping-review.md`
- `workspace/OverseerHS02-passive-telemetry-readout-prototype-review.md`
- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`

Reference-only implementation facts:

- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `src/main/main.js` only if Electron visual smoke fixture states need selector/text updates
- `scripts/verify-renderer-shell.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/liveIoGate.js`
- `scripts/verify-passive-telemetry.js`
- `src/main/preload.js`

External advisory input, not Sense authority:

- `F:\Projects\AURA- Lab\workspace\OverseerHS71-m19-acceptance.md`
- `F:\Projects\AURA- Lab\workspace\DevHS68-instrument-status-band-prototype.md`
- `F:\Projects\AURA- Lab\workspace\LabRemoteConsumerConformanceHS66.md`

## Runway Objective

Accepted.

Make Passive Telemetry easier to scan as a compact support instrument without changing what Passive Telemetry means.

The first read should communicate:

```txt
current system + Sense-owned Passive state + compact activity + provider/sample basis
```

The renderer must present backend-owned snapshot fields. It must not compute provider truth, fetch providers, mutate live IO policy, or create new Passive Telemetry semantics.

## Ordered Runway

Completed.

1. Inspect the current Passive Telemetry renderer structure before editing.
   - Identify the current Passive compact surface, readout state, provider pulse, diagnostics, and narrow layout behavior.
   - Prefer consolidating/refining the existing Passive compact surface over adding a large new panel.
2. Implement the closed Passive Telemetry Instrument Band.
   - keep `Passive Telemetry` visible as the lane label
   - make `currentSystem.label` the primary value when present
   - show `No observation` when no current system exists
   - keep kills, jumps, and ratio as compact support values
   - keep a Sense-owned state label visible and non-color-only
   - keep basis/freshness visible in one compact line or accessible through existing detail/diagnostics
   - show partial/capped/stale/blocked/degraded/no-observation conditions distinctly
3. Preserve Sense-owned copy.
   - keep `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, and `No observation`
   - use `Provider pending` only where existing renderer/snapshot behavior supports it
   - show `Static lookup` or `Local lookup` only when existing resolver/source fields support it
   - do not use Lab labels such as `CURRENT`, `UPDATING`, `AGED`, `UNAVAILABLE`, `FALLBACK`, or `NO DATA` as user-facing Passive copy
4. Add or preserve a compact detail path.
   - reuse existing diagnostics if that is the smallest safe path
   - detail should explain basis, freshness, sample count, cap, partial, live IO gate, and failure without raw/private provider payloads
   - do not add historical storage or Threat Intel scan detail
5. Preserve boundaries.
   - do not change `passive.telemetry.snapshot` shape
   - do not change Passive Telemetry backend, provider clients, live IO gate, cache behavior, IPC channels, service commands, payload fields, bridge APIs, or parser/watcher/runtime behavior
   - do not call zKill, ESI, filesystem, parser, watcher, provider clients, or runtime modules from the renderer
   - do not touch Atlas, Core, or Lab files
6. Verification and smoke.
   - update renderer shell checks for the new Passive band expectations
   - update Electron visual smoke only if selectors/text/layout assertions need to reflect the changed visible surface
   - keep narrow viewport containment covered
   - run all required verification commands below
7. Handoff.
   - update Evidence and Dev Handoff in this packet
   - create `workspace/DevHS03-passive-telemetry-instrument-band-prototype.md`
   - recommend accept/redirect and note any remaining risks

## Guardrails

- Renderer presents; backend owns truth.
- Passive Telemetry remains current-system context.
- Do not turn Passive Telemetry into Threat Intel.
- Do not imply continuous monitoring, complete system awareness, verified truth, Atlas evidence, or historical storage.
- Do not import Lab fixture semantics or Lab product semantics.
- Do not use Lab neutral state labels as Sense backend enums or user-facing Passive state copy.
- Do not create shared Aura doctrine.
- Do not broaden into Combat Witness, Threat Intel, Clipboard Acquisition, Core, Atlas, or Lab work.
- Do not run live provider smoke unless explicitly authorized by the Human.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not use archived docs/gap as active queues.

## Stop Conditions

Return to chat before continuing if:

- implementation requires changing Passive Telemetry backend contracts or provider behavior
- implementation requires changing `passive.telemetry.snapshot`
- renderer would need to compute Passive truth instead of presenting snapshot fields
- renderer would need to call zKill, ESI, filesystem, provider clients, parser, watcher, or runtime modules
- fresh, stale, partial, capped, blocked, degraded, no-observation, and pending states cannot remain distinct
- Lab labels would become Sense bridge fields, service names, payload names, CSS/test IDs, or product state enums
- visual changes crowd or demote Combat Witness priority
- Lab/Core/shared doctrine decisions become necessary
- live provider smoke appears necessary

## Verification Required

Run:

```powershell
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
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-shell
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
workspace/DevHS03-passive-telemetry-instrument-band-prototype.md
```

Findings:

```txt
Implemented a renderer-only closed Passive Telemetry instrument band inside the existing glance strip.
The band keeps `Passive Telemetry` visible, uses current system as the primary value, shows `No observation` when no current system exists, keeps kills/jumps/ratio as compact support values, and keeps Sense-owned state text visible.
The band adds a compact gap marker and appends freshness age to the existing provider/sample basis line when freshness age exists.
Existing diagnostics remain the detail path for Passive state, sample, activity, freshness, age, basis, gap, and pulse detail.
Renderer shell and Electron visual smoke now assert the Passive band label, primary value, gap marker, state chip, basis line, and narrow viewport visibility.
Protected-term discovery completed in warning-only mode with 126 warnings after review files were included; no renames or protected-word JSON changes were performed.
Overseer review corrected one cached-state display edge so cached Passive activity remains under `Fresh context` rather than surfacing as a separate user-facing state or `No observation`; verification was rerun after correction.
```

Deferrals:

```txt
No live provider smoke, manual shortcut validation, or real SDE refresh/download was run.
No backend contracts, snapshot shapes, provider behavior, bridge APIs, IPC channels, service commands, payload fields, parser/watcher/runtime behavior, Atlas/Core/Lab files, or shared doctrine were changed.
```

## Dev Handoff

Dev fills this in when work is complete:

- completed tasks: Closed Passive Telemetry instrument band implemented in the existing compact support surface; current system, Sense-owned state, compact activity, basis/freshness, and gap marker are visible without adding a large panel.
- tests added/updated: `scripts/verify-renderer-shell.js` now checks Passive band structure and renderer mappings. `src/main/main.js` Electron smoke now asserts Passive band label/system/gap visibility across unavailable, stale, degraded, blocked, partial/capped, and narrow states.
- verification output: All required commands passed: `verify:passive-telemetry`, `verify:renderer-shell`, `verify:renderer-boundary`, `verify:renderer-boundary-adversarial`, `verify:protected-terms`, `verify:all`, and `smoke:electron`.
- failures found: None during final required verification. Protected-term discovery remains warning-only and reported 117 warning-only items after handoff files were included.
- handshake created: `workspace/DevHS03-passive-telemetry-instrument-band-prototype.md`
- remaining risk: The band uses existing diagnostics as the detail reveal instead of adding a new Passive-only drawer; if Human wants a separate reveal affordance, that should be a new UI/UX/Dev packet. The visible `Instrument band` wording is kept out of product copy; it appears only in local aria/test/development identifiers.

## Overseer Review

Overseer fills this in after Dev handoff:

- accepted / redirected: Accepted. Dev completed the renderer-only Passive Telemetry Instrument Band prototype and produced `workspace/DevHS03-passive-telemetry-instrument-band-prototype.md`.
- doctrine drift: No doctrine drift found. Passive Telemetry remains current-system context, not Threat Intel, Atlas evidence, complete awareness, or historical storage. Lab labels were not imported as Sense user-facing state copy.
- architecture risk: Low. No backend contract, snapshot shape, provider behavior, bridge API, IPC channel, service command, payload field, parser/watcher/runtime behavior, Atlas/Core/Lab file, or shared doctrine change was introduced.
- review-time correction: Overseer corrected cached Passive activity display so it maps to `Fresh context` and does not show a literal no-observation/generic cached state in the first-glance band. The no-gap marker now falls back to a Sense state label instead of `None`.
- verification: Overseer reran `verify:passive-telemetry`, `verify:renderer-shell`, `verify:renderer-boundary`, `verify:renderer-boundary-adversarial`, `verify:protected-terms`, `verify:all`, and `smoke:electron`; all passed. Protected-term discovery remains warning-only with 126 items while these files are modified.
- state updates needed: Packet set idle with `workspace/OverseerHS10-passive-telemetry-instrument-band-prototype-review.md` as acceptance record.
- next packet: Human decision. Candidate follow-ups are visual-density tuning, a dedicated Passive detail reveal, or parking Sense until the next post-Milestone-14 direction.
