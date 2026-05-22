# Gap To-Do: Bug Hunt Triage And Failure Records

Status: Open
Priority: P2
Milestone: 13 - Aggressive Testing And Bug Hunting

## Need

Bug hunting should leave operational memory, not just patches.

## Actionables

- Define bug severity labels for tactical truth, privacy, live IO, renderer boundary, runtime recovery, and visual regressions.
- Require each fixed reusable bug class to produce or update a `docs/failures` record.
- Record no-finding passes when a bug-hunt slice is meaningful.
- Keep failed experiments out of doctrine unless accepted by Overseer.

## Guardrails

- Do not hide known failure classes in commit messages only.
- Do not turn speculative fixes into doctrine.
- Do not preserve stale gaps once evidence retires them.

## Completion Signal

- Bug-hunt handovers include findings, fixes, failure records, and remaining risk.
- Failure records exist for reusable defects.
