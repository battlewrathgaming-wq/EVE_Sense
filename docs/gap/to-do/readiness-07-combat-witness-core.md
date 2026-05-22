# Gap To-Do: Combat Witness Core

Date: 2026-05-22
Status: Open

## Actionables

- Add normalized combat event shape.
- Add backend rolling cache with bounded retention.
- Add computed snapshot windows.
- Emit compact snapshots to renderer.
- Keep one-shot event streams separate from snapshot metrics.
- Add focused tests for cache/window behavior.

## Task Requirements

Combat Witness needs a backend-owned compute core before adding pressure gauges, EWAR witness, topology, or spike displays.

Minimum useful backend flow:

```txt
parsed combat line
-> normalized combat event
-> rolling witness cache
-> 5s/15s/30s snapshot
-> compact renderer update
```

## Guardrails

- Do not compute tactical metrics in renderer.
- Do not persist long-term combat history.
- Do not infer unseen state from missing log lines.
- Do not build pressure/ewar/topology widgets before the basic witness cache exists.

## Completion Signal

Backend can answer:

```txt
What has been observed in the last 5/15/30 seconds?
```

without renderer owning the computation.

## Evidence Of Completion

When complete, record:

- modules added
- event shape used
- retention/window policy
- tests added
- verification output

## Related Documents

- `docs/contracts/combat-witness-contract.md`
- `docs/schemas/combat-event.md`
- `docs/terms/combat-witness.md`


