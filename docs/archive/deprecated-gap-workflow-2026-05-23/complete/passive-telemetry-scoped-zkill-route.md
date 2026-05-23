# Complete: Passive Telemetry Scoped zKill Route

Status: Complete
Date: 2026-05-22

## Outcome

Passive zKill system context uses a bounded `pastSeconds` route and exposes lookback metadata.

## Evidence

- `src/passive/zKillSystemContextClient.js`
- `scripts/verify-passive-telemetry.js`

## Verification Signal

```txt
passive telemetry verified
```

## Route

```txt
/systemID/{systemId}/pastSeconds/{seconds}/
```

Default lookback is 3600 seconds.
