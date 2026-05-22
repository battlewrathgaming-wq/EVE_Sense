# Contract: Renderer Boundary

Status: Active Foundation
Date: 2026-05-22

## Purpose

Defines what the Electron renderer may and may not own.

## Boundary

The renderer owns presentation, user interaction, and visual state.

Backend/main-process services own ingestion, normalization, caching, computation, and live API orchestration.

## Inputs

- backend snapshots
- backend event streams
- user commands
- display settings

## Outputs

- rendered HUD state
- user-triggered requests to backend services

## Invariants

- Renderer must not parse EVE logs directly.
- Renderer must not call zKill or ESI directly.
- Renderer must not own authoritative telemetry history.
- Renderer must not create evidence or mutate tactical facts.
- Renderer may filter, present, collapse, expand, or visually prioritize backend-owned state.

## Must Not Do

- Do not make API calls from render cycles.
- Do not derive combat truth from component state.
- Do not duplicate long-lived telemetry caches in renderer component state.
- Do not let animation timing become tactical logic.

## Verification

Current static check:

```powershell
npm run verify:renderer-boundary
```

This check scans `src/renderer` and `src/main/preload.js` for direct network calls, filesystem/log access, main-process imports from renderer files, and combat parser ownership signals.

Adversarial boundary check:

```powershell
npm run verify:renderer-boundary-adversarial
```

This check verifies hostile renderer/preload patterns are caught, the preload service bridge uses an explicit renderer command allowlist, full backend service inventory is not exposed through `listServices`, and snapshot subscriptions remove listeners and notify backend unsubscribe channels.

The check is also included in:

```powershell
npm run verify:all
```

