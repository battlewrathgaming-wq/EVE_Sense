# Statement: AURA-Sense Rewrite Doctrine

Status: Active
Date: 2026-05-22

AURA-Sense should rebuild Aura 7's tactical viewport from reusable Aura Core rigging and selected proven doctrine.

## Rules

- Inherit Aura 7's development discipline, not its entire implementation body.
- Pure compute comes before persistence.
- Services own mutation; UI and CLI surfaces request commands.
- Long-running work uses task lifecycle vocabulary.
- Warnings and errors use a shared taxonomy shape.
- External calls require timeout, cancellation, retry policy, explicit User-Agent, and an injectable transport.
- Passive Telemetry, Threat Intel, and Combat Witness remain separate lanes.
- Renderer code presents snapshots and sends commands; it does not own telemetry truth.
- Large static datasets are adapters, not seed doctrine.
- Documentation records intent before implementation weight accumulates.
- Failure records preserve lessons that would otherwise be rediscovered.

## Migration Rule

AURA-Sense should treat Aura 7 as lineage and Atlas as a sibling system.

Clone doctrine and low-risk utility patterns. Adapt service/runtime boundaries. Defer persistence, retention, watch execution, and heavy domain assumptions until the rewrite proves it needs them.

