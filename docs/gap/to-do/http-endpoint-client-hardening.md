# Gap To-Do: HTTP Endpoint And Client Hardening

Status: Open
Priority: P2
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

Sense has a comparatively strong HTTP posture for tactical provider calls: renderer access stays behind service IPC, live IO defaults blocked, zKill lookback/sample inputs are bounded, invalid JSON is treated as a non-retryable provider failure, and runtime settings reject malformed operator values.

The remaining hardening gap is around endpoint inventory and non-provider download paths, especially SDE/source-bundle refresh behavior. Those paths should have the same operational guarantees as the tactical clients before they become routine operator controls.

## Actionables

- Inventory all outbound HTTP-capable paths and classify them as tactical provider, metadata refresh, diagnostics, or future persistence/export.
- Keep the existing tactical HTTP client behavior intact: timeout, cancellation, compact diagnostics, non-retryable malformed JSON, and no renderer direct fetch.
- Add explicit endpoint allowlists for SDE/source-bundle downloads when the caller supplies or overrides URLs.
- Add protocol and redirect validation for metadata downloads.
- Add byte ceilings for metadata text and ZIP responses before buffering them fully in memory.
- Add content-type or magic/header checks where practical before accepting downloaded source bundles.
- Ensure metadata download behavior is live-gated or operator-explicit if it becomes reachable from service IPC or UI.
- Ensure provider diagnostics redact or avoid local filesystem paths and cache locations unless explicitly exporting a support trace.
- Add offline fixture tests for denied hosts, denied protocols, oversized metadata, oversized archives, redirect-to-denied-host, timeout, cancellation, and malformed response bodies.

## Guardrails

- Do not move provider logic into the renderer.
- Do not expose raw IPC or direct network primitives to the renderer.
- Do not run real provider calls or SDE downloads inside `verify:all`.
- Do not remove ETag/cache behavior or passive/active separation.
- Do not make metadata refresh a hidden side effect of tactical scans.
- Do not parse large SDE archives at runtime as part of HUD operation.

## Related Files

- `src/services/httpClient.js`
- `src/passive/liveIoGate.js`
- `src/passive/zKillSystemContextClient.js`
- `src/threat/threatIntelService.js`
- `src/services/ipcPayloadValidation.js`
- `src/util/sdeSourceBundle.js`
- `scripts/verify-http-client.js`
- `scripts/verify-passive-telemetry.js`

## Completion Signal

- A maintained endpoint inventory identifies every outbound-capable path and its live-gate/operator-confirmation rule.
- SDE/source-bundle downloads enforce allowed protocol, allowed host, redirect policy, timeout, cancellation, and byte limits.
- Malformed or oversized metadata cannot poison local metadata caches.
- Tactical provider fault tests still prove blocked live IO, malformed JSON, timeout, cancellation, ETag reuse, and cache behavior.
- `npm.cmd run verify:all` passes without live network access.
