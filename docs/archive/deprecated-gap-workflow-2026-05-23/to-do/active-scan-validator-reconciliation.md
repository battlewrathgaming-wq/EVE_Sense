# Gap To-Do: Active Scan Validator Reconciliation

Status: Open
Priority: P3
Milestone: Documentation And Legacy Surface Cleanup

## Need

Earlier seed-stage docs and service verification mention a reusable active scan validator. AURA-Sense now has a real Threat Intel scan contract, so the older generic active-scan language should be retired or explicitly reconciled.

## Actionables

- Review `validateActiveScanPayload` usage and docs references.
- Decide whether the validator is obsolete, should be renamed, or should remain as a generic helper below product surface.
- Update current-state and docs to avoid implying a missing separate active scan product lane.
- Preserve tests if the helper is still useful.

## Guardrails

- Do not create a second scan lane.
- Do not bypass the Threat Intel scan contract.
- Do not remove validation coverage without replacing it where needed.

## Completion Signal

- Current docs no longer list "active scan service" as an ambiguous missing product feature.
- Any remaining helper has a clear owner and purpose.
- `npm.cmd run verify:all` passes.
