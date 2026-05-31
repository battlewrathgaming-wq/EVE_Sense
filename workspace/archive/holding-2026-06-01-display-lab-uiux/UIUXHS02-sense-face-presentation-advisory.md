# UIUXHS02: Sense Face Presentation Advisory

Date: 2026-05-24
Role: UI/UX advisory worker
Project: AURA-Sense
Status: Advisory only, not Sense authority

## 1. Files Reviewed

Read directly:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `package.json`

Additional current renderer/context read for presentation facts:

- `workspace/SenseUIUXHS01-passive-telemetry-bridge-state-readout.md`
- `workspace/OverseerHS02-passive-telemetry-readout-prototype-review.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`

No verification commands were run. No code was changed.

## 2. Current-State Understanding

AURA-Sense is a transient tactical viewport for recent EVE operational observations. It is backend-owned, lane-bound, live-gated, and distinct from AURA Atlas historical evidence storage.

The renderer owns presentation, interaction, collapse/expand behavior, and visual prioritization. It does not own telemetry truth, provider calls, log parsing, history, or tactical computation.

The current frontend already has a compact integrated viewport with:

- Combat Witness as the primary pressure lane
- Passive Telemetry in the glance strip
- Threat Intel as a back-page drawer and deliberate scan surface
- Clipboard Acquisition as a short visible authority workflow
- diagnostics as a secondary panel
- live IO controls and visible blocked/off states

A recent Passive Telemetry Bridge State Readout prototype has been accepted as Sense-local renderer presentation. It preserves `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, and `No observation` while keeping Passive separate from Combat Witness and Threat Intel.

## 3. Recommended Face / Presentation Direction

Recommended direction:

```txt
Compact Sense Tactical Face
```

This should be a refined renderer treatment for the existing Sense surfaces, not a full redesign and not a Lab skin.

The face should feel like a compact tactical instrument panel for recent observations:

- Combat Witness is the first read.
- Passive Telemetry is contextual support.
- Threat Intel is deliberate inspection behind an operator action.
- Clipboard Acquisition is a short authority window feeding Threat Intel.
- Diagnostics are inspectable, demoted, and source-aware.

The presentation should answer quickly:

```txt
What is happening around me now?
What is observed, stale, partial, blocked, degraded, or unavailable?
Which lane owns this information?
```

Use tactical density, but keep state language honest. Do not turn the UI into historical proof, global threat score, or Atlas-like evidence/report surface.

## 4. Proposed Lane Hierarchy

Recommended first-read order:

1. Combat Witness pressure and repair balance.
2. Combat Witness observed source or observed weapon.
3. Passive Telemetry system context, kills, jumps, ratio, and sample state.
4. Threat Intel drawer state and latest deliberate scan basis.
5. Clipboard Acquisition authority state.
6. Diagnostics and runtime support.

Visual lane treatment:

- Combat Witness: dominant center lane, largest numeric readout, strongest motion/pressure affordance.
- Passive Telemetry: compact strip, small status chip, provider/sample basis text, no large card.
- Threat Intel: back-page drawer with deliberate input and last scan readout.
- Clipboard Acquisition: embedded acquisition widget, visible lifecycle, short-lived emphasis.
- Diagnostics: secondary drawer/panel, table-like but visually quieter.

## 5. Combat Witness Treatment

Combat Witness should be the face's primary tactical read.

Recommended first-read structure:

```txt
Combat Witness
Net observed balance
15s incoming DPS
15s repair HPS
Observed source
Observed weapon
```

Current concepts to preserve:

- `Combat Witness`
- `Observed Source`
- `Observed Weapon`
- `Observed repair balance`
- 5s/15s/30s rolling snapshot basis
- recent/witnessed/stale/degraded/unavailable distinctions

Recommended visual shape:

- Keep the circular net pressure gauge as the visual anchor.
- Present incoming and repair as paired rails: red/orange pressure vs cyan/blue repair.
- Label the center value as observed balance, not survival state.
- Let negative balance feel pressured, positive balance feel repaired, and zero feel quiet.
- Keep source/weapon as compact selectable or companion tiles, not evidence cards.

Copy guidance:

- Use `Observed`, `Recent`, `Witnessed`, `Incoming`, `Repair`, `Balance`.
- Avoid `proof`, `evidence`, `confirmed hostile`, `safe`, `breaking`, `surviving`, or predictive combat claims.
- Do not make Combat Witness look historical. It is recent rolling observation only.

## 6. Passive Telemetry Treatment

Passive Telemetry should remain contextual and lower priority than Combat Witness.

Recommended first-read structure:

```txt
System
Ship kills
Jumps
Ratio
Passive state
Provider/sample basis
```

Accepted state labels should remain:

- `Fresh context`
- `Stale context`
- `Partial sample`
- `Capped sample`
- `Live IO blocked`
- `Degraded`
- `No observation`
- `Provider pending` where existing fields support it

Visual treatment:

- Use a compact pill/chip for state.
- Keep sample basis as a short line, for example `zKill 4 + ESI 3 / 21 - Capped sample`.
- Keep system, kills, jumps, and ratio scannable even when provider detail is degraded.
- Use amber for stale/partial/capped/pending.
- Use red/muted danger only for degraded or blocked authority states.
- Use quiet absence for no observation.

Guardrail:

Passive Telemetry must not look like continuous Threat Intel. It is current-system context and low-frequency activity, not deliberate scoped target inspection.

## 7. Threat Intel / Clipboard Acquisition Treatment

Threat Intel should remain a back-page or drawer surface.

Recommended treatment:

- Preserve `Threat Intel` as deliberate scoped inspection.
- Keep search/captured target initiation explicit.
- Keep `No scan` distinct from no provider data and no observation.
- Show sample, cap, partial, blocked, failed, freshness, and basis metadata near the scan result.
- Keep zKill scope visible enough that sample data does not read as complete truth.

Threat Intel should not become a constant front-page threat monitor.

Clipboard Acquisition treatment:

- Preserve the short visible lifecycle: idle/listening/cooldown/blocked.
- Keep shortcut affordance visible but compact.
- Do not imply indefinite clipboard monitoring.
- The acquisition bar should feel like an armed moment, not a background watcher.

If the Sense face is visually refined, Threat Intel and Clipboard Acquisition should get cleaner material and motion, but not more authority.

## 8. Diagnostics Treatment

Diagnostics should be demoted without being hidden.

Recommended approach:

- Keep the diagnostics panel as a secondary surface.
- Preserve source, freshness, certainty/basis, gaps, warnings, live IO state, watcher state, and provider errors.
- Group diagnostics by lane: Combat, Passive, Threat, Runtime.
- Use compact instrument rows rather than raw debug dump styling.
- Keep sanitized diagnostics; do not expose raw private log content.

Visual treatment:

- Lower opacity/density than the main face.
- Smaller type and quieter borders.
- Use warnings sparingly.
- Keep critical blocked/degraded states visible in the primary lane first, with details in diagnostics.

## 9. State Grammar And Labels

Sense should use lane-specific state grammar instead of one global state enum.

Combat Witness:

- `Witnessed`
- `Recent`
- `Stale`
- `Quiet`
- `Degraded`
- `Unavailable`

Passive Telemetry:

- `Fresh context`
- `Stale context`
- `Partial sample`
- `Capped sample`
- `Live IO blocked`
- `Degraded`
- `No observation`
- `Provider pending`

Threat Intel:

- `No scan`
- `Pending`
- `Sampled`
- `Partial`
- `Blocked`
- `Degraded`
- `Ambiguous`
- `Unsupported`
- `Unresolved`

Clipboard Acquisition:

- `Idle`
- `Pulling` / `Listening` if Sense keeps both meanings visible
- `Cooldown`
- `Blocked`

Avoid collapsing these into generic `NO DATA`, `CURRENT`, `FALLBACK`, or `UNAVAILABLE` unless the lane-specific meaning is preserved nearby.

## 10. Field-To-Display Mapping Assumptions

Combat Witness:

- Incoming DPS: rolling Combat Witness incoming damage per second, currently visible as 15s incoming.
- Repair HPS: rolling repair per second, currently visible as 15s repair.
- Observed balance: received repair per second minus incoming damage per second.
- Observed source: top observed source from recent incoming events.
- Observed weapon: most observed weapon type/count from recent events.

Passive Telemetry:

- Fresh/stale/partial/blocked/degraded/unavailable from backend `passive.telemetry.snapshot.status` and freshness fields.
- System from `currentSystem.label`.
- Kills/jumps from ESI aggregate activity fields.
- zKill sample count/capped/partial from `zkill` fields.
- Static/local lookup only when resolver/source fields support it.

Threat Intel:

- Status from backend scan snapshot.
- Target and kind from resolved request/target fields.
- Sample and cap/partial state from zKill sample metadata.
- Live IO blocked from backend live IO gate state.

Clipboard Acquisition:

- Visible state from clipboard acquisition snapshot lifecycle.
- Scan result should feed Threat Intel, not create its own separate truth lane.

These are display assumptions only. They do not rename contracts, payloads, IPC, services, or bridge fields.

## 11. Narrow / Overlay Behavior

Sense is an overlay-like compact viewport. Narrow behavior matters more than desktop spaciousness.

Recommended constraints:

- Combat Witness pressure gauge and two rails stay visible first.
- Passive Telemetry compresses to system + state + one basis line.
- Observed Source / Observed Weapon can remain compact tiles or a single configurable tile.
- Threat Intel stays in the drawer unless actively opened.
- Diagnostics should take over the viewport only when explicitly opened.
- Long target labels, source labels, and provider basis strings must truncate with title/detail access, not wrap into the combat readout.
- Critical lane state should not be hover-only.

For very narrow shells:

- keep numeric readouts fixed-width enough to avoid layout bounce
- reduce labels before reducing values
- collapse secondary details before moving Combat Witness off-screen
- avoid full-width cards that break overlay density

## 12. What Must Stay Sense-Specific

Sense-specific and meaning-critical:

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
- `Observed repair balance`
- rolling window semantics
- current-system Passive context
- deliberate Threat Intel scan boundaries
- short clipboard authority window
- backend-owned truth and renderer boundary

Lab may inspire layout and presentation affordances, but Sense owns these meanings.

## 13. What Must Not Be Imported From Lab Or Atlas

Do not import from Lab:

- Lab fixture terminology
- Lab family/state taxonomy as Sense product structure
- generic `Bridge State Readout` labels where Sense lane labels are more precise
- `Neutral Sample` / `Neutral Seed` concepts
- Lab smoke matrix as product direction

Do not import from Atlas:

- Evidence storage semantics
- report/watch/assessment language
- durable historical memory framing
- evidence basis / collection provenance as generic Sense labels
- Atlas Discovery/Evidence distinctions as Sense UI structure

Do not make Combat Witness look like historical proof, and do not make Passive Telemetry look like continuous Threat Intel.

## 14. Risks

- A larger face redesign could crowd the overlay and reduce first-read speed.
- More tactical styling could accidentally imply higher truth or certainty than backend snapshots support.
- Passive provider/sample data can look complete unless partial, capped, stale, and blocked states stay visible.
- Combat Witness repair balance can be misread as survival/tank state unless observed-only wording remains.
- Threat Intel can look like a background scanner unless it remains behind deliberate input and acquisition.
- Diagnostics can become the product face if not visually demoted.
- Importing Lab labels directly can flatten Sense lane-specific states.
- Importing Atlas terms can imply durable evidence or history.

## 15. Smallest Safe Sense Prototype

Recommended smallest safe prototype:

```txt
Sense Face Refinement Pass: Combat Witness + Passive Telemetry first-read polish
```

Scope:

- Preserve existing layout and lane structure.
- Refine Combat Witness first-read hierarchy around incoming DPS, repair HPS, observed balance, observed source, and observed weapon.
- Refine Passive Telemetry compact readout placement and state/basis visibility.
- Keep Threat Intel and Clipboard Acquisition mostly unchanged except for visual consistency where they touch the face.
- Demote diagnostics visually, but preserve all source/basis/freshness/gap/warning detail.
- Do not change backend contracts, IPC channels, payload fields, service commands, CSS/test identifiers, or bridge fields.

This should be a renderer presentation pass, not a backend or doctrine pass.

Prototype acceptance question:

```txt
Can the operator understand current combat pressure, repair support, observed actor/weapon context, and Passive provider state in one compact glance?
```

## 16. Suggested Verification And Smoke Expectations

If a future Dev packet changes renderer presentation, expected verification should include:

```powershell
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:passive-telemetry
npm.cmd run verify:threat-intel
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Smoke expectations should stay focused:

- normal Combat Witness pressure/repair readout
- no combat/quiet state
- stale Combat Witness state
- Passive fresh context
- Passive stale context
- Passive partial/capped sample
- Passive Live IO blocked
- Passive degraded
- Passive no observation
- Threat Intel no scan and sampled/partial where existing fixtures support it
- Clipboard listening/cooldown/blocked where existing fixtures support it
- diagnostics open
- narrow viewport

Do not run live provider smoke, live API calls, real SDE refresh, or manual shortcut validation unless Human explicitly authorizes it.

Verification should prove renderer safety, lane boundaries, and display containment. It should not become a broad product taxonomy or source-truth claim.
