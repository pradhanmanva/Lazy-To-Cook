import React , {Component} from 'react';
import "../../../styles/restaurant/outlet/Outlet.css";
import "../../../styles/auth/Form.css";

class Outlet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            outlet : {
                name : "",
                contact : "",
                address : {
                    line1 : "",
                    line2 : "",
                    city : "",
                    state : "",
                    zipcode : ""
                }
            },
            isEditMode : true
        }        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log("in");
        const self = this;
        const restaurantId = this.props.match.params.id;
        const outletId = this.props.match.params.outlet_id;
        this.setState({
            isEditMode : !!this.props.match.params.outlet_id
        });
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
        const field = event.target.name;
        const value = event.target.value;
        switch(field) {
            case "line1":
            case "line2":
            case "city":
            case "state":
                self.setState((prevState) => {
                    prevState.outlet.address[field] = value;
                    return prevState;
                });
                break;
            case "zipcode":
                self.setState((prevState) => {
                    prevState.outlet.address.zipcode = parseInt(value);
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
        if (event.target.name === "submit") {
            const self = this;
            const restaurantId = this.props.match.params.id;
            let url = `/api/restaurants/${restaurantId}/outlets`;
            let method = "POST";
            if (this.state.isEditMode) {
                const outletId = this.props.match.params.outlet_id;
                url = `/api/restaurants/${restaurantId}/outlets/${outletId}`;
                method = "PUT";
            }
            fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(self.state.outlet)
            }).then(function(response) {
                if (response.status !== 200) {
                    return null;
                }
                window.location = `/app/admin/${self.props.match.params.id}/outlets`;
            });
        } else if (event.target.name === "cancel") {
            window.location = `/app/admin/${this.props.match.params.id}/outlets`;
        }
    }

    render() {
        let outletDetails = "";
        let outlet = this.state.outlet;
        
        if (outlet && Object.keys(outlet).length) {
            outletDetails = (
                <form onSubmit={()=>{return false;}}>
                    <div className="field-row">
                        <label>Name</label>
                        <input type="text" name="name" value={outlet.name} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>Phone Number</label>
                        <input type="text" name="contact" value={outlet.contact} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <h4>Mailing Address</h4>
                        <div className="field-row">
                            <label>Line 1</label>
                            <input type="text" name="line1" value={outlet.address.line1} onChange={this.handleChange} />
                        </div>
                        <div className="field-row">
                            <label>Line 2</label>
                            <input type="text" name="line2" value={outlet.address.line2} onChange={this.handleChange} />
                        </div>
                        <div className="field-row">
                            <label>City</label>
                            <input type="text" name="city" value={outlet.address.city} onChange={this.handleChange} />
                        </div>
                        <div className="field-row">
                            <label>State</label>
                            <input type="text" name="state" value={outlet.address.state} onChange={this.handleChange} />
                        </div>
                        <div className="field-row">
                            <label>Zipcode</label>
                            <input type="text" name="zipcode" value={outlet.address.zipcode} onChange={this.handleChange} />
                        </div>
                    </div>
                    <input name="submit" className="submit-btn" type="submit" value={this.state.isEditMode ? "Update" : "Create"} onClick={this.handleSubmit} />
                    <input name="cancel" className="submit-btn" type="submit" value="Cancel" onClick={this.handleSubmit} />
                </form>
            );
        }
        return (
            <div className="outlet-form-container">
                <h1>{this.state.isEditMode ? "Edit" : "Add"} Outlet</h1>
                <section>{outletDetails}</section>
            </div>
        );
    }
}

export default Outlet;