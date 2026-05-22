# Gap To-Do: zKill Discovery Ref Boundary

Date: 2026-05-22
Status: Open - Deferred Until Threat Intel Client Exists

## Actionables

- Normalize zKill output inside `ZKillClient`.
- Return only discovery refs needed for ESI expansion.
- Guard non-array zKill responses.
- Guard missing `killmail_id`.
- Guard missing `zkb.hash`.
- Add warnings/counts for malformed refs.
- Update consumers to use the normalized ref shape.

## Task Requirements

Threat Intel should receive clean discovery refs, not raw zKill summary payloads.

This packet should not be implemented against placeholder services. Start it when an AURA-Sense zKill client or Threat Intel service boundary exists.

Target shape:

```txt
[{ killmailId, hash }]
```

Optional diagnostic fields can exist separately, but tactical summary logic should not depend on zKill summary payloads.

## Guardrails

- Do not derive tactical truth from zKill summaries.
- Do not break existing ESI expansion flow.
- Do not abort a whole scan because one ref is malformed.
- Do not create broad background discovery while adding this boundary.

## Completion Signal

Threat Intel expands ESI killmails from normalized zKill refs and never treats zKill summaries as tactical truth.

## Evidence Of Completion

When complete, record:

- normalized ref shape
- malformed response behavior
- consumer updates
- verification output

## Related Documents

- `docs/contracts/threat-intel-contract.md`
- `docs/tenets/tenets.md`


