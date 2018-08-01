import * as React from 'react';
import './Root.scss';
import { SyncLoader } from 'react-spinners';
import { Connection } from 'typeorm';
import UserContainer from '../containers/UserContainer';

interface RootProps {
    db:Connection,
    fetchDb:Function
}

export class Root extends React.Component<RootProps, any> {
    
    componentDidMount() {
        this.props.fetchDb();
    }
    
    render(): any {
        let Content;
        if (!this.props.db) {
           Content = (
                <SyncLoader
                    loading={true} />
            );
        } else {
            Content = (
                <UserContainer />
            );
        }
        
        return(
            <div className="w-100 h-100">
                <header className="toolbar toolbar-header draggable">
                    <h1 className="title">Electron Typescript React Starter</h1>
                </header>
                <div className="window-content w-100 h-100 d-flex justify-content-center align-items-center">
                    {Content}
                </div>
            </div>
            
        )
    }
}