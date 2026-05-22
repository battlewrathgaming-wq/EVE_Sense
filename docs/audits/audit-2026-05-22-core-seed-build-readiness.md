# Audit: Core Seed Build Readiness

Date: 2026-05-22
Scope: Aura Core seed readiness for future Aura projects, including code review of services, utilities, renderer shell, verification scripts, and documentation workflow.

## Verdict

Aura Core is ready to build from as a neutral seed, with caveats.

It has the right bones:

- stateful documentation structure
- Overseer/Dev workflow ADR
- lessons learned from Atlas
- small pure utilities
- service registry
- task runner
- message taxonomy
- HTTP client wrapper
- minimal Electron shell
- fixture-first verification

It is not yet ready to become a serious domain application without a short hardening pass. The next work should not add product features immediately. It should close a few seed-level gaps that future Aura projects will otherwise rediscover.

## Findings

### P1: Service task wrapping hides handler-declared partial/capped status

File: `src/services/serviceRegistry.js:50`

When `registry.invoke(..., { asTask: true })` wraps a command as a task, the wrapper always returns:

```js
return { status: 'succeeded', data };
```

That means a service handler cannot naturally return `partial`, `capped`, or another supported task status through the registry path. The lower-level `TaskRunner` supports these states, but the service boundary currently flattens them to success.

Why it matters:

- future collection/import/compute commands may need `partial` or `capped`
- UI task history could overstate success
- warning/cap semantics become harder to trust

Recommended fix:

- allow a handler result shaped like `{ status, data }` to pass its status through
- keep plain return values as succeeded data
- add service-registry verification for `partial` and `capped` task results

### P2: Renderer sample uses `innerHTML` for service list entries

File: `src/renderer/app.js:12`

The renderer inserts service names and classifications using a template string assigned to `innerHTML`.

Today those values are internal and low risk. As a seed, though, service commands are precisely where future projects will add names from their own modules or plugins. This is an avoidable footgun.

Recommended fix:

- build the `strong` and `span` nodes explicitly
- assign `textContent` for command and classification
- extend `verify:renderer-shell` to reject `innerHTML` in the seed renderer unless explicitly waived

### P2: No readiness/path service beyond `seed.health`

File: `src/services/serviceRegistry.js:69`

The default service registry exposes `seed.health`, `util.checksum`, `task.list`, and `task.cancel`. That is enough for a tiny shell, but future Aura projects will immediately need a neutral readiness command.

Recommended service:

```txt
seed.readiness
```

It should report:

- app name/version
- project root
- temp root
- whether temp paths are creatable
- registered command count
- runtime warnings in taxonomy shape

Why it matters:

- every Aura project needs a first safe status surface
- app startup should have a non-mutating readiness check
- path policy should be visible before downloads, caches, imports, or persistence exist

### P2: No standard command validation hook

File: `src/services/serviceRegistry.js:10`

The registry validates that a command and handler exist, but it does not provide a standard payload validation hook. Future services can validate manually, but the seed does not guide that habit yet.

Recommended fix:

- allow optional `validate(payload, context)` in command definitions
- run validation before task wrapping begins
- normalize validation failures into taxonomy-compatible `VALIDATION_FAILED` errors
- add a verification case for rejected payloads

### P2: External IO classification is not enough for commands that fetch and then mutate

File: `src/services/taskRunner.js:237`

Current lock classes are intentionally simple:

- `read-only`
- `local-mutation`
- `external-io`
- `destructive`
- `exclusive`

`external-io` locks only `external:<scope>`. If a future command performs external IO and then writes local state, the classification name may invite accidental under-locking.

Recommended fix:

- document that commands which fetch and then mutate should use `local-mutation`, `exclusive`, or a project-defined lock policy
- consider adding a seed classification such as `EXTERNAL_MUTATION`
- alternatively allow custom `lockKeys` in task definitions

### P3: HTTP success logging happens before JSON parse succeeds

File: `src/services/httpClient.js:45`

The HTTP client logs a successful status before reading and parsing the response body. If body parsing fails, logs can contain both an apparent success and later failure/retry signal.

Recommended fix:

- parse the body before logging success
- treat JSON parse failures as non-retryable unless the caller opts into parse retries
- add verification for invalid JSON response behavior

### P3: Renderer verification is useful but shallow

File: `scripts/verify-renderer-shell.js:12`

The renderer shell verification uses string checks for `contextIsolation`, preload exposure, service channel usage, and seed health. That is good as a cheap boundary guard, but it will not catch rendering failures, layout issues, or unsafe DOM patterns like the current `innerHTML`.

Recommended fix:

- extend static checks for banned renderer patterns
- add an Electron smoke script when UI work begins
- keep app smoke separate from `verify:all` if it is slow or environment-sensitive

### P3: Documentation structure is strong, but audit templates do not yet encode review severity

File: `docs/templates/AUDIT-TEMPLATE.md`

The audit template is intentionally compact. For code-review audits, it should encourage severity-ranked findings so future sessions know what blocks work and what is advisory.

Recommended fix:

- add optional `Findings`, `Readiness Verdict`, `Verification`, and `Recommended Next Gaps` sections to the audit template

## Readiness By Area

### Documentation

Status: Ready.

The seed has enough doctrine to guide future projects:

- `docs/LESSONS-LEARNED.md`
- `docs/adr/ADR-0001-overseer-dev-handshake-workflow.md`
- `docs/statements/seed-doctrine.md`
- `docs/contracts/service-command-contract.md`
- `docs/current-state/seed-current-state.md`

Recommended addition:

- update `docs/templates/AUDIT-TEMPLATE.md` for severity-ranked review output

### Core Utilities

Status: Ready for seed use.

Current utilities are small and domain-light:

- stable checksum
- JSONL reader
- temp path helpers

Recommended additions before data-heavy work:

- safe JSON file read/write helper with atomic write option
- path guard helper that verifies outputs remain under project root or configured writable roots
- fixture loader helper for verification scripts

### Service Registry

Status: Ready with one early fix needed.

The registry shape is right. Fix task status propagation before building long-running feature commands.

Recommended additions:

- payload validation hook
- service error normalization helper
- command metadata fields for `requiresExternal`, `mutates`, or `dangerous` if future UI needs action gating

### Task Runner

Status: Ready for initial build use.

The task runner has useful states, progress, warnings, cancellation, recent history, and lock classes.

Recommended additions before heavier workflows:

- custom lock key support or `external-mutation` classification
- verification for cancelled detached tasks that emit progress before abort
- optional persistent task history only when a project needs it

### Message Taxonomy

Status: Ready.

The taxonomy is neutral and useful. Future projects should add codes as domain behavior appears, not pre-seed a giant list.

Recommended addition:

- helper for converting thrown errors into taxonomy messages at service boundaries

### HTTP Client

Status: Ready for cautious use after parse/logging hardening.

The important principles are present:

- timeout
- cancellation
- retry
- injected fetch
- User-Agent
- request log hook

Recommended additions:

- parse-before-success-log
- invalid JSON verification
- optional `text` or `request` method if a future project needs non-JSON APIs

### Electron Shell

Status: Ready as a minimal shell, not as a product UI.

The shell correctly uses preload, context isolation, and service calls. It should be hardened before domain UI work.

Recommended additions:

- remove renderer `innerHTML`
- static banned-pattern checks
- optional smoke script for launching Electron when UI work begins

### Verification

Status: Ready for seed confidence.

`verify:all` is offline and fast. It covers core utilities, services, HTTP client, and renderer shell.

Recommended additions:

- verification for service task status propagation
- validation hook verification
- invalid JSON HTTP verification
- renderer banned-pattern verification

## Recommended Next Gaps

Create these in `docs/gap/to-do` before broad feature work:

1. `service-task-status-propagation.md`
   - Fix registry task wrapping to preserve `partial`, `capped`, and handler-declared status.

2. `seed-readiness-service.md`
   - Add neutral readiness/path/status service and renderer display.

3. `service-payload-validation.md`
   - Add optional command validation hook and taxonomy-shaped validation failures.

4. `renderer-shell-hardening.md`
   - Remove `innerHTML`, add banned-pattern verification, and prepare for app smoke.

5. `http-client-parse-and-error-hardening.md`
   - Parse before success logging and define invalid JSON behavior.

## Verification

Executed:

```powershell
npm.cmd run verify:all
```

Result:

```txt
core utilities verified
services verified
HTTP client verified
renderer shell verified
all checks verified
```

## Final Read

Aura Core is ready to build from as a seed.

It should not receive domain-specific persistence, datasets, live integrations, or product UI yet. The next best move is a short hardening milestone that turns the seed from "usable scaffold" into "comfortable base layer" for future Aura projects.
