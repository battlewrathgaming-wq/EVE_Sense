# Gap To-Do: Integrated Viewport Layout Composition

Status: Open
Priority: P1
Milestone: 10 - Integrated Tactical Viewport

## Need

The current renderer proves lane surfaces exist, but the product needs a calm integrated viewport that an operator can scan under pressure.

## Actionables

- Refine the layout around one stable tactical hierarchy.
- Keep Combat Witness, Passive Telemetry, and Threat Intel visually distinct.
- Preserve explicit operator controls for watcher start/stop, Threat Intel scan, and Clipboard arm.
- Keep status text short and stateful.
- Verify narrow/mobile layout does not overlap or hide controls.

## Guardrails

- Do not make a landing page or decorative dashboard.
- Do not bury degraded state below cosmetic content.
- Do not add cards inside cards.
- Do not introduce new backend behavior as part of layout work unless required to present an existing snapshot safely.

## Completion Signal

- Integrated viewport renders the three lanes clearly.
- Text fits at expected desktop and narrow viewport sizes.
- `npm.cmd run smoke:electron` records passing visual evidence.

## Related Files

- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `scripts/electron-visual-smoke.ps1`
- `scripts/verify-renderer-shell.js`
