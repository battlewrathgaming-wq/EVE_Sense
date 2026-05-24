# Milestone 14: Back-Page Threat Intel UX

Status: Complete
Date: 2026-05-23
Owner: Overseer direction, Dev execution

## Vision Setting

Milestone 14 reshapes Threat Intel into an overlay-native back-page workflow.

Threat Intel should not compete with the live combat read on the front page. The front page is for travel/general telemetry, pressure, and observed incoming contact. The back page is for deliberate scan review, target classification, clipboard acquisition state, and a persistent report that can be revisited during downtime.

The search surface is not a form-first web control. It is a display-first overlay instrument with hands-free acquisition bindings.

## Discussion Contract

The back-page Threat Intel UX should be designed as:

```txt
Display-first search bar
No manual Search button
\ = gateway/context
\ + CTRL = clipboard acquire + scan
\ + ALT = target type cycle
Report persists until next scan
```

The visual language should be:

```txt
Teal = ready / local interaction
Amber interior = clipboard listener active
Amber exterior = cooldown / temporary constraint
Snap-off = listener sealed
```

This gives AURA-Sense an overlay-native interaction model: hands-free, low-focus, and honest about clipboard authority.

## Product Rationale

AURA-Sense is an overlay. Direct interaction can steal focus from EVE or cause the game to minimize. The Threat Intel workflow should therefore avoid click-first interaction and avoid a manual `Search` button as the primary action.

The operator should be able to open the back-page context, acquire a copied target, scan, and later review the resulting report without treating the overlay as a normal desktop web form.

The clipboard listener has UX and trust implications. It may exist internally as a short listen window, but the user-facing behavior should feel deliberate, brief, and visibly sealed.

## Front / Back Page Split

### Front Page

The front page should remain the live tactical read:

- travel/general telemetry
- current system and activity numbers
- Combat Witness pressure and repair throughput
- distinct incoming source/contact metric
- observed weapon/source context
- only degraded runtime health when it affects trust or operation

Threat Intel should not occupy front-page prime space beyond perhaps a quiet back-page/gateway affordance.

### Back Page

The back page has the whole UI available for deliberate review:

- shared search/display bar
- gateway binding indicators
- target type pill
- clipboard state and cooldown state
- persistent Threat Intel report
- provider/sample/cap/partial/blocked details
- diagnostics or basis copy that would be too noisy for the front page

## Search / Display Bar

The search bar is one combined search, display, and clipboard-state surface.

It may show:

- idle placeholder
- last captured target
- typed or pasted target, if a future focused workflow permits it
- `Pulling` or `Listening` during the actual clipboard acquisition window
- `Scanning` after capture has sealed and the scan request is running
- `Cooldown` during the post-capture cooldown

It should not imply that the operator must click into it and press a visible search button.

## Gateway Binding Model

The UI sketch places `\` between the main search/display bar and the target type pill. That marker is the gateway between two functions.

```txt
\ is the gateway.
\ + CTRL starts clipboard acquire + scan.
\ + ALT cycles target type.
```

Binding semantics:

- `\` brings the operator to the back page or focuses the back-page search context.
- `\ + CTRL` opens the clipboard authority window, immediately pulls from the clipboard in the hands-free path, seals on capture/search start, and makes the scoped API request.
- `\ + ALT` swaps the target type used for search resolution.

`CTRL` is the active clipboard/API action. `ALT` is local type classification. `\` is the binding operator/gateway.

## Target Type Pill

The target type pill sits below the search/display bar and is controlled by `\ + ALT`.

Candidate target types:

- Name
- System
- Pilot
- Corporation
- Alliance

The label should be explicit enough that the operator knows how plain copied text will be resolved.

The target pill should glow teal on type change because it is a local UI/resolution change, not clipboard authority and not a network action by itself.

## Clipboard Trust Contract

Clipboard acquisition must remain visibly bounded.

User-facing behavior:

```txt
\ + CTRL
-> brief clipboard authority window
-> pull current clipboard
-> seal immediately on capture or scan start
-> run scan
-> enter cooldown
```

Important UX rule:

```txt
Listening is a state, not a mode.
```

The UI must not make AURA-Sense feel like it is continuously watching the clipboard.

When capture happens or the scan starts, the amber interior listening effect snaps off immediately. No lingering fade should imply the listener is still open.

## Visual State Grammar

### Idle

- Search/display bar shows placeholder or current target text.
- Faint static teal glow is allowed as passive ready affordance.
- No amber interior.
- No amber perimeter.

### Gateway Active

- `\` marker glows teal while the gateway/context is active.
- This is local navigation/focus, not clipboard authority.

### Listening / Pulling

- Search/display bar uses subtle amber interior fill.
- `CTRL` chip glows amber.
- `\` gateway may glow with it to show the chord path.
- This means clipboard authority is active.

Suggested visual treatment:

- low-contrast amber fill inside the input field
- optional diagonal stripe motif if restrained
- no aggressive warning animation

### Captured / Scan Starts

- Amber interior snaps off immediately.
- Listener is sealed.
- Report begins updating.

### Cooldown

- Search/display bar label becomes `Cooldown`.
- Faint amber perimeter glow around the search/display bar.
- No amber interior fill.
- No key-chip active glow unless the key is physically pressed.

This distinction matters:

```txt
Amber interior = active authority
Amber exterior = temporary constraint
```

## Report Persistence

The report section lives below the search/display bar and persists until the next scan event replaces it.

This allows the operator to go back and forth during downtime and review the previous scan without triggering another provider request.

The report should display:

- target label
- target type
- scan status
- provider basis
- lookback window
- selected/discovered sample count
- capped/partial/blocked state
- failure or ambiguity reason when relevant
- evidence/sample language that does not imply complete coverage

The report is review state, not clipboard authority. It may persist after the listener has sealed.

## Copy And Terminology

Avoid ambiguous or web-form-ish language.

Prefer:

- `Search / Display`
- `Target type`
- `Gateway`
- `Pulling`
- `Scanning`
- `Cooldown`
- `No scan`
- `Partial sample`
- `Capped sample`
- `Live IO blocked`

Avoid:

- `Search` as a visible manual submit button
- `Watching clipboard`
- `Monitor`
- `Threat score`
- `Complete result`
- `Primary hostile` unless evidence truly supports it

## Task Chain

### Task 1: Back-Page Composition Contract

- Define the front/back split in renderer docs before code movement.
- Keep front page focused on travel, pressure, and incoming contact.
- Move Threat Intel search/report behavior to the back page.
- Preserve lane separation and backend-owned snapshots.

### Task 2: Search Bar Refactor

- Convert search into a display-first acquisition bar.
- Remove visible manual Search button intent.
- Keep the bar as the shared display for idle target, listening/pulling, scanning, cooldown, and last captured target.
- Keep renderer state as presentation only.

### Task 3: Gateway Bindings

- Treat `\` as gateway/back-page context.
- Implement or verify `\ + CTRL` as clipboard acquire + scan.
- Implement or verify `\ + ALT` as target type cycle.
- Remove the current slide-out/peek behavior if it still exists.
- Do not run scans on focus alone.

### Task 4: Visual State Grammar

- Add limited teal ready/local interaction glow.
- Add amber interior fill only while clipboard authority is active.
- Add amber exterior glow only for cooldown/temporary constraint.
- Ensure listener seal snaps off without lingering active-listener animation.

### Task 5: Persistent Report Section

- Render the last Threat Intel scan report below the search/display bar.
- Keep it stable until the next scan event.
- Do not trigger provider requests while merely opening/closing the back page.
- Keep capped/partial/blocked/failure states visible and honest.

### Task 6: Verification And Smoke

- Extend renderer/static checks for new gateway bindings and absence of renderer provider calls.
- Extend renderer shell checks for search/display bar, target pill, cooldown state, and report persistence.
- Extend Electron visual smoke for back-page idle/listening/cooldown/report states if the shell behavior is touched.
- Keep live provider smoke separate from `verify:all`.

## Autonomy Envelope

Dev may touch:

- renderer layout and CSS for back-page Threat Intel
- renderer keyboard handling for `\`, `CTRL`, and `ALT`
- preload bridge usage where existing backend Threat Intel/clipboard snapshots need presentation
- renderer verification and smoke assertions
- docs, roadmap, current-state, and UX handover notes

Dev may not:

- call zKill, ESI, fetch, filesystem, parser, watcher, or runtime modules from the renderer
- add manual background scans
- make search focus trigger a scan
- leave clipboard listening beyond the sealed acquisition window
- add Atlas persistence, reports, watch execution, or evidence stores
- make cooldown look like active listening
- turn the report into historical intelligence storage

## Acceptance Gate

Milestone 14 is complete when:

- Threat Intel is back-page first, not front-page prime space.
- The search/display bar is display-first and hands-free.
- There is no visible/manual Search button as the intended overlay workflow.
- `\` functions as gateway/context.
- `\ + CTRL` acquires clipboard and starts a scoped scan.
- `\ + ALT` cycles target type without scanning.
- Amber interior appears only during active clipboard authority.
- Listener-active visuals snap off on capture/search start.
- Cooldown uses amber exterior only.
- The report persists until the next scan.
- Renderer boundary verification passes.
- `npm.cmd run verify:all` passes.
- Electron smoke is run if the shell/global shortcut behavior changes.

## Explicit Deferrals

- UI Lab / visual editor side project.
- ESI killmail expansion.
- Atlas handoff or persistence.
- Broad historical report storage.
- Click-first/manual form workflow as primary UX.
- Live provider smoke unless explicitly authorized and recorded.

## UI Lab Side Topic

A separate UI Lab is useful, but should remain outside this milestone unless explicitly opened.

Potential UI Lab shape:

```txt
Browser runner: fast layout/state iteration
Electron runner: shell, shortcut, clipboard, always-on-top feel
Mock modules: contract-compatible snapshots only
Saved state outputs: JSON plus screenshot/reference notes
```

The UI Lab should prototype layout and visual states without becoming a second AURA-Sense runtime.

## Related Documents

- `docs/roadmap/milestone-09-scoped-threat-intel-and-clipboard-acquisition.md`
- `docs/roadmap/milestone-10-integrated-tactical-viewport.md`
- `docs/archive/deprecated-gap-workflow-2026-05-23/to-do/ux-handover-current-overlay-and-next-ui-slices.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/features/clipboard-acquisition.md`
- `docs/schemas/hud-snapshot.md`
- `docs/current-state/combat-metrics.md`

