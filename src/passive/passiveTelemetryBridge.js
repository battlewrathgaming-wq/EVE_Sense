const CHANNELS = Object.freeze({
  getSnapshot: 'aura:passive-telemetry:get-snapshot',
  subscribe: 'aura:passive-telemetry:subscribe',
  unsubscribe: 'aura:passive-telemetry:unsubscribe',
  snapshot: 'aura:passive-telemetry:snapshot'
});

function createPassiveTelemetryBridge({ service }) {
  const subscribers = new Map();
  let unsubscribeService = null;

  function ensureSubscription() {
    if (unsubscribeService) {
      return;
    }
    unsubscribeService = service.subscribeSnapshots((snapshot) => publish(snapshot));
  }

  function publish(snapshot) {
    for (const [id, webContents] of subscribers.entries()) {
      if (!webContents || webContents.isDestroyed?.()) {
        subscribers.delete(id);
        continue;
      }
      webContents.send(CHANNELS.snapshot, snapshot);
    }
    cleanup();
  }

  function subscribe(event) {
    ensureSubscription();
    const webContents = event?.sender;
    if (!webContents) {
      return { subscribed: false, reason: 'missing sender' };
    }
    subscribers.set(webContents.id, webContents);
    webContents.once?.('destroyed', () => {
      subscribers.delete(webContents.id);
      cleanup();
    });
    webContents.send(CHANNELS.snapshot, service.snapshot());
    return { subscribed: true, subscriberCount: subscribers.size };
  }

  function unsubscribe(event) {
    const id = event?.sender?.id;
    if (id != null) {
      subscribers.delete(id);
    }
    cleanup();
    return { unsubscribed: true, subscriberCount: subscribers.size };
  }

  function cleanup() {
    if (subscribers.size === 0 && unsubscribeService) {
      unsubscribeService();
      unsubscribeService = null;
    }
  }

  function register(ipcMain) {
    ipcMain.handle(CHANNELS.getSnapshot, () => service.snapshot());
    ipcMain.handle(CHANNELS.subscribe, (event) => subscribe(event));
    ipcMain.handle(CHANNELS.unsubscribe, (event) => unsubscribe(event));
    return CHANNELS;
  }

  return { channels: CHANNELS, publish, register, subscribe, unsubscribe };
}

module.exports = {
  PASSIVE_TELEMETRY_CHANNELS: CHANNELS,
  createPassiveTelemetryBridge
};
