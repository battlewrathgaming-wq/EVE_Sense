# OverseerHS47: M12G Clipboard Mode And Gate Separation Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer

## Reviewed

- `workspace/current.md`
- `workspace/DevHS46-m12g-clipboard-mode-gate-separation-hardening.md`
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

## Acceptance

M12G is accepted.

The implementation preserves the Human-approved operator story: `Ctrl+\` is the uncommon, explicit permission action for hands-free Threat target acquisition during combat. The shortcut can immediately consume current clipboard content when I/O authority is on, while the focused/windowed path still uses a short visible listening window that ignores unchanged pre-arm content.

## Accepted Behavior

- I/O remains the manual authority gate above clipboard and provider I/O.
- Global shortcut immediate capture is preserved as explicit operator-invited behavior.
- Focused/windowed acquisition remains baseline/listen/seal/cooldown behavior.
- Clipboard Acquisition remains time-bounded and sealed.
- Recent duplicate target suppression is bounded to a 10 second, 5 entry, in-memory fingerprint cache.
- The rolling cache does not store raw clipboard history and does not become a Passive gate, durable record, or display fixture source.
- Threat Intel target text is capped at 256 characters.
- Parser `navigation.jump` can update Passive without invoking Threat scan.
- Clipboard Acquisition/Threat scan does not initialize or gate Passive observation.
- Future operator smoke artifact docs now require redaction by default for raw log lines, raw clipboard targets, and private paths.

## Code Review

No blocking issues found.

Residual watch item: duplicate suppression can skip an intentional repeated scan of the same normalized target inside 10 seconds. That is acceptable for M12G as a combat-flow throttle, but it should be observed during future operator smoke.

## Verification

Dev reported these commands passed:

```powershell
npm.cmd run verify:clipboard-race
npm.cmd run verify:threat-intel
npm.cmd run verify:operator-io-gates
npm.cmd run verify:all
```

Results recorded in `workspace/DevHS46-m12g-clipboard-mode-gate-separation-hardening.md`:

- clipboard acquisition race verified
- threat intel verified
- operator IO gate separation verified
- all checks verified

Overseer did not rerun live/manual checks. No live/manual checks were required or authorized.

## Boundaries Preserved

- No `AURA_SENSE_LIVE_API=1`.
- No Passive or Threat live API smoke.
- No live EVE gamelog ingestion.
- No private/operator folder inspection.
- No real clipboard content capture.
- No manual shortcut validation.
- No SDE refresh/download.
- No IPC/channel/bridge name changes.
- No renderer display convergence, Lab/adapter behavior, or lane-meaning changes.

## Resting State

Return `workspace/current.md` to idle after M12G.

Recommended next M12 options:

- future live/manual operator I/O smoke, only with explicit Human authorization and redacted artifact expectations
- Combat Witness calibration from accepted real samples
- raw repair/healing fixture intake from accepted samples
- manual shortcut feel/OS accelerator validation, only if explicitly authorized
