# SenseUIUXHS01: Passive Telemetry Bridge State Readout Mapping

Status: UI/UX advisory mapping, not implementation authority
Date: 2026-05-24
Role: AURA-Sense UI/UX reviewer

## Request Received

Produce a UI/UX advisory mapping for a Passive Telemetry Bridge State Readout prototype using existing `passive.telemetry.snapshot` fields only. This pass does not implement code, rename contracts, import Lab fixtures, run live provider smoke, or create executable Dev authority.

## 1. Role And Boundary

This artifact maps existing Passive Telemetry bridge state into a compact Sense-safe readout prototype.

Boundary:

- Passive Telemetry only.
- Existing snapshot fields only.
- Renderer presentation only; backend/main-process state remains authoritative.
- Sense owns internal and Project -> Bridge meaning.
- Lab-style labels may be adapted only as Bridge -> Interface wording where Sense meaning remains intact.
- This artifact is advisory until Human or Overseer acceptance.

Not in scope:

- code implementation
- contract, IPC, service, CSS class, payload, or test renames
- Lab fixtures or shared Aura doctrine
- Core, Atlas, or Lab project changes
- live provider smoke or manual shortcut validation

## 2. Files Reviewed

Project and role authority:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/00-dot-protocol.md`
- `workspace/prompts.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `F:\Projects\Docs\Aura-Agent-Coordination\roles\ui-ux\README.md`
- `F:\Projects\Docs\Aura-Agent-Coordination\roles\ui-ux\prompt.md`

Sense docs and advisory context:

- `docs/current-state/current-implementation.md`
- `docs/features/vision.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/roadmap/milestone-14-back-page-threat-intel-ux.md`
- `workspace/SenseAdoptionHS01-aura-lab-presentation-mechanics-review.md`
- `workspace/complete/milestone-13/OverseerHS03-milestone-13-closure.md`
- `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`

Terminology authority:

- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\TerminologyAuthorityRuleset-2026-05-24.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\Sense-Terminology-Boundary-Requirements-2026-05-24.md`

Source inspected for facts only:

- `src/passive/passiveTelemetryService.js`
- `src/passive/passiveTelemetryBridge.js`
- `src/passive/liveIoGate.js`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `scripts/verify-passive-telemetry.js`
- `scripts/verify-renderer-shell.js`
- `src/main/preload.js`

## 3. Repo-Verified Passive Telemetry Facts

- Passive Telemetry is a Sense lane for current-system context and low-frequency activity signals, not Threat Intel, Atlas evidence, or complete system awareness.
- The backend service emits `kind: passive.telemetry.snapshot`.
- Passive snapshots are exposed through `auraPassiveTelemetry.getSnapshot()` and `auraPassiveTelemetry.subscribeSnapshots()`.
- The bridge IPC channels are `aura:passive-telemetry:get-snapshot`, `aura:passive-telemetry:subscribe`, `aura:passive-telemetry:unsubscribe`, and `aura:passive-telemetry:snapshot`.
- The renderer currently reads Passive snapshots through preload and presents system label, ship kills, jumps, ratio, sample count, freshness, basis, message, and provider pulse state.
- The renderer currently derives presentation labels in `app.js`; it does not call zKill or ESI directly.
- The service status values observed in docs/source are `unavailable`, `fresh`, `stale`, `partial`, `degraded`, and `blocked`.
- `unavailable` is the initial state when no current system has been observed.
- `fresh` means resolved current-system provider context is inside the Passive freshness window.
- `stale` is derived when previously fresh or partial context expires.
- `partial` means fetched context contains malformed or incomplete provider/sample data while still fresh.
- `degraded` is used for unresolved system ID or provider/context fetch failure.
- `blocked` is used when the backend live IO gate refuses Passive external calls.
- Blocked Passive live IO does not call zKill or ESI in the inspected verification script.
- ESI activity exposes ship kills, pod kills, NPC kills, jumps, partial/failure metadata, and cache metadata.
- zKill context exposes system ID, fetched time, lookback seconds, sample count, capped, partial, and failure count.
- The local resolver can report source `local-static`; this supports cautious local/static wording only when the snapshot carries resolver/source evidence.
- Existing renderer shell verification checks Passive provider pulse, Passive basis, Passive activity, Passive freshness, and visual smoke coverage for unavailable, stale, degraded, blocked, partial/capped, diagnostics, and narrow viewport states.

No verification commands were run in this UI/UX pass.

## 4. Authority Model Applied

Sense owns:

- `Passive Telemetry`
- `passive.telemetry.snapshot`
- Passive lane status meanings
- live IO gate meaning
- provider/sample/cache meaning
- current-system observation meaning
- Project -> Bridge fields and emitted state

Lab may own later interface wording only where the wording preserves Sense meaning. Lab-style readout slots such as readout status, readout basis, readout age, gaps, warnings, and secondary diagnostics are usable as presentation structure, not as imported doctrine.

The renderer may present, prioritize, collapse, or expand backend-owned state, but must not become authoritative. A UI readout must not imply complete awareness, durable evidence, background Threat Intel scanning, or provider truth beyond the snapshot.

## 5. Source Field Inventory From `passive.telemetry.snapshot`

| Field | Source meaning | UI/UX use |
| --- | --- | --- |
| `kind` | Snapshot type, currently `passive.telemetry.snapshot`. | Diagnostic/source identity only; not a visible headline. |
| `observedAt` | Time the snapshot was produced. | Secondary readout age if useful; avoid implying provider fetch time. |
| `currentSystem.label` | Current system label observed from local navigation event. | Primary: system label. |
| `currentSystem.systemId` | Resolved EVE system ID when local resolver succeeds. | Secondary diagnostic; not needed in compact readout. |
| `currentSystem.fromSystemName` | Prior system label when available from jump event. | Secondary diagnostic only. |
| `currentSystem.eventTime` | Event time from the observed jump/navigation event. | Secondary age/detail if shown. |
| `currentSystem.observedAt` | Backend observation time for the current-system event. | Secondary freshness/detail. |
| `currentSystem.resolved` | Whether the local resolver resolved a system ID. | Gap/diagnostic. |
| `currentSystem.resolverSource` | Resolver source such as `local-static` when present. | Allows `Static lookup` or `Local lookup` wording in diagnostics. |
| `zkill.systemId` | System ID used for zKill system context. | Secondary basis check. |
| `zkill.fetchedAt` | zKill context fetch time. | Secondary provider age. |
| `zkill.pastSeconds` | zKill scoped lookback window. | Secondary basis or compact tooltip. |
| `zkill.sampleCount` | Count of normalized valid zKill refs in the scoped sample. | Primary provider/sample detail. |
| `zkill.capped` | zKill sample was capped by limit. | Warning/gap near sample count. |
| `zkill.partial` | zKill normalization saw malformed/incomplete refs. | State/gap: `Partial sample`. |
| `zkill.failureCount` | Count of zKill normalization failures. | Secondary diagnostics. |
| `activity.systemId` | System ID used for ESI aggregate activity. | Secondary basis check. |
| `activity.fetchedAt` | ESI aggregate activity fetch time. | Secondary provider age/cache detail. |
| `activity.shipKills` | ESI aggregate ship kills for the system. | Primary activity value. |
| `activity.podKills` | ESI aggregate pod kills for the system. | Secondary activity detail unless layout expands. |
| `activity.npcKills` | ESI aggregate NPC kills for the system. | Secondary activity detail. |
| `activity.jumps` | ESI aggregate jumps for the system. | Primary activity value. |
| `activity.partial` | ESI activity normalization was incomplete. | State/gap: `Partial sample`. |
| `activity.failureCount` | Count of ESI activity failures. | Secondary diagnostics. |
| `activity.cache.cacheMs` | ESI activity cache lifetime. | Diagnostics only. |
| `activity.cache.cacheAgeMs` | ESI activity cache age. | Secondary readout age. |
| `activity.cache.state` | ESI cache state, for example fresh/revalidated/refreshed. | Secondary provider state; can support `Cached` detail. |
| `activity.cache.etag` | ETag for ESI revalidation. | Developer diagnostic only; not operator-facing by default. |
| `activity.cache.conditional` | Whether conditional request was used. | Developer diagnostic only. |
| `activity.cache.revalidated` | Whether cached activity was revalidated. | Secondary diagnostic only. |
| `gate.state` | Live IO policy state such as `live-enabled` or `live-disabled`. | Primary only when blocked/off; otherwise secondary. |
| `gate.enabled` | Whether live IO is enabled. | Primary when false and status is `blocked`. |
| `gate.message` | Backend live IO gate message. | Blocked explanation, preserving authority meaning. |
| `freshness.status` | Backend freshness status for Passive context. | Primary readout state/age support. |
| `freshness.cacheAgeMs` | Age of provider context used for freshness. | Primary or secondary age depending density. |
| `freshness.freshnessMs` | Passive freshness threshold. | Tooltip/diagnostic only. |
| `status` | Backend-owned Passive status. | Primary state source. |
| `message` | Backend-owned explanation. | Secondary message, warning, or detail. |
| `failure.code` | Failure or blocked code. | Secondary diagnostic; primary only for blocked/degraded details. |
| `failure.message` | Failure explanation. | Secondary warning/detail. |

## 6. Internal -> Bridge Meaning Table

| Internal/source condition | Bridge field/state | Sense-owned meaning | Must preserve |
| --- | --- | --- | --- |
| No `currentSystem` observed | `status: unavailable` | Passive lane has no current-system observation. | Do not show generic `NO DATA` without lane context. |
| Navigation jump/current system observed | `currentSystem.*` | Local observation of current-system context. | Do not imply complete system awareness. |
| Resolver returns system ID | `currentSystem.systemId`, `resolved: true` | Local/static resolution supports scoped provider lookup. | Do not call it verified truth. |
| Resolver cannot return system ID | `status: degraded`, `failure.code` | Passive context is impaired because provider lookup basis is missing. | Do not collapse into unavailable or no data. |
| Live IO gate disabled | `status: blocked`, `gate.*`, `failure.code: PASSIVE_LIVE_IO_BLOCKED` | Backend authority prevented live provider IO. | Preserve as `Live IO blocked`. |
| zKill and ESI context fetched cleanly | `status: fresh`, `zkill.*`, `activity.*` | Recent scoped provider/sample context exists. | Use lane/source context with any fresh label. |
| zKill or ESI partial metadata exists | `status: partial`, `*.partial`, `failureCount` | Sample/context is incomplete or malformed in part. | Preserve `Partial sample`; do not present as clean fresh truth. |
| Previously fresh/partial context exceeds freshness window | `status: stale`, `freshness.*` | Context exists but is older than the lane freshness threshold. | Prefer `Stale context`; preserve partial metadata if present. |
| Provider/context fetch throws | `status: degraded`, `failure.*` | Provider/runtime path failed or context fetch was impaired. | Do not collapse into blocked or unavailable. |
| zKill sample capped | `zkill.capped` | Scoped sample was display/provider capped. | Show near sample count when visible. |
| ESI cache used or revalidated | `activity.cache.*` | Activity may be served from/revalidated by the cache. | Use as basis/diagnostic, not as freshness truth for all providers. |

## 7. Bridge -> Interface Label Table

| Bridge status/field | Preferred interface label | Allowed variant | Blocked label |
| --- | --- | --- | --- |
| `fresh` | `Fresh context` | `Recent context` when source/lane is nearby | `CURRENT` alone |
| `stale` | `Stale context` | `Stale provider context` | `AGED` alone |
| `partial` | `Partial sample` | `Partial provider sample` | `Fresh` without partial marker |
| `blocked` | `Live IO blocked` | `Provider IO blocked` if gate detail remains visible | `Offline` |
| `degraded` | `Degraded` | `Provider degraded` or `Lookup degraded` depending `failure` | `No data` |
| `unavailable` | `No observation` | `Passive unavailable` when bridge is absent | `No data` alone |
| `zkill.capped` | `Capped sample` | `Sample capped` | `Complete sample` |
| `currentSystem.resolverSource: local-static` | `Static lookup` | `Local lookup` | `Fallback truth` |
| no `zkill`/`activity` with current system pending | `Provider pending` | `No provider sample yet` | `No data` |
| `activity.cache.state` | `Cached activity` or `Revalidated activity` | Diagnostics-only `Cache fresh` | `Current` as global truth |
| current provider pulse chip | `Passive sample state` | `Passive provider state` | `Provider pulse` as the main user-facing label |

Note: existing code identifiers such as `passive-provider-pulse` and `providerPulseFromPassive` should not be renamed by this advisory. The table only recommends calmer Bridge -> Interface copy for a future prototype.

## 8. State Mapping

| State | Source condition | Primary label | Primary detail | Visual treatment |
| --- | --- | --- | --- | --- |
| `fresh` | `status === 'fresh'` and `freshness.status === 'fresh'` | `Fresh context` | System label plus zKill sample count and ESI kills/jumps. | Quiet ready/healthy treatment; no global certainty language. |
| `stale` | Prior fresh/partial context expired by `freshness.cacheAgeMs > freshness.freshnessMs` | `Stale context` | Keep provider basis and age visible; if partial metadata exists, include `Partial sample is stale`. | Muted amber/caution treatment; preserve existing values but mark age. |
| `partial` | `status === 'partial'`, `zkill.partial`, or `activity.partial` | `Partial sample` | Show sample count, capped/partial reason if available, and provider basis. | Caution treatment near provider/sample, not a hard failure. |
| `blocked` | `status === 'blocked'` from live IO gate | `Live IO blocked` | Use `gate.message` or backend `message`; do not show provider sample as missing truth. | Authority-blocked treatment, distinct from provider failure. |
| `degraded` | unresolved system ID or provider/context fetch failure | `Degraded` | Use `failure.message` or backend `message`; show whether lookup or provider path failed where fields support it. | Error/degraded treatment, distinct from blocked/unavailable. |
| `unavailable` | no current-system observation or missing bridge snapshot | `No observation` | `Passive Telemetry bridge unavailable` only when snapshot is absent; otherwise current system not observed. | Quiet absence state; no warning unless bridge itself is missing. |

## 9. Primary Readout Fields

Recommended compact primary fields for the existing tactical viewport:

- System: `currentSystem.label`
- State: `status` mapped through the state table above
- Sample state: `zkill.sampleCount`, `zkill.capped`, `zkill.partial`, and `activity.partial`
- Activity: `activity.shipKills` and `activity.jumps`
- Basis: zKill sample plus ESI activity, using existing provider/basis fields
- Age: `freshness.cacheAgeMs` when stale, partial, cached, or otherwise trust-relevant
- Authority block: `gate.enabled`, `gate.message`, and `failure.code` when `blocked`

The front glance should continue to privilege system, kills, jumps, and ratio. The readout state should help the operator interpret those values without replacing Combat Witness as the primary tactical lane.

## 10. Secondary Diagnostics, Gaps, And Warnings

Secondary diagnostics:

- `currentSystem.systemId`
- `currentSystem.fromSystemName`
- `currentSystem.eventTime`
- `currentSystem.observedAt`
- `currentSystem.resolved`
- `currentSystem.resolverSource`
- `zkill.systemId`
- `zkill.fetchedAt`
- `zkill.pastSeconds`
- `zkill.failureCount`
- `activity.systemId`
- `activity.fetchedAt`
- `activity.podKills`
- `activity.npcKills`
- `activity.failureCount`
- `activity.cache.cacheMs`
- `activity.cache.cacheAgeMs`
- `activity.cache.state`
- `activity.cache.conditional`
- `activity.cache.revalidated`
- `gate.state`
- `freshness.freshnessMs`
- `failure.code`
- `failure.message`

Operator-visible gaps/warnings should stay sparse:

- `No observation`: no current-system observation yet.
- `No provider sample yet`: current system exists but provider context is pending or absent.
- `Static lookup`: resolver source is local/static and supports lookup basis.
- `Partial sample`: zKill or ESI partial flag is true.
- `Capped sample`: zKill capped flag is true.
- `Stale context`: freshness expired.
- `Live IO blocked`: backend gate prevented provider IO.
- `Degraded`: resolver or provider path failed.

Do not expose ETag values or conditional request mechanics as normal operator copy.

## 11. Compact Layout Notes For The Existing Tactical Viewport

- Keep Passive Telemetry in the existing glance strip area: system, kills, jumps, ratio, and one compact provider/sample state chip.
- Do not add a large Bridge State Readout card to the front page.
- Keep Combat Witness visual priority intact; Passive readout should explain context, not compete with pressure/repair signals.
- Replace the human-facing idea of `Provider pulse` with calmer copy such as `Passive sample state` or `Provider state` if Dev later touches copy. Do not rename existing code identifiers for that reason alone.
- Use one primary state chip plus one basis string. Example shape: `Fresh context | zKill 4 + ESI 3 / 21`.
- When stale, partial, blocked, degraded, or unavailable, the state chip should carry the trust condition and the basis string should stay source-specific.
- Put cache age, lookback, resolver source, failure code, and provider failure counts in diagnostics or tooltip-level detail.
- Avoid generic `NO DATA`; the compact view should say `No observation`, `No provider sample yet`, or `Live IO blocked` depending the backend state.
- Preserve the existing diagnostics panel as the place for deeper detail.
- Narrow viewport behavior should keep the system label and state readable before secondary provider detail.

## 12. Visual Smoke Expectations Dev Must Later Cover

For a future Dev implementation, visual/shell coverage should include at least:

- Fresh Passive context with system label, zKill sample count, ESI kills/jumps, and fresh/readout state visible.
- Stale Passive context with previous provider basis still visible and `Stale context` clearly distinct.
- Partial Passive sample with partial marker visible near sample/basis.
- Capped zKill sample with `Capped sample` visible near sample/basis.
- Blocked Passive live IO with `Live IO blocked` visible and distinct from provider failure.
- Degraded resolver/provider state with degraded message visible and distinct from unavailable.
- Unavailable/no-observation state with quiet `No observation` wording.
- Provider pending/no-provider-sample state if current system exists before provider context arrives.
- Diagnostics open state showing secondary Passive details without crowding the front glance.
- Narrow viewport state where system, state, and activity values do not overlap.

Expected future commands, if a Dev packet changes renderer visual states:

```powershell
npm.cmd run verify:passive-telemetry
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Live provider smoke and manual shortcut validation should remain gated unless the Human explicitly changes the task.

## 13. Terms That Must Remain Sense-Owned

- `Passive Telemetry`
- `passive.telemetry.snapshot`
- `Live IO blocked`
- `fresh`
- `stale`
- `partial`
- `degraded`
- `blocked`
- `unavailable`
- `Partial sample`
- `Capped sample`
- `currentSystem`
- `zkill`
- `activity`
- `gate`
- `freshness`
- provider/sample/cache basis meanings
- current-system observation meaning

These terms may be presented more readably after the bridge, but their Sense meaning must remain traceable.

## 14. Lab Labels That Are Allowed, Adapted, Or Blocked

| Lab/default label | Decision for Passive prototype | Sense-safe handling |
| --- | --- | --- |
| `Bridge State Readout` | Allowed as pattern name in advisory/docs. | Use as structure, not product doctrine. |
| `Readout status` | Allowed. | Map from Passive `status`. |
| `Readout basis` | Allowed. | Use zKill/ESI/cache/gate fields only. |
| `Readout age` | Allowed. | Use `freshness.cacheAgeMs`, `observedAt`, or provider `fetchedAt` with source context. |
| `Source coverage` | Adapted. | Prefer `Provider basis` or `Sample state`. |
| `Gaps` | Allowed. | Use for partial, capped, unresolved, blocked, or no-provider-sample conditions. |
| `Warnings` | Allowed sparingly. | Only for trust or operator-action-relevant states. |
| `CURRENT` | Adapted. | Use `Fresh context` or `Recent context`; never alone. |
| `UPDATING` | Deferred/adapted. | Use `Provider pending` only when existing fields support pending/absence. |
| `AGED` | Blocked as main copy. | Use `Stale context`. |
| `PARTIAL` | Adapted. | Use `Partial sample`. |
| `UNAVAILABLE` | Adapted. | Use `No observation` or `Passive unavailable` depending snapshot/bridge condition. |
| `FALLBACK` | Blocked as generic copy. | Use `Static lookup` or `Local lookup` only when resolver/source fields support it. |
| `NO DATA` | Blocked as generic copy. | Use `No observation` or `No provider sample yet`. |

## 15. Risks And Non-Goals

Risks:

- Generic Lab labels could flatten blocked, partial, degraded, unavailable, stale, and fresh.
- `Fresh` or `Current` copy could imply total real-time awareness unless lane/source context stays visible.
- `Fallback` could imply alternate provider truth rather than local/static lookup.
- A large readout treatment could crowd the compact viewport and weaken Combat Witness priority.
- Provider/sample wording could drift into Threat Intel semantics if zKill sample context is not lane-labeled.
- Renderer presentation could accidentally become a truth model if it recomputes or merges lane states.

Non-goals:

- no Passive Telemetry contract changes
- no provider behavior changes
- no live API calls
- no Threat Intel, Combat Witness, Clipboard Acquisition, Atlas, Core, or Lab changes
- no global Aura state vocabulary
- no durable evidence/report semantics
- no broad visual redesign
- no user-facing claim of complete system awareness

## 16. Recommended Next Role/Action

Recommended next action: Overseer review and decide whether to accept this mapping into a bounded Dev runway.

UI/UX recommends Dev next only after Overseer acceptance, because the existing snapshot fields can support the prototype without contract changes. The implementation should be renderer presentation-only, Passive Telemetry-only, and verification-bound.

Human/Overseer decisions that would improve precision:

- Choose `Fresh context` vs `Recent context` as the primary fresh label.
- Decide whether `Provider state` or `Sample state` should replace user-facing `Provider pulse` copy in the Passive surface.
- Confirm whether `Static lookup` is acceptable when `currentSystem.resolverSource` supports it.

## 17. Draft Dev Runway Recommendation Only

Status: Draft recommendation only, not executable Dev authority.

If Overseer accepts this UI/UX mapping, a bounded Dev packet could be:

1. Update Passive Telemetry renderer presentation only, using existing `passive.telemetry.snapshot` fields.
2. Preserve all contracts, IPC channels, services, payload fields, CSS/test identifiers unless a change is explicitly accepted separately.
3. Map `fresh`, `stale`, `partial`, `blocked`, `degraded`, and `unavailable` to the labels in this artifact.
4. Keep the compact front glance layout: system, kills, jumps, ratio, basis/sample state, and concise state copy.
5. Move secondary details to the existing diagnostics surface or tooltip-level detail.
6. Add/adjust renderer shell assertions and Electron visual smoke expectations for fresh, stale, partial/capped, blocked, degraded, unavailable, provider pending, diagnostics, and narrow viewport.
7. Run the future verification commands listed in section 12.
8. Do not run live provider smoke or manual shortcut validation unless the Human explicitly authorizes it.

