# OverseerHS11: Display Inventory Pipeline Audit Runway

Status: Active advisory audit runway
Date: 2026-05-25
Owner: AURA-Sense Overseer

## Purpose

Open a bounded, read-only audit-support / feature-view audit for AURA-Sense display inventory.

The audit should trace current user-facing information from the start of each relevant pipeline:

```txt
Ingest -> Transformation -> Bridge -> User Display
```

This is not a Dev runway, UI redesign, terminology rename pass, Lab adoption decision, bridge contract, or implementation packet.

## Expected Artifact

Create:

```txt
workspace/DisplayInventoryAuditHS01-ingest-transform-bridge-display.md
```

## Role

Product development systems auditor for AURA-Sense.

The auditor should map what is visible today, why it is visible, how it reached the interface, and whether it should remain visible, collapse, move, hide, or become a later scoped `request_display` candidate.

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

## Required Scope

Trace each lane separately where applicable:

- Combat Witness
- Passive Telemetry
- Threat Intel
- Clipboard Acquisition
- Runtime diagnostics / settings

Pay special attention to target-like concepts:

- observed source
- observed weapon
- current system
- manual Threat Intel target
- clipboard-acquired target
- target type
- provider sample target
- local/static resolver match

The audit should identify:

- what is currently user-facing
- where it is visible
- what data/source it comes from
- how it is transformed before display
- how it crosses the bridge/preload/IPC/service boundary
- what source-owned terms must be preserved
- what backend/runtime metadata has leaked into primary UI
- what needs better display, not deletion
- what could later become a scoped Lab `request_display` entry

## Required Audit Table

Create a Markdown table with these columns:

| Surface / Use Case | Ingest | Transformation | Bridge | User Display | Source Terms | Display Role | Visibility Decision | Risks / Notes | Candidate request_display? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Definitions:

- Ingest: where information enters Sense or is first read.
- Transformation: how it is parsed, processed, derived, normalized, resolved, enriched, summarized, sampled, capped, or classified.
- Bridge: how it crosses into renderer/interface space, including preload API, IPC/event channel, service command, snapshot payload, renderer state, task state, or diagnostics state.
- User Display: where/how the user sees it today.
- Source Terms: Sense-owned terms that must be preserved.
- Display Role: use Sense-local roles from `workspace/display_inventory.md` where available, such as `tactical-primary`, `tactical-context`, `deliberate-inspection`, `acquisition-control`, `authority-control`, `source-basis`, `uncertainty-state`, `diagnostic-support`, `setup-control`, `internal-hidden`, or `lab-display-candidate`.
- Visibility Decision: `operator-facing`, `point-of-need`, `provenance-detail`, `diagnostic-only`, `hidden/internal`, `Lab display candidate`, or `parked`.
- Risks / Notes: overload, terminology collision, missing basis/freshness, misleading state, hidden live/API implication, Atlas semantic drift, Lab vocabulary drift, or lane-boundary confusion.
- Candidate request_display?: `yes`, `no`, or `parked`, with short reason. Do not create the request.

## Required Qualitative Audit Summary

After the table, include:

1. Files reviewed.
2. Current-state understanding.
3. Top 5 display overload causes.
4. Top 5 safest future Lab `request_display` candidates.
5. Source-owned terms that must be preserved.
6. Surfaces that must stay Sense-owned.
7. Backend/runtime metadata currently visible in primary UI.
8. Information that needs better display, not deletion.
9. Terminology or ownership risks.
10. Parked or unknown items.
11. Recommended next bounded action.

## Guardrails

- Do not implement code.
- Do not edit files other than the expected artifact.
- Do not rename terms.
- Do not change UI copy.
- Do not change contracts, IPC, payloads, persistence, schemas, services, backend behavior, provider behavior, or runtime behavior.
- Do not create a Dev runway.
- Do not send Lab requests automatically.
- Do not treat archived docs as active task queues.
- Do not import Atlas historical proof, search-candidate, tracking, assessment, durable-output, or storage semantics into Sense.
- Do not treat Lab vocabulary as Sense authority.
- Do not collapse Combat Witness, Passive Telemetry, Threat Intel, and Clipboard Acquisition boundaries.

## Verification

No code verification is required.

If the artifact is written, run:

```powershell
npm.cmd run verify:protected-terms
```

Treat output as warning-only review input. Do not rename anything from the output, and do not update protected-word JSON.

## Expected Limited Response

Return only:

- artifact path
- files reviewed count
- table row count
- top 3 risks
- whether verification was run

## Acceptance Check

The audit is acceptable if it:

- traces user-facing information from ingest through transformation, bridge, and user display
- keeps Sense source ownership explicit
- separates lanes instead of blending target-finding concepts
- identifies candidate `request_display` surfaces without creating active Lab requests
- includes a qualitative audit summary, not only a table
- preserves current product behavior and terminology
