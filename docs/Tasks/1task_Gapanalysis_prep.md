Review the current AURA-Sense codebase and produce a technical brief of the implementation as it exists now.

Do not propose major changes yet.

Focus on:
- current Electron/main/renderer structure
- current IPC flow
- current data sources
- current cache/state ownership
- existing Threat Intel pipeline
- existing Passive Telemetry pipeline
- current UI modes/components
- existing network/ESI/zKill handling
- existing tests/verification scripts
- any partially implemented combat-log or combat telemetry systems
- places where implementation differs from the intended design scope

Output as a markdown technical brief with:
1. Current implemented architecture
2. Current data flow
3. Current state/cache ownership
4. Current UI/rendering model
5. Implemented systems
6. Partial/stubbed systems
7. Missing systems
8. Risks or architectural drift
9. Notes for later gap analysis

Do not refactor code during this pass.
Do not implement anything during this pass.
This is documentation and inspection only.

Current State → Intended End State → Gap → Priority → Implementation Notes