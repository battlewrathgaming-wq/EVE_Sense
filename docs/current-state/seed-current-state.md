# Current State: AURA-Sense Seed Origin

Status: Historical seed snapshot
Date: 2026-05-22

Current implementation truth lives in `docs/current-state/current-implementation.md`. This file records the initial seed posture so future sessions do not confuse inherited rigging with current product behavior.

## Summary

AURA-Sense began from reusable seed rigging and now owns its tactical viewport doctrine directly.

The repository has reusable development rigging and product documentation, but it should not claim behavior until the corresponding services and verification exist in AURA-Sense.

## Included From Seed Rigging

- Fixture-first core verification
- Generic command registry
- Generic task lifecycle and lock classes
- Generic taxonomy shape
- Generic checksum, JSONL, and temp-path utilities
- HTTP client wrapper with timeout, cancellation, retry, injected fetch, and request logging hooks
- Minimal Electron main/preload/renderer boundary
- Renderer boundary static verification for known presentation-only guardrails
- Frame module notes for borderless and always-on-top Electron windows

## AURA-Sense Scope

AURA-Sense should rebuild these product capabilities:

- frameless, always-on-top tactical HUD shell
- Passive Telemetry lane for current system and low-frequency environmental awareness
- Threat Intel lane for scoped system, pilot, corporation, and alliance scans
- Combat Witness lane for transient rolling combat-log telemetry
- network gate, diagnostics, request coalescing, and cache-aware external clients
- local-first static metadata where practical
- renderer snapshots and events rather than renderer-owned telemetry computation
- uncertainty-aware HUD language

## Not Proven At Initial Seed Time

- live EVE log watcher behavior
- zKill discovery to ESI killmail expansion pipeline
- local EVE system catalog integration
- Combat Witness rolling cache and window metrics
- AURA-Sense-specific IPC payload validation
- sample/evidence/cap language for active scans
- live API smoke checks

## Explicitly Not Inherited As Core

- Atlas persistent evidence storage
- Atlas watch executor
- full SQLite schema
- SDE-heavy ID resolution as seed doctrine
- historical intelligence retention model
- full implementation assumptions that only matched the old runtime

## Current Rule

AURA-Sense may reuse small utilities from seed rigging. Product behavior must be expressed as AURA-Sense contracts, schemas, features, gaps, and verified implementation.
