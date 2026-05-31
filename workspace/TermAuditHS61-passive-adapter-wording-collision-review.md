# TermAuditHS61 - Passive Adapter Wording Collision Review

Date: 2026-05-31
Role: Independent terminology / adapter-boundary auditor
Status: Advisory review complete

## Request Answered

Review the Passive Telemetry adapter envelope work for wording, ownership, downstream starter-kit pressure, and cross-lane collision risk before any tiny adapter implementation packet is opened.

Primary question:

Are the proposed Passive adapter slots and candidate state words safe enough for a provisional Sense-owned adapter, or do any terms risk importing Lab authority, Atlas semantics, presentation-head assumptions, or lane confusion?

This artifact is advisory only. It does not implement code, edit contracts, rename bridge fields, modify Lab files, create a Dev runway, or authorize presentation adoption.

## Files Reviewed

Sense authority and packet sources:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/EngAuditHS58-backend-to-adapter-readiness-conformance.md`
- `workspace/OverseerHS59-backend-to-adapter-readiness-audit-acceptance.md`
- `workspace/EngSpecHS60-passive-telemetry-adapter-envelope.md`
- `docs/current-state/current-implementation.md`
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
- `src/main/main.js`
- `src/renderer/app.js`

Shared terminology sources:

- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\TerminologyAuthorityRuleset-2026-05-24.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\protected-term-working-index.md`

Lab advisory inputs:

- `F:\Projects\AURA- Lab\workspace\StarterKitSpecHS160-portable-presentation-contents.md`
- `F:\Projects\AURA- Lab\workspace\OverseerHS161-m41-starter-kit-spec-acceptance.md`
- `F:\Projects\AURA- Lab\docs\adr\0002-target-owned-presentation-adapters.md`

## Repo-Verified Sense Facts

- Sense owns Passive Telemetry, its lane semantics, bridge output, adapter behavior, and Project -> Bridge meaning.
- Passive Telemetry is low-frequency current-system context triggered by admitted local observation. It is not Threat Intel and must not imply background intelligence, continuous monitoring, complete awareness, or tactical danger scoring.
- Passive snapshots currently expose `kind`, `observedAt`, `currentSystem`, `zkill`, `activity`, `gate`, `freshness`, `status`, `message`, and `failure`.
- Current Passive states are `fresh`, `partial`, `stale`, `blocked`, `degraded`, and `unavailable`. `capped` is a provider/sample warning carried by `zkill.capped`, not always the primary status.
- `blocked` is authority/gate state, not provider failure, no observation, or missing truth.
- ADR-0008 says I/O off means Sense is not allowed to ingest.
- `No observation` means Sense has not observed a relevant current-system event. It is distinct from I/O off.
- Renderer labels such as `Fresh context`, `Stale context`, `Partial sample`, `Capped sample`, `Live IO blocked`, `Degraded`, and `No observation` are current presentation evidence, not bridge contract authority.
- HS60 correctly concludes that no hard blocker prevents a tiny future Passive adapter implementation packet if it stays provisional, Passive-only, Sense-owned, and fixture-verified.

## Lab Advisory Inputs Used

Lab starter-kit material was treated as downstream presentation-head shape only.

Useful Lab pressure:

- `basis`, `availability`, `coverage`, `gaps`, `warnings`, `detail`, and `sourceOwned` are useful display-shaping concepts.
- Lab's insistence that target projects own adapters reinforces ADR-0003.
- Lab source-owned placeholder guidance is useful for Sense blocked/degraded/no-observation wording.
- Lab's `readout` shape is useful as an example of what a presentation frame may expect.

Not accepted as Sense authority:

- Lab example fields are not Sense bridge/runtime contracts.
- Lab `state` examples are not Sense state enums.
- Lab `NO DATA` / `UNAVAILABLE` cannot replace Sense-specific `blocked`, `no observation`, `unavailable`, `degraded`, or `partial`.
- Lab static/React implementation posture does not shape Sense runtime, IPC, preload, schemas, or renderer adoption.

## Assumptions

- This review is advisory and read-only.
- The proposed adapter envelope is provisional and Passive-only.
- A future Dev packet, if opened, would be created by Sense Overseer/Human through `workspace/current.md`.
- A future adapter may derive presentation-candidate copy from preserved source slots, but that copy is adapter output, not bridge truth.

## Term Collision Table

| Term | Proposed layer | Risk | Safe use | Avoid / qualifier | Recommendation |
| --- | --- | --- | --- | --- | --- |
| `lane` | Adapter internal / bridge preservation | Low | Identify Passive lane and `passive.telemetry.snapshot` | Do not universalize into Aura-wide doctrine | Safe |
| `domain` | Adapter internal | Low/medium | Group observed current-system facts | Qualify as observed/local context; avoid complete-location claims | Safe with qualifier |
| `basis` | Adapter/display basis | Low | Source/provider/sample basis | Do not imply proof, evidence, certainty, or truth | Safe |
| `freshness` | Adapter/bridge preservation | Low | Source/provider/snapshot age | Not a shared enum across lanes/projects | Safe |
| `state` | Adapter internal | Medium | Passive-specific state object | Do not flatten across lanes or Lab states | Safe with lane namespace |
| `warnings` | Adapter/display caution | Low | Capped/partial/stale/blocked cautions | Avoid alarm, danger, or tactical recommendation language | Safe |
| `gaps` | Adapter/display absence/limit | Low | Missing or limited basis | Not proof of source absence or no truth | Safe |
| `diagnostics` | Detail/support | Low | Failure/cache/provider detail | Keep out of primary tactical copy | Safe |
| `displaySafe` | Adapter output | Medium/high | None as named | "Safe" sounds final, approved, or presentation-head-owned | Replace |
| `presentationCandidate` | Adapter output | Low | Candidate presentation copy from adapter | Must remain Sense-owned and provisional | Good replacement |
| `adapterPreview` | Adapter output | Low | Adapter-produced preview/copy bundle | Do not treat as renderer adoption | Preferred replacement |
| `displayCandidate` | Adapter output | Low/medium | Candidate display bundle | Slightly Lab/display-flavored | Acceptable |
| `interfaceCandidate` | Adapter output | Medium | Candidate interface wording | Can sound Lab-owned Bridge -> Interface | Use only with source-owned qualifier |
| `Live IO blocked` | Current Sense copy / authority state | Medium | Preserve current backend gate meaning | Narrower than ADR-0008; do not hide ingest authority | Use with ADR-0008 context only |
| `I/O Isolated` | Candidate user-facing copy | Medium | Possible compact label for authority-off state | Too abstract by itself; could sound like network isolation | Needs Human/Overseer decision |
| `Live Feed` | Candidate user-facing copy | High | Avoid for Passive | Implies continuous feed/background monitoring | Do not use |
| `Live Feed Isolated` | Candidate user-facing copy | High | Avoid for Passive | Implies a live feed exists but is isolated | Do not use |
| `blocked` | State | Medium | Authority-blocked state with lane/context | Not provider failure, no data, no observation, or unavailable | Safe with qualifier |
| `unavailable` | State | Medium | No current Passive snapshot/source unavailable | Not blocked or failed | Safe with reason |
| `no observation` | User-facing absence | Low | No admitted current-system observation | Not I/O off or provider failure | Safe |
| `stale` | Freshness | Low | Age/freshness expired | Not failure or no observation | Safe |
| `partial` | Provider/sample state | Low | Provider/sample incomplete | Keep source and sample scope nearby | Safe |
| `capped` | Warning/sample | Low | zKill sample limit warning | Not primary state by itself; keep near sample count/scope | Safe |
| `degraded` | Impairment | Medium | Resolver/provider/runtime impairment | Not authority block or no observation | Safe with reason |
| `certainty` | Adapter slot | High | Avoid for Passive now | Implies confidence/proof/truth; Lab quarantine term | Do not add |

## Passive-vs-Threat Boundary Findings

Passive Telemetry and Threat Intel both touch zKill-backed data, but their meanings differ.

Passive Telemetry:

- current-system context
- triggered by admitted navigation/current-system observation
- scoped zKill system context and ESI aggregate system activity
- low-frequency context lane
- no deliberate target inspection

Threat Intel:

- deliberate operator-initiated scan
- Clipboard Acquisition or explicit service/request path
- target resolution and scoped zKill probe
- latest scan basis
- not continuous monitoring

The adapter must preserve Passive lane identity on every state, warning, gap, and provider sample. The largest collision risk is generic "zKill sample" wording that could make Passive current-system context sound like Threat Intel.

Recommended Passive wording pattern:

```txt
Passive Telemetry: scoped provider context for observed current system.
```

Avoid:

```txt
Threat context
Intelligence feed
Live feed
System intel
Evidence
Report
```

## Atlas / Lab Import Risks

Atlas risks:

- `Evidence`, `Discovery`, `Watch`, `Assessment`, `Report`, and durable history language must not enter Passive adapter copy.
- Passive provider samples must not become Atlas-like proof/evidence.
- zKill refs must not be presented as tactical truth or durable records.

Lab risks:

- Lab `readout.state` examples must not become Sense source states.
- Lab `NO DATA` must not collapse Sense `blocked`, `no observation`, `unavailable`, and `degraded`.
- Lab `availability` is useful presentation grammar, but Sense owns the underlying reason.
- Lab React/static starter assumptions must not shape Sense bridge/runtime payloads.
- Lab default copy should qualify source-owned placeholders rather than absorb them.

## Lab Starter-Kit Usability Recommendation

Recommendation: usable with cautions.

The starter-kit spec is useful as downstream presentation pressure because it is explicit that target-owned adapters preserve source meaning before presentation. It is not usable as a Sense adapter schema, runtime contract, bridge contract, or state enum source.

## Starter-Kit Adapter-Shaping Cautions

- Treat Lab starter inputs as example shapes only.
- Require `sourceOwned` or equivalent qualification when Sense-owned placeholders appear.
- Do not map Lab `NO DATA` over Sense `blocked`, `no observation`, or `unavailable`.
- Do not map Lab `UNAVAILABLE` over Sense provider failure/degraded states without carrying the exact reason.
- Do not let `state` become a shared state enum.
- Do not let Lab static/React implementation choices become Sense implementation requirements.
- Do not use starter-kit material to rename Sense contracts, IPC channels, preload APIs, payload fields, CSS/test selectors, or current bridge states.

## What Sense Can Safely Use From Lab Starter-Kit Wording

Safe as advisory presentation grammar:

- `readout`
- `readout basis`
- `readout age`
- `availability reason`
- `gaps`
- `warnings`
- `detail`
- `sourceOwned`
- source-owned placeholder qualification
- non-contract example-shape thinking

Use with caution:

- `state`
- `coverage`
- `known fields`
- `NO DATA`
- `UNAVAILABLE`
- `FALLBACK`

Avoid importing into Sense bridge/runtime:

- Lab starter input schema as a contract
- Lab state grammar as Sense state enum
- Lab static or React assumptions
- Lab visual behavior as renderer adoption

## What Lab Should Clarify Before Sense Dev

Lab should clarify, preferably in Lab-local starter-kit docs, that:

- `readout.state` is display example state, not a source-project enum.
- `availability`, `gaps`, and `warnings` are display treatment slots, not source truth.
- `NO DATA` must not be used to collapse source-owned no-scan, no-observation, blocked, failed, unavailable, or degraded states.
- Source-owned placeholder terms must include owner/layer qualification in examples.
- Starter-kit examples are not target bridge/runtime contracts.

## User-Facing Wording Recommendation For I/O Off / Ingest Blocked

Preferred compact user-facing wording:

```txt
I/O off - ingest blocked
```

Preferred detail line:

```txt
Sense is not allowed to ingest while I/O is off.
```

Acceptable transition wording:

```txt
Live IO blocked
```

Only use `Live IO blocked` when it is clearly tied to Sense's current backend gate and not presented as provider failure, no observation, or no data. It should be considered current/legacy-compatible wording rather than ideal future durable copy after ADR-0008.

Do not use:

- `Live Feed`
- `Live Feed Isolated`
- `Offline`
- `No data`
- `Provider unavailable`

for the I/O-off state.

## Recommendation On `displaySafe` Naming

Replace `displaySafe`.

Reason:

`displaySafe` sounds final, approved, sanitized, or presentation-head-owned. It could cause a future Dev packet to treat derived copy as durable interface doctrine.

Preferred replacement:

```txt
adapterPreview
```

Acceptable alternative:

```txt
presentationCandidate
```

Less preferred but usable:

```txt
displayCandidate
```

Use `interfaceCandidate` only if the artifact makes clear that Sense owns the adapter output and Lab owns later Bridge -> Interface presentation after meaning is preserved.

## Recommendation On Whether `certainty` Is Needed

Do not add a `certainty` slot for Passive Telemetry now.

`basis + freshness + warnings + gaps` is enough for this lane and better matches Sense's current state model. `certainty` imports false proof/confidence pressure and appears in Lab default-copy quarantine as a term to avoid unless a source project explicitly supports it.

If a later lane needs confidence language, it should be reviewed separately and probably not named `certainty` unless Human/Overseer explicitly accepts it.

## Safe-For-Dev Terms

Safe for a tiny future Passive adapter Dev packet:

- `lane`
- `domain.currentSystem`
- `basis`
- `basis.observation`
- `basis.resolver`
- `basis.providers`
- `freshness`
- `state`
- `state.authority`
- `warnings`
- `gaps`
- `diagnostics`
- `adapterPreview`
- `fresh`
- `stale`
- `partial`
- `capped`
- `degraded`
- `unavailable`
- `no observation`
- `authority blocked`
- `I/O off - ingest blocked`

Safe only with explicit qualifiers:

- `blocked`
- `availability`
- `coverage`
- `sample`
- `state`
- `current`
- `fresh`
- `source`

Diagnostics/detail only by default:

- provider failure counts
- cache mechanics
- ETag / conditional request detail
- resolver failure code
- provider refs, if exposed later

## Terms Needing Human / Overseer Decision

- Whether future user-facing copy should preserve `Live IO blocked` or move to `I/O off - ingest blocked`.
- Whether `I/O Isolated` is acceptable as a compact visible state label.
- Final replacement for `displaySafe`: recommended `adapterPreview`.
- Whether `Live IO blocked` remains preserve-exact or adapter-translatable after ADR-0008.

## Final Recommendation

Recommendation: safe after wording cleanup.

HS60 is safe enough to support a tiny future Passive adapter implementation packet if these cleanup points are applied before or inside the packet:

1. Rename `displaySafe` to `adapterPreview` or `presentationCandidate`.
2. Use ADR-0008-aligned authority wording for I/O off, preferably `I/O off - ingest blocked`.
3. Keep `blocked`, `unavailable`, `no observation`, `stale`, `partial`, `capped`, and `degraded` distinct in fixtures and copy.
4. Treat Lab starter-kit fields as display examples only, not Sense bridge/runtime contracts.
5. Keep the adapter Passive-only and Sense-owned.

Do not park HS60. Do not open broad adapter doctrine. Do not open Lab adoption or renderer face work from this review alone.

