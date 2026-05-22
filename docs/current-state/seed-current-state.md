# Current State: AURA-Sense Seed Lineage

Status: Historical seed snapshot
Date: 2026-05-22

Current implementation truth lives in `docs/current-state/current-implementation.md`. This file records the initial seed posture and lineage boundary so future sessions do not confuse inherited rigging with current product behavior.

## Summary

AURA-Sense began from reusable seed rigging and selected tactical viewport doctrine preserved in earlier Aura 7 documents.

The repository has reusable development rigging and imported/historical Aura 7 documentation, but it should not claim behavior from lineage documents until the corresponding services and verification exist in AURA-Sense.

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

## Scope Carried Forward From Lineage

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

AURA-Sense may reuse lineage doctrine, contracts, schemas, and small utilities. It should adapt implementation details only after the AURA-Sense runtime boundary is clear and current verification supports the behavior.
