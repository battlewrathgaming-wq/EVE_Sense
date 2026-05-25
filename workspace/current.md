# Current Workspace Packet

Status: Active
Updated: 2026-05-25
Owner: Overseer

## Coordination State

Active milestone: M19 - Gamelog Ingest Containment And Fan-Out Assurance
Roadmap source: `docs/roadmap/milestone-19-gamelog-ingest-containment-and-fanout-assurance.md`
Current runway: Review-only security/engineering assurance for gamelog ingest containment, parser normalization, and shared fan-out
Latest closed milestone: Milestone 18 - Provider Fault-Injection Hardening
Latest accepted closure: `workspace/OverseerHS26-m18-provider-fault-hardening-acceptance.md`
Latest scope opening: `workspace/OverseerHS27-m19-gamelog-containment-scope.md`
Current executor: Security/Engineering-Test reviewer
Current status: Open
Expected output: `workspace/SecEngHS28-gamelog-ingest-containment-review.md`

## Purpose

Run a review-only assurance pass over the AURA-Sense gamelog ingest trust boundary:

```txt
configured/pointed log destination
-> path validation and containment
-> file-monitor filesystem access
-> parser normalization
-> shared event fan-out
-> listening services
```

The core security question is whether any configured path, symlink, junction, traversal, rotation, replacement file, or malformed input could cause Sense to read outside the expected EVE gamelog file structure, leak raw/private file contents, or poison downstream services.

This packet is review-only. It does not authorize Dev work.

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
- `workspace/OverseerHS27-m19-gamelog-containment-scope.md`

M19 direction:

- `docs/roadmap/README.md`
- `docs/roadmap/milestone-19-gamelog-ingest-containment-and-fanout-assurance.md`
- `docs/current-state/current-implementation.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `package.json`

Implementation and test surfaces to identify and inspect:

- gamelog file-monitor source files
- combat parser source files
- combat replay/runtime/service fan-out files
- diagnostics policy files
- runtime settings/log path validation files
- service listener/subscription files
- existing gamelog file-monitor, parser, replay, and diagnostics verification scripts

Use `rg` / `rg --files` to locate the exact source files before reviewing. Do not inspect outside AURA-Sense except the explicitly listed shared coordination files already referenced by project boot docs.

## Review Tasks

1. Map the ingest path from configured/pointed destination through file-monitor filesystem access.
2. Identify path validation, normalization, and containment assumptions.
3. Review whether selected folders/files can escape the intended EVE gamelog structure through traversal, symlink, junction, rotation, replacement, deletion, truncation, or startup-offset behavior.
4. Review parser rejection behavior for malformed, oversized, private-content lookalike, partial-line, and near-miss lines.
5. Review raw-line handling and diagnostics sanitization.
6. Map the shared event fan-out channel and identify which services listen.
7. Review listener isolation: one bad line/file/event should not poison all services.
8. Map existing deterministic tests to the trust boundary.
9. Identify missing deterministic adversarial tests and rank them by risk.
10. Produce the expected review artifact with findings, risks, and recommended next bounded packet if any.

## Acceptance Criteria

The review is complete when `workspace/SecEngHS28-gamelog-ingest-containment-review.md`:

- lists files reviewed
- maps the current ingest/fan-out path
- identifies current path containment assumptions
- reviews symlink/junction/traversal/rotation/replacement/deletion/truncation/startup-offset behavior
- reviews parser rejection and diagnostics sanitization
- identifies services listening to the shared channel
- states whether current deterministic tests cover containment or only file-monitor/parser behavior
- lists missing deterministic adversarial tests, if any
- recommends one bounded next packet or says no follow-up is needed
- does not implement code or run live/manual/private filesystem work

## Guardrails

- Do not implement code in this packet.
- Do not edit source files, contracts, IPC, payloads, persistence, schemas, services, backend behavior, provider behavior, shortcut behavior, or UI copy.
- Do not inspect private operator log folders.
- Do not manually probe outside repository/temp fixture paths.
- Do not run live EVE log ingestion.
- Do not run live provider smoke.
- Do not run manual shortcut validation.
- Do not run real SDE refresh/download.
- Do not adopt a Lab face.
- Do not implement adapter work.
- Do not create additional Lab-facing display requests.
- Do not change renderer behavior.
- Treat archived docs as historical context only unless this packet explicitly references them.

## Stop Conditions

Stop and hand off if:

- the review requires private operator files or live EVE logs
- containment behavior cannot be determined from current code/tests without manual probing outside the repo/temp fixtures
- the review discovers a likely security defect requiring Dev scoping
- the work would require Lab repository changes
- the work would require live provider, manual shortcut, or real SDE actions

## Required Verification

Run:

```powershell
npm.cmd run verify:protected-terms
git status --short --branch
```

Optional deterministic context checks:

```powershell
npm.cmd run verify:gamelog-watcher
npm.cmd run verify:gamelog-watcher-chaos
npm.cmd run verify:combat-parser
npm.cmd run verify:combat-parser-hostile
npm.cmd run verify:combat-replay
npm.cmd run verify:diagnostics
```

Do not run live/manual/private filesystem validation.

## Handoff Requirements

Create:

```txt
workspace/SecEngHS28-gamelog-ingest-containment-review.md
```

The handoff should include:

1. Files reviewed.
2. Current ingest/fan-out path map.
3. Path containment findings.
4. Symlink/junction/traversal and rotation/replacement findings.
5. Parser rejection and raw-line handling findings.
6. Diagnostics sanitization findings.
7. Shared fan-out listener map.
8. Existing deterministic test map.
9. Missing adversarial tests.
10. Risks/blockers.
11. Recommended next bounded packet, if any.

## Overseer Review

Pending. This packet is open for Security/Engineering-Test review.
