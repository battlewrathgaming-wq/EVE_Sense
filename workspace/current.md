# Current Workspace Packet

Status: Idle
Updated: 2026-05-27
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: None
Current executor: None
Current status: Idle after M12I acceptance
Expected output: None

Latest accepted slice: M12I - ADR-0008 I/O Authority Reconciliation
Latest Dev handoff: `workspace/DevHS56-m12i-io-authority-reconciliation.md`
Latest Overseer acceptance: `workspace/OverseerHS57-m12i-io-authority-reconciliation-acceptance.md`

Source records:

- `docs/adr/ADR-0008-io-off-means-no-ingest.md`
- `docs/current-state/current-implementation.md`
- `workspace/SecEngHS52-io-authority-reconciliation-audit.md`
- `workspace/EngTraceHS53-gamelog-event-spine-trace.md`
- `workspace/SecEngHS54-ingest-source-defensive-posture-audit.md`
- `workspace/EngMapHS55-io-authority-state-and-gate-placement.md`

## Resting State

M12 remains the active/gated envelope for live/manual validation and tactical calibration, but no executable work is open right now.

M12I accepted:

- Local gamelog/file ingest now aligns with ADR-0008 for the current runtime path: I/O off means Sense is not allowed to ingest.
- `combat.witness.start` / `combatWitnessRuntime.start` refuse local gamelog ingest while runtime I/O authority is off.
- Main-process Combat Witness ingest starts with I/O authority off by default.
- Turning runtime I/O authority off stops the active Combat Witness watcher and reports a blocked watcher state while preserving configured-path support state.
- Local gamelog ingest is guarded at watcher start, fs-watch callback, polling, `handleFile`, and immediately before `readRange`.
- Runtime event admission rejects parser/local events while ingest authority is off, preventing Combat Witness mutation and Passive observer notification from new parser events.
- Passive/Threat provider gates and M12H Clipboard Acquisition service-command gates remain preserved.
- Top-level I/O wording now treats I/O off as ingest blocked, not only network/clipboard blocked.
- Deterministic verification covers no-start/no-read/no-mutation behavior while I/O is off.
- No live/manual/private I/O was run.

Core rule:

```txt
I/O authority is enforced at ingest boundaries.
Internal computation remains pure over admitted events and existing state.
```

## Runway Shape

At idle, M12 can move next toward live/manual operator smoke, manual shortcut feel validation, Combat calibration, raw repair/healing fixture intake, or live findings review only by Human/Overseer decision.

Any future live/manual EVE folder use, real clipboard capture, provider calls, manual shortcut validation, display/adapter convergence, or product decision about Passive/Active gate behavior requires a future active packet.

## Context To Preserve

M12H accepted:

- `threat.clipboard.arm` and `threat.clipboard.capture` check Threat live I/O status before Clipboard Acquisition can read clipboard content.
- Blocked service-command paths return the existing I/O-off Clipboard Acquisition snapshot shape and do not call injected clipboard reads or Threat scans.
- The global `Control+\` I/O-off path reuses the same I/O-off snapshot shape.
- I/O-on behavior remains preserved: global shortcut immediate capture, focused/windowed baseline/listen behavior, seal/cooldown, and fingerprint-only duplicate suppression remain intact.
- Future operator I/O smoke has a redaction-safe artifact shape documented in `docs/testing/live-operator-gamelog-smoke-playbook.md`.

M12F/M12G preserved behavior:

- Passive Telemetry observes `navigation.jump` events from the parser event spine and does not depend on Clipboard Acquisition state.
- Threat Intel scans are invoked through Clipboard Acquisition/global shortcut flow, focused renderer keyboard flow, or service/preload calls.
- Passive and Threat live provider gates are separate backend gate instances.
- Parser jumps were not found to trigger Threat scans.
- Clipboard/search was not found to be a prerequisite for Passive current-system observation.
- Global shortcut immediate capture of existing clipboard content is intended when explicitly invoked and I/O authority is on.

M12E/M12C live API evidence:

- Passive-only live API smoke ran once under explicit Human authorization and wrote `.tmp\passive-live-api-smoke\result.json`.
- The first live Threat smoke remains the only authorized Threat live provider execution so far.
- No additional live provider calls are authorized by this resting state.

## Preserved Guardrails

- Do not set `AURA_SENSE_LIVE_API=1` without a future active packet and explicit Human authorization.
- Do not run additional live zKill or ESI calls without a future active packet.
- Do not use `AURA_SENSE_THREAT_LIVE_TARGET` unless a future packet explicitly names target text and resolved kind.
- Do not run live EVE log ingestion.
- Do not inspect private/operator EVE log folders.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not capture real clipboard content.
- Do not execute live/manual I/O smoke.
- Do not rename source-owned terms.
- Do not change bridge contracts, IPC payload meanings, persistence schemas, services, or backend behavior without an active packet.
- Do not combine live API smoke with operator gamelog smoke, Combat calibration, raw fixture intake, renderer, Lab, adapter, or display work unless a future packet explicitly opens that scope.
- Do not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims.
- Do not promote a bounded live smoke into broad tactical/product claims.

## Candidate Next M12 Slices

Open only by Human/Overseer decision:

1. Live/manual operator I/O smoke with redacted artifacts and explicit Human authorization.
2. Manual shortcut feel/OS accelerator validation, only if explicitly authorized.
3. Combat Witness calibration from accepted real samples.
4. Raw repair/healing fixture intake from accepted samples.
5. Live findings audit and current-state update after future live/manual evidence exists.

## Work Record

Accepted handoff:

```txt
workspace/DevHS56-m12i-io-authority-reconciliation.md
workspace/OverseerHS57-m12i-io-authority-reconciliation-acceptance.md
```

## Handoff Requirements

None while idle.
