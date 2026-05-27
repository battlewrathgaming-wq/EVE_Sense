# EngMapHS55 - I/O Authority State and Gate Placement

Date: 2026-05-27
Role: Security / Engineering reviewer
Mode: Read-only planning map for future Dev work

## Scope

This artifact maps the intended ADR-0008 target behavior for I/O authority and candidate gate placement on the gamelog ingest path. It does not implement code, open a Dev runway, rename terms, inspect private/live inputs, capture clipboard content, or run live provider smoke.

Primary prior inputs:

- `docs/adr/ADR-0008-io-off-means-no-ingest.md`
- `workspace/SecEngHS52-io-authority-reconciliation-audit.md`
- `workspace/EngTraceHS53-gamelog-event-spine-trace.md`
- `workspace/SecEngHS54-ingest-source-defensive-posture-audit.md`

## Current Read

The current production gamelog spine is:

```text
EveGamelogWatcher parsed event
  -> combatWitnessRuntime.observeEvent(event)
  -> CombatWitnessService.addEvent(event)
  -> combatWitnessRuntime.notifyObservers(event)
  -> passiveTelemetryService.observeEvent(event)
```

Provider calls are separate from the spine. Passive may decide to call ESI or zKill after observing admitted navigation/system state, but those outbound provider calls are not how parser events enter the local event spine.

The planning stance remains:

```text
I/O authority is enforced at ingest boundaries.
Internal computation remains pure over admitted events and existing state.
```

## Part 1: I/O Authority State Map

| Current State | User Action / Event | Target Transition | Allowed Side Effects | Blocked Side Effects | User-Facing State | Tests Needed |
|---|---|---|---|---|---|---|
| App starting; persisted or default I/O authority is off | App launch / runtime init | Services initialize with ingest disabled; persisted settings may load, but no ingest lane starts | Load settings; render existing snapshots; initialize diagnostics and non-ingest UI state | Gamelog watcher start; file tail reads; clipboard reads/listeners; provider calls; live/manual scan | I/O off; existing/resting data may display as not fresh; no observation is active | Startup test with I/O off proves no watcher start, no read calls, no clipboard reads, no provider calls |
| I/O off | Configure or persist gamelog path | Path setting is accepted as configuration only; watcher remains stopped/blocked | Store chosen path; perform narrowly scoped path support checks if product accepts them as support-only | `fs.watch`; polling; offset seeding that touches live files; `readRange`; parser admission | Path configured, but I/O off prevents observation | Settings test proves path can persist while watcher/read calls remain zero |
| I/O off | Attempt `combat.witness.start` / watcher start | Start request is refused before source read/watch setup | Return blocked/unavailable state; update diagnostics; keep prior snapshots | Watcher construction/start side effects; folder enumeration for ingest; file tail reads; parser events | Blocked because I/O is off | Service-command test proves runtime/watcher start is not called; source spy proves no reads |
| I/O off | Attempt Ctrl+\ Clipboard Acquisition | Acquisition is refused before clipboard access | Show blocked/cooldown-safe state; keep prior clipboard-derived snapshot if any as resting/nonfresh | `clipboard.readText`; listener/poller activation; provider scan from captured text | Blocked because I/O is off | Existing clipboard race tests plus off-state shortcut test proving `readText` and provider calls are zero |
| I/O off | Attempt provider scan / refresh | Scan is refused before outbound provider call | Return blocked diagnostic; preserve existing cached/resting snapshot | ESI/zKill HTTP calls; live provider refresh; provider-triggered artifact with private raw input | Blocked because I/O is off, or provider unavailable if separately configured unavailable | Passive and Threat provider gate tests proving zero provider calls and expected refusal shape |
| I/O off | User toggles I/O on | Authority becomes enabled; no ingest starts solely because authority changed | Update policy state; enable future explicit/allowed ingest actions; update UI affordances | Auto-start watcher; auto-read clipboard; auto-refresh providers without a lane action | I/O on; observation still idle until a lane starts or a valid event occurs | Toggle-on test proves enabling authority has no spontaneous ingest |
| I/O on | Start watcher | Watcher may start against configured path and observe future appends | Path containment checks; offset seeding to avoid replay; `fs.watch`/polling; future append reads | Out-of-root reads; historical replay beyond intended tail behavior; provider calls unrelated to admitted events | Combat observation active / waiting for events | Gate-on positive test plus existing watcher containment and append-only tests |
| I/O on | Parser event admitted | Parsed event enters runtime spine and may update internal state | Combat updates for combat events; observer notification; Passive current-system observation for navigation/system events; provider refresh only through provider gates | Threat scan triggered directly by parser; raw log persistence beyond intended artifacts | Observation active; last observed state may update | Event-spine test proving watcher event reaches runtime, Combat, and Passive only after admission |
| I/O on with watcher active | User toggles I/O off | Authority disables ingest and active watcher is stopped or paused before further reads | Stop `fs.watch`; clear poll timer; preserve configured path and resting snapshots; show diagnostics | Further folder polling; file tail reads; parse/admit events; Passive updates from new log lines | I/O off; last observed/resting state remains but is not fresh | Active watcher toggle-off test proving callbacks after off do not call `handleFile`, `readRange`, or observers |
| I/O on with clipboard listener active | User toggles I/O off | Clipboard listener/capture state is cancelled or sealed before further reads | Clear listener/poller/cooldown timers as appropriate; preserve nonfresh prior result | Clipboard reads; capture admission; provider scans triggered by clipboard text | I/O off; Clipboard Acquisition blocked/resting | Listener-off test proving no later `readText`, capture, or provider call after toggle |
| I/O on with provider request queued but not started | User toggles I/O off before outbound call begins | Queued scan sees disabled authority and is refused before network egress | Return blocked/aborted diagnostic; preserve prior snapshot/cache | ESI/zKill outbound call; scan artifact claiming fresh live result | I/O off or provider blocked; no fresh provider result | Delayed-provider test proving queued-but-unstarted request makes zero outbound calls after off |
| I/O off | View existing snapshots / diagnostics | Read-only local display remains allowed | Render cached/resting snapshots; show timestamps, stale/no-observation indicators, blocked diagnostics | Refreshes; re-scans; source reads; provider calls; clipboard capture | Last observed/resting state; no observation active; I/O off | Renderer/service snapshot tests proving view-only commands do not invoke ingest lanes |
| Startup recovery with persisted settings | App starts with saved path, prior state, or previous active lane | Settings recover as configuration; ingest remains off until authority and lane action allow it | Load path; render prior diagnostics/snapshots; mark lanes idle/blocked as needed | Auto-start watcher while I/O off; replay saved live lane; provider/clipboard recovery ingest | I/O off with persisted configuration present | Startup recovery test with persisted path/active marker proving no watcher/read/provider/clipboard activity |

## Part 2: Source / Read Gate Placement Map

| Gate Point | File / Function | Placement Timing | Can Prevent | Cannot Prevent | Recommended Role | Test Shape |
|---|---|---|---|---|---|---|
| `combat.witness.start` service command | `src/main/main.js` handler for `combat.witness.start` | Earliest renderer/service command boundary | User/API attempts to start watcher; backend start call; watcher side effects through this command | Direct backend calls in tests or future code paths; already active watcher reads unless toggle-off also stops it | Primary user-action gate | Invoke command with I/O off; assert blocked result, runtime start not called, watcher/read spies untouched |
| `combatWitnessRuntime.start` | `src/combat/combatWitnessRuntime.js` `start` | Backend lane lifecycle boundary before watcher start | Starts from any caller that uses runtime; watcher start; source setup | Existing active watcher loop unless stop/pause is handled on authority change; direct watcher method calls | Primary backend gate | Call runtime start with I/O off; assert blocked state and no `watcher.start` |
| `EveGamelogWatcher.start` | `src/combat/eveGamelogWatcher.js` `start` | Source object boundary before root resolution, initial scan, watch setup | `fs.watch`; polling setup; offset seeding; later append reads from a newly started watcher | Higher-level UX/refusal wording; already emitted/admitted events; direct calls to lower methods | Defense-in-depth source gate | Instantiate watcher with disabled authority; call `start`; assert no watch/poll/read setup |
| Watcher active loop / fs-watch callback | `src/combat/eveGamelogWatcher.js` fs-watch callback and poll loop | After watcher exists, before callback hands work to `handleFile` | Reads after I/O turns off while watcher object still exists; race callbacks after stop | Initial watcher setup; path event metadata; calls that bypass callback and call `handleFile` directly | Defense-in-depth active-off guard | Start while on, toggle off, trigger callback/poll; assert `handleFile` and `readRange` not called |
| `handleFile` | `src/combat/eveGamelogWatcher.js` `handleFile` | Central per-file handling before tail read if gate is placed at top | Manual, poll, and fs-watch file handling; downstream read/parse/event admission | Watcher existence; some path/stat checks if they happen before the gate; user-facing command state | Defense-in-depth central file gate | Call `handleFile` while off; assert empty/no-op result, no `readRange`, no parser, no event |
| Before `readRange` | `src/combat/eveGamelogWatcher.js` immediately before `this.readRange(...)` | Last privacy-preserving point before file bytes are read | File content read; parser input creation; all downstream parser/runtime updates | Prior path resolution/stat/offset decisions; watcher existence; fs-watch metadata | Critical no-read guard | Inject `readRange` spy; toggle off before append handling; assert spy remains zero |
| Before `parseLine` | `src/combat/eveGamelogWatcher.js` before `this.parseLine(...)` | After bytes are already read and split into lines | Parser work; event construction; runtime updates | File content read; private bytes in memory; prior tail handling | Too late for privacy; optional parser-side fallback only | Test may prove no parse/admission, but must document that bytes were already read |
| Before `this.onEvent(event)` | `src/combat/eveGamelogWatcher.js` before event callback | After bytes are read and parsed into an event | Runtime admission; Combat and Passive updates | File content read; parser processing; event object creation | Too late for privacy; possible admission fallback | Test proves `onEvent` not called while off, with separate assertion that read guard covers privacy |
| `combatWitnessRuntime.observeEvent` | `src/combat/combatWitnessRuntime.js` `observeEvent` | Runtime event-admission boundary before service and observers | Combat service mutation; observer notification; direct event injection into runtime while off | Watcher file read; parser processing; event creation | Defense-in-depth admission gate | Call `observeEvent` while off; assert `service.addEvent` and observers are not called |
| `CombatWitnessService.addEvent` | `src/combat/combatWitnessService.js` `addEvent` | Internal Combat computation after runtime admission | Combat rolling-state mutation for combat events | File read/parse; Passive notification if runtime still notifies; navigation/system events that do not add to Combat | Not an authority gate; keep internal computation pure | Avoid as primary test target; a test here would miss Passive and privacy failures |
| `notifyObservers(event)` | `src/combat/combatWitnessRuntime.js` `notifyObservers` | After Combat service update | Passive observer updates if notification is suppressed | File read/parse; Combat mutation already happened; runtime event was admitted | Too late and partial; avoid as authority boundary | If used, test must show Combat already changed, demonstrating why it is not sufficient |
| `passiveTelemetryService.observeEvent` | `src/passive/passiveTelemetryService.js` `observeEvent` | Passive lane observer after runtime notification | Passive current-system mutation and Passive provider refresh trigger | File read/parse; Combat mutation; runtime notification; other observers | Not primary; possible local safety check only if unknown event sources remain | Passive no-mutation test can help, but cannot be the ADR-0008 proof |

## Questions Answered

### 1. Which gate should be primary?

The primary gate should be the ingest boundary, not the internal computation boundary:

- `combat.witness.start` should refuse user/service attempts while I/O is off.
- `combatWitnessRuntime.start` should refuse backend lane starts while I/O is off.
- The runtime I/O policy transition from on to off should stop or pause any active watcher.
- The watcher should have a read-side authority guard before file bytes are read, with the strongest exact placement immediately before `readRange`.

This combination prevents both initial starts and active race reads.

### 2. Which gate should be defense-in-depth?

Good defense-in-depth gates are:

- `EveGamelogWatcher.start`, to stop source setup if a caller bypasses the service/runtime boundary.
- The watcher callback/poll path and `handleFile`, to prevent reads after I/O is turned off while callbacks are still possible.
- The exact pre-`readRange` guard, to preserve the no-read privacy promise.
- `combatWitnessRuntime.observeEvent`, to prevent direct/manual event injection from mutating Combat or Passive while I/O is off.

These gates protect the boundary and admission edges while keeping downstream computation simple.

### 3. Which gates are too late for privacy/trust because file bytes were already read?

Too-late gates include:

- Before `parseLine`, because the file range has already been read.
- Before `this.onEvent(event)`, because bytes were read and parser work already happened.
- `combatWitnessRuntime.observeEvent`, because read and parse already happened.
- `CombatWitnessService.addEvent`, because read, parse, and runtime admission already happened.
- `notifyObservers(event)`, because Combat may already have mutated.
- `passiveTelemetryService.observeEvent`, because the source ingest and Combat path already happened.

These can reduce secondary mutation, but they cannot satisfy ADR-0008's privacy/trust promise on their own.

### 4. Which gates would accidentally force internal computations to know about I/O?

The risky placements are:

- `CombatWitnessService.addEvent`
- `notifyObservers(event)`
- `passiveTelemetryService.observeEvent`
- Pure parser logic around `parseLine`, if it becomes policy-aware rather than source-input-aware

Using these as primary authority checks would scatter I/O policy through computations that should operate only over already-admitted events and existing state.

### 5. What is the cleanest Dev runway shape?

Recommended future Dev runway:

1. Introduce or reuse one runtime I/O authority state that Combat, Passive, Threat, and Clipboard can consult at boundaries.
2. Wire I/O-off transitions to stop or pause active ingest lanes, especially the gamelog watcher and Clipboard Acquisition listener.
3. Gate `combat.witness.start` and `combatWitnessRuntime.start` before watcher source setup.
4. Add watcher defense-in-depth gates at active callbacks/`handleFile` and immediately before `readRange`.
5. Add a runtime admission guard at `combatWitnessRuntime.observeEvent` for direct event injection safety.
6. Keep `CombatWitnessService`, Passive calculations, and parser interpretation pure over admitted events.
7. Preserve allowed support-only behavior: settings load/save, existing snapshot display, diagnostics, static metadata reads, and non-ingest UI rendering.
8. Add focused refusal-shape tests before broad smoke coverage: start blocked, active watcher toggle-off no-read, clipboard listener toggle-off no-read, provider queued-before-start blocked, snapshot view-only no ingest, startup recovery no autostart.

## Stop Conditions / Open Questions

- Product wording still needs a final distinction among I/O off, no observation, provider failed, unavailable, and blocked.
- Dev should decide whether narrow path validation while I/O is off is acceptable support-only behavior or should also be deferred until I/O is on.
- Provider requests already in flight when I/O is turned off need a policy decision: abort if possible, ignore response, or allow completion as an already-started operation while blocking any new request.
- Runtime admission gating must avoid breaking non-ingest test fixtures unless those fixtures intentionally model blocked live input.
- This artifact does not decide UI copy or open the Dev runway; it only maps target state and likely gate placement.
