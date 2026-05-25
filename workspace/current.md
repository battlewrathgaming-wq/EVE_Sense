# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M19 - Gamelog Ingest Containment And Fan-Out Assurance
Roadmap source: `docs/roadmap/milestone-19-gamelog-ingest-containment-and-fanout-assurance.md`
Current runway: Gamelog containment hardening implementation
Latest closed milestone: Milestone 18 - Provider Fault-Injection Hardening
Latest accepted closure: `workspace/OverseerHS26-m18-provider-fault-hardening-acceptance.md`
Latest security/engineering review: `workspace/SecEngHS28-gamelog-ingest-containment-review.md`
Latest Overseer acceptance: `workspace/OverseerHS29-m19-containment-review-acceptance.md`
Current executor: Dev
Current status: Open
Expected output: `workspace/DevHS30-gamelog-containment-hardening.md`

## Purpose

Implement the accepted M19 gamelog containment hardening packet.

The goal is to prove, with deterministic fixture-only tests, that the configured gamelog destination and files read by the file monitor cannot escape the accepted EVE gamelog structure or active folder boundary.

Human path context:

```txt
C:\Users\Battle_wrath\Documents\EVE\logs\Gamelogs
```

Expected structure suffix:

```txt
EVE\logs\Gamelogs
```

Implementation should be OS-agnostic where feasible. Do not hard-code the user profile path as the only valid location.

## Required Reading

Boot and coordination:

- `AGENTS.md`
- `workspace/README.md`
- `workspace/overview.md`
- `workspace/current.md`
- `workspace/00-dot-protocol.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `workspace/prompts.md`
- `workspace/overseer.md`

M19 context:

- `docs/roadmap/README.md`
- `docs/roadmap/milestone-19-gamelog-ingest-containment-and-fanout-assurance.md`
- `workspace/OverseerHS27-m19-gamelog-containment-scope.md`
- `workspace/SecEngHS28-gamelog-ingest-containment-review.md`
- `workspace/OverseerHS29-m19-containment-review-acceptance.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`

Implementation surfaces:

- `src/combat/eveLogPaths.js`
- `src/combat/eveGamelogWatcher.js`
- `src/combat/combatLogParser.js`
- `src/combat/lineBuffer.js`
- `src/combat/recentEventDeduper.js`
- `src/combat/combatWitnessRuntime.js`
- `src/combat/combatWitnessService.js`
- `src/passive/passiveTelemetryService.js`
- `src/services/diagnosticsPolicy.js`
- `src/runtime/runtimeSettingsService.js`
- `src/main/main.js`
- `scripts/verify-gamelog-watcher.js`
- `scripts/verify-gamelog-watcher-chaos.js`
- `scripts/verify-combat-parser.js`
- `scripts/verify-combat-parser-hostile.js`
- `scripts/verify-combat-log-replay.js`
- `scripts/verify-diagnostics-policy.js`

## Runway

1. Review HS28 and HS29 to confirm the accepted containment gaps.
2. Add or refine shared gamelog path containment helpers.
3. Encode an accepted gamelog structure policy using the Human-provided `EVE\logs\Gamelogs` suffix as input while keeping implementation OS-agnostic where feasible.
4. Use `realpath`/`lstat`-aware checks where feasible on Windows to reject symlink/junction escapes.
5. Re-check containment after folder/file path joins and before range reads.
6. Add deterministic fixture-only tests for:
   - traversal-resolved folder outside accepted structure
   - symlink/junction directory escape where feasible in the local test environment
   - direct `handleFile` outside-folder calls
   - fs-watch filename values with separator/traversal-like segments
   - symlink `.txt` file escape where feasible
   - same-size/larger replacement identity behavior
7. Preserve existing append, startup-offset, deletion, truncation, partial-line, parser rejection, diagnostics, and listener-isolation behavior.
8. Update docs/testing and current-state docs if behavior or verification changes.
9. Run required verification.
10. Create the expected Dev handoff.

## Acceptance Criteria

The packet is complete when:

- configured gamelog folder containment policy is explicit
- the accepted root/structure policy does not hard-code `C:\Users\Battle_wrath` as the only valid path
- path containment is checked with normalized/real paths where feasible
- file reads are guarded so direct or event-provided paths outside the active folder are skipped/rejected before range reads
- deterministic tests cover traversal, outside-folder `handleFile`, separator-like filenames, and same-size/larger replacement identity behavior
- symlink/junction escape tests are added where feasible, or the Dev handoff clearly explains environment limitations
- existing gamelog watcher/parser/replay/diagnostics behavior remains verified
- no private operator folders, live EVE logs, live providers, manual shortcuts, real SDE refresh, Lab, adapter, renderer, IPC, payload, or UI copy work is included

## Guardrails

- Do not inspect private operator log folders.
- Do not hard-code `C:\Users\Battle_wrath` as the only accepted path.
- Do not manually probe outside repository/temp fixture paths.
- Do not run live EVE log ingestion.
- Do not run live provider smoke.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not adopt a Lab face.
- Do not implement adapter work.
- Do not create additional Lab-facing display requests.
- Do not change renderer behavior.
- Do not change IPC, payload schemas, service semantics, lane meanings, or UI copy unless a security defect cannot be fixed otherwise and Overseer accepts the scope.

## Stop Conditions

Stop and hand off if:

- containment policy requires product direction beyond the accepted `EVE\logs\Gamelogs` structure input
- symlink/junction testing requires elevated privileges or filesystem changes outside repo/temp fixture paths
- hardening requires broad runtime settings or UI changes
- the fix would require live EVE logs or private operator folders
- the work would require Lab repository changes

## Required Verification

Run:

```powershell
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:gamelog-watcher-chaos
npm.cmd run verify:combat-parser
npm.cmd run verify:combat-parser-hostile
npm.cmd run verify:combat-replay
npm.cmd run verify:diagnostics
npm.cmd run verify:protected-terms
npm.cmd run verify:all
git status --short --branch
```

Do not run live/manual/private filesystem validation.

## Handoff Requirements

Create:

```txt
workspace/DevHS30-gamelog-containment-hardening.md
```

The handoff should include:

1. Files changed.
2. Containment policy implemented.
3. Path/file read hardening summary.
4. Replacement identity behavior.
5. Symlink/junction test decision and limitations, if any.
6. Verification commands and results.
7. Confirmation that no live/private/manual/Lab/renderer work was included.
8. Residual risks or follow-up recommendations.

## Overseer Review

Pending. This packet is open for Dev.
