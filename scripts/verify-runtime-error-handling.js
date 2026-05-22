const assert = require('node:assert');
const { createRuntimeErrorReporter, registerRuntimeErrorHandlers } = require('../src/main/runtimeErrorHandling');
const { createDiagnosticsPolicy } = require('../src/services/diagnosticsPolicy');

const events = [];
const reporter = createRuntimeErrorReporter({
  diagnosticsPolicy: createDiagnosticsPolicy(),
  trace: (event, payload) => events.push({ event, payload })
});

reporter.reportUnhandledRejection(new Error('async failed'));
reporter.reportUncaughtException(Object.assign(new Error('fatal failed'), { code: 'FATAL_FIXTURE' }));
reporter.reportRendererGone({ reason: 'crashed', exitCode: 9 });

assert.deepStrictEqual(
  events.map((entry) => entry.event),
  ['runtime_unhandled_rejection', 'runtime_uncaught_exception', 'renderer_process_gone'],
  'runtime diagnostics should preserve high-priority failure events'
);
assert.strictEqual(events[0].payload.message, 'async failed', 'unhandled rejection should include message');
assert.strictEqual(events[1].payload.code, 'FATAL_FIXTURE', 'uncaught exception should include code');
assert.strictEqual(events[2].payload.exitCode, 9, 'renderer gone should include exit code');

const processHandlers = {};
const appHandlers = {};
const webContentsHandlers = {};
const window = {
  webContents: {
    on: (event, handler) => {
      webContentsHandlers[event] = handler;
    }
  }
};

const attachedReporterEvents = [];
registerRuntimeErrorHandlers({
  processRef: {
    on: (event, handler) => {
      processHandlers[event] = handler;
    }
  },
  app: {
    on: (event, handler) => {
      appHandlers[event] = handler;
    }
  },
  getWindows: () => [window],
  reporter: createRuntimeErrorReporter({
    diagnosticsPolicy: createDiagnosticsPolicy(),
    trace: (event) => attachedReporterEvents.push(event)
  })
});

assert.strictEqual(typeof processHandlers.unhandledRejection, 'function', 'runtime handler should attach unhandled rejection');
assert.strictEqual(typeof processHandlers.uncaughtException, 'function', 'runtime handler should attach uncaught exception');
assert.strictEqual(typeof appHandlers['browser-window-created'], 'function', 'runtime handler should attach new window hook');
assert.strictEqual(typeof webContentsHandlers['render-process-gone'], 'function', 'runtime handler should attach existing renderer gone hook');

processHandlers.unhandledRejection('string failure');
processHandlers.uncaughtException(new Error('uncaught fixture'));
webContentsHandlers['render-process-gone']({}, { reason: 'oom', exitCode: 3 });
assert.deepStrictEqual(
  attachedReporterEvents,
  ['runtime_unhandled_rejection', 'runtime_uncaught_exception', 'renderer_process_gone'],
  'attached runtime handlers should route through reporter'
);

console.log('runtime error handling verified');
