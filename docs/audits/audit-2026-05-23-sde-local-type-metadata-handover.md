# Audit: SDE Local Type Metadata Handover

Date: 2026-05-23
Owner: Dev execution under Overseer doctrine
Status: Complete for compact local type lookup foundation

## Scope

Added AURA-Sense support for the reusable Aura Core SDE source-bundle pattern and a compact local type metadata artifact.

Implemented:

- project-local SDE source bundle staging and cleanup
- explicit local type metadata build script
- JSONL zip reader for SDE source archives
- compact `fixtures/local-type-metadata.json` seed artifact
- read-only type lookup helper that preserves unresolved IDs
- offline verification using a generated fixture ZIP

No startup download, renderer network call, Atlas persistence, broad SDE runtime parsing, or live ESI type lookup was added.

## Commands

Offline verification:

```powershell
npm.cmd run verify:local-type-metadata
npm.cmd run verify:all
```

Build or refresh compact metadata from an explicit local source:

```powershell
npm.cmd run metadata:build-types -- --source=F:\Projects\AURA-Sense\.tmp\sde\eve-online-static-data-3351823-jsonl.zip
```

Build or refresh compact metadata through explicit SDE download:

```powershell
npm.cmd run metadata:build-types
```

The download path stages source material under `.tmp\sde` by default and cleans disposable source files unless `--keep-source` or `AURA_SENSE_KEEP_SDE_SOURCE=1` is used.
`AURA_SENSE_TMP` may override the project temp root; `AURA_CORE_TMP` is retained only as a compatibility fallback.

## Artifact

Default lookup artifact:

```txt
fixtures/local-type-metadata.json
```

Shape:

```txt
kind: aura-sense.local-type-metadata
schemaVersion: 1
source: SDE source provenance
types[typeID]: name, groupId, categoryId
```

Display fallback:

```txt
Known:   Rifter [typeID: 587]
Unknown: Type 999999
```

## Verification Signals

```txt
local type metadata verified
all checks verified
```

## Deferred Risks

- The committed artifact is a small seed table, not a full SDE lookup.
- Full refresh requires explicit operator execution and network availability.
- The local ZIP reader is intentionally minimal and verified against standard deflate JSONL ZIPs; ZIP64 or unusual compression should be covered by `local-metadata-sde-builder-hardening.md` before broader reliance.
- Consumers should stay read-only and must not hide unresolved IDs.
- If future consumers need groups/categories/names beyond type labels, extend the compact artifact deliberately rather than importing Atlas-scale metadata.
