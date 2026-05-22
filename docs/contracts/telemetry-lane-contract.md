# Contract: Telemetry Lanes

Status: Seed
Date: 2026-05-22

## Purpose

Defines the separation between Passive Telemetry, Threat Intel, and Combat Witness.

## Lanes

### Passive Telemetry

Current system and low-frequency environmental awareness, triggered by local observation.

Examples:

- current system from EVE logs
- gate-jump/current-system changes
- scoped zKillmail system context
- freshness/cache state

### Threat Intel

Operator-initiated tactical inspection backed by a scoped zKillmail query in the first product surface.

Examples:

- search-bar target scan
- armed clipboard target scan
- system scan
- pilot/corp/alliance scan
- recent aggressors
- scoped timelines
- optional ESI expansion only if a future milestone authorizes it

### Combat Witness

Transient rolling combat-log telemetry.

Examples:

- observed incoming damage
- observed repair/sustain
- recent EWAR observations
- combat topology hints
- alpha spike events

## Invariants

- Passive telemetry must not overwrite Threat Intel.
- Combat Witness must not become persistent evidence storage.
- Threat Intel must not present zKillmail results as complete tactical truth.
- ESI expansion is deferred by default.
- Each lane should expose its own freshness/staleness state.

## Must Not Do

- Do not merge lane state into one ambiguous global threat object.
- Do not allow one lane's stale state to masquerade as another lane's current state.
- Do not let UI mode changes affect collection authority.

