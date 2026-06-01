# Current Workspace Packet

Status: Active
Updated: 2026-06-01
Owner: Overseer

## Coordination State

Active milestone: M16 - Body-To-Adapter Readiness
Roadmap source: `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
Current runway: M16E - Passive Local Glass Trial
Current executor: Dev
Current status: Open
Expected output: `workspace/DevHS69-passive-local-glass-trial.md`

Latest accepted slice: M16D - Passive Static Head Trial
Latest Dev handoff: `workspace/DevHS67-passive-static-head-trial.md`
Latest Overseer acceptance: `workspace/OverseerHS68-passive-static-head-trial-acceptance.md`

Lab package source:

- `F:\Projects\AURA- Lab\portable-presentation-starter\packages\sense-trial-glass\`
- Lab package commit: `824e35d Accept Sense trial glass package`

Source records:

- `workspace/DevHS63-passive-adapter-landing-pad.md`
- `workspace/OverseerHS64-passive-adapter-landing-pad-acceptance.md`
- `workspace/RelayReviewHS65-lab-static-starter-head.md`
- `workspace/OverseerHS66-lab-static-starter-head-relay-review-acceptance.md`
- `workspace/DevHS67-passive-static-head-trial.md`
- `workspace/OverseerHS68-passive-static-head-trial-acceptance.md`
- `workspace/critical/critical-terms.md`

## Intent

Run the first local Sense glass trial using Lab's prepared static bundle.

This packet is no longer asking Dev to decide Lab packaging. Lab has provided a clean local static bundle. Dev should copy or stage that bundle into Sense, feed it with Sense-owned `passive.static-head-trial.input` data, and verify the result remains local, static, Passive-only, and reversible.

This is a visual/demo trial, not product adoption.

Target flow:

```txt
Lab sense-trial-glass package
-> copied into a clearly named Sense-local trial area
-> Passive fixture snapshot
-> mapPassiveTelemetryAdapter(snapshot)
-> mapPassiveStaticHeadTrial(adapter)
-> local glass demo input
-> local static inspection page
STOP
```

## Runway

1. Read the source records and Lab package `README.md` / `MANIFEST.md`.
2. Copy only the Lab package files needed for local inspection into a clearly named Sense-local trial area.
   - Suggested location: `trials/passive-local-glass/`
   - Preserve package provenance and boundary notes.
   - Do not use symlinks, external path imports, or runtime reads from `F:\Projects\AURA- Lab`.
3. Add the smallest Sense-owned fixture/data generation needed for the local glass to inspect Sense trial output.
   - Start from fixture/static Passive snapshots.
   - Use `mapPassiveTelemetryAdapter`.
   - Use `mapPassiveStaticHeadTrial`.
   - Do not use live runtime, bridge, preload, IPC, renderer, providers, clipboard, or private/operator paths.
4. Keep Lab example data as example-only. Prefer a Sense-generated trial input file for Sense inspection.
5. Add deterministic verification that proves:
   - the local glass trial does not reference `F:\Projects\AURA- Lab`
   - the Sense trial input is generated from the accepted Passive mapper chain
   - Lab example labels do not become Sense state truth
   - no runtime/renderer/preload/IPC/live/private dependency is introduced
6. If practical and local, provide an inspection path for the Human to open.
7. Create `workspace/DevHS69-passive-local-glass-trial.md` with:
   - files changed
   - copied Lab package files and provenance
   - Sense-generated input shape
   - local inspection instructions
   - verification commands and results
   - any visual notes or blockers

## Acceptance Criteria

M16E is complete when:

- the Lab package is copied or staged inside Sense without symlinks or cross-project runtime reads
- the local trial can be inspected from Sense without requiring `F:\Projects\AURA- Lab`
- the trial uses Sense-generated Passive static head input, not Lab example data, for the Sense view
- Sense mapper/source/state meaning remains owned by Sense
- Lab package files remain presentation glass only and do not become Sense contracts
- no renderer face, app shell, routing/navigation, app-wide state management, bridge, preload, IPC, live provider, clipboard, private path, or manual EVE gamelog dependency is introduced
- verification covers the local glass/package boundary
- the Dev handoff states whether the glass is ready for Overseer/UI review, needs a Lab package adjustment, or should be parked

## Guardrails

- Do not adopt the Lab face as product UI.
- Do not modify Aura Lab.
- Do not create a universal Aura adapter.
- Do not wire the glass into the active app renderer or runtime shell.
- Do not require `F:\Projects\AURA- Lab` or any other cross-project path at verification/demo time.
- Do not use symlinks or external path imports to reach Lab files.
- Do not turn the package into full renderer adoption, app shell replacement, routing/navigation, app-wide state management, or broad frontend architecture.
- Do not broaden into Combat Witness, Threat Intel, or Clipboard Acquisition.
- Do not rename Sense contracts, IPC channels, payload fields, services, schemas, CSS/test selectors, or user-facing terms.
- Do not run live provider smoke.
- Do not run live/manual EVE gamelog ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not capture clipboard content.
- Do not run real SDE refresh/download.

## Required Verification

Run at minimum:

```powershell
npm.cmd run verify:passive-static-head
npm.cmd run verify:passive-adapter
npm.cmd run verify:passive-telemetry
npm.cmd run verify:protected-terms
git diff --check
git status --short --branch
npm.cmd run verify:all
```

If a new package-boundary verification script is added, include it in the handoff and consider wiring it into `verify:all`.

Do not run live/manual checks unless the Human explicitly authorizes them in a later message.

## Stop Conditions

Stop and report before proceeding if:

- the Lab package requires missing files, package manager install, network, React build setup, Electron, preload, IPC, service registry, SmokeFlash, Pane Board, Wayfinder, or target project runtime wiring
- Dev would need to decide Lab packaging, trim Lab source, or repair Lab package internals
- the local glass cannot consume Sense-generated trial input without adopting Lab state labels as Sense state truth
- the work wants to broaden into product UI adoption, active renderer integration, Combat Witness, Threat Intel, Clipboard Acquisition, or universal adapter design
- required verification fails and the failure is not a narrow, obvious fix inside this packet

## Handoff Requirements

Dev must create `workspace/DevHS69-passive-local-glass-trial.md`.

The handoff must include local inspection instructions and any package-fit feedback that should return to Lab.
