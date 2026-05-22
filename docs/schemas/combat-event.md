# Schema: Combat Event

Status: Draft
Owner: Combat Witness pipeline

## Purpose

Represents one normalized combat-log observation.

Plain-language version:

A combat event is one thing AURA-Sense noticed from the local EVE log. It might be one damage line, one missed shot, one repair observation, or one jump between systems. AURA-Sense turns that raw line into a consistent shape so later code can count it in short rolling windows.

This schema describes the individual observations. The HUD snapshot schema describes the rolled-up summaries.

## Shared Fields

| Field | Meaning |
| --- | --- |
| `id` | Stable event identity |
| `kind` | Event family such as `navigation.jump`, `combat.damage`, `combat.miss`, or `combat.repair` |
| `observedAt` | Time AURA-Sense observed or parsed the line |
| `eventTime` | Timestamp from the EVE log envelope after strict validation |
| `channel` | EVE log channel from the envelope |
| `rawLineHash` | SHA-256 hash reference for diagnostics and duplicate handling |

### Shared Fields Plain-English Notes

- `id` lets AURA-Sense recognize one event again without keeping the entire raw line around.
- `kind` tells the rest of the app what category the event belongs to.
- `observedAt` is when AURA-Sense saw or processed the event.
- `eventTime` is the timestamp written by EVE in the log line.
- `channel` is the EVE log channel, such as `combat` or `None`.
- `rawLineHash` is a fingerprint of the raw line. It helps debugging and duplicate checks without requiring the UI to carry private raw log text.

Important limitation:

An event is evidence from the local log. It is not a permanent record, a full combat report, or a complete truth about the fight.

## Navigation Jump Fields

| Field | Meaning |
| --- | --- |
| `fromSystemName` | Observed source system label, or `null` when the log only says "Jumping to" |
| `systemName` | Observed destination/current system label |

Plain-language notes:

A navigation jump event means the log said the player jumped systems. It can help other backend services know the current system context. If the log does not include the previous system, `fromSystemName` stays empty.

## Combat Damage Fields

| Field | Meaning |
| --- | --- |
| `direction` | `incoming` or `outgoing` from color/relation evidence |
| `amount` | Numeric damage amount |
| `sourceLabel` | Observed source label; `you` for outgoing damage |
| `targetLabel` | Observed target label; `you` for incoming damage |
| `weaponLabel` | Observed weapon label when present |
| `hitQuality` | Observed hit quality such as `Hits`, `Grazes`, or `Penetrates` |
| `damageType` | Damage type only when explicitly present in the raw line |
| `rawColor` | Raw combat color token when present |

Plain-language notes:

A damage event means the log said damage happened.

- `direction: incoming` means damage was observed going toward the player.
- `direction: outgoing` means damage was observed going from the player toward something else.
- `amount` is the number from the log.
- `sourceLabel` is the label the log showed as the source of the damage.
- `targetLabel` is the label the log showed as the target of the damage.
- `weaponLabel` is the weapon text when the log provides one.
- `hitQuality` is the flavor of hit, such as a graze, hit, penetration, or wrecking shot.
- `damageType` is only filled when the event explicitly has that evidence.

Important limitation:

Labels are not guaranteed identity. A label may be a player name, NPC name, drone name, object name, or another display string. AURA-Sense should say "observed label" unless another subsystem later proves identity.

Color note:

The parser currently uses EVE combat color evidence for direction where available. For example, known color tokens help distinguish incoming and outgoing damage. Color is treated as evidence from the raw line, not as a tactical conclusion by itself.

## Combat Miss Fields

| Field | Meaning |
| --- | --- |
| `direction` | `incoming` or `outgoing` from the raw message shape |
| `sourceLabel` | Observed source label; `you` for outgoing misses |
| `targetLabel` | Observed target label; `you` for incoming misses |
| `weaponLabel` | Observed weapon label when present |

Plain-language notes:

A miss event means the log said an attack missed. Misses can be useful in the event stream and future context, but they do not add to damage totals because no damage amount was observed.

## Combat Repair Fields

`combat.repair` is currently supported as a normalized backend event for rolling-window compute and golden replay. Raw repair/healing parser support remains deferred until exact EVE repair fixtures exist.

| Field | Meaning |
| --- | --- |
| `direction` | `incoming` or `outgoing` from explicit normalized evidence |
| `amount` | Numeric repair amount |
| `sourceLabel` | Observed repair source label when present |
| `targetLabel` | Observed repair target label; `you` for incoming repairs |
| `repairType` | Observed repair type such as `shield`, `armor`, or `hull` when explicitly known |

Plain-language notes:

A repair event means AURA-Sense has normalized evidence that repair happened. It can be counted into HPS and repair balance.

Important limitation:

Raw EVE repair/healing parsing is not yet claimed here. The backend can compute repair metrics from normalized repair events, but the raw parser should not claim real repair-log support until exact raw repair fixtures exist.

Repair events do not say whether the player is safe. They do not include current HP, maximum HP, resistance profile, future repair cycles, or incoming volley risk.

## Invariants

- This is observed telemetry, not authoritative combat truth.
- Duplicate labels must not imply identical entities.
- Events should expire from rolling windows.
- Invalid or rolled-over EVE timestamps must be rejected.
- `rawLineHash` is a diagnostic reference, not durable combat history.
- Repair events are observed throughput only; they do not imply current HP, survival, or future repair cycles.
- Weapon labels are exact observed text unless a later field explicitly says it is normalized.
- Ship or actor labels are observed labels, not durable identity.

## Must Not Contain

- persistent historical interpretation
- Atlas-style assessment
- inferred unseen state

