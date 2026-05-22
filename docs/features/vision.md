# Feature Vision: AURA-Sense Product Elements

Status: Active
Date: 2026-05-22

## Purpose

This document defines the fixed product elements AURA-Sense is working toward.

It is not an implementation backlog. It is a set of goalposts so Dev can refine implementation without drifting into feature accumulation.

## Product Frame

AURA-Sense is a tactical cognition and situational awareness system.

It should answer:

```txt
What is happening around me right now?
What must I notice?
What is stale, partial, unavailable, or uncertain?
```

It should not become:

- Atlas
- a historical intelligence warehouse
- a recommendation engine
- a general EVE dashboard
- a renderer-owned telemetry engine

## Element 1: Tactical HUD Shell

Goal:

Provide a compact always-available viewport that presents current tactical state without demanding interpretation time.

User value:

- glanceable state under pressure
- stable visual hierarchy
- low ambiguity copy
- fast recognition of fresh, stale, empty, and unavailable states

Inputs:

- backend-owned snapshots
- bounded backend-owned event streams
- diagnostics state

Must not:

- compute telemetry truth in renderer
- become a decorative dashboard
- hide degraded state
- imply complete battlefield knowledge

Acceptance goalpost:

The HUD can present one verified backend snapshot lane with clear freshness and no renderer-owned tactical computation.

## Element 2: Combat Witness

Goal:

Convert local EVE combat log observations into short-window tactical awareness.

User value:

- recent incoming damage awareness
- recent repair/healing awareness
- compact rolling context
- bounded event memory for immediate perception

Inputs:

- EVE gamelog lines
- parser fixtures
- backend rolling cache
- 5s/15s/30s snapshots

Must not:

- become historical combat storage
- infer intent or allegiance without evidence
- issue recommendations
- expose raw parser authority to the renderer

Acceptance goalpost:

Backend can answer what was witnessed recently, with bounded retention and verified parser behavior, and the renderer can present that state as observation rather than certainty.

## Element 3: Passive Telemetry

Goal:

Read current system transitions from EVE logs and provide a low-frequency zKillmail context probe for the system the operator has just entered.

User value:

- current system context
- gate-jump awareness
- local environment cues
- low-noise background state
- reduced manual lookup pressure

Inputs:

- EVE log observation for gate jumps or current-system changes
- current system name or ID resolution
- scoped zKillmail fetch for the current system
- local/static metadata where practical
- freshness and last-updated metadata

Must not:

- poll aggressively
- create hidden background intelligence collection
- merge into Threat Intel
- store long-term history
- repeatedly fetch while the operator remains in the same system
- imply that zKillmail activity is complete tactical truth

Acceptance goalpost:

When the operator jumps into a system, AURA-Sense can detect the current system from logs, run a scoped zKillmail context fetch, and present a compact fresh/stale/unavailable system context without turning it into an active Threat Intel scan.

## Element 4: Threat Intel

Goal:

Support deliberate scoped tactical inspection through an operator-driven search bar for a system, pilot, corporation, alliance, or copied target.

User value:

- fast sampled threat context
- visible evidence basis
- clear partial/complete/capped language
- bounded external API behavior

Inputs:

- typed search bar target
- user-initiated scan target
- local/static resolution where possible
- zKill discovery refs
- zKillmail query results
- sample, cap, failure, and freshness metadata
- optional ESI-expanded killmails only if a future milestone explicitly authorizes expansion

Must not:

- treat zKill summaries as truth
- run broad background scraping
- hide sample limits
- become Atlas reporting
- auto-run from passive system telemetry
- add ESI expansion by default

Acceptance goalpost:

The operator can type or paste a target into the search bar, run a scoped zKillmail-backed probe, and receive a tactical snapshot with visible sample size, freshness, cap, and failure metadata.

## Element 5: Clipboard Acquisition

Goal:

Let the operator deliberately acquire a copied EVE target for a short tactical workflow.

User value:

- low-friction target entry
- no persistent clipboard surveillance
- clear armed/listening/sealed state

Inputs:

- visible acquisition indicator
- Ctrl+Shift keyboard chord to arm acquisition
- 3 second arming window
- 3 second clipboard listening window
- validation and target classification
- automatic transfer into the search box and scan run when a valid target is captured
- cooldown after capture, timeout, or cancellation

Must not:

- listen indefinitely
- silently capture unrelated clipboard content
- trigger broad background scans
- blur with passive telemetry
- remain armed without a visible indicator
- bypass the search bar / Threat Intel scan boundary

Acceptance goalpost:

The operator can press Ctrl+Shift, see an armed visual indicator, copy a target within the short listening window, have AURA-Sense place the target into the search box and run the scoped scan, then see the listener seal and enter cooldown.

## Element 6: Diagnostics And Degraded State

Goal:

Make runtime confidence observable without flooding the operator.

User value:

- degraded states are visible
- failures are explainable
- normal operation remains quiet
- Dev can verify behavior without guessing

Inputs:

- watcher diagnostics
- parser/listener failures
- API client diagnostics
- runtime error diagnostics
- renderer process status

Must not:

- spam the HUD
- hide errors behind optimistic UI
- mix Dev logs with operator-facing state without filtering

Acceptance goalpost:

Important degraded states are surfaced through shared diagnostics policy while routine noise is throttled or suppressed.

Runtime confidence goalpost:

AURA-Sense can launch the real Electron shell in explicit smoke mode, capture first-light visual evidence, write a structured result file, and exit cleanly without live logs or network calls.

## Element 7: Settings And Runtime Control

Goal:

Allow the operator to configure required runtime paths and modes without putting services into invalid states.

User value:

- clear setup path
- recoverable misconfiguration
- explicit validation messages
- no silent runtime drift

Inputs:

- gamelog folder path
- window/display preferences
- diagnostics preference
- future lane-specific toggles

Must not:

- accept invalid paths silently
- restart watchers without validation
- expose internal implementation toggles as product controls

Acceptance goalpost:

Settings changes are validated before service mutation and degraded states remain visible when configuration is incomplete.

## Element 8: Local Metadata

Goal:

Resolve tactical labels locally where practical so AURA-Sense avoids unnecessary live lookup.

User value:

- readable ship, type, and system labels
- lower latency
- lower API dependence
- clearer unresolved states

Inputs:

- compact local metadata adapters
- explicit unresolved ID fallback
- scoped consumers from Passive Telemetry or Threat Intel

Must not:

- import heavy static datasets before consumers exist
- hide unresolved IDs
- make metadata freshness claims it cannot prove

Acceptance goalpost:

Known IDs resolve locally for active consumers, unknown IDs remain visible, and no large metadata dependency is added before the product needs it.

## Element 9: External API Boundary

Goal:

Keep live external calls scoped, respectful, observable, and replaceable.

User value:

- reliable tactical scans
- clear unavailable/degraded language
- no hidden broad fetch behavior

Inputs:

- explicit user-initiated requests
- injectable HTTP client
- request timeout/cancel/retry policy
- cache and diagnostics policy

Must not:

- call APIs from renderer
- run broad discovery without user intent
- retry noisily under failure
- hide sample or freshness limits

Acceptance goalpost:

Every live request path has a scoped caller, timeout, cancellation path, diagnostics, and verification outside the renderer.

## Element 10: Atlas Handoff

Goal:

Permit future handoff to AURA Atlas without importing Atlas behavior into AURA-Sense.

User value:

- tactical now remains separate from historical later
- durable investigation can happen elsewhere
- AURA-Sense stays lightweight

Inputs:

- explicit exported context, if ever justified
- operator action
- clear boundary copy

Must not:

- persist evidence by default
- run watch execution
- create hidden reporting stores
- blur tactical observation with historical proof

Acceptance goalpost:

No Atlas behavior exists in AURA-Sense core unless a future ADR defines an explicit handoff boundary.

## Implementation Refinement Rule

Before implementing a feature element, Dev should identify:

- the target element in this document
- the active feature-aligned milestone in `docs/roadmap/feature-aligned-milestones.md`
- the current gap packet
- the backend owner of truth
- the renderer presentation contract
- verification that proves the slice
- explicit deferrals

If a slice cannot answer those points, it is not ready for implementation.

Milestones should group related tasks into feature outcomes. The feature vision sets the goalposts; milestone task chains give Dev room to work without turning every small implementation step into a separate user decision.
