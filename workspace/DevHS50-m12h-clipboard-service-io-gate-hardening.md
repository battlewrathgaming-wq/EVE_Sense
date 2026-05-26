# DevHS50 - M12H Clipboard Service I/O Gate Hardening

Date: 2026-05-26
Role: Dev
Source packet: `workspace/current.md`
Accepted inputs:

- `workspace/SecEngHS48-m12-operator-io-ingestion-assurance-review.md`
- `workspace/OverseerHS49-m12h-operator-io-ingestion-assurance-acceptance.md`

## Summary

Closed the pre-live Clipboard Acquisition service-command gap. Renderer-reachable `threat.clipboard.arm` and `threat.clipboard.capture` now check the production Threat live I/O status before calling Clipboard Acquisition, so those commands cannot reach `readClipboard()` while Threat I/O is off.

No live/manual smoke was run. No real clipboard, private EVE folder, live provider, renderer output, Lab/adaptor output, fixture intake, calibration data, or raw provider body was read or stored.

## Files Changed

- `src/threat/clipboardAcquisitionGate.js`
- `src/main/main.js`
- `scripts/verify-operator-io-gate-separation.js`
- `scripts/verify-threat-intel.js`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `workspace/current.md`
- `workspace/DevHS50-m12h-clipboard-service-io-gate-hardening.md`

Unrelated pre-existing workspace edits observed and left untouched:

- `workspace/README.md`
- `workspace/critical/README.md`
- `workspace/overseer.md`

## Service-Command Gate Trace

Preload path remains:

```txt
window.auraThreatIntel.armClipboard()
  -> ipcRenderer.invoke('aura:service:invoke', command: 'threat.clipboard.arm')

window.auraThreatIntel.captureClipboard()
  -> ipcRenderer.invoke('aura:service:invoke', command: 'threat.clipboard.capture')
```

Main-process command path now gates before Clipboard Acquisition:

```txt
registerThreatIntelCommands()
  -> runClipboardAcquisitionWithGate({ liveIoStatus: service.liveIoStatus, action })
  -> if Threat I/O off: return blocked clipboard snapshot
  -> if Threat I/O on: call acquisition.arm(payload) or acquisition.capture(payload)
```

The blocked snapshot shape is compatible with the existing global shortcut blocked state:

```txt
kind: clipboard.acquisition.snapshot
state: blocked
message: IO authority is off; clipboard scan was not started
reason: io-disabled
listeningUntilMs: null
cooldownUntilMs: null
lastCapture: null
```

The global `Control+\` path still checks `threatLiveIoGate.status().enabled` before `clipboard.readText()`. It now reuses the same blocked snapshot factory; I/O-on behavior was not weakened.

## Clipboard Read / No-Read Proof

Added `verifiesClipboardServiceCommandsDoNotReadWhenThreatIoIsOff()` to `scripts/verify-operator-io-gate-separation.js`.

The verifier injects a counting `readClipboard` function and a counting Threat scan. With Threat I/O off:

- `threat.clipboard.arm` equivalent returns `state: blocked`
- `threat.clipboard.capture` equivalent returns `state: blocked`
- clipboard read count remains `0`
- Threat scan count remains `0`

After enabling the injected Threat gate, the same production gate helper allows the service path to baseline/listen and then read current clipboard during capture, proving the gate blocks the read boundary rather than disabling Clipboard Acquisition behavior.

## Behavior Preserved

- Global `Control+\` immediate capture of current valid clipboard content remains supported when Threat I/O is on.
- Focused/windowed no-payload acquisition still baselines, listens, ignores unchanged content, and only captures changed valid content.
- Cooldown, seal reasons, timeout, cancellation, rejection, and scan-failure behavior remain in `clipboardAcquisitionService`.
- Recent duplicate suppression remains the existing 10 second / 5 fingerprint-only in-memory cache.
- Passive/Threat gate separation remains intact; the new service-command check uses Threat I/O status only.

## Threat Blocked-Code Alignment

Updated `scripts/verify-threat-intel.js` so the primary Threat blocked scan uses a Threat-configured `createLiveIoGate` and expects `THREAT_LIVE_IO_BLOCKED`.

Provider-fault verification remains the lane-code oracle for split Passive/Threat blocked behavior.

## Redaction-Safe Operator I/O Artifact Shape

Clarified `docs/testing/live-operator-gamelog-smoke-playbook.md` with a future artifact skeleton that allows only:

- authorization reference
- I/O policy booleans
- private-path omission plus optional fingerprint
- clipboard state plus optional target fingerprint
- event counts and hash-only rejection fingerprints
- bounded snapshot summaries
- stop reason without private raw content

It explicitly excludes raw private paths, raw gamelog lines, raw clipboard targets, screenshots, renderer output, Lab/adaptor output, calibration data, fixture intake, product claims, and raw provider bodies unless a future active packet explicitly authorizes the exact field.

## Verification

Passed:

```txt
npm.cmd run verify:threat-intel
npm.cmd run verify:clipboard-race
npm.cmd run verify:operator-io-gates
npm.cmd run verify:provider-faults
npm.cmd run verify:all
```

Observed `verify:all` terminal close:

```txt
provider fault injection verified
threat intel verified
clipboard acquisition race verified
operator IO gate separation verified
renderer shell verified
all checks verified
```

## Residual Risks

- No live/manual operator I/O smoke was authorized or run.
- Manual OS accelerator feel remains unverified in this packet.
- The service registry helper is verified deterministically through the same gate helper rather than through an Electron IPC harness; the production command handlers call that helper directly.
