# Current Workspace Packet

Status: Active
Updated: 2026-05-24
Owner: Overseer planning, Dev execution

## Coordination State

Active milestone: None - bounded post-Milestone-14 prototype
Current runway: Passive Telemetry Bridge State Readout prototype
Latest closed milestone: Milestone 14 - Back-Page Threat Intel UX
Latest accepted closure: `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`
Accepted UI/UX mapping: `workspace/SenseUIUXHS01-passive-telemetry-bridge-state-readout.md`
Overseer review: `workspace/OverseerHS01-passive-telemetry-readout-mapping-review.md`
Current executor: Dev
Current focus: renderer-only Passive Telemetry readout prototype using existing snapshot fields
Expected output: `workspace/DevHS01-passive-telemetry-readout-prototype.md`

## Purpose

This is the only active executable packet for AURA-Sense.

The UI/UX mapping for a Passive Telemetry Bridge State Readout has been accepted for a narrow Dev runway. This is a Sense-local renderer presentation prototype. It is not a Lab/Core adapter, not shared doctrine, and not a contract rename.

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

## Runway Objective

Implement the Passive Telemetry readout prototype in the renderer using existing `passive.telemetry.snapshot` fields only.

The prototype should improve Passive Telemetry's compact presentation by making status, provider/sample basis, freshness/age, and gaps more legible without changing backend contracts or provider behavior.

## Ordered Runway

1. Passive readout copy and state mapping:
   - map `fresh` to `Fresh context`
   - map `stale` to `Stale context`
   - map `partial` to `Partial sample`
   - keep `blocked` as `Live IO blocked`
   - keep `degraded` as `Degraded`
   - map no current-system observation to `No observation`
   - avoid generic `NO DATA`, `CURRENT`, `AGED`, and `FALLBACK` as user-facing copy
2. Compact readout layout:
   - keep Passive Telemetry in the existing glance/diagnostics surfaces
   - do not add a large front-page card
   - preserve Combat Witness visual priority
   - keep system, kills, jumps, ratio, and one concise provider/sample state visible
   - keep long details in the existing diagnostics panel or tooltip-level detail
3. Provider/sample basis:
   - preserve zKill sample count, ESI ship kills/jumps, capped, partial, stale, blocked, and degraded distinctions
   - show `Capped sample` near sample/basis when `zkill.capped` is true
   - show `Static lookup` or `Local lookup` only when the snapshot supports it through resolver/source fields
   - prefer calmer user-facing copy like `Provider state` or `Sample state` where appropriate, but do not rename code identifiers just for terminology preference
4. Boundary preservation:
   - do not change `passive.telemetry.snapshot` shape
   - do not rename bridge APIs, IPC channels, service commands, payload fields, CSS/test identifiers, or provider clients
   - do not call zKill, ESI, filesystem, parser, watcher, or runtime modules from the renderer
   - do not merge Passive Telemetry with Combat Witness, Threat Intel, or Clipboard Acquisition
5. Verification and smoke:
   - extend renderer shell checks for the accepted Passive readout copy/state expectations
   - extend Electron visual smoke state coverage if selector/text states change
   - run all required verification commands
6. Handoff:
   - update Evidence and Dev Handoff in this packet
   - create `workspace/DevHS01-passive-telemetry-readout-prototype.md`
   - recommend accept/redirect and note any remaining risks

## Guardrails

- Renderer presents; backend owns truth.
- Passive Telemetry remains current-system context.
- Do not turn Passive Telemetry into Threat Intel.
- Do not imply complete system awareness.
- Do not present zKill/ESI sample data as durable evidence.
- Do not import Atlas evidence, watch, report, storage, or assessment semantics.
- Do not import Lab fixtures or Lab product semantics.
- Do not create shared Aura doctrine.
- Do not broaden into Combat Witness, Threat Intel, Clipboard Acquisition, Core, Atlas, or Lab work.
- Do not run live provider smoke unless explicitly authorized by the human.
- Do not run manual shortcut validation.
- Do not use archived docs/gap as active queues.

## Stop Conditions

Return to chat before continuing if:

- implementation requires changing Passive Telemetry backend contracts or provider behavior
- renderer would need to compute Passive truth instead of presenting snapshot fields
- `blocked`, `partial`, `degraded`, `unavailable`, `stale`, and `fresh` cannot remain distinct
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
