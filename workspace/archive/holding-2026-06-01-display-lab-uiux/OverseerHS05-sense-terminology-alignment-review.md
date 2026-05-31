# OverseerHS05: Sense Terminology Alignment Review

Status: Advisory only, not Sense authority
Scope note: Sense-local alignment input, not shared doctrine
Date: 2026-05-25
Owner: AURA-Sense Overseer

## Trigger

Atlas is caught up for the current terminology coordination round, so Sense can prepare its local position for the next Atlas/Lab/Sense alignment pass.

This note does not inspect Atlas project internals, does not update shared protected-word JSON, does not rename code or contracts, and does not create a Dev runway.

## Files Reviewed

- `workspace/current.md`
- `workspace/overview.md`
- `workspace/critical/critical-terms.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\TerminologyAuthorityRuleset-2026-05-24.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\Sense-Terminology-Boundary-Requirements-2026-05-24.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\terminology-critical-cross-project-synthesis-2026-05-24.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\protected-words\README.md`
- protected-term baseline output from `npm.cmd run verify:protected-terms -- --baseline`

## Repo-Verified Sense Position

Sense is idle after accepted Milestone 13, Milestone 14, Passive Telemetry readout, Sense face refinement, and durable docs cleanup.

Sense remains a transient tactical viewport. It owns internal and Project -> Bridge meaning for Combat Witness, Passive Telemetry, Threat Intel, Clipboard Acquisition, live IO gate states, provider/sample states, local-log observation labels, and bridge snapshots.

Lab owns Bridge -> Interface human presentation only after preserving Sense meaning. Lab terms are useful presentation tools, but they are not authority over Sense lane semantics.

## Baseline Sniffer Read

Command:

```powershell
npm.cmd run verify:protected-terms -- --baseline
```

Result:

- mode: broad baseline
- files scanned: 64
- warning-only items: 224
- outcome: completed successfully
- protected-word JSON updates: none
- renames: none

High-value warning clusters:

- Atlas-owned words in Sense docs: `Evidence`, `Discovery`, `Watch`
- Lab-owned display words in Sense docs: `Readout`, `Coverage`, `Gaps`, `Warnings`
- Sense caution words: `Report`, `Fallback`, blocked/failed/no-scan collapse risks

These are review evidence, not failure states.

## Sense Preserve-Exact Position

Recommended preserve-exact inside Sense and source-fed presentation:

- `Combat Witness`
- `Passive Telemetry`
- `Threat Intel`
- `Clipboard Acquisition`
- `Live IO blocked`
- `Partial sample`
- `Capped sample`
- `No scan`
- `Observed Source`
- `Observed Weapon`
- `Observed balance` / `Observed repair balance`

Reason:

These terms protect lane boundary, authority, freshness, sample completeness, and uncertainty. Translating them too aggressively risks turning transient observations into Atlas-style evidence, background monitoring, or complete intelligence.

## Lab-Translatable With Constraints

These can be softened or restyled after the bridge if Sense meaning stays traceable:

- `Provider pulse`
- `Fresh context`
- `Stale context`
- `Degraded`
- `No observation`
- provider/sample basis wording
- diagnostics labels
- compact readout layout terms

Constraints:

- preserve lane/source context
- keep blocked, failed, degraded, stale, partial, capped, unavailable, and no-scan distinct
- do not use generic no-data/offline/current wording when the lane state is known
- keep provider/sample basis visible near sample claims

## Needs Human Or Sense Overseer Decision

These remain unresolved enough to avoid hard standardization:

- Whether `Gateway` is preserve-exact in Lab-facing UI or can become a Lab-owned presentation affordance.
- Whether `Pulling`, `Listening`, and `Cooldown` should remain exact Clipboard Acquisition lifecycle copy or be restyled.
- Whether `Threat Intel` is preserve-exact everywhere, given Atlas avoids broader `Intelligence` as shared work-product language.
- Whether `Provider pulse` should remain user-facing or become calmer sample/state language.
- Whether inherited `seed.readiness` language should be hidden further from product-facing docs and surfaces.

## Collision Handling

### Atlas Terms

`Evidence`, `Discovery`, `Watch`, `Assessment`, `Marked`, and `Report` must not be imported into Sense as product meaning.

Allowed Sense use:

- historical/audit explanation with owner qualifier
- explicit contrast such as "not Atlas evidence"
- local reviewer evidence in handoff context, when not user-facing

Unsafe Sense use:

- calling provider samples evidence
- calling Combat Witness a report/history
- calling Clipboard Acquisition or gamelog watcher a Watch
- using Discovery for zKill refs in Sense Threat Intel

### Lab Terms

`Readout`, `Coverage`, `Gaps`, `Warnings`, and neutral state labels are useful after the bridge, but they must remain presentation language.

Allowed Sense use:

- UI/advisory presentation notes
- renderer copy discussion
- smoke or visual review expectations

Unsafe Sense use:

- treating Lab labels as backend status enums
- replacing Sense lane states with Lab generic states where meaning would collapse
- importing Lab fixture semantics such as Briefing, Neutral Seed, Review state, or Needs Attention

## Current Sense Local Corrections To Consider Later

These are candidates for a bounded future docs/terminology packet, not a Dev runway now:

1. Review README and UI shortcut wording against the current `Control+\` / fallback behavior noted by the Sense boundary requirements.
2. Review whether `task.cancel` classification needs a docs-only or code-level correction.
3. Classify baseline protected-term warnings into accepted, qualified, historical, or rewrite-candidate groups.
4. Consider replacing product-facing `Provider pulse` with calmer sample/state wording if Lab presentation review prefers it.

## Recommendation

Do not open implementation work yet.

Next best role/action:

- Human or Sense Overseer should accept, revise, or defer the preserve-exact list above.
- After Atlas/Lab deliver any concrete artifact, run a Sense-local terminology classification pass against it.
- Keep the protected-term verifier warning-only.

## Bottom Line

Sense is ready for the terminology handoff, but should stay defensive about meaning. Universalize structure, not meaning: state slots, freshness/basis/sample visibility, diagnostics demotion, and smoke expectations can travel; Combat Witness, Passive Telemetry, Threat Intel, Clipboard Acquisition, and live-IO authority meaning should remain Sense-owned.
