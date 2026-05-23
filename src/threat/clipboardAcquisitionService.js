const LISTENING_MS = 3000;
const COOLDOWN_MS = 5000;

function createClipboardAcquisitionService({
  scan,
  validateTarget = (text) => String(text || '').trim().length > 0,
  now = () => Date.now(),
  readClipboard = () => '',
  trace = () => {}
} = {}) {
  let state = idleState(now);

  async function arm({ clipboardText = null } = {}) {
    const current = now();
    if (state.state === 'cooldown' && current < state.cooldownUntilMs) {
      return snapshot('cooldown-active');
    }
    if (state.state === 'listening' && current <= state.listeningUntilMs) {
      return snapshot('already-listening');
    }
    const armedClipboardText = clipboardText == null ? normalizeClipboardText(readClipboard()) : null;
    state = {
      state: 'listening',
      armedAt: new Date(current).toISOString(),
      armedClipboardText,
      listeningUntilMs: current + LISTENING_MS,
      cooldownUntilMs: null,
      message: 'Clipboard acquisition listening',
      lastCapture: null
    };
    trace('clipboard_acquisition_armed', { listeningMs: LISTENING_MS });
    if (clipboardText != null) {
      return capture({ text: clipboardText, allowUnchanged: true });
    }
    return snapshot();
  }

  async function capture({ text = null, allowUnchanged = false } = {}) {
    const current = now();
    if (state.state !== 'listening') {
      return snapshot('not-listening');
    }
    if (current > state.listeningUntilMs) {
      return seal('timeout', null);
    }

    const targetText = normalizeClipboardText(text ?? readClipboard());
    if (!allowUnchanged && state.armedClipboardText === targetText) {
      return snapshot('unchanged');
    }
    if (!validateTarget(targetText)) {
      return seal('rejected', targetText);
    }

    try {
      const result = typeof scan === 'function'
        ? await scan({ targetText, inputSource: 'clipboard' })
        : null;
      return seal('captured', targetText, result);
    } catch (error) {
      return seal('scan-failed', targetText, {
        status: 'failed',
        message: error.message,
        failure: {
          code: error.code || 'CLIPBOARD_SCAN_FAILED',
          message: error.message
        }
      });
    }
  }

  function cancel() {
    if (state.state !== 'listening') {
      return snapshot('not-listening');
    }
    return seal('cancelled', null);
  }

  function tick() {
    if (state.state === 'listening' && now() > state.listeningUntilMs) {
      return seal('timeout', null);
    }
    if (state.state === 'cooldown' && now() >= state.cooldownUntilMs) {
      state = idleState(now);
    }
    return snapshot();
  }

  function seal(reason, targetText = null, result = null) {
    const current = now();
    state = {
      state: 'cooldown',
      sealedReason: reason,
      sealedAt: new Date(current).toISOString(),
      listeningUntilMs: null,
      cooldownUntilMs: current + COOLDOWN_MS,
      message: `Clipboard acquisition sealed: ${reason}`,
      lastCapture: targetText ? { targetText, result } : null
    };
    trace('clipboard_acquisition_sealed', { reason });
    return snapshot(reason);
  }

  function snapshot(reason = null) {
    return {
      kind: 'clipboard.acquisition.snapshot',
      state: state.state,
      message: state.message,
      reason,
      listeningUntilMs: state.listeningUntilMs,
      cooldownUntilMs: state.cooldownUntilMs,
      lastCapture: state.lastCapture
    };
  }

  return {
    arm,
    cancel,
    capture,
    snapshot,
    tick
  };
}

function idleState(now) {
  return {
    state: 'idle',
    armedAt: null,
    armedClipboardText: null,
    listeningUntilMs: null,
    cooldownUntilMs: null,
    message: 'Clipboard acquisition idle',
    lastCapture: null
  };
}

function normalizeClipboardText(text) {
  return String(text ?? '').trim();
}

module.exports = {
  COOLDOWN_MS,
  LISTENING_MS,
  createClipboardAcquisitionService
};
