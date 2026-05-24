const fs = require('node:fs');
const zlib = require('node:zlib');

const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const LOCAL_FILE_SIGNATURE = 0x04034b50;
const DEFAULT_MAX_ENTRY_BYTES = 5 * 1024 * 1024;

function readZipEntries(zipPath, { maxEntryBytes = DEFAULT_MAX_ENTRY_BYTES } = {}) {
  const bytes = fs.readFileSync(zipPath);
  const eocdOffset = findEndOfCentralDirectory(bytes);
  const entryCount = bytes.readUInt16LE(eocdOffset + 10);
  const centralDirectoryOffset = bytes.readUInt32LE(eocdOffset + 16);
  if (centralDirectoryOffset >= bytes.length) {
    throw new Error('Invalid ZIP central directory offset');
  }
  const entries = [];
  let offset = centralDirectoryOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (offset + 46 > bytes.length) {
      throw new Error('Invalid ZIP central directory bounds');
    }
    if (bytes.readUInt32LE(offset) !== CENTRAL_DIRECTORY_SIGNATURE) {
      throw new Error('Invalid ZIP central directory entry');
    }
    const compressionMethod = bytes.readUInt16LE(offset + 10);
    const compressedSize = bytes.readUInt32LE(offset + 20);
    const uncompressedSize = bytes.readUInt32LE(offset + 24);
    const fileNameLength = bytes.readUInt16LE(offset + 28);
    const extraLength = bytes.readUInt16LE(offset + 30);
    const commentLength = bytes.readUInt16LE(offset + 32);
    const localHeaderOffset = bytes.readUInt32LE(offset + 42);
    const name = bytes.slice(offset + 46, offset + 46 + fileNameLength).toString('utf8');
    assertSafeEntryName(name);
    if (uncompressedSize > maxEntryBytes) {
      const error = new Error(`ZIP entry exceeds maximum size for ${name}`);
      error.code = 'SDE_ZIP_ENTRY_TOO_LARGE';
      throw error;
    }
    entries.push({
      name,
      compressionMethod,
      compressedSize,
      uncompressedSize,
      localHeaderOffset,
      maxEntryBytes
    });
    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries.map((entry) => ({
    name: entry.name,
    text: () => readEntryText(bytes, entry)
  }));
}

function readEntryText(bytes, entry) {
  const offset = entry.localHeaderOffset;
  if (offset + 30 > bytes.length) {
    throw new Error('Invalid ZIP local file header bounds');
  }
  if (bytes.readUInt32LE(offset) !== LOCAL_FILE_SIGNATURE) {
    throw new Error('Invalid ZIP local file header');
  }
  const fileNameLength = bytes.readUInt16LE(offset + 26);
  const extraLength = bytes.readUInt16LE(offset + 28);
  const dataOffset = offset + 30 + fileNameLength + extraLength;
  if (dataOffset + entry.compressedSize > bytes.length) {
    throw new Error(`ZIP entry data exceeds archive bounds for ${entry.name}`);
  }
  const compressed = bytes.slice(dataOffset, dataOffset + entry.compressedSize);
  if (entry.compressionMethod === 0) {
    if (compressed.length > entry.maxEntryBytes) {
      const error = new Error(`ZIP entry exceeds maximum size for ${entry.name}`);
      error.code = 'SDE_ZIP_ENTRY_TOO_LARGE';
      throw error;
    }
    return compressed.toString('utf8');
  }
  if (entry.compressionMethod === 8) {
    const inflated = zlib.inflateRawSync(compressed);
    if (entry.uncompressedSize && inflated.length !== entry.uncompressedSize) {
      throw new Error(`ZIP entry size mismatch for ${entry.name}`);
    }
    if (inflated.length > entry.maxEntryBytes) {
      const error = new Error(`ZIP entry exceeds maximum size for ${entry.name}`);
      error.code = 'SDE_ZIP_ENTRY_TOO_LARGE';
      throw error;
    }
    return inflated.toString('utf8');
  }
  throw new Error(`Unsupported ZIP compression method ${entry.compressionMethod} for ${entry.name}`);
}

function findEndOfCentralDirectory(bytes) {
  const minimumOffset = Math.max(0, bytes.length - 65557);
  for (let offset = bytes.length - 22; offset >= minimumOffset; offset -= 1) {
    if (bytes.readUInt32LE(offset) === EOCD_SIGNATURE) {
      return offset;
    }
  }
  throw new Error('ZIP end of central directory not found');
}

function assertSafeEntryName(name) {
  const value = String(name || '');
  if (!value || value.includes('\0') || value.startsWith('/') || /^[a-z]:/i.test(value) || value.split(/[\\/]+/).includes('..')) {
    const error = new Error(`Unsafe ZIP entry path: ${value || '[empty]'}`);
    error.code = 'SDE_ZIP_UNSAFE_ENTRY_PATH';
    throw error;
  }
}

module.exports = {
  DEFAULT_MAX_ENTRY_BYTES,
  readZipEntries
};
