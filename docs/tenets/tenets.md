# AURA-Sense Tenets

Status: Active
Updated: 2026-05-23

These rules define what AURA-Sense is allowed to become.

## 1. Tactical Viewport First

AURA-Sense answers:

```text
What is happening around me right now?
What must I notice?
What is stale, partial, degraded, or unavailable?
```

It does not answer long-term evidence questions. That belongs to AURA Atlas.

## 2. Transient By Default

Combat telemetry and tactical context should use rolling windows, bounded caches, and short-lived state.

Persistence is for settings, diagnostics, fixtures, and explicit local metadata. It is not for historical intelligence unless a future ADR authorizes a narrow handoff.

## 3. Backend Owns Telemetry Truth

The renderer consumes snapshots and events through the preload/service boundary.

The renderer must not:

- parse EVE logs
- call zKill or ESI
- own provider state
- compute tactical truth
- bypass service validation

## 4. Keep Lanes Separate

AURA-Sense has separate lanes:

- Combat Witness
- Passive Telemetry
- Threat Intel
- Clipboard Acquisition
- Diagnostics / Runtime Control

These lanes may appear together in the HUD, but they must not silently overwrite each other or blur their meaning.

## 5. Combat Witness Is Observation

Combat Witness is rolling local telemetry from observed gamelog lines.

It is not:

- killmail evidence
- pilot attribution truth
- long-term combat history
- survival prediction

Use language such as observed, recent, witnessed, stale, unavailable, and partial.

## 6. Passive Telemetry Is Context

Passive Telemetry can provide current-system context and low-frequency activity signals.

It must not:

- become broad background scraping
- auto-run Threat Intel searches
- expand ESI killmails
- retain long-term activity history

## 7. Threat Intel Is Explicit And Scoped

Threat Intel starts from an operator action:

- typed search
- explicit scan submit
- valid armed clipboard capture

Current Threat Intel uses scoped zKill-backed samples with sample/cap/freshness metadata.

ESI killmail expansion is deferred unless a future milestone or ADR authorizes it.

## 8. Clipboard Acquisition Is Not Surveillance

Clipboard Acquisition is:

- armed deliberately
- visibly active
- short-lived
- sealed after capture, timeout, cancellation, or rejection
- followed by cooldown

It must not become always-on clipboard monitoring.

## 9. Low Cognitive Load Wins

The HUD should remain calm, compact, and readable under pressure.

Prefer:

- short labels
- stable layout
- clear freshness/degraded states
- restrained motion
- direct uncertainty language

Avoid investigative overload and historical density.

## 10. Live APIs Are Gated

External calls must be:

- explicit
- scoped
- cache-aware
- observable
- respectful
- outside `verify:all`

Provider failures should look like degraded or unavailable state, not empty truth.

## 11. Local Metadata First

Static labels should come from local metadata where practical:

- ship/type names
- group/category labels
- system labels

Unknown IDs should stay visible rather than being hidden behind guessed labels.

## 12. AI Is Commentary, Not Telemetry

AI may summarize or explain future tactical state only if clearly labeled.

It must not become the source of observed telemetry or hidden transformation logic.

## 13. Atlas Boundary Remains Mandatory

```text
AURA-Sense observes now.
AURA Atlas remembers later.
```

Do not import Atlas persistence, watch execution, historical reporting, or evidence-retention behavior into AURA-Sense without an explicit future ADR.
