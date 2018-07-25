import * as React from 'react';
import './Root.scss';
import { User } from './User';
const ipcRenderer = require('electron').ipcRenderer;
import { SyncLoader } from 'react-spinners';

// database imports
require('reflect-metadata');
const createConnection = require('typeorm').createConnection;
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
        ipcRenderer.on('db-file-ready', async (dbFile: Uint8Array) => {
            const connection = await createConnection({
                type: 'sqljs',
                database: dbFile,
                entities: [
                    UserEntity
                ],
                synchronize: true,
                autoSave: true,
                autoSaveCallback: async (data: Uint8Array) => {
                    ipcRenderer.send('save-db-file', data);
                }
            });
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