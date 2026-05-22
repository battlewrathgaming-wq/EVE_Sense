# Audit: AURA-Sense Reconceptualization Handover

Date: 2026-05-22
Scope: Remove imported naming ambiguity, reconceptualize docs as AURA-Sense, and establish feature-level goalposts for implementation refinement.

## Verdict

Accepted.

AURA-Sense now has a stronger documentation posture:

```txt
AURA-Sense is the product.
AURA-Sense owns the tactical viewport vision.
Feature goalposts guide implementation.
Current-state and verification define what exists.
```

## What Changed

- Active docs were revised away from compatibility/parity framing.
- ADRs were renamed and rewritten around AURA-Sense tactical scope.
- The old standalone term was removed from `docs/terms`.
- Concept and research filenames were renamed into AURA-Sense language.
- The feature folder now includes `docs/features/vision.md`.
- The tactical readiness gap was renamed around tactical readiness.
- Previous documentation-drift artifacts were marked superseded or reframed.

## Feature Goalposts Added

`docs/features/vision.md` now defines fixed product elements:

- Tactical HUD Shell
- Combat Witness
- Passive Telemetry
- Threat Intel
- Clipboard Acquisition
- Diagnostics and Degraded State
- Settings and Runtime Control
- Local Metadata
- External API Boundary
- Atlas Handoff

Each element records:

- goal
- user value
- inputs
- must-not-do boundaries
- acceptance goalpost

## Milestone Direction

Milestone 03 remains active.

The next Dev session should still implement Tactical HUD First Light, but now it should explicitly map the work to:

- `docs/features/vision.md`
- Element 1: Tactical HUD Shell
- Element 2: Combat Witness
- `docs/gap/to-do/readiness-12-tactical-hud-first-light.md`

## Implementation Refinement Rule

Before implementation, Dev should identify:

- target feature element
- current gap packet
- backend owner of truth
- renderer presentation contract
- verification command
- explicit deferrals

If those are unclear, the slice is not ready.

## Guardrails

- Do not rebuild toward parity with prior naming or imported assumptions.
- Do not treat concept docs as runtime truth.
- Do not add feature panels outside the feature vision map.
- Do not implement Passive Telemetry or Threat Intel inside First Light.
- Do not let renderer compute tactical truth.
- Do not import Atlas persistence, watch execution, or historical evidence storage.

## Handoff To Next Dev

Authorized slice:

```txt
docs/gap/to-do/readiness-12-tactical-hud-first-light.md
```

Feature anchors:

```txt
docs/features/vision.md#element-1-tactical-hud-shell
docs/features/vision.md#element-2-combat-witness
```

Expected verification:

```powershell
npm.cmd run verify:all
```

Expected handover:

- feature element(s) touched
- renderer files touched
- snapshot fields consumed
- fresh/stale/empty/unavailable wording used
- boundary verification result
- explicit deferrals preserved
