# Live Operator Gamelog Smoke Playbook

Status: scaffold only - not execution authorization
Date: 2026-05-25

## Purpose

This playbook defines the future M12 operator-machine smoke shape for real EVE gamelog append behavior.

It does not authorize a run. A run requires explicit Human authorization in an active `workspace/current.md` packet naming the live/manual boundary.

## Authorization Gate

Do not run this smoke unless all are true:

- the Human explicitly authorizes live operator gamelog smoke
- `workspace/current.md` names the smoke as the active runway
- the operator confirms the selected folder is the intended EVE `logs/Gamelogs` folder
- the run records artifact paths and stop conditions before starting

## Privacy Rules

- Do not collect broad private gamelog history.
- Do not store raw private gamelog lines in artifacts.
- Do not store clipboard contents or raw clipboard targets in artifacts unless a future active packet explicitly authorizes the exact target.
- Do not store full private local paths unless the operator explicitly approves that artifact shape.
- Use future appends only after watcher start.
- Store only sanitized status, counts, hashes where needed, timestamps, watcher state, and snapshot summaries.
- Do not hardcode machine-specific paths in docs, scripts, or artifacts.

## Intended Smoke Shape

1. Confirm authorization and artifact destination under `.tmp`.
2. Start AURA-Sense without enabling live providers unless the active packet separately authorizes that boundary.
3. Select the operator-confirmed EVE `logs/Gamelogs` folder through the existing runtime picker or configured path flow.
4. Start Combat Witness watching.
5. Produce or wait for future EVE gamelog appends only.
6. Confirm watcher state, append-only ingestion, Combat Witness snapshot update, Passive observer behavior, and clean shutdown.
7. Stop the watcher and record sanitized result metadata.

## Artifact Expectations

Future run artifacts should include:

- command and app version context
- authorization note reference
- artifact creation time
- sanitized configured-folder validation result without private path expansion where avoidable
- watcher state transitions
- event counts by accepted/rejected category
- hash-only rejection evidence if a line is rejected
- Combat Witness snapshot summary fields
- Passive Telemetry observer status, with live IO state explicit
- Clipboard Acquisition status if manual shortcut validation is separately authorized, without raw clipboard contents by default
- stop reason and shutdown state

Artifacts must not include broad raw log contents, unrelated historical lines, screenshots of private chat/log material, or provider results unless a separate live API boundary is authorized.

## Stop Conditions

Stop immediately and record the reason if:

- the selected folder fails the EVE `logs/Gamelogs` structure check
- the watcher tries to read outside the configured active folder
- historical files are being replayed beyond append-only startup seeding
- private raw lines would need to be copied into an artifact
- live provider calls or manual shortcut validation become necessary
- renderer, bridge, IPC, adapter, or product-claim changes appear necessary
- the operator revokes authorization

## Non-Goals

- No live zKill or ESI validation.
- No manual shortcut validation.
- No broad EVE history import.
- No Atlas persistence or durable Evidence semantics.
- No renderer redesign or Lab adapter work.
