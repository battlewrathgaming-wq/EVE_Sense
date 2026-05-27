# ADR-0005 - Clipboard Acquisition Authority And Rolling Cache

Date: 2026-05-25
Status: Accepted

## Context

AURA-Sense is a tactical viewport used alongside EVE Online. Combat can be intense, and the operator should not have to click the Sense window, break focus from the game, copy a target, press the acquisition shortcut, then repeat the interaction.

Clipboard Acquisition therefore has to balance two truths:

- The operator needs a fast, keyboard-first target handoff.
- Sense must not become a silent or continuous clipboard monitor.

M12F reviewed operator I/O readiness and gate separation. M12G then aligned Clipboard Acquisition around the intended behavior:

- I/O is the absolute manual authority gate.
- `Control+\` is an uncommon explicit permission action by design.
- Passive I/O wraps the operator flow.
- Active, in this context, means the operator permission action: currently `Control+\`.
- Active does not mean background clipboard monitoring.

## Decision

Clipboard Acquisition may read and consume the current clipboard at the moment the operator presses `Control+\`, if I/O authority is enabled and the clipboard content is a valid target.

This is intentional. The keypress is the permission moment.

Clipboard Acquisition must also support a short focused/windowed acquisition mode:

- arming without a provided clipboard payload establishes a baseline
- unchanged pre-arm clipboard content is ignored
- changed valid clipboard content during the short window may be captured
- capture, rejection, timeout, cancellation, or failure seals the window into cooldown

Sense may use a small rolling in-memory cache for duplicate suppression:

- cache window: 10 seconds
- cache size: 5 normalized targets
- stored value: fingerprint only, not raw clipboard text
- purpose: duplicate suppression / throttle only

## Authority Model

I/O is the absolute manual authority gate for Clipboard Acquisition.

ADR-0008 later broadens the project trust model: I/O off means Sense must not ingest from logs, clipboard, providers, or other machine-local/input sources. This ADR remains accepted for Clipboard Acquisition behavior, but future reconciliation should align its narrower provider/clipboard language with the broader ingest authority model.

When I/O is off:

- no live provider calls
- no clipboard reads
- no Clipboard Acquisition

When I/O is on:

- Passive provider work may run only when Passive lane logic triggers it
- Clipboard Acquisition may read clipboard only at the `Control+\` permission action or within the visible short acquisition window
- Threat scan remains scoped and bounded

`Control+\` is deliberately uncommon to make the operator action explicit.

## Non-Goals

- Do not continuously monitor the clipboard.
- Do not store raw clipboard history.
- Do not make the rolling cache durable.
- Do not make the rolling cache a Passive gate.
- Do not treat Clipboard Acquisition results as Passive context.
- Do not make Clipboard Acquisition a display fixture source.
- Do not require a mouse/search-button workflow for the operator-facing path.
- Do not bypass the Threat Intel boundary.
- Do not add Atlas-style evidence or history semantics.

## Consequences

Accepted:

- Fast combat-flow target handoff is preserved.
- The operator can copy/right-click a target and press `Control+\` once for direct delivery.
- I/O off remains a strong trust boundary.
- Focused/windowed acquisition remains available as a distinct mode.
- Duplicate suppression may skip an intentional repeat scan of the same normalized target inside 10 seconds.

Required safeguards:

- Clipboard reads must remain gated by I/O authority.
- Clipboard authority must remain visible and time-bounded.
- Duplicate suppression must stay in-memory and fingerprint-only.
- Future smoke artifacts must not store raw clipboard targets unless a future active packet explicitly authorizes the exact target.
- Manual shortcut feel and OS-level accelerator behavior require future explicit validation before being treated as live/operator-proven.

## Verification

M12G added deterministic offline verification:

- `npm.cmd run verify:clipboard-race`
- `npm.cmd run verify:threat-intel`
- `npm.cmd run verify:operator-io-gates`
- `npm.cmd run verify:all`

These checks verify Clipboard Acquisition lifecycle, duplicate suppression, Threat target length bounds, and Passive/Threat gate separation without real clipboard capture or live/manual operator I/O.

## Related

- `workspace/OverseerHS45-m12f-operator-io-readiness-review-acceptance.md`
- `workspace/DevHS46-m12g-clipboard-mode-gate-separation-hardening.md`
- `workspace/OverseerHS47-m12g-clipboard-gate-separation-acceptance.md`
- `docs/adr/ADR-0008-io-off-means-no-ingest.md`
- `docs/features/clipboard-acquisition.md`
- `docs/testing/live-operator-gamelog-smoke-playbook.md`
- `docs/contracts/threat-intel-contract.md`
