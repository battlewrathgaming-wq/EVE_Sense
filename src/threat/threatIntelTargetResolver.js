const fs = require('node:fs');
const path = require('node:path');

const TARGET_KINDS = Object.freeze(['system', 'pilot', 'corporation', 'alliance', 'text']);
const KIND_PREFIXES = new Map([
  ['system', 'system'],
  ['sys', 'system'],
  ['pilot', 'pilot'],
  ['character', 'pilot'],
  ['char', 'pilot'],
  ['corporation', 'corporation'],
  ['corp', 'corporation'],
  ['alliance', 'alliance'],
  ['ally', 'alliance'],
  ['text', 'text']
]);

function createThreatIntelTargetResolver({
  targets = null,
  metadataPath = path.join(__dirname, '..', '..', 'fixtures', 'threat-intel-targets.json')
} = {}) {
  const entries = Array.isArray(targets) ? targets : readTargetMetadata(metadataPath);
  const normalized = entries
    .map(normalizeEntry)
    .filter(Boolean);

  return (request = {}) => resolveTarget(request, normalized);
}

function resolveTarget(request = {}, targets = []) {
  const rawText = String(request.targetText || '').trim();
  if (!rawText) {
    return unresolved('empty', 'Threat Intel target is empty', { rawText });
  }

  const parsed = parseTargetText(rawText, request.targetKind);
  if (!parsed.ok) {
    return unresolved(parsed.reason, parsed.message, { rawText });
  }

  if (parsed.kind === 'text') {
    return {
      status: 'resolved',
      kind: 'text',
      label: parsed.label,
      id: null,
      source: 'copied-text',
      rawText
    };
  }

  const matches = targets.filter((target) => {
    const kindMatches = parsed.kind ? target.kind === parsed.kind : true;
    return kindMatches && target.label.toLowerCase() === parsed.label.toLowerCase();
  });

  if (matches.length === 1) {
    return {
      status: 'resolved',
      kind: matches[0].kind,
      label: matches[0].label,
      id: matches[0].id,
      source: 'local-static',
      rawText
    };
  }
  if (matches.length > 1) {
    return unresolved('ambiguous', 'Threat Intel target is ambiguous', {
      rawText,
      candidates: matches.map(({ kind, label, id }) => ({ kind, label, id }))
    });
  }
  if (!parsed.kind) {
    return unresolved('ambiguous', 'Threat Intel target kind is required when no exact local match exists', { rawText });
  }
  return unresolved('unresolved', 'Threat Intel target could not be resolved locally', {
    rawText,
    kind: parsed.kind,
    label: parsed.label
  });
}

function parseTargetText(rawText, requestedKind = null) {
  const prefixMatch = rawText.match(/^(?<prefix>[a-zA-Z]+)\s*:\s*(?<label>.+)$/);
  const prefixKind = prefixMatch ? KIND_PREFIXES.get(prefixMatch.groups.prefix.toLowerCase()) : null;
  const kind = normalizeKind(requestedKind) || prefixKind || null;
  const label = prefixMatch ? prefixMatch.groups.label.trim() : rawText.trim();
  if (requestedKind && !normalizeKind(requestedKind)) {
    return { ok: false, reason: 'unsupported', message: 'Threat Intel target kind is unsupported' };
  }
  if (prefixMatch && !prefixKind) {
    return { ok: false, reason: 'unsupported', message: 'Threat Intel target prefix is unsupported' };
  }
  if (!label) {
    return { ok: false, reason: 'empty', message: 'Threat Intel target is empty' };
  }
  return { ok: true, kind, label };
}

function normalizeKind(kind) {
  if (!kind) {
    return null;
  }
  return KIND_PREFIXES.get(String(kind).toLowerCase()) || null;
}

function normalizeEntry(entry) {
  const kind = normalizeKind(entry?.kind);
  const label = String(entry?.label || '').trim();
  const id = Number(entry?.id);
  if (!kind || kind === 'text' || !label || !Number.isInteger(id) || id < 1) {
    return null;
  }
  return { kind, label, id };
}

function unresolved(reason, message, extra = {}) {
  return {
    status: reason === 'ambiguous' ? 'ambiguous' : (reason === 'unsupported' ? 'unsupported' : 'unresolved'),
    reason,
    message,
    ...extra
  };
}

function readTargetMetadata(metadataPath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    return Array.isArray(parsed) ? parsed : parsed.targets || [];
  } catch (_error) {
    return [];
  }
}

module.exports = {
  TARGET_KINDS,
  createThreatIntelTargetResolver,
  parseTargetText,
  resolveTarget
};
