# Aggressive Test Harness Matrix

Date: 2026-05-23
Status: Active

## Purpose

This matrix maps AURA-Sense invariants to verification commands so aggressive tests stay observable, deterministic, and correctly separated from live/manual smoke.

## Command Classes

| Command class | Command | Allowed dependencies | Must not depend on |
| --- | --- | --- | --- |
| Offline confidence | `npm.cmd run verify:all` | Node, deterministic fixtures, `.tmp` scratch output | live network, Electron, local EVE logs, large SDE assets, private operator state |
| Focused offline verify | `npm.cmd run verify:<area>` | Node, deterministic fixtures, `.tmp` scratch output | live network unless the command name explicitly says smoke/live |
| Electron smoke | `npm.cmd run smoke:electron` | Electron, smoke-mode fixture state, `.tmp` visual artifacts | live network, local EVE logs, private operator state |
| Live API smoke | `npm.cmd run smoke:passive-live-api` and future live-gated smoke | explicit operator opt-in, `AURA_SENSE_LIVE_API=1` for live calls | inclusion in `verify:all`, broad polling, persistence |
| Live operator smoke | documented manual playbooks | explicit operator action and recorded evidence | automated private-log collection, broad history ingestion |
| Manual bug hunt | audit/failure records | scoped exploratory steps and findings | hidden product claims, unrecorded accepted failures |

## Invariant Coverage

| Invariant | Primary command | Secondary command/evidence | Notes |
| --- | --- | --- | --- |
| Renderer remains presentation-only | `npm.cmd run verify:renderer-boundary` | `npm.cmd run verify:renderer-boundary-adversarial`, `npm.cmd run verify:renderer-shell` | Renderer must not fetch, parse logs, read filesystem, import main modules, compute tactical truth, or use unlisted service commands. |
| Parser truth boundary | `npm.cmd run verify:combat-parser` | `npm.cmd run verify:combat-parser-hostile`, `npm.cmd run verify:combat-coverage` | Accepted lines require exact fixtures; hostile and near-miss lines reject with hash-only evidence. |
| Combat weapon/spike semantics | `npm.cmd run verify:combat-window-followups` | `npm.cmd run verify:combat-replay`, `npm.cmd run verify:combat-golden` | Weapon labels remain exact observed labels; spike outliers remain bounded observations, not threat conclusions. |
| Watcher append-only behavior | `npm.cmd run verify:gamelog-watcher` | `npm.cmd run verify:gamelog-watcher-chaos` | Must not replay old files or leak raw private lines in diagnostics. |
| Live IO gate | `npm.cmd run verify:passive-telemetry`, `npm.cmd run verify:threat-intel` | live smoke only when explicitly enabled | Live calls must be blockable, lane-specific, and outside `verify:all`. |
| Provider failure visibility | `npm.cmd run verify:http` | future provider fault-injection command | Timeout, malformed, 429/500, stale cache, and ETag failures should remain observable without live network. |
| Clipboard lifecycle | `npm.cmd run verify:threat-intel`, `npm.cmd run verify:clipboard-race` | `npm.cmd run verify:services`, Electron smoke if UI changes | Capture is operator-armed, race-tested, and must not broaden collection. |
| Settings recovery | `npm.cmd run verify:runtime-control` | future runtime settings fault command | Corrupt or missing settings should degrade visibly and recoverably. |
| Diagnostics sanitization | `npm.cmd run verify:diagnostics` | future runtime diagnostics fault command | Diagnostics are evidence, not raw private payload storage. |
| Visual state | `npm.cmd run smoke:electron` | future visual state regression artifacts | Electron smoke stays separate from offline verification. |
| Local metadata/SDE builder | `npm.cmd run verify:local-type-metadata` | future SDE builder hardening command | Downloads remain explicit; large SDE assets do not enter `verify:all`. |

## `verify:all` Exclusions

The offline confidence command must never require:

- live zKill, ESI, or other network access
- Electron launch or screenshot capture
- local EVE installation, live gamelog files, or operator private logs
- full SDE archives or generated large metadata artifacts
- persistent Atlas-style storage
- manual operator interaction

## Current Aggressive Commands

| Command | Included in `verify:all` | Scope |
| --- | --- | --- |
| `npm.cmd run verify:combat-parser-hostile` | Yes | Hostile and near-miss combat parser rejection, hash-only rejection evidence, coverage matrix honesty. |
| `npm.cmd run verify:renderer-boundary-adversarial` | Yes | Renderer/preload hostile pattern checks, preload command allowlist, subscription cleanup verification. |
| `npm.cmd run verify:gamelog-watcher-chaos` | Yes | Append-only watcher chaos, polling fallback, truncation/replacement handling, listener/parser failure isolation, hash-only rejection evidence. |
| `npm.cmd run verify:clipboard-race` | Yes | Clipboard Acquisition rapid arm/cancel/capture, unchanged/rejected content, timeout, scan failure sealing, cooldown, and concurrent arm semantics. |
| `npm.cmd run verify:combat-window-followups` | Yes | Combat Witness repeated weapon labels, tie handling, missing weapon labels, outgoing spike ship labels, pruning, bounds, and spike cap semantics. |
