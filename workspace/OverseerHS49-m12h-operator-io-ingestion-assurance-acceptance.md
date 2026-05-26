# OverseerHS49: M12H Operator I/O Ingestion Assurance Acceptance

Date: 2026-05-26
Role: AURA-Sense Overseer
Status: Accepted review; Dev hardening required before live/manual operator I/O smoke

## Files Reviewed

- `workspace/current.md`
- `workspace/SecEngHS48-m12-operator-io-ingestion-assurance-review.md`
- `src/main/main.js`
- `src/main/preload.js`
- `src/threat/clipboardAcquisitionService.js`
- `scripts/verify-threat-intel.js`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/testing/live-api-smoke-transition-readiness.md`

## Acceptance Decision

`workspace/SecEngHS48-m12-operator-io-ingestion-assurance-review.md` is accepted as M12 security/engineering review input.

The review confirms that the gamelog containment path, parser-to-event spine, Passive versus Active lane separation, live provider gates, and routine diagnostic privacy controls are broadly sound under offline inspection.

It also identifies one blocking hardening issue before any live/manual operator I/O smoke:

- The global `Control+\` shortcut path blocks before reading clipboard content when Threat I/O is off.
- The exposed `threat.clipboard.arm` and `threat.clipboard.capture` service commands currently call Clipboard Acquisition directly.
- Clipboard Acquisition can read clipboard content internally through `readClipboard()` when those commands are invoked without explicit text.
- Because those commands are reachable through preload, backend I/O authority is not enforced at the service-command boundary.

This is a real authority-boundary gap, not a product disagreement.

## Repo-Verified Trace

- `src/main/main.js:344` registers `threat.clipboard.arm` directly to `acquisition.arm(payload)`.
- `src/main/main.js:349` registers `threat.clipboard.capture` directly to `acquisition.capture(payload)`.
- `src/main/main.js:473` gates the global shortcut before `clipboard.readText()`, which is the desired pattern.
- `src/main/preload.js:93` and `src/main/preload.js:97` expose the arm/capture service commands to the renderer.
- `src/threat/clipboardAcquisitionService.js:26` can read clipboard content to establish a baseline during arm.
- `src/threat/clipboardAcquisitionService.js:48` can read clipboard content during capture.
- `scripts/verify-threat-intel.js:65` uses the default disabled live I/O gate and currently asserts the Passive blocked code in a Threat test, while production wiring uses a Threat-specific gate.

## Required Dev Direction

Open M12H as a narrow Dev hardening packet:

1. Enforce Threat I/O gate checks on all Clipboard Acquisition service-command paths before any clipboard read.
2. Preserve accepted global shortcut behavior: when I/O is on, `Control+\` may immediately capture the current valid clipboard target.
3. Preserve focused/windowed behavior: no-payload acquisition baselines, listens briefly, ignores unchanged pre-arm content, seals, and cools down.
4. Preserve fingerprint-only duplicate suppression.
5. Add deterministic verification that `threat.clipboard.arm` and `threat.clipboard.capture` do not call `readClipboard` while Threat I/O is off.
6. Align primary Threat blocked-code verification with production Threat gate behavior, or make the primary verifier explicitly lane-agnostic while keeping provider-fault verification as the lane-code oracle.
7. Add or clarify the redaction-safe operator I/O smoke artifact shape before any future live/manual operator smoke.

## Guardrails

- Do not run live/manual smoke.
- Do not set `AURA_SENSE_LIVE_API=1`.
- Do not read private EVE gamelog folders.
- Do not read real clipboard content.
- Do not run manual shortcut validation.
- Do not add product features, display/adaptor work, Lab work, or Atlas semantics.
- Do not change bridge names, IPC names, payload names, persistence, schemas, or lane ownership unless strictly required to enforce the gate.

## Acceptance Criteria For M12H

M12H is complete when:

- Clipboard service-command arm/capture paths return a blocked Clipboard Acquisition snapshot, or equivalent existing blocked shape, while Threat I/O is off.
- The blocked service-command paths prove they do not call the clipboard read function.
- Global shortcut I/O-off behavior remains no-read.
- Global shortcut I/O-on immediate capture remains supported.
- Focused/windowed acquisition semantics remain supported.
- Duplicate suppression remains fingerprint-only and bounded.
- Threat blocked-code verification no longer implies Passive gate ownership in the primary Threat verifier.
- Future operator I/O smoke has a redaction-safe artifact shape that avoids raw private paths, raw gamelog lines, raw clipboard targets, screenshots, renderer output, and raw provider bodies unless a future packet explicitly authorizes them.
- Offline verification passes.

Required verification:

```powershell
npm.cmd run verify:threat-intel
npm.cmd run verify:clipboard-race
npm.cmd run verify:operator-io-gates
npm.cmd run verify:provider-faults
npm.cmd run verify:all
```

## Resting Decision

Do not proceed to live/manual operator I/O smoke until M12H is accepted.

No code was changed by this Overseer acceptance.
