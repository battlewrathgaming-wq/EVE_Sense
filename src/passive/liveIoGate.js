function createLiveIoGate({ enabled = false, mode = 'live-disabled', reason = 'Passive Telemetry live IO is disabled' } = {}) {
  let state = enabled ? 'live-enabled' : mode;
  let message = enabled ? 'Passive Telemetry live IO is enabled' : reason;

  function setEnabled(nextEnabled, nextReason = null) {
    state = nextEnabled ? 'live-enabled' : 'live-disabled';
    message = nextReason || (nextEnabled ? 'Passive Telemetry live IO is enabled' : 'Passive Telemetry live IO is disabled');
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
      code: 'PASSIVE_LIVE_IO_BLOCKED',
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
