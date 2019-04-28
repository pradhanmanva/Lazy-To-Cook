import React from "react";
import AuthenticatedRoutes from "../../commons/AuthenticatedRoutes";
import Outlet from "./Outlet";
import DeleteOutlet from "./DeleteOutlet";
import ItemHome from "../../item/ItemHome";
import {BrowserRouter, Link, Route} from "react-router-dom";
import "../../../styles/restaurant/outlet/OutletHome.css";

class OutletHome extends AuthenticatedRoutes {
    constructor(props) {
        super(props);
        this.state = {
            outlets: []
        }
    }

    componentDidMount() {
        super.componentDidMount();
        const self = this;
        fetch(`/api/restaurants/${this.props.match.params.id}/outlets`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            if (response.status !== 200) {
                return null;
            }
            return response.json();
        }).then(function (outlets) {
            self.setState({
                outlets: outlets
            });
        })
    }

    render() {
        const self = this;
        return (
            <div className="outlet-list-tray">
                <BrowserRouter forceRefresh={true} basename="/app">
                    <h4 className="outlet-title">
                        <span>Outlets</span>
                        <Link className="float-right" to={`${this.props.match.url}/add`}>
                            <button className="operation-btn" title="Add New Outlet"><i className="fas fa-plus"/>
                            </button>
                        </Link>
                    </h4>
                    <ul className="outlet-list">
                        {!this.state.outlets || !this.state.outlets.length ?
                            <div style={{textAlign: "center", marginTop: "10px"}}>No outlet to display.</div> : ""}
                        {this.state.outlets.map(function (outlet, index) {
                            return (
                                <li className="outlet-list-item" key={outlet.id}>
                                    <Link className="outlet-list-item-detail float-left"
                                          to={`${self.props.match.url}/${outlet.id}/items`}>
                                        <h3>{outlet.name}</h3>
                                        <span>{`${outlet.address.line1} ${outlet.address.line2 ? outlet.address.line2 : ""}, ${outlet.address.city}`}</span>
                                    </Link>
                                    <span className="float-right">
                                        <Link className="float-right" to={`${self.props.match.url}/${outlet.id}/edit`}>
                                            <button className="operation-btn" title="Edit"><i
                                                className="fas fa-pen"/></button>
                                        </Link>
                                        <Link className="float-right"
                                              to={`${self.props.match.url}/${outlet.id}/delete`}>
                                            <button className="operation-btn" title="Delete"><i
                                                className="fas fa-trash"/></button>
                                        </Link>
                                    </span>
                                    <div className="clear-both"/>
                                </li>
                            );
                        })}
                    </ul>
                    <div>
                        <Route path={`${this.props.match.path}/:outlet_id/items`} component={ItemHome}/>
                        <Route exact path={`${this.props.match.path}/:outlet_id/edit`} component={Outlet}/>
                        <Route exact path={`${this.props.match.path}/:outlet_id/delete`} component={DeleteOutlet}/>
                        <Route exact path={`${this.props.match.path}/add`} component={Outlet}/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default OutletHome;