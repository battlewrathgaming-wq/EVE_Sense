# Gap To-Do: Threat Intel Search UI Surface

Status: Open
Priority: P1
Milestone: 09 - Scoped Threat Intel And Clipboard Acquisition

## Need

The renderer needs a compact search and result surface for deliberate Threat Intel scans while remaining presentation-only.

## Actionables

- Add a compact search box and explicit submit control.
- Show target, provider basis, lookback, sample cap, freshness, capped/partial/failure state, and blocked live IO state.
- Preserve calm tactical language; avoid certainty or hostility claims.
- Ensure search focus alone does not call APIs.
- Keep optional typed-input debounce deferred unless Overseer explicitly authorizes it.
- Add renderer-shell/static checks for new surface behavior.

## Guardrails

- Do not call zKill, ESI, fetch, filesystem, parser, or backend runtime modules from renderer.
- Do not scan on focus alone.
- Do not overcrowd the HUD.
- Do not present zKill samples as complete intelligence.

## Completion Signal

- Explicit search submit can request a backend Threat Intel scan.
- Search focus alone performs no external IO.
- Renderer boundary verification passes.
- `npm.cmd run verify:all` passes.

## Related Files

- `docs/contracts/renderer-boundary-contract.md`
- `src/renderer/app.js`
- `src/renderer/index.html`
- `src/main/preload.js`
- future Threat Intel bridge files

