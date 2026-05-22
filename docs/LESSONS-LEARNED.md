# Lessons Learned

Source: review of Atlas audit logs and `docs/failures`.
Date: 2026-05-22

This note captures reusable anticipation guidance for AURA-Sense and future Aura projects. Atlas remains a donor of discipline, not a domain model to copy wholesale.

## 1. Define The Source Of Truth Before The UI Becomes Persuasive

Atlas drifted when convenient zKill summaries could be stored or presented like tactical truth before the evidence model was strict.

Aura projects should define, in writing, what counts as a durable fact before building attractive views around provisional data. Preview, discovery, cache, report, observation, and assessment layers need distinct names.

Anticipation rule:

- If a surface is not authoritative, label it as preview, provenance, candidate, or observation.
- Do not let convenient upstream summaries become the project's durable record.
- Make derived outputs rebuildable from the stored source of truth.

## 2. Treat Re-Ingestion And Reprocessing As Audit Risks

Atlas found a raw evidence upsert that could silently replace existing evidence fields on conflict. The fix preserved original evidence, updated only provenance, and warned on checksum mismatch.

Aura projects should assume repeated imports, repeated sync, and repeated processing will happen. Conflict behavior must be deliberate.

Anticipation rule:

- Decide which fields are immutable before writing upserts.
- Preserve original durable records unless a migration or correction workflow explicitly says otherwise.
- Add checksums for payloads where auditability matters.
- Test idempotent reruns with changed input, not only identical input.

## 3. Separate Human Inputs From Durable Anchors

Atlas correctly treated IDs as facts, then initially over-applied that principle at the user boundary. Humans entered names; the system needed an explicit typed resolution stage.

Aura projects should distinguish human-friendly input from durable internal identity without making either one pretend to be the other.

Anticipation rule:

- Accept labels where users naturally think in labels.
- Resolve labels into durable anchors before mutation, collection, or reporting.
- Require enough type/context to avoid guessing.
- Keep labels as presentation metadata, not replacements for durable anchors.

## 4. Keep Provenance Out Of Evidence Scope

Atlas repeatedly guarded the difference between what the data describes and how the data entered the corpus. Collection route, run ID, queue source, and API counts are provenance. They are not necessarily the report scope.

Aura projects should design reports around the subject being described, then show provenance separately.

Anticipation rule:

- Use run reports to answer "what happened during this operation?"
- Use evidence or observation reports to answer "what stored data exists for this scope?"
- Do not filter meaning by collection route unless the report is explicitly about collection.

## 5. Staged Work Beats Hidden Coupling

Atlas became safer when collection was formalized as stages: plan, discover, queue, select, expand, normalize, report. Manual discovery proved that "found a reference" is not the same as "created evidence."

Aura projects should make staged workflows explicit early, especially where external calls, user review, or costly processing are involved.

Anticipation rule:

- Persist queue or candidate state separately from accepted records.
- Add selection and cap policies before bulk execution.
- Keep preview metadata non-authoritative.
- Verify each stage can run without accidentally performing the next stage.

## 6. Service Boundaries Protect Future UI Work

Atlas audits repeatedly warned that the renderer must call services, not repositories, workers, raw SQLite, CLI scripts, or external clients. The service registry became the boundary that made UI work governable.

Aura projects should add a service boundary before the renderer grows habits.

Anticipation rule:

- UI and CLI surfaces request commands.
- Services own mutation and orchestration.
- Unknown commands fail closed.
- Long-running or mutating commands are task-shaped.
- Static verification should check that UI code uses the approved bridge.

## 7. Passive Views Must Not Cause Live Work

Atlas protected readiness pages, queue views, watch status, reports, and app startup from triggering live collection. Live work stayed explicit, gated, and task-wrapped.

Aura projects should assume passive UI refreshes will become frequent. They must stay cheap and non-mutating.

Anticipation rule:

- App startup should not trigger external collection.
- Status and preview views should not mutate durable state unless explicitly designed to do so.
- Live/API commands need an explicit gate and clear operator action.
- Live smoke tests should use disposable state and record both success and failure behavior.

## 8. Task Wrapping Is Not Process Isolation

Atlas detached tasks prevented long IPC waits, but synchronous database and CPU-heavy work still ran in the Electron main process. The audits deferred process isolation until measured pressure appeared.

Aura projects should gain task visibility early without pretending it solves every runtime issue.

Anticipation rule:

- Use tasks for progress, warnings, cancellation, and lock discipline.
- Watch for measured UI stalls, large imports, report generation, and compaction as future isolation candidates.
- Do not split processes before ownership and write authority are clear.
- Preserve one obvious mutation authority until there is a real reason to complicate it.

## 9. Destructive Work Requires Preservation Design First

Atlas kept retention/pruning blocked until assessment artifacts, compaction preflight, preservation preview, confirmation, and deletion verification were specified.

Aura projects should not add deletion just because storage grows.

Anticipation rule:

- Preview destructive impact before execution.
- Require explicit confirmation for destructive actions.
- Preserve assessment or summary artifacts before pruning source records, if pruning is ever allowed.
- Verify that deletion cannot happen silently or from passive views.

## 10. Verification Should Become A Product Habit

Atlas improved when individual checks were grouped into safe offline suites and live checks were kept separate. Audits became credible because they named verification signals.

Aura projects should treat verification scripts as part of the project interface, not just local convenience.

Anticipation rule:

- Keep `verify:all` offline and safe.
- Separate live smoke behind explicit environment gates.
- Add narrow verification scripts for each boundary: service registry, task runner, taxonomy, renderer bridge, idempotency, and destructive preflight.
- Preserve stale audits as snapshots, but mark them superseded when newer decisions replace them.

## 11. Documentation Is Operational Memory

Atlas' strongest reusable asset is not the EVE-specific implementation. It is the habit of recording tenets, ADRs, contracts, failures, current state, gaps, and audits as the system evolves.

AURA-Sense should carry that habit forward.

Anticipation rule:

- Write contracts before broad implementation.
- Move completed gaps to `docs/gap/complete` with their completion signal.
- Record failure classes while the pain is fresh.
- Use current-state notes to prevent old assumptions from masquerading as current truth.

## Carry Forward Into AURA-Sense

Keep:

- documentation structure and stateful documentation discipline
- command/service boundary
- task lifecycle, progress, warnings, cancellation, and lock classes
- message taxonomy
- HTTP timeout, retry, cancellation, injected fetch, and log hook pattern
- small pure utilities such as stable checksums and streaming JSONL, when useful

Avoid by default:

- Atlas persistence schema
- Atlas renderer and report implementation
- watch executor semantics
- retention model
- domain-specific reference datasets
- Atlas-specific evidence, queue, SDE, ESI, or zKill assumptions

Final seed rule:

Aura projects should inherit Atlas' anticipation discipline, not Atlas' implementation weight.

## 12. Optional Chaining Is Not A Null Guard For Later Dereferences

AURA-Sense exposed a reusable Frame module bug that also existed in Aura Core. The code checked `state.bounds?.x !== null`, which looks defensive but evaluates true when `state.bounds` is `null` because optional chaining returns `undefined`, and `undefined !== null` is true. The next lines then dereferenced `state.bounds.x` before `BrowserWindow` construction.

Aura projects should treat optional chaining as a value access convenience, not as proof that the parent object exists for later use.

Anticipation rule:

- When later code dereferences the parent object, guard the parent explicitly first.
- Prefer `state.bounds && state.bounds.x !== null && state.bounds.y !== null` for nullable object guards.
- Add regression tests for null object state, not just valid object state.
- Base modules should carry the regression check so downstream projects inherit the fix.
- If smoke fails before a window is created, inspect reusable shell modules before blaming Electron installation.

