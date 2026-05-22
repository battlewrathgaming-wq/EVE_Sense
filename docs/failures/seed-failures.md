# Failures

Purpose:
Preserve lessons from bugs, regressions, or architectural drift.

Failure docs answer:

> What went wrong, why did it happen, and what invariant now protects us?

Suggested future records:

- passive telemetry overwrote Threat Intel state
- renderer owned telemetry truth
- combat event re-alerted repeatedly from rolling cache
- EWAR label implied persistent state after observation expired
- API calls triggered from renderer render/update loops
