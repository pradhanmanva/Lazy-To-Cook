import React from "react";
import "../../styles/restaurant/Restaurant.css";
import "../../styles/auth/Form.css";

class Restaurant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant : {},
            outlets : []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        }).then(function(response) {
            if (!response || response.status !== 200) {
                return null;
            }
            return response.json();
        }).then(function(updatedRestaurant) {
            self.setState({
                restaurant : updatedRestaurant
            });
            alert("Successfully updated!");
        });
    }

    componentDidMount() {
        const self = this;
        fetch(`/api/restaurants/${this.props.match.params.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            if (!response || response.status !== 200) {
                return null;
            }
            return response.json();
        }).then(function(restaurantDetail) {
            if (restaurantDetail) {
                self.setState({
                    restaurant : restaurantDetail
                });
            }
        });
    }
    
    render() {
        let restaurantDetails = "";
        if (this.state.restaurant && Object.keys(this.state.restaurant).length) {
            restaurantDetails = (
                <form onSubmit={this.handleSubmit}>
                    <div className="field-row">
                        <label>
                            Name
                        </label>
                        <input type="text" name="name" value={this.state.restaurant.name} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>
                            Phone Number
                        </label>
                        <input type="text" name="contact" value={this.state.restaurant.contact} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>
                            Email Address
                        </label>
                        <input type="text" name="email" value={this.state.restaurant.email} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>
                            Website
                        </label>
                        <input type="text" name="email" value={this.state.restaurant.website} onChange={this.handleChange} />
                    </div>
                    <input className="submit-btn" type="submit" value="Update" />
                </form>
            );
        }
        return (
            <div className="restaurant-detail-container">
                <h1>{this.state.restaurant.name}'s Profile</h1>
                <section>{restaurantDetails}</section>
            </div>
        );
    }
}

export default Restaurant;