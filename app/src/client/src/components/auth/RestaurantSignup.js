import React from 'react';
import Signup from './Signup';
import "../../styles/auth/Form.css";

class RestaurantSignup extends Signup { 
    constructor(props) {
        super(props);
        this.user_type = "admin";
        this.state = {
            name : "",
            contact : "",
            email : "",
            username : "",
            password : "",
            website : ""
        } 
    }

    render() {
        return (
            <div>
                <h4>Restaurant Sign up</h4>
                <form onSubmit={this.handleSubmit}>
                    <div className="field-row">
                        <label>
                            Name
                        </label>
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>
                            Phone Number
                        </label>
                        <input type="text" name="contact" value={this.state.address} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>
                            Email Address
                        </label>
                        <input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>
                            Website
                        </label>
                        <input type="text" name="website" value={this.state.website} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>
                            Username
                        </label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>
                            Password
                        </label>
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </div>
                    <input className="submit-btn" type="submit" value="Sign up" />
                </form>
            </div>
        );
    }
    
}
export default RestaurantSignup;