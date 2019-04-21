import React from "react";
import "../../styles/restaurant/Restaurant.css";
import "../../styles/auth/Form.css";
import { NotificationManager, NotificationContainer } from "react-notifications";

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : {}
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleChange(event) {
        const self = this;
        const field = event.target.name;
        const value = event.target.value;
        switch(field) {
            case "line1":
            case "line2":
            case "city":
            case "state":
                self.setState((prevState) => {
                    prevState.user.address[field] = value;
                    return prevState;
                });
                break;
            case "zipcode":
                self.setState((prevState) => {
                    prevState.user.address.zipcode = parseInt(value);
                    return prevState;
                });
                break;
            default:
                self.setState((prevState) => {
                    prevState.user[field] = value;
                    return prevState;
                });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const self = this;
        fetch(`/api/users/${this.props.match.params.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.user)
        }).then(function(response) {
            if (!response || response.status !== 200) {
                if (response.status === 400) {
                    response.text().then(function(message){
                        NotificationManager.error(message);
                    });
                }
            } else {
                return response.json();
            }
        }).then(function(updatedUser) {
            if(updatedUser) {
                let successMsg = "Successfully updated!";
                if (self.state.user.is_deleted) {
                    successMsg = "Successfully restored!";
                }
                self.setState({
                    user : updatedUser
                }, ()=> {
                    alert(successMsg);
                });
            }
        });
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            const self = this;
            fetch(`/api/users/${this.props.match.params.id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response) {
                if (!response || response.status !== 200) {
                    if (response.status === 401) {
                        window.location = '/app/';
                    }
                }
                return response.json();
            }).then(function(userDetail) {
                if (userDetail) {
                    self.setState({
                        user : userDetail
                    });
                }
            });
        }
    }

    delete(event) {
        if (this.props.match.params.id) {
            if (window.confirm("Are you sure you want to delete your account?")) {
                fetch(`/api/users/${this.props.match.params.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(function(response) {
                    if (!response || response.status !== 200) {
                        return null;
                    }
                    window.location = "/app/";  
                });
            }
        }
    }
    
    render() {
        let userDetails = "";
        if (this.state.user && Object.keys(this.state.user).length) {
            userDetails = (
                <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="field-row">
                        <label>
                            First Name
                        </label>
                        <input type="text" name="first_name" value={this.state.user.first_name} onChange={this.handleChange} />
                        <label>
                            Middle Name
                        </label>
                        <input type="text" name="middle_name" value={this.state.user.middle_name} onChange={this.handleChange} />
                    </div>  
                    <div className="field-row">
                        <label>
                            Last Name
                        </label>
                        <input type="text" name="last_name" value={this.state.user.last_name} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>
                            Date of Birth
                        </label>
                        <input type="text" name="dob" value={this.state.user.dob} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>
                            Email Address
                        </label>
                        <input type="text" name="email" value={this.state.user.email} onChange={this.handleChange} />
                    </div>
                    <div>
                        <h5>Mailing Address</h5>
                        <div className="field-row">
                            <label>
                                Line 1
                            </label>
                            <input type="text" name="line1" value={this.state.user.address.line1} onChange={this.handleChange} />
                        </div>
                        <div className="field-row">
                            <label>
                                Line 2
                            </label>
                            <input type="text" name="line2" value={this.state.user.address.line2} onChange={this.handleChange} />
                        </div>
                        <div className="field-row">
                            <label>
                                City
                            </label>
                            <input type="text" name="city" value={this.state.user.address.city} onChange={this.handleChange} />
                        </div>
                        <div className="field-row">
                            <label>
                                State
                            </label>
                            <input type="text" name="state" value={this.state.user.address.state} onChange={this.handleChange} />
                        </div>
                        <div className="field-row">
                            <label>
                                Zipcode
                            </label>
                            <input type="text" name="zipcode" value={this.state.user.address.zipcode} onChange={this.handleChange} />
                        </div>
                    </div>
                    <input className="submit-btn" type="submit" value={this.state.user.is_deleted ? "Restore Account" : "Update"} />
                </form>
                {!this.state.user.is_deleted ? <button onClick={this.delete} className="submit-btn trash-btn"><i className="fas fa-trash"></i>&nbsp;Delete Account</button> : ""}
                
                </div>
            );
        }
        const name = (this.state && this.state.user) ? this.state.user.full_name : "";
        return (
            <div className="restaurant-detail-container">
                <h1>{name}{(name && name[name.length-1] === 's') ? "'" : "'s"} Profile</h1>
                <section>{userDetails}</section>
                <NotificationContainer />
            </div>
        );
    }
}

export default User;