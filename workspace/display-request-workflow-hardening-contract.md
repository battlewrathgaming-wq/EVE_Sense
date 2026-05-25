# Display Request Workflow Hardening Contract

Status: Sense-local advisory workflow contract
Date: 2026-05-25
Owner: AURA-Sense Overseer

## Purpose

This contract defines how AURA-Sense may send scoped `request_display` problems to Aura Lab for Bridge -> Interface presentation comparison.

It allows Lab to form useful display options without transferring Sense-owned meaning, implementation authority, or adoption authority to Lab.

This is advisory workflow only. It is not a Dev runway, bridge contract, runtime schema, payload schema, IPC change, persistence requirement, product direction change, or implementation approval.

## Sources Reviewed

- `AGENTS.md`
- `workspace/current.md`
- `workspace/request_display.md`
- `workspace/critical/README.md`
- `workspace/critical/critical-terms.md`
- `workspace/critical/critical-assets.md`
- `F:\Projects\AURA- Lab\workspace\request_display.md`
- `F:\Projects\AURA- Lab\workspace\display-request-cooperation-contract.md`
- `F:\Projects\AURA- Lab\workspace\current.md`

## Directionality

Use this direction every time Sense sends or reviews a `request_display` entry:

```txt
Sense-owned meaning
-> display inventory row
-> local scoped RequestDisplayHS artifact
-> submitted Lab request_display entry
-> Lab Bridge -> Interface comparison
-> Sense review and adoption decision
-> optional Sense-local Dev runway
```

Lab output returns to Sense as advisory input. Sense must explicitly accept, adapt, reject, park, or route the recommendation before any implementation work begins.

## Local Request Artifact Pipeline

Sense keeps three different records separate:

| Record | Location | Meaning | Active Lab Request? |
| --- | --- | --- | --- |
| Display inventory row | `workspace/display_inventory.md` | Candidate surface, field, or display problem captured for Sense review. | No. |
| Scoped Sense request artifact | `workspace/RequestDisplayHS##-[topic].md` | Sense-owned request draft or ready-to-submit packet. | No, unless copied to Lab with submitted status. |
| Lab intake entry | `F:\Projects\AURA- Lab\workspace\request_display.md` | Submitted request for Lab Bridge -> Interface comparison. | Yes, if status is `submitted`, `active-review`, or `accepted-input`. |

Use this naming pattern for local scoped requests:

```txt
workspace/RequestDisplayHS##-[topic].md
```

The local request artifact should include:

- advisory preamble and active request count
- source inventory ID
- request ID
- request strength
- bounded surface or flow slice
- source-owned terms to preserve
- terms Lab must avoid or qualify
- known fields and state cases
- freshness, basis, warning, and gap needs
- in-scope and out-of-scope boundaries
- verification or review needs if Sense later adopts the result
- explicit statement that implementation is not authorized

Do not copy an inventory row directly into Lab intake. Shape it into a scoped Sense request artifact first.

## Sense Owns

AURA-Sense owns:

- internal -> Bridge meaning
- Sense source terms
- Sense data meaning
- lane and state semantics
- live-IO, sample, freshness, blocked, partial, stale, failed, and degraded meanings
- runtime behavior
- bridge-facing APIs, events, payloads, IPC, schemas, services, and contracts
- final adoption, rejection, adaptation, parking, or follow-up runway

Sense-owned terms include, but are not limited to:

- `Combat Witness`
- `Passive Telemetry`
- `Threat Intel`
- `Clipboard Acquisition`
- `Live IO blocked`
- `Partial sample`
- `Capped sample`
- `No scan`
- `No observation`
- `Observed Source`
- `Observed Weapon`
- `Observed repair balance`

## Lab May Do

Aura Lab may:

- compare up to three Bridge -> Interface display methods for a scoped Sense display problem
- map the problem to Lab slots, display types, and material sets
- recommend split, merge, narrow, park, or return-to-project
- identify presentation risks
- identify missing state, field, freshness, basis, warning, or gap needs
- suggest human-facing display wording after preserving Sense meaning
- note portability risks or opportunities without turning them into shared doctrine

## Lab May Not Do

Aura Lab may not:

- rename Sense terms
- redefine Sense meanings
- create backend, bridge, IPC, payload, persistence, schema, service, runtime, or provider requirements
- treat a request as implementation approval
- treat a request as adoption approval
- treat requests as a hidden backlog
- start Sense implementation
- make Sense terms into Lab defaults
- turn Lab labels into Sense bridge fields, service names, payload names, CSS/test identifiers, or product state enums
- import Atlas-owned historical proof, storage, tracking, assessment, or workstation semantics into Sense

## Request Strength

Every Sense `request_display` entry should include one request strength.

| Strength | Use When | Expected Lab Response |
| --- | --- | --- |
| `formative` | Sense has a bounded display problem but wants early presentation shaping. | Clarify display options, missing fields, risks, and whether the request should be narrowed. |
| `comparative` | Sense has a scoped surface and wants method comparison. | Compare up to three candidate Bridge -> Interface methods. |
| `pressure-test` | Sense has a likely display direction and needs stress against states, density, wording, or layout. | Test the candidate against degraded states, narrow/overlay constraints, long text, missing fields, and terminology risk. |
| `parked/inventory` | Sense wants to preserve a display problem for later without opening active Lab review. | Record as non-active inventory unless Human / Overseer explicitly moves it to active review. |

`parked/inventory` entries do not count as active Lab review unless their status is changed to `submitted`, `active-review`, or `accepted-input`.

## Active Request Cap

Sense must keep no more than five active `request_display` entries in Lab review unless the Human or Sense Overseer explicitly overrides the cap.

Active statuses:

- `submitted`
- `active-review`
- `accepted-input`

Non-active statuses:

- `draft`
- `queued`
- `returned-to-project`
- `parked`
- `superseded`

If five Sense requests are already active, new requests should be narrowed, parked, superseded, or explicitly authorized before submission.

## Standard Advisory Preamble

Use this preamble at the top of every Sense request batch:

```md
Status: Advisory display request batch, not Sense authority transfer or Lab implementation approval.
Project: AURA-Sense
Source owner: AURA-Sense
Lab role: Bridge -> Interface comparison only
Request strength model: formative | comparative | pressure-test | parked/inventory
Active request count: [N] of 5

Sense-owned meaning must be preserved. Sense owns internal -> Bridge meaning, source terms, data meaning, lane/state semantics, runtime behavior, and final adoption.

Not authorized: source-term rename, source-meaning rewrite, backend/bridge/IPC/payload/persistence/schema/service/runtime requirements, target-project implementation, hidden backlog creation, Atlas historical proof semantics, or Lab fixture semantics.
```

## Sense Request Additions

In addition to Lab's schema, Sense requests should include:

```yaml
sense_boundary:
  request_strength: formative | comparative | pressure-test | parked/inventory
  source_terms_to_preserve:
    - Sense-owned term
  source_terms_lab_must_not_rewrite:
    - Sense-owned term
  lane_boundary:
    - Combat Witness | Passive Telemetry | Threat Intel | Clipboard Acquisition | Runtime diagnostics/settings
  source_meaning_owner: AURA-Sense
  bridge_to_interface_only: true
  source_project_acceptance_needed: true
  implementation_authorized: false
```

Do not use this addition to create new payload fields or runtime requirements. It is a request framing aid only.

## Review And Adoption

After Lab responds, Sense should record a local review that answers:

- accepted, adapted, rejected, parked, or returned-to-project
- which Sense-owned meanings were preserved
- which Lab display options are safe or unsafe for Sense
- whether any missing fields are real product needs or only presentation questions
- whether a Sense-local Dev runway is needed
- which verification would be required if implementation later opens

A Lab recommendation is not enough to begin Dev work. A Sense-local packet must exist before implementation.

## Non-Goals

- Do not implement code from this contract.
- Do not modify Aura Lab from this contract.
- Do not create active Lab tasks from this contract alone.
- Do not create a Dev runway from this contract alone.
- Do not change bridge contracts, IPC, payloads, persistence, schemas, services, backend behavior, provider behavior, or runtime behavior.
- Do not rename Sense terms.
- Do not broaden Sense product direction.
- Do not create shared Aura doctrine.
