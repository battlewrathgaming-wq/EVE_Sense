# Current Workspace Packet

Status: Active
Updated: 2026-05-27
Owner: Overseer

## Coordination State

Active milestone: M12 - Live Validation And Tactical Calibration
Roadmap source: `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
Current runway: M12I - ADR-0008 I/O Authority Reconciliation
Source of intent:

- Human direction: proceed with the pre-live I/O authority hardening path.
- ADR source: `docs/adr/ADR-0008-io-off-means-no-ingest.md`
- Current-state source: `docs/current-state/current-implementation.md`
- Supporting audit/trace sources:
  - `workspace/SecEngHS52-io-authority-reconciliation-audit.md`
  - `workspace/EngTraceHS53-gamelog-event-spine-trace.md`
  - `workspace/SecEngHS54-ingest-source-defensive-posture-audit.md`
  - `workspace/EngMapHS55-io-authority-state-and-gate-placement.md`

Current executor: Dev
Current status: Ready for Dev
Expected output: `workspace/DevHS56-m12i-io-authority-reconciliation.md`

## Objective

Bring local gamelog/file ingest into alignment with ADR-0008:

```txt
I/O off means Sense is not allowed to ingest.
```

The goal is to enforce I/O authority at the boundary where new outside information enters Sense, while keeping Combat Witness, Passive Telemetry, and other internal computation modules pure over admitted events and existing state.

This is pre-live trust hardening. It is not live/manual smoke, presentation work, adapter work, Combat calibration, or product expansion.

## Ordered Runway

1. Read the required sources:
   - `AGENTS.md`
   - `workspace/current.md`
   - `docs/current-state/current-implementation.md`
   - `docs/adr/ADR-0008-io-off-means-no-ingest.md`
   - `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
   - `workspace/SecEngHS52-io-authority-reconciliation-audit.md`
   - `workspace/EngTraceHS53-gamelog-event-spine-trace.md`
   - `workspace/SecEngHS54-ingest-source-defensive-posture-audit.md`
   - `workspace/EngMapHS55-io-authority-state-and-gate-placement.md`
2. Trace the current local gamelog/file-ingest start, read, parser admission, Combat Witness, and Passive Telemetry mutation path from code before editing.
3. Implement boundary enforcement so `combat.witness.start` / `combatWitnessRuntime.start` cannot start local gamelog ingest while runtime I/O authority is off.
4. Ensure turning I/O off stops or pauses active local gamelog/file ingest before additional file reads can be admitted.
5. Add a no-read or no-admit guard at the local tail/read boundary, with special attention to the path around `readRange`.
6. Add defense-in-depth at runtime event admission so new parser events cannot mutate Combat Witness or Passive Telemetry while I/O is off.
7. Preserve existing provider and Clipboard Acquisition gates, including M12H service-command behavior and I/O-off snapshot shape.
8. Update UI copy and docs only where needed so I/O off is described as no ingest, not only network/clipboard blocked.
9. Add or update deterministic tests proving no-start/no-read/no-mutation behavior while I/O is off.
10. Run required verification and write the expected Dev handoff artifact.

## Acceptance Criteria

M12I is complete when:

- `combat.witness.start` is blocked or safely refused while I/O authority is off.
- Active local gamelog/file ingest is stopped or paused when I/O authority turns off.
- No new local gamelog tail reads are admitted after I/O authority is off.
- New parser events cannot mutate Combat Witness state while I/O authority is off.
- New parser events cannot mutate Passive Telemetry current-system observation while I/O authority is off.
- Provider live gates and Clipboard Acquisition gates remain intact.
- Internal Combat Witness and Passive Telemetry computations remain pure over already-admitted events and existing state; they do not become owners of I/O policy.
- Renderer/preload boundaries still prevent renderer-owned ingest and direct provider/filesystem/parser access.
- UI/docs wording no longer implies I/O off only blocks network or clipboard behavior where that would mislead the operator.
- Deterministic tests cover the I/O-off start/read/admission/mutation cases without using private logs, real clipboard content, live providers, screenshots, or manual operator actions.
- `npm.cmd run verify:all` passes offline, unless a failure is unrelated and clearly documented.
- The Dev handoff records files changed, verification commands/results, remaining risks, and any parked follow-up.

## Guardrails And Non-Goals

- Do not run live/manual EVE gamelog ingestion.
- Do not inspect private/operator EVE log folders.
- Do not capture real clipboard content.
- Do not run manual shortcut validation.
- Do not set `AURA_SENSE_LIVE_API=1`.
- Do not run live zKill or ESI calls.
- Do not run real SDE refresh/download.
- Do not store raw provider bodies, private EVE gamelog lines, clipboard content, private operator paths, screenshots, renderer output, Lab/adapter output, calibration data, fixture intake, or product claims.
- Do not add Atlas persistence or historical storage behavior.
- Do not broaden this into Combat calibration, raw repair/healing fixture intake, Lab presentation, adapter work, or live operator smoke.
- Do not rename source-owned terms.
- Do not change bridge contracts, IPC payload meanings, persistence schemas, or product doctrine unless required by the I/O authority fix and documented.
- Do not make Lab or Atlas terminology authoritative for Sense.

## Stop Conditions

Stop and hand back to Overseer/Human if:

- The implementation requires live/manual/private data to verify the boundary.
- Existing architecture makes it impossible to block local ingest without a broader runtime redesign.
- I/O authority ownership is ambiguous between runtime, service registry, watcher/file-ingest code, Combat Witness, and Passive Telemetry.
- A fix would require changing bridge payload meaning, persistence, renderer doctrine, or product behavior outside ADR-0008.
- Existing deterministic tests contradict the accepted ADR-0008 target.
- A security/privacy concern is found that is larger than local gamelog ingest authority.

## Required Verification

Minimum:

```powershell
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git diff --check
git status --short --branch
```

If `verify:all` is too broad or fails for unrelated reasons, run the narrow relevant deterministic tests as well and document both the narrow result and the broader failure.

Do not run live/manual smoke.

## Handoff Record

Dev must create:

```txt
workspace/DevHS56-m12i-io-authority-reconciliation.md
```

The handoff must include:

- files changed
- code path traced
- gate placement decisions
- tests added/updated
- verification commands and results
- confirmation that no live/manual/private I/O was run
- confirmation that provider and Clipboard Acquisition gates were preserved
- remaining risks or parked follow-up

## Resting Context To Preserve

M12 remains the live/manual validation envelope, but live/manual operator smoke is still gated behind a future active packet and explicit Human authorization.

M12I exists to make the pre-live trust boundary true first. Once accepted, future M12 work can return to operator smoke, Combat calibration, raw repair/healing fixture intake, or live findings review.
