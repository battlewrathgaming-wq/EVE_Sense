# Data Display

AURA-7 senses telemetry.
It does not replace pilot judgement, fleet cohesion, or the EVE interface.

The purpose of displayed data is:
- low cognition,
- immediate readability,
- operational awareness.

Not completeness.

---

## Display Rules

Displayed information should be:

- Useful
- Actionable
- Attention-worthy
- Simplifying

If not:
- aggregate it,
- compress it,
- deprioritize it,
- or discard it.

---

# Application

Repeated hit quality exposes changing combat application.

Incoming:
- Glances Off
- Grazes
- Hits
- Penetrates
- Smashes
- Wrecks

Outgoing follows the same grading.

Application often reflects:
- transversal,
- tracking,
- range,
- falloff,
- positioning,
- or degrading defense.

AURA-7 surfaces the state.
The pilot interprets the cause.

Example:

INCOMING APPLICATION ↑
Penetrates dominant
Smashes occurring

---

# Weapon Pressure

Incoming weapon events are aggregated over rolling windows.

Displayed:
- weapon type,
- dominant sources,
- frequency,
- recency.

Example:

Scourge Cruise Missile
Pith Massacrer [4]

Nova Light Missile
Mercenary Crow
Mercenary Hyena
[+3]

Only the dominant 1–2 weapon groups should be surfaced.

AURA-7 does not prescribe counterplay.
It surfaces what is applying most often.

---

# EWAR

Control effects are immediate-attention telemetry.

Examples:
- SCRAMMED
- DISRUPTED
- JAMMED
- NEUTED
- WEBBED

Where possible:
- hostile source is displayed.

Example:

SCRAMMED
Mercenary Crow

---

# Pressure & Equilibrium

Incoming damage, outgoing damage, and repairs are aggregated over rolling windows.

The goal is operational stability awareness.

Example:

Incoming ↑
Repairs stable

Incoming stable
Repairs falling

AURA-7 does not issue combat instructions.
It surfaces changing combat state.

---

# Outliers

Abnormal impacts are surfaced separately from sustained pressure.

Examples:
- alpha strikes,
- wrecking hits,
- sudden application spikes.

Example:

OUTLIER
Mercenary Hyena
103 — Smashes

---

# Source Compression

AURA-7 does not attempt to display every hostile participant.

Large engagements are compressed into:
- dominant weapon groups,
- dominant contributors,
- aggregated source counts.

Example:

Scourge Heavy Missile
Pithatis Assassin
Pithatis Assaulter
[+2]

---

# Core Principle

Combat logs are noisy.
Combat state is not.

AURA-7 condenses high-frequency combat events into concise operational telemetry requiring pilot awareness, attention, or response.