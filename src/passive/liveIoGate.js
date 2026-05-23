function createLiveIoGate({
  enabled = false,
  mode = 'live-disabled',
  reason = 'Passive Telemetry live IO is disabled',
  enabledMessage = 'Passive Telemetry live IO is enabled',
  disabledMessage = 'Passive Telemetry live IO is disabled',
  blockedCode = 'PASSIVE_LIVE_IO_BLOCKED'
} = {}) {
  let state = enabled ? 'live-enabled' : mode;
  let message = enabled ? enabledMessage : reason;

  function setEnabled(nextEnabled, nextReason = null) {
    state = nextEnabled ? 'live-enabled' : 'live-disabled';
    message = nextReason || (nextEnabled ? enabledMessage : disabledMessage);
    return status();
  }

  function status() {
    return {
      state,
      enabled: state === 'live-enabled',
      message
    };
  }

  function check({ providers = [] } = {}) {
    const current = status();
    if (current.enabled) {
      return {
        ok: true,
        state: current.state,
        providers,
        message: current.message
      };
    }
    return {
      ok: false,
      state: 'blocked',
      providers,
      code: blockedCode,
      message: current.message
    };
  }

  return {
    check,
    setEnabled,
    status
  };
}

module.exports = {
  createLiveIoGate
};
