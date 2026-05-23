# Complete: Passive Telemetry ESI System Activity

Status: Complete
Date: 2026-05-22

## Outcome

Passive Telemetry can fetch fixture-verified ESI aggregate system kills and jumps for a resolved current system.

## Evidence

- `src/passive/esiSystemActivityClient.js`
- `scripts/verify-passive-telemetry.js`

## Verification Signal

```txt
passive telemetry verified
```

## Cache Behavior

- one-hour cache record
- fresh cache reads locally
- expired cache revalidates with ETag where available
- no ESI killmail expansion
