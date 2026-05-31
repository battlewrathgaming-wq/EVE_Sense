# AURA-Sense Overseer Heading Report

Status: Advisory heading report, not accepted project authority.
Date: 2026-05-24
Role: AURA-Sense Overseer

## 1. Project Heading

AURA-Sense is becoming a transient tactical viewport for recent EVE Online operational observations: a compact, uncertainty-aware overlay that presents live or recent tactical state without becoming a historical evidence workstation, a broad intelligence archive, or a presentation sandbox. Its center of gravity is backend-owned tactical truth, renderer-owned presentation, explicit live gates, lane-specific degraded state, and operator-facing honesty about freshness, source, confidence, partiality, and failure.

## 2. Current Project State

Repo-verified state: AURA-Sense has a verified Electron runtime foundation, preload bridge boundary, renderer shell and boundary verification, service command/event boundaries, Combat Witness, Passive Telemetry, Threat Intel, Clipboard Acquisition, runtime settings, live IO policy controls, diagnostics, Electron visual smoke, and fixture-backed aggressive verification.

The current active milestone is Milestone 13, Aggressive Testing And Bug Hunting. `workspace/current.md` identifies HS01 as active, with Dev as current executor and provider/live fault hardening plus runtime settings/diagnostics fault behavior as the current focus.

Milestone 14 is proposed/planned as Back-Page Threat Intel UX. It is not the active execution packet, but it is important future shape for Sense's user-facing model.

## 3. Owned Tool Function

Sense owns the tactical viewport function: observe recent operational signals, compute bounded tactical snapshots, show operator-useful current state, and make trust conditions visible. Its tool function is not durable investigation, case building, broad collection, or historical evidence management.

Current lanes are:

- Combat Witness: recent combat-log-derived tactical pressure and repair observations.
- Passive Telemetry: current-system operational context with live-gated provider basis.
- Threat Intel: explicit target scan or bounded clipboard acquisition leading to scoped provider-backed report state.

## 4. Owned User-Facing Semantics

Sense owns these user-facing meanings:

- tactical observation
- transient combat state
- observed pressure, repair throughput, repair balance, observed source, weapon labels, and bounded spike hints
- live-gated provider context
- blocked, stale, partial, capped, degraded, unavailable, and failed lane states
- clipboard authority as a brief, visible, sealed acquisition state
- report persistence until next scan, without turning the report into historical storage
- backend-owned truth with renderer presentation only

## 5. Shareable Structure Candidates

Shareable structure candidates, if stripped of Sense meaning:

- source/freshness/certainty slots
- primary summary plus secondary diagnostics
- loading, empty, populated, stale, failed, partial, gated, blocked, unavailable, and degraded states
- action-effect copy that states what happened, what did not happen, and what remains unavailable
- renderer/presenter is not the truth owner
- backend/domain service owns snapshots and state
- bridge allowlists, payload validation, and subscription cleanup verification
- fixture-backed state matrices
- separation between offline confidence, Electron visual smoke, live API smoke, live operator smoke, and manual bug hunts
- visual smoke evidence for constrained viewport, degraded, blocked, partial, cooldown, diagnostics, and settings states

## 6. Project-Local Terms That Must Not Be Generalized

Keep project-local:

- Combat Witness
- Passive Telemetry
- Threat Intel, when used with EVE provider meaning
- tactical viewport
- tactical observation
- transient combat state
- gamelog watcher
- zKill/ESI basis
- live IO gate, when tied to Sense provider behavior
- clipboard authority UX
- Search / Display, Gateway, Pulling, Scanning, Cooldown, and target type semantics from Milestone 14

These may inspire neutral structures, but the terms themselves carry Sense product meaning.

## 7. Expected Bridge/State/Error Classes That Might Be Neutral Constants Later

Potential neutral classes:

- `idle`
- `loading`
- `ready`
- `empty`
- `populated`
- `stale`
- `partial`
- `capped`
- `gated`
- `blocked`
- `unavailable`
- `degraded`
- `failed`
- `cooldown`
- `diagnostic`
- `source`
- `freshness`
- `certainty`
- `basis`
- `summary`
- `details`
- `actionAvailable`
- `actionBlocked`
- `actionInProgress`
- `actionSealed`

Potential neutral bridge/error classes:

- command allowlist failure
- payload validation failure
- subscription cleanup failure
- provider timeout
- provider cancel
- provider retry exhaustion
- provider rate limit
- provider server failure
- malformed provider response
- stale cache
- revalidation failure
- corrupted settings
- schema drift
- missing or invalid directory
- permission-like filesystem failure
- diagnostic redaction/sanitization failure

## 8. What Lab Can Safely Model

Lab can safely model fixture-backed presentation families that use neutral states and placeholder meanings. For Sense-like families, Lab may model:

- compact operational lanes
- source/freshness/certainty slots
- partial/capped/blocked/stale/failure presentation
- primary summary with secondary diagnostics
- action-effect copy
- visual smoke matrices for constrained overlays
- fixture-only provider samples

Lab should not model Sense as an accepted target adapter, should not use live EVE semantics as authority, and should not turn Sense UX into Lab doctrine.

## 9. What Core Might Eventually Own

Core might eventually own neutral middleware/bridge structure such as:

- service command registry shape
- bridge allowlist verification pattern
- payload validation helpers
- task/status vocabulary
- message taxonomy utilities
- HTTP client wrapper patterns
- generic snapshot/event fan-out rigging
- offline versus runtime versus live/manual verification taxonomy
- smoke artifact conventions

Core should not absorb Sense tactical meaning, EVE provider assumptions, clipboard UX semantics, or product lane definitions without a separate Core-owned neutralization packet.

## 10. Current Cadence And Active Handoff Status

Cadence read: active but needs refresh.

`workspace/current.md` is active, dated 2026-05-23, and names HS01 as the current sequence. There are no active handoff files visible directly under `workspace\`, and `workspace\complete\` contains only its README rather than completed milestone handoff folders.

Shared orchestration synthesis says Sense should refresh or pause HS01 before shared presentation work references Sense. That is advisory orchestration context, not project authority, but it matches the local read: the active packet remains coherent, yet alignment pressure means Overseer should make an explicit cadence decision.

## 11. Risks Of Double Work Or Terminology Drift

Double-work risks:

- Milestone 13 hardening may define state behavior that Milestone 14 UX later rediscovers with different terms.
- Lab may model Sense-like presentation states before Sense has refreshed HS01.
- Core could prematurely absorb bridge/smoke ideas before Sense separates reusable structure from tactical meaning.
- Shared orchestration may create vocabulary that competes with Sense's existing lane/status terms.

Terminology drift risks:

- importing Atlas evidence words such as case, evidence store, archive, investigation desk, or accepted evidence
- importing Lab words as if they are Sense authority
- treating report persistence as historical storage
- treating provider samples as complete coverage
- treating clipboard listening as an ongoing mode rather than a brief sealed state
- treating archived `docs/gap` files as active work queues

## 12. Human Decisions Needed

Human decisions needed:

- Should Sense HS01 continue immediately, or should Overseer explicitly pause it for alignment review?
- Should Sense produce a small project-owned source map for neutral state/bridge/smoke candidates after HS01 is refreshed?
- Should Milestone 14 UX wait until provider/runtime hardening finishes, or can UX planning proceed in advisory form?
- Should shared orchestration use `fixture-backed presentation family` as the safer term until target projects accept it?
- Which Sense terms should be considered forbidden in shared grammar because they carry too much tactical/EVE-specific meaning?

## 13. Recommended Next Role/Action

Recommended next role: AURA-Sense Overseer.

Recommended action: perform a normal project-authority pass that either refreshes HS01 or explicitly pauses it. Do not write universalization work into `workspace/current.md` unless the human chooses to make alignment the next accepted Sense activity. If HS01 continues, keep it focused on Milestone 13 provider/live fault hardening and runtime settings/diagnostics faults.

## 14. Suggested Heading Artifact Name

`workspace\OverseerHeading-sense-2026-05-24.md`
