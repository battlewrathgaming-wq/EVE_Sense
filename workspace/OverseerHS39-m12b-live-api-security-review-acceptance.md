# OverseerHS39: M12B Live API Security Review Acceptance

Status: Accepted
Date: 2026-05-25
Role: AURA-Sense Overseer

## Reviewed

- `workspace/current.md`
- `workspace/SecEngHS38-m12b-live-api-security-review.md`
- `docs/testing/live-api-smoke-transition-readiness.md`
- `scripts/smoke-passive-live-api.js`
- `scripts/smoke-threat-live-api.js`
- `src/passive/passiveTelemetryService.js`
- `src/passive/esiSystemActivityClient.js`
- `src/passive/zKillSystemContextClient.js`
- `src/threat/threatIntelService.js`
- `src/threat/threatIntelZkillClient.js`
- `src/threat/threatIntelTargetResolver.js`
- `src/services/httpClient.js`

## Acceptance

M12B live API security review is accepted.

The review meets the high acceptance bar. It traces the actual smoke scripts and provider/client paths rather than only restating the readiness docs, and it gives a clear go/no-go recommendation for the next live API slice.

## Accepted Findings

- Threat-only default `system:Jita` live API smoke is the recommended first live provider run.
- No blockers were found for a future Threat-only default Jita live smoke, provided the future packet uses strengthened authorization wording and stop conditions.
- Do not run both Passive and Threat in the first live smoke packet.
- Passive should follow later as a separate packet after Threat proves the shared HTTP/request-log artifact path under live zKill conditions.
- Passive refusal is source-safe, but its refusal artifact should later be aligned with Threat by adding `live_io_enabled: false`, `no_live_call: true`, and `requestLogs: []`.
- Threat target override is bounded by local/static resolution, but should remain disabled for the first live run unless the active packet explicitly names target text and resolved kind.

## Authorization Wording To Carry Forward

Future live packet wording should be exact, lane-specific, and command-specific. Use the reviewed replacement shape:

```txt
Authorize M12 live API smoke for [Threat only / Passive only / both] now. Set AURA_SENSE_LIVE_API=1 only for the named command invocation(s), then clear it. Run only [exact command(s)]. Use default Jita target unless this authorization explicitly names a different target. Do not use AURA_SENSE_THREAT_LIVE_TARGET unless the target text is named here. Write only the standard .tmp live smoke result artifact(s). Do not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims. Stop on the documented M12 live API stop conditions and record the stop reason.
```

## Stop Conditions To Carry Forward

Carry forward the strengthened stop conditions from `SecEngHS38`, especially:

- stop if the exact command list is not named
- stop if a Threat target override is present but not explicitly authorized by target text and resolved kind
- stop if the resolved Threat target is pilot, corporation, or alliance and the authorization only named default Jita/system smoke
- stop after provider 420/429, repeated 5xx, timeout, malformed response, or retry exhaustion unless the active packet explicitly says to continue
- stop if any artifact would include raw provider bodies, request/response headers with secrets, clipboard text, private gamelog lines, private EVE folder paths, or unrelated operator state
- stop if `AURA_SENSE_LIVE_API=1` cannot be scoped to the single command invocation and cleared afterward
- stop if the run requires renderer, bridge, IPC, Lab, adapter, operator gamelog, calibration, fixture intake, SDE refresh, or product-claim work

## Overseer Verification

Rerun without setting `AURA_SENSE_LIVE_API=1`:

```powershell
npm.cmd run smoke:passive-live-api
npm.cmd run smoke:threat-live-api
npm.cmd run verify:protected-terms
git status --short --branch
```

Results:

- `smoke:passive-live-api`: exited 0; refused and wrote `.tmp\passive-live-api-smoke\result.json`.
- `smoke:threat-live-api`: exited 0; refused and wrote `.tmp\threat-live-api-smoke\result.json`.
- Passive refusal artifact recorded `status: refused` and the gate reason.
- Threat refusal artifact recorded `status: refused`, `live_io_enabled: false`, `no_live_call: true`, target `system:Jita`, lookback `3600`, sample limit `5`, empty `requestLogs`, and output path.
- `verify:protected-terms`: exited 0; one warning-only protected-term finding in the review artifact; no protected-word JSON updates or renames were performed.
- `git status --short --branch`: showed the expected untracked `workspace/SecEngHS38-m12b-live-api-security-review.md` before this acceptance record.

## Boundaries Preserved

- Did not set `AURA_SENSE_LIVE_API=1`.
- Did not run live zKill or ESI calls.
- Did not run live EVE log ingestion.
- Did not inspect private/operator EVE log folders.
- Did not run manual shortcut validation.
- Did not run real SDE refresh/download.
- Did not change code or provider semantics.
- Did not change renderer UI, bridge contracts, IPC payload semantics, Lab/adaptor/display work, operator gamelog smoke, Combat calibration, or raw fixture intake.

## Resting State

Return `workspace/current.md` to idle.

Next recommended live slice, if the Human chooses to authorize it, is Threat-only default Jita live API smoke with no `AURA_SENSE_THREAT_LIVE_TARGET` override.
