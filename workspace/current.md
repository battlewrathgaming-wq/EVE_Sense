# Current Workspace Packet

Status: Active - UI/UX Advisory
Updated: 2026-05-24
Owner: Overseer continuity, UI/UX advisory execution

## Coordination State

Active milestone: None
Current advisory track: Passive Telemetry Bridge State Readout prototype mapping
Latest closed milestone: Milestone 14 - Back-Page Threat Intel UX
Latest accepted closure: `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`
Current executor: UI/UX reviewer
Current focus: map Passive Telemetry bridge-fed state into a Sense-safe readout prototype before Dev
Expected output: `workspace/SenseUIUXHS01-passive-telemetry-bridge-state-readout.md`

## Purpose

This is the only active executable packet for AURA-Sense.

The human approved the idea of adapting Lab's Bridge State Readout pattern for Sense and then asked whether this should go to Dev. Overseer decision: not Dev yet. First produce a UI/UX-only mapping artifact so Dev does not invent terminology, state mapping, or compact readout behavior while coding.

This packet applies the accepted authority split:

```txt
Sense owns internal -> Bridge meaning.
Lab owns Bridge -> Interface presentation terminology where Sense meaning is preserved and no Human/Sense conflict exists.
Shared spelling does not imply shared meaning.
```

## Required Reading

Boot and current coordination:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/prompts.md`

Sense authority and accepted/advisory context:

- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/roadmap/milestone-14-back-page-threat-intel-ux.md`
- `workspace/SenseAdoptionHS01-aura-lab-presentation-mechanics-review.md`
- `workspace/complete/milestone-13/OverseerHS03-milestone-13-closure.md`
- `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`

Shared terminology authority:

- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\TerminologyAuthorityRuleset-2026-05-24.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\Sense-Terminology-Boundary-Requirements-2026-05-24.md`

Source inspection targets for UI/UX mapping only:

- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/liveIoGate.js`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `scripts/verify-passive-telemetry.js`
- `scripts/verify-renderer-shell.js`
- `src/main/preload.js`

## Objective

Produce a Sense-owned UI/UX mapping for a Passive Telemetry Bridge State Readout prototype.

The mapping must define:

1. Passive Telemetry source fields from existing `passive.telemetry.snapshot`.
2. Sense-owned internal -> Bridge meanings.
3. Lab-owned Bridge -> Interface labels that are allowed only when they preserve Sense meaning.
4. Exact mapping for `fresh`, `stale`, `partial`, `blocked`, `degraded`, and `unavailable`.
5. Compact layout behavior for the existing tactical viewport.
6. Which source/basis/age/gap fields are primary vs secondary diagnostics.
7. Visual smoke states Dev must cover later.
8. Non-goals and stop conditions for any later Dev packet.

## Required Artifact

Create:

```txt
workspace/SenseUIUXHS01-passive-telemetry-bridge-state-readout.md
```

Mark it:

```txt
Status: UI/UX advisory mapping, not implementation authority
```

Required sections:

1. Role and boundary.
2. Files reviewed.
3. Repo-verified Passive Telemetry facts.
4. Authority model applied.
5. Source field inventory.
6. Internal -> Bridge meaning table.
7. Bridge -> Interface label table.
8. State mapping for:
   - `fresh`
   - `stale`
   - `partial`
   - `blocked`
   - `degraded`
   - `unavailable`
9. Primary readout fields.
10. Secondary diagnostics/gaps/warnings.
11. Compact layout notes.
12. Visual smoke expectations.
13. Terms that must remain Sense-owned.
14. Lab labels that are allowed, adapted, or blocked.
15. Risks and non-goals.
16. Recommended next role/action.
17. Draft Dev runway only if UI/UX recommends Dev next.

## Guardrails

- Do not implement code.
- Do not create a Dev runway in this pass unless the artifact explicitly recommends one as a draft.
- Do not rename contracts, payloads, services, IPC channels, CSS classes, or tests.
- Do not import Lab fixtures.
- Do not create shared Aura doctrine.
- Do not touch Core, Atlas, or Lab project files.
- Do not make live API calls.
- Do not run live provider smoke.
- Do not run manual shortcut validation.
- Do not turn Passive Telemetry into Threat Intel.
- Do not imply complete system awareness.
- Do not present zKill/ESI sample data as durable evidence.
- Do not collapse `blocked`, `partial`, `degraded`, `unavailable`, `stale`, and `fresh`.
- Keep renderer presentation-only and backend-owned truth intact.

## Expected Direction

Starting stance:

- Use Passive Telemetry as the first trial lane.
- Prefer `Fresh` or `Recent context` only with lane/source context.
- Prefer `Stale context` over generic `AGED`.
- Preserve `Partial sample`, `Live IO blocked`, `Degraded`, and `Unavailable` distinctions.
- Treat `FALLBACK` cautiously; prefer `Local only` or `Static lookup` only when an existing snapshot field supports that meaning.
- Avoid generic `NO DATA`; use lane-specific absence wording such as `No observation` or `No provider sample`.
- Consider whether `Provider pulse` should become calmer provider/sample state wording in the UI/UX mapping, but do not rename it in code.

## Verification

No code verification is required for this UI/UX artifact.

Do not run `npm.cmd run verify:all` or Electron smoke unless the human changes the task into implementation.

For a future Dev packet, expected verification should include:

```powershell
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:all
```

If renderer visual states change, future Dev should also run:

```powershell
npm.cmd run smoke:electron
```

## Stop Conditions

Return to chat before continuing if:

- source inspection shows Passive Telemetry fields cannot support the proposed readout without contract changes
- the mapping requires live provider behavior changes
- the mapping requires a shared Lab/Core doctrine decision
- the mapping would make renderer state authoritative
- `blocked`, `partial`, `degraded`, `unavailable`, `stale`, or `fresh` cannot be kept distinct
- Lab-owned interface terminology conflicts with Sense preserve-exact terms and needs Human decision

## Evidence

Not yet recorded.

## Handoff

UI/UX reviewer fills this in when complete:

- artifact created:
- repo facts reviewed:
- authority decisions applied:
- implementation changes:
- recommended next action:
- Dev runway recommended:
- human decisions needed:
