# UIUXDiscoveryHS06: Runtime I/O Authority

Status: Advisory discovery input, not project authority
Date: 2026-05-27
Surface: Runtime I/O authority control and display meaning
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

Own whether Sense is allowed to ingest local gamelog events, perform clipboard acquisition, and make provider/API requests.

## What Is Visible Now

- Top `IO` button in the frame chrome.
- Diagnostics `Live IO` field and enable/disable button.
- I/O off now means no ingest under ADR-0008/M12I, not only no provider or clipboard.
- Turning I/O off stops active Combat Witness watcher and blocks new local event admission.
- Passive and Combat can retain existing/resting state, but no new parser events should mutate state while I/O is off.
- Provider and Clipboard Acquisition gates remain separate but under the broader I/O authority meaning.

## What The User Needs To Understand

- I/O is user authority, not provider health.
- I/O off means Sense is not allowed to ingest or perform external/clipboard I/O actions.
- Existing/resting display can remain visible without implying new ingest is active.
- Blocked I/O is different from provider failure, no scan, no observation, or unavailable bridge.
- The control is powerful but should not create dashboard anxiety.

## First-Read Candidates

- Small ownership chip/button.
- Clear on/off state when interacted with.
- Local lane effect only when it changes what the user is seeing.
- Resting/blocked state distinction for surfaces that cannot receive new input.

## Detail / Diagnostic Candidates

- Which lanes are affected by I/O off.
- Watcher configured-but-blocked state.
- Provider blocked state.
- Clipboard acquisition blocked state.
- Last observed/resting state timestamps or basis.
- Current accepted ADR-0008 meaning.

## Terms To Preserve

- `I/O`
- `IO`
- `Live IO blocked`
- `runtime.live-io.snapshot`
- `Control+\`
- `Clipboard Acquisition`
- `Passive Telemetry`
- `Combat Witness`
- `Threat Intel`

## Terms To Avoid Or Qualify

- Avoid `offline` if it hides user-authority meaning.
- Avoid `provider failed` for I/O off.
- Avoid `disabled` without explaining blocked ingest when needed.
- Avoid safety/danger implication.
- Avoid implying broad historical storage or deletion.

## Risks / False Implications

- Top-level `IO` is visually small relative to its authority meaning.
- "Live IO" can sound like provider/network only, but M12I makes I/O off mean no local ingest too.
- I/O off can be mistaken for no data, provider failure, or app broken.
- Showing blocked states too loudly can make Sense feel like an operations dashboard.

## Possible request_display Candidate

Parked / likely yes later.

Potential candidate:

```text
sense.runtime-io-authority
```

This should likely receive a User Meaning Card before Lab comparison.

## No Dev Authorization

No Dev authorization. This artifact does not request implementation, I/O behavior changes, copy changes, live/manual checks, or Lab submission.
