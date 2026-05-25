const os = require('node:os');
const path = require('node:path');

const EXPECTED_GAMELOG_STRUCTURE = Object.freeze(['eve', 'logs', 'gamelogs']);

function defaultGamelogFolder({ homeDir = os.homedir(), platform = process.platform } = {}) {
  if (platform === 'win32') {
    return path.join(homeDir, 'Documents', 'EVE', 'logs', 'Gamelogs');
  }

  return path.join(homeDir, 'Documents', 'EVE', 'logs', 'Gamelogs');
}

function normalizeGamelogFolder(inputPath) {
  const value = String(inputPath || '').trim();
  if (!value) {
    return null;
  }

  return path.resolve(value);
}

function hasExpectedGamelogStructure(folderPath) {
  const segments = path.resolve(String(folderPath || ''))
    .split(/[\\/]+/)
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());

  if (segments.length < EXPECTED_GAMELOG_STRUCTURE.length) {
    return false;
  }

  const tail = segments.slice(-EXPECTED_GAMELOG_STRUCTURE.length);
  return EXPECTED_GAMELOG_STRUCTURE.every((segment, index) => tail[index] === segment);
}

function validateGamelogFolder(folderPath, { fsImpl = require('node:fs') } = {}) {
  const normalized = normalizeGamelogFolder(folderPath);
  if (!normalized) {
    return { ok: false, state: 'missing', code: 'GAMELOG_PATH_EMPTY', message: 'EVE gamelog folder is not configured' };
  }

  try {
    const linkStats = fsImpl.lstatSync(normalized);
    if (!hasExpectedGamelogStructure(normalized)) {
      return {
        ok: false,
        state: 'invalid',
        code: 'GAMELOG_PATH_OUTSIDE_EXPECTED_STRUCTURE',
        message: 'EVE gamelog path must end in EVE/logs/Gamelogs'
      };
    }

    if (linkStats.isSymbolicLink()) {
      return {
        ok: false,
        state: 'invalid',
        code: 'GAMELOG_PATH_LINK_ESCAPE',
        message: 'EVE gamelog path must be a real folder, not a link'
      };
    }

    const realPath = realpath(fsImpl, normalized);
    if (!hasExpectedGamelogStructure(realPath)) {
      return {
        ok: false,
        state: 'invalid',
        code: 'GAMELOG_REALPATH_OUTSIDE_EXPECTED_STRUCTURE',
        message: 'EVE gamelog real path must remain under EVE/logs/Gamelogs'
      };
    }

    const stats = fsImpl.statSync(realPath);
    if (!stats.isDirectory()) {
      return { ok: false, state: 'invalid', code: 'GAMELOG_PATH_NOT_DIRECTORY', message: 'EVE gamelog path is not a folder' };
    }

    return { ok: true, value: normalized, realPath };
  } catch (error) {
    return { ok: false, state: 'missing', code: 'GAMELOG_PATH_MISSING', message: 'EVE gamelog folder not found' };
  }
}

function realpath(fsImpl, filePath) {
  return typeof fsImpl.realpathSync?.native === 'function'
    ? fsImpl.realpathSync.native(filePath)
    : fsImpl.realpathSync(filePath);
}

module.exports = {
  EXPECTED_GAMELOG_STRUCTURE,
  defaultGamelogFolder,
  hasExpectedGamelogStructure,
  normalizeGamelogFolder,
  validateGamelogFolder
};
