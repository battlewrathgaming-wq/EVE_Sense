# Gap To-Do: Threat Intel Sample Metadata

Date: 2026-05-22
Status: Open - Deferred Until Threat Intel Runtime Exists

## Actionables

- Add discovered ref count.
- Add selected/expanded count.
- Add failed expansion count.
- Add cap-skipped count.
- Add partial/complete sample status.
- Render this compactly in the HUD.
- Update wording away from unsupported certainty or hostility claims.

## Task Requirements

Every active scan should make its evidence basis clear without turning the HUD into an Atlas report.

This packet depends on scoped zKill discovery and ESI expansion existing in AURA-Sense. Do not implement sample metadata against mock renderer-only state.

The scan result should be able to answer:

```txt
Scope: 1h
Discovered refs: N
Expanded evidence: M
Failed expansions: X
Sample status: partial/complete
```

## Guardrails

- Do not overcrowd the tactical HUD.
- Do not present zKill-discovered count as expanded evidence count.
- Do not imply complete coverage when expansion was capped or failed.
- Do not treat sample metadata as Atlas-style evidence storage.

## Completion Signal

The HUD shows scan scope and sample status in compact tactical language.

## Evidence Of Completion

When complete, record:

- scan payload fields added
- renderer labels changed
- sample/cap behavior tested
- verification output

## Related Documents

- `docs/gap/complete/implementation-alignment-gap-analysis.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/terms/threat-intel.md`


