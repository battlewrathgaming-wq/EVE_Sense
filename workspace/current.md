# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: None - post-Milestone-14 audit-support / feature-view audit
Current runway: Display Inventory Pipeline Audit
Current runway packet: `workspace/OverseerHS11-display-inventory-pipeline-audit-runway.md`
Latest closed milestone: Milestone 14 - Back-Page Threat Intel UX
Latest accepted closure: `workspace/complete/milestone-14/OverseerHS03-milestone-14-closure.md`
Latest prototype acceptance: `workspace/OverseerHS10-passive-telemetry-instrument-band-prototype-review.md`
Latest display inventory scaffold: `workspace/display_inventory.md`
Current executor: Product development systems auditor
Current audit focus: Read-only Ingest -> Transformation -> Bridge -> User Display audit
Expected output: `workspace/DisplayInventoryAuditHS01-ingest-transform-bridge-display.md`

## Purpose

Open a bounded, read-only audit that maps currently user-facing Sense information from the start of the pipeline through display:

```txt
Ingest -> Transformation -> Bridge -> User Display
```

This packet exists so Sense can decide what should remain visible, collapse, move, hide, or become a later scoped Lab `request_display` candidate.

This is not implementation work, UI redesign, terminology rename work, Lab adoption, a Dev runway, a bridge contract, or a request queue.

Authority split:

```txt
Sense owns internal -> Bridge meaning.
Lab owns Bridge -> Interface presentation terminology where Sense meaning is preserved and no Human/Sense conflict exists.
Shared spelling does not imply shared meaning.
```

## Required Reading

- `AGENTS.md`
- `workspace/current.md`
- `workspace/overview.md`
- `workspace/display_inventory.md`
- `workspace/request_display.md`
- `workspace/display-request-workflow-hardening-contract.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/OverseerHS11-display-inventory-pipeline-audit-runway.md`
- `docs/current-state/current-implementation.md`
- `docs/schemas/hud-snapshot.md`
- `docs/contracts/renderer-boundary-contract.md`
- `docs/contracts/telemetry-lane-contract.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/contracts/threat-intel-contract.md`
- `docs/features/clipboard-acquisition.md`
- `src/renderer/index.html`
- `src/renderer/app.js`
- `src/main/preload.js`
- `src/main/main.js`
- `src/services/serviceRegistry.js`
- `src/services/taskRunner.js`
- `src/combat/`
- `src/passive/`
- `src/threat/`
- `src/runtime/`

Optional review context, not active task queues:

- `workspace/archive/SenseTerminologyStateBridgeAudit-2026-05-24.md`
- `workspace/OverseerHS05-sense-terminology-alignment-review.md`
- `workspace/SYSADHS01-protected-terms-sniffer-tune.md`
- `docs/audits/` only when needed to explain current visible wording

## Ordered Runway

1. Read the required files and confirm Sense ownership of internal -> Bridge meaning, source terms, data meaning, lane/state semantics, runtime behavior, and final adoption.
2. Confirm Lab's role is Bridge -> Interface display comparison only, with no ownership of Sense terms, backend behavior, contracts, payloads, or adoption.
3. Trace each lane separately where applicable:
   - Combat Witness
   - Passive Telemetry
   - Threat Intel
   - Clipboard Acquisition
   - Runtime diagnostics / settings
4. For each currently user-facing surface or target-like concept, map:
   - Ingest
   - Transformation
   - Bridge
   - User Display
   - Source Terms
   - Display Role
   - Visibility Decision
   - Risks / Notes
   - Candidate `request_display?`
5. Pay special attention to:
   - observed source
   - observed weapon
   - current system
   - manual Threat Intel target
   - clipboard-acquired target
   - target type
   - provider sample target
   - local/static resolver match
6. Write the expected artifact:
   - `workspace/DisplayInventoryAuditHS01-ingest-transform-bridge-display.md`
7. Include both:
   - the required Markdown audit table
   - a qualitative audit summary with top overload causes, safest Lab candidates, preserved terms, Sense-owned surfaces, metadata leaks, better-display-not-deletion items, risks, parked items, and recommended next bounded action
8. Run warning-only terminology verification:
   - `npm.cmd run verify:protected-terms`
9. Report a limited response with artifact path, files reviewed count, table row count, top 3 risks, and verification status.

## Guardrails

- Do not implement code.
- Do not edit files other than the expected audit artifact unless Human/Overseer explicitly redirects.
- Do not rename terms.
- Do not change UI copy.
- Do not change contracts, IPC, payloads, persistence, schemas, services, backend behavior, provider behavior, or runtime behavior.
- Do not create a Dev runway.
- Do not send Lab requests automatically.
- Do not treat archived docs as active task queues.
- Do not import Atlas historical proof, search-candidate, tracking, assessment, durable-output, or storage semantics into Sense.
- Do not treat Lab vocabulary as Sense authority.
- Do not collapse Combat Witness, Passive Telemetry, Threat Intel, and Clipboard Acquisition boundaries.
- Do not run live provider smoke.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.

## Stop Conditions

Return to the Human / Overseer before continuing if:

- the audit requires product direction beyond display inventory mapping
- a finding appears to require code, UI copy, bridge, IPC, payload, schema, service, persistence, provider, or runtime behavior changes
- a Lab request would need to be submitted to continue
- more than inventory/request-display scoping is needed
- lane boundaries cannot be preserved
- archived docs would have to be treated as active work
- Atlas or Lab semantics are needed to define Sense meaning

## Verification Required

Run:

```powershell
npm.cmd run verify:protected-terms
```

This is warning-only review input. Do not rename terms or update protected-word JSON from the output.

## Expected Output

Create:

```txt
workspace/DisplayInventoryAuditHS01-ingest-transform-bridge-display.md
```

The artifact should include:

- files reviewed
- audit table
- qualitative audit summary
- top 5 display overload causes
- top 5 safest future Lab `request_display` candidates
- source-owned terms that must be preserved
- surfaces that must stay Sense-owned
- backend/runtime metadata currently visible in primary UI
- information that needs better display, not deletion
- terminology or ownership risks
- parked or unknown items
- recommended next bounded action
- verification result

## Audit Support

Auditor fills this after completion.

## Overseer Review

Overseer fills this after audit handoff.
