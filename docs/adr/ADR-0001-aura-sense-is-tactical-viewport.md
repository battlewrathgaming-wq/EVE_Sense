# ADR-0001: AURA-Sense Is The Tactical Viewport

Status: Accepted
Date: 2026-05-22

## Context

AURA-Sense and AURA Atlas share EVE data interests but serve different jobs.

Without an explicit boundary, AURA-Sense could drift into persistent intelligence storage and investigative reporting.

## Decision

AURA-Sense is the tactical viewport. AURA Atlas is the persistent evidence map.

AURA-Sense should prioritize short-window, bounded, operationally useful telemetry and scoped tactical inspection.

## Consequences

AURA-Sense should avoid permanent combat archives, broad historical analysis, and long-term intelligence scoring.

Persistent historical memory should be handled by Atlas or an explicit handoff.

## Related Documents

- `docs/tenets/tenets.md`
- `docs/adr/ADR-0002-aura-sense-tactical-scope.md`
- `docs/features/vision.md`
