# Overseer HS17 - M16 End-To-End Assurance Intent

Status: Advisory intent record, not executable authority
Date: 2026-05-25
Role: AURA-Sense Overseer

## Purpose

Record the current Human/Overseer intent for the likely next Sense assurance direction without opening `workspace/current.md`.

This artifact preserves the idea that Sense should prove its body before fitting or adopting a face:

```txt
ingest/source
-> transformation
-> Sense-owned state semantics
-> bridge snapshot/event output
-> target-owned adapter boundary
STOP
```

## Current Resting State

`workspace/current.md` remains idle.

No Dev runway is open.

No Lab face adoption is accepted.

No adapter implementation is authorized.

M16 exists as a candidate roadmap outcome in `docs/roadmap/milestone-16-body-to-adapter-readiness.md`.

## Suggested Outcome

When cross-agent communication becomes useful, open a bounded M16 runway for end-to-end assurance up to the adapter boundary.

Suggested first runway:

```txt
Clipboard Acquisition body-to-adapter trace
```

Reason:

- Clipboard Acquisition is already scoped through `sense.clipboard-window`.
- It has clear authority-window and cooldown behavior.
- It has strong must-not-imply boundaries around background clipboard monitoring.
- It can prove the body-to-adapter shape without requiring face adoption.

Alternate first runway:

```txt
Passive Telemetry body-to-adapter trace
```

Reason:

- Passive Telemetry stresses freshness, stale, partial, capped, blocked, degraded, and no-observation states.
- It is a stronger pressure test for the neutral state envelope.
- It likely needs more display-density and hierarchy discussion than Clipboard Acquisition.

## Expert Input To Request Later

Engineering:

- Confirm the cleanest Sense-owned adapter boundary.
- Identify whether current bridge output already contains enough information for adapter input.
- Separate bridge facts from display hints and diagnostics.

Test / Sysad:

- Define deterministic assurance checks for the chosen lane.
- Confirm what existing verification already proves.
- Identify remaining assurance questions without opening live provider smoke, manual shortcut validation, or real SDE refresh/download.

UI/UX:

- Review the minimum face needs after the body trace is documented.
- Keep UI/UX advisory focused on what a future face needs, not on adopting or redesigning the face now.

Terminology / Overseer:

- Keep Sense-owned terms authoritative before and at the bridge.
- Allow Lab slim/lab-term only after the Sense-owned adapter boundary.
- Treat Atlas terms as non-live unless a future UDP/TCP integration is explicitly opened.
- Use protected-term output as a sniff tool, not a blocker or rename mandate.

## Acceptance Shape For A Future Runway

A future M16 runway should be accepted only if it:

- documents one lane from ingest/source through transformation, bridge output, and adapter-boundary needs
- identifies Sense facts, display hints, diagnostics, and adapter-needed slots
- names must-not-imply boundaries
- names deterministic verification already covering the lane
- records remaining verification questions without authorizing live/manual actions
- stops before Lab face adoption
- keeps `workspace/current.md` as the only Dev authorization point

## Guardrails

- Do not implement code from this artifact.
- Do not update `workspace/current.md` from this artifact alone.
- Do not adopt a Lab face.
- Do not create or implement a Sense adapter yet.
- Do not rename Sense bridge fields, IPC, payloads, services, contracts, schemas, or UI copy.
- Do not treat Lab slim/lab-term as Sense internal or bridge authority.
- Do not treat Atlas terminology as a live Sense conflict unless a future integration explicitly opens it.
- Do not run live provider smoke, manual shortcut validation, or real SDE refresh/download.

## Suggested Next Action

When the Human wants cross-agent work, open `workspace/current.md` for a review-only M16 assurance runway, probably starting with Clipboard Acquisition.

Until then, keep this as a resting intent artifact and keep the project idle.
