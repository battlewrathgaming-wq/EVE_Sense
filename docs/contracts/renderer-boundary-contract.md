# Contract: Renderer Boundary

Status: Seed
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

To be defined during current-state audit and IPC/service review.


