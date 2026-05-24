# SYSADHS01: Protected Terms Sniffer Tune

Status: Advisory only, not Sense authority
Review status: Complete - ready for Sense review
Date: 2026-05-24
Role: SYSAD / terminology sniffer support

## Request

Investigate over-reporting in the Sense protected-term sniffer and tune the script without changing Sense terminology, UI copy, docs copy, bridge contracts, protected-word JSON, or source-owned meaning.

The request was anchored by `workspace/TerminologySnifferAuditSeed-2026-05-24.md`, which recorded a baseline sample of 1700 warning-only items and identified the desired posture: classification and sniffer tuning, not bulk fixing.

## Files Reviewed

- `AGENTS.md`
- `workspace/current.md`
- `workspace/critical/critical-terms.md`
- `workspace/TerminologySnifferAuditSeed-2026-05-24.md`
- `package.json`
- `scripts/verify-protected-terms.js`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\protected-words\sense-protected.json`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\protected-words\atlas-protected.json`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\protected-words\lab-protected.json`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\protected-words\shared-collisions.json`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\protected-words\pending-candidates.json`

## Changes Made

- Changed broad candidate discovery in `scripts/verify-protected-terms.js` from always-on to opt-in with `--discover-candidates`.
- Added console output that states whether candidate discovery is muted or included.
- Preserved default protected external-term checks.
- Preserved default Sense boundary warnings.
- Added explicit boundary warning patterns for:
  - `Report`
  - `Fallback`
  - `CURRENT`
  - `AGED`

## Boundaries Preserved

- No protected-word JSON files were changed.
- No Sense docs, UI copy, schemas, renderer code, services, bridge fields, IPC channels, or tests were renamed.
- No Atlas, Lab, or Sense term authority was changed.
- Candidate discovery remains available when explicitly requested.
- The sniffer remains warning-only.

## Verification

Passed:

```powershell
npm.cmd run verify:protected-terms -- --baseline
npm.cmd run verify:protected-terms -- --baseline --discover-candidates
npm.cmd run verify:protected-terms
npm.cmd run verify:all
```

Observed results:

```txt
verify:protected-terms -- --baseline
scanned 64 file(s)
candidate terms: muted by default
220 warning-only item(s)

verify:protected-terms -- --baseline --discover-candidates
scanned 64 file(s)
candidate terms: included by request
1775 warning-only item(s)

verify:protected-terms
scanned 0 file(s)
0 warning-only item(s)
```

`verify:all` passed.

## Findings

- The over-reporting came primarily from `discoverCandidates()` running during every baseline pass.
- Candidate discovery treats quoted strings, code ticks, headings, and table phrases as possible new terms. That is useful for broad terminology mining, but too noisy for routine protected-term review.
- After making candidate discovery opt-in, baseline output drops from the seed's 1700 warning-only item range to 220 warning-only items.
- The remaining default baseline output is concentrated in the intended high-value families: `Evidence`, `Coverage`, `Watch`, `Gaps`, `Discovery`, `Warnings`, and `Readout`.
- With `--discover-candidates`, the old broad mining behavior remains available and reports 1775 warning-only items after the added boundary patterns.

## Remaining Risk

- The default baseline still reports 220 warning-only items, so it is not yet a small actionable review queue.
- Some remaining Lab-owned neutral terms such as `Coverage`, `Gaps`, `Warnings`, and `Readout` may need explicit Sense-side allow/common disposition if the team wants the baseline to become quieter.
- `Report`, `Fallback`, `CURRENT`, and `AGED` boundary checks may add useful warnings, but they should be reviewed by Sense Overseer before being treated as accepted policy.

## Recommendation

Recommend accepting this as a first sniffer tune.

Next best step is a Sense terminology audit pass that classifies the remaining 220 baseline warnings into:

- accepted Sense use
- allowed only with lane qualifier
- internal/test-only
- advisory/protective mention only
- rewrite candidate
- sniffer noise/tune candidate

Do not update protected-word JSON or docs copy until that classification is accepted.
