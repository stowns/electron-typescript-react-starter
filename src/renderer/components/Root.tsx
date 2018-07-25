import * as React from 'react';
import './Root.scss';
import { User } from './User';
const ipcRenderer = require('electron').ipcRenderer;

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
        if (!this.state.db) {
           return (<h1>'Initializing Db'</h1>)
        }
        
        return(
            <div className="h-100 w-100 mt-3">
                <div className="row">
                    <p className='col-sm-12 text-center'>
                        <b>Electron Typescript React Starter</b>  
                    </p>
                </div>
                <div className="row">
                    <User
                        db={this.state.db}
                    />
                </div>
            </div>
        )
    }
}