# Critical Assets

Purpose: list Sense assets that should be preserved, reviewed carefully, or treated as important domain/source material.

Expanded asset list:
`F:\Projects\Docs\Aura-Project-Orchestration\critical\AURA-Sense\critical-assets.md`

Status:
Initial local index populated from the expanded coordination list. Treat this as project-local reference material for agents; promotion into durable project truth still requires Sense Overseer/Human acceptance.

## Critical Assets

| Asset | Type | Why It Matters | Handling Note |
| --- | --- | --- | --- |
| `workspace/current.md` | Active packet | Defines current Sense work and authority split. | Keep aligned before changing critical terms. |
| `workspace/overview.md` | Project overview | States Sense as recent operational observation, distinct from Atlas evidence storage. | Preserve "observes now" boundary. |
| `workspace/critical/critical-terms.md` | Critical terms | Holds local Sense term ownership and downstream translation cautions. | Read before lane, live-IO, provider, or Lab handoff work. |
| `docs/index.md` | Documentation index | Compact doctrine: renderer presents snapshots/events and does not own telemetry truth. | First documentation entry point. |
| `docs/current-state/current-implementation.md` | Current implementation | Lists lanes, bridge surfaces, live IO gates, settings, diagnostics, metadata, and gaps. | Recheck before synthesis or implementation. |
| `docs/contracts/renderer-boundary-contract.md` | Boundary contract | Backend owns ingestion, normalization, caching, computation, live API, and tactical facts. | Prevents presentation from owning truth. |
| `docs/contracts/telemetry-lane-contract.md` | Lane contract | Separates Combat Witness, Passive Telemetry, and Threat Intel. | Prevents ambiguous global threat object. |
| `docs/contracts/threat-intel-contract.md` | Threat Intel contract | Defines scan/snapshot shapes, statuses, live IO blocking, and Clipboard Acquisition. | Preserve bridge semantics exactly. |
| `docs/contracts/combat-witness-contract.md` | Combat Witness contract | Defines transient combat-log witness behavior and non-history constraints. | Prevent Atlas-style evidence/storage wording. |
| `docs/features/clipboard-acquisition.md` | Feature contract | Defines short-lived visible clipboard authority window. | Safety/trust-critical. |
| `src/main/preload.js` | Preload bridge | Exposes lane APIs and restricted service allowlist. | Bridge-facing names should not be casually changed. |
| `src/main/main.js` | Main process wiring | Registers lane services, runtime controls, live IO, shortcuts, and IPC. | Critical emitted command/channel vocabulary. |
| `src/combat/` | Combat Witness lane | Emits snapshots, observed metrics, rolling windows, watcher state, and local log parsing. | Meaning-critical for observed/recent/non-history language. |
| `src/passive/` | Passive Telemetry lane | Emits current-system context, freshness, provider sample, partial/degraded/blocked status. | Main Passive semantics source. |
| `src/passive/liveIoGate.js` | Live IO gate | Defines live-enabled/live-disabled and blocked responses. | Safety/authority-critical. |
| `src/threat/` | Threat Intel and Clipboard Acquisition | Emits scan snapshots, target resolution, provider sample/cap states, and clipboard lifecycle. | Main Threat Intel bridge meaning source. |
| `src/runtime/` | Runtime settings/diagnostics | Emits runtime health and sanitized diagnostics. | Keep setup/diagnostics separate from tactical state. |
| `src/renderer/index.html` and `src/renderer/app.js` | Renderer shell/presenter | Maps backend statuses to visible labels. | Evidence for current Bridge -> Interface copy. |
| `scripts/verify-renderer-boundary*.js` | Boundary verification | Ensures renderer/preload do not own parser/provider/computation logic. | Critical authority safety net. |
| `scripts/verify-threat-intel.js` and `scripts/verify-passive-telemetry.js` | Lane verification | Tests scan/sample/live-IO and Passive state semantics. | Critical term/payload safety net. |
| `package.json` | Verification manifest | Lists active verification entry points. | Use for current verification commands. |

## Do Not Casually Change

| Asset | Reason | Required Review |
| --- | --- | --- |
| Preload bridge names and IPC channels | These are the bridge-facing names Lab or other consumers receive. | Sense Overseer / Human |
| Snapshot kinds such as `combat.witness.snapshot`, `passive.telemetry.snapshot`, `threat.intel.snapshot`, and `clipboard.acquisition.snapshot` | Names encode source ownership and state shape. | Sense Overseer / Human |
| Telemetry lane separation contract | Prevents lanes from collapsing into an ambiguous threat score. | Sense Overseer / Human |
| Renderer boundary contract and verification scripts | Protects backend-owned truth from presentation-layer reinterpretation. | Sense Overseer / Human |
| Live IO gate behavior and labels | Safety/authority-sensitive. | Sense Overseer / Human |
| Clipboard Acquisition lifecycle and shortcuts | Visible, short-lived authority is central to current UX. | Sense Overseer / Human |
| Threat Intel scan request/status/sample shapes | Prevents scoped samples from becoming complete coverage. | Sense Overseer / Human |
| Combat Witness event and rolling-window metric shapes | Prevents observed local telemetry from becoming durable evidence/history. | Sense Overseer / Human |
| Passive Telemetry provider status and freshness fields | Keeps blocked/partial/stale/degraded/fresh distinct. | Sense Overseer / Human |
| Runtime diagnostics redaction behavior | Raw/content/line payloads are intentionally sanitized. | Sense Overseer / Human |

## Open Questions

- Which Sense labels should be preserve-exact for Lab?
- Should `Provider pulse` remain user-facing or become quieter provider-state language?
- Should Lab consistently use `Fresh` or `Recent context` for Passive Telemetry post-bridge presentation?
