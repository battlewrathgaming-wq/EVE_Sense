# Audit: Renderer Boundary Adversarial Handover

Date: 2026-05-23
Owner: Dev execution under Overseer doctrine
Status: Complete for Milestone 13 P0 renderer/preload adversarial slice

## Scope

Added adversarial verification for the renderer/preload boundary and narrowed the preload service bridge.

This slice did not add product features, provider logic in renderer, live calls, Electron smoke requirements, persistence, or broader service ownership in preload.

## Work Product

- Added `scripts/verify-renderer-boundary-adversarial.js`.
- Added `npm.cmd run verify:renderer-boundary-adversarial`.
- Included the command in `npm.cmd run verify:all`.
- Added preload-side allowlist enforcement for `window.aura.invokeService`.
- Changed `window.aura.listServices` to return renderer-allowed command names rather than the full backend registry.
- Updated renderer boundary contract, testing matrix, current-state, and Milestone 13 docs.
- Moved the renderer/preload adversarial task packet to `docs/gap/complete/`.

## Security Notes

The generic service bridge is now bounded to the exact renderer-facing commands used by the HUD:

- `seed.readiness`
- `runtime.settings.snapshot`
- `runtime.live-io.snapshot`
- `runtime.live-io.set-enabled`
- `runtime.diagnostics.snapshot`
- `combat.witness.status`
- `combat.witness.start`
- `combat.witness.stop`

Threat Intel and snapshot lanes remain exposed through their specific preload bridges rather than the generic renderer service bridge.

## Verification Signals

Commands run:

```powershell
npm.cmd run verify:renderer-boundary-adversarial
npm.cmd run verify:renderer-boundary
npm.cmd run verify:renderer-shell
npm.cmd run verify:all
git diff --check
```

Results:

```txt
renderer boundary adversarial checks verified
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
```

## Known Risks

- Static adversarial checks are representative, not a substitute for runtime exploit testing.
- The renderer still presents backend-owned metric field names; checks intentionally allow presentation of backend snapshots while blocking renderer-owned computation.
- HTTP endpoint hardening remains open and should follow this security slice.

## Deferred Work

Proceed next with:

- `docs/gap/to-do/http-endpoint-client-hardening.md`
- `docs/gap/to-do/live-io-provider-fault-injection.md`
- `docs/gap/to-do/gamelog-watcher-chaos-tests.md`
