# OverseerHS01: Sense Pre-Bridge Refresh

Status: Active Overseer handoff
Date: 2026-05-24
Role: AURA-Sense Overseer

## Purpose

Refresh HS01 after the logger-to-bridge audit and the human's clarification that Lab is working on transportable render/data mapping for a possible AURA[any project] bridge.

This handoff records an Overseer runway refresh only. It does not accept Dev work, run verification, create shared doctrine, or broaden AURA-Sense into Lab/Core work.

## Files Reviewed

- `AGENTS.md`
- `workspace/overview.md`
- `workspace/current.md`
- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`

## Coordination State

- Active milestone: Milestone 13 - Aggressive Testing And Bug Hunting
- Sequence: HS01
- Previous accepted handshake: None under the new workspace handshake sequence
- Current executor after refresh: Dev
- Expected Dev output after refresh: `DevHS01-sense-pre-bridge-hardening.md`

## Decision

Continue Milestone 13, narrowed.

HS01 should not pause for alignment. It should also not continue exactly as the prior broad provider/runtime packet. The refreshed packet now puts Sense-local logger-to-bridge hardening first, then allows provider/live IO and runtime settings/diagnostics fault work if the bridge/status slices complete cleanly.

## Reasoning

Milestone 13 remains the right milestone because the work is adversarial hardening, not product expansion.

The logger-to-bridge audit found risks that sit directly on the path Lab hopes to model neutrally later:

- watcher status-only changes can update backend runtime state without publishing a new bridged snapshot
- gamelog watcher offsets advance before range reads are proven successful
- Combat Witness bridge subscribe can create a backend service subscription before sender validation
- renderer combat presentation currently privileges freshness status and can understate degraded watcher state

These are Sense product hardening items. They should be fixed before anyone treats the path as reusable Aura bridge structure.

## Pre-Bridge Answers

Minimum neutral presentation state envelope between project snapshot and renderer, for Sense-local framing only:

```txt
{
  kind,
  lane,
  status,
  freshness,
  source,
  certainty,
  summary,
  diagnostics,
  actions,
  displayHints
}
```

This is not shared doctrine. It is a review checklist for HS01 only.

Current Sense fields that are domain facts:

- Combat Witness event kind, event time, direction, amount, observed source/target labels, observed weapon label, hit quality, raw-line hash, rolling window totals/per-second metrics, repair balance, event stream count, freshness timestamps/status, watcher state/path/strategy/message
- Passive Telemetry current system label/system ID, zKill sample/failure/cap/partial metadata, ESI activity counts/cache/ETag state, gate status, freshness/status/failure
- Threat Intel request, target resolution, status, live IO state, zKill provider/route/lookback/sample/cap/partial/failure metadata, clipboard acquisition lifecycle state

Current Sense fields that are display hints or renderer presentation choices:

- combat title/signal labels such as `Activity`, `Quiet`, `Recent`, `Stale`
- summary/detail copy
- provider pulse labels and dot intensity
- meter/gauge/bar widths and visual emphasis
- front context mode selection and local persistence
- drawer/diagnostics open state
- cooldown/listening glow classes
- compact labels such as `Sampled`, `Idle`, `Passive fresh`, or `Threat capped`

Bridge hardening items that must land before exporting any reusable Aura pattern:

- watcher status-only changes must produce an observable renderer update, not wait for the next combat event
- file tail offsets must advance only after the appended range is read successfully
- bridge subscribe must validate sender before creating a backend service subscription
- renderer combat presentation state must combine freshness and operational watcher state so degraded backend truth cannot be hidden behind a recent combat freshness label
- focused verification must prove the above without live network, Electron, local EVE logs, or private operator state

## Current Packet Update

`workspace/current.md` was refreshed with:

- updated date: 2026-05-24
- narrowed current focus: Sense-local logger-to-bridge hardening, then provider/runtime fault tests
- expected output: `DevHS01-sense-pre-bridge-hardening.md`
- explicit decision: continue Milestone 13, narrowed
- Sense-local pre-bridge framing answers
- ordered runway for logger-to-bridge propagation, watcher tail-read hardening, bridge lifecycle hardening, renderer presentation-state reconciliation, provider/live IO fault injection, runtime settings/diagnostics fault tests, documentation reconciliation, and next-runway recommendation
- guardrails preventing Lab/Core/shared doctrine work
- focused verification command candidates

## Dev Guardrails

Dev must not:

- create shared Aura doctrine
- add a Lab/Core adapter or neutral bridge package
- generalize Sense tactical meaning
- move tactical truth into the renderer
- run live APIs inside `verify:all`
- add Atlas persistence
- broaden collection
- persist private logs

## Verification

Not run in this Overseer refresh. This pass changed coordination/runway only.

Required after Dev execution remains:

```powershell
npm.cmd run verify:all
```

Likely focused commands:

```powershell
npm.cmd run verify:gamelog-watcher-chaos
npm.cmd run verify:combat-runtime
npm.cmd run verify:combat-bridge
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary-adversarial
```

## Recommended Next Action

Send Dev the dot signal in a Dev chat/session for AURA-Sense.

Dev should execute only `workspace/current.md`, produce `DevHS01-sense-pre-bridge-hardening.md`, update Evidence / Dev Handoff in `workspace/current.md`, and run required verification.
