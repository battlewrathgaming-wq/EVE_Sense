const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const REQUIRED_FIELDS = ['name', 'raw', 'rawLineHash', 'proposedFamily', 'expectedDisposition'];
const VALID_DISPOSITIONS = new Set(['accepted', 'rejected', 'deferred', 'unknown']);

function readCuratedRows(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  if (filePath.toLowerCase().endsWith('.jsonl')) {
    return source
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line, index) => parseJsonLine(line, index + 1));
  }
  if (filePath.toLowerCase().endsWith('.json')) {
    const parsed = JSON.parse(source);
    return Array.isArray(parsed) ? parsed : parsed.rows;
  }
  if (filePath.toLowerCase().endsWith('.csv')) {
    return parseCsv(source);
  }
  throw new Error('Unsupported curated source format. Use JSONL, JSON, or CSV export.');
}

function buildFixtureRows(rows) {
  if (!Array.isArray(rows)) {
    throw new Error('Curated fixture source must contain an array of rows');
  }

  return rows.map((row, index) => normalizeRow(row, index + 1));
}

function normalizeRow(row, rowNumber) {
  for (const field of REQUIRED_FIELDS) {
    if (row?.[field] == null || row[field] === '') {
      throw new Error(`Curated row ${rowNumber} missing required field ${field}`);
    }
  }

  if (!VALID_DISPOSITIONS.has(row.expectedDisposition)) {
    throw new Error(`Curated row ${rowNumber} has invalid expectedDisposition ${row.expectedDisposition}`);
  }

  const raw = String(row.raw);
  const actualHash = sha256(raw.trim());
  if (actualHash !== row.rawLineHash) {
    throw new Error(`Curated row ${rowNumber} hash drift for ${row.name}: expected ${row.rawLineHash}, got ${actualHash}`);
  }

  return {
    name: String(row.name),
    source: {
      file: row.sourceFile || null,
      line: Number.isInteger(Number(row.sourceLine)) ? Number(row.sourceLine) : null
    },
    proposedFamily: String(row.proposedFamily),
    expectedDisposition: row.expectedDisposition,
    rawLineHash: row.rawLineHash,
    raw
  };
}

function parseJsonLine(line, rowNumber) {
  try {
    return JSON.parse(line);
  } catch (error) {
    throw new Error(`Invalid JSONL row ${rowNumber}: ${error.message}`);
  }
}

function parseCsv(source) {
  const lines = source.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) {
    return [];
  }
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function splitCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function main(argv = process.argv.slice(2)) {
  const source = option(argv, '--source') || path.join(__dirname, '..', 'fixtures', 'combat-log-curated-source.jsonl');
  const out = option(argv, '--out');
  const rows = buildFixtureRows(readCuratedRows(source));
  if (out) {
    fs.writeFileSync(out, `${JSON.stringify({ rows }, null, 2)}\n`);
  }
  console.log(`combat fixture ingestion verified: ${rows.length} curated rows`);
}

function option(argv, name) {
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : null;
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  buildFixtureRows,
  readCuratedRows,
  sha256
};
