# Terminology Sniffer Audit Seed

Status: Advisory only, not Sense authority
Transfer status: Transferable advisory work product, not project authority
Date: 2026-05-24
Project: AURA-Sense

## Purpose

Provide a bounded starting packet for a terminology/state auditor to chase likely cross-project term conflicts before they become product or implementation problems.

This is not a rename instruction, not a Dev runway, and not a protected-word authority update.

## Source Command

Baseline warning sample came from:

```powershell
npm.cmd run verify:protected-terms -- --baseline
```

Observed output summary:

```txt
Sense protected-term discovery mode: baseline
Sense protected-term discovery source: explicit broad baseline
Sense protected-term discovery quarantine terms: muted by default
Sense protected-term discovery: scanned 64 file(s)
Sense protected-term discovery: 1700 warning-only item(s)
```

The output is intentionally warning-only and too noisy to action directly. The goal is classification, not bulk fixing.

## High-Value Samples

| Term | File / line | Why inspect |
| --- | --- | --- |
| `Evidence` | `docs/contracts/threat-intel-contract.md:69` | Atlas-owned term. Check it is only negating Atlas semantics, not becoming Sense product copy. |
| `Evidence` | `docs/current-state/current-implementation.md:196` | Current-state docs have several hits. Confirm whether they mean verification record, not Atlas evidence. |
| `Watch` | `docs/contracts/combat-witness-contract.md:42` | Likely okay if it means gamelog watcher, risky if it starts to smell like Atlas Watch. |
| `Discovery` | `docs/current-state/current-implementation.md:150` | Atlas-sensitive. In Sense it may be zKill discovery refs or scan mechanics, but should stay scoped. |
| `Readout` | `docs/current-state/combat-metrics.md:426` | Lab-owned-ish presentation term. Probably acceptable as presentation grammar, but needs an explicit allow/common decision. |
| `Coverage` | `docs/contracts/service-command-contract.md:45` | Could be normal test/service language, but Lab also uses coverage grammar. Likely noise; classify. |
| `Warnings` | `docs/schemas/hud-snapshot.md:18` | Lab-form slot term. Probably safe as neutral presentation structure if not product meaning. |

## Renderer-Facing Current Samples

These are not necessarily problems, but they are the lines where conflicts would matter most because they are user-facing or presentation-facing:

| Term | File / line | Initial read |
| --- | --- | --- |
| `Observed balance` | `src/renderer/index.html:159` | Sense-safe if tied to observed repair minus incoming damage, not survival/tank state. |
| `Incoming DPS` | `src/renderer/index.html:166` | Sense-safe as observed rolling Combat Witness metric. |
| `Repair HPS` | `src/renderer/index.html:173` | Sense-safe if repair parser limitations remain documented. |
| `Log Watcher` | `src/renderer/index.html:210` | Acceptable only as gamelog watcher operational state, not Atlas Watch. |

## Initial Read

- `Incoming DPS`, `Repair HPS`, and `Observed balance` look Sense-safe.
- `Log Watcher` is acceptable only because it is gamelog watcher operational state.
- `Readout` should probably be accepted as neutral presentation grammar, not Sense meaning.
- `Evidence`, `Discovery`, `Watch`, and `Report` are the first terms to audit for possible context poisoning.
- `No data`, `Fallback`, `CURRENT`, `AGED`, and generic `UNAVAILABLE` should remain blocked or lane-qualified where they could collapse Sense states.

## Specialist Task

Audit Sense protected-term baseline warnings. Do not fix all warnings.

Focus on:

- `Evidence`
- `Discovery`
- `Watch` / `Watcher`
- `Readout`
- `Coverage`
- `Warnings`
- `Report`
- `No data`
- `Fallback`
- `CURRENT`
- `AGED`

For each term family, classify examples as one of:

- accepted Sense use
- allowed only with lane qualifier
- internal/test-only
- advisory/protective mention only
- rewrite candidate
- sniffer noise/tune candidate

Pay special attention to renderer/user-facing lines versus docs/tests. Do not implement renames.

## Guardrails

- Do not rename code, docs, schemas, UI copy, IPC channels, bridge fields, services, or tests.
- Do not update protected-word JSON.
- Do not treat baseline warning count as a failure.
- Do not import Atlas evidence, report, watch, storage, or assessment semantics into Sense.
- Do not import Lab fixture taxonomy or neutral labels as Sense product meaning.
- Preserve Sense lane meanings: Combat Witness, Passive Telemetry, Threat Intel, Clipboard Acquisition, Live IO blocked, Partial sample, Capped sample, No scan, and No observation.

## Expected Output

Produce a short audit artifact with:

1. Files reviewed.
2. Command output summary.
3. Term-family classification table.
4. True risks.
5. Accepted/common/noise terms.
6. Rewrite candidates, if any.
7. Sniffer tuning candidates, if any.
8. Recommendation: no action / docs copy pass / renderer copy pass / sniffer tune.
