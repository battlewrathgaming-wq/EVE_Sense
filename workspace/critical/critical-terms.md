# Critical Terms

Purpose: list Sense-owned terms, emitted meanings, preserve-exact terms, and downstream translation cautions.

Accepted policy:
`F:\Projects\Docs\Aura-Project-Orchestration\terminology\TerminologyAuthorityRuleset-2026-05-24.md`

Expanded lists:

- Sense expanded coordination list: `F:\Projects\Docs\Aura-Project-Orchestration\critical\AURA-Sense\critical-terms.md`
- Cross-project synthesis: `F:\Projects\Docs\Aura-Project-Orchestration\terminology\terminology-critical-cross-project-synthesis-2026-05-24.md`
- Frequency synthesis: `F:\Projects\Docs\Aura-Project-Orchestration\terminology\terminology-frequency-synthesis-2026-05-24.md`

Lab may use its own product-agnostic presentation vocabulary after the bridge, but Sense owns Sense terms, emitted meanings, lane semantics, live-IO states, and Project -> Bridge language.

## Awaiting Authority Review

Atlas and Lab are expected to produce a first-pass durable terminology review before Sense updates shared-facing terminology classifications again.

Until that arrives, treat this file as Sense-local authority for current meanings and as a warning surface for likely collisions. Do not promote shared spelling into shared doctrine, do not rename contracts from sniffer output, and do not treat Lab presentation language as authority over Sense internal or Project -> Bridge meaning.

## Preserve Exactly

| Term | Meaning | Why Preserve | Downstream Note |
| --- | --- | --- | --- |
| `Combat Witness` | Rolling recent combat-log observations and computed tactical summaries. | Not Atlas evidence, not complete history, and not perfect truth. | Lab may present compactly, but should preserve witnessed/recent/observed intent. |
| `Passive Telemetry` | Low-frequency current-system context lane. | Must not imply background Threat Intel scanning or complete system awareness. | Keep lane isolation visible. |
| `Threat Intel` | Deliberate scoped operator-initiated inspection. | Must not imply continuous monitoring, complete intelligence, or durable Atlas assessment. | Keep sample/cap/failure/freshness visible. |
| `Clipboard Acquisition` | I/O-gated clipboard authority workflow. `Control+\` is the explicit permission action; focused/windowed mode uses a short visible listening window. | Safety/trust-critical; not background or continuous clipboard monitoring. | Preserve I/O-off no-read behavior, immediate valid-target capture, short window/seal/cooldown, and no hidden clipboard history. |
| `Gateway` | Sense back-page Threat Intel context marker and interaction model. | Sense-owned UI/context term. | Preserve unless Human/Sense Overseer allows Lab override. |
| `Live IO blocked` | Backend gate intentionally prevented live provider or clipboard IO. | Different from provider failure, unavailable bridge, or no data. | Do not soften to offline without preserving authority meaning. |
| `Partial sample` / `Capped sample` | Provider response was incomplete or display/sample capped. | Prevents samples from being read as complete truth. | Must remain visible near provider/sample displays. |
| `No scan` | No deliberate Threat Intel scan has run. | Different from no provider data, no observation, or provider failure. | Preserve deliberate-scan requirement. |
| `Observed Source` | Actor/source label observed in local combat events. | Avoids unsupported hostile/enemy/primary labels. | Good Lab-facing label. |
| `Observed Weapon` / `Most observed weapon` | Weapon label/count observed in combat events. | Avoids unsupported weapon/type certainty. | Prefer observed wording unless source supports more. |
| `Observed repair balance` | Computed repair-per-second minus incoming-damage-per-second from observed window data. | Avoids safety/survival/prediction claims. | Do not call safe, stable, breaking, or surviving. |

## Sense-Owned Terms

| Term | Meaning | Notes |
| --- | --- | --- |
| `combat.witness.snapshot` | Backend-owned Combat Witness snapshot. | Lane payload with observedAt, rolling windows, events, freshness, and watcher state. |
| `passive.telemetry.snapshot` | Backend-owned Passive Telemetry snapshot. | Current-system, activity, zKill, freshness, gate, provider status, and failure metadata. |
| `threat.intel.snapshot` | Backend-owned latest Threat Intel scan snapshot. | Request, target, status, live IO, zKill sample, failure, and freshness. |
| `clipboard.acquisition.snapshot` | Clipboard Acquisition lifecycle snapshot. | Idle/listening/cooldown/blocked states tied to the I/O-gated permission action and short authority window. |
| `runtime.live-io.snapshot` | Backend live IO policy state. | Live IO is authority state, not provider health. |
| `auraCombatWitness` / `auraPassiveTelemetry` / `auraThreatIntel` | Preload bridge APIs for Sense lanes. | Bridge-facing JavaScript APIs. |
| `fresh` / `recent` / `stale` | Lane-specific freshness states. | Not a shared freshness enum. |
| `empty` / `No scan` | No deliberate Threat Intel scan or no observed events depending on lane. | Do not collapse with failed/degraded/blocked. |
| `failed` / `degraded` | Provider/runtime impairment. | Different from authority block and no data. |
| `Pulling` / `Listening` / `Cooldown` | Clipboard Acquisition lifecycle states. | Short visible authority lifecycle. `Pulling` may be immediate permission-action capture; `Listening` is only the bounded window. |
| `Provider pulse` | Provider/sample status language. | Can imply continuous provider heartbeat; needs presentation care. |
| `seed.readiness` | Inherited/runtime readiness service command. | Active bridge term, not product doctrine. |
| `Control+\\`, `Alt+\\`, `\\` | Shortcut model. | `Control+\` is the explicit Clipboard Acquisition permission action; `Alt+\` cycles target kind; fallback behavior, docs, UI, and runtime must match. |
| `Active` / `Active I/O` | In M12 operator I/O context, an operator permission action such as `Control+\` or an explicit service/request scan. | Does not mean background clipboard monitoring. |

## Translation Caution

| Sense Term | Possible Interface Term | Risk | Decision |
| --- | --- | --- | --- |
| `Evidence`-like Sense basis language | observed telemetry / provider sample / local log observation | Collides with Atlas durable Evidence. | Avoid shared Evidence unless Human decides. |
| `Report` / persistent Threat Intel report | latest scan report / scan readout | Persistent can imply durable history. | Keep "until next scan" or latest-scan basis visible. |
| `Fresh` / `Recent` / `Current` | fresh context / recent context / current system | Lane-specific freshness can sound like global truth. | Preserve lane/source context. |
| `Fallback` | manual fallback / local only / static lookup | Can sound like alternate truth source. | Use explicit authority/source labels. |
| `No data` | No scan / No provider / No observation | One phrase hides distinct states. | Use lane-specific absence language. |
| `Watch` / `Watcher` | Log Watcher / Watching | Collides with Atlas Watch and clipboard authority. | Reserve watcher for gamelog watcher unless Sense accepts otherwise. |
| `Listening` | Pulling / Listening | Can imply ongoing clipboard monitoring. | Only for the short visible acquisition state. The global permission action may capture current valid clipboard content immediately without becoming background monitoring. |
| `Gateway` vs `gate` | Gateway / Live IO gate | UI context marker vs backend authority gate. | Keep distinct. |
| `Provider pulse` | provider state / sample state | Pulse may imply continuous provider heartbeat. | Needs Lab/Human presentation choice. |
| `Sample` | scoped sample | Can imply representative/complete coverage. | Keep count/cap/partial nearby. |
| `Runtime ready` | runtime ready | Can sound like tactical readiness. | Keep in diagnostics/setup context. |
| `Seed` / `Core Seed` | inherited/internal readiness | Can become accidental Core doctrine. | Keep out of product/interface terminology unless promoted. |

## Passive Adapter Provisional Terms

Status: local blueprint for future Passive adapter work; not universal Aura doctrine.

Source artifacts:

- `workspace/EngSpecHS60-passive-telemetry-adapter-envelope.md`
- `workspace/TermAuditHS61-passive-adapter-wording-collision-review.md`

| Term / Pattern | Provisional Meaning | Decision |
| --- | --- | --- |
| `adapterPreview` | Sense-owned provisional adapter output/copy bundle derived from preserved Passive source slots. | Preferred replacement for `displaySafe`; still adapter-side and provisional, not bridge truth or Lab authority. |
| `displaySafe` | Older candidate name for adapter output intended to be display-ready. | Avoid for future Passive adapter work because it sounds final, approved, or presentation-owned. |
| `basis + freshness + warnings + gaps` | Preferred Passive trust/limit model. | Use instead of a `certainty` slot for Passive Telemetry. |
| `certainty` | Confidence/proof-style slot. | Do not add for Passive Telemetry unless a later Human/Overseer decision explicitly accepts it. |
| `I/O off - ingest blocked` | Preferred future user-facing authority wording for ADR-0008 state. | Candidate wording; preserve the meaning that Sense is not allowed to ingest while I/O is off. |
| `I/O Isolated` | Compact possible label for authority-off state. | Human/Overseer decision pending; do not make durable copy without review. |
| `Live Feed` / `Live Feed Isolated` | Candidate wording from discussion. | Avoid for Passive because it can imply continuous feed/background monitoring. |
| Lab `NO DATA` / `UNAVAILABLE` | Lab display example labels. | Do not map over Sense `blocked`, `no observation`, `unavailable`, or `degraded` without preserving Sense-owned reason. |
| `state`, `availability`, `coverage` | Useful adapter/display concepts. | Safe only with lane/source qualification; do not turn into shared state enums or Sense bridge contracts. |

## Open Questions

- Should `Gateway`, `Pulling`, `Cooldown`, and `Live IO blocked` be preserve-exact in Lab presentation?
- Should `Combat Witness`, `Passive Telemetry`, `Threat Intel`, and `Clipboard Acquisition` be preserve-exact names or Lab-translatable labels?
- Should Sense reserve `Threat Intel` while Atlas avoids broader `Intelligence` as a shared work-product term?
- Should `Provider pulse` remain user-facing, or should Lab choose calmer sample/state language?
- Should inherited `seed.readiness` / Core Seed language stay out of product-facing copy?
