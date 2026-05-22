# Statement: AURA-Sense Rewrite Doctrine

Status: Active
Date: 2026-05-22

AURA-Sense should build the tactical viewport from current contracts, product feature vision, reusable seed rigging, and verified implementation.

## Rules

- Express product doctrine directly as AURA-Sense, not as inherited history.
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

AURA-Sense should treat Atlas as a sibling system.

Reuse low-risk utility patterns only when they fit current AURA-Sense contracts. Adapt service/runtime boundaries deliberately. Defer persistence, retention, watch execution, and heavy domain assumptions until AURA-Sense proves it needs them.

