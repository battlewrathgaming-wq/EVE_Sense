const { defaultDiagnosticsPolicy } = require('../services/diagnosticsPolicy');

function createRuntimeErrorReporter({
  trace = () => {},
  diagnosticsPolicy = defaultDiagnosticsPolicy
} = {}) {
  const emit = diagnosticsPolicy.wrapTrace(trace, 'runtime.error_handling');
  return {
    reportUnhandledRejection(reason) {
      emit('runtime_unhandled_rejection', normalizeErrorPayload(reason));
    },
    reportUncaughtException(error) {
      emit('runtime_uncaught_exception', normalizeErrorPayload(error));
    },
    reportRendererGone(details = {}) {
      emit('renderer_process_gone', {
        reason: details.reason || null,
        exitCode: details.exitCode ?? null,
        message: details.message || details.reason || 'Renderer process ended unexpectedly'
      });
    }
  };
}

function registerRuntimeErrorHandlers({
  processRef = process,
  app = null,
  getWindows = null,
  reporter = createRuntimeErrorReporter()
} = {}) {
  processRef.on('unhandledRejection', (reason) => {
    reporter.reportUnhandledRejection(reason);
  });
  processRef.on('uncaughtException', (error) => {
    reporter.reportUncaughtException(error);
  });

  if (app?.on && typeof getWindows === 'function') {
    app.on('browser-window-created', (_event, window) => {
      attachRendererGoneHandler(window, reporter);
    });
    for (const window of getWindows()) {
      attachRendererGoneHandler(window, reporter);
    }
  }

  return reporter;
}

function attachRendererGoneHandler(window, reporter) {
  if (!window?.webContents?.on || window.__auraRuntimeErrorHandlerAttached) {
    return;
  }
  window.__auraRuntimeErrorHandlerAttached = true;
  window.webContents.on('render-process-gone', (_event, details = {}) => {
    reporter.reportRendererGone(details);
  });
}

function normalizeErrorPayload(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      code: error.code || null,
      stack: error.stack || null
    };
  }
  return {
    name: null,
    message: String(error),
    code: null,
    stack: null
  };
}

module.exports = {
  attachRendererGoneHandler,
  createRuntimeErrorReporter,
  normalizeErrorPayload,
  registerRuntimeErrorHandlers
};
