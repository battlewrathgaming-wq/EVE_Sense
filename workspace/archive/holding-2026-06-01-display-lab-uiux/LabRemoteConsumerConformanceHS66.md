# LabRemoteConsumerConformanceHS66

Status: Active conformance guidance for remote Lab consumers
Role: Lab Overseer
Date: 2026-05-24

## Purpose

Atlas and Sense may remotely access Aura Lab as a presentation-pattern reference.

This document defines how a remote project may consume Lab without making Lab the owner of that project's meaning, contracts, or product doctrine.

## Scope

Applies to:

- AURA-Atlas agents reading Aura Lab.
- AURA-Sense agents reading Aura Lab.
- Orchestrator prompts that direct other projects to clone, inspect, or adapt Lab artifacts.
- Future Aura projects using Lab as a presentation-pattern library.

## Conformance Rule

Remote projects may consume Lab as:

```txt
presentation-pattern input
```

Remote projects must not consume Lab as:

```txt
source-project authority
```

Lab offers presentation structure. The receiving project owns meaning.

## Allowed Remote Use

Remote projects may:

- clone or read the Aura Lab repository
- inspect Lab workspace artifacts
- inspect Lab renderer/source patterns
- inspect Lab guardrails and verification approach
- copy/adapt HTML/CSS/JS presentation ideas into their own project
- reference Lab advisories in their local workspace
- use Lab concepts as UI/UX inspiration
- use Lab protected-term discovery as a warning-only pattern
- adapt fixture/test-mode ideas for their own local verification
- cite Lab commits or artifacts as advisory input

## Not Allowed By Default

Remote projects must not, without explicit Human / Lab Overseer approval:

- write into Aura Lab
- change Lab workspace state
- open or close Lab milestones
- create Lab handoff artifacts
- modify Lab source, scripts, docs, or workspace files
- run Lab GUI/Electron smoke as part of their own acceptance
- mutate shared protected-word files automatically
- treat Lab's current packet as their own executable packet

## Authority Boundaries

Atlas owns:

- Atlas internal language
- Atlas Project -> Bridge language
- Atlas Evidence meaning
- Atlas Discovery meaning
- Atlas Watch / Marked meaning
- Atlas renderer command semantics
- Atlas storage, history, and provenance semantics

Sense owns:

- Sense internal language
- Sense Project -> Bridge language
- Combat Witness meaning
- Passive Telemetry meaning
- Threat Intel meaning
- Clipboard Acquisition meaning
- Live IO blocked meaning
- Sense lane and sample semantics

Lab owns:

- Lab's own project files
- Lab-owned Bridge -> Interface presentation language
- Lab-neutral presentation prototypes
- Lab advisory artifacts
- Lab local verification and warning-only discovery behavior

Human owns:

- cross-project priority
- acceptance
- overrides when presentation quality conflicts with source fidelity

## Adoption Method

When Atlas or Sense wants to adopt a Lab pattern, the receiving project should:

1. Read the relevant Lab artifact or source.
2. Classify it as presentation structure, interaction pattern, terminology guidance, verification approach, or non-portable local Lab rigging.
3. Map it to the receiving project's own meaning and contracts.
4. Write a receiving-project advisory or adoption artifact.
5. Have the receiving project Overseer accept, reject, or narrow it.
6. Only then open a local Dev runway in the receiving project.

## Portable From Lab

Usually portable:

- layout hierarchy
- visual density strategy
- status light grammar
- narrow/overlay containment
- detail drawer structure
- source/freshness/basis/gaps/warnings visibility
- diagnostic demotion patterns
- warning-only terminology discovery approach
- fixture mode concept
- visual smoke containment expectations

Sometimes portable after project review:

- state visual treatments
- copy tone
- readout labels
- basis/freshness wording
- interaction model
- animation/motion patterns

Not automatically portable:

- Lab fixture family names
- Lab neutral sample meanings
- Lab state labels as project state enums
- Lab bridge assumptions
- Lab internal compatibility names
- Lab workspace process artifacts
- Lab-specific smoke matrix

## Required Wording For Adoption Records

Receiving-project adoption records should include:

```txt
Lab source consulted:
[file/commit/artifact]

Adopted as:
presentation pattern / interaction pattern / verification pattern / terminology caution

Receiving-project owner:
Atlas / Sense / other

Meaning preserved:
[source-project meaning that remains authoritative]

Not imported:
[Lab semantics, fixture names, state labels, or process artifacts intentionally left behind]

Verification expected:
[local project commands only]
```

## Stop Conditions

Stop and ask Human / relevant Overseer if:

- adopting a Lab pattern would rename source-owned terms
- Lab vocabulary would replace Atlas/Sense meaning
- a Lab fixture/state label would become a project enum
- cross-project shared files would need mutation
- a remote agent needs to write into Lab
- live/private/destructive/GUI actions are required
- the receiving project cannot tell what meaning it owns

## Current Remote-Use References

Atlas:

- `workspace/archive/cross-project-relay/AtlasImportAdvisoryHS64-lab-presentation-adoption.md`

Sense:

- `workspace/archive/cross-project-relay/SenseImportAdvisoryHS65-lab-presentation-adoption.md`
- `workspace/archive/cross-project-relay/SenseUIUXHS02-sense-face-presentation-advisory.md`

Shared terminology:

- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\TerminologyAuthorityRuleset-2026-05-24.md`
- `F:\Projects\Docs\Aura-Project-Orchestration\terminology\protected-words\README.md`

## Summary

Atlas and Sense may read Lab freely as a presentation-pattern library.

They should adapt inside their own project authority.

Lab offers patterns. The receiving project owns meaning.
