const ipcRenderer = require('electron').ipcRenderer;
// db
require('reflect-metadata');
import { UserEntity } from '../entities/UserEntity';
​import { Connection, getConnectionManager, ConnectionManager, createConnection } from 'typeorm';
import { Dispatch, AnyAction } from 'redux';
import { DB_FILE_READY, GET_DB_FILE, WRITE_DB_DATA } from '../../shared/constants/message-types';

export class ActionTypes {
  static readonly DB_READY = 'DB_READY'; 
  static readonly FETCH_DB = 'FETCH_DB';
}
    
export function fetchDb() {
  return (dispatch:Dispatch<AnyAction>) => {  
    // ask for the db connection
    ipcRenderer.send(GET_DB_FILE);
    // listen for the db connection
    ipcRenderer.on(DB_FILE_READY, async (event:any, dbFile:Uint8Array) => {
        
        // check for existing connection
        let db:Connection;
        const manager:ConnectionManager = getConnectionManager();
        if (manager.has('default')) {
          db = manager.get();
        } else {
          db = await createConnection({
                type: 'sqljs',
                database: dbFile,
                entities: [UserEntity],
                autoSave: true,
                autoSaveCallback: async (data: Uint8Array) => {
                    ipcRenderer.send(WRITE_DB_DATA, data);
                }
            });
        }
        
        dispatch(dbReadyAction(db));
    });
  }
}

export const dbReadyAction = (db:Connection) => ({
  type: ActionTypes.DB_READY,
  payload: db
});