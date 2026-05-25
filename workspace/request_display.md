# request_display Pointer

Status: Advisory pointer
Date: 2026-05-25
Source: Aura Lab M23

Aura Lab accepts advisory display requests through:

`F:\Projects\AURA- Lab\workspace\request_display.md`

Sense-local hardening contract:

`workspace/display-request-workflow-hardening-contract.md`

Use `request_display` only when Sense wants Lab to compare Bridge -> Interface presentation options for a Sense-owned current presentation surface or use case.

This file is the Sense pointer and workflow note. It is not the place to draft a scoped request.

Scoped Sense requests should be created as separate local artifacts first:

```txt
workspace/RequestDisplayHS##-[topic].md
```

Only after Sense decides a scoped request is ready to submit should that request be copied or cross-written into Lab's intake file:

```txt
F:\Projects\AURA- Lab\workspace\request_display.md
```

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

1. Keep inventory rows in `workspace/display_inventory.md` until a bounded display problem is chosen.
2. Create one local scoped request artifact as `workspace/RequestDisplayHS##-[topic].md`.
3. Preserve Sense-owned terms and list any terms Lab must not rewrite.
4. Label the request strength and active cap count.
5. Mark the request `draft`, `queued`, or `request-ready` until Sense chooses to submit it.
6. Copy or cross-write the scoped request into `F:\Projects\AURA- Lab\workspace\request_display.md` only when Sense submits it.
7. Lab maps the request to Lab slots, display types, material sets, and up to three candidate display methods.
8. Sense reviews any recommendation under Sense authority before adoption or implementation.

Directionality:

```txt
Sense-owned meaning
-> scoped display problem
-> Lab Bridge -> Interface comparison
-> Sense review and adoption decision
-> optional Sense-local Dev runway
```

Do not treat this pointer as an active Sense task queue.

Pipeline guardrail:

```txt
display_inventory row != Sense RequestDisplayHS artifact
Sense RequestDisplayHS artifact != submitted Lab request
submitted Lab request != accepted Lab recommendation
accepted recommendation != Sense Dev authorization
```
