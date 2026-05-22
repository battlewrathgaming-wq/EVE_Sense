const { contextBridge, ipcRenderer } = require('electron');

const RENDERER_SERVICE_COMMANDS = Object.freeze([
  'seed.readiness',
  'runtime.settings.snapshot',
  'runtime.live-io.snapshot',
  'runtime.live-io.set-enabled',
  'runtime.diagnostics.snapshot',
  'combat.witness.status',
  'combat.witness.start',
  'combat.witness.stop'
]);
const RENDERER_SERVICE_COMMAND_SET = new Set(RENDERER_SERVICE_COMMANDS);

contextBridge.exposeInMainWorld('aura', {
  listServices: () => Promise.resolve([...RENDERER_SERVICE_COMMANDS]),
  invokeService: (command, payload = {}, options = {}) => {
    if (!RENDERER_SERVICE_COMMAND_SET.has(command)) {
      throw new Error(`Renderer service command is not exposed: ${command}`);
    }
    return ipcRenderer.invoke('aura:service:invoke', {
      command,
      payload,
      ...options
    });
  }
});

contextBridge.exposeInMainWorld('auraWindow', {
  getState: () => ipcRenderer.invoke('aura:window:get-state'),
  setAlwaysOnTop: (enabled) => ipcRenderer.invoke('aura:window:set-always-on-top', enabled === true),
  minimize: () => ipcRenderer.invoke('aura:window:minimize'),
  close: () => ipcRenderer.invoke('aura:window:close')
});

contextBridge.exposeInMainWorld('auraCombatWitness', {
  getSnapshot: () => ipcRenderer.invoke('aura:combat-witness:get-snapshot'),
  subscribeSnapshots: (callback) => {
    if (typeof callback !== 'function') {
      throw new Error('Combat Witness snapshot callback must be a function');
    }
    const listener = (_event, snapshot) => callback(snapshot);
    ipcRenderer.on('aura:combat-witness:snapshot', listener);
    ipcRenderer.invoke('aura:combat-witness:subscribe');
    return () => {
      ipcRenderer.removeListener('aura:combat-witness:snapshot', listener);
      ipcRenderer.invoke('aura:combat-witness:unsubscribe');
    };
  }
});

contextBridge.exposeInMainWorld('auraPassiveTelemetry', {
  getSnapshot: () => ipcRenderer.invoke('aura:passive-telemetry:get-snapshot'),
  subscribeSnapshots: (callback) => {
    if (typeof callback !== 'function') {
      throw new Error('Passive Telemetry snapshot callback must be a function');
    }
    const listener = (_event, snapshot) => callback(snapshot);
    ipcRenderer.on('aura:passive-telemetry:snapshot', listener);
    ipcRenderer.invoke('aura:passive-telemetry:subscribe');
    return () => {
      ipcRenderer.removeListener('aura:passive-telemetry:snapshot', listener);
      ipcRenderer.invoke('aura:passive-telemetry:unsubscribe');
    };
  }
});

contextBridge.exposeInMainWorld('auraThreatIntel', {
  getSnapshot: () => ipcRenderer.invoke('aura:service:invoke', {
    command: 'threat.intel.snapshot',
    payload: {}
  }),
  scan: (payload = {}) => ipcRenderer.invoke('aura:service:invoke', {
    command: 'threat.intel.scan',
    payload
  }),
  getClipboardState: () => ipcRenderer.invoke('aura:service:invoke', {
    command: 'threat.clipboard.snapshot',
    payload: {}
  }),
  armClipboard: (payload = {}) => ipcRenderer.invoke('aura:service:invoke', {
    command: 'threat.clipboard.arm',
    payload
  }),
  captureClipboard: (payload = {}) => ipcRenderer.invoke('aura:service:invoke', {
    command: 'threat.clipboard.capture',
    payload
  }),
  cancelClipboard: () => ipcRenderer.invoke('aura:service:invoke', {
    command: 'threat.clipboard.cancel',
    payload: {}
  })
});
