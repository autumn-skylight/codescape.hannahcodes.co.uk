const { app, BrowserWindow, ipcMain, nativeTheme} = require('electron');
const { setupTitlebar, attachTitlebarToWindow } = require('custom-electron-titlebar/main');
const path = require('path')

setupTitlebar();
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "./assets/images/codescape-logo.ico"),
    width: 1920,
    height: 1080,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#342c6f',
     symbolColor: 'white',
    height: 60,
    width: 100,
    },
   frame: false,
  webPreferences: {
nodeIntegration: true,
contextIsolation: true,
sandbox: false,
devTools: true,
preload: path.join(__dirname, './assets/js/preload.js')
  }  })

  // and load the index.html of the app.
  mainWindow.loadFile('./src/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
]),
ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
}),

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})

