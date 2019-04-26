import React from 'react';
import Signup from './Signup';
import "../../styles/auth/Form.css";
import {NotificationContainer} from 'react-notifications';


class RestaurantSignup extends Signup {
    constructor(props) {
        super(props);
        this.user_type = "admin";
        this.state = {
            name: "",
            contact: "",
            email: "",
            username: "",
            password: "",
            website: "",
            validationStatus: {
                name: "Cannot be empty",
                contact: "Cannot be empty",
                email: "Cannot be empty",
                username: "Cannot be empty",
                password: "Cannot be empty",
                website: "Cannot be empty"
            }
        }
    }

    render() {
        return (
            <div>
                <h2>Restaurant Sign up</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="field-row">
                        <label>
                            Name
                        </label>
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.name}</span>
                    </div>
                    <div className="field-row">
                        <label>
                            Phone Number
                        </label>
                        <input type="text" name="contact" value={this.state.address} onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.contact}</span>
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
                            Website
                        </label>
                        <input type="text" name="website" value={this.state.website} onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.website}</span>
                    </div>
                    <div className="field-row">
                        <label>
                            Username
                        </label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.username}</span>
                    </div>
                    <div className="field-row">
                        <label>
                            Password
                        </label>
                        <input type="password" name="password" value={this.state.password}
                               onChange={this.handleChange}/>
                        <span className="validation">{this.state.validationStatus.password}</span>
                    </div>
                    <input className="submit-btn" type="submit" value="Sign up"/>
                </form>
                <NotificationContainer/>
            </div>
        );
    }

}

export default RestaurantSignup;