import React from 'react';
import "../../styles/auth/Form.css";

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
                return response.json();
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
                    <input className="submit-btn" type="submit" value="Sign in" /> 
                </form>
            </div>
        );
      }
}

export default Signin;