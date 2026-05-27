# DevHS56 - M12I I/O Authority Reconciliation

Date: 2026-05-27
Role: Dev
Source packet: `workspace/current.md`

## Summary

Implemented ADR-0008 reconciliation for the current local gamelog ingest path:

```txt
I/O off means Sense is not allowed to ingest.
```

The change gates local gamelog ingest at the runtime start boundary, active watcher/read boundary, and runtime event-admission boundary. Combat Witness and Passive Telemetry computations remain pure over already-admitted events and existing state.

No live/manual EVE gamelog ingest was run. No private/operator EVE folders were inspected. No real clipboard content was captured. No live zKill/ESI calls or `AURA_SENSE_LIVE_API=1` runs were used.

## Files Changed

- `src/combat/combatWitnessRuntime.js`
- `src/combat/eveGamelogWatcher.js`
- `src/main/main.js`
- `src/renderer/app.js`
- `scripts/verify-operator-io-gate-separation.js`
- `docs/current-state/current-implementation.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `workspace/current.md`
- `workspace/DevHS56-m12i-io-authority-reconciliation.md`

## Code Path Traced

Production local gamelog event spine:

```txt
combat.witness.start
-> combatWitnessRuntime.start
-> EveGamelogWatcher.start
-> fs.watch / polling
-> EveGamelogWatcher.handleFile
-> readRange
-> parseEveLogLine
-> onEvent
-> combatWitnessRuntime.observeEvent
-> CombatWitnessService.addEvent
-> runtime observers
-> passiveTelemetryService.observeEvent
```

Provider and Clipboard Acquisition paths remain separate:

- Passive/Threat provider calls still use existing live I/O gates.
- Clipboard Acquisition service commands still use the M12H `runClipboardAcquisitionWithGate` wrapper.
- The global `Control+\` shortcut still checks Threat I/O before `clipboard.readText()`.

## Gate Placement Decisions

- Primary start gate: `combatWitnessRuntime.start()` refuses watcher start while runtime ingest I/O is off.
- Production default: main-process Combat Witness runtime starts with `ingestEnabled: false`, matching ADR-0008 default no-ingest posture.
- Runtime I/O-off transition: `setLiveIoPolicy({ lane: 'all', enabled: false })` calls `combatWitnessRuntime.setIngestEnabled(false, reason)`, stops the watcher, and reports watcher state `blocked`.
- Source/read defense: `EveGamelogWatcher` accepts an `isIngestAllowed` callback and checks it at `start`, fs-watch callback, `pollOnce`, `handleFile`, and immediately before `readRange`.
- Admission defense: `combatWitnessRuntime.observeEvent()` ignores events while runtime ingest I/O is off, preventing both Combat Witness service mutation and Passive observer notification if an event reaches runtime anyway.
- Internal computation boundary: `CombatWitnessService` and `passiveTelemetryService` were not made owners of I/O policy.

## Tests Added Or Updated

Updated `scripts/verify-operator-io-gate-separation.js` with deterministic fixture-only coverage:

- `combat.witness.start` equivalent returns blocked while I/O is off and does not call watcher start.
- Active watcher path does not call injected `readRange`, does not emit parser events, and does not admit events after I/O turns off.
- Runtime admission while I/O is off does not mutate Combat Witness event stream, does not notify Passive, does not update Passive current system, and does not trigger provider refresh.
- Existing Clipboard Acquisition no-read/no-scan service-command verification remains intact.
- Existing parser-jump/Passive and Clipboard/Threat separation checks remain intact when I/O is on.

## UI And Docs

- Top-level runtime I/O copy now says ingest is enabled/blocked instead of only network/clipboard.
- Blocked Combat Witness state is rendered as blocked instead of unavailable.
- Current-state and display-pipeline docs now record M12I gate placement.
- Live operator gamelog smoke playbook now requires I/O authority on before watcher start or local gamelog ingest.

## Verification

Passed:

```txt
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git diff --check
git status --short --branch
```

Narrow checks also passed during implementation:

```txt
npm.cmd run verify:operator-io-gates
npm.cmd run verify:combat-runtime
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:gamelog-watcher-chaos
npm.cmd run verify:renderer-shell
npm.cmd run verify:runtime-control
```

## Provider And Clipboard Gate Preservation

- Passive provider gates remain in `passiveTelemetryService.refresh`.
- Threat provider gates remain in `threatIntelService.scan`.
- Provider fault verifier remains unchanged and covered by `verify:all`.
- Clipboard Acquisition `arm` / `capture` service commands remain wrapped by `runClipboardAcquisitionWithGate`.
- Global shortcut no-read-while-off behavior remains intact.

## Remaining Risks / Parked Follow-Up

- No live/manual operator gamelog smoke was run; real EVE appends remain future explicitly authorized work.
- Manual OS accelerator feel remains unverified.
- Provider requests already in flight when I/O turns off remain a future policy question; existing gates prevent new calls while off.
- Static app-owned metadata lookup remains treated as support-only. Future arbitrary metadata source reads or SDE refreshes still need explicit authorization.
