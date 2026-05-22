const fs = require('node:fs');
const path = require('node:path');
const { prepareSdeSourceBundle } = require('../util/sdeSourceBundle');
const { readZipEntries } = require('./sdeJsonlZip');
const { projectRoot } = require('../util/tempPaths');

const DEFAULT_TYPE_METADATA_PATH = path.join(projectRoot(), 'fixtures', 'local-type-metadata.json');

async function buildLocalTypeMetadata(options = {}) {
  const bundle = await prepareSdeSourceBundle(options);
  try {
    const types = extractTypesFromSdeZip(bundle.source_path);
    const artifact = {
      kind: 'aura-sense.local-type-metadata',
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      source: bundle.source,
      typeCount: types.length,
      types: Object.fromEntries(types.map((type) => [String(type.typeId), {
        name: type.name,
        groupId: type.groupId,
        categoryId: type.categoryId
      }]))
    };
    const outputPath = path.resolve(options.outputPath || DEFAULT_TYPE_METADATA_PATH);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
    return { outputPath, artifact, cleanup: bundle.cleanup };
  } finally {
    if (options.keepSource !== true && process.env.AURA_SENSE_KEEP_SDE_SOURCE !== '1') {
      bundle.cleanup();
    }
  }
}

function loadLocalTypeMetadata(metadataPath = DEFAULT_TYPE_METADATA_PATH) {
  try {
    const artifact = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    return createTypeLookup(artifact.types || {});
  } catch {
    return createTypeLookup({});
  }
}

function createTypeLookup(types = {}) {
  return {
    labelForType(typeId) {
      const key = String(typeId);
      const type = types[key];
      return type?.name ? `${type.name} [typeID: ${key}]` : `Type ${key}`;
    },
    resolveType(typeId) {
      const key = String(typeId);
      const type = types[key] || null;
      return type ? { typeId: Number(key), ...type } : null;
    }
  };
}

function extractTypesFromSdeZip(zipPath) {
  const entries = readZipEntries(zipPath).filter((entry) => /\.jsonl$/i.test(entry.name));
  const types = new Map();
  for (const entry of entries) {
    for (const line of entry.text().split(/\r?\n/)) {
      if (!line.trim()) {
        continue;
      }
      const parsed = JSON.parse(line);
      const normalized = normalizeTypeRecord(parsed, entry.name);
      if (normalized) {
        types.set(normalized.typeId, normalized);
      }
    }
  }
  return Array.from(types.values()).sort((left, right) => left.typeId - right.typeId);
}

function normalizeTypeRecord(record, sourceName = '') {
  const key = record._key ?? record.key;
  const value = Object.hasOwn(record, '_value') ? record._value : (record.value || record);
  const typeId = Number(record.typeID ?? record.typeId ?? record.type_id ?? value?.typeID ?? value?.typeId ?? value?.type_id ?? typeIdFromKey(key));
  if (!Number.isInteger(typeId) || typeId < 1) {
    return null;
  }
  const name = englishName(value?.name || record.name || value?.typeName || record.typeName);
  if (!name) {
    return null;
  }
  const looksLikeTypeEntry = /type/i.test(String(sourceName)) || key || record.typeID || value?.typeID || value?.type_id;
  if (!looksLikeTypeEntry) {
    return null;
  }
  return {
    typeId,
    name,
    groupId: finiteOrNull(value?.groupID ?? value?.groupId ?? value?.group_id ?? record.groupID),
    categoryId: finiteOrNull(value?.categoryID ?? value?.categoryId ?? value?.category_id ?? record.categoryID)
  };
}

function typeIdFromKey(key) {
  const match = String(key || '').match(/(?:typeIDs?|types?)\/?(\d+)$/i);
  return match ? match[1] : null;
}

function englishName(value) {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return value.trim() || null;
  }
  return String(value.en || value.en_us || value.enUS || value.name || '').trim() || null;
}

function finiteOrNull(value) {
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

module.exports = {
  DEFAULT_TYPE_METADATA_PATH,
  buildLocalTypeMetadata,
  createTypeLookup,
  extractTypesFromSdeZip,
  loadLocalTypeMetadata,
  normalizeTypeRecord
};
