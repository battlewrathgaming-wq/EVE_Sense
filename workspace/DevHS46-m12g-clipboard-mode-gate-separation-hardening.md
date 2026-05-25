# DevHS46: M12G Clipboard Mode And Gate Separation Hardening

Status: Complete
Date: 2026-05-25
Role: AURA-Sense Dev

## Request Answered

Answered M12G: align Clipboard Acquisition docs/tests with the intended two-mode behavior, add gate-separation verification, preserve `Ctrl+\` as the explicit keyboard-first permission action, and avoid any live/manual/private I/O.

Human clarification preserved:

- I/O is the absolute manual authority gate.
- `Ctrl+\` is an uncommon explicit permission action by design.
- Global shortcut immediate capture is intended.
- The focused/windowed path still uses a short visible listening window.
- The flow must stay hands-free around the primary game and should not depend on mouse clicks.

## Files Reviewed

- `workspace/current.md`
- `workspace/SecEngHS44-m12f-operator-io-readiness-gate-separation-review.md`
- `workspace/OverseerHS45-m12f-operator-io-readiness-review-acceptance.md`
- `src/threat/clipboardAcquisitionService.js`
- `src/threat/threatIntelService.js`
- `src/main/main.js`
- `src/passive/passiveTelemetryService.js`
- `src/combat/combatWitnessRuntime.js`
- `scripts/verify-clipboard-acquisition-race.js`
- `scripts/verify-threat-intel.js`
- `scripts/verify-passive-telemetry.js`
- `scripts/verify-all.js`
- `package.json`
- `docs/features/clipboard-acquisition.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/current-state/current-implementation.md`

## Files Changed

- `src/threat/clipboardAcquisitionService.js`
- `src/threat/threatIntelService.js`
- `scripts/verify-clipboard-acquisition-race.js`
- `scripts/verify-threat-intel.js`
- `scripts/verify-operator-io-gate-separation.js`
- `scripts/verify-all.js`
- `package.json`
- `docs/features/clipboard-acquisition.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/current-state/current-implementation.md`
- `workspace/current.md`
- `workspace/DevHS46-m12g-clipboard-mode-gate-separation-hardening.md`

## Clipboard Acquisition Modes

Two intended modes are now explicit:

1. Global shortcut immediate capture:
   - `Ctrl+\` is the permission action.
   - When I/O authority is on, the current clipboard can be consumed immediately if it is a valid target.
   - The action seals into cooldown.
   - When I/O authority is off, the main-process shortcut path still blocks before reading clipboard content.

2. Focused/windowed acquisition:
   - Arming without a provided payload establishes a baseline.
   - Unchanged pre-arm clipboard content is ignored.
   - Changed valid clipboard content during the 3 second window can be captured.
   - Timeout/capture/rejection/failure seal into cooldown.

## Rolling Cache Decision

Implemented a small in-memory recent capture cache:

- window: 10 seconds
- max entries: 5
- stored value: SHA-256 fingerprint of normalized target text plus timestamp
- purpose: duplicate suppression/throttle only
- not a hidden clipboard history
- not durable
- not a Passive gate
- not a display/fixture source

Recent duplicate captures seal with reason `duplicate`, do not re-run scan, and do not expose raw target text in `lastCapture`.

## Gate Separation Verification

Added `scripts/verify-operator-io-gate-separation.js` and `npm.cmd run verify:operator-io-gates`.

The verifier proves:

- parser/runtime `navigation.jump` fanout can update Passive current-system context
- parser/runtime `navigation.jump` does not invoke Threat scan
- Clipboard Acquisition/global shortcut scan does not refresh or initialize Passive current-system observation
- Passive can still open from a later parser-observed jump after a Threat scan

`verify:operator-io-gates` is included in `verify:all`.

## Redaction And Artifact Documentation

Updated:

- `docs/features/clipboard-acquisition.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/current-state/current-implementation.md`

The docs now state:

- I/O authority must be enabled before clipboard/live-provider I/O can run.
- `Control+\` is the explicit keyboard-first permission action.
- Sense should not require clicking the window during fullscreen EVE use.
- The rolling cache stores fingerprints only, not raw clipboard history.
- Future operator smoke artifacts must not store raw private gamelog lines, raw clipboard targets, or full private local paths unless explicitly approved.

## Threat Target Length Decision

Implemented a direct Threat Intel target-text length limit:

- `MAX_THREAT_TARGET_TEXT_LENGTH = 256`
- overlong target text normalizes to `status: invalid`
- covered in `verify:threat-intel`

## Verification

Run without `AURA_SENSE_LIVE_API=1`, without live/manual operator folders, and without real clipboard capture:

```powershell
npm.cmd run verify:clipboard-race
npm.cmd run verify:threat-intel
npm.cmd run verify:operator-io-gates
npm.cmd run verify:all
```

Results:

- `verify:clipboard-race`: passed; clipboard acquisition race verified.
- `verify:threat-intel`: passed; threat intel verified.
- `verify:operator-io-gates`: passed; operator IO gate separation verified.
- `verify:all`: passed; all checks verified.

## Boundary Confirmation

- Did not set `AURA_SENSE_LIVE_API=1`.
- Did not run Passive or Threat live API smoke.
- Did not run live EVE gamelog ingestion.
- Did not inspect private/operator EVE log folders.
- Did not read real clipboard content.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not change IPC channels, bridge names, payload schemas, persistence, renderer display convergence, Lab/adapter behavior, or lane meanings.
- Did not require a mouse/search-button workflow.

## Residual Risk

The global shortcut path is verified through service-level semantics and gate-separation seams, not by manual Electron global shortcut validation. Manual shortcut feel and OS-level accelerator behavior remain gated for a future operator/manual packet.

The rolling cache suppresses exact normalized duplicate targets for 10 seconds. If the operator intentionally wants to rescan the same target inside that window, the current behavior will skip the duplicate. That is an accepted throttle/convenience tradeoff for M12G, but it should be watched during operator smoke.

## Recommended Next M12 Move

Overseer should review M12G and decide whether the project is ready to open a future live/manual operator I/O smoke packet, still with explicit Human authorization and redacted artifacts.
