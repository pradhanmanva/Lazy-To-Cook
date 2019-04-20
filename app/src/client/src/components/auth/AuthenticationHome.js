import React, { Component } from 'react';
import RestaurantSignup from "./RestaurantSignup";
import Signin from "./Signin";
import UserSignup from './UserSignup';
import "../../styles/auth/AuthenticationHome.css";

class AuthenticationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_type: props.type,
            isSignup : (props.method === "signin")
        };
        this.handleChange = this.handleChange.bind(this);
      }

      componentDidMount() {
        fetch("/auth/login", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function (result) {
            return result.json();
        }).then(function(result) {
            if (result.redirectTo) {
                window.location = result.redirectTo;
            }
        });
      }

      handleChange(event) {
        const field = event.target;
        const fieldChanged = field.attributes.name.value;
        if (fieldChanged === "isSignup") {
            this.setState((prevState)=>({
                isSignup : !prevState.isSignup
            }))
            return;
        }
        const changedValue = field.getElementsByTagName("input")[0].value;
        this.setState({
            [fieldChanged]: changedValue
        });
      }
    
      render() {
        let form = "";
        const SignUpType = (this.state.user_type === "admin") ? RestaurantSignup : UserSignup;
        if (this.state.isSignup) {
            form = <SignUpType />
        } else {
            form = <Signin user_type={this.state.user_type} />
        }
        return (
            <div className="authentication-form">
                <div className="radio-selection usertype-selection">
                    <span name="user_type" className={`${(this.state.user_type === "admin" ? "selected" : "")} selection left-border-curved`} onClick={this.handleChange}>
                        <input type="hidden" name="user_type" value="admin" checked={this.state.user_type === "admin"} /> Restaurant
                    </span>
                    <span name="user_type" className={`${(this.state.user_type === "user" ? "selected" : "")} selection right-border-curved`} onClick={this.handleChange}>
                        <input type="hidden" name="user_type" value="user" checked={this.state.user_type === "user"} /> User
                    </span>
                </div>
                <div className="radio-selection auth-type-selection">
                    <span name="isSignup"  className={`${(this.state.isSignup ? "selected" : "")} selection left-border-curved`} onClick={this.handleChange}>
                        <input type="hidden" name="isSignup" value="true" checked={this.state.isSignup} /> Sign Up
                    </span>
                    <span name="isSignup" className={`${(!this.state.isSignup ? "selected" : "")} selection right-border-curved`} onClick={this.handleChange}>
                        <input type="hidden" name="isSignup" value="false" checked={!this.state.isSignup} /> Sign In
                    </span>
                </div>
                <div className="auth-form">
                {form}
                </div>
            </div>
        );
      }
}

export default AuthenticationForm;