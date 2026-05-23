# Gap To-Do: Provider Request Pulse UI

Status: Complete
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

## Completion Evidence

- The compact glance strip now displays lane-specific provider pulse chips:
  - `passive-provider-pulse`
  - `threat-provider-pulse`
- Diagnostics now expose supporting detail without raw provider payloads:
  - `passive-pulse-detail`
  - `threat-pulse-detail`
- Passive pulse state is derived from Passive Telemetry snapshot status, freshness, zKill partial/capped metadata, ESI cache metadata, and failure/message fields.
- Threat pulse state is derived from Threat Intel snapshot status, zKill capped/partial metadata, and failure/message fields.
- Renderer boundary remains presentation-only; no provider calls or raw diagnostics streams were added.
- Electron smoke records `hasProviderPulse: true` and captures Passive/Threat pulse text in `visual-smoke-result.json`.

## Verification Signal

Completed:

```powershell
npm.cmd run verify:renderer-shell
npm.cmd run verify:renderer-boundary
npm.cmd run verify:all
npm.cmd run smoke:electron
```

Smoke artifact:

```txt
.tmp\electron-visual-smoke\visual-smoke-result.json
```

## Deferred Risks

- Provider fault injection remains open and should harden timeout, 429, 500, malformed JSON, non-array, stale cache, ETag failure, and partial refs.
- The pulse is a compact status indicator, not a complete provider timeline.
- Threat Intel currently has no cache/stale provider state equivalent to Passive Telemetry; those labels are shown only where snapshot metadata supports them.
- Pixel-perfect visual comparison remains outside the current smoke harness.

## Related Files

- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/renderer/styles.css`
- `src/main/main.js`
- `scripts/verify-renderer-shell.js`
- `docs/gap/to-do/live-io-provider-fault-injection.md`
