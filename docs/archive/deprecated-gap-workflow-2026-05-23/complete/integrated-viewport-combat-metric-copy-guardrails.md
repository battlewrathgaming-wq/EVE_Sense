# Gap To-Do: Integrated Viewport Combat Metric Copy Guardrails

Status: Complete
Priority: P1
Milestone: 10 - Integrated Tactical Viewport

## Need

Combat Witness now exposes richer metrics: weapon counts, observed sources/targets, HPS/DPS, repair balance, and spike outliers. The viewport must present only the portions that are operationally useful and sufficiently honest.

## Actionables

- Choose which Combat Witness metrics are ready for integrated HUD display.
- Prefer copy such as `Observed weapon`, `Most observed weapon`, `Incoming pressure`, `Repair throughput`, and `Observed repair balance`.
- Keep spike outliers low-emphasis until calibrated by `combat-metric-calibration-real-datasets.md`.
- Explain stale/empty windows without implying combat stopped.
- Add renderer-shell/smoke checks for any new displayed metric fields.

## Guardrails

- Do not say `stable`, `safe`, `breaking`, `tank holds`, or `kill risk`.
- Do not treat `shipLabel`, `sourceLabel`, or `targetLabel` as durable identity.
- Do not replace exact observed weapon labels with guessed normalized labels.
- Do not recompute Combat Witness metrics in renderer.

## Completion Signal

- Integrated copy uses observation language.
- Spike and repair balance limitations are preserved.
- Verification proves renderer consumes backend snapshot fields.

## Related Files

- `docs/gap/complete/combat-window-weapon-spike-followups.md`
- `docs/gap/to-do/combat-metric-calibration-real-datasets.md`
- `docs/schemas/hud-snapshot.md`
- `docs/schemas/combat-event.md`
- `src/combat/combatRollingWindow.js`
- `src/renderer/app.js`
