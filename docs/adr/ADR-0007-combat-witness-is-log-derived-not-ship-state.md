# ADR-0007 - Combat Witness Is Log-Derived, Not Ship State

Date: 2026-05-27
Status: Accepted

## Context

Combat Witness reads local EVE combat-log events and computes short-window values from the ingested events.

Human product direction clarifies that Combat Witness should help the player infer useful meaning from observed combat data, but Sense must not explain what those values mean for the player's ship, health, fit, survival, or correct tactic.

The interface can be rich and interesting. The claims should remain factual and boring.

## Decision

Combat Witness is a log-derived inference aid, not a ship-state instrument panel.

It displays observed combat values and computations from ingested events. The player infers tactical meaning.

The core boundary is:

```txt
ingested combat-log observations
-> factual computed values
-> player inference
```

not:

```txt
complete ship state
-> app-owned tactical meaning
-> player instruction
```

## Allowed Presentation

Combat Witness may display factual labels and values such as:

- `Incoming DPS`
- `Repair HPS`
- `Observed balance`
- `Observed source`
- `Observed weapon`
- `Hit quality`
- `Peak damage`
- observed event counts and windows
- direction-specific outgoing values when supported

Descriptions should explain the computation, not the tactical consequence.

Examples:

```txt
Observed balance = logged repair HPS minus logged incoming DPS.
Peak damage = largest observed damage amount in the current window.
Hit quality = combat-log hit quality label and observed amount.
```

## Presentation Tone

Use honest, factual language.

Avoid tacti-cool labels and tactical advice. Sense can be visually interesting through layout, emphasis, motion, rhythm, and contrast, but wording should avoid overclaiming.

Prefer:

- `Observed`
- `Logged`
- `Current window`
- `Peak damage`
- `Hit quality`
- `Observed balance`

Avoid:

- `safe`
- `dying`
- `critical threat`
- `tank broken`
- `repair deficit` as a survival claim
- `poor application` unless the metric is explicitly defined and accepted
- commands such as `get closer`, `switch tactic`, or `change target`

## Non-Goals

- Do not make Combat Witness a full ship-system readout.
- Do not infer player health, survival time, tank state, fitting truth, enemy identity, or correct tactic.
- Do not claim complete combat awareness.
- Do not treat observed source or weapon labels as durable identities.
- Do not promote uncalibrated spike/outlier computations into strong product claims.
- Do not turn this ADR into implementation authorization.

## Review Rule

For future Combat Witness metrics, labels, UI work, adapter work, or Lab presentation review, ask:

```txt
Is this value directly observed or computed from ingested combat-log events?
Does the label describe the observation/computation rather than tactical meaning?
Would a player understand this as a fact from logs, not ship truth?
Does the presentation leave inference to the player?
```

If not, narrow the label, demote the display, move it to diagnostics, or park the metric until the computation is better defined.

## Related

- `docs/current-state/combat-metrics.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/adr/ADR-0002-aura-sense-tactical-scope.md`
- `docs/adr/ADR-0004-sense-instrument-effect-presentation-boundary.md`
- `docs/adr/ADR-0006-sense-is-gameplay-companion.md`
- `docs/features/vision.md`
