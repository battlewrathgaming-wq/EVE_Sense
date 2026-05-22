const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { collectCompleteLines } = require('./lineBuffer');
const { parseEveLogLine } = require('./combatLogParser');
const { RecentEventDeduper } = require('./recentEventDeduper');
const { normalizeGamelogFolder } = require('./eveLogPaths');

class EveGamelogWatcher {
  constructor({
    parseLine = parseEveLogLine,
    onEvent,
    onStatus = () => {},
    onRejectedLine = () => {},
    deduper = new RecentEventDeduper(),
    trace = () => {}
  } = {}) {
    this.parseLine = parseLine;
    this.onEvent = onEvent || (() => {});
    this.onStatus = onStatus;
    this.onRejectedLine = onRejectedLine;
    this.deduper = deduper;
    this.trace = trace;
    this.folderPath = null;
    this.watcher = null;
    this.offsets = new Map();
    this.partials = new Map();
  }

  start(inputPath) {
    this.stop();
    const folderPath = normalizeGamelogFolder(inputPath);
    if (!folderPath) {
      return this.setStatus('missing', null, 'EVE gamelog folder is not configured');
    }

    const validation = validateGamelogFolder(folderPath);
    if (!validation.ok) {
      return this.setStatus(validation.state, folderPath, validation.message);
    }

    this.folderPath = folderPath;
    this.seedOffsets(folderPath);
    this.watcher = fs.watch(folderPath, { persistent: true }, (eventType, filename) => {
      if (!filename || !isTextLog(filename)) {
        return;
      }

      const filePath = path.join(folderPath, filename.toString());
      this.handleFile(filePath);
      this.trace('file_event', { eventType, filePath });
    });

    this.watcher.on('error', (error) => {
      this.setStatus('error', folderPath, error.message);
    });

    return this.setStatus('watching', folderPath, 'Watching EVE gamelogs');
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
    }
    this.watcher = null;
    this.folderPath = null;
    this.offsets.clear();
    this.partials.clear();
    this.deduper.clear?.();
  }

  seedOffsets(folderPath) {
    for (const entry of fs.readdirSync(folderPath, { withFileTypes: true })) {
      if (!entry.isFile() || !isTextLog(entry.name)) {
        continue;
      }

      const filePath = path.join(folderPath, entry.name);
      this.offsets.set(filePath, fs.statSync(filePath).size);
    }

    this.trace('offsets_seeded', { folderPath, files: this.offsets.size });
  }

  handleFile(filePath) {
    if (!isTextLog(filePath) || !fs.existsSync(filePath)) {
      return [];
    }

    const stats = fs.statSync(filePath);
    const previousOffset = this.offsets.get(filePath);
    if (previousOffset == null) {
      this.offsets.set(filePath, stats.size);
      this.trace('file_seeded', { filePath, size: stats.size });
      return [];
    }

    const start = stats.size < previousOffset ? 0 : previousOffset;
    this.offsets.set(filePath, stats.size);
    if (stats.size <= start) {
      return [];
    }

    const text = readUtf8Range(filePath, start, stats.size);
    const complete = collectCompleteLines({
      chunk: text,
      partial: this.partials.get(filePath) || ''
    });

    if (complete.partial) {
      this.partials.set(filePath, complete.partial);
    } else {
      this.partials.delete(filePath);
    }

    if (complete.partialDropped) {
      this.trace('partial_line_dropped', { filePath });
    }

    const events = [];
    for (const line of complete.lines) {
      let event;
      try {
        event = this.parseLine(line);
      } catch (error) {
        this.reportRejectedLine({
          filePath,
          line,
          reason: 'parser_error',
          message: error.message
        });
        continue;
      }

      if (!event) {
        this.reportRejectedLine({ filePath, line, reason: 'unparsed' });
        continue;
      }
      if (this.deduper.isDuplicate(event)) {
        this.trace('duplicate_suppressed', { filePath, id: event.id });
        continue;
      }
      events.push(event);
      try {
        this.onEvent(event);
      } catch (error) {
        this.trace('listener_error', {
          filePath,
          eventId: event.id,
          rawLineHash: event.rawLineHash,
          message: error.message
        });
      }
    }

    this.trace('tail_read', { filePath, start, end: stats.size, lines: complete.lines.length, events: events.length });
    return events;
  }

  setStatus(state, folderPath, message) {
    const status = { state, path: folderPath, message };
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
    if (reason !== 'parser_error') {
      rejected.line = line;
    }
    this.onRejectedLine(rejected);
    this.trace('line_rejected', {
      filePath,
      rawLineHash: rejected.rawLineHash,
      reason,
      message
    });
  }
}

function validateGamelogFolder(folderPath) {
  try {
    const stats = fs.statSync(folderPath);
    if (!stats.isDirectory()) {
      return { ok: false, state: 'invalid', message: 'EVE gamelog path is not a folder' };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, state: 'missing', message: 'EVE gamelog folder not found' };
  }
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
