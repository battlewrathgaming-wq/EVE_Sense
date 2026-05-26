# Milestone 09: Scoped Threat Intel And Clipboard Acquisition

Status: Complete - Live network smoke deferred
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

Milestone 09 gives the operator a deliberate tactical scan lane without turning AURA-Sense into a background intelligence collector.

The search box is the Threat Intel boundary. Clipboard Acquisition is the hands-free input path for fullscreen EVE use. Both paths must produce the same scoped Threat Intel request shape and the same provider/source-basis language.

Do not start this milestone until Passive Telemetry live-safe readiness has cleared, unless Overseer explicitly narrows the work to non-live UI preparation.

## Feature Anchors

- `docs/features/vision.md` Element 4: Threat Intel
- `docs/features/vision.md` Element 5: Clipboard Acquisition
- `docs/features/vision.md` Element 8: Local Metadata
- `docs/features/vision.md` Element 9: External API Boundary
- `docs/features/clipboard-acquisition.md`
- `docs/audits/audit-2026-05-22-clipboard-acquisition-cooldown-intent.md`

## Operational Outcome

The operator can run a scoped zKill-backed tactical probe through an explicit renderer/service scan request or Clipboard Acquisition. The result shows target, scope, provider, lookback, sample cap, freshness, failure/cap/partial state, and no false certainty.

Implementation note: Electron global shortcut registration uses `Control+\` as the preferred chord with `Control+Alt+Space` fallback status reporting rather than a bare Ctrl+Shift chord. Focused overlay keyboard affordances remain available.

## Task Chain

### Task 1: Search Request Contract

- Status: Complete.
- Define backend Threat Intel scan request and snapshot shape.
- Support target text, target kind when known, input source, lookback seconds, sample limit, and live gate state.
- Keep typed input, pasted input, and clipboard-acquired input on the same request contract.
- Return explicit validation errors for empty, ambiguous, unsupported, or unresolved targets.

Task packet: `docs/gap/complete/threat-intel-scan-request-contract.md`.

### Task 2: Target Resolution Boundary

- Status: Complete.
- Add local/static resolution where practical before live lookup.
- Support system, pilot, corporation, alliance, and copied target text as accepted target categories.
- Preserve unresolved/ambiguous states instead of guessing.
- Do not introduce large metadata imports before a consumer needs them.

Task packet: `docs/gap/complete/threat-intel-target-resolution-boundary.md`.

### Task 3: zKill Scoped Probe

- Status: Complete.
- Add backend-only zKill query/ref normalization for the requested target.
- Use bounded routes with explicit lookback where available.
- Normalize malformed/non-array responses into partial/degraded metadata.
- Include sample count, cap, freshness, provider, endpoint family, and failure metadata.

Task packets:

- `docs/gap/complete/threat-intel-zkill-scoped-probe.md`
- `docs/gap/complete/readiness-05-zkill-ref-boundary.md`
- `docs/gap/complete/readiness-06-threat-intel-sample-metadata.md`

### Task 4: Search UI Surface

- Status: Complete.
- Add a compact search box and result surface.
- Search submits only from explicit user action.
- Search focus alone must not call APIs.
- Optional typed-input debounce remains deferred unless explicitly requested; if later added, it must be visible, cancellable, and live-gated.

Task packet: `docs/gap/complete/threat-intel-search-ui-surface.md`.

### Task 5: Clipboard Acquisition

- Status: Complete with shortcut caveat above.
- Implement hands-free acquisition without requiring AURA-Sense window focus.
- Show visible armed, listening, sealed, and cooldown state.
- Use `Control+\` as the explicit I/O-gated permission action for global acquisition.
- Capture a current valid target immediately from the global permission action when available.
- Open a 3 second clipboard listening window for focused/windowed acquisition or when no valid current target is available.
- Insert a valid captured target into the search box and run the scoped scan.
- Suppress recent duplicate clipboard fingerprints without storing raw clipboard history.
- Seal after capture, timeout, cancellation, or rejected content.
- Enforce a 5 second cooldown after seal before re-arming.

Task packet: `docs/gap/complete/clipboard-acquisition-workflow.md`.

### Task 6: Live IO Gate And Observability

- Status: Complete for gated/offline behavior; live network smoke deferred.
- Use the live IO gate discipline established by Milestone 08.
- Block live zKill calls when live IO is disabled and surface the blocked state.
- Log request attempts and outcomes through backend diagnostics.
- Keep `verify:all` offline.

Task packet: `docs/gap/complete/threat-intel-live-gate-and-observability.md`.

### Task 7: Renderer Boundary Verification

- Status: Complete.
- Verify renderer does not call zKill, ESI, fetch, filesystem, parser, or backend runtime modules directly.
- Verify clipboard listener lifecycle states.
- Verify cooldown behavior.
- Verify no scan runs from focus alone.
- Verify live disabled state blocks request execution.

Task packet: `docs/gap/complete/threat-intel-renderer-boundary-verification.md`.

### Task 8: State And Handover

- Status: Complete.
- Update current-state with implemented scan/acquisition behavior.
- Record explicit deferrals.
- Hand over target categories, request contract, live gate behavior, clipboard lifecycle, verification, and any live smoke evidence.

## Autonomy Envelope

Dev may touch:

- Threat Intel backend service/client code
- target resolution helpers
- zKill client normalization
- live IO gate reuse
- preload/service bridge code
- compact renderer search/acquisition controls
- verification scripts and fixtures
- docs and current-state records

Dev may not:

- add Passive Telemetry auto-scans into Threat Intel
- call live APIs from renderer
- add ESI killmail expansion by default
- add Atlas persistence, queues, reports, watch execution, or evidence stores
- keep clipboard listening after the short armed window
- read clipboard content while I/O authority is off
- store raw clipboard history
- scan on focus alone
- make zKill summaries sound complete

## Acceptance Gate

Milestone 09 is complete when:

- explicit renderer/service scan request can run a scoped zKill-backed probe through backend services
- valid clipboard acquisition can populate search and run the same scoped scan
- listener arms, listens, seals, and enters a 5 second cooldown visibly
- live IO disabled state blocks external calls
- result language shows sample, cap, freshness, partial/failure state, and provider basis
- renderer boundary verification passes
- `npm.cmd run verify:all` passes
- live smoke, if run, is explicit and recorded outside `verify:all`

## Completion Evidence

Verification completed:

```txt
threat intel verified
renderer boundary verified (4 files scanned)
renderer shell verified
all checks verified
```

Electron visual smoke completed:

```txt
AURA-Sense visual smoke passed: F:\Projects\AURA-Sense\.tmp\electron-visual-smoke
clipboard_acquisition_global_shortcut recorded successful registration during milestone smoke
```

Deferred by design:

- live Threat Intel zKill network smoke behind explicit live API enablement
- ESI killmail expansion
- Atlas persistence, evidence queues, reports, and watch execution
- local type metadata until a concrete type-label consumer exists

## Expected Handover

Dev handover should include:

- feature anchors used
- request/snapshot contract
- accepted target categories
- target resolution behavior
- zKill route/lookback/sample cap behavior
- clipboard acquisition lifecycle states
- live gate and blocked response examples
- verification output
- explicit deferrals
