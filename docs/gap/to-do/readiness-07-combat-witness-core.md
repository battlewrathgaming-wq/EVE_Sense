# Gap To-Do: Combat Witness Core

Date: 2026-05-22
Status: Open - Partial

## Actionables

- Add normalized combat event shape.
- Add backend rolling cache with bounded retention.
- Add computed snapshot windows.
- Emit compact snapshots to renderer.
- Keep one-shot event streams separate from snapshot metrics.
- Add focused tests for cache/window behavior.
- Add backend event fan-out before multiple consumers are attached.
- Isolate listener failures so one consumer cannot stop the stream.
- Add retention cap or prune-on-add behavior before high-volume runtime use.

## Task Requirements

Combat Witness needs a backend-owned compute core before adding pressure gauges, EWAR witness, topology, or spike displays.

Current foundation exists:

- parser emits normalized `navigation.jump`, `combat.damage`, and `combat.miss` events
- gamelog watcher reads appended complete lines
- duplicate suppression exists
- 15 second rolling damage/repair metric primitive exists

Remaining work is the service boundary around those primitives.

Minimum useful backend flow:

```txt
parsed combat line
-> normalized combat event
-> rolling witness cache
-> 5s/15s/30s snapshots
-> compact renderer update
```

## Guardrails

- Do not compute tactical metrics in renderer.
- Do not persist long-term combat history.
- Do not infer unseen state from missing log lines.
- Do not build pressure/ewar/topology widgets before the basic witness cache exists.
- Do not attach renderer consumers directly to raw parser output.
- Do not treat 15 second rolling metrics as complete Combat Witness parity.

## Completion Signal

Backend can answer:

```txt
What has been observed in the last 5/15/30 seconds?
```

without renderer owning the computation.

Snapshot emission and listener fan-out must exist before this gap is complete.

## Evidence Of Completion

When complete, record:

- modules added
- event shape used
- retention/window policy
- listener fan-out policy
- tests added
- verification output

## Related Documents

- `docs/contracts/combat-witness-contract.md`
- `docs/schemas/combat-event.md`
- `docs/terms/combat-witness.md`
- `docs/audits/audit-2026-05-22-combat-parser-overseer-review.md`


