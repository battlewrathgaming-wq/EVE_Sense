const fs = require('node:fs');
const path = require('node:path');

function createLocalSystemResolver({
  systems = null,
  metadataPath = path.join(__dirname, '..', '..', 'fixtures', 'passive-system-resolver.json')
} = {}) {
  const entries = Array.isArray(systems) ? systems : readSystemMetadata(metadataPath);
  const byName = new Map();
  for (const entry of entries) {
    const name = String(entry.systemName || entry.name || '').trim();
    const id = Number(entry.systemId || entry.solarSystemID || entry.solarSystemId);
    if (name && Number.isInteger(id) && id > 0) {
      byName.set(name, { systemName: name, systemId: id, resolved: true, source: 'local-static' });
    }
  }

  return (systemName) => {
    const name = String(systemName || '').trim();
    const resolved = byName.get(name);
    if (resolved) {
      return { ...resolved };
    }
    return {
      systemName: name,
      systemId: null,
      resolved: false,
      source: 'local-static',
      reason: 'SYSTEM_NOT_FOUND'
    };
  };
}

function readSystemMetadata(metadataPath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    return Array.isArray(parsed) ? parsed : parsed.systems || [];
  } catch (_error) {
    return [];
  }
}

module.exports = {
  createLocalSystemResolver,
  readSystemMetadata
};
