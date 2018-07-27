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
                <div>
                    <div className="flex-row">
                        <p className='col-sm-12 text-center'>
                            <b>Electron Typescript React Starter</b>  
                        </p>
                    </div>
                    <div className="flex-row">
                        <UserContainer />
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