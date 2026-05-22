const os = require('node:os');
const path = require('node:path');

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

module.exports = {
  defaultGamelogFolder,
  normalizeGamelogFolder
};
