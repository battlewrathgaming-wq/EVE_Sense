# OverseerHS07: Sense M19 Instrument Status Band Adoption Review

Status: Advisory only, not Sense authority
Scope note: Sense receiving-project review of accepted Lab M19 presentation input
Date: 2026-05-25
Owner: AURA-Sense Overseer

## Recommendation

Adapt, do not adopt wholesale.

Lab M19 is ready for Sense to consume as advisory Bridge -> Interface presentation-pattern input. The safe Sense use is structural: compact state band, primary value/status, source/freshness/basis slots, gap/warning marker, and detail reveal.

Do not import Lab fixture semantics, Lab neutral state labels as Sense enums, `FALLBACK` review fixture meaning, or Lab current-packet process.

## Lab Source Consulted

- `F:\Projects\AURA- Lab\workspace\current.md`
- `F:\Projects\AURA- Lab\workspace\DevHS68-instrument-status-band-prototype.md`
- `F:\Projects\AURA- Lab\workspace\OverseerHS71-m19-acceptance.md`
- `F:\Projects\AURA- Lab\workspace\UIDevHS69-instrument-status-band-implementation-advisory.md`
- `F:\Projects\AURA- Lab\workspace\OverseerHS70-uidevhs69-advisory-review.md`
- `workspace/OverseerHS06-lab-remote-consumer-sla-review.md`
- `workspace/OverseerHS05-sense-terminology-alignment-review.md`

## Adopted As

Presentation pattern and verification pattern only.

Receiving-project owner:

```txt
Sense
```

Meaning preserved:

```txt
Sense owns Combat Witness, Passive Telemetry, Threat Intel, Clipboard Acquisition,
live IO, sample/freshness states, lane boundaries, and Project -> Bridge meaning.
```

## Lab M19 Understanding

Lab M19 accepted one bounded primitive:

```txt
Instrument Status Band
```

The accepted band refines the existing Lab `Bridge State Readout` surface. It shows:

- state label
- primary value/status
- state light
- inset pips/sweep
- readout age
- source coverage
- readout basis
- gap/warning/availability marker
- `Readout Detail` reveal

Lab covered these presentation states:

- `CURRENT`
- `UPDATING`
- `AGED`
- `PARTIAL`
- `UNAVAILABLE`
- `FALLBACK`
- `NO DATA`

Lab explicitly kept `FALLBACK` as Lab-local review data and did not define a durable bridge contract, target adapter, or source-project meaning.

## Sense Fit

Best first Sense fit:

```txt
Passive Telemetry compact support, then Combat Witness support/detail bands.
```

Rationale:

- Passive Telemetry already carries freshness, provider/sample basis, live IO gate, partial/capped, and unavailable/degraded distinctions.
- Combat Witness already has a primary face; a band should not compete with the first-read `Incoming DPS`, `Repair HPS`, and `Observed balance`.
- Threat Intel already has deliberate back-page behavior and should not be made to look like continuous monitoring.
- Clipboard Acquisition is an authority window, not a generic state band.

## Portable Mechanics

Portable into Sense after local review:

- compact band structure
- primary value/status slot
- state light plus text, never color-only state
- source/freshness/basis slots
- gap/warning/availability marker
- detail reveal for secondary diagnostics
- stable dimensions and narrow/overlay containment
- reduced-motion preservation
- warning-only terminology check posture
- visual smoke expectations for text containment and state visibility

These are structure, not meaning.

## Sense-Specific Mapping Candidates

### Passive Telemetry

Primary value/status:

- current system label
- ship kills
- jumps
- kill/jump ratio
- compact state label

Sense-owned labels:

- `Fresh context`
- `Stale context`
- `Partial sample`
- `Capped sample`
- `Live IO blocked`
- `Degraded`
- `No observation`

Detail reveal:

- provider/sample basis
- freshness/cache age
- zKill/ESI source availability
- live IO gate reason
- partial/capped reason
- failure summary

### Combat Witness

Primary value/status:

- `Incoming DPS`
- `Repair HPS`
- `Observed balance`
- `15s rolling observed window`

Detail reveal:

- observed source
- observed weapon
- watcher state
- latest-event freshness
- event count
- diagnostics only for spike/outlier details until calibrated

### Threat Intel

Use with caution.

Threat Intel should keep its back-page deliberate-scan shape. A band can summarize latest scan state only if it preserves:

- no scan
- live IO blocked
- scoped sample
- partial/capped sample
- provider failure
- latest scan only, not durable history

### Clipboard Acquisition

Use only as a lifecycle/authority indicator if needed.

Do not turn `Pulling`, `Listening`, `Cooldown`, sealed, or blocked states into generic monitoring/watching copy.

## Not Imported

Do not import:

- Lab fixture family meanings
- `Neutral Sample` meaning
- Lab state labels as Sense backend enums
- `FALLBACK` fixture meaning as a Sense state
- Lab `source coverage` as provider truth without Sense qualification
- Lab `Readout Detail` naming as required Sense copy
- Lab current packet as Sense work
- Lab smoke matrix as Sense acceptance
- Lab internal ids, compatibility names, or fixture fields

## Terminology Risks

High-risk imports:

- `CURRENT`: may overstate Passive/Combat lane freshness as global truth.
- `NO DATA`: collapses no scan, no observation, blocked, unavailable, failed, and degraded.
- `FALLBACK`: can sound like alternate truth unless source/authority is explicit.
- `Source coverage`: can overstate provider completeness unless paired with sample/gate/freshness.
- `Readout`: safe as presentation discussion, but not a Sense backend contract term.

Recommended Sense posture:

- Use Sense labels in user-facing lane states.
- Use Lab visual structure underneath them.
- Keep Lab neutral labels in test/advisory discussion only unless a future Sense UI/UX pass accepts a translation.

## Smallest Safe Sense Prototype

No implementation should start from this artifact alone.

If Human opens a packet, the smallest safe prototype is:

```txt
Passive Telemetry Instrument Band Review
```

Scope:

- renderer-only
- existing `passive.telemetry.snapshot` fields only
- no backend contracts
- no provider behavior changes
- no Lab labels as Sense state enums
- no live provider smoke

Expected first slice:

- compact Passive Telemetry band in existing support area
- current system as primary value
- Sense-owned status label
- source/freshness/basis line
- gap/warning/live-IO marker
- detail reveal or existing diagnostics reuse
- narrow/overlay containment check

## Verification Expected If Implemented Later

Sense-local only:

```powershell
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:protected-terms
npm.cmd run verify:all
```

Run Electron smoke only if visible renderer layout/CSS changes:

```powershell
npm.cmd run smoke:electron
```

Do not run by default:

- live provider smoke
- manual shortcut validation
- real SDE refresh/download

## Decision Needed

Human/Sense should decide whether the next Sense move is:

1. UI/UX advisory for a Passive Telemetry instrument band.
2. Dev runway for a tiny renderer-only Passive Telemetry band prototype.
3. Park until Sense has a larger post-M14 milestone.

Overseer recommendation:

Choose option 1 first. The Lab M19 pattern is promising, but Sense should get one UI/UX pass to decide exact lane hierarchy, copy, density, and detail reveal behavior before Dev touches renderer code.

## Bottom Line

Lab M19 gives Sense a usable shape, not a meaning layer.

The portable contribution is a compact instrument grammar for bridge-fed state: primary value, state marker, basis/freshness, gaps/warnings, and detail reveal. Sense should adapt that grammar through Sense-owned lane terms and backend-owned snapshots.
