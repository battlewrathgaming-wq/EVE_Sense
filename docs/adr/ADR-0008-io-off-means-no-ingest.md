# ADR-0008 - I/O Off Means No Ingest

Date: 2026-05-27
Status: Accepted

## Context

Earlier AURA-Sense decisions treated I/O primarily as a live-provider and Clipboard Acquisition gate. That model blocked provider calls and clipboard reads, while local parser/gamelog ingest could still be discussed separately.

Human trust-model direction now clarifies a broader rule:

```txt
I/O is the user's ultimate authority over ingest behavior on their machine.
```

This is a product and trust boundary. If the user turns I/O off, Sense should not keep ingesting from logs, clipboard, providers, or other machine-local/input sources.

## Decision

When I/O is off, Sense must not ingest.

This includes:

- gamelog parser and file-ingest behavior
- Passive Telemetry parser-observed jump/current-system ingest
- Combat Witness combat-log event ingest
- Clipboard Acquisition reads
- Threat Intel live/provider calls
- Passive provider/API activity texture calls
- other future machine-local or external ingest behavior unless explicitly exempted by a future accepted decision

Existing displayed state may remain visible as last observed/resting state, but it must not be presented as freshly ingested while I/O is off.

## User-Facing Meaning

I/O off should mean:

```txt
Sense is not allowed to ingest.
```

It should not mean:

- provider failure
- no provider data
- no observation
- app malfunction
- source truth is empty

`No observation` and `I/O off` are distinct:

- `No observation` means Sense has not observed a relevant event.
- `I/O off` means the user has disabled ingest authority.

## Interaction Behavior

Default I/O should be off unless a future accepted settings policy says otherwise.

If the user attempts an ingest-dependent action while I/O is off, such as `Control+\`, the `IO` control may show a subtle warning/blocked effect. The effect should point the user back to the authority control without turning the affected lane into an error panel.

When I/O is on, ingest-dependent behavior may run only through the lane's existing scoped rules.

## Reconciliation Note

This ADR records the accepted trust model. It does not claim the current implementation already fully enforces it.

Known likely reconciliation areas:

- gamelog parser and file-ingest lifecycle while I/O is off
- Passive Telemetry jump observation while I/O is off
- Combat Witness event ingestion while I/O is off
- existing `Live IO blocked` wording versus broader `I/O off` / ingest-locked meaning
- live/manual smoke playbooks
- current M12 gate assumptions and operator I/O tests
- Passive/Threat provider gate language

Future work should audit and align code, docs, tests, and UI wording against this ADR through a bounded `workspace/current.md` packet.

## Non-Goals

- Do not implement the reconciliation in this ADR.
- Do not rename contracts, payloads, services, IPC channels, or bridge fields from this ADR alone.
- Do not erase older records; treat them as prior narrower decisions where applicable.
- Do not hide useful last-observed/resting state, but clearly distinguish it from live ingest.
- Do not make I/O-off lanes look like provider failures or missing truth.

## Review Rule

For any future ingest, provider, parser, clipboard, or live/manual validation work, ask:

```txt
Does this behavior ingest from the user's machine or from a live source?
If I/O is off, is it stopped or explicitly exempted by accepted authority?
Does the UI distinguish I/O authority-off from no observation or provider failure?
```

If the answer is unclear, stop and ask before implementing.

## Related

- `docs/adr/ADR-0005-clipboard-acquisition-authority-and-cache.md`
- `docs/adr/ADR-0006-sense-is-gameplay-companion.md`
- `docs/features/vision.md`
- `docs/current-state/current-implementation.md`
- `docs/roadmap/milestone-12-live-validation-and-tactical-calibration.md`
- `workspace/current.md`
