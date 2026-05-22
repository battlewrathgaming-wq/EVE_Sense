# AURA-Sense Documentation

This folder preserves the operational memory for AURA-Sense.

AURA-Sense owns the tactical viewport direction. Current-state records, active gap packets, contracts, feature vision, and verified implementation are authoritative for this repository.

AURA-Sense answers:

```txt
What is happening around me right now?
What must I notice?
```

AURA Atlas answers:

```txt
What patterns emerge over time?
```

That boundary is mandatory.

## Documentation Purpose

AURA-Sense's main risks are semantic drift and premature implementation weight:

- renderer state becoming telemetry authority
- passive telemetry contaminating scoped Threat Intel
- Combat Witness data being treated as historical evidence
- UI language implying certainty beyond observation
- external calls widening beyond scoped tactical need
- persistent storage creeping into a transient HUD product
- outdated or imported phrasing being mistaken for settled AURA-Sense design

The documentation library preserves why the system behaves a certain way, not only how it currently works.

## Folder Map

| Folder | Purpose | Change Frequency |
| --- | --- | --- |
| `current-state/` | Grounded description of what currently exists in AURA-Sense | As implementation changes |
| `research/` | Exploratory findings and tactical evidence notes | As discoveries are made |
| `contracts/` | Stable rules, ownership boundaries, and interface expectations | Carefully and intentionally |
| `tenets/` | Foundational truths and architectural invariants | Rare |
| `statements/` | Operational doctrine and emerging philosophy | Occasional |
| `audits/` | Current-state technical understanding and handovers | As implementation changes |
| `failures/` | Preserved lessons from bugs/regressions | When lessons are learned |
| `adr/` | Architecture Decision Records | Major decisions |
| `schemas/` | Canonical data structures and interface contracts | When contracts change |
| `features/` | Product feature concepts before/during implementation | As features are shaped |
| `testing/` | Verification matrices and command-class boundaries | As test strategy changes |
| `gap/to-do/` | Known readiness work not yet complete | As gaps are found |
| `gap/complete/` | Completed gaps with completion signal | As gaps close |
| `module/` | Reusable implementation module notes | When modules are seeded |
| `roadmap/` | Future-facing architecture and product direction | As strategy evolves |
| `terms/` | Plain-language explanations of project concepts | When terminology needs shared understanding |
| `templates/` | Templates for durable documentation artifacts | Rare |
| `Concept/` | AURA-Sense concept briefs and high-level doctrine | Reference/history |
| `Tasks/` | Historical task briefs | Reference/history |

## Artifact Rules

When significant architectural learning occurs, create or update a durable artifact.

- Bug fixed -> add a failure record.
- Major design choice -> add an ADR.
- New operational philosophy -> add a statement.
- New stable truth -> update tenets.
- Current implementation understanding -> update an audit.
- Stable data/interface shape -> update a schema document.
- Future direction -> update roadmap.

Good threshold:

> Would future Codex, a contributor, or a refactor risk making the wrong tactical or architectural choice without this context?

If yes, document it.

## Core Project Memory

The following concepts should remain preserved across implementation:

- AURA-Sense is the current tactical viewport product direction.
- AURA Atlas is the persistent evidence map.
- AURA-Sense is tactical, transient, and low-retention.
- The renderer presents snapshots; it is not telemetry authority.
- Passive Telemetry, Threat Intel, and Combat Witness are separate lanes.
- zKill is discovery only.
- Scoped zKill-backed samples are the first Threat Intel surface; expanded ESI killmails remain deferred until explicitly authorized.
- Combat Witness is observed telemetry, not evidence-grade history.
- UI copy must not overclaim certainty.
- Live API usage must remain scoped, gated, cached, and respectful.
- Local static metadata should be preferred over repeated live lookup.
- Imported or older docs must be rewritten into AURA-Sense terms before they guide work.
- Seed rigging is infrastructure, not product doctrine.
