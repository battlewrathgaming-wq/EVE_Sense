# Schema: Combat Event

Status: Seed
Owner: Combat Witness pipeline

## Purpose

Represents one normalized combat-log observation.

## Suggested Fields

| Field | Meaning |
| --- | --- |
| `id` | Stable event identity |
| `observedAt` | Time AURA-Sense observed or parsed the line |
| `kind` | Damage, repair, EWAR, miss, etc. |
| `direction` | Incoming, outgoing, neutral/unknown |
| `sourceLabel` | Observed source label when available |
| `targetLabel` | Observed target label when available |
| `amount` | Numeric amount when present |
| `damageType` | Damage type when present |
| `effectType` | EWAR/effect type when present |
| `rawLineRef` | Reference/debug pointer, not long-term storage |

## Invariants

- This is observed telemetry, not authoritative combat truth.
- Duplicate labels must not imply identical entities.
- Events should expire from rolling windows.

## Must Not Contain

- persistent historical interpretation
- Atlas-style assessment
- inferred unseen state

