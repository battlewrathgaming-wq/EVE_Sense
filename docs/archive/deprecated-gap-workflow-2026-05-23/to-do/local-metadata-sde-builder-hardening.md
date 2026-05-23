# Gap To-Do: Local Metadata SDE Builder Hardening

Status: Open
Priority: P2
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

Local metadata/SDE builder code and a compact metadata artifact foundation are present. The next testing step is adversarial hardening before broader product reliance.

Dev may be actively downloading the real SDE. This packet should not interrupt, mutate, or stage that artifact by default. Fixture ZIP tests remain the first line of verification; real SDE artifacts need source/checksum records.

## Actionables

- Add offline fixture ZIP tests for `sdeJsonlZip`.
- Test unsupported compression, invalid central directory, size mismatch, malformed JSONL, duplicate type IDs, missing names, and path constraints.
- Test source bundle cleanup behavior.
- Test no live download occurs unless an explicit command requests it.
- Record real SDE source path, build number, checksum, cache location, cleanup behavior, and whether it is retained or discarded.
- Decide whether additional hardening is required before full SDE refresh artifacts are treated as operator-usable.

## Guardrails

- Do not parse large SDE archives at runtime.
- Do not download during `verify:all`.
- Do not allow source/cache paths outside approved workspace unless explicitly overridden.
- Do not stage downloaded SDE artifacts by default.
- Do not treat a completed download as sufficient verification.
- Do not hide unresolved type IDs.

## Completion Signal

- Metadata/SDE code has deterministic offline verification or is explicitly deferred.
- Any live/download behavior is opt-in and outside `verify:all`.
- Real SDE artifact retention/disposal is recorded.
- `npm.cmd run verify:all` passes.
