# Current Workspace Packet

Status: Active
Updated: 2026-06-01
Owner: Overseer

## Coordination State

Active milestone: M16 - Body-To-Adapter Readiness
Roadmap source: `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
Current runway: M16D - Passive Static Head Trial
Current executor: Dev
Current status: Open
Expected output: `workspace/DevHS67-passive-static-head-trial.md`

Latest accepted slice: M16B - Passive Adapter Landing Pad
Latest Dev handoff: `workspace/DevHS63-passive-adapter-landing-pad.md`
Latest Overseer acceptance: `workspace/OverseerHS64-passive-adapter-landing-pad-acceptance.md`
Latest relay review: `workspace/RelayReviewHS65-lab-static-starter-head.md`
Latest relay acceptance: `workspace/OverseerHS66-lab-static-starter-head-relay-review-acceptance.md`

Source records:

- `workspace/EngAuditHS58-backend-to-adapter-readiness-conformance.md`
- `workspace/OverseerHS59-backend-to-adapter-readiness-audit-acceptance.md`
- `workspace/EngSpecHS60-passive-telemetry-adapter-envelope.md`
- `workspace/TermAuditHS61-passive-adapter-wording-collision-review.md`
- `workspace/OverseerHS62-passive-adapter-envelope-acceptance.md`
- `workspace/DevHS63-passive-adapter-landing-pad.md`
- `workspace/OverseerHS64-passive-adapter-landing-pad-acceptance.md`
- `workspace/RelayReviewHS65-lab-static-starter-head.md`
- `workspace/OverseerHS66-lab-static-starter-head-relay-review-acceptance.md`
- `workspace/critical/critical-terms.md`

## Intent

Create a tiny offline proof that Sense's accepted Passive adapter output can be shaped toward a Lab-style static presentation head without adopting Lab meanings, touching runtime, or connecting a renderer face.

This is a demo/readiness trial, not product adoption.

Target flow:

```txt
Passive fixture snapshot
-> mapPassiveTelemetryAdapter(snapshot)
-> Sense-local static head trial mapper / fixture output
-> static inspection artifact or local demo surface
STOP
```

## Runway

1. Read the source records listed above before editing.
2. Inspect the existing Passive adapter verifier and fixture cases.
3. Add the smallest Sense-local static trial needed to map existing `passive.telemetry.adapter` output into a presentation-head-shaped static input or demo surface.
4. Keep the trial Passive-only and fixture/offline-only.
5. Preserve Sense-owned state meaning through reason-first mapping. Do not collapse Sense `No observation`, `I/O off - ingest blocked`, `Degraded`, or unavailable cases into Lab `NO DATA` / `UNAVAILABLE` without explicit Sense qualification.
6. Add deterministic verification for the trial.
7. Create `workspace/DevHS67-passive-static-head-trial.md` with:
   - files changed
   - trial flow implemented
   - state cases covered
   - what remains Sense-owned
   - what remains Lab/example-only
   - verification commands and results
   - screenshots/browser notes only if a local static visual demo is actually run

## Acceptance Criteria

M16D is complete when:

- the trial starts from fixture/static Passive adapter output, not live runtime data
- `mapPassiveTelemetryAdapter` remains the Sense-owned input boundary
- the output is clearly presentation-head-shaped but not a Sense bridge/runtime contract
- all existing Passive adapter fixture states remain covered: fresh, stale, partial, capped, blocked/I/O-off, degraded, and no-observation/unavailable
- Lab example labels remain examples only and are not introduced as Sense state enums
- `adapterPreview` remains present; `displaySafe` and `certainty` remain absent
- no runtime, bridge, preload, IPC, live provider, clipboard, private path, renderer, or Lab file dependency is introduced
- verification proves the static trial and preserves existing Passive adapter behavior
- the Dev handoff clearly states whether the trial is ready for Overseer/UI review, needs redirect, or should be parked

## Guardrails

- Do not adopt a Lab face.
- Do not modify Aura Lab.
- Do not create a universal Aura adapter.
- Do not connect the trial to runtime, bridge, preload, IPC, services, renderer, or the live app shell.
- Do not broaden into Combat Witness, Threat Intel, or Clipboard Acquisition.
- Do not rename Sense contracts, IPC channels, payload fields, services, schemas, CSS/test selectors, or user-facing terms.
- Do not run live provider smoke.
- Do not run live/manual EVE gamelog ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not capture clipboard content.
- Do not run real SDE refresh/download.
- Do not treat Lab `CURRENT`, `AGED`, `PARTIAL`, `UNAVAILABLE`, `FALLBACK`, `NO DATA`, `availability`, or `coverage` as Sense bridge/runtime contracts.

## Required Verification

Run at minimum:

```powershell
npm.cmd run verify:passive-adapter
npm.cmd run verify:passive-telemetry
npm.cmd run verify:protected-terms
git diff --check
git status --short --branch
```

If implementation touches renderer-boundary or shell files, also run the relevant renderer verification named in `package.json`.

Do not run live/manual checks unless the Human explicitly authorizes them in a later message.

## Stop Conditions

Stop and report before proceeding if:

- the trial appears to require runtime, bridge, preload, IPC, renderer, live provider, clipboard, private path, or Lab file dependency
- the Lab starter head cannot be represented without importing Lab state labels as Sense state truth
- Passive adapter fixture cases need semantic changes
- the work wants to broaden into product UI, adoption, Combat Witness, Threat Intel, Clipboard Acquisition, or universal adapter design
- required verification fails and the failure is not a narrow, obvious fix inside this packet

## Handoff Requirements

Dev must create `workspace/DevHS67-passive-static-head-trial.md`.

The handoff must be analysis plus implementation evidence, not a prompt. It should include any uncertainty or recommended next review lane.
