const { app } = require('electron');

async function main() {
  await app.whenReady();
  const report = {
    electron: process.versions.electron || null,
    node: process.versions.node || null,
    cwd: process.cwd(),
    argv: process.argv,
    envSmokeFlag: process.env.AURA_SENSE_ELECTRON_VISUAL_SMOKE || null,
    envSmokeDir: process.env.AURA_SENSE_VISUAL_SMOKE_DIR || null
  };
  console.log(JSON.stringify(report, null, 2));
  app.exit(0);
}

main().catch((error) => {
  console.error(error);
  app.exit(1);
});
