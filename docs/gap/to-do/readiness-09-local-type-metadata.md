# Gap To-Do: Local Type Metadata

Date: 2026-05-22
Status: Open

## Actionables

- Add compact local type lookup.
- Resolve ship labels locally.
- Display `Name [typeID: id]` where available.
- Keep unresolved IDs visible.
- Avoid live ESI type lookups for static type labels.

## Task Requirements

Threat Intel currently renders victim ship output as `Type <id>`.

AURA-Sense should use local static metadata for ship/type names where available, while staying lightweight and not becoming Atlas.

## Guardrails

- Do not parse a large SDE zip at runtime.
- Do not call live ESI for ship/type names during normal reporting.
- Do not hide unresolved IDs.
- Do not import more static data than the HUD needs.

## Completion Signal

Threat Intel timelines avoid `Type <id>` where local metadata can provide a readable label.

## Evidence Of Completion

When complete, record:

- lookup artifact added
- load path
- display format
- verification output

## Related Documents

- `docs/tenets/tenets.md`
- `docs/terms/metadata.md`


