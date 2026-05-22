# Gap To-Do: Repair Healing Raw Fixture Intake

Status: Open
Priority: P1
Milestone: 12 - Live Validation And Tactical Calibration

## Need

Raw repair/healing parser support must stay deferred until exact EVE log samples prove the parser shape.

## Actionables

- Add exact raw repair/healing fixture rows when available.
- Preserve exact raw hashes without trimming.
- Add accepted and rejected lookalike examples.
- Expand parser support only after fixture evidence exists.
- Keep synthetic normalized repair replay clearly separate from raw parser support.

## Guardrails

- Do not claim raw HPS support without exact accepted fixtures.
- Do not store broad private logs.
- Do not infer repair type without evidence.

## Completion Signal

- Raw repair support is either implemented from exact fixtures or explicitly remains deferred.
- Coverage matrix reflects the truth.
- `npm.cmd run verify:all` passes.
