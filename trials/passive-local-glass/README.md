# Sense Passive Local Glass Trial

Status: Sense-local staged copy of Lab static trial bundle

Provenance:

- Source package: Lab `portable-presentation-starter/packages/sense-trial-glass`
- Source commit noted by packet: `824e35d Accept Sense trial glass package`
- Staged for Sense packet: M16E - Passive Local Glass Trial

## Purpose

This folder stages the Lab presentation glass locally for Sense inspection.

It is display-only.

Sense owns mapper behavior, source meaning, runtime behavior, product copy, review, and adoption.

Lab example data is not used as the Sense view.

Lab display labels are not Sense state enums.

## Included Glass

- Instrument Readout Panel Glass

The package contains the accepted static Instrument Readout Panel head so Sense can inspect or copy the presentation glass locally through Sense-owned trial work.

## Selected Materials In Mind

Included through the glass behavior:

- Availability Reason Treatment
- Long Text Detail Block
- Warning / Gap Edge

Optional inspiration only:

- Expandable Status Card

The optional card material is not a new component in this package. It is represented only where the current readout/detail shape already behaves like a compact surface with attached detail.

## Files

- `inspect-head.html` - no-selector inspection page for the travelling head surface, adapted locally to load Sense-generated fixture input.
- `instrument-readout-panel.css` - static styling tokens and layout.
- `instrument-readout-panel.js` - static text-rendering behavior, adapted locally to load `sense-trial-readouts.json`.
- `sense-trial-readouts.json` - Sense-generated Passive fixture input.
- `MANIFEST.md` - package contents and boundary note.

## Inspect Locally

Open:

```txt
inspect-head.html
```

This page has no selector and is not Sense product UI. It is a local, static inspection page.

## Sense Responsibilities

Sense must provide:

- Sense-owned mapper behavior
- Sense-owned source meaning
- Sense-owned product copy and terminology decisions
- Sense-owned runtime behavior
- Sense-owned review and acceptance
- Sense-owned adoption timing

## What This Package Must Not Imply

This package does not imply:

- Sense adoption
- Sense product fitness
- Sense state enums
- Sense source meaning
- target adapter ownership by Lab
- bridge/runtime contract
- package manager publishing
- React requirement
- Electron/preload/IPC requirement
- Lab service registry, SmokeFlash, Pane Board, or Wayfinder usage

## Static Boundary

This bundle is static and local. It does not require Electron, IPC, preload, service registry, SmokeFlash, Pane Board, Wayfinder, or target project files.

The JavaScript renders display text through DOM nodes and text content. The only fetch is the local `sense-trial-readouts.json` file with Sense-owned fallback data for plain-file inspection.
