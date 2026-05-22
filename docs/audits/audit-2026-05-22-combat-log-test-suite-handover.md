# Audit: Combat Log Test Suite Handover

Date: 2026-05-22
Scope: Milestone 07, Combat Logging Test Suite.

## Readiness Verdict

Ready with caveats.

AURA-Sense now has an offline combat-log verification feature for curated data. It can validate curated fixture rows and hashes, summarize event-family coverage, replay an ordered dataset through parser/runtime/service boundaries, and assert deterministic Combat Witness golden snapshots.

No renderer, Threat Intel, ESI, Atlas persistence, private log ingestion, or normal-runtime replay behavior was added.

## Feature Anchors Used

- `docs/features/vision.md` Element 2: Combat Witness
- `docs/features/vision.md` Element 3: Passive Telemetry
- `docs/features/vision.md` Element 6: Diagnostics And Degraded State
- `docs/features/combat-logging-test-suite.md`
- `docs/audits/audit-2026-05-22-combat-log-test-suite-milestone-handover.md`

## Fixture Ingestion

Curated source:

```txt
fixtures/combat-log-curated-source.jsonl
```

Each row includes:

- `name`
- `sourceFile`
- `sourceLine`
- `rawLineHash`
- `proposedFamily`
- `expectedDisposition`
- exact `raw` line

Importer:

```txt
scripts/import-combat-log-fixtures.js
```

Accepted input formats are JSONL, JSON, and CSV exports. The importer refuses unsupported formats, missing required fields, invalid dispositions, malformed JSONL, non-array JSON rows, and raw-line hash drift.

## Coverage Matrix

Coverage file:

```txt
fixtures/combat-log-event-coverage.json
```

Current summary:

```txt
supported=5 rejected=2 deferred=1 unknown=0
```

Supported families require exact raw fixture rows. Deferred families remain visible and are not parser claims.

## Replay Harness

Replay dataset:

```txt
fixtures/combat-log-replay-dataset.json
```

Replay verifier:

```txt
scripts/verify-combat-log-replay.js
```

The replay path exercises:

- parser ingestion from exact raw lines
- chunking and partial-line assembly
- duplicate suppression semantics
- Combat Witness runtime `observeEvent` fan-out
- listener isolation
- Combat Witness service snapshot behavior

Runtime doctrine is unchanged: replay is offline verification only.

## Golden Snapshots

Golden verifier:

```txt
scripts/verify-combat-golden-snapshots.js
```

Assertions cover 5s, 15s, and 30s Combat Witness windows, incoming totals, DPS, top source, outgoing totals, balance fields, event stream count, and freshness stream count.

## Runtime Boundary Note

The replay harness exposed a useful ordering edge. Combat Witness now ignores non-Combat Witness event kinds in `CombatWitnessService.addEvent`, and default snapshot reference time remains monotonic across out-of-order combat lines. Navigation events still fan out through the runtime for Passive Telemetry.

## Repair And Healing

Raw repair/healing parser support remains deferred.

The current exact curated set includes a rejected capacitor-insufficient notify line as a non-healing lookalike. No exact healing sample was added, so no parser claim for raw `combat.repair` was introduced.

## Verification

Executed:

```powershell
npm.cmd run verify:combat-fixtures
npm.cmd run verify:combat-coverage
npm.cmd run verify:combat-replay
npm.cmd run verify:combat-golden
npm.cmd run verify:combat-parser
npm.cmd run verify:combat-runtime
npm.cmd run verify:combat-witness
npm.cmd run verify:all
```

Observed:

```txt
combat fixture ingestion verified: 7 curated rows
combat log coverage verified: supported=5 rejected=2 deferred=1 unknown=0
combat log replay verified: events=5 stream=4
combat golden snapshots verified: windows=5s,15s,30s
combat parser verified
combat witness runtime verified
combat witness core verified
all checks verified
```

## Concerns

- The curated dataset is intentionally small.
- Coverage counts are observability, not tactical certainty.
- Repair/healing HPS parser claims are still blocked on exact raw samples.
- Replay must remain outside normal runtime behavior.

## Deferred Work

- More real-data fixture rows from explicit curated sources.
- Exact repair/healing samples.
- Expanded unknown/deferred event-family coverage.
- Separate live EVE operational smoke.
