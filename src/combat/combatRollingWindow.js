const DEFAULT_WINDOW_MS = 15000;
const DEFAULT_MAX_EVENTS = 500;

class CombatRollingWindow {
  constructor({ windowMs = DEFAULT_WINDOW_MS, maxEvents = DEFAULT_MAX_EVENTS } = {}) {
    this.windowMs = windowMs;
    this.maxEvents = maxEvents;
    this.events = [];
    this.latestEventMs = null;
  }

  add(event) {
    if (!isWindowEvent(event)) {
      return null;
    }

    this.events.push(event);
    const eventMs = Date.parse(event.eventTime);
    this.latestEventMs = this.latestEventMs == null ? eventMs : Math.max(this.latestEventMs, eventMs);
    this.prune(this.latestEventMs);
    this.enforceMaxEvents();
    return event;
  }

  snapshot(nowMs = Date.now()) {
    this.prune(nowMs);

    const damage = {
      incoming: {
        total: 0,
        perSecond: 0,
        hitQualityCounts: {},
        damageTypeCounts: {},
        weaponCounts: {},
        sourceCounts: {},
        uniqueSourceCount: 0,
        mostCommonDamageType: null,
        mostCommonHitQuality: null,
        mostObservedWeaponType: null,
        spikeThreshold: null,
        spikeOutliers: [],
        topSource: null
      },
      outgoing: {
        total: 0,
        perSecond: 0,
        hitQualityCounts: {},
        damageTypeCounts: {},
        weaponCounts: {},
        targetCounts: {},
        uniqueTargetCount: 0,
        mostCommonDamageType: null,
        mostCommonHitQuality: null,
        mostObservedWeaponType: null,
        spikeThreshold: null,
        spikeOutliers: [],
        topTarget: null
      }
    };
    const repair = {
      incoming: {
        total: 0,
        perSecond: 0,
        eventCount: 0,
        sourceCounts: {},
        uniqueSourceCount: 0,
        topSource: null
      },
      outgoing: {
        total: 0,
        perSecond: 0,
        eventCount: 0,
        targetCounts: {},
        uniqueTargetCount: 0,
        topTarget: null
      }
    };

    for (const event of this.events) {
      const direction = event.direction === 'outgoing' ? 'outgoing' : 'incoming';
      if (event.kind === 'combat.damage') {
        damage[direction].total += event.amount || 0;
        if (event.hitQuality) {
          damage[direction].hitQualityCounts[event.hitQuality] =
            (damage[direction].hitQualityCounts[event.hitQuality] || 0) + 1;
        }
        if (event.damageType) {
          damage[direction].damageTypeCounts[event.damageType] =
            (damage[direction].damageTypeCounts[event.damageType] || 0) + 1;
        }
        if (event.weaponLabel) {
          damage[direction].weaponCounts[event.weaponLabel] =
            (damage[direction].weaponCounts[event.weaponLabel] || 0) + 1;
        }
        if (direction === 'incoming' && event.sourceLabel) {
          damage.incoming.sourceCounts[event.sourceLabel] = (damage.incoming.sourceCounts[event.sourceLabel] || 0) + 1;
        }
        if (direction === 'outgoing' && event.targetLabel) {
          damage.outgoing.targetCounts[event.targetLabel] = (damage.outgoing.targetCounts[event.targetLabel] || 0) + 1;
        }
      }
      if (event.kind === 'combat.repair') {
        repair[direction].total += event.amount || 0;
        repair[direction].eventCount += 1;
        if (direction === 'incoming' && event.sourceLabel) {
          repair.incoming.sourceCounts[event.sourceLabel] = (repair.incoming.sourceCounts[event.sourceLabel] || 0) + 1;
        }
        if (direction === 'outgoing' && event.targetLabel) {
          repair.outgoing.targetCounts[event.targetLabel] = (repair.outgoing.targetCounts[event.targetLabel] || 0) + 1;
        }
      }
    }

    const seconds = this.windowMs / 1000;
    for (const direction of ['incoming', 'outgoing']) {
      damage[direction].perSecond = roundMetric(damage[direction].total / seconds);
      repair[direction].perSecond = roundMetric(repair[direction].total / seconds);
      damage[direction].mostCommonDamageType = mostCommon(damage[direction].damageTypeCounts);
      damage[direction].mostCommonHitQuality = mostCommon(damage[direction].hitQualityCounts);
      damage[direction].mostObservedWeaponType = mostCommon(damage[direction].weaponCounts);
      const spikeSummary = damageSpikeSummary(this.events, direction);
      damage[direction].spikeThreshold = spikeSummary.threshold;
      damage[direction].spikeOutliers = spikeSummary.outliers;
    }

    damage.incoming.uniqueSourceCount = Object.keys(damage.incoming.sourceCounts).length;
    damage.incoming.topSource = mostCommon(damage.incoming.sourceCounts);
    damage.outgoing.uniqueTargetCount = Object.keys(damage.outgoing.targetCounts).length;
    damage.outgoing.topTarget = mostCommon(damage.outgoing.targetCounts);
    repair.incoming.uniqueSourceCount = Object.keys(repair.incoming.sourceCounts).length;
    repair.incoming.topSource = mostCommon(repair.incoming.sourceCounts);
    repair.outgoing.uniqueTargetCount = Object.keys(repair.outgoing.targetCounts).length;
    repair.outgoing.topTarget = mostCommon(repair.outgoing.targetCounts);

    const balance = {
      takenDps: damage.incoming.perSecond,
      dealtDps: damage.outgoing.perSecond,
      repairReceivedHps: repair.incoming.perSecond,
      repairAppliedHps: repair.outgoing.perSecond,
      receivedRepairMinusDamagePerSecond: roundMetric(repair.incoming.perSecond - damage.incoming.perSecond)
    };

    return {
      windowMs: this.windowMs,
      eventCount: this.events.length,
      damage,
      repair,
      balance
    };
  }

  prune(nowMs = Date.now()) {
    const cutoff = nowMs - this.windowMs;
    this.events = this.events.filter((event) => {
      const eventMs = Date.parse(event.eventTime);
      return Number.isFinite(eventMs) && eventMs >= cutoff && eventMs <= nowMs;
    });
  }

  enforceMaxEvents() {
    if (!Number.isInteger(this.maxEvents) || this.maxEvents < 1 || this.events.length <= this.maxEvents) {
      return;
    }
    this.events = this.events.slice(this.events.length - this.maxEvents);
  }

  clear() {
    this.events = [];
    this.latestEventMs = null;
  }
}

function isWindowEvent(event) {
  return (
    event &&
    (event.kind === 'combat.damage' || event.kind === 'combat.repair') &&
    (event.direction === 'incoming' || event.direction === 'outgoing') &&
    Number.isFinite(Date.parse(event.eventTime))
  );
}

function roundMetric(value) {
  return Math.round(value * 100) / 100;
}

function mostCommon(counts) {
  let winner = null;
  for (const [label, count] of Object.entries(counts)) {
    if (!winner || count > winner.count || (count === winner.count && label < winner.label)) {
      winner = { label, count };
    }
  }
  return winner;
}

function damageSpikeSummary(events, direction) {
  const samples = events
    .filter((event) => event.kind === 'combat.damage' && event.direction === direction && Number.isFinite(event.amount))
    .map((event) => ({ event, amount: event.amount }));

  if (samples.length < 3) {
    return { threshold: null, outliers: [] };
  }

  const average = samples.reduce((sum, sample) => sum + sample.amount, 0) / samples.length;
  const variance = samples.reduce((sum, sample) => sum + ((sample.amount - average) ** 2), 0) / samples.length;
  const threshold = average + Math.sqrt(variance);
  const roundedThreshold = roundMetric(threshold);
  const outliers = samples
    .filter((sample) => sample.amount >= threshold)
    .sort((left, right) => {
      if (right.amount !== left.amount) {
        return right.amount - left.amount;
      }
      return Date.parse(right.event.eventTime) - Date.parse(left.event.eventTime);
    })
    .slice(0, 3)
    .map((sample) => compactSpikeOutlier(sample.event, direction));

  return { threshold: roundedThreshold, outliers };
}

function compactSpikeOutlier(event, direction) {
  return {
    id: event.id,
    eventTime: event.eventTime,
    amount: event.amount,
    shipLabel: direction === 'incoming' ? event.sourceLabel || null : event.targetLabel || null,
    sourceLabel: event.sourceLabel || null,
    targetLabel: event.targetLabel || null,
    weaponLabel: event.weaponLabel || null,
    hitQuality: event.hitQuality || null,
    damageType: event.damageType || null
  };
}

module.exports = {
  CombatRollingWindow,
  DEFAULT_MAX_EVENTS,
  DEFAULT_WINDOW_MS
};
