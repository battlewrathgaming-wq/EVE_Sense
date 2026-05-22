# Audit: Aggressive Testing And Bug Hunting Assessment

Date: 2026-05-23
Role: Overseer
Scope: Full AURA-Sense assessment for aggressive testing, fault discovery, and bug-hunting task population.

## Current Status

AURA-Sense is healthy under the existing confidence gates.

Verification run during this assessment:

```txt
npm.cmd run verify:all
all checks verified
```

Electron visual smoke run during this assessment:

```txt
npm.cmd run smoke:electron
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
clipboard_acquisition_global_shortcut { accelerator: 'CommandOrControl+Shift+Space', registered: true }
```

Current product state:

- Milestones 05 through 11 are complete.
- Milestone 12 remains the live validation and tactical calibration runway.
- Offline verification is broad but mostly deterministic and fixture-led.
- Live/manual evidence is still the major product-trust gap.
- Local metadata/SDE builder work is present in the working tree and has a Dev handover; it still needs adversarial hardening before broader product reliance.

Local metadata implementation files observed:

- `src/metadata/localTypeMetadata.js`
- `src/metadata/sdeJsonlZip.js`
- `src/util/sdeSourceBundle.js`

Related handover observed:

- `docs/audits/audit-2026-05-23-sde-local-type-metadata-handover.md`

User note during assessment: Dev is actively downloading the SDE. Treat that as active implementation work. Do not overwrite, delete, move, or stage downloaded SDE artifacts by default.

## Assessment

The main testing risk is not that AURA-Sense lacks tests. It has a useful offline verification spine.

The main risk is that the current verification spine is still too polite:

- parser tests use curated examples, not hostile/near-miss/fuzzed inputs
- watcher tests prove intended append semantics, not enough filesystem chaos
- provider clients prove normalized outcomes, not enough timeout/cancel/rate-limit/malformed sequences
- renderer boundary checks are static and should be stress-tested against bridge misuse patterns
- Electron smoke proves first-load visibility, not layout stress or state permutations
- runtime settings tests prove valid/invalid paths, not corrupted settings variants and concurrent mutation
- clipboard tests prove lifecycle basics, not rapid re-arm/cancel/cooldown race surfaces
- metadata/SDE code has a foundation verification path, but still needs hostile ZIP/source/input tests before broader product reliance

## Bug-Hunting Doctrine

Aggressive testing should try to break invariants without expanding product scope.

Do:

- test hostile inputs
- test stale, malformed, missing, partial, oversized, reordered, and duplicated data
- test cancellation and timeout paths
- test renderer/preload boundary misuse
- test noisy runtime sessions
- turn reusable failures into `docs/failures` records

Do not:

- add broad collection
- ingest private logs wholesale
- run live APIs inside `verify:all`
- weaken renderer boundary rules for convenience
- bless downloaded SDE artifacts without verification
- turn bug-hunting helpers into product features

## Risk Ranking

### P0: Invariant Breakers

These can undermine trust directly:

- parser accepts wrong lines as truth
- watcher replays old files or leaks raw log content
- renderer gains telemetry/provider authority
- live IO gate is bypassed
- clipboard listener captures outside the visible armed lifecycle

### P1: Operator Confidence Breakers

These make the app hard to trust under pressure:

- provider failures look like empty intelligence
- settings recovery misleads the operator
- diagnostics either flood or hide the useful failure
- visual layout overlaps, hides controls, or compresses critical text
- Electron smoke passes while important states are untested

### P2: Future Hardening Breakers

These will become serious if accepted too early:

- local metadata builder downloads/parses too broadly under hostile or huge inputs
- large ZIP/SDE handling is not bounded enough for adversarial inputs
- real SDE download artifacts are mistaken for committed product artifacts
- active-scan validator residue confuses the Threat Intel contract
- fixture coverage looks broader than parser truth

## Populated Task Runway

Use `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md` as the implementation guide.

Priority order:

1. `docs/gap/to-do/aggressive-test-harness-matrix.md`
2. `docs/gap/to-do/combat-parser-hostile-fixtures.md`
3. `docs/gap/to-do/gamelog-watcher-chaos-tests.md`
4. `docs/gap/to-do/renderer-preload-boundary-adversarial-tests.md`
5. `docs/gap/to-do/live-io-provider-fault-injection.md`
6. `docs/gap/to-do/clipboard-acquisition-race-tests.md`
7. `docs/gap/to-do/runtime-settings-diagnostics-fault-tests.md`
8. `docs/gap/to-do/electron-visual-state-regression-tests.md`
9. `docs/gap/to-do/local-metadata-sde-builder-hardening.md`
10. `docs/gap/to-do/bug-hunt-triage-and-failure-records.md`

## Acceptance Rule

A bug-hunting slice is complete only when it leaves:

- a failing test that now passes, or
- a documented refusal/deferral with reason, or
- a durable failure record, and
- `npm.cmd run verify:all` still passing.

If a test requires Electron, local EVE logs, live network, or large SDE assets, it must stay outside `verify:all` unless it is made deterministic and offline.
