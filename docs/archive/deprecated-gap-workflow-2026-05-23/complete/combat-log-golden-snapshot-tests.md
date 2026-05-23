# Complete: Combat Log Golden Snapshot Tests

Status: Complete
Date: 2026-05-22

## Outcome

The curated replay dataset now has deterministic 5s, 15s, and 30s Combat Witness golden snapshot assertions.

The 15 second golden window now proves mixed incoming damage, outgoing damage, hit-quality aggregation, damage-type aggregation where present, observed weapon aggregation, incoming source counts, damage spike outliers with observed ship labels, normalized repair/HPS, and observed repair balance.

## Evidence

- `fixtures/combat-log-replay-dataset.json`
- `scripts/verify-combat-golden-snapshots.js`
- `npm.cmd run verify:combat-golden`

## Verification Signal

```txt
combat golden snapshots verified: windows=5s,15s,30s
```

## Guardrails Preserved

- Golden tests do not depend on wall-clock time.
- Renderer layout and styling are not involved.
- Snapshot math does not infer unseen combat state.
- Raw repair parser support remains deferred until exact raw repair/healing lines are available.
