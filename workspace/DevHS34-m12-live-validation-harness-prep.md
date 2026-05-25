# DevHS34: M12 Live Validation Harness Prep

Status: Complete
Date: 2026-05-25
Role: AURA-Sense Dev

## Summary

Prepared the M12 live/manual validation airlock without crossing the live/manual boundary.

The packet adds a refusal-first Threat Intel live API smoke command, keeps it outside `verify:all`, records default-safe artifacts under `.tmp`, and adds a docs-only live operator gamelog smoke scaffold that requires explicit Human authorization before execution.

## Files Changed

- `scripts/smoke-threat-live-api.js`
- `package.json`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/roadmap/runtime-smoke-policy.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `workspace/current.md`

## Threat Live Smoke

New command:

```powershell
npm.cmd run smoke:threat-live-api
```

Default behavior:

- refuses unless `AURA_SENSE_LIVE_API=1`
- writes `.tmp\threat-live-api-smoke\result.json`
- records `status: refused`
- records `live_io_enabled: false`
- records `no_live_call: true`
- records empty `requestLogs`

Future enabled behavior is scoped to:

- one deliberate target: `AURA_SENSE_THREAT_LIVE_TARGET` or default `system:Jita`
- one backend Threat Intel service scan
- zKill-only provider route through `ThreatIntelZkillClient`
- bounded `lookbackSeconds: 3600`
- bounded `sampleLimit: 5`
- request logs and result artifact output

No live-enabled run was performed in this packet.

## Artifact Paths

Refusal-path artifacts written during verification:

- `.tmp\passive-live-api-smoke\result.json`
- `.tmp\threat-live-api-smoke\result.json`

Threat refusal artifact recorded:

```json
{
  "status": "refused",
  "reason": "Set AURA_SENSE_LIVE_API=1 to run live Threat Intel API smoke",
  "live_io_enabled": false,
  "no_live_call": true,
  "requestLogs": []
}
```

## Live Operator Gamelog Scaffold

Path:

```txt
docs/testing/live-operator-gamelog-smoke-playbook.md
```

The scaffold documents authorization requirements, privacy rules, artifact expectations, intended smoke shape, stop conditions, and non-goals. It explicitly does not authorize execution by itself.

## Verification

Run without setting `AURA_SENSE_LIVE_API=1`:

```powershell
npm.cmd run smoke:passive-live-api
```

Result: exited 0; refused and wrote `.tmp\passive-live-api-smoke\result.json`.

```powershell
npm.cmd run smoke:threat-live-api
```

Result: exited 0; refused and wrote `.tmp\threat-live-api-smoke\result.json`.

```powershell
npm.cmd run verify:protected-terms
```

Result: exited 0 in working-set mode; warning-only protected-term findings reported; no protected-word JSON updates or renames performed.

```powershell
npm.cmd run verify:all
```

Result: exited 0; all offline checks verified.

```powershell
git status --short --branch
```

Initial post-verification result:

```txt
## main...origin/main
 M docs/current-state/current-implementation.md
 M docs/roadmap/runtime-smoke-policy.md
 M docs/testing/aggressive-test-harness-matrix.md
 M package.json
?? docs/testing/live-operator-gamelog-smoke-playbook.md
?? scripts/smoke-threat-live-api.js
```

## Boundary Confirmation

- Did not set `AURA_SENSE_LIVE_API=1`.
- Did not run live zKill or ESI calls.
- Did not run live EVE log ingestion.
- Did not inspect operator/private EVE log folders.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not change renderer UI, bridge contracts, IPC payload semantics, Lab artifacts, or adapter work.
- Did not add Atlas persistence, report storage, watch semantics, or Atlas-owned Evidence semantics.

## Residual Risks

- The Threat live-enabled branch is intentionally unproven against live provider behavior until a future authorized M12 run.
- The operator gamelog playbook is a scaffold only; it still needs a future authorized operator-machine packet to record real smoke evidence.
- Protected-term verification remains warning-only for existing terminology pressure around Evidence/Watcher/Coverage language.

## Recommended Next M12 Packet

Run an Overseer review of this harness prep, then open a narrowly authorized refusal-to-live transition packet only if the Human explicitly wants live API execution. Keep operator gamelog smoke separate from live provider smoke unless Human authorizes both boundaries in one packet.
