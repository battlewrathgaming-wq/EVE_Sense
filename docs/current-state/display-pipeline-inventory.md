# Display Pipeline Inventory

Status: Current-state durable reference
Date: 2026-05-25
Owner: AURA-Sense Overseer

## Purpose

This document records how AURA-Sense information reaches the current user display.

It preserves Sense-owned pipeline intent:

```txt
Ingest -> Transformation -> Bridge -> User Display
```

This is a durable current-state reference, not a Dev runway, Lab request, UI redesign, terminology rename, bridge contract, schema change, or implementation approval.

## Authority Boundary

Sense owns:

- internal -> Bridge meaning
- source terms
- data meaning
- lane and state semantics
- runtime behavior
- final adoption

Lab may later compare Bridge -> Interface display methods through scoped `request_display` entries, but Lab must preserve Sense meaning and does not own Sense backend behavior, contracts, payloads, or adoption.

## Source Records

This durable record is distilled from:

- `workspace/display_inventory.md`
- `workspace/DisplayInventoryAuditHS01-ingest-transform-bridge-display.md`
- `workspace/DisplayInventoryQualitativeReportHS01-ingest-transform-bridge-display.md`
- `workspace/OverseerHS12-display-inventory-pipeline-audit-review.md`
- `docs/current-state/current-implementation.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/contracts/threat-intel-contract.md`

Archived or advisory audit material informed risk awareness only. It is not an active task queue.

## Pipeline Intent Table

| Lane / Surface | Ingest | Transformation | Bridge | Current User Display | Intent To Preserve | Required Basis / Uncertainty | Must Not Imply |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Combat Witness first-read face | Newly appended EVE gamelog combat lines accepted by the watcher/parser. | Parser normalizes combat damage, repair, and miss events; Combat Witness computes rolling incoming DPS, repair HPS, and observed repair balance. | `combat.witness.snapshot` through `auraCombatWitness` preload APIs and snapshot event. | Main Combat Witness face with `Incoming DPS`, `Repair HPS`, `Observed balance`, and 15s observed window. | Recent local observation and computed short-window tactical summary. | Observed-only source, weapon, timing, and rolling window should remain clear. | Complete fight history, survival truth, safety verdict, durable proof, or hostile identity certainty. |
| Observed Source / Weapon context | Combat log source and weapon labels from accepted combat events. | Rolling window counts labels and selects top observed labels. | Combat snapshot window fields into renderer context tile and diagnostics. | `Observed Source`, `Observed Weapon`, configurable context tile, diagnostics fields. | Labels are observed local-log labels, not durable actor identity or normalized item truth. | Keep `Observed` language or equivalent source qualifier. | Enemy classification, durable tracking, complete target identity, or normalized EVE item type. |
| Combat event stream | Bounded recent combat events. | Renderer compacts event kind, direction, amount, source/target, and weapon detail. | Combat snapshot `eventStream`. | Diagnostics event list. | Trust-supporting detail for recent observations. | Keep bounded/recent nature and avoid raw private log content. | Historical archive or primary tactical queue. |
| Passive current system | Local gamelog navigation/current-system observation. | Passive service stores current system label, event timing, and local/static resolver result. | `passive.telemetry.snapshot` through `auraPassiveTelemetry`. | Passive band `Current system`, system label, or `No observation`. | Current-system context derived from local observation. | Current-system basis and absence state should remain visible. | Complete location truth, continuous system awareness, or background Threat Intel. |
| Passive activity chips | Resolved current system plus gated ESI aggregate activity. | Activity client normalizes ship kills and jumps, handles cache/freshness, and surfaces partial state. | Passive snapshot `activity` fields. | `Kills`, `Jumps`, `Ratio`, diagnostics activity field. | Compact current-system support context. | Source, age/cache, partial, stale, and blocked states must be available. | Complete tactical risk score or full system intelligence. |
| Passive state and basis | Passive status, zKill scoped system context, ESI activity, local/static lookup, live-IO gate, freshness, cap, and partial flags. | Renderer maps backend-owned fields to Sense-owned states such as `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, and `No observation`. | Passive snapshot status/freshness/provider/gate fields. | Passive band state chip, basis line, provider chip, diagnostics. | Sense-owned Passive state model and source/sample honesty. | Source, freshness, cap, partial, stale, blocked, degraded, unavailable, and no-observation states must remain distinct. | Generic absence/current/aged/alternate-source semantics that collapse known state. |
| Threat back-page entry | Latest Threat Intel snapshot and drawer/gateway state. | Renderer keeps Threat Intel detail behind a deliberate back-page surface. | `threat.intel.snapshot` through `auraThreatIntel`; renderer drawer state. | Collapsed `Threat Intel` drawer with Gateway marker and back-page signal. | Threat Intel remains deliberate scoped inspection. | Operator initiation and current scan state should remain traceable. | Background monitoring or continuous intelligence. |
| Manual Threat Intel target | Operator-entered text and target kind. | Threat service builds a scan request with target text, target kind, input source, lookback, and sample limit. | `threat.intel.scan` preload call and resulting Threat snapshot. | Threat acquisition/search surface and target display. | Deliberate operator-selected target inspection, including keyboard/service paths. | Target kind, resolver state, sample basis, and no-scan/failure/blocked states. | Automatic target finding, broad search, complete intelligence, mouse/search-button requirement, or hidden provider action. |
| Clipboard-acquired target | Clipboard content read only when I/O authority is on and the operator invokes `Control+\`, or during the short focused/windowed authority window. | Clipboard Acquisition may capture a current valid target immediately from the global permission action; focused/windowed arming ignores unchanged pre-arm content, captures changed valid target text, suppresses recent duplicate fingerprints, seals, enters cooldown, and hands target to Threat Intel scan path. | `clipboard.acquisition.snapshot`, clipboard commands, and Threat scan request. | Clipboard widget, key chips, acquisition messages, populated Threat target. | I/O-gated permission action and short visible authority window feeding the same Threat Intel boundary. | Pulling/listening/cooldown/blocked state, I/O-off no-read behavior, duplicate suppression, and shortcut status must stay visible enough for trust. | Background clipboard monitoring, raw clipboard history, or persistent listener mode. |
| Threat target resolution | Manual or clipboard target plus selected target kind. | Local/static resolver returns resolved, ambiguous, unresolved, or unsupported state without guessing. | Threat snapshot `target`, `request`, and status fields. | Target type selector, target label, status/message, latest scan review. | Local/static resolver basis and no-guess boundary. | Ambiguous/unresolved/unsupported states and target kind must be visible where decisions depend on them. | Provider truth, fresh live data, or guessed identity. |
| Threat provider sample | Resolved target passed to gated scoped zKill route. | zKill client normalizes discovered/selected refs, cap, partial, failure, lookback, and sample limit. | Threat snapshot `zkill` and status fields. | Basis, sample, provider state, zKill pulse, latest scan review. | Scoped sample, not complete provider view. | Provider, lookback, selected/discovered count, cap, partial, failure, blocked, and freshness should be visible near sample claims. | Complete provider view, durable intelligence, or historical workstation semantics. |
| Runtime live IO authority | Operator toggle and main-process live IO policy. | Runtime control applies live IO enabled/disabled policy to Passive and Threat gates. | `runtime.live-io.snapshot` and `runtime.live-io.set-enabled` service commands. | Top `IO` button and diagnostics live IO field. | Backend-owned authority over live provider/clipboard-enabled actions. | Enabled/disabled, blocked, and lane impact must remain explainable. | Provider failure, no scan, unavailable status, or tactical safety. |
| Runtime settings / diagnostics | Settings file, gamelog folder picker, watcher status, and sanitized diagnostics records. | Runtime services validate settings, redact diagnostics, cap records, and expose health state. | `runtime.settings.snapshot`, `runtime.diagnostics.snapshot`, Combat watcher status command. | Diagnostics panel, Log Setup, watcher state, settings state, diagnostics count. | Trust/support surface, not tactical truth. | Settings health, watcher state, and sanitized diagnostics should remain reviewable. | Tactical readiness, complete operational health, or raw private log exposure. |

## Display Intent Requirements

Future display work should preserve these requirements:

- Lane names and lane separation remain Sense-owned.
- Renderer presents backend-owned snapshots; it must not own parser truth, provider calls, telemetry caches, or tactical computation.
- Combat Witness must stay recent/observed and must not become complete history.
- Passive Telemetry must stay current-system context and must not become background Threat Intel.
- Threat Intel must stay deliberate scoped inspection and must not imply complete intelligence.
- Clipboard Acquisition must stay an I/O-gated permission action plus short visible authority window, not a hidden listener or clipboard history.
- Live IO blocked, provider failure, unavailable source, no scan, no observation, stale, partial, capped, and degraded must remain distinct.
- Provider/sample claims need source, freshness, cap, partial, and blocked context near the point of decision or in an obvious reveal.

## Request-Capture Implications

The accepted audit identifies the safest later `request_display` candidates:

| Candidate | Display Problem | Request Strength Likely Needed | Source Terms To Preserve | Not Authorized |
| --- | --- | --- | --- | --- |
| `sense.threat-latest-scan-review` | Present latest Threat Intel scan review without storage/history flavor. | comparative | Threat Intel, No scan, Scoped sample, Partial sample, Capped sample, Live IO blocked | Historical proof, durable storage, broad intelligence, backend/schema changes. |
| `sense.clipboard-window` | Preserve I/O-gated permission action, short visible authority window, duplicate suppression, and shortcut feedback. | pressure-test | Clipboard Acquisition, Control+\, Pulling, Listening, Cooldown | Background clipboard monitoring, raw clipboard history, persistent listener semantics, shortcut behavior changes. |
| `sense.provider-pulse-row` | Compare calmer source/sample state display against current pulse wording. | formative or comparative | Provider/sample basis, Passive Telemetry, Threat Intel, Partial sample, Capped sample | Continuous heartbeat, complete provider view, provider truth claims. |
| `sense.passive.state-basis` | Reduce first-read density while preserving Passive state, freshness, source, cap, partial, blocked, and degraded meaning. | pressure-test | Passive Telemetry, Fresh context, Stale context, Partial sample, Capped sample, Live IO blocked, No observation | Generic absence/unavailable/current wording that hides known state. |
| `sense.threat-acquisition-bar` | Clarify manual and clipboard target acquisition without creating background-scan implication. | comparative | Threat Intel, target type, manual target, clipboard-acquired target, No scan | Automatic target finding, hidden provider calls, target guessing. |

These are candidates only. No Lab request is active from this document.

## Open Questions

- Whether `Gateway` remains preserve-exact in all Lab-facing presentation.
- Whether `Pulling`, `Listening`, and `Cooldown` remain exact Clipboard Acquisition copy after the bridge.
- Whether provider pulse wording should remain visible or become calmer source/sample wording.
- Whether the Threat latest scan review should be renamed in UI later to reduce storage/history implication.
- Whether Passive needs a dedicated detail reveal beyond diagnostics.

## Verification

Source record creation should run:

```powershell
npm.cmd run verify:protected-terms
```

The check is warning-only review input. It must not trigger source-term renames or protected-word JSON updates.
