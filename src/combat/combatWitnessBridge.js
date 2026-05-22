const { CombatWitnessService } = require('./combatWitnessService');

const CHANNELS = Object.freeze({
  getSnapshot: 'aura:combat-witness:get-snapshot',
  subscribe: 'aura:combat-witness:subscribe',
  unsubscribe: 'aura:combat-witness:unsubscribe',
  snapshot: 'aura:combat-witness:snapshot'
});

function createCombatWitnessBridge({
  service = new CombatWitnessService(),
  snapshotProvider = () => service.snapshot(),
  snapshotDecorator = (snapshot) => snapshot,
  minUpdateIntervalMs = 250,
  now = () => Date.now(),
  setTimer = (callback, delayMs) => setTimeout(callback, delayMs),
  clearTimer = (timer) => clearTimeout(timer),
  trace = () => {}
} = {}) {
  const subscribers = new Map();
  let unsubscribeService = null;
  let lastSentAt = 0;
  let pendingSnapshot = null;
  let pendingTimer = null;

  function ensureServiceSubscription() {
    if (unsubscribeService) {
      return;
    }
    unsubscribeService = service.subscribeSnapshots((snapshot) => {
      publishSnapshot(snapshotDecorator(snapshot));
    });
  }

  function publishSnapshot(snapshot) {
    const nowMs = now();
    if (nowMs - lastSentAt < minUpdateIntervalMs) {
      pendingSnapshot = snapshot;
      schedulePendingFlush(minUpdateIntervalMs - (nowMs - lastSentAt));
      trace('combat_snapshot_bridge_throttled', { subscribers: subscribers.size });
      return;
    }

    lastSentAt = nowMs;
    pendingSnapshot = null;
    clearPendingFlush();
    for (const [id, webContents] of subscribers.entries()) {
      if (!webContents || webContents.isDestroyed?.()) {
        subscribers.delete(id);
        continue;
      }
      webContents.send(CHANNELS.snapshot, snapshot);
    }
    cleanupServiceIfIdle();
  }

  function flushPending() {
    if (pendingSnapshot) {
      const snapshot = pendingSnapshot;
      lastSentAt = 0;
      clearPendingFlush();
      publishSnapshot(snapshot);
    }
  }

  function schedulePendingFlush(delayMs) {
    if (pendingTimer) {
      return;
    }
    pendingTimer = setTimer(() => {
      pendingTimer = null;
      flushPending();
    }, Math.max(0, delayMs));
    pendingTimer?.unref?.();
  }

  function clearPendingFlush() {
    if (pendingTimer) {
      clearTimer(pendingTimer);
      pendingTimer = null;
    }
  }

  function cleanupServiceIfIdle() {
    if (subscribers.size === 0 && unsubscribeService) {
      unsubscribeService();
      unsubscribeService = null;
      pendingSnapshot = null;
      clearPendingFlush();
    }
  }

  function subscribe(event) {
    ensureServiceSubscription();
    const webContents = event?.sender;
    if (!webContents) {
      return { subscribed: false, reason: 'missing sender' };
    }
    subscribers.set(webContents.id, webContents);
    webContents.once?.('destroyed', () => {
      subscribers.delete(webContents.id);
      cleanupServiceIfIdle();
    });
    const snapshot = snapshotProvider();
    webContents.send(CHANNELS.snapshot, snapshot);
    return { subscribed: true, subscriberCount: subscribers.size, minUpdateIntervalMs };
  }

  function unsubscribe(event) {
    const id = event?.sender?.id;
    if (id != null) {
      subscribers.delete(id);
    }
    cleanupServiceIfIdle();
    return { unsubscribed: true, subscriberCount: subscribers.size };
  }

  function register(ipcMain) {
    ipcMain.handle(CHANNELS.getSnapshot, () => snapshotProvider());
    ipcMain.handle(CHANNELS.subscribe, (event) => subscribe(event));
    ipcMain.handle(CHANNELS.unsubscribe, (event) => unsubscribe(event));
    return CHANNELS;
  }

  return {
    channels: CHANNELS,
    flushPending,
    publishSnapshot,
    register,
    service,
    subscribe,
    unsubscribe
  };
}

module.exports = {
  COMBAT_WITNESS_CHANNELS: CHANNELS,
  createCombatWitnessBridge
};
