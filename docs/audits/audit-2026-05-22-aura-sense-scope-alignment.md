# Audit: AURA-Sense Scope Alignment

Date: 2026-05-22
Scope: Align AURA-Sense documentation to a single tactical viewport product identity.

## Verdict

AURA-Sense should be treated as the product, not a compatibility label.

The documentation spine now has one current identity:

```txt
AURA-Sense is the tactical viewport.
AURA Atlas is the persistent evidence map.
```

## Scope To Preserve

- AURA-Sense is tactical, transient, and operator-facing.
- AURA Atlas is persistent, historical, and evidence-facing.
- Renderer code presents snapshots and events; it does not own tactical truth.
- Passive Telemetry, Threat Intel, and Combat Witness remain separate lanes.
- zKill is discovery only.
- Expanded ESI killmails are the source of truth for scoped Threat Intel.
- Combat Witness is tactical observation, not historical intelligence.
- External API usage must be scoped, gated, cached, and observable.
- HUD language must avoid false certainty.

## Active Product Elements

The fixed product elements are now described in:

- `docs/features/vision.md`
- `docs/features/clipboard-acquisition.md`

Implementation should refine those features through small verified slices rather than by accumulating panels.

## Safe To Build From Now

- Documentation structure and artifact rules
- Tenets and tactical viewport ADR
- Telemetry lane contract
- Renderer boundary contract
- Threat Intel pipeline contract
- Combat Witness contract
- Combat event and HUD snapshot schemas
- Clipboard acquisition as a deliberate, armed input workflow
- Frame module notes for borderless and always-on-top Electron behavior
- Seed rigging service registry, task runner, taxonomy, and HTTP client principles

## Adapt Before Implementation

- Product copy must say AURA-Sense directly.
- Runtime claims require current-state updates and verification.
- Log watcher behavior should remain fixture-first.
- Threat Intel should expose sample, cap, and freshness metadata from the start.
- Combat Witness should keep backend event/cache/window tests ahead of UI widgets.
- Renderer UI should consume snapshots, not compute tactical truth.

## Explicitly Defer

- Atlas persistence and report model
- SQLite retention model
- watch executor
- broad background discovery
- recommendations or tactical advice
- long-term combat archives

## Readiness Assessment

Ready to build from: Yes, as AURA-Sense.

Not ready to claim: full tactical viewport readiness.

## Recommended Next Work

1. Use `docs/features/vision.md` as the feature goalpost index.
2. Keep Milestone 03 focused on Tactical HUD First Light.
3. Refine implementation through feature-specific packets after First Light proves the renderer snapshot path.
