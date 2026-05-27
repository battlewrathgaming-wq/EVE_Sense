# EngTraceHS53 - Gamelog Event Spine Trace

Date: 2026-05-27
Role: Security / Engineering reviewer
Status: Read-only trace complete

## Question

Confirm whether local log-derived computation enters through a single shared event spine, and identify where a future ADR-0008 ingest-boundary gate would be most central.

## Files Reviewed

- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessService.js`
- `src/passive/passiveTelemetryService.js`
- `src/main/main.js`
- `scripts/verify-operator-io-gate-separation.js`

Static cross-reference search also covered `src` and `scripts` for:

- `parseEveLogLine`
- `new EveGamelogWatcher`
- `createCombatWitnessRuntime`
- `observeEvent(`
- `subscribeEvents(`
- `addEvent(`
- `passiveTelemetryService.observeEvent`
- provider fetch calls

## Trace Findings

### Where `EveGamelogWatcher` emits parsed events

`src/combat/eveGamelogWatcher.js` is the production file reader/parser boundary.

The path is:

```txt
fs.watch / polling
-> handleFile(filePath)
-> readRange(containedPath, previousOffset, stats.size)
-> collectCompleteLines(...)
-> parseLine(line), default parseEveLogLine
-> deduper.isDuplicate(event)
-> this.onEvent(event)
```

`EveGamelogWatcher` does not know about Combat Witness or Passive directly. It emits parsed accepted events only through its injected `onEvent` callback.

### Whether `combatWitnessRuntime.observeEvent` receives all gamelog parser events

Yes for the production runtime-owned watcher.

`src/combat/combatWitnessRuntime.js` constructs the default `EveGamelogWatcher` with:

```txt
onEvent: (event) => {
  observeEvent(event);
}
```

So accepted parser events emitted by the runtime-owned watcher enter `combatWitnessRuntime.observeEvent(event)`.

Inside `observeEvent`:

```txt
service.addEvent(event)
notifyObservers(event)
```

This means the runtime is the central admission point after parser emission.

Important nuance:

- `CombatWitnessService.addEvent` only accepts Combat Witness stream events: `combat.damage`, `combat.miss`, and `combat.repair`.
- Navigation events still pass through `combatWitnessRuntime.observeEvent` and then through `notifyObservers(event)`, even though `CombatWitnessService.addEvent` does not add them to Combat Witness windows/event stream.

### Whether Passive subscribes to the same runtime/event observer path

Yes in production wiring.

`src/main/main.js` creates `combatWitnessRuntime` with an observer:

```txt
observers: [(event) => {
  passiveTelemetryService.observeEvent(event).catch(...)
}]
```

`src/passive/passiveTelemetryService.js` then admits only:

```txt
event.kind === 'navigation.jump' && event.systemName
```

So Passive does not read logs and does not subscribe to the watcher directly. It receives parser-derived navigation events through the Combat Witness runtime observer path.

### Other parser-to-Passive or parser-to-Combat paths

No other production parser-to-Passive or parser-to-Combat path was found in static inspection.

Found non-production / fixture paths:

- Tests call `runtime.observeEvent(...)` directly to inject fixture events.
- Some tests call `CombatWitnessService.addEvent(...)` directly for pure rolling-window/service verification.
- Passive tests and live API smoke harnesses call `passiveTelemetryService.observeEvent(...)` directly with synthetic navigation events.
- Replay tests construct temporary watcher/runtime paths for fixture verification.

These are support/test paths, not normal runtime ingestion from an operator gamelog folder.

### Provider calls are separate from the event spine

Yes.

Provider calls are not emitted by `EveGamelogWatcher` and do not flow through `combatWitnessRuntime.observeEvent`.

Passive provider path:

```txt
passiveTelemetryService.observeEvent(navigation.jump)
-> state.currentSystem mutation
-> refresh({ reason: 'system-change' })
-> liveIoGate.check({ providers: ['esi', 'zkill'] })
-> esiActivityClient.fetchSystemActivity(...)
-> zkillClient.fetchSystemContext(...)
```

Threat provider path:

```txt
threatIntelService.scan(request)
-> normalize / resolve target
-> liveIoGate.check({ providers: ['zkill'] })
-> zkillClient.fetchTargetRefs(...)
```

Clipboard Acquisition may call Threat scan after a gated clipboard capture, but it is not part of the gamelog event spine.

## Central Ingest-Boundary Gate

The most central boundary for local gamelog ingest is before or at the watcher admission point:

```txt
EveGamelogWatcher.start / active watching
and defensively before EveGamelogWatcher.readRange / onEvent
```

Practical central points:

1. `combat.witness.start` / `combatWitnessRuntime.start`
   - Prevent starting the watcher when I/O authority is off.
2. Runtime I/O-off transition in `src/main/main.js`
   - Stop or pause an already active watcher when the operator disables I/O.
3. Defensive watcher/read guard before `readRange` or before `this.onEvent(event)`
   - Protects against direct `handleFile` paths or future lifecycle mistakes.
4. Optional runtime admission guard in `combatWitnessRuntime.observeEvent`
   - Blocks downstream mutation if an event reaches runtime while I/O is off, but it is later than ideal because file content has already been read and parsed.

Best security posture:

```txt
Gate at source/read boundary first.
Keep a runtime admission guard as defense in depth.
```

## Would Gating Watcher / Read / Admit Prevent Both Combat And Passive Updates?

Yes.

If I/O authority blocks the watcher from starting, or blocks file tail reads before parser emission, no parsed gamelog event reaches:

- `combatWitnessRuntime.observeEvent`
- `CombatWitnessService.addEvent`
- `notifyObservers(event)`
- `passiveTelemetryService.observeEvent`

Therefore both Combat Witness updates and Passive parser-observed current-system updates are prevented.

If the gate is placed only inside `CombatWitnessService.addEvent`, it would not be sufficient, because navigation events are not Combat Witness service events but still notify Passive through runtime observers.

If the gate is placed only inside `passiveTelemetryService.observeEvent`, it would stop Passive updates but not Combat Witness updates.

If the gate is placed only inside provider clients, it would stop ESI/zKill calls but still allow local log observation and Combat/Passive state mutation.

## Dev Principle Confirmed

The source supports the future principle:

```txt
I/O authority is enforced at ingest boundaries.
Internal computation remains pure over admitted events and existing state.
```

For local gamelog ingest, the strongest version is:

```txt
No I/O authority -> no watcher start, no tail read, no parser event emission.
Admitted event -> Combat Witness service and Passive observer can compute normally.
```

This keeps internal lane computation clean and avoids scattering I/O authority checks through every downstream metric or display function.

## Notes For Future ADR-0008 Reconciliation

- The current single event spine makes a centralized local-ingest gate realistic.
- The future gate should not be confused with provider gates. Provider calls remain separate and still need their existing gates.
- Direct fixture/test injection should remain possible as support-only verification, with tests clearly separated from operator-machine ingest.
- `combatWitnessRuntime.observeEvent` is central for admitted events, but not early enough to be the only privacy/trust gate because parser/file ingest has already happened.
- The future Dev packet should avoid making Combat Witness and Passive each invent separate log-ingest gates if a source/read gate can cover both.

## Verification

Static/read-only commands run:

- `Get-Content` on the listed source and test files.
- `rg` cross-reference search across `src` and `scripts` for parser, watcher, runtime observer, service event, Passive observer, and provider call symbols.
- `git status --short --branch` before artifact creation.

No code was changed. No tests were run. No live/manual/private I/O was run. No real EVE log folders were inspected. No clipboard content was captured. No provider smoke was run.
