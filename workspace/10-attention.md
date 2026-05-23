# Attention

Status: Active
Updated: 2026-05-23

## Current Attention

The active hardening lane is aggressive testing and bug hunting.

Start from:

- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-13-aggressive-testing-and-bug-hunting.md`
- `docs/testing/aggressive-test-harness-matrix.md`
- `docs/gap/to-do/README.md`

## SDE Caution

SDE/local metadata work may generate large artifacts.

Rules:

- Do not stage downloaded SDE ZIPs by default.
- Do not make `verify:all` depend on live SDE download.
- Use deterministic fixture ZIP tests first.
- Record real SDE source path, build number, checksum, retention/disposal, and cache location if a real SDE artifact is used.

## Live API Caution

Live provider calls remain explicit and opt-in.

Rules:

- Do not run live zKill/ESI checks inside `verify:all`.
- Require `AURA_SENSE_LIVE_API=1` or the project-approved live gate for live API smoke.
- Record live smoke evidence in an audit.

## Current Project Risk

The next risk is not feature shortage.

The next risk is accepting unproven live or adversarial behavior as tactical truth.
