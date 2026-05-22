# Complete: Passive Telemetry Live Smoke Harness

Status: Complete With Live Run Deferred
Date: 2026-05-22

## Outcome

An explicit live Passive Telemetry API smoke command exists outside `verify:all`.

## Evidence

- `scripts/smoke-passive-live-api.js`
- `package.json`

## Refusal Verification

```txt
npm.cmd run smoke:passive-live-api
AURA-Sense passive live API smoke refused: F:\Projects\AURA-Sense\.tmp\passive-live-api-smoke\result.json
```

## Live Run

Live network smoke requires:

```powershell
$env:AURA_SENSE_LIVE_API='1'; npm.cmd run smoke:passive-live-api
```

That live run was not performed.
