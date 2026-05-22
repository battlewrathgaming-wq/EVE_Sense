# Failure Record: Electron Capture Transient Viz Error

Date: 2026-05-22
Status: Recorded

## Symptom

During Milestone 10 and 11 visual smoke runs, Electron capture can occasionally fail with:

```txt
UnknownVizError
```

The follow-up run passed without code changes.

## Impact

The failure blocks `npm.cmd run smoke:electron` for that run but does not indicate renderer boundary failure when the structured checks and a rerun pass.

## Handling

- Keep `smoke:electron` separate from `verify:all`.
- Preserve structured failure artifacts in `.tmp\electron-visual-smoke`.
- Rerun once before changing product code when diagnostics show only `UnknownVizError`.
- Do not weaken visual smoke assertions to hide this class.

## Open Risk

If this becomes frequent, add a bounded capture retry inside the smoke harness and document the retry count in the smoke result.
