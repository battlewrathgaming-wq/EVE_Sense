const fs = require('node:fs');
const path = require('node:path');
const { projectRoot } = require('../src/util/tempPaths');

const root = projectRoot();

const scanTargets = [
  {
    label: 'renderer',
    directory: path.join(root, 'src', 'renderer'),
    rules: [
      {
        name: 'renderer network calls',
        pattern: /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bnavigator\.sendBeacon\b/,
        message: 'renderer must not make network calls directly'
      },
      {
        name: 'renderer node imports',
        pattern: /\brequire\s*\(|\bimport\s+.*\s+from\s+['"](?:node:|electron|fs|path|chokidar)/,
        message: 'renderer must not import Node, Electron, or main-process modules'
      },
      {
        name: 'renderer main-process imports',
        pattern: /(?:^|['"`])(?:\.\.\/)+(?:main|services|modules\/Frame)\b/,
        message: 'renderer must not import main-process, service, or Frame modules'
      },
      {
        name: 'renderer filesystem access',
        pattern: /\bfs\.|\breadFile(?:Sync)?\s*\(|\bwriteFile(?:Sync)?\s*\(|\bwatch\s*\(/,
        message: 'renderer must not read logs or filesystem'
      },
      {
        name: 'renderer combat parsing',
        pattern: /\bcombatLine\b|\bcombatRegex\b|damagePattern|hits you for|misses you completely|scrambles|webifies|warp disrupt/i,
        message: 'renderer must not contain combat parser ownership signals'
      }
    ]
  },
  {
    label: 'preload',
    files: [path.join(root, 'src', 'main', 'preload.js')],
    rules: [
      {
        name: 'preload network calls',
        pattern: /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bnavigator\.sendBeacon\b/,
        message: 'preload must not make network calls directly'
      },
      {
        name: 'preload filesystem access',
        pattern: /\bfs\.|\breadFile(?:Sync)?\s*\(|\bwriteFile(?:Sync)?\s*\(|\bwatch\s*\(/,
        message: 'preload must not read logs or filesystem'
      },
      {
        name: 'preload combat parsing',
        pattern: /\bcombatLine\b|\bcombatRegex\b|damagePattern|hits you for|misses you completely|scrambles|webifies|warp disrupt/i,
        message: 'preload must not contain combat parser ownership signals'
      }
    ]
  }
];

function main() {
  const violations = [];
  const scannedFiles = [];

  for (const target of scanTargets) {
    const files = target.files || listFiles(target.directory);
    for (const filePath of files) {
      const text = fs.readFileSync(filePath, 'utf8');
      scannedFiles.push(path.relative(root, filePath));
      for (const rule of target.rules) {
        const match = text.match(rule.pattern);
        if (match) {
          violations.push({
            target: target.label,
            file: path.relative(root, filePath),
            rule: rule.name,
            message: rule.message,
            line: lineForIndex(text, match.index || 0)
          });
        }
      }
    }
  }

  if (violations.length > 0) {
    for (const violation of violations) {
      console.error(`${violation.file}:${violation.line} ${violation.rule} - ${violation.message}`);
    }
    throw new Error(`renderer boundary check failed with ${violations.length} violation(s)`);
  }

  console.log(`renderer boundary verified (${scannedFiles.length} files scanned)`);
}

function listFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(entryPath));
    } else if (/\.(?:js|mjs|cjs|html|css)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function lineForIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

main();
