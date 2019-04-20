import React from 'react';
import "../../styles/auth/Form.css";
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.url = "/auth/login";
        this.state = {
            username : "",
            password : ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.collectData = this.collectData.bind(this);
    }

    collectData() {
        const user_type = this.props.user_type;
        return {
            ...this.state,
            user_type : user_type
        };
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = this.collectData();
        if (data) {
            fetch(this.url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (response.status !== 200) {
                    if (response.status === 400) {
                        response.text().then(function(message){
                            NotificationManager.error(message);
                        })
                    }
                } else {
                    return response.json();
                }
            }).then(function(response) {
                if (response.redirectTo) {
                    window.location = response.redirectTo;
                } else if (response.message) {
                    alert(response.message);
                }
            });
        }
    }

    handleChange(event) {
        const fieldChanged = event.target.name;
        if (fieldChanged === "isSignup") {
            this.setState((prevState)=>({
                isSignup : !prevState.isSignup
            }))
            return;
        }
        const changedValue = event.target.value;
        this.setState((prevState) => ({
            [fieldChanged]: changedValue
        }));
      }

      render() {
        return (
            <div>
                <h2>{(this.props.user_type === "user") ? "User" : "Restaurant"} Sign in </h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="field-row">
                        <label>
                            {this.props.user_type === "admin" ? "Username" : "Email Address"}
                        </label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
                    </div>  
                    <div className="field-row">
                        <label>
                            Password
                        </label>
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </div> 
                    <input className="submit-btn" type="submit" value="Sign in" /> 
                </form>
                <NotificationContainer />
            </div>
        );
      }
}

export default Signin;