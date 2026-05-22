# Schema: HUD Snapshot

Status: Active - Integrated viewport display contract
Owner: Backend/main-process presentation services

## Purpose

Defines compact renderer-facing state.

The renderer should consume snapshots rather than recomputing telemetry truth.

## Suggested Sections

- passive telemetry summary
- threat intel summary
- combat witness summary with 5s/15s/30s windows
- freshness/staleness flags
- warnings
- mode hints

## Integrated Viewport Lane Contract

Milestone 10 uses existing backend-owned lane snapshots directly. No backend presentation adapter was added because the current display can consume compact snapshot fields without merging lane truth models.

Lane priority:

1. Combat Witness: primary lane, because local combat observations are the most time-sensitive operator signal.
2. Passive Telemetry and Threat Intel: paired support lanes, because they explain system context and deliberate scan context without overriding Combat Witness.
3. Event stream and controls: operational detail and explicit operator actions.

The integrated overview strip may repeat each lane's status, but it must not create a global threat score.

### Combat Witness Integrated Fields

Displayed fields:

- `freshness.status`
- `operational.watcher.state`
- `windows.5s.damage.incoming.total`
- `windows.15s.repair.incoming.total`
- `freshness.eventStreamCount`
- `windows.15s.damage.incoming.perSecond`
- `windows.15s.repair.incoming.perSecond`
- `windows.15s.balance.receivedRepairMinusDamagePerSecond`
- `windows.15s.damage.incoming.topSource`
- `windows.15s.damage.incoming.mostObservedWeaponType`

Copy guardrails:

- Use `Incoming pressure`, `Repair throughput`, `Observed repair balance`, `Observed source`, and `Most observed weapon`.
- Do not describe repair balance as safety, stability, breaking, tank state, or survival.
- Do not emphasize spike outliers in the integrated HUD until real-dataset calibration is complete.

### Passive Telemetry Integrated Fields

Displayed fields:

- `status`
- `currentSystem.label`
- `zkill.sampleCount`
- `activity.shipKills`
- `activity.jumps`
- `freshness.status`
- `gate`/`status` blocked messaging
- provider basis derived from `zkill` and `activity`

### Threat Intel Integrated Fields

Displayed fields:

- `status`
- `target.label`
- `zkill.provider`
- `zkill.lookbackSeconds`
- `zkill.selectedCount`
- `zkill.discoveredCount`
- `zkill.capped`
- clipboard acquisition state
- blocked/partial/capped/provider basis

## Invariants

- Snapshots should be compact.
- Snapshots should include freshness metadata.
- Snapshots should not require renderer-side API calls.
- Snapshots should not contain unbounded event history.

## Combat Witness Section

Current backend shape:

- `kind: combat.witness.snapshot`
- `observedAt`
- `windows.5s`
- `windows.15s`
- `windows.30s`
- window `damage.incoming/outgoing.total`
- window `damage.incoming/outgoing.perSecond`
- window `damage.incoming/outgoing.hitQualityCounts`
- window `damage.incoming/outgoing.damageTypeCounts`
- window `damage.incoming/outgoing.weaponCounts`
- window `damage.incoming/outgoing.mostObservedWeaponType`
- window `damage.incoming/outgoing.spikeThreshold`
- window `damage.incoming/outgoing.spikeOutliers`
- window `damage.incoming.sourceCounts`
- window `damage.outgoing.targetCounts`
- window `repair.incoming/outgoing.total`
- window `repair.incoming/outgoing.perSecond`
- window `repair.incoming.sourceCounts`
- window `balance.takenDps`
- window `balance.dealtDps`
- window `balance.repairReceivedHps`
- window `balance.repairAppliedHps`
- window `balance.receivedRepairMinusDamagePerSecond`
- bounded `eventStream`
- `freshness.latestEventTime`
- `freshness.latestObservedAt`
- `freshness.status`
- `freshness.latestEventAgeMs`
- `freshness.eventStreamCount`

Renderer code should present this snapshot shape rather than recomputing rolling combat metrics.

Repair balance is observed incoming repair throughput minus observed incoming damage throughput. It is not a HP, survival, or tank-state verdict.

Damage spike outliers are bounded rolling-window observations. `shipLabel` is the observed source label for incoming damage and the observed target label for outgoing damage; it must not be treated as durable identity when labels collide.

### Combat Witness Plain-English Notes

This section is written for reviewers who do not need to know how the parser is built.

A Combat Witness snapshot is a short-lived summary of what AURA-Sense has recently observed in the EVE gamelog. It is not a complete fight record. It is a "what did the local log just say?" packet.

The snapshot is divided into time windows:

- `5s` means the last five seconds of combat events.
- `15s` means the last fifteen seconds of combat events. This is the main tactical window for near-real-time pressure.
- `30s` means the last thirty seconds of combat events. This gives a slightly smoother recent context.

Each window is recalculated from recent events. When an event becomes older than the window, it falls out of the numbers.

#### Damage Fields

- `damage.incoming.total` is the total damage AURA-Sense observed being applied to the player during that window.
- `damage.incoming.perSecond` is the observed incoming DPS for that window. It is the total incoming damage divided by the window size.
- `damage.outgoing.total` is the total damage AURA-Sense observed the player applying to others during that window.
- `damage.outgoing.perSecond` is the observed outgoing DPS for that window.
- `damage.incoming.sourceCounts` counts how many incoming damage events came from each observed source label.
- `damage.outgoing.targetCounts` counts how many outgoing damage events went to each observed target label.
- `topSource` is the observed source label that appeared most often for incoming damage events.
- `topTarget` is the observed target label that appeared most often for outgoing damage events.

Important limitation:

The labels in `sourceCounts`, `targetCounts`, `topSource`, and `topTarget` are labels from the log. They are not guaranteed to be unique people, unique ships, or durable identities. Two things can share a label, and one label may describe a drone, NPC, player, or object depending on what the log says.

#### Hit Quality And Damage Type Fields

- `hitQualityCounts` counts observed hit descriptions such as `Hits`, `Grazes`, or `Penetrates`.
- `mostCommonHitQuality` is the hit description that appeared most often in that window.
- `damageTypeCounts` counts damage types only when the raw log or normalized event explicitly includes them.
- `mostCommonDamageType` is the most frequent observed damage type in that window.

Important limitation:

If a damage type is absent, AURA-Sense should not guess it. Empty damage type data means "not observed," not "no damage type."

#### Weapon Fields

- `weaponCounts` counts exact observed weapon labels in the window.
- `mostObservedWeaponType` is the weapon label that appeared most often in the window.

Important limitation:

`mostObservedWeaponType` currently means "most observed weapon label." It does not yet mean a fully normalized EVE item type. If future work adds item/type normalization, the exact observed label should still be preserved.

#### Damage Spike Fields

- `spikeThreshold` is the current numeric line used to decide whether a damage amount is unusually high inside that window and direction.
- `spikeOutliers` is a short list of damage events that met or exceeded that threshold.
- Each spike outlier includes the amount, time, observed labels, weapon label, hit quality, and damage type when available.
- For incoming damage, `shipLabel` is the observed attacker/source label.
- For outgoing damage, `shipLabel` is the observed target label.

Important limitation:

A spike is not automatically a warning, a prediction, or a survival estimate. It only means one damage event was large compared with the other observed damage events in the same rolling window.

The current spike rule is lightweight and should be calibrated with more real datasets before heavy UI emphasis:

```txt
damage spike = damage amount >= average damage + standard deviation
```

#### Repair And Balance Fields

- `repair.incoming.total` is the total observed repair received by the player in the window.
- `repair.incoming.perSecond` is observed incoming HPS for that window.
- `repair.incoming.sourceCounts` counts observed repair sources.
- `balance.takenDps` repeats incoming DPS in a balance-friendly field.
- `balance.dealtDps` repeats outgoing DPS in a balance-friendly field.
- `balance.repairReceivedHps` is observed incoming HPS.
- `balance.repairAppliedHps` is observed outgoing HPS.
- `balance.receivedRepairMinusDamagePerSecond` is observed incoming HPS minus observed incoming DPS.

Plain-language example:

```txt
incoming DPS = 40
incoming HPS = 55
repair balance = +15
```

That means recent observed repairs are exceeding recent observed incoming damage by 15 per second in this window.

Important limitation:

Repair balance does not know the player's current hit points, maximum hit points, resist profile, incoming volley risk, or whether repairs will continue. It should not be described as "safe," "stable," "breaking," or "you will survive."

Current freshness statuses:

- `empty`: no bounded Combat Witness event stream item exists
- `recent`: latest backend reference time is within 15 seconds
- `stale`: latest backend reference time is older than 15 seconds

## Passive Telemetry Section

Current backend shape:

- `kind: passive.telemetry.snapshot`
- `observedAt`
- `currentSystem.label`
- `currentSystem.systemId`
- `currentSystem.eventTime`
- `currentSystem.observedAt`
- `zkill.systemId`
- `zkill.fetchedAt`
- `zkill.pastSeconds`
- `zkill.sampleCount`
- `zkill.capped`
- `zkill.partial`
- `zkill.failureCount`
- `activity.systemId`
- `activity.fetchedAt`
- `activity.shipKills`
- `activity.podKills`
- `activity.npcKills`
- `activity.jumps`
- `activity.partial`
- `activity.failureCount`
- `activity.cache.cacheMs`
- `activity.cache.cacheAgeMs`
- `activity.cache.state`
- `activity.cache.etag`
- `activity.cache.conditional`
- `activity.cache.revalidated`
- `gate.state`
- `gate.enabled`
- `gate.message`
- `freshness.status`
- `freshness.cacheAgeMs`
- `freshness.freshnessMs`
- `status`
- `message`
- `failure`

Current passive statuses:

- `unavailable`: no current system has been observed
- `fresh`: current-system context is within freshness window
- `stale`: current-system context exists but freshness expired
- `partial`: context was fetched with malformed or incomplete refs
- `degraded`: system ID resolution or context fetch failed
- `blocked`: live IO gate blocked passive external calls

