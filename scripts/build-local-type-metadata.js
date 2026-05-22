const { buildLocalTypeMetadata } = require('../src/metadata/localTypeMetadata');

async function main() {
  const options = {
    sourcePath: argValue('--source'),
    outputPath: argValue('--out'),
    keepSource: process.argv.includes('--keep-source'),
    allowExternalSource: process.argv.includes('--allow-external-source')
  };
  const result = await buildLocalTypeMetadata(options);
  console.log(`local type metadata built: ${result.outputPath}`);
  console.log(`type count: ${result.artifact.typeCount}`);
  console.log(`sde build: ${result.artifact.source.build_number || 'unknown'}`);
}

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
