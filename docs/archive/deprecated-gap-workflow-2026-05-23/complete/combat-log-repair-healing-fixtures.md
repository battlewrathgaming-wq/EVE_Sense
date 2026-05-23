# Complete: Combat Log Repair And Healing Fixtures

Status: Complete With Deferral
Date: 2026-05-22

## Outcome

Repair/healing parser expansion remains explicitly deferred because no exact raw healing sample was added in this slice.

The curated set includes a rejected capacitor-insufficient notify line as a non-healing lookalike. This preserves the guardrail that repair cost, capacitor failure, and module denial text must not be classified as healing.

## Evidence

- `fixtures/combat-log-curated-source.jsonl`
- `fixtures/combat-log-event-coverage.json`
- `scripts/verify-combat-log-coverage.js`

## Verification Signal

```txt
combat log coverage verified: supported=5 rejected=2 deferred=1 unknown=0
```

## Deferred Parser Claim

Raw `combat.repair` parser support remains deferred until exact raw repair/healing samples exist with stable hashes.
