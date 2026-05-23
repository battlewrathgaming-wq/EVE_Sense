const assert = require('node:assert');
const { CombatWitnessService } = require('../src/combat/combatWitnessService');

const BASE = Date.parse('2026-05-23T12:00:00.000Z');

function main() {
  verifiesRepeatedWeaponsMissingWeaponsAndObservedSources();
  verifiesWeaponTieBreak();
  verifiesOutgoingSpikeShipLabel();
  verifiesOldSpikePruning();
  verifiesBoundsUnderBurst();
  console.log('combat weapon and spike followups verified');
}

function verifiesRepeatedWeaponsMissingWeaponsAndObservedSources() {
  const service = serviceAt(20_000);
  [
    damage('incoming', 10, 5_000, { id: 'repeat-1', sourceLabel: 'Pirate Frigate', weaponLabel: 'Light Missile' }),
    damage('incoming', 11, 6_000, { id: 'repeat-2', sourceLabel: 'Pirate Frigate', weaponLabel: 'Light Missile' }),
    damage('incoming', 9, 7_000, { id: 'other-weapon', sourceLabel: 'Mining Drone', weaponLabel: 'Railgun' }),
    damage('incoming', 8, 8_000, { id: 'missing-weapon', sourceLabel: 'Drone Swarm', weaponLabel: null })
  ].forEach((event) => service.addEvent(event, BASE + 20_000));

  const incoming = service.snapshot(BASE + 20_000).windows['15s'].damage.incoming;
  assert.deepStrictEqual(
    incoming.mostObservedWeaponType,
    { label: 'Light Missile', count: 2 },
    'most observed weapon should be decided by count'
  );
  assert.deepStrictEqual(
    incoming.weaponCounts,
    { 'Light Missile': 2, Railgun: 1 },
    'missing weapon labels should not become misleading counts'
  );
  assert.deepStrictEqual(
    incoming.sourceCounts,
    { 'Pirate Frigate': 2, 'Mining Drone': 1, 'Drone Swarm': 1 },
    'multiple observed attacker labels should stay exact'
  );
}

function verifiesWeaponTieBreak() {
  const service = serviceAt(10_000);
  service.addEvent(damage('incoming', 10, 5_000, { id: 'tie-beta', sourceLabel: 'Attacker One', weaponLabel: 'Beta Cannon' }), BASE + 10_000);
  service.addEvent(damage('incoming', 10, 6_000, { id: 'tie-alpha', sourceLabel: 'Attacker Two', weaponLabel: 'Alpha Cannon' }), BASE + 10_000);

  assert.deepStrictEqual(
    service.snapshot(BASE + 10_000).windows['15s'].damage.incoming.mostObservedWeaponType,
    { label: 'Alpha Cannon', count: 1 },
    'weapon tie should resolve deterministically by label'
  );
}

function verifiesOutgoingSpikeShipLabel() {
  const service = serviceAt(20_000);
  [
    damage('outgoing', 10, 5_000, { id: 'outgoing-low-1', targetLabel: 'Target A', weaponLabel: 'Pulse Laser' }),
    damage('outgoing', 12, 6_000, { id: 'outgoing-low-2', targetLabel: 'Target B', weaponLabel: 'Pulse Laser' }),
    damage('outgoing', 80, 7_000, { id: 'outgoing-spike', targetLabel: 'Target Prime', weaponLabel: 'Torpedo Launcher' })
  ].forEach((event) => service.addEvent(event, BASE + 20_000));

  const outgoing = service.snapshot(BASE + 20_000).windows['15s'].damage.outgoing;
  assert.deepStrictEqual(
    outgoing.spikeOutliers.map((event) => ({
      id: event.id,
      amount: event.amount,
      shipLabel: event.shipLabel,
      targetLabel: event.targetLabel,
      weaponLabel: event.weaponLabel
    })),
    [{
      id: 'outgoing-spike',
      amount: 80,
      shipLabel: 'Target Prime',
      targetLabel: 'Target Prime',
      weaponLabel: 'Torpedo Launcher'
    }],
    'outgoing spike shipLabel should be the observed target label'
  );
}

function verifiesOldSpikePruning() {
  const service = serviceAt(30_000);
  [
    damage('incoming', 400, 0, { id: 'old-large-hit', sourceLabel: 'Old Attacker', weaponLabel: 'Old Cannon' }),
    damage('incoming', 10, 20_000, { id: 'recent-low-1', sourceLabel: 'Recent A', weaponLabel: 'Light Missile' }),
    damage('incoming', 11, 21_000, { id: 'recent-low-2', sourceLabel: 'Recent B', weaponLabel: 'Light Missile' }),
    damage('incoming', 12, 22_000, { id: 'recent-low-3', sourceLabel: 'Recent C', weaponLabel: 'Railgun' })
  ].forEach((event) => service.addEvent(event, BASE + 30_000));

  const incoming = service.snapshot(BASE + 30_000).windows['15s'].damage.incoming;
  assert.strictEqual(incoming.weaponCounts['Old Cannon'], undefined, 'old weapon should prune out of 15s window');
  assert.ok(!incoming.spikeOutliers.some((event) => event.id === 'old-large-hit'), 'old large hit should not remain a spike');
}

function verifiesBoundsUnderBurst() {
  const service = new CombatWitnessService({
    windowMs: [15_000],
    maxEventsPerWindow: 20,
    now: () => BASE + 60_000
  });

  for (let index = 0; index < 100; index += 1) {
    service.addEvent(damage('incoming', index + 1, 45_000 + (index * 100), {
      id: `burst-${index}`,
      sourceLabel: `Burst ${index % 4}`,
      weaponLabel: `Weapon ${index % 3}`
    }), BASE + 60_000);
  }

  const incomingWindow = service.snapshot(BASE + 60_000).windows['15s'];
  assert.strictEqual(incomingWindow.eventCount, 20, 'window should enforce max event bound');
  assert.ok(incomingWindow.damage.incoming.spikeOutliers.length <= 3, 'spike outliers should stay capped');
}

function serviceAt(offsetMs) {
  return new CombatWitnessService({
    windowMs: [15_000],
    now: () => BASE + offsetMs
  });
}

function damage(direction, amount, offsetMs, overrides = {}) {
  const targetLabel = direction === 'incoming' ? 'you' : (overrides.targetLabel || 'Observed Target');
  const sourceLabel = direction === 'incoming' ? (overrides.sourceLabel || 'Observed Source') : 'you';
  return {
    id: overrides.id,
    kind: 'combat.damage',
    channel: 'combat',
    direction,
    amount,
    eventTime: new Date(BASE + offsetMs).toISOString(),
    observedAt: new Date(BASE + offsetMs).toISOString(),
    sourceLabel,
    targetLabel,
    weaponLabel: Object.hasOwn(overrides, 'weaponLabel') ? overrides.weaponLabel : 'Observed Weapon',
    hitQuality: overrides.hitQuality || 'Hits',
    damageType: overrides.damageType || 'thermal',
    rawLineHash: overrides.rawLineHash || `${String(overrides.id || offsetMs).padEnd(64, '0').slice(0, 64)}`
  };
}

main();
