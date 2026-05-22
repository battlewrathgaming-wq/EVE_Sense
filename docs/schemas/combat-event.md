# Schema: Combat Event

Status: Draft
Owner: Combat Witness pipeline

## Purpose

Represents one normalized combat-log observation.

## Shared Fields

| Field | Meaning |
| --- | --- |
| `id` | Stable event identity |
| `kind` | Event family such as `navigation.jump`, `combat.damage`, or `combat.miss` |
| `observedAt` | Time AURA-Sense observed or parsed the line |
| `eventTime` | Timestamp from the EVE log envelope after strict validation |
| `channel` | EVE log channel from the envelope |
| `rawLineHash` | SHA-256 hash reference for diagnostics and duplicate handling |

## Navigation Jump Fields

| Field | Meaning |
| --- | --- |
| `fromSystemName` | Observed source system label, or `null` when the log only says "Jumping to" |
| `systemName` | Observed destination/current system label |

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

## Combat Miss Fields

| Field | Meaning |
| --- | --- |
| `direction` | `incoming` or `outgoing` from the raw message shape |
| `sourceLabel` | Observed source label; `you` for outgoing misses |
| `targetLabel` | Observed target label; `you` for incoming misses |
| `weaponLabel` | Observed weapon label when present |

## Invariants

- This is observed telemetry, not authoritative combat truth.
- Duplicate labels must not imply identical entities.
- Events should expire from rolling windows.
- Invalid or rolled-over EVE timestamps must be rejected.
- `rawLineHash` is a diagnostic reference, not durable combat history.

## Must Not Contain

- persistent historical interpretation
- Atlas-style assessment
- inferred unseen state

