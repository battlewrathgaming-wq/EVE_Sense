# DevHS63 - Passive Adapter Landing Pad

Date: 2026-06-01
Role: Dev
Source packet: `workspace/current.md`

## Summary

Implemented the M16B Passive Adapter Landing Pad as a tiny Sense-owned provisional mapper:

```txt
passive.telemetry.snapshot
-> src/passive/passiveTelemetryAdapter.js
-> passive.telemetry.adapter with adapterPreview
STOP
```

No renderer face was implemented. No Lab starter-kit files were used or modified. No bridge contracts, IPC channels, preload APIs, runtime/provider behavior, CSS selectors, or user-facing renderer behavior were changed.

No live/manual/private I/O was run.

## Files Changed

- `src/passive/passiveTelemetryAdapter.js`
- `scripts/verify-passive-adapter.js`
- `package.json`
- `scripts/verify-all.js`
- `workspace/current.md`
- `workspace/DevHS63-passive-adapter-landing-pad.md`

Pre-existing packet/context edits observed and left as-is:

- `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
- `workspace/overview.md`

## Implementation Summary

`mapPassiveTelemetryAdapter(snapshot)` accepts current `passive.telemetry.snapshot`-shaped input and emits a provisional Passive adapter envelope.

The mapper is isolated under `src/passive/` and is not called by runtime, bridge, preload, or renderer code yet. It is a landing pad for a future presentation-head connection, not adoption of a face.

## Envelope Fields Emitted

- `kind: passive.telemetry.adapter`
- `lane`
  - `id`
  - `snapshotKind`
  - `label`
- `domain.currentSystem`
  - `label`
  - `systemId`
  - `resolved`
  - `fromSystemName`
- `basis.observation`
  - `source: admitted navigation.jump`
  - `eventTime`
  - `observedAt`
- `basis.resolver`
  - `source`
  - `resolved`
- `basis.providers`
  - zKill scoped system context
  - ESI aggregate system activity
  - provider fetch times, counts, partial/capped flags, and cache detail
- `freshness`
  - `status`
  - `snapshotObservedAt`
  - `sourceAgeMs`
  - `freshnessMs`
  - `providerFetchedAt`
- `state`
  - `status`
  - `authority`
  - `availability`
  - `pending`
- `warnings`
- `gaps`
- `diagnostics`
- `adapterPreview`

The mapper intentionally does not emit `displaySafe` or `certainty`.

## Fixture States Covered

`scripts/verify-passive-adapter.js` covers:

- fresh current-system context
- stale context
- partial provider sample
- capped zKill sample warning while preserving primary status
- I/O off / blocked authority state
- degraded resolver state
- no observation / unavailable state

The verifier also asserts that `adapterPreview` exists and forbidden `displaySafe` / `certainty` slots are absent.

## Verification

Passed:

```txt
npm.cmd run verify:passive-adapter
npm.cmd run verify:protected-terms
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-boundary
git diff --check
git status --short --branch
```

`verify:protected-terms` completed with warning-only advisory output, as expected for the working set. No protected-word JSON updates or renames were performed.

## Deviations From HS60 / HS61

- No material deviations.
- HS60 still used `displaySafe` in its earlier minimum-envelope table, but HS61 and HS62 explicitly accepted replacing it with `adapterPreview`; implementation follows HS61/HS62.
- The mapper keeps `I/O off - ingest blocked` inside adapter preview/authority warning only. It does not change renderer-visible copy.

## Risks / Cleanup

- The mapper is not yet connected to any presentation head.
- `adapterPreview` copy remains provisional and should be reviewed before renderer/user-facing adoption.
- Provider cache detail remains diagnostic/detail-oriented; deeper adapter law may later normalize provider-specific cache language.
- This is Passive-only and should not be generalized to Combat Witness, Threat Intel, Clipboard Acquisition, or a universal Aura adapter without a fresh packet.

## Recommendation

Ready for future presentation-head connection as a Passive-only landing pad.

Next packet should either connect a future head to this mapper or explicitly park the mapper until Lab/presentation timing is right.
