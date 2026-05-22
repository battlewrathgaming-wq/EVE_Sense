# Milestone 09: Scoped Threat Intel And Clipboard Acquisition

Status: Queued After Milestone 08
Date: 2026-05-22
Owner: Overseer direction, Dev execution

## Vision Setting

Milestone 09 gives the operator a deliberate tactical scan lane without turning AURA-Sense into a background intelligence collector.

The search box is the Threat Intel boundary. Clipboard Acquisition is the hands-free input path for fullscreen EVE use. Both paths must produce the same scoped Threat Intel request shape and the same evidence-basis language.

Do not start this milestone until Passive Telemetry live-safe readiness has cleared, unless Overseer explicitly narrows the work to non-live UI preparation.

## Feature Anchors

- `docs/features/vision.md` Element 4: Threat Intel
- `docs/features/vision.md` Element 5: Clipboard Acquisition
- `docs/features/vision.md` Element 8: Local Metadata
- `docs/features/vision.md` Element 9: External API Boundary
- `docs/features/clipboard-acquisition.md`
- `docs/audits/audit-2026-05-22-clipboard-acquisition-cooldown-intent.md`

## Operational Outcome

The operator can run a scoped zKill-backed tactical probe by submitting a search target or by using Ctrl+Shift clipboard acquisition. The result shows target, scope, provider, lookback, sample cap, freshness, failure/cap/partial state, and no false certainty.

## Task Chain

### Task 1: Search Request Contract

- Define backend Threat Intel scan request and snapshot shape.
- Support target text, target kind when known, input source, lookback seconds, sample limit, and live gate state.
- Keep typed input, pasted input, and clipboard-acquired input on the same request contract.
- Return explicit validation errors for empty, ambiguous, unsupported, or unresolved targets.

### Task 2: Target Resolution Boundary

- Add local/static resolution where practical before live lookup.
- Support system, pilot, corporation, alliance, and copied target text as accepted target categories.
- Preserve unresolved/ambiguous states instead of guessing.
- Do not introduce large metadata imports before a consumer needs them.

### Task 3: zKill Scoped Probe

- Add backend-only zKill query/ref normalization for the requested target.
- Use bounded routes with explicit lookback where available.
- Normalize malformed/non-array responses into partial/degraded metadata.
- Include sample count, cap, freshness, provider, endpoint family, and failure metadata.

### Task 4: Search UI Surface

- Add a compact search box and result surface.
- Search submits only from explicit user action.
- Search focus alone must not call APIs.
- Optional typed-input debounce remains deferred unless explicitly requested; if later added, it must be visible, cancellable, and live-gated.

### Task 5: Clipboard Acquisition

- Implement Ctrl+Shift hands-free acquisition without requiring AURA-Sense window focus.
- Show visible armed, listening, sealed, and cooldown state.
- Open a 3 second clipboard listening window.
- Insert a valid captured target into the search box and run the scoped scan.
- Seal after capture, timeout, cancellation, or rejected content.
- Enforce a 5 second cooldown after seal before re-arming.

### Task 6: Live IO Gate And Observability

- Use the live IO gate discipline established by Milestone 08.
- Block live zKill calls when live IO is disabled and surface the blocked state.
- Log request attempts and outcomes through backend diagnostics.
- Keep `verify:all` offline.

### Task 7: Renderer Boundary Verification

- Verify renderer does not call zKill, ESI, fetch, filesystem, parser, or backend runtime modules directly.
- Verify clipboard listener lifecycle states.
- Verify cooldown behavior.
- Verify no scan runs from focus alone.
- Verify live disabled state blocks request execution.

### Task 8: State And Handover

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
- scan on focus alone
- make zKill summaries sound complete

## Acceptance Gate

Milestone 09 is complete when:

- explicit search submit can run a scoped zKill-backed probe through backend services
- valid Ctrl+Shift clipboard acquisition can populate search and run the same scoped scan
- listener arms, listens, seals, and enters a 5 second cooldown visibly
- live IO disabled state blocks external calls
- result language shows sample, cap, freshness, partial/failure state, and provider basis
- renderer boundary verification passes
- `npm.cmd run verify:all` passes
- live smoke, if run, is explicit and recorded outside `verify:all`

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

