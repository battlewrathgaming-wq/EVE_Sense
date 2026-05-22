const assert = require('node:assert');
const { createCombatWitnessBridge, COMBAT_WITNESS_CHANNELS } = require('../src/combat/combatWitnessBridge');
const { CombatWitnessService } = require('../src/combat/combatWitnessService');

const handlers = new Map();
const ipcMain = {
  handle: (channel, handler) => {
    handlers.set(channel, handler);
  }
};
let nowMs = 1000;
let timerCallback = null;
const service = new CombatWitnessService();
const bridge = createCombatWitnessBridge({
  service,
  minUpdateIntervalMs: 250,
  now: () => nowMs,
  setTimer: (callback, delayMs) => {
    timerCallback = callback;
    return { delayMs };
  },
  clearTimer: () => {}
});
bridge.register(ipcMain);

assert.strictEqual(typeof handlers.get(COMBAT_WITNESS_CHANNELS.getSnapshot), 'function', 'bridge should register snapshot handler');
assert.strictEqual(typeof handlers.get(COMBAT_WITNESS_CHANNELS.subscribe), 'function', 'bridge should register subscribe handler');
assert.strictEqual(typeof handlers.get(COMBAT_WITNESS_CHANNELS.unsubscribe), 'function', 'bridge should register unsubscribe handler');

const sent = [];
const destroyedHandlers = {};
const sender = {
  id: 1,
  send: (channel, payload) => sent.push({ channel, payload }),
  once: (event, handler) => {
    destroyedHandlers[event] = handler;
  },
  isDestroyed: () => false
};
const event = { sender };

const subResult = handlers.get(COMBAT_WITNESS_CHANNELS.subscribe)(event);
assert.strictEqual(subResult.subscribed, true, 'bridge should subscribe sender');
assert.strictEqual(sent[0].channel, COMBAT_WITNESS_CHANNELS.snapshot, 'bridge should send initial compact snapshot on subscribe');
assert.strictEqual(sent[0].payload.kind, 'combat.witness.snapshot', 'initial bridge payload should be snapshot');

service.addEvent(combatDamage('hit-1', '2026-05-22T01:00:00.000Z', 10));
assert.strictEqual(sent.length, 2, 'bridge should publish first emitted snapshot');

nowMs += 10;
service.addEvent(combatDamage('hit-2', '2026-05-22T01:00:01.000Z', 5));
assert.strictEqual(sent.length, 2, 'bridge should throttle rapid snapshot emission');
assert.strictEqual(timerCallback instanceof Function, true, 'bridge should schedule a bounded pending snapshot flush');

nowMs += 300;
timerCallback();
assert.strictEqual(sent.length, 3, 'bridge should flush pending throttled snapshot');
assert.strictEqual(sent[2].payload.windows['5s'].damage.incoming.total, 15, 'bridge should expose backend-owned rolling metrics');

const unsubResult = handlers.get(COMBAT_WITNESS_CHANNELS.unsubscribe)(event);
assert.strictEqual(unsubResult.unsubscribed, true, 'bridge should unsubscribe sender');
nowMs += 300;
service.addEvent(combatDamage('hit-3', '2026-05-22T01:00:02.000Z', 2));
assert.strictEqual(sent.length, 3, 'bridge should stop sending after unsubscribe');

const directSnapshot = handlers.get(COMBAT_WITNESS_CHANNELS.getSnapshot)();
assert.strictEqual(directSnapshot.kind, 'combat.witness.snapshot', 'bridge should expose direct snapshot request');

handlers.get(COMBAT_WITNESS_CHANNELS.subscribe)(event);
destroyedHandlers.destroyed();
nowMs += 300;
service.addEvent(combatDamage('hit-4', '2026-05-22T01:00:03.000Z', 4));
assert.strictEqual(sent.length, 4, 'bridge should only send the resubscribe initial snapshot after sender destruction');

console.log('combat witness bridge verified');

function combatDamage(id, eventTime, amount) {
  return {
    id,
    kind: 'combat.damage',
    direction: 'incoming',
    amount,
    sourceLabel: 'Mining Drone',
    targetLabel: 'you',
    eventTime
  };
}
