# UIUXDiscoveryHS04: Threat Intel Latest Scan

Status: Advisory discovery input, not project authority
Date: 2026-05-27
Surface: Threat Intel latest scan / back-page report
Source owner: AURA-Sense

## Grounding Records Reviewed

- `workspace/current.md`
- `workspace/critical/critical-terms.md`
- `docs/current-state/display-pipeline-inventory.md`
- `docs/current-state/current-implementation.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `F:\Projects\Docs\Aura-Project-Orchestration\Projects\Sense\UXUI\Context_memory.md`

## User Task

Run or review a deliberate scoped Threat Intel scan without turning it into background monitoring, complete intelligence, or Atlas-style evidence.

## What Is Visible Now

- `Threat Intel` drawer/back-page surface.
- `Gateway` marker.
- Acquisition/search bar with `Search / Display`, status, target display, clipboard widget, hidden manual input.
- Target kind selector for pilot/system/corp/alliance.
- zKill pulse visualization.
- Persistent latest scan report fields: Target, Status, Target type, Basis, Sample, State.
- Idle/no-scan state shows `No scan`, `Idle`, `No provider`, `0 / 0`, and "Report persists until the next scan."

## What The User Needs To Understand

- Threat Intel is deliberate and operator-initiated.
- `No scan` means no deliberate scan has run, not provider absence and not Passive no-observation.
- Latest scan can persist until the next scan without becoming durable history.
- zKill samples are scoped and bounded, not complete tactical truth.
- Clipboard Acquisition may feed Threat Intel, but clipboard listening is not continuous.

## First-Read Candidates

- Latest deliberate scan target, if any.
- Scan state: no scan, pending, sampled, partial, blocked, degraded/failure.
- Target type and basis if the scan exists.
- Sample count/cap/partial near the sample claim.
- Back-page / drawer posture to keep Threat Intel from dominating the primary face.

## Detail / Diagnostic Candidates

- Resolver status.
- Unsupported/ambiguous target.
- zKill lookback and sample limit.
- Failure reason.
- Clipboard source vs manual target source.
- Target kind toggle history should not become clutter.

## Terms To Preserve

- `Threat Intel`
- `No scan`
- `Gateway`
- `Scoped sample`
- `Partial sample`
- `Capped sample`
- `Live IO blocked`
- target type labels where accepted

## Terms To Avoid Or Qualify

- Avoid `evidence`, `history`, `watch`, `monitoring`, `tracking`, `verified`, `truth`, or complete `intelligence`.
- Avoid implying background scans.
- Avoid broad "threat" language without the `Threat Intel` lane context.
- Avoid `No data` for no scan.

## Risks / False Implications

- The current report structure may feel like durable storage because it says report persists.
- `No provider` in the report can blur with `No scan`.
- zKill pulse can look like continuous provider state.
- Back-page machinery is visible even in no-scan state, which can make inactive Threat Intel feel busy.
- Target kind controls can imply broad search/guessing if not tied to deliberate input.

## Possible request_display Candidate

Yes.

Existing candidate in display inventory:

```text
sense.threat-latest-scan-review
```

Request strength likely:

```text
comparative
```

## No Dev Authorization

No Dev authorization. This artifact does not request implementation, scan behavior changes, copy changes, Lab submission, or provider calls.
