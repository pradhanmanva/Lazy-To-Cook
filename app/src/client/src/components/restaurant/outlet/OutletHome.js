import React from "react";
import AuthenticatedRoutes from "../../commons/AuthenticatedRoutes";
import Outlet from "./Outlet";
import ItemHome from "../../item/ItemHome";
import { BrowserRouter, Route, Link } from "react-router-dom";
import "../../../styles/restaurant/outlet/OutletHome.css";

class OutletHome extends AuthenticatedRoutes {
    constructor(props) {
        super(props);
        this.state = {
            outlets : []
        }
    }

    componentDidMount() {
        const self = this;
        fetch(`/api/restaurants/${this.props.match.params.id}/outlets`, {
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
        }).then(function(outlets) {
            self.setState({
                outlets : outlets
            });
        })
    }

    render() {
        const self = this;
        return (
            <div className="outlet-list-tray">   
                <BrowserRouter basename="/app">    
                    <h4 className="outlet-title">Outlets</h4>
                    <ul className="outlet-list">
                        {this.state.outlets.map(function(outlet, index) {
                            return (
                                <li className="outlet-list-item" key={outlet.id} >
                                    <Link to={`${self.props.match.url}/${outlet.id}/items`}>
                                        <h3>{outlet.name}</h3>
                                        <span>{`${outlet.address.lineOne} ${outlet.address.lineTwo ? outlet.address.lineTwo : ""}, ${outlet.address.city}`}</span>
                                    </Link>
                                </li>
                            ); 
                        })}
                    </ul>
                    <div>
                        <Route path={`${this.props.match.path}/:outlet_id/items`} component={ItemHome} />
                        {/* <Route exact path={`${this.props.match.path}/:outlet_id/edit`} component={Outlet} /> */}
                        {/* <Route exact path={`${this.props.match.path}/:outlet_id/add`} component={Outlet} /> */}
                    </div>
                </BrowserRouter>    
            </div>
        );
    }
  }

export default OutletHome;