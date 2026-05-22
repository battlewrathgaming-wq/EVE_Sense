# Gap To-Do: Threat Intel Live Gate And Observability

Status: Complete
Priority: P1
Milestone: 09 - Scoped Threat Intel And Clipboard Acquisition

## Need

Threat Intel live zKill calls must use the same scoped, visible, observable live IO discipline established by Passive Telemetry.

## Actionables

- Reuse or extend the backend live IO gate for Threat Intel scan actions.
- Block live zKill calls when live IO is disabled.
- Surface blocked state in scan snapshots and renderer copy.
- Log request attempts and outcomes through backend diagnostics.
- Include provider, endpoint family, duration, status/failure code, retry count, cap/partial metadata, and blocked state.
- Keep `verify:all` offline.
- Add an optional explicit live smoke only if scoped and gated.

## Guardrails

- Do not make live smoke part of `verify:all`.
- Do not hide blocked live behavior as empty intelligence.
- Do not call live APIs from renderer.
- Do not add background polling.

## Completion Signal

- Live-disabled Threat Intel scan returns blocked state and makes no zKill call.
- Live-enabled injected test path can run deterministically.
- Request observability is covered by offline tests.
- `npm.cmd run verify:all` passes.

## Related Files

- `src/passive/liveIoGate.js`
- `src/services/httpClient.js`
- `src/services/diagnosticsPolicy.js`
- future Threat Intel service files

