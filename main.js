const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
     mainWindow = new BrowserWindow({
          width: 1200,
          height: 800,
          webPreferences: {
               nodeIntegration: false,
               contextIsolation: true,
          },
          autoHideMenuBar: true,
          show: false,
          icon: path.join(__dirname, 'icon.png'),
          title: 'LMS Admin Dashboard',
     });

     mainWindow.loadURL('https://lms.eu1.storap.com/admin/visual');

     mainWindow.once('ready-to-show', () => {
          mainWindow.maximize();
          mainWindow.show();
     });

     mainWindow.webContents.setWindowOpenHandler(({ url }) => {
          if (url) mainWindow.loadURL(url);
          return { action: 'deny' };
     });
}

app.whenReady().then(() => {

     createWindow();

     autoUpdater.checkForUpdatesAndNotify();

     autoUpdater.on('update-available', () => {
          mainWindow.webContents.send('update-available');
     });

     autoUpdater.on('update-downloaded', () => {
          mainWindow.webContents.send('update-downloaded');
          autoUpdater.quitAndInstall();
     });

     app.on('activate', () => {
          if (BrowserWindow.getAllWindows().length === 0) createWindow();
     });

     app.on('window-all-closed', () => { 
          if (process.platform !== 'darwin') app.quit(); 
     });
});
