import React from "react";
import "../../styles/restaurant/Restaurant.css";
import "../../styles/auth/Form.css";
import {NotificationContainer, NotificationManager} from "react-notifications";

class Restaurant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: {},
            outlets: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        this.setState((prevState) => {
            prevState.restaurant[field] = value;
            return prevState;
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const self = this;
        fetch(`/api/restaurants/${this.props.match.params.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.restaurant)
        }).then(function (response) {
            if (!response || response.status !== 200) {
                if (response.status === 400) {
                    response.text().then(function (message) {
                        NotificationManager.error(message);
                    });
                }
            } else {
                return response.json();
            }
        }).then(function (updatedRestaurant) {
            if (updatedRestaurant) {
                let successMsg = "Successfully updated!";
                if (self.state.restaurant.is_deleted) {
                    successMsg = "Successfully restored!";
                }
                self.setState({
                    restaurant: updatedRestaurant
                }, () => {
                    alert(successMsg);
                });
            }
        });
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            const self = this;
            fetch(`/api/restaurants/${this.props.match.params.id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function (response) {
                if (!response || response.status !== 200) {
                    if (response.status === 401) {
                        window.location = '/app/';
                    }
                }
                return response.json();
            }).then(function (restaurantDetail) {
                if (restaurantDetail) {
                    self.setState({
                        restaurant: restaurantDetail
                    });
                }
            });
        }
    }

    delete(event) {
        if (this.props.match.params.id) {
            if (window.confirm("Are you sure you want to delete your restaurant?")) {
                fetch(`/api/restaurants/${this.props.match.params.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(function (response) {
                    if (!response || response.status !== 200) {
                        return null;
                    }
                    window.location = "/app/";
                });
            }
        }
    }

    render() {
        let restaurantDetails = "";
        if (this.state.restaurant && Object.keys(this.state.restaurant).length) {
            restaurantDetails = (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="field-row">
                            <label>
                                Name
                            </label>
                            <input type="text" name="name" value={this.state.restaurant.name}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="field-row">
                            <label>
                                Phone Number
                            </label>
                            <input type="text" name="contact" value={this.state.restaurant.contact}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="field-row">
                            <label>
                                Email Address
                            </label>
                            <input type="email" name="email" value={this.state.restaurant.email}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="field-row">
                            <label>
                                Website
                            </label>
                            <input type="text" name="website" value={this.state.restaurant.website}
                                   onChange={this.handleChange}/>
                        </div>
                        <input className="submit-btn" type="submit"
                               value={this.state.restaurant.is_deleted ? "Restore Account" : "Update"}/>
                    </form>
                    {!this.state.restaurant.is_deleted ?
                        <button onClick={this.delete} className="submit-btn trash-btn"><i
                            className="fas fa-trash"></i>&nbsp;Delete Restaurant</button> : ""}
                </div>
            );
        }
        const name = (this.state && this.state.restaurant) ? this.state.restaurant.name : "";
        return (
            <div className="restaurant-detail-container">
                <h1>{name}{(name && name[name.length - 1] === 's') ? "'" : "'s"} Profile</h1>
                <section>{restaurantDetails}</section>
                <NotificationContainer/>
            </div>
        );
    }
}

export default Restaurant;