import * as React from 'react';
import './Root.scss';
import { User } from './User';
const ipcRenderer = require('electron').ipcRenderer;
import { SyncLoader } from 'react-spinners';

require('reflect-metadata');
import { Connection, getConnectionManager, ConnectionManager, createConnection } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';

export class Root extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {}
    }
    
    async componentDidMount() {
        // ask for the db connection
        ipcRenderer.send('get-db-file');
        // listen for the db connection
        ipcRenderer.on('db-file-ready', async (event:any, dbFile:Uint8Array) => {
            
            // check for existing connection
            let connection:Connection;
            const manager:ConnectionManager = getConnectionManager();
            if (manager.has('default')) {
                connection = manager.get();
            } else {
                connection = await createConnection({
                    type: 'sqljs',
                    database: dbFile,
                    entities: [UserEntity],
                    autoSave: true,
                    autoSaveCallback: async (data: Uint8Array) => {
                        ipcRenderer.send('write-db-data', data);
                    }
                });
            }
            
            this.setState({db:connection});
        });
    }

    render(){
        let Content;
        if (!this.state.db) {
           Content = (
            <SyncLoader
                loading={true} />
           );
        } else {
            Content = (
                <div>
                    <div className="flex-row">
                        <p className='col-sm-12 text-center'>
                            <b>Electron Typescript React Starter</b>  
                        </p>
                    </div>
                    <div className="flex-row">
                        <User
                            db={this.state.db}
                        />
                    </div>
                </div>
            );
        }
        
        return(
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
                {Content}
            </div>
        )
    }
}