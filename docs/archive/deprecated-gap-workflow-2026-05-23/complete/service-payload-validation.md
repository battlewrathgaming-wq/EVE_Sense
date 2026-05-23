# Complete: Service Payload Validation

Status: Complete
Date: 2026-05-22

## Need

Service commands need a standard payload validation hook so future projects do not invent inconsistent validation behavior at each boundary.

## Completed Work

- Added optional `validate(payload, context)` support to service command definitions.
- Validation now runs before task wrapping or handler execution.
- Validation failures produce `VALIDATION_FAILED` errors with taxonomy-shaped diagnostics.
- Added validation to `util.checksum`.
- Added verification for rejected invalid payloads.

## Verification

```powershell
npm run verify:services
npm run verify:all
```

## Related Files

- `src/services/serviceRegistry.js`
- `src/services/messageTaxonomy.js`
- `scripts/verify-services.js`
- `docs/contracts/service-command-contract.md`
