const { spawnSync } = require('node:child_process');

const checks = [
  ['verify:core', ['node', 'scripts/verify-core.js']],
  ['verify:runtime-errors', ['node', 'scripts/verify-runtime-error-handling.js']],
  ['verify:combat-parser', ['node', 'scripts/verify-combat-parser.js']],
  ['verify:combat-bridge', ['node', 'scripts/verify-combat-witness-bridge.js']],
  ['verify:combat-runtime', ['node', 'scripts/verify-combat-witness-runtime.js']],
  ['verify:combat-witness', ['node', 'scripts/verify-combat-witness-core.js']],
  ['verify:diagnostics', ['node', 'scripts/verify-diagnostics-policy.js']],
  ['verify:gamelog-watcher', ['node', 'scripts/verify-gamelog-watcher.js']],
  ['verify:services', ['node', 'scripts/verify-services.js']],
  ['verify:http', ['node', 'scripts/verify-http-client.js']],
  ['verify:frame', ['node', 'scripts/verify-frame-module.js']],
  ['verify:renderer-boundary', ['node', 'scripts/verify-renderer-boundary.js']],
  ['verify:renderer-shell', ['node', 'scripts/verify-renderer-shell.js']]
];

for (const [label, command] of checks) {
  const result = spawnSync(command[0], command.slice(1), {
    stdio: 'inherit',
    shell: false
  });
  if (result.status !== 0) {
    throw new Error(`${label} failed`);
  }
}

console.log('all checks verified');
