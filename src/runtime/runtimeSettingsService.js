const fs = require('node:fs');
const path = require('node:path');
const { validateSettingsPayload } = require('../services/ipcPayloadValidation');

const SETTINGS_SCHEMA_VERSION = 1;

function createRuntimeSettingsService({
  settingsPath,
  now = () => new Date().toISOString()
} = {}) {
  if (!settingsPath) {
    throw new Error('Runtime settings service requires settingsPath');
  }

  let snapshot = emptySnapshot(settingsPath, now);

  function load() {
    if (!fs.existsSync(settingsPath)) {
      snapshot = emptySnapshot(settingsPath, now);
      return snapshot;
    }

    try {
      const parsed = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      const validation = validateSettingsPayload(parsed?.settings || {});
      if (!validation.ok) {
        snapshot = degradedSnapshot(settingsPath, validation, now);
        return snapshot;
      }
      snapshot = readySnapshot(settingsPath, validation.value, validation.warnings || [], now);
      return snapshot;
    } catch (error) {
      snapshot = degradedSnapshot(settingsPath, {
        code: 'SETTINGS_READ_FAILED',
        message: error.message
      }, now);
      return snapshot;
    }
  }

  function save(payload = {}) {
    const previous = snapshot.settings || {};
    const validation = validateSettingsPayload(payload, { previous });
    if (!validation.ok) {
      snapshot = degradedSnapshot(settingsPath, validation, now, previous);
      return snapshot;
    }

    const document = {
      schemaVersion: SETTINGS_SCHEMA_VERSION,
      savedAt: now(),
      settings: validation.value
    };
    try {
      fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
      fs.writeFileSync(settingsPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
      snapshot = readySnapshot(settingsPath, validation.value, validation.warnings || [], now);
    } catch (error) {
      snapshot = degradedSnapshot(settingsPath, {
        code: 'SETTINGS_WRITE_FAILED',
        message: error.message
      }, now, previous);
    }
    return snapshot;
  }

  function current() {
    return snapshot;
  }

  return {
    current,
    load,
    save,
    settingsPath
  };
}

function emptySnapshot(settingsPath, now) {
  return {
    kind: 'runtime.settings.snapshot',
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    status: 'missing',
    message: 'Runtime settings have not been saved',
    settingsPath,
    settings: {
      gamelogFolder: null,
      userAgent: null
    },
    warnings: [],
    failure: null,
    observedAt: now()
  };
}

function readySnapshot(settingsPath, settings, warnings, now) {
  return {
    kind: 'runtime.settings.snapshot',
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    status: warnings.length ? 'recovered' : 'ready',
    message: warnings.length ? 'Runtime settings loaded with recoverable warnings' : 'Runtime settings loaded',
    settingsPath,
    settings: {
      gamelogFolder: settings.gamelogFolder || null,
      userAgent: settings.userAgent || null
    },
    warnings,
    failure: null,
    observedAt: now()
  };
}

function degradedSnapshot(settingsPath, failure, now, previous = {}) {
  return {
    kind: 'runtime.settings.snapshot',
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    status: 'degraded',
    message: failure.message || 'Runtime settings are invalid',
    settingsPath,
    settings: {
      gamelogFolder: previous.gamelogFolder || null,
      userAgent: previous.userAgent || null
    },
    warnings: [],
    failure: {
      code: failure.code || 'SETTINGS_INVALID',
      message: failure.message || 'Runtime settings are invalid'
    },
    observedAt: now()
  };
}

module.exports = {
  SETTINGS_SCHEMA_VERSION,
  createRuntimeSettingsService
};
