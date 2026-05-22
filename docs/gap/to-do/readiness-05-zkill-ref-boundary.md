# Gap To-Do: zKill Discovery Ref Boundary

Date: 2026-05-22
Status: Open

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

Target shape:

```txt
[{ killmailId, hash }]
```

Optional diagnostic fields can exist separately, but tactical summary logic should not depend on zKill summary payloads.

## Guardrails

- Do not derive tactical truth from zKill summaries.
- Do not break existing ESI expansion flow.
- Do not abort a whole scan because one ref is malformed.

## Completion Signal

Threat Intel expands ESI killmails from normalized zKill refs and never treats zKill summaries as tactical truth.

## Evidence Of Completion

When complete, record:

- normalized ref shape
- malformed response behavior
- consumer updates
- verification output

## Related Documents

- `Docs/contracts/threat-intel-contract.md`
- `Docs/tenets/tenets.md`


