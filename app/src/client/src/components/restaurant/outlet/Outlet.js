import React , {Component} from 'react';

class Outlet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            outlet : {}
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const self = this;
        const restaurantId = this.props.match.params.id;
        const outletId = this.props.match.params.outlet_id;
        if (restaurantId && outletId) {
            fetch(`/api/restaurants/${restaurantId}/outlets/${outletId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response) {
                if (response.status !== 200) {
                    return null;
                }
                return response.json();
            }).then(function(outlet) {
                if (outlet) {
                    self.setState((prevState) => {
                        let newState = {
                            outlet: {
                                ...outlet,
                                address : {
                                    ...outlet.address,
                                    line1 : outlet.address.lineOne,
                                    line2 : outlet.address.lineTwo
                                }
                            }
                        }
                        delete newState.outlet.address.lineOne;
                        return newState
                    });
                }
            })
        }
    }

    handleChange(event) {
        const self = this;
        console.log()
        const field = event.target.name;
        const value = event.target.value;
        switch(field) {
            case "line1":
            case "line2":
            case "city":
            case "state":
            case "zipcode":
                self.setState((prevState) => {
                    prevState.outlet.address[field] = value;
                    return prevState;
                });
                break;
            default:
                self.setState((prevState) => {
                    prevState.outlet[field] = value;
                    return prevState;
                });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.outlet);
    }

    render() {
        let outletDetails = "";
        if (this.state.outlet && Object.keys(this.state.outlet).length) {
            outletDetails = (
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>
                            Name:
                            <input type="text" name="name" value={this.state.outlet.name} onChange={this.handleChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Phone Number:
                            <input type="text" name="contact" value={this.state.outlet.contact} onChange={this.handleChange} />
                        </label>
                    </div>
                    <div>
                        <h5>Mailing Address</h5>
                        <div>
                            <label>
                                Line 1
                                <input type="text" name="line1" value={this.state.outlet.address.line1} onChange={this.handleChange} />
                            </label>
                            <label>
                                Line 2
                                <input type="text" name="line2" value={this.state.outlet.address.line2} onChange={this.handleChange} />
                            </label>
                        </div>
                        <div>
                        <label>
                                City
                                <input type="text" name="city" value={this.state.outlet.address.city} onChange={this.handleChange} />
                            </label>
                        </div>
                        <div>
                            <label>
                                State
                                <input type="text" name="state" value={this.state.outlet.address.state} onChange={this.handleChange} />
                            </label>
                        </div>
                        <div>
                            <label>
                                Zipcode
                                <input type="text" name="zipcode" value={this.state.outlet.address.zipcode} onChange={this.handleChange} />
                            </label>
                        </div>
                    </div>
                    <input type="submit" value="Update" />
                </form>
            );
        }
        return (
            <div>
                <h1>Edit {this.state.outlet.name}</h1>
                <section>{outletDetails}</section>
            </div>
        );
    }
}

export default Outlet;