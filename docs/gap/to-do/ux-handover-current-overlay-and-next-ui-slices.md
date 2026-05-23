# UX Handover: Current Overlay And Next UI Slices

Status: Open
Priority: P1
Milestone: UX Coordination / Milestone 12-13 Follow-Through

## Purpose

This handover gives the next UX/UI Dev session a clear starting point after the compact overlay interaction pass.

It is a coordination packet, not an authorization to redesign adjacent systems casually.

## Current UX Baseline

AURA-Sense currently presents a compact tactical overlay with:

- frameless Electron shell
- top-level IO authority control
- diagnostics takeover panel
- compact system glance strip
- Combat Witness pressure display
- configurable front context tile
- collapsed Threat Intel drawer
- Clipboard Acquisition keyboard affordance
- native gamelog folder picker flow through the main process
- renderer/preload boundary and adversarial verification
- Electron visual smoke for the current default overlay state

Current verification signals from the latest resolved tree:

```powershell
npm.cmd run verify:all
npm.cmd run smoke:electron
```

## UX Guardrails

- Renderer presents backend-owned snapshots; it does not compute tactical truth.
- Renderer must not parse logs, call zKill/ESI, read filesystem, or own provider logic.
- UI copy must use observed-language and avoid certainty it does not own.
- Combat Witness is recent observation, not durable evidence or survival prediction.
- Threat Intel is scoped provider context, not complete intelligence.
- Passive Telemetry, Threat Intel, and Combat Witness remain separate lanes.
- Live/API smoke and Electron smoke stay outside `verify:all`.
- No broad collection, no private log persistence, no Atlas-style evidence storage.

## Immediate UX Risks

- The compact overlay is visually denser than the earlier integrated viewport and needs regression coverage across alternate states.
- Some diagnostics labels remain backend-ish and should be audited before another presentation polish pass.
- Clipboard shortcut status can fall back when `Ctrl+\` is unavailable; UX should present fallback state clearly without implying failure.
- The native folder picker exists in runtime code and the older packet has been reconciled to complete.
- Provider state is still split across compact labels, diagnostics, and lane messages; `provider-request-pulse-ui.md` remains open.
- Combat metrics now have a completed plain-English baseline. Runtime field renames and UI copy changes remain future work requiring review.

## Recommended UX Sequence

1. Continue from `electron-visual-state-regression-tests.md`.

   Cover unavailable, stale, degraded, blocked, partial, capped, cooldown, diagnostics open, settings recovered/degraded, and narrow viewport states. Keep this outside `verify:all`.

2. Implement or refine `provider-request-pulse-ui.md`.

   Feed from backend-owned diagnostics or snapshot metadata only. Show blocked, pending, cached, succeeded, failed, capped, partial, and stale without showing raw provider payloads.

3. Continue `clipboard-acquisition-race-tests.md` before further shortcut UX polish.

   Prove rapid arm/cancel/capture, unchanged clipboard, scan failure, cooldown, and shortcut/UI concurrency.

4. Defer replay UI until `combat-witness-replay-system-channel.md` is implemented.

   Replay is a backend/system channel first. Do not add controls, scrubbers, drawers, or replay pills until live/replay snapshot separation is verified.

## UX-Specific To-Do Inventory

Active UI or UX-adjacent packets:

- `docs/gap/to-do/electron-visual-state-regression-tests.md`
- `docs/gap/to-do/provider-request-pulse-ui.md`
- `docs/gap/to-do/clipboard-acquisition-race-tests.md`
- `docs/gap/to-do/combat-window-weapon-spike-followups.md`
- `docs/gap/to-do/combat-witness-replay-system-channel.md`

Security/hardening packets that should inform UX but not become UI work by themselves:

- `docs/gap/to-do/live-io-provider-fault-injection.md`
- `docs/gap/to-do/http-endpoint-client-hardening.md`
- `docs/gap/to-do/runtime-settings-diagnostics-fault-tests.md`
- `docs/gap/to-do/local-metadata-sde-builder-hardening.md`

## Completion Signal

- UX Dev can identify the next UI slice without rereading all audits.
- Existing UI guardrails are preserved.
- UI work is sequenced behind the relevant audit/hardening packets.
- Any future UI packet references this handover or explicitly supersedes it.

## Related Documents

- `docs/current-state/current-implementation.md`
- `docs/current-state/combat-metrics.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/gap/complete/renderer-preload-boundary-adversarial-tests.md`
- `docs/gap/complete/gamelog-watcher-chaos-tests.md`
- `docs/gap/complete/combat-metrics-presentation-audit.md`
- `docs/gap/complete/native-gamelog-folder-picker.md`
- `docs/gap/to-do/electron-visual-state-regression-tests.md`
- `docs/gap/to-do/provider-request-pulse-ui.md`
