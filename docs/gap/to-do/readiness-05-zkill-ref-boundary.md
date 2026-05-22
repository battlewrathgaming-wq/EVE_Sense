# Gap To-Do: zKill Discovery Ref Boundary

Date: 2026-05-22
Status: Open - Deferred Until zKill Client Or Threat Intel Search Exists

## Actionables

- Normalize zKill output inside `ZKillClient` or the first Threat Intel zKill service.
- Return a clean bounded result/ref shape for search-bar Threat Intel.
- Guard non-array zKill responses.
- Guard missing `killmail_id`.
- Guard missing `zkb.hash` when expansion refs are requested.
- Add warnings/counts for malformed refs.
- Update consumers to use the normalized ref shape.

## Task Requirements

Threat Intel should receive clean zKill-backed result metadata, not raw unbounded zKill summary payloads.

This packet should not be implemented against placeholder services. Start it when an AURA-Sense zKill client or Threat Intel search service boundary exists.

Target shape:

```txt
{
  refs: [{ killmailId, hash? }],
  malformedCount,
  capped,
  fetchedAt
}
```

Optional diagnostic fields can exist separately, but tactical summary logic should not depend on zKill summary payloads.

## Guardrails

- Do not derive tactical truth from zKill summaries.
- Do not add ESI expansion by default.
- Do not abort a whole scan because one ref is malformed.
- Do not create broad background discovery while adding this boundary.

## Completion Signal

Threat Intel receives bounded normalized zKill refs/results with malformed/capped/freshness metadata and never treats raw zKill summaries as complete tactical truth.

## Evidence Of Completion

When complete, record:

- normalized ref shape
- malformed response behavior
- consumer updates
- verification output

## Related Documents

- `docs/contracts/threat-intel-contract.md`
- `docs/tenets/tenets.md`


