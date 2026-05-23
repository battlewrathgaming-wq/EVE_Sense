const assert = require('node:assert');
const { COOLDOWN_MS, LISTENING_MS, createClipboardAcquisitionService } = require('../src/threat/clipboardAcquisitionService');

async function main() {
  await verifiesRapidArmCancelAndCooldown();
  await verifiesUnchangedAndRejectedContent();
  await verifiesScanFailureSeals();
  await verifiesConcurrentArmDoesNotResetWindow();
  console.log('clipboard acquisition race verified');
}

async function verifiesRapidArmCancelAndCooldown() {
  const clock = createClock();
  let clipboardText = 'baseline';
  const service = createClipboardAcquisitionService({
    now: clock.now,
    readClipboard: () => clipboardText,
    scan: async () => ({ status: 'succeeded' })
  });

  const armed = await service.arm();
  assert.strictEqual(armed.state, 'listening', 'arm should enter listening state');
  assert.strictEqual(armed.listeningUntilMs, clock.value + LISTENING_MS, 'listening window should be bounded');

  const cancelled = service.cancel();
  assert.strictEqual(cancelled.state, 'cooldown', 'cancel should seal into cooldown');
  assert.strictEqual(cancelled.reason, 'cancelled', 'cancel should record reason');

  const cooldownArm = await service.arm();
  assert.strictEqual(cooldownArm.state, 'cooldown', 'rapid re-arm during cooldown should be blocked');
  assert.strictEqual(cooldownArm.reason, 'cooldown-active', 'cooldown re-arm should be explicit');

  clock.advance(COOLDOWN_MS);
  assert.strictEqual(service.tick().state, 'idle', 'cooldown should return to idle');

  const rearmed = await service.arm();
  assert.strictEqual(rearmed.state, 'listening', 'service should re-arm after cooldown');
  clipboardText = 'system:Jita';
  const captured = await service.capture();
  assert.strictEqual(captured.state, 'cooldown', 'capture should seal into cooldown');
  assert.strictEqual(captured.reason, 'captured', 'capture should record reason');
  assert.strictEqual(captured.lastCapture.targetText, 'system:Jita', 'capture should retain target text');
}

async function verifiesUnchangedAndRejectedContent() {
  const clock = createClock();
  let clipboardText = 'old value';
  const service = createClipboardAcquisitionService({
    now: clock.now,
    readClipboard: () => clipboardText,
    validateTarget: (text) => text.startsWith('system:'),
    scan: async () => ({ status: 'succeeded' })
  });

  await service.arm();
  const unchanged = await service.capture();
  assert.strictEqual(unchanged.state, 'listening', 'unchanged clipboard should not seal');
  assert.strictEqual(unchanged.reason, 'unchanged', 'unchanged clipboard should be explicit');
  assert.strictEqual(unchanged.lastCapture, null, 'unchanged clipboard should not capture target');

  clipboardText = 'not an accepted target';
  const rejected = await service.capture();
  assert.strictEqual(rejected.state, 'cooldown', 'rejected content should seal');
  assert.strictEqual(rejected.reason, 'rejected', 'rejected content should record reason');
  assert.strictEqual(rejected.lastCapture.targetText, 'not an accepted target', 'rejected content should expose only normalized attempted target');

  clock.advance(COOLDOWN_MS);
  service.tick();
  await service.arm();
  clock.advance(LISTENING_MS + 1);
  const timedOut = service.tick();
  assert.strictEqual(timedOut.state, 'cooldown', 'timeout should seal into cooldown');
  assert.strictEqual(timedOut.reason, 'timeout', 'timeout should record reason');
}

async function verifiesScanFailureSeals() {
  const clock = createClock();
  let clipboardText = 'baseline';
  const service = createClipboardAcquisitionService({
    now: clock.now,
    readClipboard: () => clipboardText,
    scan: async () => {
      const error = new Error('Injected scan failure');
      error.code = 'TEST_SCAN_FAILED';
      throw error;
    }
  });

  await service.arm();
  clipboardText = 'system:Jita';
  const failed = await service.capture();
  assert.strictEqual(failed.state, 'cooldown', 'scan failure should seal into cooldown');
  assert.strictEqual(failed.reason, 'scan-failed', 'scan failure should record seal reason');
  assert.strictEqual(failed.lastCapture.targetText, 'system:Jita', 'scan failure should retain captured target text');
  assert.strictEqual(failed.lastCapture.result.status, 'failed', 'scan failure should produce failed result metadata');
  assert.strictEqual(failed.lastCapture.result.failure.code, 'TEST_SCAN_FAILED', 'scan failure code should be preserved');
}

async function verifiesConcurrentArmDoesNotResetWindow() {
  const clock = createClock();
  let clipboardText = 'baseline';
  const service = createClipboardAcquisitionService({
    now: clock.now,
    readClipboard: () => clipboardText,
    scan: async () => ({ status: 'succeeded' })
  });

  const first = await service.arm();
  clock.advance(1000);
  clipboardText = 'system:Jita';
  const second = await service.arm();
  assert.strictEqual(second.state, 'listening', 'concurrent arm should keep listening');
  assert.strictEqual(second.reason, 'already-listening', 'concurrent arm should be explicit');
  assert.strictEqual(second.listeningUntilMs, first.listeningUntilMs, 'concurrent arm should not extend listening window');

  const captured = await service.capture();
  assert.strictEqual(captured.state, 'cooldown', 'capture after concurrent arm should still seal');
  assert.strictEqual(captured.lastCapture.targetText, 'system:Jita', 'capture after concurrent arm should use changed clipboard content');
}

function createClock() {
  const clock = {
    value: Date.parse('2026-05-23T12:00:00.000Z'),
    advance(ms) {
      this.value += ms;
    }
  };
  clock.now = () => clock.value;
  return clock;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
