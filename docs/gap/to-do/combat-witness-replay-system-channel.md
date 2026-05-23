# Gap: Combat Witness Replay System Channel

Status: Open
Priority: P1

## Feature Request

AURA-Sense needs a system-level Combat Witness replay channel for diagnostics, UI testing, and short-window after-action review.

The replay channel must let the operator or developer point AURA-Sense at an EVE gamelog file and simulate Combat Witness snapshots from existing log lines without corrupting or mutating the live Combat Witness lane.

The feature is intentionally a system/backend change first. The HUD/UI presentation, scan face behavior, diagnostics drawer layout, and visual controls are separate tasks and should not be changed as part of this packet.

## Need

Current Combat Witness live behavior is intentionally append-only. That protects live tactical truth, but it leaves two important gaps:

- The UI cannot be exercised against repeatable combat streams without waiting for live EVE activity.
- The operator cannot replay recent combat log context to understand what just happened.

Replay should use the same parser and Combat Witness compute model where possible, but it must run on a separate reader instruction and data channel.

## Core Concept

Two readers may point at the same source file and initial file position, but they must own separate cursors and separate output channels.

Live reader:

- Starts at current file end or known live offset.
- Reads only newly appended data.
- Moves forward.
- Feeds the live Combat Witness service/channel.
- May feed Passive Telemetry for actual current-session navigation changes.

Replay reader:

- Starts from the same file position as the live reader when replay is armed.
- Owns an independent replay cursor.
- Moves upward through existing lines.
- Reads each selected line left-to-right through the parser.
- Feeds only a replay Combat Witness service/channel.
- Never mutates live Combat Witness state.
- Never feeds Passive Telemetry unless a future explicit replay-test mode authorizes it.

Plain-language model:

```txt
Live answers: what is happening now?
Replay answers: what just happened before now?
```

## System Tasks

### Task 1: Define Replay Channel Boundary

- Add a documented replay channel boundary distinct from the live Combat Witness channel.
- Choose stable names for live and replay snapshot concepts, such as `combat.live.snapshot` and `combat.replay.snapshot`, or equivalent local naming.
- Keep live Combat Witness snapshot behavior unchanged.
- Make replay state visibly distinguishable in returned system status, but do not implement HUD presentation in this task.

Completion signal:

- Docs and tests can prove live and replay snapshots are separate objects with separate state.

### Task 2: Add Reverse Replay Reader

- Add a backend reader that can start from a known file path and byte/line position.
- Move upward through existing log lines.
- For each selected line, parse the full line normally from left to right with `parseEveLogLine`.
- Support step-style replay first.
- Defer speed controls, scrubber UI, and polished playback controls.

Guardrails:

- Do not reuse the live watcher cursor.
- Do not tail new data from the replay reader.
- Do not store raw private log lines in renderer state.

Completion signal:

- A fixture-backed test can start from a known line and emit prior parsed events in reverse file order.

### Task 3: Add Replay Combat Witness Service Instance

- Create or wire a separate `CombatWitnessService` instance for replay snapshots.
- Feed parsed replay combat events into the replay service only.
- Preserve live service state before, during, and after replay.
- Return replay snapshot/status through backend-owned service commands or bridge methods.

Guardrails:

- Replay must not call `liveCombatWitnessService.addEvent`.
- Replay must not publish over the live snapshot bridge.
- Replay must not clear live rolling windows.

Completion signal:

- A test proves live snapshot totals remain unchanged after replay events are processed.

### Task 4: Replay Status And Diagnostics Commands

- Add backend commands for replay diagnostics, such as status, arm/load, step, stop, and clear.
- Expose parsed/skipped/rejected counts.
- Expose source file label/path only through existing safe IPC boundaries.
- Mark replay status as diagnostic/simulation state, not live telemetry.

Guardrails:

- Do not add UI controls in this packet.
- Do not add Atlas persistence or history export.
- Do not make replay commands run by default at startup.

Completion signal:

- Verification can invoke replay commands and inspect status without launching the renderer.

### Task 5: Add Rolling Hit/Miss Attempt Counts

Combat Witness currently computes outgoing DPS and most common outgoing hit quality, and it parses outgoing misses, but rolling-window miss counts are not exposed in Combat Witness snapshots.

Add backend rolling-window counts for observed outgoing attack events:

- outgoing damage event count
- outgoing miss event count
- outgoing observed attempt count, defined as outgoing damage events plus outgoing miss events

Optional internal names:

```txt
windows.15s.damage.outgoing.eventCount
windows.15s.miss.outgoing.eventCount
windows.15s.attack.outgoing.observedAttemptCount
```

Guardrails:

- Do not compute an accuracy percentage yet.
- Do not imply weapon-cycle truth. These are observed log events only.
- Do not compute this in the renderer.

Completion signal:

- Tests prove a 15 second window can report outgoing damage count, outgoing miss count, and total observed attempts.

### Task 6: Snapshot Contract Update

- Update `docs/schemas/hud-snapshot.md` and `docs/schemas/combat-event.md` for replay and hit/miss attempt counts.
- Clarify that replay snapshots are simulation/diagnostic snapshots.
- Clarify that outgoing hit quality means most frequent observed outgoing hit quality, not best hit quality.
- Clarify that outgoing hits are observed damage events, not guaranteed individual weapon cycles.

Completion signal:

- Schema docs match actual backend snapshot fields and copy guardrails.

### Task 7: Replay Verification

- Add deterministic tests for replay parsing and snapshot isolation.
- Cover:
  - replay reader moves upward through prior lines
  - each line is parsed left-to-right
  - skipped/unparsed lines are counted
  - live Combat Witness totals are unchanged
  - replay Combat Witness totals update
  - outgoing hit/miss attempt counts are correct

Completion signal:

- New replay verification passes.
- `npm.cmd run verify:all` includes or references deterministic replay checks without requiring live EVE or network access.

## Explicit UI Deferral

This packet does not authorize UI behavior changes.

Deferred UI work includes:

- diagnostics drawer/flyout presentation
- replay controls
- replay pill in the HUD chrome
- combat pressure radial changes
- search face/peek mode behavior
- target type chip behavior
- combat metric layout changes

Those should be handled in a later presentation-layer task after the system channel and snapshot contracts are stable.

## Guardrails

- Replay must never corrupt live Combat Witness state.
- Replay must never mutate Passive Telemetry by default.
- Replay must be clearly classified as diagnostic/simulation state.
- Replay must not create persistent combat history.
- Replay must not add Atlas-style evidence storage.
- Renderer must consume backend-owned replay snapshots and must not parse log files.
- UI changes are out of scope for this system packet.

## Completion Signal

- A separate replay channel exists.
- Replay can process prior lines from a gamelog file without touching live state.
- Combat Witness snapshots expose outgoing hit/miss attempt counts.
- Schema docs describe replay and attempt-count semantics.
- Deterministic verification passes.
- Live Combat Witness append-only behavior remains unchanged.

## Related Files

- `src/combat/combatLogParser.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatRollingWindow.js`
- `src/combat/combatWitnessService.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessBridge.js`
- `src/main/main.js`
- `src/main/preload.js`
- `scripts/verify-combat-witness-core.js`
- `scripts/verify-combat-log-replay.js`
- `scripts/verify-combat-golden-snapshots.js`
- `docs/contracts/combat-witness-contract.md`
- `docs/schemas/hud-snapshot.md`
- `docs/schemas/combat-event.md`
