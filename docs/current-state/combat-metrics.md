# Current State: Combat Metrics

Date: 2026-05-23
Status: Audit baseline for Combat Witness capture, compute, snapshot, and display terminology

## Purpose

This document explains, in plain English, what AURA-Sense currently captures, computes, exposes, and displays for Combat Witness metrics.

It is intended to reduce ambiguity before future UI presentation work. It does not authorize UI behavior changes.

## Plain-English Summary

Combat Witness is a short-window view of what the local EVE gamelog has recently said.

It is not a full combat report, a prediction, a survival model, or an Atlas-style evidence record.

The current pipeline is:

```txt
new EVE gamelog line
-> parser creates a normalized event
-> rolling windows compute short-lived metrics
-> snapshot exposes compact fields
-> renderer displays selected fields
```

The most important product distinction:

- Captured means AURA-Sense observed a raw line and normalized it.
- Computed means AURA-Sense counted or summarized recent normalized events.
- Displayed means the current UI shows it.
- Interpreted means a human or later system has decided what it means. Combat Witness should avoid interpretation by default.

## What The Log Parser Captures

### Navigation Jump

Parser event:

- `navigation.jump`

Plain English:

- The log said the player jumped to a system.

Current use:

- Supports Passive Telemetry current-system observation.
- Does not belong in Combat Witness pressure metrics.

### Incoming Damage

Parser event:

- `combat.damage` with `direction: incoming`

Plain English:

- The log said damage was applied to the player.

Captured fields may include:

- amount
- observed source label
- target label, usually `you`
- weapon label when present
- hit quality when present
- damage type only when explicitly present
- raw color token when present

Important limitation:

- Source labels are observed log labels. They are not guaranteed unique pilots, ships, NPCs, drones, or durable identities.

### Outgoing Damage

Parser event:

- `combat.damage` with `direction: outgoing`

Plain English:

- The log said the player applied damage to something else.

Captured fields may include:

- amount
- source label, usually `you`
- observed target label
- weapon label when present
- hit quality when present
- damage type only when explicitly present

Important limitation:

- Outgoing damage events are observed log events. They are not guaranteed exact weapon cycles or complete combat truth.

### Incoming Miss

Parser event:

- `combat.miss` with `direction: incoming`

Plain English:

- The log said something missed the player.

Current use:

- Appears in the bounded event stream.
- Not currently counted in rolling window metrics.

### Outgoing Miss

Parser event:

- `combat.miss` with `direction: outgoing`

Plain English:

- The log said the player missed a target.

Current use:

- Appears in the bounded event stream.
- Not currently counted in rolling window metrics.

Gap:

- Future output metrics should count outgoing damage events and outgoing miss events in the 15 second window.

### Repair

Parser event:

- `combat.repair`

Plain English:

- A normalized event says repair happened.

Current reality:

- Rolling-window compute supports normalized repair events.
- Raw EVE repair/healing line parsing remains deferred until exact fixtures prove the parser behavior.

Important limitation:

- Repair metrics may remain zero in live use until raw repair parser support exists.
- Repair does not mean safe, stable, tanking, breaking, or surviving.

## What Rolling Windows Compute

Combat Witness currently computes 5 second, 15 second, and 30 second rolling windows.

### Incoming Damage Total

Snapshot example:

- `windows.5s.damage.incoming.total`
- `windows.15s.damage.incoming.total`

Plain English:

- Total observed damage applied to the player in that rolling window.

Display readiness:

- Main HUD ready.

Better label:

- `Incoming`
- `Incoming pressure`

Avoid:

- `Threat`
- `Danger`
- `Taking fire` unless tied to recent nonzero observed damage.

### Incoming DPS

Snapshot example:

- `windows.15s.damage.incoming.perSecond`

Plain English:

- Observed incoming damage per second in the selected window.

Display readiness:

- Main HUD ready as part of a pressure instrument.

Better label:

- `Incoming DPS`
- `Pressure / sec`

Avoid:

- `Tank break`
- `Lethality`
- `Risk`

### Outgoing Damage Total

Snapshot example:

- `windows.15s.damage.outgoing.total`

Plain English:

- Total observed damage the player applied to others in the window.

Display readiness:

- Secondary HUD or diagnostics ready.

Better label:

- `Output`
- `Outgoing`

### Outgoing DPS

Snapshot example:

- `windows.15s.damage.outgoing.perSecond`

Plain English:

- Observed outgoing damage per second in the selected window.

Display readiness:

- Useful for the Combat Witness module.

Better label:

- `Out DPS`
- `Output DPS`

Avoid:

- Plain `DPS` if space allows `Out DPS`; plain `DPS` can be ambiguous in a pressure-focused HUD.

### Incoming Repair Total

Snapshot example:

- `windows.15s.repair.incoming.total`

Plain English:

- Total observed repair received by the player in the window.

Display readiness:

- Main HUD ready with caveat that raw repair parser support is still fixture-gated.

Better label:

- `Repair`
- `Repair received`

Avoid:

- `Stable`
- `Tank`

### Incoming Repair Per Second

Snapshot example:

- `windows.15s.repair.incoming.perSecond`

Plain English:

- Observed repair received per second in the selected window.

Display readiness:

- Main HUD ready as repair throughput.

Better label:

- `Repair HPS`
- `Repair / sec`
- `Repair throughput`

### Repair Balance

Snapshot example:

- `windows.15s.balance.receivedRepairMinusDamagePerSecond`

Plain English:

- Observed incoming repair per second minus observed incoming damage per second.

Example:

```txt
incoming DPS = 40
incoming repair HPS = 55
repair balance = +15
```

This means observed repair throughput exceeded observed incoming damage by 15 per second during the window.

Display readiness:

- Main HUD ready if labeled carefully.

Better label:

- `Balance`
- `Observed balance`
- `Net pressure`

Avoid:

- `Safe`
- `Stable`
- `Breaking`
- `Surviving`
- `Tank state`

### Top Observed Source

Snapshot example:

- `windows.15s.damage.incoming.topSource`

Plain English:

- The observed source label that appeared most often among incoming damage events in the window.

Display readiness:

- Main HUD or expanded Combat Witness ready.

Better label:

- `Observed source`
- `Most observed source`

Avoid:

- `Primary attacker`
- `Enemy`
- `Hostile`
- `Ship`

Reason:

- The label may be a player, NPC, drone, object, or ambiguous display string.

### Top Observed Target

Snapshot example:

- `windows.15s.damage.outgoing.topTarget`

Plain English:

- The observed target label that appeared most often among outgoing damage events in the window.

Display readiness:

- Diagnostics or expanded Combat Witness ready.

Better label:

- `Observed target`
- `Most observed target`

### Most Observed Weapon

Snapshot example:

- `windows.15s.damage.incoming.mostObservedWeaponType`
- `windows.15s.damage.outgoing.mostObservedWeaponType`

Plain English:

- The exact observed weapon label that appeared most often in damage events for the selected direction and window.

Display readiness:

- Main HUD ready for incoming weapon context.
- Expanded or output module ready for outgoing weapon context.

Better label:

- `Observed weapon`
- `Most observed weapon`

Avoid:

- `Primary weapon`
- `Weapon type` if not normalized
- `Enemy weapon`

Reason:

- This is currently exact observed text, not guaranteed normalized EVE item/type metadata.

### Most Common Hit Quality

Snapshot example:

- `windows.15s.damage.incoming.mostCommonHitQuality`
- `windows.15s.damage.outgoing.mostCommonHitQuality`

Plain English:

- The hit quality label that appeared most often in observed damage events for the selected direction and window.

Display readiness:

- Incoming hit quality: diagnostics or expanded detail.
- Outgoing hit quality: useful in Combat Witness output readout.

Better label:

- `Hit quality`
- `Most frequent hit`

Avoid:

- `Best hit`
- `Critical`
- `Wrecking` as a summary unless it is actually the most frequent observed hit quality.

### Hit Quality Counts

Snapshot example:

- `windows.15s.damage.outgoing.hitQualityCounts`

Plain English:

- Counts of observed hit quality labels in the window.

Display readiness:

- Diagnostics or expanded details.

Better label:

- `Hit quality counts`

### Damage Type Counts

Snapshot example:

- `windows.15s.damage.incoming.damageTypeCounts`

Plain English:

- Counts of damage types only when the raw event explicitly includes damage type data.

Display readiness:

- Diagnostics only until coverage is better understood.

Better label:

- `Observed damage types`

Avoid:

- Inferring damage type from weapon labels.

### Weapon Counts

Snapshot example:

- `windows.15s.damage.incoming.weaponCounts`

Plain English:

- Counts of exact observed weapon labels in the window.

Display readiness:

- Diagnostics or expanded detail.

Better label:

- `Observed weapon counts`

### Source And Target Counts

Snapshot example:

- `windows.15s.damage.incoming.sourceCounts`
- `windows.15s.damage.outgoing.targetCounts`

Plain English:

- Counts of how often each observed label appeared in damage events.

Display readiness:

- Diagnostics or expanded detail.

Better label:

- `Observed source counts`
- `Observed target counts`

Avoid:

- `Pilots`
- `Ships`
- `Enemies`

### Damage Spike Outliers

Snapshot example:

- `windows.15s.damage.incoming.spikeOutliers`

Plain English:

- Damage events that are large compared with other observed damage events in the same rolling window and direction.

Current rule:

```txt
damage spike = amount >= average + standard deviation
```

Display readiness:

- Diagnostics only for now.
- Not ready for strong HUD emphasis until real-dataset calibration.

Better label:

- `Damage outlier`
- `Observed spike`

Avoid:

- `Alpha threat`
- `Critical threat`
- `Kill risk`
- `Emergency`

## What Snapshots Expose

Combat Witness snapshots expose:

- `kind`
- `observedAt`
- `windows.5s`
- `windows.15s`
- `windows.30s`
- `eventStream`
- `freshness`
- `operational.watcher`

Each window exposes:

- incoming/outgoing damage totals and per-second values
- incoming/outgoing repair totals and per-second values
- observed repair balance
- hit quality counts
- damage type counts
- weapon counts
- top source/target labels
- most observed weapon
- spike thresholds and spike outliers

The renderer should consume these fields. It should not recompute rolling metrics.

## What The Current UI Displays

The current UI and diagnostics surface display selected Combat Witness fields, including:

- Combat state
- Combat summary
- Combat detail
- Combat signal
- Witnessed event count
- 5s incoming
- 15s repair
- repair balance
- observed source
- observed weapon
- log watcher state
- log setup path/status

## What The Current UI Does Not Display

The current UI does not clearly display:

- outgoing DPS
- outgoing damage event count
- outgoing miss count
- outgoing observed attempt count
- most frequent outgoing hit quality
- incoming DPS as a named DPS/pressure metric
- incoming repair HPS as a named throughput metric
- top observed target
- hit quality counts
- damage type counts
- weapon count tables
- source/target count tables
- spike outlier details

Some of these are good omissions for now. Others are useful future HUD candidates.

## Ambiguous Terms And Better Replacements

| Current / Risky Term | Issue | Better Term |
| --- | --- | --- |
| Combat State | Too broad; mixes watcher/runtime/combat | Combat status |
| Combat Signal | Abstract; duplicates state | Signal freshness |
| Combat Detail | Vague | Recent combat detail |
| Witnessed | Could mean total history | Recent events |
| 5s Incoming | Good but terse | 5s incoming |
| 15s Repair | Good but parser caveat exists | 15s repair observed |
| Repair Balance | Good if explained | Observed balance |
| Observed Source | Good | Observed source |
| Observed Weapon | Good | Observed weapon |
| Unobserved | Could sound like failure | No source observed / No weapon observed |
| Quiet | Good for combat state | Quiet |
| Empty | Backend-ish | No combat observed |
| DPS | Direction ambiguous | Out DPS / Incoming DPS |
| Hit Quality | Good if most frequent | Most frequent hit |

## Metrics Safe For The Main HUD

These are safe for the main HUD when displayed with observed-language:

- Combat status/freshness
- 5s incoming total
- 15s incoming DPS
- 15s repair total
- 15s repair HPS
- observed repair balance
- observed source
- observed weapon
- outgoing DPS
- most frequent outgoing hit quality

## Metrics Better Suited To Diagnostics

These should remain in diagnostics or expanded detail by default:

- raw event stream
- hit quality count maps
- damage type count maps
- weapon count maps
- source count maps
- target count maps
- spike thresholds
- spike outliers
- watcher strategy/path details
- parse skipped/rejected counts when added

## Metrics Requiring Calibration Or More Fixtures

These need more proof before strong HUD emphasis:

- damage spike outliers
- spike threshold
- damage type summaries
- raw repair/healing parser-backed HPS in live use
- outgoing hit/miss attempt counts once implemented
- any accuracy-like ratio

## Known Gaps

- Raw repair/healing parser support remains deferred.
- Outgoing miss counts are parsed but not yet included in rolling window snapshots.
- Outgoing observed attempt count does not yet exist.
- Hit quality is computed, but current display does not present outgoing hit quality.
- Outgoing DPS is computed, but current display does not present it.
- The diagnostics surface currently has several backend-ish labels that need product terminology review.
- Damage spike outliers exist but remain intentionally low-emphasis until calibrated.
- Some current empty states use ambiguous terms such as `Unobserved` or `Empty`.

## Presentation Grouping Rule

Metric presentation should be grouped by how the operator reads the value, not only by where the value comes from.

Default vertical order inside a lane or module:

```txt
Static
Scales
Null states
```

This means a stable scalar such as incoming DPS, outgoing DPS, repair HPS, observed balance, or event count should sit above bars, gauges, timelines, pulses, or recent-event lists.

A scale should explain a static number, not bury it. If a module shows both `Incoming DPS` and a rolling event list, `Incoming DPS` belongs first. The list can provide context underneath.

Null states are not metrics. They are fallback presentation states for missing, unavailable, blocked, stale, or unobserved data. Null copy should not take the prime position when a real static metric exists.

## Logical Metric Groups

### Static Metrics

Static metrics are single-read values that should be readable at a glance without scanning a list or interpreting a bar.

Primary static metrics:

- combat status/freshness
- incoming DPS
- repair HPS
- observed repair balance
- outgoing DPS
- witnessed event count
- current system label
- system kills
- system jumps
- Threat Intel target label
- Threat Intel selected/discovered sample count

Presentation rule:

- Put static metrics at the top of their lane or tile.
- Prefer explicit direction: `Incoming DPS`, `Repair HPS`, `Out DPS`.
- Avoid plain `DPS` unless the tile context makes direction impossible to miss.
- Keep static metric labels short and stable.

### Scale Metrics

Scale metrics are values that need comparison, trend, magnitude, or ordered context.

Scale candidates:

- incoming pressure bar
- repair throughput bar
- net pressure gauge
- 5s/15s/30s window comparison
- provider pulse strip
- Threat Intel activity pulse
- recent combat event stream
- source/weapon/hit-quality count maps
- spike/outlier lists

Presentation rule:

- Place scales below the relevant static metric.
- Use scales to answer `how much`, `how recent`, or `what changed` after the scalar is already visible.
- Keep timelines and lists below headline numbers because they require scanning.
- Do not let a list push DPS/HPS/balance out of the first read zone.

### Context Labels

Context labels identify what was observed, not how much pressure exists.

Context candidates:

- observed source
- observed target
- observed weapon
- most frequent hit quality
- current Threat Intel provider
- Passive/Threat provider basis

Presentation rule:

- Context labels may sit beside static metrics when space allows.
- Context labels should not outrank pressure throughput metrics in the Combat Witness lane.
- Use `observed` language because labels may not be durable identities.

### Null States

Null states describe absence, blocked authority, degraded inputs, or unavailable bridges.

Null candidates:

- no combat observed
- unobserved source
- unobserved weapon
- bridge unavailable
- live IO blocked
- watcher stopped
- stale snapshot
- no scan

Presentation rule:

- Null states replace the value they belong to; they do not become their own metric group.
- Prefer `No source observed` over `Unobserved` where space allows.
- Prefer `No combat observed` over backend-ish `Empty` in product surfaces.
- Keep null states visually quiet unless they require operator action.

## First-Pass Grouping By Lane

### Combat Witness

Static:

- Combat status/freshness
- Incoming DPS
- Repair HPS
- Observed repair balance
- Out DPS, when displayed
- Recent event count

Scales:

- net pressure gauge
- incoming pressure bar
- repair throughput bar
- 5s/15s/30s comparison
- recent event stream
- spike/outlier details

Context:

- observed source
- observed weapon
- observed target
- most frequent hit quality

Null:

- no combat observed
- source/weapon not observed
- watcher unavailable/degraded/blocked
- stale Combat Witness snapshot

### Passive Telemetry

Static:

- current system
- ship kills
- jumps
- kill/jump ratio
- freshness state

Scales:

- provider pulse
- cache/freshness age display, if added
- recent system activity trend, if added

Context:

- provider basis
- local/static resolver source
- ESI/zKill cache state

Null:

- no system observed
- live IO blocked
- provider degraded
- stale passive context

### Threat Intel

Static:

- target label
- target kind
- scan status
- selected/discovered sample count
- lookback window

Scales:

- zKill pulse strip
- sampled timeline
- capped/partial sample indication

Context:

- provider basis
- input source: typed, clipboard, shortcut
- ambiguity or unsupported-target reason

Null:

- no scan
- unresolved target
- ambiguous target
- live IO blocked
- provider failed
## Suggested Future HUD Grouping

This is not an implementation instruction, only a product-language guide.

Main Combat Witness module:

```txt
Pressure
- Incoming
- Repair
- Balance

Output
- Out DPS
- Hit quality
- Hits
- Misses

Context
- Observed source
- Observed weapon
```

Diagnostics:

```txt
Parser / watcher state
Recent event stream
Window internals
Spike/outlier details
Source/weapon/hit-quality count maps
Replay status, when implemented
```

## Related Documents

- `docs/contracts/combat-witness-contract.md`
- `docs/schemas/hud-snapshot.md`
- `docs/schemas/combat-event.md`
- `docs/archive/deprecated-gap-workflow-2026-05-23/complete/combat-metrics-presentation-audit.md`
- `docs/archive/deprecated-gap-workflow-2026-05-23/to-do/combat-witness-replay-system-channel.md`
- `docs/archive/deprecated-gap-workflow-2026-05-23/to-do/combat-window-weapon-spike-followups.md`
- `docs/archive/deprecated-gap-workflow-2026-05-23/to-do/combat-metric-calibration-real-datasets.md`
- `docs/archive/deprecated-gap-workflow-2026-05-23/to-do/repair-healing-raw-fixture-intake.md`


