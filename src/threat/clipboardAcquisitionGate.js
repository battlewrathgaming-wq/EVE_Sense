function createClipboardBlockedSnapshot() {
  return {
    kind: 'clipboard.acquisition.snapshot',
    state: 'blocked',
    message: 'IO authority is off; clipboard scan was not started',
    reason: 'io-disabled',
    listeningUntilMs: null,
    cooldownUntilMs: null,
    lastCapture: null
  };
}

async function runClipboardAcquisitionWithGate({ liveIoStatus, action }) {
  const status = typeof liveIoStatus === 'function' ? liveIoStatus() : liveIoStatus;
  if (!status?.enabled) {
    return createClipboardBlockedSnapshot();
  }
  return action();
}

module.exports = {
  createClipboardBlockedSnapshot,
  runClipboardAcquisitionWithGate
};
