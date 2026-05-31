# EngSpecHS60 - Passive Telemetry Adapter Envelope

Date: 2026-05-31
Role: Sense Engineering / Systems auditor
Status: Read-only spec complete

## Request Answered

Define the minimum provisional Passive Telemetry adapter envelope needed for a future Sense-owned adapter.

This artifact stops at:

```txt
Sense Passive Telemetry bridge output
-> Sense-owned adapter envelope
STOP
```

It does not implement code, design a renderer face, modify Lab files, run live/manual I/O, rename Sense contracts, or turn Lab slim/lab-term output into Sense bridge authority.

## Files Reviewed

Required authority and packet sources:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/EngAuditHS58-backend-to-adapter-readiness-conformance.md`
- `workspace/OverseerHS59-backend-to-adapter-readiness-audit-acceptance.md`
- `docs/current-state/current-implementation.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/roadmap/milestone-16-body-to-adapter-readiness.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/adr/ADR-0003-target-owned-presentation-adapters.md`
- `docs/adr/ADR-0008-io-off-means-no-ingest.md`
- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/liveIoGate.js`
- `src/passive/zKillSystemContextClient.js`
- `src/passive/esiSystemActivityClient.js`
- `src/main/preload.js`
- `src/renderer/app.js`
- `package.json`

Additional local source used to complete the trace:

- `src/main/main.js`
- `src/passive/localSystemResolver.js`
- `scripts/verify-passive-telemetry.js`

## Repo-Verified Trace

| Stage | File / Module | Verified Passive Telemetry Role |
| --- | --- | --- |
| Source observation | `src/main/main.js`, `src/combat/*` via runtime observer path | Admitted parser events are delivered to `passiveTelemetryService.observeEvent(event)` through the Combat runtime observer list. Passive only reacts to `navigation.jump` with `event.systemName`. |
| Passive transformation | `src/passive/passiveTelemetryService.js` | Stores `currentSystem`, resolves system ID, checks live I/O gate before provider refresh, fetches ESI activity and zKill context, computes `fresh`, `partial`, `stale`, `blocked`, `degraded`, or `unavailable`. |
| Local/static basis | `src/passive/localSystemResolver.js` | Resolves exact system names from local/static metadata and emits `systemId`, `resolved`, `source: local-static`, or `reason: SYSTEM_NOT_FOUND`. |
| Provider basis | `src/passive/esiSystemActivityClient.js` | Normalizes ESI aggregate ship kills, pod kills, NPC kills, jumps, partial failures, ETag/cache state, and cache age. |
| Provider basis | `src/passive/zKillSystemContextClient.js` | Normalizes scoped zKill system context refs into `sampleCount`, `capped`, `partial`, `failureCount`, `pastSeconds`, and fetch time. |
| Authority state | `src/passive/liveIoGate.js` and `src/main/main.js` | Passive provider calls are blocked when the Passive live I/O gate is disabled. Runtime live I/O control also gates local ingest, Passive, and Threat together for `lane: all`. |
| State owner | `src/passive/passiveTelemetryService.js` | Owns snapshot creation, subscriber fan-out, refresh behavior, provider state, freshness, failures, and messages. |
| Bridge output | `src/passive/passiveTelemetryBridge.js` | Exposes IPC channels `aura:passive-telemetry:get-snapshot`, `subscribe`, `unsubscribe`, and `snapshot`. |
| Preload output | `src/main/preload.js` | Exposes `window.auraPassiveTelemetry.getSnapshot()` and `subscribeSnapshots(callback)`. |
| Current renderer consumption | `src/renderer/app.js` | Reads bridge snapshots, formats state/basis/gap/age/provider pulse, and displays current Passive band and diagnostics. This is a current display example, not adapter contract authority. |
| Existing deterministic assertions | `scripts/verify-passive-telemetry.js` | Covers resolver exactness, scoped zKill route, ESI activity/cache, fresh/stale/partial/degraded/blocked states, and no provider calls while Passive live I/O is disabled. |

## Current Bridge-Facing Fields

| Field | Class | Direct Adapter Use | Notes |
| --- | --- | --- | --- |
| `kind: passive.telemetry.snapshot` | Domain/source identity | Direct | Preserve as Passive lane identity. Do not translate from Lab or Atlas vocabulary. |
| `observedAt` | Snapshot freshness/display timing | Direct with lane context | Snapshot render/production time, not provider fetch time or source event time. |
| `currentSystem.label` | Domain fact from admitted local observation | Direct | Observed current-system label. Must not imply complete location truth or background monitoring. |
| `currentSystem.fromSystemName` | Domain/source detail | Detail-safe | Useful for a detail reveal; not needed for the minimum first-read envelope. |
| `currentSystem.eventTime` | Source event time | Direct/detail | Distinguish from `observedAt` and provider `fetchedAt`. |
| `currentSystem.observedAt` | Source observation time | Direct | Best source observation timestamp for current-system basis. |
| `currentSystem.systemId` | Resolved domain identifier | Direct with resolver basis | Adapter may carry as machine/display input. Must keep resolver source nearby. |
| `currentSystem.resolved` | State/basis marker | Direct | Separates observed label from resolved provider-ready system. |
| `currentSystem.resolverSource` | Source/basis slot | Direct | Current value includes `local-static`; keep out of broad truth claims. |
| `zkill.systemId` | Provider sample basis | Detail-safe | Same resolved system ID used for zKill context. |
| `zkill.fetchedAt` | Provider freshness | Direct | Provider sample fetch time. |
| `zkill.pastSeconds` | Provider sample scope | Direct | Required to avoid complete-context claims. |
| `zkill.sampleCount` | Provider sample | Direct | Scoped sample count only. |
| `zkill.capped` | Warning/gap slot | Direct | Must remain visible when true. |
| `zkill.partial` | Warning/gap slot | Direct | Must remain visible when true. |
| `zkill.failureCount` | Diagnostic/uncertainty | Detail-safe | Good for detail/diagnostics; first-read envelope can summarize as warnings. |
| Provider `refs` from normalizer | Internal/detail provider artifact | Do not map by default | Not exposed on Passive snapshot today. If exposed later, keep diagnostic/detail-only. |
| `activity.systemId` | Provider sample basis | Detail-safe | Same resolved system ID used for ESI activity. |
| `activity.fetchedAt` | Provider freshness | Direct | Provider activity fetch time. |
| `activity.shipKills` | Provider sample | Direct with scope | Aggregate ESI system activity, not a tactical risk score. |
| `activity.podKills` | Provider sample | Direct/detail | Safe but not required for the minimum compact envelope. |
| `activity.npcKills` | Provider sample | Direct/detail | Safe but not required for minimum compact envelope. |
| `activity.jumps` | Provider sample | Direct with scope | Aggregate ESI system activity, not full movement truth. |
| `activity.partial` | Warning/gap slot | Direct | Must remain visible when true. |
| `activity.failureCount` | Diagnostic/uncertainty | Detail-safe | Good for diagnostics; first-read envelope can summarize. |
| `activity.cache.cacheMs` | Source/freshness policy | Detail-safe | Useful for explaining cache window. |
| `activity.cache.cacheAgeMs` | Freshness/source basis | Direct/detail | Current renderer derives age primarily from `freshness.cacheAgeMs`; activity cache age still useful for detail. |
| `activity.cache.state` | Freshness/source basis | Direct/detail | Current states include refreshed/fresh/revalidated; adapter can carry as provider cache detail. |
| `activity.cache.etag` | Diagnostic/internal provider detail | Do not map by default | Not user-facing tactical meaning. |
| `activity.cache.conditional` | Diagnostic/internal provider detail | Do not map by default | HTTP/cache mechanism, not presentation truth. |
| `activity.cache.revalidated` | Diagnostic/freshness detail | Detail-safe | Can be summarized as cache revalidated if a detail surface exists. |
| `gate.state` | Authority state | Direct with ADR-0008 context | `live-enabled` / `live-disabled` gate status. Do not present as provider health. |
| `gate.enabled` | Authority state | Direct | Boolean authority for Passive provider calls. |
| `gate.message` | Authority message | Direct/detail | Current wording may say live I/O; ADR-0008 broader ingest authority must be preserved. |
| `freshness.status` | Freshness state marker | Direct | Lane-specific freshness, not shared enum. |
| `freshness.cacheAgeMs` | Freshness slot | Direct | Derived from zKill context fetch age in current service. |
| `freshness.freshnessMs` | Freshness policy | Direct/detail | Useful for adapter honesty and age threshold. |
| `status` | State marker | Direct with lane context | Passive-specific states: `fresh`, `partial`, `stale`, `blocked`, `degraded`, `unavailable`. |
| `message` | Warning/gap/display-safe summary | Direct/detail | Backend-owned explanation; adapter should not over-normalize away blocked/stale/partial distinctions. |
| `failure.code` | Diagnostic/warning | Direct/detail | Useful for exact blocked/degraded reasons. |
| `failure.message` | Diagnostic/warning | Direct/detail | Safe when sanitized; keep as reason, not domain fact. |
| Renderer labels/classes | Display hint | Do not map as authority | `Fresh context`, `Capped sample`, `Live IO blocked`, provider pulse, CSS classes, and diagnostics labels are current presentation evidence only. |
| Service command metadata | Internal/diagnostic | Do not map | Registry classifications and IPC plumbing are not Passive adapter facts. |

## Minimum Provisional Adapter Envelope

This is a candidate envelope for a future Sense-owned Passive adapter. It is not final adapter law and should not rename existing bridge fields.

| Slot | Minimum Shape | Source Fields | Preservation Requirement |
| --- | --- | --- | --- |
| `lane` | `{ id, snapshotKind, label }` | `kind` | Preserve `passive.telemetry.snapshot` and Passive lane identity. |
| `domain.currentSystem` | `{ label, systemId, resolved, fromSystemName? }` | `currentSystem.*` | Carry observed current-system context only; do not imply complete location awareness. |
| `basis.observation` | `{ eventTime, observedAt, source: "admitted navigation.jump" }` | `currentSystem.eventTime`, `currentSystem.observedAt` | Preserve local observation basis and separate it from provider fetch time. |
| `basis.resolver` | `{ source, resolved }` | `currentSystem.resolverSource`, `currentSystem.resolved` | Keep local/static lookup visible when provider claims depend on it. |
| `basis.providers` | `[{ provider, scope, fetchedAt, counts, cache? }]` | `zkill`, `activity` | Preserve zKill and ESI as scoped provider samples, not truth or full intel. |
| `freshness` | `{ status, snapshotObservedAt, sourceAgeMs, freshnessMs, providerFetchedAt[] }` | `status`, `observedAt`, `freshness.*`, `zkill.fetchedAt`, `activity.fetchedAt` | Keep source event, provider fetch, cache age, and snapshot production times distinct. |
| `state` | `{ status, authority, availability, pending? }` | `status`, `gate` | Preserve Passive-specific state and ADR-0008 authority separation. |
| `warnings` | `[{ code, label, sourceField, severity }]` | `zkill.capped`, `zkill.partial`, `activity.partial`, `status`, `failure` | Preserve capped/partial/stale/degraded/blocked/no-observation distinctions. |
| `gaps` | `[{ kind, reason }]` | Missing `currentSystem`, missing provider objects, unresolved system, blocked gate | Explain why a slot is absent without collapsing distinct Passive states. |
| `diagnostics` | `{ failure?, providerFailureCounts?, cache? }` | `failure`, `zkill.failureCount`, `activity.failureCount`, `activity.cache` | Detail-safe; should not drive primary tactical claims. |
| `displaySafe` | `{ primaryLabel?, basisLine?, ageLine?, sampleLine? }` | Derived by future adapter from above slots | Candidate output for a presentation head only. Must remain display-safe and Passive-only. |

Recommended minimal JSON-like sketch:

```js
{
  lane: {
    id: 'passive-telemetry',
    snapshotKind: 'passive.telemetry.snapshot',
    label: 'Passive Telemetry'
  },
  domain: {
    currentSystem: {
      label,
      systemId,
      resolved,
      fromSystemName
    }
  },
  basis: {
    observation: { source: 'admitted navigation.jump', eventTime, observedAt },
    resolver: { source: resolverSource, resolved },
    providers: [
      { provider: 'zKill', scope: { pastSeconds }, fetchedAt, sampleCount, capped, partial },
      { provider: 'ESI', scope: 'aggregate system activity', fetchedAt, shipKills, podKills, npcKills, jumps, partial, cache }
    ]
  },
  freshness: {
    status,
    snapshotObservedAt,
    sourceAgeMs,
    freshnessMs,
    providerFetchedAt
  },
  state: {
    status,
    authority: { gateState, enabled, message },
    availability
  },
  warnings: [],
  gaps: [],
  diagnostics: { failure, providerFailureCounts, cache },
  displaySafe: { primaryLabel, basisLine, ageLine, sampleLine }
}
```

## Mapping Decision Table

| Decision | Fields |
| --- | --- |
| Can map directly | `kind`, `observedAt`, `currentSystem.label`, `currentSystem.eventTime`, `currentSystem.observedAt`, `currentSystem.systemId`, `currentSystem.resolved`, `currentSystem.resolverSource`, `zkill.fetchedAt`, `zkill.pastSeconds`, `zkill.sampleCount`, `zkill.capped`, `zkill.partial`, `activity.fetchedAt`, `activity.shipKills`, `activity.podKills`, `activity.npcKills`, `activity.jumps`, `activity.partial`, `gate.state`, `gate.enabled`, `gate.message`, `freshness.status`, `freshness.cacheAgeMs`, `freshness.freshnessMs`, `status`, `message`, `failure.code`, `failure.message`. |
| Need lane/source context | `status`, `message`, `freshness.status`, `gate.*`, `activity.*` counts, `zkill.sampleCount`, `zkill.capped`, `zkill.partial`, `activity.partial`, `currentSystem.label`, `currentSystem.systemId`. |
| Detail/diagnostic only by default | `currentSystem.fromSystemName`, `zkill.systemId`, `zkill.failureCount`, `activity.systemId`, `activity.failureCount`, `activity.cache.cacheMs`, `activity.cache.cacheAgeMs`, `activity.cache.state`, `activity.cache.revalidated`, `failure.*` when not needed for primary state. |
| Must not map as adapter authority | Renderer-only labels/classes/test selectors, provider pulse rendering, service registry internals, HTTP ETag/conditional mechanics as user-facing truth, raw provider bodies, zKill refs as tactical truth, private/operator paths, raw gamelog lines, Lab slim/lab-term fields, Atlas Evidence/Discovery/Watch/Assessment/storage semantics. |

## State Honesty Check

| State / Condition | Current Repo Source | Adapter Requirement | Ready? |
| --- | --- | --- | --- |
| Fresh | `status: fresh`, `freshness.status: fresh`, provider objects present | Present as fresh Passive current-system context from scoped samples. | Yes |
| Stale | `snapshot()` converts expired fresh/partial context to `status: stale`; stale message differs for partial context | Preserve stale as age/freshness condition, not failure or no observation. | Yes |
| Partial | `status: partial`, `zkill.partial`, `activity.partial`, provider failure counts | Keep partial sample warning near provider claims. | Yes |
| Capped | `zkill.capped`; current status may still be `fresh` unless partial also true | Treat as warning slot independent of main status. | Yes |
| Blocked / I/O off | `status: blocked`, `gate.enabled: false`, `failure.code: PASSIVE_LIVE_IO_BLOCKED` | Preserve ADR-0008: authority blocked / no ingest allowed, not provider failure, missing truth, or no observation. | Mostly yes; wording decision remains. |
| Degraded | unresolved system ID or provider fetch throw sets `status: degraded` and `failure` | Present as impaired resolution/provider fetch, not no observation. | Yes |
| Failed/unavailable | Initial/no-current-system state is `unavailable`; provider failures become `degraded` | Keep unavailable/no observation separate from failed/degraded provider state. | Yes |
| No observation | `currentSystem: null`, `status: unavailable`, message says current system has not been observed | Present as no admitted current-system observation, not I/O off or provider failure. | Yes |
| Provider pending | During `observeEvent`, service emits `status: stale` with current system before refresh completes; renderer derives `pending` when current system exists without provider data | Candidate adapter may include `pending`, but it is derived/display-safe rather than a current bridge status. | Needs care |

## Gaps Blocking A Future Adapter

No hard blocker prevents a tiny future Passive adapter implementation packet if it stays provisional and maps the current snapshot into a Sense-owned envelope.

Exact cleanup or wording decisions that would reduce risk:

1. Current bridge `status` has no explicit `pending`; current renderer derives `pending` from `currentSystem && !zkill && !activity`. A future adapter can derive it provisionally, but should mark it display-safe, not bridge law.
2. `blocked` / "Live IO blocked" should be lane-contextualized against ADR-0008. Future copy may need Human/Overseer wording to align "live IO" with broader "I/O off means no ingest" without renaming contracts.
3. `freshness.cacheAgeMs` is based on zKill context fetch age. Activity cache age is separate under `activity.cache`. A future adapter should carry provider-specific fetch/cache times rather than pretending there is one universal age.
4. `activity.cache.state` uses current implementation values such as `refreshed`, `fresh`, and `revalidated`; renderer also checks `hit`, which is not emitted by the reviewed client. A future adapter should treat cache state as provider detail until normalized.
5. `zkill.failureCount` and `activity.failureCount` expose counts but not detailed failure arrays on the snapshot. This is acceptable for a tiny adapter, but deeper diagnostics would need a separate detail decision.

## Accepted, Deferred, Blocked

Accepted for a future tiny implementation packet:

- Passive-only envelope mapping from `passive.telemetry.snapshot`.
- Lane identity, current-system domain fact, observation basis, resolver basis, zKill sample basis, ESI activity basis, freshness, authority, warnings/gaps, and diagnostics slots.
- Derived display-safe labels if they are produced by the Sense-owned adapter from preserved source slots.

Deferred:

- Final adapter schema law.
- Renderer face adoption or visual design.
- Lab presentation head integration.
- Contract/IPC/payload renames.
- Combat Witness, Threat Intel, Clipboard Acquisition, or universal Aura adapter doctrine.
- Live/manual provider, gamelog, clipboard, shortcut, or SDE validation.

Blocked:

- None for a provisional Passive adapter implementation packet, as long as it remains tiny and bounded.

## Assumptions And Recommendations

Repo-verified facts are the file and field traces above.

Assumptions:

- A future adapter may derive `displaySafe` values from current bridge fields, but those values are adapter output rather than bridge truth.
- A future adapter can carry existing `gate.message` while preserving ADR-0008 context in its own `state.authority` slot.

Recommendations:

- Next move can be a tiny Dev implementation packet for a Passive-only adapter envelope, with fixture-only verification that preserves blocked, failed, empty, partial, stale, and fresh distinctions.
- The packet should explicitly forbid bridge field renames and should test fresh, stale, partial, capped, blocked, degraded, and no-observation fixtures.
- Human/Overseer should decide whether adapter-facing display copy uses current `Live IO blocked` wording or a more ADR-0008-faithful authority phrase before any user-facing copy becomes durable.

## Acceptance Check

- Names concrete files/modules for Passive source, transformation, state owner, bridge/preload output, and renderer consumption: met.
- Proposes a Passive-only envelope with source, basis, freshness, state, warning/gap, diagnostic, and display-safe slots: met.
- Separates repo-verified facts from assumptions and recommendations: met.
- Distinguishes domain facts, provider samples, display hints, diagnostics, and internal-only fields: met.
- Preserves Passive Telemetry as current-system context, not background Threat Intel: met.
- Preserves ADR-0008 by treating I/O off as ingest/authority blocked, not provider failure or missing truth: met.
- Identifies readiness for next packet: met; ready for a future tiny Passive adapter implementation packet, with wording cleanup noted.
- Lists wording/ownership decisions: met.
- Does not require Lab, Atlas, live/manual I/O, renderer face adoption, or code changes: met.

## Verification

Required verification for this read-only spec packet:

```powershell
npm.cmd run verify:protected-terms
git diff --check
git status --short --branch
```

Results:

- `npm.cmd run verify:protected-terms`: passed; warning-only protected-term scan reported 25 review items across the current working set, including this new advisory artifact and accepted HS58/HS59 inputs. No renames or protected-word JSON updates were performed.
- `git diff --check`: passed; PowerShell/Git reported LF-to-CRLF normalization warnings for pre-existing modified `workspace/current.md` and `workspace/overview.md`, with no whitespace errors.
- `git status --short --branch`: `## main...origin/main`; pre-existing `workspace/current.md`, `workspace/overview.md`, `workspace/EngAuditHS58-backend-to-adapter-readiness-conformance.md`, and `workspace/OverseerHS59-backend-to-adapter-readiness-audit-acceptance.md` remain present; this packet added `workspace/EngSpecHS60-passive-telemetry-adapter-envelope.md`.

## Handoff

Passive Telemetry is ready for a future tiny adapter implementation packet, not a broad adapter doctrine packet.

The implementation packet should map only the current Passive bridge snapshot into the provisional envelope above, preserve all source/basis/freshness/authority/gap slots, and keep the adapter behind Sense ownership. Bridge/body cleanup is useful but not required first. The only wording risk that should be settled before durable user-facing copy is the current "Live IO blocked" phrase versus broader ADR-0008 "I/O off means no ingest" language.
