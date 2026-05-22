# Complete: Verification Harness

Status: Complete
Date: 2026-05-22

## Need

AURA-Sense needs one offline confidence command before heavier refactors.

The command must prove the current seed checks without requiring live API access or an Electron app launch.

## Completed Work

- Added `npm run verify:all`.
- Grouped the current offline seed verification scripts.
- Kept live/API smoke checks outside the grouped offline command.
- Preserved individual check output so failures remain attributable.

## Verification

```powershell
npm.cmd run verify:all
```

Observed output on 2026-05-22:

```txt
core utilities verified
services verified
HTTP client verified
Frame module verified
renderer shell verified
all checks verified
```

## Included Checks

- `verify:core`
- `verify:services`
- `verify:http`
- `verify:frame`
- `verify:renderer-shell`

## Exclusions

- Live API smoke checks remain excluded.
- Electron launch smoke remains excluded.
- Historical Aura 7 script names such as `verify:entity`, `verify:network`, `verify:rendering`, `verify:network-rendering`, `verify:passive-isolation`, and `verify:compact-hud` are not current AURA-Sense seed scripts.

## Related Documents

- `docs/current-state/current-implementation.md`
- `docs/current-state/seed-current-state.md`
- `docs/gap/to-do/performance-stability-compute-readiness.md`
