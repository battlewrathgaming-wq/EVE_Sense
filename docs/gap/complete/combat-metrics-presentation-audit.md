# Gap: Combat Metrics Presentation Audit

Status: Complete
Priority: P1

## Need

AURA-Sense now captures, computes, and displays several Combat Witness metrics, but the presentation layer still has ambiguous labels and mixed terminology.

The diagnostics surface currently exposes fields such as Combat State, Combat Summary, Combat Detail, Combat Signal, Witnessed, 5s Incoming, 15s Repair, Repair Balance, Observed Source, and Observed Weapon. Some are human-readable, while others blur operational state, tactical signal, and backend terminology.

Before changing UI behavior, the project needs a full audit of the downstream combat metric path:

```txt
raw log line
-> parsed event
-> rolling compute
-> snapshot field
-> renderer display field
-> operator-facing meaning
```

This is a documentation and review task first. It should not change runtime behavior or UI layout.

## Actionables

- Inventory every Combat Witness metric currently captured by the parser.
- Inventory every Combat Witness metric currently computed by rolling windows.
- Inventory every Combat Witness metric currently exposed in snapshots.
- Inventory every Combat Witness metric currently displayed in the HUD or diagnostics surface.
- Write plain-English summaries for each metric.
- Identify whether each metric is human-readable, actionable, non-invasive, ambiguous, display-ready, diagnostics-only, or calibration-needed.
- Propose better terminology where current labels are unclear.
- Call out gaps between computed metrics and displayed metrics.
- Call out display labels that imply more certainty than the backend owns.

## Required Current-State Document

Maintained:

- `docs/current-state/combat-metrics.md`

Completed sections:

- What the log parser captures
- What rolling windows compute
- What snapshots expose
- What the current UI displays
- What the current UI does not display
- Ambiguous terms and better replacements
- Metrics safe for the main HUD
- Metrics better suited to diagnostics
- Metrics requiring calibration or more fixtures
- Known gaps

## Guardrails

- Do not change UI behavior in this packet.
- Do not rename runtime fields until the audit is reviewed.
- Do not make the renderer compute Combat Witness metrics.
- Do not turn observed labels into durable identities.
- Do not describe repair balance as safety, stability, tank state, or survival.
- Do not promote damage spike outliers into warnings before calibration.
- Do not imply raw repair/healing parser support exists before exact fixtures prove it.

## Completion Evidence

- `docs/current-state/combat-metrics.md` maps capture, compute, snapshot, and display layers.
- Ambiguous terms have proposed replacements.
- Gaps between computed and displayed metrics are explicitly listed.
- Diagnostics-only and calibration-needed metrics are separated from HUD-safe metrics.
- The audit records the repair parser caveat and the observed-only nature of source, target, weapon, spike, and repair-balance fields.

## Deferred Risks

- This packet does not authorize runtime field renames or UI copy changes.
- Damage spike outliers still require real-dataset calibration before prominent HUD treatment.
- Raw repair/healing parser support remains fixture-gated.
- Outgoing miss and observed-attempt counts remain future compute/display work.

## Verification Signal

Documentation review only. Runtime verification is covered by the current project verification suite:

```powershell
npm.cmd run verify:all
```

## Related Files

- `src/combat/combatLogParser.js`
- `src/combat/combatRollingWindow.js`
- `src/combat/combatWitnessService.js`
- `src/renderer/app.js`
- `src/renderer/index.html`
- `docs/current-state/combat-metrics.md`
- `docs/contracts/combat-witness-contract.md`
- `docs/schemas/hud-snapshot.md`
- `docs/schemas/combat-event.md`
- `docs/gap/to-do/combat-window-weapon-spike-followups.md`
- `docs/gap/to-do/combat-metric-calibration-real-datasets.md`
- `docs/gap/to-do/repair-healing-raw-fixture-intake.md`
