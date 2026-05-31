# UIUXDiscoveryHS08: Diagnostics Support Surface

Status: Advisory discovery input, not project authority
Date: 2026-05-27
Surface: Diagnostics and support detail surface
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

Inspect source/support state when a compact surface needs explanation, without turning the whole HUD into an operations dashboard.

## What Is Visible Now

- Diagnostics panel opened by top icon button.
- Header shows `Diagnostics` / `System State`.
- Log setup tile and watcher controls.
- Advanced grid with Combat, Threat, Passive, Live IO, Settings, and runtime fields.
- Event stream list.
- Passive and shortcut messages.
- Diagnostics are broad and dense relative to compact gameplay surface.

## What The User Needs To Understand

- Diagnostics are support and explanation, not primary gameplay truth.
- They should be available when needed but should not define the first-read HUD.
- Raw/private data must remain protected.
- Runtime/setup states are not tactical readiness.
- Degraded/support details should explain affected elements, not become global alarm theater.

## First-Read Candidates

- Diagnostics should normally not be first-read.
- If opened, first read should be "what needs attention" rather than every internal field.
- Quiet count or noted-state can be enough when nothing needs attention.

## Detail / Diagnostic Candidates

- Watcher setup and state.
- Settings health.
- Passive freshness/basis/gap.
- Threat sample/basis/pulse detail.
- Event stream.
- Runtime errors or sanitized diagnostics count.
- I/O authority state and lane impact.

## Terms To Preserve

- `Diagnostics`
- `System State`
- `Log Watcher`
- `Live IO`
- `Passive Telemetry`
- `Combat Witness`
- `Threat Intel`
- `No scan`
- `No observation`
- `Live IO blocked`

## Terms To Avoid Or Qualify

- Avoid `ready` or `healthy` where it can imply tactical readiness.
- Avoid raw logs, raw clipboard, raw provider bodies, or private paths.
- Avoid `evidence`, `truth`, `verified`, or `complete`.
- Avoid making support fields look like commands.

## Risks / False Implications

- Diagnostics can become the conceptual center if too much state is mirrored into compact UI.
- Developer/support terminology can leak into operator presentation.
- Runtime state can be read as tactical state.
- Broad grid can encourage adding every state rather than showing at point of need.
- Message text can over-explain quiet states.

## Possible request_display Candidate

No for immediate Lab comparison.

Park as internal UX doctrine:

```text
diagnostics as support, not dashboard
```

Could become a future request only after core surfaces are better nested.

## No Dev Authorization

No Dev authorization. This artifact does not request implementation, diagnostics redesign, copy changes, data exposure changes, or Lab submission.
