# AURA-Sense

AURA-Sense is the Aura 7 rewrite track for an EVE Online tactical viewport.

It inherits Aura 7's scope and discipline:

- tactical overlay first
- transient telemetry by default
- renderer as presentation, not telemetry authority
- separate Passive Telemetry, Threat Intel, and Combat Witness lanes
- scoped, evidence-backed external calls
- low cognitive load HUD behavior
- explicit uncertainty language

AURA-Sense starts from the reusable Aura Core seed, but its product scope is Aura 7: observe what is happening now, present it clearly, and avoid becoming Atlas.

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

Rebuild the tactical viewport from proven rigging. Do not copy implementation weight unless the new AURA-Sense domain and runtime have earned it.
