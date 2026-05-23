# Gap To-Do: Threat Intel zKill Scoped Probe

Status: Complete
Priority: P0
Milestone: 09 - Scoped Threat Intel And Clipboard Acquisition

## Need

Threat Intel needs a backend-only zKill probe for deliberate scans that returns bounded, partial-aware tactical context without treating zKill as complete truth.

## Actionables

- Add or adapt a backend zKill client/service for Threat Intel scans.
- Use bounded routes with explicit lookback where available.
- Normalize non-array responses, malformed refs, missing `killmail_id`, and missing hash where hashes are needed.
- Include provider, endpoint family, lookback seconds, sample limit, discovered count, selected count, malformed count, failed count, capped, partial, fetchedAt, and freshness metadata.
- Reuse request logging and live IO gate behavior from Passive Telemetry.
- Add tests for success, malformed response, capped sample, blocked live IO, and failed fetch.

## Guardrails

- Do not call zKill from renderer.
- Do not use broad background discovery.
- Do not add ESI killmail expansion by default.
- Do not abort an entire scan because one ref is malformed.
- Do not present zKill result count as complete tactical truth.

## Completion Signal

- A deliberate Threat Intel scan returns normalized zKill-backed sample metadata.
- Malformed/capped/partial behavior is visible and tested.
- `npm.cmd run verify:all` passes.

## Related Files

- `docs/gap/complete/readiness-05-zkill-ref-boundary.md`
- `docs/gap/complete/readiness-06-threat-intel-sample-metadata.md`
- `docs/contracts/threat-intel-contract.md`
- future Threat Intel zKill service files
