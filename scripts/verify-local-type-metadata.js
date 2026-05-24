const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const {
  buildLocalTypeMetadata,
  createTypeLookup,
  extractTypesFromSdeZip,
  loadLocalTypeMetadata
} = require('../src/metadata/localTypeMetadata');
const { readZipEntries } = require('../src/metadata/sdeJsonlZip');
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
        { typeID: 621, name: { en: 'Caracal Navy Issue' }, groupID: 26, categoryID: 6 },
        { typeID: 622, name: {}, groupID: 26, categoryID: 6 },
        { typeID: 'not-number', name: { en: 'Invalid' }, groupID: 26, categoryID: 6 },
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
    assert.deepStrictEqual(extracted.map((type) => type.name), ['Rifter', 'Caracal Navy Issue'], 'duplicate type rows should resolve deterministically to the latest row');

    const outputPath = path.join(tempRoot, 'local-type-metadata.json');
    const built = await buildLocalTypeMetadata({
      sourcePath: zipPath,
      outputPath,
      cacheDir: path.join(tempRoot, 'build-cache')
    });
    assert.strictEqual(built.artifact.typeCount, 2, 'metadata artifact should expose type count');
    assert.ok(built.artifact.source.file_checksum, 'metadata artifact should record source checksum provenance');
    const lookup = loadLocalTypeMetadata(outputPath);
    assert.strictEqual(lookup.labelForType(587), 'Rifter [typeID: 587]', 'lookup should label known type IDs');
    assert.strictEqual(lookup.labelForType(999999), 'Type 999999', 'lookup should keep unknown IDs visible');
    assert.strictEqual(loadLocalTypeMetadata(path.join(tempRoot, 'missing.json')).labelForType(587), 'Type 587', 'missing metadata artifact should fall back to unresolved labels');

    const malformedArtifact = path.join(tempRoot, 'malformed-local-type-metadata.json');
    fs.writeFileSync(malformedArtifact, '{not-json', 'utf8');
    assert.strictEqual(loadLocalTypeMetadata(malformedArtifact).resolveType(587), null, 'malformed metadata artifact should resolve no tactical facts');

    const dirtyLookup = createTypeLookup({
      587: { name: ' Rifter ', groupId: '25', categoryId: '6' },
      621: { name: '', groupId: 26, categoryId: 6 },
      'not-id': { name: 'Bad Type' }
    });
    assert.deepStrictEqual(dirtyLookup.resolveType(587), { typeId: 587, name: 'Rifter', groupId: 25, categoryId: 6 }, 'lookup should normalize valid compact records');
    assert.strictEqual(dirtyLookup.resolveType(621), null, 'lookup should ignore malformed compact records');

    const malformedJsonlPath = path.join(tempRoot, 'malformed-jsonl.zip');
    writeZip(malformedJsonlPath, {
      'fsd/types.jsonl': '{"typeID":587,"name":{"en":"Rifter"}}\n{not-json}\n'
    });
    const malformedCache = path.join(tempRoot, 'malformed-cache');
    await assertRejects(
      () => buildLocalTypeMetadata({
        sourcePath: malformedJsonlPath,
        outputPath: path.join(tempRoot, 'malformed-output.json'),
        cacheDir: malformedCache
      }),
      SyntaxError,
      'malformed JSONL should fail the metadata build'
    );
    assert.strictEqual(remainingSourceWorkDirs(malformedCache), 0, 'failed metadata build should clean staged source work directory');

    const oversizedPath = path.join(tempRoot, 'oversized.zip');
    writeZip(oversizedPath, {
      'fsd/types.jsonl': JSON.stringify({ typeID: 700, name: { en: 'Oversized' } })
    }, { stored: true });
    assertRejectsSync(
      () => extractTypesFromSdeZip(oversizedPath, { maxEntryBytes: 8 }),
      'SDE_ZIP_ENTRY_TOO_LARGE',
      'oversized ZIP entries should be rejected before broad metadata parsing'
    );

    const unsafePath = path.join(tempRoot, 'unsafe.zip');
    writeZip(unsafePath, {
      '../types.jsonl': JSON.stringify({ typeID: 701, name: { en: 'Unsafe' } })
    });
    assertRejectsSync(
      () => readZipEntries(unsafePath),
      'SDE_ZIP_UNSAFE_ENTRY_PATH',
      'unsafe ZIP entry paths should be rejected'
    );

    const unsupportedPath = path.join(tempRoot, 'unsupported.zip');
    writeZip(unsupportedPath, {
      'fsd/types.jsonl': JSON.stringify({ typeID: 702, name: { en: 'Unsupported' } })
    }, { compressionMethod: 12 });
    assertRejectsSync(
      () => extractTypesFromSdeZip(unsupportedPath),
      /Unsupported ZIP compression method/,
      'unsupported ZIP compression should be rejected'
    );

    const malformedZipPath = path.join(tempRoot, 'malformed.zip');
    fs.writeFileSync(malformedZipPath, Buffer.from('not a zip'));
    assertRejectsSync(
      () => extractTypesFromSdeZip(malformedZipPath),
      /ZIP end of central directory not found/,
      'malformed ZIP payload should be rejected'
    );

    console.log('local type metadata verified');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function writeZip(zipPath, entries, options = {}) {
  const fileParts = [];
  const centralParts = [];
  let offset = 0;
  for (const [name, text] of Object.entries(entries)) {
    const nameBytes = Buffer.from(name);
    const data = Buffer.from(text);
    const compressionMethod = options.stored ? 0 : (options.compressionMethod ?? 8);
    const compressed = compressionMethod === 0 ? data : (compressionMethod === 8 ? zlib.deflateRawSync(data) : data);
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(compressionMethod, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    fileParts.push(local, nameBytes, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(compressionMethod, 10);
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

async function assertRejects(fn, expected, message) {
  try {
    await fn();
  } catch (error) {
    assertExpectedError(error, expected, message);
    return;
  }
  throw new Error(message);
}

function assertRejectsSync(fn, expected, message) {
  try {
    fn();
  } catch (error) {
    assertExpectedError(error, expected, message);
    return;
  }
  throw new Error(message);
}

function assertExpectedError(error, expected, message) {
  if (typeof expected === 'string') {
    assert.strictEqual(error.code, expected, message);
    return;
  }
  if (expected instanceof RegExp) {
    assert.match(error.message, expected, message);
    return;
  }
  assert.ok(error instanceof expected, message);
}

function remainingSourceWorkDirs(cacheDir) {
  if (!fs.existsSync(cacheDir)) {
    return 0;
  }
  return fs.readdirSync(cacheDir).filter((entry) => entry.startsWith('sde-source-')).length;
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
