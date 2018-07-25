'use strict'

import { app, BrowserWindow, Event, ipcMain } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import SQL from 'sql.js';
import * as Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs-extra'));

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow:BrowserWindow|null;

function createMainWindow() {
  const window = new BrowserWindow()

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})


/**
 * database
 */
const databaseFilePath = path.join(app.getPath('userData'), '/data.db');
ipcMain.on('get-db-file', async (event:Event) => {
  if (!fs.existsSync(app.getPath('userData'))) {
    await fs.mkdir(app.getPath('userData'));
  }
  
  let dbFile:Uint8Array = await fs.readFile(databaseFilePath);
  if (!dbFile) {
      const db = new SQL.Database();
      dbFile = db.export();
      const buffer = new Buffer(dbFile);
      await fs.writeFile(databaseFilePath, buffer);
  }
  
  event.sender.send('db-file-ready', dbFile);
});

ipcMain.on('save-db-file', async (event:Event, dbFile:Uint8Array) => {
  const buffer = new Buffer(dbFile);
  fs.writeFile(databaseFilePath, buffer); 
});
