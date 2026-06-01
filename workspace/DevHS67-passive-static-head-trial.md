# DevHS67 - Passive Static Head Trial

Date: 2026-06-01
Role: Dev
Source packet: `workspace/current.md`

## Summary

Implemented the M16D Passive Static Head Trial as a tiny Sense-local mapper:

```txt
Passive fixture snapshot
-> mapPassiveTelemetryAdapter(snapshot)
-> mapPassiveStaticHeadTrial(adapter)
-> passive.static-head-trial.input
STOP
```

No Lab files were imported, copied, or read at runtime. No renderer face, bridge/preload/IPC connection, runtime integration, live provider access, clipboard capture, private path read, or manual EVE gamelog ingestion was introduced.

## Files Changed

- `src/passive/passiveStaticHeadTrial.js`
- `scripts/verify-passive-static-head-trial.js`
- `package.json`
- `scripts/verify-all.js`
- `workspace/current.md`
- `workspace/DevHS67-passive-static-head-trial.md`

## Trial Flow Implemented

`mapPassiveStaticHeadTrial(adapter)` accepts existing `passive.telemetry.adapter` output and emits a static, presentation-head-shaped inspection input:

- `kind: passive.static-head-trial.input`
- `trial` boundary metadata naming Sense ownership and fixture/static-only use
- `readout` with Passive label, primary value, source-owned state, basis, age, sample, authority, and warning lines
- `availability` with reason-first Sense status preservation
- `warnings` and `gaps`, each source-owned
- `detail` for current system, observation, resolver, providers, freshness, and diagnostics
- `sourceAdapter` carrying the accepted adapter fields, including `adapterPreview`

The mapper starts at the Sense-owned adapter boundary and remains a static trial artifact, not a bridge/runtime contract.

## State Cases Covered

`scripts/verify-passive-static-head-trial.js` covers:

- fresh current-system context
- stale context
- partial provider sample
- capped zKill sample warning while preserving source status
- blocked / I/O-off authority state
- degraded resolver state
- no-observation / unavailable state

The verifier also asserts that Lab example labels `CURRENT`, `AGED`, `PARTIAL`, `UNAVAILABLE`, `FALLBACK`, and `NO DATA` are not imported into the trial output.

## Sense-Owned

Still Sense-owned:

- `mapPassiveTelemetryAdapter`
- Passive lane identity
- `adapterPreview`
- source status and availability meaning
- `basis + freshness + warnings + gaps`
- `I/O off - ingest blocked`
- `No observation`
- degraded, stale, partial, capped, and authority-blocked distinctions

The trial intentionally does not emit `displaySafe` or `certainty`.

## Lab / Example-Only

Lab remains example-only. The local tree did not contain a copied Lab static starter package, and this packet did not require one to create a static Sense-side trial input.

No Lab state labels, sample meanings, visual shell, React pane, selector, routing, app shell, or future Lab upgrade path was adopted.

## Verification

Passed:

```txt
npm.cmd run verify:passive-static-head
npm.cmd run verify:passive-adapter
npm.cmd run verify:passive-telemetry
npm.cmd run verify:protected-terms
git diff --check
git status --short --branch
npm.cmd run verify:all
```

`verify:protected-terms` passed with warning-only advisory output for existing accepted terms and this new handoff/trial wording.

`git diff --check` passed with line-ending normalization warnings only for touched files.

## Screenshots / Browser Notes

No local visual demo or browser screenshot was run. This packet implemented a static mapper and deterministic verifier only.

## Handoff

Ready for Overseer/UI review as a static Passive-only trial input.

Recommended next review lane: inspect whether `passive.static-head-trial.input` is sufficient pressure for a future copied/reference static head, or whether Lab should provide a clean Sense-local static package containing only the minimal HTML/JS/CSS/JSON demo pieces plus provenance notes.
