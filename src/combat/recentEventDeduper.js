class RecentEventDeduper {
  constructor({ ttlMs = 5000 } = {}) {
    this.ttlMs = ttlMs;
    this.seen = new Map();
  }

  isDuplicate(event, nowMs = Date.now()) {
    const key = event?.id || event?.rawLineHash;
    if (!key) {
      return false;
    }

    this.prune(nowMs);
    const lastSeen = this.seen.get(key);
    this.seen.set(key, nowMs);
    return lastSeen != null && nowMs - lastSeen < this.ttlMs;
  }

  prune(nowMs = Date.now()) {
    for (const [key, seenAt] of this.seen.entries()) {
      if (nowMs - seenAt > this.ttlMs) {
        this.seen.delete(key);
      }
    }
  }

  clear() {
    this.seen.clear();
  }
}

module.exports = { RecentEventDeduper };
