const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { collectCompleteLines } = require('./lineBuffer');
const { parseEveLogLine } = require('./combatLogParser');
const { RecentEventDeduper } = require('./recentEventDeduper');
const { normalizeGamelogFolder, validateGamelogFolder } = require('./eveLogPaths');
const { defaultDiagnosticsPolicy } = require('../services/diagnosticsPolicy');

class EveGamelogWatcher {
  constructor({
    parseLine = parseEveLogLine,
    onEvent,
    onStatus = () => {},
    onRejectedLine = () => {},
    deduper = new RecentEventDeduper(),
    trace = () => {},
    watcherStrategy = 'fs-watch',
    pollIntervalMs = 1000,
    setIntervalFn = setInterval,
    clearIntervalFn = clearInterval,
    readRange = readUtf8Range,
    isIngestAllowed = () => true,
    diagnosticsPolicy = defaultDiagnosticsPolicy
  } = {}) {
    this.parseLine = parseLine;
    this.onEvent = onEvent || (() => {});
    this.onStatus = onStatus;
    this.onRejectedLine = onRejectedLine;
    this.deduper = deduper;
    this.trace = diagnosticsPolicy.wrapTrace(trace, 'combat.gamelog_watcher');
    this.watcherStrategy = watcherStrategy;
    this.pollIntervalMs = pollIntervalMs;
    this.setIntervalFn = setIntervalFn;
    this.clearIntervalFn = clearIntervalFn;
    this.readRange = readRange;
    this.isIngestAllowed = isIngestAllowed;
    this.folderPath = null;
    this.folderRealPath = null;
    this.watcher = null;
    this.poller = null;
    this.activeStrategy = null;
    this.offsets = new Map();
    this.fileIdentities = new Map();
    this.partials = new Map();
  }

  start(inputPath) {
    this.stop();
    const folderPath = normalizeGamelogFolder(inputPath);
    if (!folderPath) {
      return this.setStatus('missing', null, 'EVE gamelog folder is not configured');
    }
    if (!this.canIngest()) {
      return this.setStatus('blocked', folderPath, 'I/O authority is off; gamelog ingest was not started');
    }

    const validation = validateGamelogFolder(folderPath);
    if (!validation.ok) {
      return this.setStatus(validation.state, folderPath, validation.message);
    }

    this.folderPath = validation.value || folderPath;
    this.folderRealPath = validation.realPath || realpath(this.folderPath);
    this.seedOffsets(this.folderPath);
    this.startStrategy(this.folderPath);

    return this.setStatus('watching', folderPath, `Watching EVE gamelogs via ${this.activeStrategy}`);
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
    }
    if (this.poller) {
      this.clearIntervalFn(this.poller);
    }
    this.watcher = null;
    this.poller = null;
    this.activeStrategy = null;
    this.folderPath = null;
    this.folderRealPath = null;
    this.offsets.clear();
    this.fileIdentities.clear();
    this.partials.clear();
    this.deduper.clear?.();
  }

  seedOffsets(folderPath) {
    for (const entry of fs.readdirSync(folderPath, { withFileTypes: true })) {
      if (!entry.isFile() || !isTextLog(entry.name)) {
        continue;
      }

      const validation = this.validateContainedFile(path.join(folderPath, entry.name));
      if (!validation.ok) {
        this.trace('file_skipped_outside_containment', { filePath: validation.filePath || path.join(folderPath, entry.name), reason: validation.reason });
        continue;
      }
      this.offsets.set(validation.filePath, validation.stats.size);
      this.fileIdentities.set(validation.filePath, validation.identity);
    }

    this.trace('offsets_seeded', { folderPath, files: this.offsets.size });
  }

  startStrategy(folderPath) {
    if (this.watcherStrategy === 'polling') {
      this.startPolling(folderPath);
      return;
    }

    try {
      this.startFsWatch(folderPath);
    } catch (error) {
      if (this.watcherStrategy !== 'auto') {
        throw error;
      }
      this.trace('watcher_strategy_fallback', {
        from: 'fs-watch',
        to: 'polling',
        message: error.message
      });
      this.startPolling(folderPath);
    }
  }

  startFsWatch(folderPath) {
    this.watcher = fs.watch(folderPath, { persistent: true }, (eventType, filename) => {
      if (!this.canIngest()) {
        this.setStatus('blocked', folderPath, 'I/O authority is off; gamelog ingest is paused');
        return;
      }
      const filePath = containedFilenamePath(folderPath, filename);
      if (!filePath || !isTextLog(filePath)) {
        if (filename) {
          this.trace('file_skipped_outside_containment', {
            filePath: path.join(folderPath, filename.toString()),
            reason: 'unsafe_filename'
          });
        }
        return;
      }

      this.handleFile(filePath);
      this.trace('file_event', { eventType, filePath, strategy: this.activeStrategy });
    });

    this.watcher.on('error', (error) => {
      this.setStatus('error', folderPath, error.message);
    });

    this.activeStrategy = 'fs-watch';
    this.trace('watcher_strategy', { strategy: this.activeStrategy, folderPath });
  }

  startPolling(folderPath) {
    this.activeStrategy = 'polling';
    this.poller = this.setIntervalFn(() => {
      this.pollOnce();
    }, this.pollIntervalMs);
    this.trace('watcher_strategy', {
      strategy: this.activeStrategy,
      folderPath,
      intervalMs: this.pollIntervalMs
    });
  }

  pollOnce() {
    if (!this.folderPath) {
      return [];
    }
    if (!this.canIngest()) {
      this.setStatus('blocked', this.folderPath, 'I/O authority is off; gamelog ingest is paused');
      return [];
    }

    const events = [];
    let entries;
    try {
      entries = fs.readdirSync(this.folderPath, { withFileTypes: true });
    } catch (error) {
      this.setStatus('error', this.folderPath, error.message);
      return events;
    }

    for (const entry of entries) {
      if (!entry.isFile() || !isTextLog(entry.name)) {
        continue;
      }
      const filePath = path.join(this.folderPath, entry.name);
      events.push(...this.handleFile(filePath));
    }
    this.trace('poll_tick', { folderPath: this.folderPath, events: events.length });
    return events;
  }

  handleFile(filePath) {
    if (!this.canIngest()) {
      this.setStatus('blocked', this.folderPath || path.dirname(path.resolve(String(filePath || ''))), 'I/O authority is off; gamelog ingest is paused');
      return [];
    }
    if (!isTextLog(filePath) || !fs.existsSync(filePath)) {
      return [];
    }

    const validation = this.validateContainedFile(filePath);
    if (!validation.ok) {
      this.trace('file_skipped_outside_containment', {
        filePath: validation.filePath || filePath,
        reason: validation.reason
      });
      return [];
    }
    const containedPath = validation.filePath;
    const stats = validation.stats;

    const previousOffset = this.offsets.get(containedPath);
    if (previousOffset == null) {
      this.offsets.set(containedPath, stats.size);
      this.fileIdentities.set(containedPath, validation.identity);
      this.trace('file_seeded', { filePath: containedPath, size: stats.size });
      return [];
    }

    const previousIdentity = this.fileIdentities.get(containedPath);
    if (previousIdentity && previousIdentity !== validation.identity) {
      this.offsets.set(containedPath, stats.size);
      this.fileIdentities.set(containedPath, validation.identity);
      this.partials.delete(containedPath);
      this.trace('file_replaced', { filePath: containedPath, previousOffset, size: stats.size });
      return [];
    }
    if (!previousIdentity) {
      this.fileIdentities.set(containedPath, validation.identity);
    }

    if (stats.size < previousOffset) {
      this.offsets.set(containedPath, stats.size);
      this.partials.delete(containedPath);
      this.trace('file_truncated', { filePath: containedPath, previousOffset, size: stats.size });
      return [];
    }

    const start = previousOffset;
    if (stats.size <= start) {
      return [];
    }
    if (!this.canIngest()) {
      this.setStatus('blocked', this.folderPath, 'I/O authority is off; gamelog ingest is paused');
      return [];
    }

    let text;
    try {
      text = this.readRange(containedPath, start, stats.size);
    } catch (error) {
      this.setStatus('error', this.folderPath, error.message);
      this.trace('tail_read_failed', {
        filePath: containedPath,
        start,
        end: stats.size,
        message: error.message
      });
      return [];
    }
    this.offsets.set(containedPath, stats.size);
    const complete = collectCompleteLines({
      chunk: text,
      partial: this.partials.get(containedPath) || ''
    });

    if (complete.partial) {
      this.partials.set(containedPath, complete.partial);
    } else {
      this.partials.delete(containedPath);
    }

    if (complete.partialDropped) {
      this.trace('partial_line_dropped', { filePath: containedPath });
    }

    const events = [];
    for (const line of complete.lines) {
      let event;
      try {
        event = this.parseLine(line);
      } catch (error) {
        this.reportRejectedLine({
          filePath: containedPath,
          line,
          reason: 'parser_error',
          message: error.message
        });
        continue;
      }

      if (!event) {
        this.reportRejectedLine({ filePath: containedPath, line, reason: 'unparsed' });
        continue;
      }
      if (this.deduper.isDuplicate(event)) {
        this.trace('duplicate_suppressed', { filePath: containedPath, id: event.id });
        continue;
      }
      events.push(event);
      try {
        this.onEvent(event);
      } catch (error) {
        this.trace('listener_error', {
          filePath: containedPath,
          eventId: event.id,
          rawLineHash: event.rawLineHash,
          message: error.message
        });
      }
    }

    this.trace('tail_read', { filePath: containedPath, start, end: stats.size, lines: complete.lines.length, events: events.length });
    return events;
  }

  validateContainedFile(filePath) {
    const resolved = path.resolve(String(filePath || ''));
    const folderPath = this.folderPath ? path.resolve(this.folderPath) : path.dirname(resolved);
    const folderRealPath = this.folderRealPath || realpathIfExists(folderPath) || folderPath;

    if (this.folderPath && !isDirectChildPath(resolved, folderPath)) {
      return { ok: false, filePath: resolved, reason: 'outside_active_folder' };
    }

    let linkStats;
    let stats;
    try {
      linkStats = fs.lstatSync(resolved);
      if (linkStats.isSymbolicLink()) {
        return { ok: false, filePath: resolved, reason: 'link_file' };
      }
      stats = fs.statSync(resolved);
    } catch {
      return { ok: false, filePath: resolved, reason: 'missing' };
    }

    if (!stats.isFile()) {
      return { ok: false, filePath: resolved, reason: 'not_file' };
    }

    const realPath = realpath(resolved);
    if (!isPathInsideOrEqual(realPath, folderRealPath)) {
      return { ok: false, filePath: resolved, reason: 'realpath_outside_active_folder' };
    }

    return {
      ok: true,
      filePath: resolved,
      realPath,
      stats,
      identity: fileIdentity(linkStats, stats)
    };
  }

  setStatus(state, folderPath, message) {
    const status = { state, path: folderPath, message, strategy: this.activeStrategy };
    this.onStatus(status);
    this.trace('status', status);
    return status;
  }

  reportRejectedLine({ filePath, line, reason, message }) {
    const rejected = {
      filePath,
      rawLineHash: sha256(line),
      reason,
      message
    };
    this.onRejectedLine(rejected);
    this.trace('line_rejected', {
      filePath,
      rawLineHash: rejected.rawLineHash,
      reason,
      message
    });
  }

  canIngest() {
    try {
      return this.isIngestAllowed() === true;
    } catch (error) {
      this.trace('ingest_authority_check_failed', { message: error.message });
      return false;
    }
  }
}

function containedFilenamePath(folderPath, filename) {
  if (!filename) {
    return null;
  }
  const name = filename.toString();
  if (name.includes('/') || name.includes('\\') || name === '.' || name === '..' || name.includes('..')) {
    return null;
  }
  return path.join(folderPath, name);
}

function isDirectChildPath(filePath, folderPath) {
  const relative = path.relative(path.resolve(folderPath), path.resolve(filePath));
  return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative) && !relative.includes(path.sep);
}

function isPathInsideOrEqual(childPath, parentPath) {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath));
  return relative === '' || (Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative));
}

function realpath(filePath) {
  return typeof fs.realpathSync.native === 'function'
    ? fs.realpathSync.native(filePath)
    : fs.realpathSync(filePath);
}

function realpathIfExists(filePath) {
  try {
    return realpath(filePath);
  } catch {
    return null;
  }
}

function fileIdentity(linkStats, stats) {
  return [
    stats.dev,
    stats.ino,
    Math.trunc(linkStats.birthtimeMs || stats.birthtimeMs || 0)
  ].join(':');
}

function readUtf8Range(filePath, start, endExclusive) {
  const length = endExclusive - start;
  const buffer = Buffer.alloc(length);
  const fd = fs.openSync(filePath, 'r');
  try {
    fs.readSync(fd, buffer, 0, length, start);
  } finally {
    fs.closeSync(fd);
  }
  return buffer.toString('utf8');
}

function isTextLog(filePath) {
  return String(filePath || '').toLowerCase().endsWith('.txt');
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

module.exports = {
  EveGamelogWatcher,
  isTextLog,
  validateGamelogFolder
};
