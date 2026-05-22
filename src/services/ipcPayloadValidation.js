const fs = require('node:fs');

const MAX_SCAN_QUERY_LENGTH = 128;
const MAX_USER_AGENT_LENGTH = 180;
const MAX_TASK_REASON_LENGTH = 240;
const SAFE_USER_AGENT = 'AURA-Sense/0.1.0 local-development-seed';
const TYPE_HINTS = new Set(['auto', 'system', 'character', 'corporation', 'alliance']);

function validateServiceInvokeRequest(request) {
  if (!isPlainObject(request)) {
    return validationError('SERVICE_INVALID_REQUEST', 'Service invoke request must be an object');
  }
  if (typeof request.command !== 'string' || request.command.trim() === '') {
    return validationError('SERVICE_INVALID_COMMAND', 'Service invoke request requires a command');
  }
  if (request.payload !== undefined && !isPlainObject(request.payload)) {
    return validationError('SERVICE_INVALID_PAYLOAD', 'Service invoke payload must be an object');
  }
  return { ok: true };
}

function validateTaskListPayload(payload = {}) {
  if (!isPlainObject(payload)) {
    return validationError('TASK_LIST_INVALID_PAYLOAD', 'task.list payload must be an object');
  }
  if (payload.limit === undefined) {
    return { ok: true };
  }
  const limit = Number(payload.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return validationError('TASK_LIST_INVALID_LIMIT', 'task.list limit must be an integer from 1 to 100');
  }
  return { ok: true };
}

function validateTaskCancelPayload(payload = {}) {
  if (!isPlainObject(payload)) {
    return validationError('TASK_CANCEL_INVALID_PAYLOAD', 'task.cancel payload must be an object');
  }
  if (typeof payload.task_id !== 'string' || payload.task_id.trim() === '') {
    return validationError('TASK_CANCEL_INVALID_ID', 'task.cancel requires a task_id');
  }
  if (payload.reason !== undefined && !boundedString(payload.reason, MAX_TASK_REASON_LENGTH)) {
    return validationError('TASK_CANCEL_INVALID_REASON', `task.cancel reason must be ${MAX_TASK_REASON_LENGTH} characters or fewer`);
  }
  return { ok: true };
}

function validateActiveScanPayload(payload) {
  const normalized = typeof payload === 'string' ? { query: payload, typeHint: 'auto' } : payload;
  if (!isPlainObject(normalized)) {
    return validationError('SCAN_INVALID_PAYLOAD', 'Active scan payload must be a query string or object');
  }
  const query = String(normalized.query || '').trim();
  if (!query) {
    return validationError('SCAN_EMPTY_QUERY', 'Active scan query is required');
  }
  if (query.length > MAX_SCAN_QUERY_LENGTH) {
    return validationError('SCAN_QUERY_TOO_LONG', `Active scan query must be ${MAX_SCAN_QUERY_LENGTH} characters or fewer`);
  }
  const typeHint = String(normalized.typeHint || 'auto').trim().toLowerCase();
  if (!TYPE_HINTS.has(typeHint)) {
    return validationError('SCAN_INVALID_TYPE_HINT', `Active scan typeHint must be one of: ${Array.from(TYPE_HINTS).join(', ')}`);
  }
  return {
    ok: true,
    value: {
      query,
      typeHint
    }
  };
}

function validateSettingsPayload(payload = {}, { previous = {}, safeUserAgent = SAFE_USER_AGENT } = {}) {
  if (!isPlainObject(payload)) {
    return validationError('SETTINGS_INVALID_PAYLOAD', 'Settings payload must be an object');
  }

  const warnings = [];
  const next = { ...previous };

  if (Object.hasOwn(payload, 'userAgent')) {
    const userAgent = String(payload.userAgent || '').trim();
    if (!userAgent) {
      next.userAgent = previous.userAgent || safeUserAgent;
      warnings.push({ code: 'SETTINGS_USER_AGENT_FALLBACK', message: 'Blank User-Agent ignored; safe fallback preserved' });
    } else if (userAgent.length > MAX_USER_AGENT_LENGTH) {
      return validationError('SETTINGS_USER_AGENT_TOO_LONG', `User-Agent must be ${MAX_USER_AGENT_LENGTH} characters or fewer`);
    } else {
      next.userAgent = userAgent;
    }
  }

  if (Object.hasOwn(payload, 'gamelogFolder')) {
    const folder = String(payload.gamelogFolder || '').trim();
    const pathValidation = validateLogPathForWatcher(folder);
    if (!pathValidation.ok) {
      return pathValidation;
    }
    next.gamelogFolder = pathValidation.value;
  }

  return { ok: true, value: next, warnings };
}

function validateLogPathForWatcher(inputPath) {
  const value = String(inputPath || '').trim();
  if (!value) {
    return validationError('SETTINGS_LOG_PATH_EMPTY', 'EVE gamelog folder path is required before watcher restart');
  }
  try {
    const stats = fs.statSync(value);
    if (!stats.isDirectory()) {
      return validationError('SETTINGS_LOG_PATH_NOT_DIRECTORY', 'EVE gamelog path must be a folder');
    }
    return { ok: true, value };
  } catch {
    return validationError('SETTINGS_LOG_PATH_MISSING', 'EVE gamelog folder does not exist');
  }
}

function validationError(code, message) {
  return {
    ok: false,
    code,
    message
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function boundedString(value, maxLength) {
  return typeof value === 'string' && value.trim().length <= maxLength;
}

module.exports = {
  MAX_SCAN_QUERY_LENGTH,
  SAFE_USER_AGENT,
  TYPE_HINTS,
  validateActiveScanPayload,
  validateLogPathForWatcher,
  validateServiceInvokeRequest,
  validateSettingsPayload,
  validateTaskCancelPayload,
  validateTaskListPayload
};
