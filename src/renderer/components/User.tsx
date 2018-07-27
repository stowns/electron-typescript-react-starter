import * as React from 'react';
import './User.scss';

import { UserEntity } from '../entities/UserEntity';
import { Formik } from 'formik';

interface UserProps {
    fetchUser: Function;
    saveUser: Function;
    user: UserEntity|null;
}
export class User extends React.Component<UserProps, any> {
    
    componentDidMount() {
        if (!this.props.user) {
            this.props.fetchUser();
        }
    }

    render(){
        let content;
        const user = this.props.user;
        if (user) {
            content =  (
                <div className='text-center'>   
                    <span>You're {user.name}!</span>
                </div>
            )
        } else {
            content = (
                <div className='col-sm-6 offset-sm-3'>
                    <Formik
                        initialValues={{
                            name: ''   
                        }}
                        validate={values => {
                            let errors:any = {};
                            if (values.name.length < 2) {
                                errors.name = 'Name must be greater than 2 characters';
                            }
                            return errors;
                        }}
                        onSubmit={(
                            values,
                            { setSubmitting, setErrors /* setValues and other goodies */ }
                        ) => {
                            this.props.saveUser(values);
                        }}
                        render={({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name}
                                    />
                                    {touched.name && errors.name && <div>{errors.name}</div>}
                                </div>
                                <button 
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}>
                                    Submit
                                </button>
                            </form>
                        )}
                    />
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