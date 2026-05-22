const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { APP_NAME } = require('../constants');
const { createCombatWitnessBridge } = require('../combat/combatWitnessBridge');
const { createDefaultRegistry, registerElectronServiceHandlers } = require('../services/serviceRegistry');
const { registerRuntimeErrorHandlers } = require('./runtimeErrorHandling');
const { createFrameWindow, registerFrameWindowHandlers } = require('../modules/Frame');

const registry = createDefaultRegistry();
const combatWitnessBridge = createCombatWitnessBridge();
let mainWindow = null;

function createWindow() {
  const window = createFrameWindow(app, {
    width: 960,
    height: 640,
    minWidth: 720,
    minHeight: 480,
    title: APP_NAME,
    preload: path.join(__dirname, 'preload.js'),
    backgroundColor: '#f5f7f8',
    defaultAlwaysOnTop: false
  });

  mainWindow = window;
  window.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  registerRuntimeErrorHandlers({
    app,
    getWindows: () => BrowserWindow.getAllWindows()
  });
  registerElectronServiceHandlers(ipcMain, registry, () => ({ appName: APP_NAME }));
  registerFrameWindowHandlers(ipcMain, app, () => mainWindow);
  combatWitnessBridge.register(ipcMain);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
