'use strict'

import { app, BrowserWindow, Event, ipcMain } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import SQL from 'sql.js';
import { DB_FILE_READY, GET_DB_FILE, WRITE_DB_DATA } from '../shared/constants/message-types';
import * as fs from 'fs-extra';

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
const databaseFilePath = path.join(app.getPath('userData'), 'databases/starter.db');
ipcMain.on(GET_DB_FILE, async (event:Event) => {

  try {
    
    let dbFile:Uint8Array|null;
    if (fs.pathExistsSync(databaseFilePath)) {
      dbFile = await fs.readFile(databaseFilePath);
    } else {
      const db = new SQL.Database();
      dbFile = db.export();
      const buffer = new Buffer(dbFile);
      await fs.writeFile(databaseFilePath, buffer);
    }
    
    event.sender.send(DB_FILE_READY, dbFile);
  } catch (e) {
    console.error(e.message);
  }
});

ipcMain.on(WRITE_DB_DATA, (event:Event, dbData:Uint8Array) => {
  const buffer = new Buffer(dbData);
  fs.writeFile(databaseFilePath, buffer); 
})