# SenseAdoptionHS01: Aura Lab Bridge State Readout Review

Status: Advisory Sense-owned adoption review, not project authority
Date: 2026-05-24
Role: AURA-Sense Overseer / UI-UX reviewer

## 1. Role And Boundary

This review evaluates Aura Lab's accepted neutral post-bridge presentation pattern, Bridge State Readout, for possible AURA-Sense use.

Boundary:

- no implementation
- no Sense contract renames
- no shared doctrine creation
- no Lab fixture import
- no Atlas evidence semantics
- no live provider smoke or manual shortcut validation

Recommendation: adapt.

Bridge State Readout is structurally useful for Sense, but its labels and physical treatment must be Sense-owned and lane-specific. It should not be adopted wholesale.

## 2. Files Reviewed

Project-local authority:

- `workspace/current.md`
- `workspace/overview.md`
- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/roadmap/milestone-14-back-page-threat-intel-ux.md`
- `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`

Advisory Lab context supplied by the human:

- Bridge State Readout labels: `CURRENT`, `UPDATING`, `AGED`, `PARTIAL`, `UNAVAILABLE`, `FALLBACK`, `NO DATA`
- Bridge State Readout fields: source coverage, readout age, basis, gaps, warnings, secondary diagnostics

## 3. Repo-Verified Sense Facts

- AURA-Sense is a transient tactical viewport for recent EVE operational observations.
- Renderer presents bridge-fed/backend-owned snapshots; backend/main-process services own ingestion, normalization, caching, computation, and live API orchestration.
- Combat Witness, Passive Telemetry, Threat Intel, and Clipboard Acquisition are separate lanes/workflows and must not collapse into one global threat object.
- Combat Witness is the primary tactical lane and must stay short-window, observed, and non-historical.
- Passive Telemetry already has current-system context, scoped zKill/ESI provider state, live IO gate state, freshness, cache age, partial, degraded, blocked, and unavailable status.
- Threat Intel is deliberate operator-initiated scan/review, back-page first, and must not imply complete zKill coverage or historical intelligence storage.
- Clipboard Acquisition is a brief visible authority window with idle/listening/cooldown behavior; listening is a state, not a mode.
- Live/manual validation remains gated outside normal verification.

## 4. Advisory Context Used

Lab's Bridge State Readout appears to offer a neutral presentation shell for bridge-fed state:

- current/updating/aged/partial/unavailable/fallback/no-data labels
- source coverage
- readout age
- basis
- gaps
- warnings
- secondary diagnostics

This review treats those as advisory mechanics only. They are not Sense contracts.

## 5. Sense Output Model To Preserve

Sense output should remain:

- compact
- tactical
- lane-specific
- backend-owned
- freshness-aware
- uncertainty-honest
- visually quiet unless operator action or trust degradation matters

Sense must keep the priority order already documented in `hud-snapshot.md`: Combat Witness first, Passive Telemetry and Threat Intel as supporting lanes, event stream and controls as operational detail.

## 6. Best First Sense Lane For Trial

Best first trial lane: Passive Telemetry.

Reason:

- Passive Telemetry already exposes source coverage-like fields: zKill sample count, ESI activity, cache state, provider basis, freshness, live IO gate, partial/failure state.
- It is less tactically fragile than Combat Witness, where label changes can accidentally distort immediate combat meaning.
- It is less trust-sensitive than Clipboard Acquisition, where `listening`, `pulling`, `sealed`, and `cooldown` already carry authority semantics.
- It is less semantically loaded than Threat Intel's back-page report, which just finished a milestone and must not be turned into historical intelligence storage.

Lane ranking for first test:

1. Passive Telemetry: best first target.
2. Runtime diagnostics/settings: useful secondary target for diagnostics demotion, but less representative of tactical readout.
3. Threat Intel: useful later for the report, but only after Passive proves wording and density.
4. Combat Witness: defer until the pattern proves it will not weaken live tactical scanability.
5. Clipboard Acquisition: defer; its authority-window language is already carefully bounded.

## 7. Lab Mechanics That Appear Useful

- Source coverage: useful if translated to Sense terms like provider basis, zKill sample, ESI activity, cache age, and live IO state.
- Readout age: useful for Passive Telemetry freshness and cache age, and later for Combat Witness latest observed age.
- Basis: already a Sense term in Passive and Threat lanes; useful if kept as "why this readout says what it says."
- Gaps: useful as quiet secondary detail for partial provider response, unresolved local system ID, blocked live IO, missing gamelog path, or deferred ESI expansion.
- Warnings: useful only for operator-actionable or trust-relevant states; should not become noisy.
- Secondary diagnostics: strongly useful if demoted behind the existing diagnostics surface and not mixed into the main tactical read.
- Family/state separation: useful for preventing one lane's stale/partial state from masquerading as another lane's current state.
- Fixture-backed display mapping and visual smoke expectations: useful for future UI/UX prototyping and renderer shell checks.

## 8. Lab Mechanics That Are Unsafe Or Irrelevant

- Wholesale label import is unsafe. `CURRENT`, `AGED`, `FALLBACK`, and `NO DATA` are too generic for Sense unless bridged to lane-owned copy.
- A physical "readout" treatment could become too panel-heavy for the compact overlay if every lane grows a formal diagnostics block.
- `FALLBACK` may imply alternate truth or graceful degradation where Sense only has fixture/static metadata, local resolution, or gated live IO.
- `CURRENT` may overstate truth for provider data or combat observations. Sense often knows "observed recently," not absolute current reality.
- `UPDATING` is unsafe for Clipboard Acquisition if it blurs active clipboard authority with scan progress.
- `NO DATA` may erase meaningful distinctions between no observation, blocked authority, unavailable bridge, unresolved target, empty sample, or provider failure.
- Any Lab "Briefing", "Neutral Seed", `aura.projectBriefing`, or `aura.presentationFixture` semantics must remain outside Sense.

## 9. Sense-Owned Naming

Recommended Sense-owned mapping for a Passive Telemetry trial:

| Lab label | Sense-owned display wording | Notes |
| --- | --- | --- |
| `CURRENT` | `Fresh` or `Recent context` | Use only when current-system context is within the lane freshness window. |
| `UPDATING` | `Refreshing` | Use for provider/cache refresh, not for clipboard authority. |
| `AGED` | `Stale context` | Better than "aged" because Sense already uses freshness/staleness doctrine. |
| `PARTIAL` | `Partial sample` | Preserve sample honesty and cap/failure visibility. |
| `UNAVAILABLE` | `Unavailable` | Use for no observed current system, missing bridge, or absent source, not blocked live IO. |
| `FALLBACK` | `Local only` or `Static lookup` | Use sparingly; do not imply fallback provider truth. |
| `NO DATA` | `No observation` or `No provider sample` | Pick lane-specific copy rather than a universal label. |

Keep existing Sense terms where they already carry accepted meaning:

- `blocked` / `Live IO blocked`
- `degraded`
- `stale`
- `partial`
- `capped`
- `No scan`
- `No provider`
- `Gateway`
- `Pulling`
- `Scanning`
- `Cooldown`
- `Observed source`
- `Observed repair balance`

## 10. Sense-Specific Adaptations Required

- Use lane-specific readout families: Combat Witness, Passive Telemetry, Threat Intel, Clipboard Acquisition, Runtime.
- Keep backend status names distinct from user-facing labels.
- Use "observed", "sample", "basis", "freshness", and "blocked" with Sense meanings.
- Let readout age express freshness without implying archival history.
- Keep gaps as compact trust/context chips or diagnostics rows, not primary tactical labels.
- Keep warnings sparse and action-oriented.
- Demote secondary diagnostics to the existing diagnostics panel unless a trust failure affects the primary read.
- Do not add a global Bridge State Readout object that merges lane truth.

## 11. What Must Stay Sense-Specific

- Tactical observation.
- Transient combat state.
- Backend-owned truth.
- Live IO gating.
- Combat Witness rolling windows.
- Passive Telemetry current-system context.
- Threat Intel deliberate scan/review.
- Clipboard authority window and seal/cooldown behavior.
- Gateway and target-type chord semantics.
- Sample/cap/partial language.
- Observed source, observed weapon, and observed repair balance limitations.

## 12. What Must Not Be Imported From Lab

- Lab fixture copy.
- Briefing semantics.
- Neutral Seed semantics.
- Lab contract names such as `aura.projectBriefing` or `aura.presentationFixture`.
- A universal visual readout shell that overrides Sense compact overlay hierarchy.
- Generic label meanings that erase Sense lane distinctions.
- Any assumption that Lab's presentation grammar is Sense product authority.

## 13. What Must Not Be Imported From Atlas

- Evidence storage semantics.
- Historical intelligence record language.
- Watch execution or watchlist meaning.
- Actor/system case-building language.
- Durable report/archive expectations.
- "Assessment" style conclusions that exceed Sense's sampled/live-gated data.

## 14. Bridge/State/Smoke Patterns That Might Be Safely Universalized

Potentially portable structure:

- backend/bridge-fed state rendered without renderer-owned truth
- lane or family identifier plus state identifier
- source/basis/freshness/certainty slots
- primary summary with secondary diagnostics
- explicit partial/blocked/unavailable/missing distinctions
- fixture-backed presentation families
- visual smoke coverage for representative states
- narrow viewport and long-text pressure cases

Do not universalize Sense meanings. Universalize only the shape.

## 15. Physical Readout Treatment Fit

Fits Sense only if adapted as a compact inline readout, not a large instrument panel.

Good fit:

- one Passive Telemetry compact readout cluster showing system, provider basis, freshness/cache age, and state
- secondary row for gaps/warnings only when trust is affected
- diagnostics detail behind the existing diagnostics panel
- visual density comparable to existing provider pulse and basis copy

Poor fit:

- large card stack
- marketing/briefing style presentation
- universal readout blocks for every lane on the front page
- labels that compete with Combat Witness pressure, repair, and observed contact

## 16. Smallest Safe Prototype

Recommended smallest prototype: Passive Telemetry Bridge State Readout spike, Sense-owned.

Scope:

- no contract rename
- no provider changes
- no live API run
- no shared doctrine
- no Lab fixture import
- no Threat Intel or Clipboard changes

Prototype behavior:

- map existing Passive Telemetry snapshot fields into a compact readout family in renderer presentation only
- preserve existing backend status fields
- present state as Sense-owned copy: Fresh, Refreshing, Stale context, Partial sample, Live IO blocked, Unavailable, Degraded, Local only where appropriate
- show basis/source coverage from existing zKill/ESI/cache fields
- show readout age/cache age only when already present in the snapshot
- demote gaps/warnings to compact secondary copy or diagnostics panel
- add fixture/smoke expectations for fresh, stale, partial/capped, blocked, unavailable, degraded, and narrow viewport

## 17. Required Verification

For a future Dev packet only:

- `npm.cmd run verify:renderer-shell`
- `npm.cmd run verify:renderer-boundary`
- `npm.cmd run verify:renderer-boundary-adversarial`
- `npm.cmd run verify:passive-telemetry`
- `npm.cmd run verify:all`
- `npm.cmd run smoke:electron` if renderer visual states change

Keep gated:

- live provider smoke
- manual operator shortcut validation
- gameplay-focus global shortcut validation
- real SDE refresh/download

## 18. Risks

- Generic labels could flatten important Sense distinctions: blocked vs unavailable vs degraded vs partial vs no observation.
- `CURRENT` could overstate real-time truth.
- `FALLBACK` could imply accepted alternate provider truth where Sense only has local/static lookup.
- A readout panel could crowd the compact tactical viewport and weaken Combat Witness priority.
- Applying the pattern to Clipboard Acquisition too early could poison the carefully bounded authority model.
- Applying it to Threat Intel too early could make the latest-scan report feel like historical intelligence storage.
- Shared-language enthusiasm could turn a Sense-owned adaptation into premature Core doctrine.

## 19. Human Decisions Needed

- Confirm whether Passive Telemetry should be the first prototype lane.
- Choose whether user-facing state copy should use `Fresh` or `Recent context` for the Lab `CURRENT` equivalent.
- Decide whether `Local only` is acceptable for the Lab `FALLBACK` equivalent, or whether fallback language should be avoided entirely.
- Decide whether the prototype should be UI/UX advisory only first, or proceed directly to a small Dev packet.

## 20. Recommended Next Role/Action

Recommended next action: UI/UX packet, then Dev only if accepted.

Suggested next bounded packet:

```txt
Sense UI/UX: design a Passive Telemetry Bridge State Readout prototype using existing snapshot fields only. Produce copy/state mapping, compact layout behavior, and visual smoke expectations. Do not implement code, rename contracts, import Lab fixtures, or run live/manual validation.
```

If the human wants implementation immediately after that UI/UX mapping, create a separate Dev runway limited to Passive Telemetry renderer presentation and verification.

## 21. What Should Stay Sense-Local

- all lane meanings
- all user-facing copy for tactical state
- all clipboard authority language
- all Combat Witness observation limitations
- all Threat Intel sample/cap/blocked wording
- all no-Atlas-storage boundaries

## 22. What Might Later Belong In Shared Orchestration

- neutral slot names: family, state, source, freshness, basis, gaps, warnings, diagnostics
- expectation that renderer does not own bridge truth
- fixture-backed state families
- visual smoke cases for fresh/current, updating, stale/aged, partial, unavailable, blocked, failed, fallback/local-only, no-data/no-observation
- rule that projects own semantic labels even when they share presentation structure

