# AURA-Sense — Clipboard Tactical Acquisition Feature Brief

## Purpose

AURA-Sense should support a temporary clipboard acquisition feature.

This feature allows the user to quickly copy a tactical search target from EVE and have AURA-Sense detect, validate, and search it with minimal interaction.

This is not treated as a separate companion mode.

It is a general AURA-Sense input module that supports different user behaviours:
- visible overlay use
- low-interaction use
- fullscreen-adjacent use
- in-flight tactical inquiry

---

# Core Philosophy

The clipboard listener should not feel like passive surveillance.

It should feel like:

```text
A short tactical acquisition window.
```

The user deliberately opens the window, AURA-Sense listens briefly, then the listener seals itself.

Core principle:

```text
Open briefly.
Acquire intentionally.
Seal automatically.
```

---

# Activation Gesture

Preferred arming input:

```text
CapsLock → Shift
```

This order is intentional.

It is:
- deliberate
- uncommon during normal typing
- unlikely to trigger accidentally during gameplay
- memorable as an operational gesture

This should be treated as a subsystem arming sequence, not a casual shortcut.

---

# Acquisition Cycle

```text
SEALED
    ↓
CapsLock pressed
    ↓
ARMING
    ↓
Shift pressed within arming window
    ↓
ACQUISITION WINDOW
    ↓
Clipboard content detected
    ↓
Search resolves
    ↓
SEALED
```

Fallback path:

```text
SEALED
    ↓
ARMING
    ↓
ACQUISITION WINDOW
    ↓
10 seconds pass with no valid acquisition
    ↓
SEALED
```

---

# Timing

The acquisition window should last:

```text
10 seconds
```

This is long enough for the user to:
- arm the listener
- copy the intended target
- allow AURA-Sense to acquire it

It is short enough to:
- reduce privacy concerns
- avoid passive background listening
- prevent accidental capture during unrelated alt-tab activity

If a valid search target is detected and processed, the listener should close immediately rather than waiting for the full timeout.

---

# Clipboard Behaviour

During the acquisition window, AURA-Sense may inspect clipboard changes.

Valid clipboard content may include:
- pilot names
- system names
- corporation names
- alliance names

The listener should ignore:
- empty clipboard content
- repeated clipboard values
- excessive text length
- invalid entity-like input
- duplicate triggers during cooldown

The listener should not remain active after successful acquisition.

---

# Search Behaviour

When valid clipboard content is acquired:

```text
Clipboard text
    ↓
Validation
    ↓
Search field populated
    ↓
Scoped search triggered
    ↓
Listener sealed
```

The feature supports tactical inquiry without requiring persistent focus on the AURA-Sense UI.

This preserves the value of:
- system pulse
- entity scan
- in-flight tactical checks
- threat intel lookup

without needing a separate companion mode.

---

# UI Feedback

The user must always understand the listener state.

The UI should communicate:
- sealed state
- arming state
- active acquisition window
- successful acquisition
- automatic reseal

---

## Key Lighting

When the activation sequence begins:

```text
CapsLock pressed
    ↓
CapsLock indicator illuminates

Shift pressed
    ↓
Shift indicator illuminates
    ↓
Acquisition window opens
```

This creates a visible operational handshake.

---

## Edge Fade

The acquisition window should be represented by a subtle window-edge illumination.

The fade is functional, not decorative.

It communicates:
- listener is active
- acquisition window is open
- remaining listen time
- privacy state
- approaching reseal

The edge glow should slowly fade across the 10 second window.

---

## Detection Feedback

When valid clipboard content is detected:

Suggested feedback:
- brief “DETECTED” state
- subtle window highlight
- search target confirmation
- immediate transition into search
- listener reseals after search begins or resolves

Avoid:
- loud popups
- aggressive flashing
- persistent warnings
- excessive animation

---

# Visual Tone

The effect should feel:
- restrained
- tactical
- deliberate
- quiet
- operational

It should not feel:
- flashy
- noisy
- gimmicky
- intrusive

The interaction should resemble:

```text
A sensor aperture briefly opening and closing.
```

---

# Privacy Model

The clipboard system is consent-driven.

AURA-Sense should not behave as if it is always watching the clipboard.

Instead:
- the user arms the listener deliberately
- the listener opens for 10 seconds
- the listener seals after acquisition
- the listener seals after timeout
- state is visually obvious while active

This protects against accidental capture during:
- alt-tab activity
- unrelated copying
- browser use
- password manager use
- non-EVE workflows

The user should never have to wonder:

```text
Is AURA-Sense currently watching my clipboard?
```

The UI should make the answer obvious.

---

# Architectural Framing

This feature should be implemented as a general input module.

It is not:
- a separate product mode
- a companion mode
- a replacement for manual search
- a persistent background listener

It is:
- a bounded input channel
- a tactical acquisition mechanic
- a low-friction search accelerator
- a privacy-aware quality-of-life feature

---

# Relationship To AURA-Sense Systems

The clipboard acquisition feature supports:
- Threat Intel
- system pulse
- pilot/corp/alliance lookup
- in-flight tactical inquiry
- low-interaction use

It does not replace:
- manual search
- automatic combat display
- gate/system detection
- passive telemetry

It complements them.

---

# Codex Implementation Constraints

Codex should preserve:
- bounded listener lifetime
- explicit arming gesture
- visible listener state
- immediate reseal after acquisition
- 10 second timeout
- validation before search
- no persistent clipboard surveillance

Codex should avoid:
- always-on clipboard monitoring
- hidden listener states
- indefinite armed state
- repeated search spam
- search triggers without validation
- coupling clipboard logic directly into renderer components
- treating this as a separate operating mode

---

# Core Design Principle

```text
The clipboard listener is not always listening.

The user opens a short tactical acquisition window.

AURA-Sense acquires, acts, and seals.
```