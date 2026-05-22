# Gap To-Do: Threat Intel Renderer Boundary Verification

Status: Open
Priority: P1
Milestone: 09 - Scoped Threat Intel And Clipboard Acquisition

## Need

Threat Intel and Clipboard Acquisition add new renderer surfaces and input flows. Verification must prove the renderer remains presentation-only and that input intent rules are enforced.

## Actionables

- Extend renderer boundary checks for Threat Intel and Clipboard Acquisition files.
- Verify renderer does not call zKill, ESI, `fetch`, filesystem, parser, watcher, or backend runtime modules directly.
- Verify search focus alone does not dispatch a scan.
- Verify explicit search submit can invoke the preload/service bridge.
- Verify clipboard acquisition lifecycle states and cooldown behavior.
- Verify live-disabled state blocks request execution.
- Run Electron smoke if renderer-visible behavior changes.

## Guardrails

- Do not weaken renderer boundary rules to make UI testing easier.
- Do not use live network in offline verification.
- Do not turn diagnostics into a renderer log dump.

## Completion Signal

- Renderer boundary checks cover the new Threat Intel and Clipboard Acquisition surfaces.
- Search/clipboard lifecycle verification is deterministic and offline.
- `npm.cmd run verify:all` passes.
- `npm.cmd run smoke:electron` passes if renderer-visible behavior changed.

## Related Files

- `docs/contracts/renderer-boundary-contract.md`
- `scripts/verify-renderer-boundary.js`
- `scripts/verify-renderer-shell.js`
- `src/renderer/`
- `src/main/preload.js`

