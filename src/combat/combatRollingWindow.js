const DEFAULT_WINDOW_MS = 15000;

class CombatRollingWindow {
  constructor({ windowMs = DEFAULT_WINDOW_MS } = {}) {
    this.windowMs = windowMs;
    this.events = [];
  }

  add(event) {
    if (!isWindowEvent(event)) {
      return null;
    }

    this.events.push(event);
    return event;
  }

  snapshot(nowMs = Date.now()) {
    this.prune(nowMs);

    const damage = {
      incoming: { total: 0, perSecond: 0, hitQualityCounts: {} },
      outgoing: { total: 0, perSecond: 0, hitQualityCounts: {} }
    };
    const repair = {
      incoming: { total: 0, perSecond: 0 },
      outgoing: { total: 0, perSecond: 0 }
    };

    for (const event of this.events) {
      const direction = event.direction === 'outgoing' ? 'outgoing' : 'incoming';
      if (event.kind === 'combat.damage') {
        damage[direction].total += event.amount || 0;
        if (event.hitQuality) {
          damage[direction].hitQualityCounts[event.hitQuality] =
            (damage[direction].hitQualityCounts[event.hitQuality] || 0) + 1;
        }
      }
      if (event.kind === 'combat.repair') {
        repair[direction].total += event.amount || 0;
      }
    }

    const seconds = this.windowMs / 1000;
    for (const direction of ['incoming', 'outgoing']) {
      damage[direction].perSecond = roundMetric(damage[direction].total / seconds);
      repair[direction].perSecond = roundMetric(repair[direction].total / seconds);
    }

    return {
      windowMs: this.windowMs,
      eventCount: this.events.length,
      damage,
      repair
    };
  }

  prune(nowMs = Date.now()) {
    const cutoff = nowMs - this.windowMs;
    this.events = this.events.filter((event) => {
      const eventMs = Date.parse(event.eventTime);
      return Number.isFinite(eventMs) && eventMs >= cutoff && eventMs <= nowMs;
    });
  }

  clear() {
    this.events = [];
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

module.exports = {
  CombatRollingWindow,
  DEFAULT_WINDOW_MS
};
