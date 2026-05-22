# AURA-Sense

AURA-Sense is an EVE Online tactical viewport for real-time situational awareness.

It is responsible for:

- tactical overlay first
- transient telemetry by default
- renderer as presentation, not telemetry authority
- separate Passive Telemetry, Threat Intel, and Combat Witness lanes
- scoped, evidence-backed external calls
- low cognitive load HUD behavior
- explicit uncertainty language

AURA-Sense carries forward selected tactical doctrine from earlier Aura 7 work, but this repository's current-state docs and verified runtime are authoritative. Historical Aura 7 notes are lineage, not proof of current behavior.

The implementation originated from reusable Aura Core seed rigging. That seed is infrastructure, not product identity. AURA-Sense should observe what is happening now, present it clearly, and avoid becoming Atlas.

AURA Atlas remains the persistent evidence map. AURA-Sense may hand off or reference Atlas later, but should not grow Atlas-style retention, watch execution, or historical intelligence storage as core behavior.

## Verification

```powershell
npm run verify:all
```

## App Shell

```powershell
npm start
```

## Rewrite Rule

Build the tactical viewport from current AURA-Sense contracts, verified runtime behavior, and proven lineage only where it preserves the tactical goal. Do not copy implementation weight unless the AURA-Sense domain and runtime have earned it.
