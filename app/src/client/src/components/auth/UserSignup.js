import React from 'react';
import Signup from './Signup';
import "../../styles/auth/Form.css";
import {NotificationContainer} from 'react-notifications';

class UserSignup extends Signup {
    constructor(props) {
        super(props);
        this.user_type = "user";
        this.state = {
            first_name: "",
            middle_name: "",
            last_name: "",
            dob: "",
            email: "",
            password: "",
            line1: "",
            line2: "",
            city: "",
            state: "",
            zipcode: "",
            validationStatus: {
                first_name: "Cannot be empty",
                middle_name: "",
                last_name: "Cannot be empty",
                dob: "Cannot be empty",
                email: "Cannot be empty",
                password: "Cannot be empty",
                line1: "Cannot be empty",
                line2: "",
                city: "Cannot be empty",
                state: "Cannot be empty",
                zipcode: "Cannot be empty"
            }
        };
    }

    collectData() {
        return {
            first_name: this.state.first_name,
            middle_name: this.state.middle_name,
            last_name: this.state.last_name,
            dob: this.state.dob,
            email: this.state.email,
            password: this.state.password,
            user_type: this.user_type,
            address: {
                line1: this.state.line1,
                line2: this.state.line2,
                city: this.state.city,
                state: this.state.state,
                zipcode: this.state.zipcode
            }
        }
    }

    render() {
        return (
            <div>
                <h2>User Sign up</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="field-row">
                        <label>
                            First Name
                        </label>
                        <input type="text" name="first_name" value={this.state.first_name}
                               onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.first_name}</span>
                    </div>
                    <div className="field-row">
                        <label>
                            Middle Name
                        </label>
                        <input type="text" name="middle_name" value={this.state.middle_name}
                               onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.middle_name_name}</span>
                    </div>
                    <div className="field-row">
                        <label>
                            Last Name
                        </label>
                        <input type="text" name="last_name" value={this.state.last_name} onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.last_name}</span>
                    </div>
                    <div className="field-row">
                        <label>
                            Date of Birth
                        </label>
                        <input type="text" name="dob" value={this.state.dob} onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.dob}</span>
                    </div>
                    <div className="field-row">
                        <label>
                            Email Address
                        </label>
                        <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.email}</span>
                    </div>
                    <div className="field-row">
                        <label>
                            Password
                        </label>
                        <input type="password" name="password" value={this.state.password}
                               onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.password}</span>
                    </div>
                    <div>
                        <h5>Mailing Address</h5>
                        <div className="field-row">
                            <label>
                                Line 1
                            </label>
                            <input type="text" name="line1" value={this.state.line1} onChange={this.handleChange}/>
                            <span className="validation">{this.state.validationStatus.line1}</span>
                        </div>
                        <div className="field-row">
                            <label>
                                Line 2
                            </label>
                            <input type="text" name="line2" value={this.state.line2} onChange={this.handleChange}/>
                            <span className="validation">{this.state.validationStatus.line2}</span>
                        </div>
                        <div className="field-row">
                            <label>
                                City
                            </label>
                            <input type="text" name="city" value={this.state.city} onChange={this.handleChange}/>
                            <span className="validation">{this.state.validationStatus.city}</span>
                        </div>
                        <div className="field-row">
                            <label>
                                State
                            </label>
                            <input type="text" name="state" value={this.state.state} onChange={this.handleChange}/>
                            <span className="validation">{this.state.validationStatus.state}</span>
                        </div>
                        <div className="field-row">
                            <label>
                                Zipcode
                            </label>
                            <input type="text" name="zipcode" value={this.state.zipcode} onChange={this.handleChange}/>
                            <span className="validation">{this.state.validationStatus.zipcode}</span>
                        </div>
                    </div>
                    <input className="submit-btn" type="submit" value="Submit"/>
                </form>
                <NotificationContainer/>
            </div>
        );
    }

}

export default UserSignup;