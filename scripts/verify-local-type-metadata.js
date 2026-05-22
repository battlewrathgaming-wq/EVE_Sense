const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const {
  buildLocalTypeMetadata,
  extractTypesFromSdeZip,
  loadLocalTypeMetadata
} = require('../src/metadata/localTypeMetadata');
const {
  prepareSdeSourceBundle,
  cleanupSdeSourceBundle,
  readBuildNumberFromLatestJsonl,
  buildSdeJsonlZipUrl
} = require('../src/util/sdeSourceBundle');
const { projectRoot } = require('../src/util/tempPaths');

async function main() {
  const tempBase = path.join(projectRoot(), '.tmp', 'verify-local-type-metadata');
  fs.rmSync(tempBase, { recursive: true, force: true });
  fs.mkdirSync(tempBase, { recursive: true });
  const tempRoot = fs.mkdtempSync(path.join(tempBase, 'run-'));
  try {
    const zipPath = path.join(tempRoot, 'eve-online-static-data-3351823-jsonl.zip');
    writeZip(zipPath, {
      'fsd/types.jsonl': [
        { _key: 'typeIDs/587', _value: { name: { en: 'Rifter' }, groupID: 25, categoryID: 6 } },
        { typeID: 621, name: { en: 'Caracal' }, groupID: 26, categoryID: 6 },
        { _key: 'not-a-type', _value: { name: { en: 'Ignored' } } }
      ].map((record) => JSON.stringify(record)).join('\n')
    });

    assert.strictEqual(readBuildNumberFromLatestJsonl(`${JSON.stringify({ _key: 'sde', _value: { buildNumber: 3351823 } })}\n`), '3351823', 'latest SDE metadata should parse build number');
    assert.ok(buildSdeJsonlZipUrl('3351823').endsWith('eve-online-static-data-3351823-jsonl.zip'), 'SDE build URL should target JSONL zip');

    const source = await prepareSdeSourceBundle({
      sourcePath: zipPath,
      cacheDir: path.join(tempRoot, 'cache')
    });
    assert.strictEqual(source.downloaded, false, 'local SDE source should not count as download');
    assert.strictEqual(source.source.build_number, '3351823', 'local SDE source should derive build number from filename');
    source.cleanup();
    assert.ok(fs.existsSync(zipPath), 'cleanup should not delete caller-owned local SDE source');
    assert.strictEqual(cleanupSdeSourceBundle({}).cleaned, false, 'cleanup without work directory should be harmless');

    const extracted = extractTypesFromSdeZip(zipPath);
    assert.strictEqual(extracted.length, 2, 'type extraction should keep only valid type rows');
    assert.deepStrictEqual(extracted.map((type) => type.name), ['Rifter', 'Caracal'], 'type extraction should keep English names');

    const outputPath = path.join(tempRoot, 'local-type-metadata.json');
    const built = await buildLocalTypeMetadata({
      sourcePath: zipPath,
      outputPath,
      cacheDir: path.join(tempRoot, 'build-cache')
    });
    assert.strictEqual(built.artifact.typeCount, 2, 'metadata artifact should expose type count');
    const lookup = loadLocalTypeMetadata(outputPath);
    assert.strictEqual(lookup.labelForType(587), 'Rifter [typeID: 587]', 'lookup should label known type IDs');
    assert.strictEqual(lookup.labelForType(999999), 'Type 999999', 'lookup should keep unknown IDs visible');

    console.log('local type metadata verified');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function writeZip(zipPath, entries) {
  const fileParts = [];
  const centralParts = [];
  let offset = 0;
  for (const [name, text] of Object.entries(entries)) {
    const nameBytes = Buffer.from(name);
    const data = Buffer.from(text);
    const compressed = zlib.deflateRawSync(data);
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    fileParts.push(local, nameBytes, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(8, 10);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, nameBytes);
    offset += local.length + nameBytes.length + compressed.length;
  }
  const centralOffset = offset;
  const centralDirectory = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(Object.keys(entries).length, 8);
  eocd.writeUInt16LE(Object.keys(entries).length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(centralOffset, 16);
  fs.writeFileSync(zipPath, Buffer.concat([...fileParts, centralDirectory, eocd]));
}

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const CRC_TABLE = Array.from({ length: 256 }, (_value, index) => {
  let c = index;
  for (let bit = 0; bit < 8; bit += 1) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  return c >>> 0;
});

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
