# Audit: Documentation Drift Overseer Review

Date: 2026-05-22
Scope: Full documentation drift pass across current-state, terms, roadmap, active gap packets, and historical Aura 7/Aura Core references.

## Readiness Verdict

Accepted with cleanup completed.

AURA-Sense had documentation drift, but not a broken doctrine spine. The drift was mostly naming and precedence: current-facing docs over-described AURA-Sense as an Aura 7 rewrite or Aura Core seed, while the actual project direction is now AURA-Sense tactical viewport development with historical lineage preserved as reference.

## Findings

### P1: Product Identity Was Too Dependent On Lineage

Files affected:

- `README.md`
- `docs/index.md`
- `docs/terms/aura-sense.md`
- `docs/current-state/current-implementation.md`
- `docs/current-state/seed-current-state.md`

Several current-facing docs described AURA-Sense as a rewrite track first. That phrasing risked making Aura 7 the product identity and making AURA-Sense look like a porting exercise.

Resolution:

- AURA-Sense is now named as the current product direction.
- Aura 7 is described as historical lineage.
- Current implementation truth is tied to current-state records and verification.

### P1: Seed Origin Was Too Close To Product Doctrine

Files affected:

- `README.md`
- `docs/current-state/current-implementation.md`
- `docs/current-state/seed-current-state.md`
- `docs/statements/seed-doctrine.md`

The docs correctly preserved reusable rigging, but some wording made Aura Core sound like the product foundation rather than a starting scaffold.

Resolution:

- Aura Core is now framed as seed rigging and infrastructure.
- Product doctrine remains AURA-Sense-specific.
- Seed lineage has a historical-state note so it cannot outrank current implementation truth.

### P2: Terms Index Was Stale

File affected:

- `docs/terms/README.md`

The terms index omitted active terms and still called the set "seed terms."

Resolution:

- Added `aura-sense.md`, `core-seed.md`, `metadata.md`, `first-light.md`, and `development-artifact.md` to the index.
- Added new terms for First Light and Development Artifact.

### P2: Parity Framing Was Too Easy To Misread

Files affected:

- `docs/gap/to-do/aura-sense-rewrite-readiness.md`
- `docs/roadmap/milestone-03-tactical-viewport-first-light.md`

"Aura 7 parity" phrasing made the next work sound like matching an old implementation rather than proving AURA-Sense tactical readiness.

Resolution:

- Replaced parity language with tactical viewport readiness.
- Preserved the guardrail that First Light is narrow and not full tactical readiness.

### P3: Historical Records Remain Noisy By Design

Folders affected:

- `docs/Concept`
- `docs/research`
- older `docs/audits`

Historical Aura 7 content remains intentionally present. Rewriting those documents would blur provenance and weaken the artifact trail.

Resolution:

- Kept historical records intact.
- Updated current entry points to mark historical docs as lineage only.

## Milestone Progress

Milestone 01 remains complete.

Milestone 02 remains complete.

Milestone 03 remains active. Its direction is still correct: build the first product-facing renderer surface over backend-owned Combat Witness snapshots, with freshness language and renderer boundary verification.

This audit does not authorize scope expansion beyond First Light.

## Doctrine Drift Assessment

Drift found:

- identity drift toward "Aura 7 rewrite"
- seed-origin drift toward "Aura Core product"
- parity drift toward matching historical implementation

Drift corrected:

- AURA-Sense is the current product.
- Aura 7 is lineage.
- Aura Core is seed rigging.
- Current-state and latest audit records outrank older historical notes.

No evidence found that the active architecture has drifted into Atlas, persistence, renderer-owned telemetry, or speculative intelligence.

## Architectural Risk

Current risk is documentation interpretation, not runtime architecture.

The main risk for the next Dev session is still First Light scope creep:

- renderer starts computing tactical truth
- event streams become unbounded
- Combat Witness copy implies complete combat certainty
- historical docs are used to justify unverified features

## Artifact Assessment

AURA-Sense is keeping an artifact of development.

The artifact trail is sufficient if future sessions enter through:

1. `docs/current-state/current-implementation.md`
2. latest Overseer audit
3. active milestone
4. active gap packets

The new `docs/terms/development-artifact.md` records when new memory is warranted.

## Updated Records

- `README.md`
- `docs/index.md`
- `docs/current-state/current-implementation.md`
- `docs/current-state/seed-current-state.md`
- `docs/statements/seed-doctrine.md`
- `docs/terms/README.md`
- `docs/terms/aura-sense.md`
- `docs/terms/aura-7.md`
- `docs/terms/first-light.md`
- `docs/terms/development-artifact.md`
- `docs/gap/to-do/aura-sense-rewrite-readiness.md`
- `docs/gap/to-do/performance-stability-compute-readiness.md`
- `docs/gap/to-do/readiness-12-tactical-hud-first-light.md`
- `docs/gap/complete/documentation-drift-lineage-clarification.md`
- `docs/roadmap/milestone-01-startup-rigging.md`
- `docs/roadmap/milestone-02-runtime-observability.md`
- `docs/roadmap/milestone-03-tactical-viewport-first-light.md`
- `docs/roadmap/development-artifact-trail.md`

## Handoff To Next Dev Session

Authorized next slice:

```txt
docs/gap/to-do/readiness-12-tactical-hud-first-light.md
```

Use this sequence:

1. Confirm the Combat Witness snapshot shape exposed to renderer.
2. Define fresh, stale, empty, and unavailable copy before layout work.
3. Render only backend-owned snapshot state.
4. Keep event display bounded.
5. Extend renderer boundary verification if the new surface creates new import or parsing risks.
6. Run `npm.cmd run verify:all`.
7. Update current-state and completion evidence if behavior changes.

Do not:

- add Passive Telemetry
- add Threat Intel
- add pressure gauges
- add historical storage
- import Combat Witness parser/core into renderer
- use historical Aura 7 docs as implementation proof

## Closeout Requirement

Close this documentation drift pass with:

```powershell
npm.cmd run verify:all
git status --short
git add ...
git commit -m "Clarify AURA-Sense documentation lineage"
git status --short
```
