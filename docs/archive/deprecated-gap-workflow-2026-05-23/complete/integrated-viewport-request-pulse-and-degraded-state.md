# Gap To-Do: Integrated Viewport Request Pulse And Degraded State

Status: Complete
Priority: P1
Milestone: 10 - Integrated Tactical Viewport

## Need

External and runtime state must be visible enough to trust, but quiet enough to preserve cognition. The integrated viewport needs a compact way to show live IO blocked/attempted/failed/capped states without turning into a log console.

## Actionables

- Review existing Passive Telemetry and Threat Intel snapshot metadata for request/degraded-state presentation.
- Add compact blocked, stale, partial, capped, unavailable, and failed labels where missing.
- Add provider/request pulse presentation only from backend-owned diagnostics or snapshot fields.
- Keep live network smoke opt-in and recorded separately.
- Verify live-disabled scans do not look like empty intelligence.

## Guardrails

- Do not call APIs from renderer.
- Do not stream raw diagnostics into the HUD.
- Do not hide blocked live IO behind neutral idle copy.
- Do not add broad retries or polling.

## Completion Signal

- The operator can distinguish no data, blocked IO, partial provider data, stale data, and failed provider calls.
- Renderer boundary verification still passes.
- `npm.cmd run verify:all` passes.

## Related Files

- `docs/features/vision.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `src/passive/passiveTelemetryService.js`
- `src/threat/threatIntelService.js`
- `src/renderer/app.js`
