const fs = require('node:fs');
const path = require('node:path');
const { PassiveEsiSystemActivityClient } = require('../src/passive/esiSystemActivityClient');
const { createLiveIoGate } = require('../src/passive/liveIoGate');
const { createLocalSystemResolver } = require('../src/passive/localSystemResolver');
const { createPassiveTelemetryService } = require('../src/passive/passiveTelemetryService');
const { ZKillSystemContextClient } = require('../src/passive/zKillSystemContextClient');
const { HttpClient } = require('../src/services/httpClient');

const outputDir = path.join(__dirname, '..', '.tmp', 'passive-live-api-smoke');
const outputPath = path.join(outputDir, 'result.json');

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  if (process.env.AURA_SENSE_LIVE_API !== '1') {
    const result = {
      status: 'refused',
      checked_at: new Date().toISOString(),
      reason: 'Set AURA_SENSE_LIVE_API=1 to run live Passive Telemetry API smoke',
      output_path: outputPath
    };
    fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
    console.log(`AURA-Sense passive live API smoke refused: ${outputPath}`);
    return;
  }

  const requestLogs = [];
  const httpClient = new HttpClient({
    timeoutMs: 10000,
    maxAttempts: 2,
    onRequestLog: (entry) => requestLogs.push(entry)
  });
  const service = createPassiveTelemetryService({
    liveIoGate: createLiveIoGate({ enabled: true }),
    resolveSystem: createLocalSystemResolver(),
    esiActivityClient: new PassiveEsiSystemActivityClient({ httpClient }),
    zkillClient: new ZKillSystemContextClient({ httpClient, pastSeconds: 3600, limit: 5 })
  });

  await service.observeEvent({
    id: 'live-smoke-jita',
    kind: 'navigation.jump',
    fromSystemName: 'Perimeter',
    systemName: 'Jita',
    eventTime: new Date().toISOString(),
    observedAt: new Date().toISOString()
  });

  const snapshot = service.snapshot();
  const result = {
    status: snapshot.status === 'fresh' || snapshot.status === 'partial' || snapshot.status === 'stale' ? 'passed' : 'degraded',
    checked_at: new Date().toISOString(),
    output_path: outputPath,
    snapshot: {
      status: snapshot.status,
      message: snapshot.message,
      currentSystem: snapshot.currentSystem,
      activity: snapshot.activity,
      zkill: snapshot.zkill,
      gate: snapshot.gate,
      failure: snapshot.failure
    },
    requestLogs
  };
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`AURA-Sense passive live API smoke ${result.status}: ${outputPath}`);
  if (result.status !== 'passed') {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  fs.mkdirSync(outputDir, { recursive: true });
  const failure = {
    status: 'failed',
    checked_at: new Date().toISOString(),
    output_path: outputPath,
    message: error.message,
    code: error.code || null
  };
  fs.writeFileSync(outputPath, `${JSON.stringify(failure, null, 2)}\n`);
  console.error(error);
  process.exit(1);
});
