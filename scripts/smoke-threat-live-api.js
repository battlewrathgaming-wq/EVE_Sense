const fs = require('node:fs');
const path = require('node:path');
const { createLiveIoGate } = require('../src/passive/liveIoGate');
const { createLiveSmokeHttpClient } = require('../src/services/liveSmokeHttpClient');
const { createThreatIntelService } = require('../src/threat/threatIntelService');
const { createThreatIntelTargetResolver } = require('../src/threat/threatIntelTargetResolver');
const { ThreatIntelZkillClient } = require('../src/threat/threatIntelZkillClient');

const outputDir = path.join(__dirname, '..', '.tmp', 'threat-live-api-smoke');
const outputPath = path.join(outputDir, 'result.json');
const defaultTargetText = 'system:Jita';
const lookbackSeconds = 3600;
const sampleLimit = 5;

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  if (process.env.AURA_SENSE_LIVE_API !== '1') {
    const result = {
      status: 'refused',
      checked_at: new Date().toISOString(),
      reason: 'Set AURA_SENSE_LIVE_API=1 to run live Threat Intel API smoke',
      live_io_enabled: false,
      no_live_call: true,
      target: {
        targetText: process.env.AURA_SENSE_THREAT_LIVE_TARGET || defaultTargetText,
        lookbackSeconds,
        sampleLimit
      },
      requestLogs: [],
      output_path: outputPath
    };
    fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
    console.log(`AURA-Sense threat live API smoke refused: ${outputPath}`);
    return;
  }

  const requestLogs = [];
  const httpClient = createLiveSmokeHttpClient({
    onRequestLog: (entry) => requestLogs.push(entry)
  });
  const service = createThreatIntelService({
    liveIoGate: createLiveIoGate({
      enabled: true,
      enabledMessage: 'Threat Intel live IO is enabled',
      disabledMessage: 'Threat Intel live IO is disabled',
      blockedCode: 'THREAT_LIVE_IO_BLOCKED'
    }),
    resolveTarget: createThreatIntelTargetResolver(),
    zkillClient: new ThreatIntelZkillClient({
      httpClient,
      lookbackSeconds,
      sampleLimit
    })
  });

  const targetText = process.env.AURA_SENSE_THREAT_LIVE_TARGET || defaultTargetText;
  const snapshot = await service.scan({
    targetText,
    inputSource: 'search',
    lookbackSeconds,
    sampleLimit
  });
  const result = {
    status: snapshot.status === 'succeeded' || snapshot.status === 'partial' ? 'passed' : 'degraded',
    checked_at: new Date().toISOString(),
    live_io_enabled: true,
    output_path: outputPath,
    request: {
      targetText,
      lookbackSeconds,
      sampleLimit
    },
    snapshot: {
      status: snapshot.status,
      message: snapshot.message,
      target: snapshot.target,
      gate: snapshot.gate,
      zkill: snapshot.zkill,
      failure: snapshot.failure
    },
    requestLogs
  };
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`AURA-Sense threat live API smoke ${result.status}: ${outputPath}`);
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
