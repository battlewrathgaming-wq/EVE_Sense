# Gap To-Do: Local Metadata Consumer Hardening

Status: Complete
Priority: P2
Milestone: 12 - Live Validation And Tactical Calibration

## Need

Local metadata should be added only where active consumers need readable labels.

## Actionables

- Identify concrete consumers for type/system labels.
- Add compact static lookup data only for those consumers.
- Keep unresolved IDs visible.
- Verify lookup failure does not remove raw observed evidence.

## Guardrails

- Do not parse large SDE archives at runtime.
- Do not call live ESI for static labels during normal reporting.
- Do not hide unresolved IDs.
- Do not import Atlas-scale metadata.

## Completion Signal

- Active consumers use local labels where available.
- Unknown IDs remain visible.
- `npm.cmd run verify:all` passes.
