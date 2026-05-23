# Queue

Status: Active
Updated: 2026-05-23

Execute from top to bottom unless the user gives a newer instruction.

## P0

1. Read `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`.
2. Continue the first incomplete P0 bug-hunting packet:
   - `docs/gap/to-do/aggressive-test-harness-matrix.md`
   - `docs/gap/to-do/combat-parser-hostile-fixtures.md`
   - `docs/gap/to-do/gamelog-watcher-chaos-tests.md`
   - `docs/gap/to-do/renderer-preload-boundary-adversarial-tests.md`
3. Add or update deterministic verification.
4. Run `npm.cmd run verify:all`.

## P1

Continue after P0 packets or when specifically directed:

- `docs/gap/to-do/live-io-provider-fault-injection.md`
- `docs/gap/to-do/clipboard-acquisition-race-tests.md`
- `docs/gap/to-do/runtime-settings-diagnostics-fault-tests.md`
- `docs/gap/to-do/electron-visual-state-regression-tests.md`

## P2

Continue only after higher-priority work or explicit direction:

- `docs/gap/to-do/local-metadata-sde-builder-hardening.md`
- `docs/gap/to-do/bug-hunt-triage-and-failure-records.md`
- `docs/gap/to-do/native-gamelog-folder-picker.md`
- `docs/gap/to-do/active-scan-validator-reconciliation.md`

## Completion Expectations

For every completed slice:

- update the relevant gap packet
- move completed packets to `docs/gap/complete`
- update current-state if product truth changed
- add or update an audit handover when the slice changes risk or milestone state
- run required verification
- leave `git status --short` clean if the user asked for a commit or if the session is closing with git
