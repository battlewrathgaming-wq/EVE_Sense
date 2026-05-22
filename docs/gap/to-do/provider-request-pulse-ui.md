# Gap To-Do: Provider Request Pulse UI

Status: Open
Priority: P1
Milestone: 12 - Live Validation And Tactical Calibration

## Need

Passive Telemetry and Threat Intel have scoped provider clients and compact provider basis labels, but live validation may need a clearer operator-facing request pulse.

## Actionables

- Present recent provider attempt state from backend-owned diagnostics or snapshot metadata.
- Cover blocked, pending, cached, succeeded, failed, capped, partial, and stale states where available.
- Keep the display compact and lane-specific.
- Avoid raw diagnostics streams.
- Add verification and Electron smoke checks if the renderer changes.

## Guardrails

- Do not call APIs from renderer.
- Do not show raw provider payloads in the HUD.
- Do not make provider pulse look like complete intelligence.
- Do not add broad polling or noisy retries.

## Completion Signal

- The operator can distinguish provider blocked, cached, succeeded, failed, partial, and stale states without opening console logs.
- Renderer boundary verification passes.
- `npm.cmd run verify:all` passes.
