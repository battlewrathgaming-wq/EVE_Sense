# Audit: Aura 7 Scope Alignment For AURA-Sense

Date: 2026-05-22
Scope: Review Aura 7 documentation and align AURA-Sense docs to the same tactical viewport scope.

## Verdict

AURA-Sense is ready to build from as a rewrite seed if contributors treat the current codebase as rigging plus scope documentation, not as a complete Aura 7 implementation.

The documentation now identifies AURA-Sense as the Aura 7 tactical viewport successor and preserves the key boundary with AURA Atlas.

## Reviewed Aura 7 Sources

- `Docs/index.md`
- `Docs/tenets/tenets.md`
- `Docs/adr/ADR-0001-aura7-is-tactical-viewport.md`
- `Docs/current-state/current-implementation.md`
- `Docs/contracts/telemetry-lane-contract.md`
- `Docs/contracts/renderer-boundary-contract.md`
- `Docs/contracts/combat-witness-contract.md`
- `Docs/contracts/threat-intel-contract.md`
- `Docs/Concept/Vision.md`
- `Docs/Concept/aura_7_high_level_technical_architecture_llm_reference.md`
- `Docs/features/clipboard-acquisition.md`
- `Docs/schemas/combat-event.md`
- `Docs/schemas/hud-snapshot.md`
- `Docs/gap/to-do/readiness-*.md`

## Scope To Preserve

- AURA-Sense is the tactical viewport.
- AURA Atlas is the persistent evidence map.
- Telemetry should be transient by default.
- Renderer code should present snapshots and events, not own tactical truth.
- Passive Telemetry, Threat Intel, and Combat Witness remain separate lanes.
- zKill is discovery only.
- Expanded ESI killmails are the source of truth for scoped Threat Intel.
- Combat Witness is tactical observation, not historical intelligence.
- External API usage must be scoped, gated, cached, and observable.
- HUD language must avoid false certainty.

## Safe To Carry Forward Now

- Documentation structure and artifact rules
- Tenets and tactical viewport ADR
- Telemetry lane contract
- Renderer boundary contract
- Threat Intel pipeline contract
- Combat Witness contract
- Combat event and HUD snapshot schemas
- Clipboard acquisition as a deliberate, armed input workflow
- Frame module notes for borderless and always-on-top Electron behavior
- Aura Core service registry, task runner, taxonomy, and HTTP client principles

## Adapt Before Cloning

- Aura 7 current-state docs must be rewritten as AURA-Sense current state before being treated as authoritative.
- IPC channels should be rebuilt through the AURA-Sense service command registry.
- Log watcher behavior should be rebuilt with fixture-first verification.
- Threat Intel should keep the zKill to ESI evidence rule but expose sample/cap/freshness metadata from the start.
- Combat Witness should begin with backend event/cache/window tests before UI widgets.
- Renderer UI should be rebuilt against snapshots, not copied as a proof of architecture.

## Explicitly Defer

- Atlas persistence and report model
- SQLite schema and retention policy
- Watch executor
- broad background discovery
- SDE-heavy ID resolution as a seed requirement
- full Aura 7 runtime assumptions
- long-term combat archives

## Unknown Or Needs Inspection

- Whether AURA-Sense should reuse Aura 7's existing `systems.json` directly or replace it with a smaller local metadata adapter.
- Which Aura 7 verification scripts should be ported unchanged after package naming and runtime paths settle.
- Whether the AURA-Sense renderer will stay DOM-only or move to a framework.
- How Atlas handoff should be represented, if any, without creating persistence creep.

## Readiness Assessment

Ready to build from: Yes, as a scoped rewrite seed.

Not ready to claim parity with Aura 7: the implementation still needs AURA-Sense-specific services, fixtures, contracts, and verification before runtime parity can be asserted.

## Recommended Next Work

1. Rename package metadata from neutral Aura Core to AURA-Sense when code ownership is ready.
2. Add `verify:all` coverage for renderer boundary, service validation, and fixture parsers.
3. Rebuild Passive Telemetry with a local system metadata adapter.
4. Rebuild Threat Intel with explicit evidence/sample/freshness metadata.
5. Build Combat Witness backend cache and rolling window tests before UI expansion.
