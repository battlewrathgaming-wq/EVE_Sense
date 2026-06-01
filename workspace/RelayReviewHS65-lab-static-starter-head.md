# RelayReviewHS65 - Lab Static Starter Head

Date: 2026-06-01
Role: Sense relay reviewer / presentation-boundary auditor
Status: Advisory relay review complete

## Request Answered

Review the Lab static presentation starter as a recoverable trial head for Sense-shaped input.

Determine whether the Lab head is useful, safe, and clear enough for Sense to continue adapter exploration while preserving Sense ownership of source meaning, lane semantics, runtime behavior, adapter mapping, product language, and adoption decisions.

This artifact is advisory only. It is not implementation authority, adoption approval, a Lab contract, or a Dev runway.

## Files Reviewed

Sense:

- `AGENTS.md`
- `workspace/current.md`
- `workspace/overview.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/EngSpecHS60-passive-telemetry-adapter-envelope.md`
- `workspace/TermAuditHS61-passive-adapter-wording-collision-review.md`
- `workspace/OverseerHS62-passive-adapter-envelope-acceptance.md`
- `workspace/DevHS63-passive-adapter-landing-pad.md`
- `workspace/OverseerHS64-passive-adapter-landing-pad-acceptance.md`
- `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
- `docs/current-state/current-implementation.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/adr/ADR-0003-target-owned-presentation-adapters.md`
- `docs/adr/ADR-0008-io-off-means-no-ingest.md`
- `src/passive/passiveTelemetryAdapter.js`
- `src/passive/passiveTelemetryService.js`
- `package.json`

Lab:

- `F:\Projects\AURA- Lab\docs\statements\lab-presentation-head-posture.md`
- `F:\Projects\AURA- Lab\docs\statements\presentation-head-handoff-standard.md`
- `F:\Projects\AURA- Lab\portable-presentation-starter\README.md`
- `F:\Projects\AURA- Lab\portable-presentation-starter\examples\static\index.html`
- `F:\Projects\AURA- Lab\portable-presentation-starter\examples\static\instrument-readout-panel.js`
- `F:\Projects\AURA- Lab\portable-presentation-starter\examples\static\instrument-readout-panel.css`
- `F:\Projects\AURA- Lab\portable-presentation-starter\examples\static\example-readouts.json`
- `F:\Projects\AURA- Lab\docs\roadmap\m43-presentation-head-handoff-standard.md`
- `F:\Projects\AURA- Lab\workspace\OverseerHS169-m44-static-starter-safety-floor-acceptance.md`

## Current-State Readback

Sense is idle after accepted M16B. No Dev runway is open.

Accepted M16B posture:

```txt
passive.telemetry.snapshot
-> src/passive/passiveTelemetryAdapter.js
-> passive.telemetry.adapter with adapterPreview
STOP
```

Repo-verified accepted facts:

- The Passive mapper is Sense-owned, Passive-only, and isolated.
- It is not connected to runtime, bridge, preload, renderer, Lab, or a presentation head.
- It emits `kind: passive.telemetry.adapter`.
- It uses `adapterPreview`, not `displaySafe`.
- It does not emit `certainty`.
- It preserves lane identity, current-system facts, observation basis, resolver basis, provider basis, freshness, state, authority, warnings, gaps, and diagnostics.
- Fixture/offline verification covers fresh, stale, partial, capped, blocked/I/O-off, degraded, and no-observation/unavailable cases.

Lab static starter posture:

- Lab describes the head as display-only and not a trust boundary.
- Lab says its example input is not a bridge contract, runtime contract, target payload requirement, target enum set, or source-project state model.
- The static head excludes Electron, preload, IPC, React, Lab service registry, Pane Board, Wayfinder, and SmokeFlash.
- It uses local static files with a local JSON fetch plus an embedded fallback data copy.
- It renders display input through `textContent` / text nodes, not arbitrary HTML.
- It does not need network, live provider, clipboard, filesystem, IPC, or preload access to render.

## A. Sense Local Relay Review

### Fit

Recommendation: trial locally.

The Lab static starter head is useful enough for a recoverable Sense trial because it directly exercises the pressure points that M16B prepared:

- state label
- primary value or absence label
- readout age/freshness
- basis
- availability reason
- coverage
- gaps
- warnings
- detail reveal
- source-owned qualification

Best first Sense trial lane: Passive Telemetry.

Passive remains the best first fit because:

- Sense already has `passive.telemetry.adapter`.
- Passive has accepted adapter fixture coverage.
- Passive stresses the exact starter treatments: fresh/stale/partial/capped/blocked/degraded/no-observation.
- Passive is lower overclaim risk than Combat Witness and less likely than Threat Intel to be mistaken for operator-initiated intelligence.
- Passive can be trialed with static fixture output only.

The head remains useful without importing Lab meanings if Sense maps from `passive.telemetry.adapter.adapterPreview` and preserved source slots into Lab's neutral readout input in a Sense-owned shim.

### Boundary

Boundary is currently acceptable.

The Lab package repeatedly states that its examples are examples only. It does not claim ownership of Sense states, runtime behavior, adapter mapping, or adoption timing. Lab's posture statement also explicitly frames heads as offers, not forced synchronization.

Sense must preserve:

- `Passive Telemetry`
- `passive.telemetry.snapshot`
- `passive.telemetry.adapter`
- `adapterPreview`
- `I/O off - ingest blocked`
- `No observation`
- `Fresh context`
- `Stale context`
- `Partial sample`
- `Capped sample`
- `Degraded`
- lane-specific `blocked`, `unavailable`, `stale`, `partial`, and `degraded` meanings
- basis/freshness/warnings/gaps as the Passive trust model

Lab sample data, example states, and roadmap are not adopted by this review.

The highest boundary watchpoints are:

- Lab `CURRENT`, `AGED`, `PARTIAL`, `UNAVAILABLE`, `FALLBACK`, and `NO DATA` must remain display labels only.
- Lab `availability.status` must not become a Sense state source.
- Lab `coverage.knownFields` must not become a Sense schema declaration.
- Lab `sourceOwned` is useful as a display qualification block, not an ownership handoff.

### Adapter Requirements

First trial input should be static Sense-owned fixture data shaped from `passive.telemetry.adapter`, not live snapshots and not direct bridge output.

Recommended trial flow:

```txt
Passive fixture snapshot
-> mapPassiveTelemetryAdapter(snapshot)
-> Sense-local starter-readout fixture mapper
-> Lab static Instrument Readout Panel copy
STOP
```

`passive.telemetry.adapter` can feed the head without changing Sense bridge/runtime contracts because the current adapter is isolated and already stops before renderer/Lab integration.

Temporary/dynamic mapping:

- `adapterPreview.stateLabel` -> Lab `readout.state.label`
- `adapterPreview.primaryLabel` -> Lab `primaryValue` or `absenceLabel`
- `adapterPreview.basisLine` -> Lab `basis`
- `adapterPreview.ageLine` -> Lab `ageLabel`
- `adapterPreview.warningLine` plus `warnings[]` -> Lab `warnings`
- `gaps[]` -> Lab `gaps`
- `state.availability` -> Lab `availability.status` only after Sense-local translation

Likely stable later:

- Passive lane label as readout label
- basis/freshness/warnings/gaps/detail rows as the core adapter-to-head bridge
- `sourceOwned` qualification for Sense-owned states when Lab labels might otherwise flatten meaning
- static fixture-only trial before any runtime connection

Must remain Sense-local and never become Lab-owned:

- adapter behavior
- Passive state mapping
- authority wording
- source/provider basis meaning
- lane semantics
- runtime/preload/bridge contracts
- decision to adopt, fork, or abandon the head

The head does not currently need a missing Sense field for a static trial. It can use existing adapter output. A future integrated trial may want a cleaner Sense-local readout fixture builder, but that is not a runtime contract gap.

### Presentation Pressure

What helps Sense:

- The visible basis line supports Sense's "trust must be available" principle.
- Age/freshness has a stable place without becoming the main event.
- Gaps and warnings are compact count pills in the main surface, with detail behind a reveal.
- Detail rows are a good fit for provider/cache/failure explanations that should not dominate the tactical glance.
- Long-token wrapping is explicitly handled in CSS through `overflow-wrap: anywhere` and `word-break: break-word`.
- State markers are non-color-only and readable as text.

Where density may break:

- The top boundary note plus selector band is useful in Lab, but should not travel into a Sense product trial surface.
- The meta grid repeats basis and coverage in a way that may feel report-like when fed real Passive data.
- `Coverage` / `Known fields` is useful for Lab examples but may feel too schema/display-console-like for Sense.
- Availability reason text can get long; in Sense it should often collapse to one calm line with detail reveal.
- Source-owned qualification text belongs in detail, not the primary glance.

Material treatments that fit Sense:

- availability reason treatment
- warning/gap edge treatment
- long text detail block
- source-owned qualification in detail
- narrow stacking and long-token wrapping
- reduced-motion floor

Treatments that feel wrong or risky for Sense:

- `NO DATA` as a visible fallback for Passive conditions
- generic `UNAVAILABLE` as the primary label when Sense has a more exact reason
- `FALLBACK` unless Sense explicitly has a last-known/resting-state policy for that surface
- `Coverage` / `Known fields` as prominent tactical copy
- a large single readout card if it displaces the compact tactical viewport hierarchy

The head is calm and readable as a reference, but it is still more panel/readout than HUD. For Sense, it is better as a trial detail/instrument head than as immediate replacement for the compact Passive strip.

Screenshot observations from Human-provided manual capture:

- The current, partial, unavailable, and no-data states render cleanly at desktop width with no obvious text overflow.
- The overall composition is calm and inspectable; hierarchy is stable and the state chip remains visible.
- `PARTIAL` reads well because the primary value and availability line both make limited coverage explicit.
- `NO DATA` and `UNAVAILABLE` are visually close: both use muted absence copy, one warning, similar chip treatment, and similar meta structure. For Sense, these should not be used as direct visible replacements for `No observation`, `I/O off - ingest blocked`, or `Degraded`.
- The `Coverage` column is readable but contributes the most dashboard/report flavor. For Sense, it should likely move behind detail unless the surface is explicitly a review/detail panel.
- The selector and boundary note are useful Lab reference scaffolding, but should not travel into Sense product UI.

### Safety / Handoff

The starter remains display-only in the reviewed files.

Safety positives:

- no preload or IPC dependency
- no Electron dependency
- no live provider dependency
- no clipboard dependency
- no filesystem write path
- no remote scripts or assets found in reviewed static files
- no `eval`
- text is rendered using `textContent` or text nodes
- local JSON fetch has embedded fallback data

Local trial should require:

- static fixture input only
- no bridge/preload/runtime connection
- no live/manual EVE log ingestion
- no live provider smoke
- no private path inspection
- no clipboard capture
- no adoption language in the packet title or artifact
- a check that Sense-specific states do not collapse into Lab `NO DATA` / `UNAVAILABLE`

Browser/screenshot validation:

- Not required before this relay recommendation.
- Useful before any Dev connection packet or visual acceptance.
- This review attempted to use the in-app Browser, but the Browser plugin install was missing its required `scripts/browser-client.mjs`, so no tool-driven screenshot/browser claim is made here.
- Human manually captured desktop screenshots for `CURRENT`, `NO DATA`, `PARTIAL`, and `UNAVAILABLE`; the observations above are based on those screenshots.

### Sense Deviations

Healthy deviations:

- Use `Passive Telemetry` as the readout label rather than Lab's generic sample label.
- Use Sense state labels, not Lab uppercase state labels, where source meaning matters.
- Keep `I/O off - ingest blocked` distinct from `No observation` and `Unavailable`.
- Put provider/cache diagnostics behind detail.
- Reduce or remove `Coverage` / `Known fields` from the primary Sense glance.
- Keep a smaller, denser shape for tactical viewport use.

Risky deviations:

- Mapping Sense `blocked`, `no observation`, or `degraded` to Lab `NO DATA`.
- Treating Lab `state.id` as a bridge enum.
- Making `coverage.knownFields` into a Sense schema promise.
- Connecting the head to live bridge/runtime before static fixture pressure is reviewed.
- Letting the head's selector/demo shell travel into Sense product UI.

### Adoption Recommendation

Recommendation: trial locally.

Exact meaning:

- Trial the static head with fixture/static `passive.telemetry.adapter` output only.
- Keep the trial in a Sense-owned review branch/packet if opened later.
- Do not connect to renderer, preload, IPC, live runtime, Lab files, or real provider data in the first trial.
- Do not adopt Lab state enums, sample meanings, roadmap, future upgrade path, or product direction.

Reasons:

- The head is safe enough to inspect as a display-only reference.
- It is explicitly bounded as non-contract example input.
- Passive has a ready adapter landing pad.
- The head directly pressures the adapter fields Sense needs to learn from.
- The remaining risks are wording/density/mapping risks, not runtime safety blockers.

Human/Overseer decisions needed before Dev work:

- Whether to open a tiny static Sense-local trial packet.
- Whether the trial should copy the Lab static files into Sense, reference them only, or create a minimal Sense fixture mapper first.
- Whether the first trial surface is a Passive detail/instrument panel or a replacement candidate for the existing Passive compact readout.
- Whether Sense wants visible state labels to stay Sense-owned case/copy or map to Lab uppercase display labels.

## B. Lab Presentation Pressure Report

### What Read Well

- The starter clearly says what it is and is not.
- The README preserves the target-owned adapter boundary.
- The safety floor is directly present in the package docs.
- The example JSON carries boundary notes instead of hiding them in a separate artifact.
- `sourceOwned` is a useful mechanism for displaying target-owned words without Lab claiming them.
- The static JS renders text as text and keeps fallback data local.
- The panel proves the intended materials: basis, age/freshness, availability, gaps, warnings, detail, and long-token handling.

### What Became Dense Or Unclear

- The combination of basis, availability, coverage, gaps, warnings, and detail rows is clear but dense for a tactical viewport.
- `Coverage` and `Known fields` read more like Lab display/debug grammar than Sense operator copy.
- `UNAVAILABLE` for the source-owned-placeholder example may still visually blur with real unavailable/no-observation states even though the detail text qualifies it.
- The selector/demo shell is appropriate for Lab reference but should not be mistaken for a target surface.
- Repeating the same basis in header, meta rows, and detail can become heavy with real Sense copy.

### Material / Polish Pressure

Useful refinements for Lab:

- Provide a compact-mode variant where coverage moves entirely into detail.
- Provide an example where source-owned state labels pass through visibly instead of being represented by Lab uppercase labels.
- Consider a "reason-first absence" example that distinguishes blocked, no observation, unavailable, and degraded without using `NO DATA`.
- Add a short handoff note describing which shell/demo elements should not travel into target product UI.
- Consider a tighter tactical example with shorter primary copy and warnings/gaps visible but quiet.
- Increase visual distinction between `NO DATA` and `UNAVAILABLE`, or show them as separate example families with stronger reason-first copy.

### Useful Deviations

Sense should likely:

- keep Sense state copy
- compress primary readout density
- demote coverage/known-fields to detail
- keep authority/offline semantics source-owned
- treat source-owned qualification as detail text rather than primary copy

These deviations are healthy pressure, not rejection of the Lab head.

### Unsafe Or Confusing Lab Assumptions

No hard unsafe assumption was found in the reviewed package.

Confusion risks that remain:

- Lab display labels can still look enum-like because they are uppercase and drive CSS classes.
- `NO DATA` and `UNAVAILABLE` are well-qualified in docs, but target projects could misuse them if they skip the README.
- `sourceOwned.owner: Sense example placeholder` is safe as example data, but a real target fixture should name the exact Sense source/layer.
- Local JSON `fetch()` is acceptable for static reference, but a target review should know fallback data may render when file fetch is blocked.

### Suggested Lab Refinement Ideas

- Add an explicit "Target Adapter Example: Passive-like input without adopting Sense" page only if Lab can keep it neutral and source-qualified.
- Provide a no-selector export variant for target relay inspection.
- Add a short "do not infer" list next to example state labels in the visible page, or keep the current visible boundary note but make it collapsible in target-facing examples.
- Provide separate examples for "source-owned blocked" and "display unavailable" so their visual distinction can be inspected.
- Consider renaming `coverage` in the visible panel to a calmer detail-only concept when not actually showing schema coverage.

### What Sense Can Supply As Fixture / Static Input

Sense can supply static `passive.telemetry.adapter` fixtures for:

- fresh current-system context
- stale context
- partial provider sample
- capped zKill sample
- I/O off / ingest blocked
- degraded resolver/provider state
- no observation / unavailable

These should be fixture adapter outputs, not live snapshots.

### What Lab Should Not Infer From Sense Feedback

Lab should not infer:

- Sense adoption approval
- a request to own Sense adapter mapping
- a request to rename Sense states
- that Lab `state` is a Sense enum
- that Sense wants a dashboard/report/workstation shape
- that Passive trial feedback applies to Combat Witness, Threat Intel, Clipboard Acquisition, Atlas, or all Aura projects
- that future Lab head upgrades must synchronize into Sense

## Final Recommendation

Recommendation option: trial locally.

The Lab static starter head is safe and useful enough for a bounded Sense-local static trial with Passive adapter fixture output.

It should not be adopted yet. It should not be connected to runtime, renderer, bridge, preload, IPC, Lab files, live providers, clipboard, or private/operator data. The next useful packet, if Human/Overseer opens one, is a tiny static trial that maps existing `passive.telemetry.adapter` fixture output into a local copy or local reference of the Lab readout input shape, then reviews density and state preservation.

## Verification

Commands run for this relay review:

```powershell
 npm.cmd run verify:protected-terms
git diff --check
git status --short --branch
```

Results:

- `npm.cmd run verify:protected-terms`: passed; warning-only protected-term discovery scanned this artifact and reported 61 review items, primarily Lab-owned terms such as `Readout`, `Coverage`, `Gaps`, and `Warnings`. These are expected in a Lab relay review and are treated here as owner/layer qualification prompts, not rename instructions.
- `git diff --check`: passed with no output.
- `git status --short --branch`: `## main...origin/main`; this artifact is the only untracked file in the working set.

No live/manual checks, full test suites, Electron smoke, browser screenshot validation, live provider smoke, clipboard capture, private path inspection, or EVE gamelog ingestion were run.
