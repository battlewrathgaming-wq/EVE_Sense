const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const protectedWordsRoot = 'F:\\Projects\\Docs\\Aura-Project-Orchestration\\terminology\\protected-words';

const SCAN_ROOTS = [
  'workspace/current.md',
  'workspace/critical',
  'docs/index.md',
  'docs/current-state',
  'docs/contracts',
  'docs/features',
  'docs/schemas',
  'docs/terms',
  'src/main',
  'src/combat',
  'src/passive',
  'src/threat',
  'src/runtime',
  'src/renderer',
  'scripts/verify-renderer-shell.js',
  'scripts/verify-renderer-boundary.js',
  'scripts/verify-threat-intel.js',
  'scripts/verify-passive-telemetry.js'
];

const EXTENSIONS = new Set(['.md', '.js', '.html']);
const MAX_REPORT = 40;

function main() {
  const lookup = loadProtectedLookups();
  if (lookup.failures.length > 0) {
    throw new Error(`Sense protected-term lookup failed:\n${lookup.failures.join('\n')}`);
  }

  const files = collectScanFiles();
  const warnings = [
    ...findBorrowingWarnings(files, lookup),
    ...findBoundaryWarnings(files),
    ...discoverCandidates(files, lookup)
  ];

  console.log(`Sense protected-term discovery: scanned ${files.length} file(s)`);
  console.log(`Sense protected-term discovery: ${warnings.length} warning-only item(s)`);

  for (const warning of warnings.slice(0, MAX_REPORT)) {
    console.log(`- ${warning.term} | owner=${warning.owner} | layer=${warning.layer} | file=${warning.file}:${warning.line} | reason=${warning.reason} | disposition=${warning.disposition}`);
  }

  if (warnings.length > MAX_REPORT) {
    console.log(`- ${warnings.length - MAX_REPORT} additional warning-only item(s) omitted from console output`);
  }

  console.log('sense protected-term discovery completed');
}

function loadProtectedLookups() {
  const failures = [];
  const lookup = {
    failures,
    own: [],
    external: [],
    collisions: [],
    pending: []
  };

  const files = {
    own: 'sense-protected.json',
    atlas: 'atlas-protected.json',
    lab: 'lab-protected.json',
    collisions: 'shared-collisions.json',
    pending: 'pending-candidates.json'
  };

  for (const [key, filename] of Object.entries(files)) {
    const fullPath = path.join(protectedWordsRoot, filename);
    if (!fs.existsSync(fullPath)) {
      failures.push(`missing shared lookup file: ${fullPath}`);
      continue;
    }

    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (error) {
      failures.push(`could not parse shared lookup file ${fullPath}: ${error.message}`);
      continue;
    }

    const terms = parsed.terms || [];
    if (key === 'own') lookup.own.push(...terms);
    if (key === 'atlas' || key === 'lab') lookup.external.push(...terms);
    if (key === 'collisions') lookup.collisions.push(...terms);
    if (key === 'pending') lookup.pending.push(...terms);
  }

  return lookup;
}

function collectScanFiles() {
  const changedFiles = collectGitChangedFiles();
  if (changedFiles.length > 0) {
    return changedFiles;
  }

  const files = [];
  for (const relativeTarget of SCAN_ROOTS) {
    const absoluteTarget = path.join(root, relativeTarget);
    if (!fs.existsSync(absoluteTarget)) continue;
    const stat = fs.statSync(absoluteTarget);
    if (stat.isFile()) {
      if (EXTENSIONS.has(path.extname(absoluteTarget))) files.push(absoluteTarget);
      continue;
    }
    walk(absoluteTarget, files);
  }
  return [...new Set(files)].sort();
}

function collectGitChangedFiles() {
  let output = '';
  try {
    output = execFileSync('git', ['status', '--short'], { cwd: root, encoding: 'utf8' });
  } catch (_error) {
    return [];
  }

  const files = [];
  for (const line of output.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let relative = line.slice(3).trim();
    if (relative.includes(' -> ')) {
      relative = relative.split(' -> ').pop().trim();
    }
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) continue;
    const stat = fs.statSync(absolute);
    if (stat.isFile() && EXTENSIONS.has(path.extname(absolute))) {
      files.push(absolute);
    }
  }
  return [...new Set(files)].sort();
}

function walk(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.tmp') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
}

function findBorrowingWarnings(files, lookup) {
  const warnings = [];
  const externalTerms = lookup.external;
  forEachLine(files, (line, file, lineNumber) => {
    if (isProtectiveOrReferenceLine(line)) return;
    for (const entry of externalTerms) {
      if (!includesTerm(line, entry.term)) continue;
      warnings.push({
        term: entry.term,
        owner: entry.owner || 'Lab review',
        layer: inferLayer(file, line),
        file: rel(file),
        line: lineNumber,
        reason: `possible borrowed protected term from ${entry.owner || 'Lab quarantine'}`,
        disposition: 'qualify owner/layer or route to Sense Overseer'
      });
    }
  });
  return dedupe(warnings);
}

function findBoundaryWarnings(files) {
  const patterns = [
    {
      regex: /\boffline\b/i,
      term: 'blocked/failed/no-scan',
      reason: 'offline may collapse authority block, provider failure, and no-scan states'
    },
    {
      regex: /\bwatch(?:ing|es)? the clipboard\b/i,
      term: 'Clipboard Acquisition',
      reason: 'clipboard authority appears described as background watching'
    },
    {
      regex: /\bCombat Witness is .*evidence\b/i,
      term: 'Combat Witness',
      reason: 'Combat Witness appears described as Atlas-style evidence'
    },
    {
      regex: /\bNo data\b/i,
      term: 'No data',
      reason: 'generic No data may hide No scan, No provider, No observation, failed, or blocked'
    }
  ];

  const warnings = [];
  forEachLine(files, (line, file, lineNumber) => {
    if (isProtectiveOrReferenceLine(line)) return;
    for (const pattern of patterns) {
      if (!pattern.regex.test(line)) continue;
      warnings.push({
        term: pattern.term,
        owner: 'Sense',
        layer: inferLayer(file, line),
        file: rel(file),
        line: lineNumber,
        reason: pattern.reason,
        disposition: 'review before acceptance'
      });
    }
  });
  return dedupe(warnings);
}

function discoverCandidates(files, lookup) {
  const known = new Set([
    ...lookup.own,
    ...lookup.external,
    ...lookup.collisions,
    ...lookup.pending
  ].map((entry) => entry.term.toLowerCase()));

  const candidates = [];
  forEachLine(files, (line, file, lineNumber) => {
    if (isProtectiveOrReferenceLine(line)) return;
    for (const term of extractCandidateTerms(line)) {
      if (known.has(term.toLowerCase())) continue;
      candidates.push({
        term,
        owner: 'Sense candidate',
        layer: inferLayer(file, line),
        file: rel(file),
        line: lineNumber,
        reason: 'new likely Sense-owned or bridge-facing term candidate',
        disposition: 'Overseer review: protect, allow/common, collision, or internal/support'
      });
    }
  });
  return dedupeByTerm(candidates).sort(compareWarnings);
}

function forEachLine(files, callback) {
  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => callback(line, file, index + 1));
  }
}

function extractCandidateTerms(line) {
  const terms = new Set();
  const trimmed = line.trim();
  const isHeading = /^#{1,4}\s+/.test(trimmed);
  const isTableRow = /^\|/.test(trimmed);
  const codeTicks = line.match(/`([^`]{3,80})`/g) || [];
  for (const tick of codeTicks) {
    const value = tick.slice(1, -1).trim();
    if (isCandidate(value)) terms.add(value);
  }

  const quoted = line.match(/['"]([^'"]{3,80})['"]/g) || [];
  for (const quote of quoted) {
    const value = quote.slice(1, -1).trim();
    if (isCandidate(value)) terms.add(value);
  }

  if (isHeading || isTableRow) {
    const capitalized = line.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}\b/g) || [];
    for (const value of capitalized) {
      if (isCandidate(value)) terms.add(value);
    }
  }

  return [...terms];
}

function isCandidate(value) {
  if (value.length < 4 || value.length > 80) return false;
  if (/^F:\\/.test(value)) return false;
  if (/^[A-Z0-9_\-./:]+$/.test(value)) return false;
  if (/^\d/.test(value)) return false;
  if (/^(Status|Date|Role|Scope|Purpose|Notes|Files|Expected|Current|Project|Human|Overseer|Dev|README|TODO)$/i.test(value)) return false;
  if (value.split(/\s+/).length > 5) return false;
  if (/^(Required|Accepted|Recommended|Source|Target|Summary|Implementation|Verification|Open Questions)$/i.test(value)) return false;
  if (/^(true|false|null|undefined)$/i.test(value)) return false;
  return /[A-Za-z]/.test(value);
}

function inferLayer(file, line) {
  const relative = rel(file);
  if (relative.startsWith('src\\combat') || relative.startsWith('src\\passive') || relative.startsWith('src\\threat')) return 'Project -> Bridge';
  if (relative.startsWith('src\\renderer')) return 'Bridge -> Interface';
  if (relative.startsWith('src\\main')) return 'runtime/bridge';
  if (relative.startsWith('docs\\contracts') || relative.startsWith('docs\\current-state') || relative.startsWith('docs\\features')) return 'durable docs';
  if (relative.startsWith('workspace\\critical')) return 'critical reference';
  if (/\bservice|command|payload|ipc|bridge|snapshot/i.test(line)) return 'Project -> Bridge';
  return 'unresolved';
}

function isProtectiveOrReferenceLine(line) {
  const lower = line.toLowerCase();
  return lower.includes('do not') ||
    lower.includes('must not') ||
    lower.includes('not evidence') ||
    lower.includes('preserve') ||
    lower.includes('collision') ||
    lower.includes('risk') ||
    lower.includes('caution') ||
    lower.includes('open question') ||
    lower.includes('owner') ||
    lower.includes('different from') ||
    lower.includes('one phrase hides');
}

function includesTerm(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
}

function dedupe(warnings) {
  const seen = new Set();
  const result = [];
  for (const warning of warnings) {
    const key = `${warning.term}|${warning.file}|${warning.line}|${warning.reason}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(warning);
  }
  return result;
}

function dedupeByTerm(warnings) {
  const seen = new Set();
  const result = [];
  for (const warning of warnings) {
    const key = `${warning.term.toLowerCase()}|${warning.reason}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(warning);
  }
  return result;
}

function compareWarnings(left, right) {
  return left.file.localeCompare(right.file) || left.line - right.line || left.term.localeCompare(right.term);
}

function rel(file) {
  return path.relative(root, file);
}

main();
