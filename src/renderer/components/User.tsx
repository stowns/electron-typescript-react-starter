import * as React from 'react';
import './User.scss';
import { FormEvent } from 'react';

import { UserEntity } from '../entities/UserEntity';
import { Connection } from '../../../node_modules/typeorm';


interface UserProps {
    db: Connection
}
export class User extends React.Component<UserProps, any> {
    constructor(props: any){
        super(props);
        this.state = {
            formName: ""
        }
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    
    async componentDidMount() {
        let userRepo = this.props.db.getRepository(UserEntity);
        let user = await userRepo.findOne(1);
        let newState:any = {userRepo};
        if (user) {
            newState.user = user;
        }
        
        this.setState(newState);
    }
    
    async handleFormSubmit(event: any) {
        event.preventDefault();
        
        if (this.state.formName) {
            let user = await this.state.userRepo.findOne({name: this.state.formName});
            if (!user) {
                user = new UserEntity();
                user.name = this.state.formName;
                await this.state.userRepo.save(user);
                
                let savedUser = await this.state.userRepo.findOne({name: this.state.formName});
                this.setState({user: savedUser});
            }
        }
    }
    
    handleInputChange(event: FormEvent<HTMLInputElement>) {
        const target = event.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render(){
        let content;
        if (this.state.user) {
            content =  (
                <div className='text-center'>   
                    <span>You're {this.state.user.name}!</span>
                </div>
            )
        } else {
            content = (
                <div className='col-sm-6 offset-sm-3'>
                    <form onSubmit={this.handleFormSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input 
                                name="formName"
                                value={this.state.formName}
                                onChange={this.handleInputChange}
                                type="text" 
                                className="form-control"
                                placeholder="Enter Name" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            )
        }
        
        return (
            <div className="message col-sm-12 text-center">
                {content}
            </div>
        )
        
    }
}