# Gap: Combat Window Weapon And Spike Followups

Status: Complete
Priority: P2

## Need

Combat Witness rolling windows expose observed weapon counts, most observed weapon type, and damage spike outliers. Followup verification was needed before these fields could be considered stable backend observations.

## Completed Scope

- Repeated incoming weapon labels prove `mostObservedWeaponType` is decided by count.
- Tie handling for equally observed weapon labels is deterministic by label.
- Missing weapon labels do not become misleading `weaponCounts`.
- Multiple observed attacker labels and multiple weapon labels remain exact observed text.
- Outgoing spike `shipLabel` is proven as the observed target label.
- A large older hit that falls out of the 15 second window no longer appears as a spike.
- Burst behavior proves the rolling window keeps `maxEventsPerWindow` bounded and spike outliers capped.
- Weapon normalization remains deferred; current counts are exact observed labels.
- Ship labels remain observed labels, not durable identity.
- Renderer copy guardrails remain observed-language only.

## Deferred To Dedicated Packet

Real-dataset spike calibration remains open in:

- `docs/gap/to-do/combat-metric-calibration-real-datasets.md`

That packet owns the future decision about percentile/MAD/fixed-minimum/sample-count thresholds and any stronger HUD emphasis.

## Verification Signal

Completed:

```powershell
npm.cmd run verify:combat-window-followups
npm.cmd run verify:all
```

## Guardrails Preserved

- No renderer recomputation was added.
- No weapon normalization was introduced.
- No durable identity was inferred from observed labels.
- No persistent combat history was added.
- Damage spikes remain observed outliers, not threat conclusions.

## Related Files

- `src/combat/combatRollingWindow.js`
- `src/combat/combatWitnessService.js`
- `scripts/verify-combat-window-weapon-spike-followups.js`
- `scripts/verify-all.js`
- `package.json`
- `docs/gap/to-do/combat-metric-calibration-real-datasets.md`
