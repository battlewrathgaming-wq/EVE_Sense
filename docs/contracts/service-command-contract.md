# Contract: Service Commands

Status: Active Foundation

## Shape

A service command has:

- `command`: stable dotted command name
- `classification`: task classification
- `description`: concise operator-facing summary
- `validate(payload, context)`: optional payload validation hook
- `handler(payload, context)`: implementation function

## Classification

- `read-only`: no mutation and no lock
- `local-mutation`: scoped local change
- `external-io`: scoped external or long-running IO
- `external-mutation`: scoped external IO that also mutates local state
- `destructive`: exclusive operation with confirmation expected by the caller
- `exclusive`: global operation that should not overlap with other non-read-only work

## Guardrails

- Unknown commands fail closed.
- Validation runs before task wrapping or handler execution.
- Structured validation results should preserve specific error codes.
- Service invoke requests are validated before registry dispatch.
- Current task payloads are validated for `task.list` and `task.cancel`.
- Command handlers receive context from the boundary layer.
- Long-running commands can be wrapped as tasks.
- Handler-declared task statuses such as `partial` and `capped` must survive service wrapping.
- Renderer code should call services, not low-level implementation modules.

## Verification

Current checks:

```powershell
npm.cmd run verify:services
npm.cmd run verify:all
```

These verify current service registry behavior, payload validation, task status propagation, and service invoke request rejection. Future product services must add their own payload coverage as they are introduced.

