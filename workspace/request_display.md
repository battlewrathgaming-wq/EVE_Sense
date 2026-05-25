# request_display Pointer

Status: Advisory pointer
Date: 2026-05-25
Source: Aura Lab M23

Aura Lab accepts advisory display requests through:

`F:\Projects\AURA- Lab\workspace\request_display.md`

Sense-local hardening contract:

`workspace/display-request-workflow-hardening-contract.md`

Use `request_display` only when Sense wants Lab to compare Bridge -> Interface presentation options for a Sense-owned current presentation surface or use case.

Authority:

- Sense owns internal -> Bridge meaning, lane semantics, live-IO/sample states, Passive Telemetry, Combat Witness, Threat Intel, Clipboard Acquisition, and renderer semantics.
- Lab may suggest Bridge -> Interface display methods only after Sense meaning is preserved.
- A request is advisory input, not implementation approval, adoption approval, bridge contract, payload schema, or terminology rename.

Request strength:

- `formative`: early bounded presentation shaping.
- `comparative`: compare up to three display methods for a scoped surface.
- `pressure-test`: stress a likely direction against states, density, wording, or layout.
- `parked/inventory`: preserve a non-active display problem for later.

Request guardrails:

- Keep no more than five active Sense `request_display` entries in Lab review unless Human / Overseer explicitly overrides the cap.
- Give every request a clear project header: `Project: Sense`.
- Include limited scope: boundary, included items, excluded items, and max candidate methods.
- Include product attachment: product area, surface, user task, priority, and decision needed.
- Keep source-owned Sense terms qualified and list any terms Lab must preserve.
- Include a request strength and active request count in every request batch.
- Treat `parked/inventory` requests as non-active unless explicitly moved to `submitted`, `active-review`, or `accepted-input`.

Workflow:

1. Create or propose one scoped `request_display` entry using the Lab schema.
2. Preserve Sense-owned terms and list any terms Lab must not rewrite.
3. Label the request strength and active cap count.
4. Send the entry to Lab for Bridge -> Interface use-case comparison only.
5. Lab maps the request to Lab slots, display types, material sets, and up to three candidate display methods.
6. Sense reviews any recommendation under Sense authority before adoption or implementation.

Directionality:

```txt
Sense-owned meaning
-> scoped display problem
-> Lab Bridge -> Interface comparison
-> Sense review and adoption decision
-> optional Sense-local Dev runway
```

Do not treat this pointer as an active Sense task queue.
