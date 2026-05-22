# Audit: Clipboard Acquisition Cooldown And Intent Rule

Date: 2026-05-22
Role: Overseer
Scope: Clarify search, clipboard acquisition, and live request intent.

## Decision

Accepted.

AURA-Sense should not require the operator to focus the window during fullscreen EVE use just to trigger a tactical scan. Search-bar focus is too expensive as the primary interaction. Clipboard acquisition exists to provide a hands-free, deliberate path.

## Doctrine

Focus alone must not trigger API work.

Allowed Threat Intel live request triggers:

- explicit search submit
- valid clipboard acquisition from a visible armed listener
- future stable typed-input debounce only if visible, cancellable, and gated

Clipboard acquisition flow:

1. Operator presses Ctrl+Shift.
2. AURA-Sense shows armed/listening state.
3. Listener opens briefly.
4. Valid captured target is inserted into the search box and runs the scoped scan.
5. Listener seals.
6. Acquisition enters a 5 second cooldown.

Cooldown applies after capture, timeout, cancellation, or rejected clipboard content.

## Guardrails

- No indefinite clipboard listening.
- No hidden background clipboard surveillance.
- No API call from focus alone.
- No passive telemetry to Threat Intel auto-scan.
- No immediate re-arm during cooldown.
- No renderer-owned network call.

## Handoff Note

When Dev reaches Clipboard Acquisition / Threat Intel, implement acquisition as an operator-intent mechanism, not as passive monitoring. The search box remains the scan boundary, but it can be populated hands-free by the armed clipboard workflow.
