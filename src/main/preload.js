const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aura', {
  listServices: () => ipcRenderer.invoke('aura:service:list'),
  invokeService: (command, payload = {}, options = {}) => ipcRenderer.invoke('aura:service:invoke', {
    command,
    payload,
    ...options
  })
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
