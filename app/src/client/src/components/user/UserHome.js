import React from "react";
import AuthenticatedRoutes from "../commons/AuthenticatedRoutes";
import Navbar from "../commons/Navbar";
import {BrowserRouter, Route, Link} from "react-router-dom";
import ItemListing from "../item/listing/ItemListing";
import User from "./User";
import CartHome from "./cart/CartHome";

class UserHome extends AuthenticatedRoutes {
    render() {
        if (this.state.isLoggedIn) {
            return (
                <div>
                    <Navbar shouldShowLogout={this.state.isLoggedIn}></Navbar>
                    <div className="ContentArea-container">
                    <BrowserRouter forceRefresh={true} basename="/app">    
                        <nav className="nav-tray">
                            <ul className="nav-tray-items">
                                <li className="nav-tray-item">
                                    <Link to={`${this.props.match.url}`} >
                                        <i className="fas fa-user-circle nav-tray-item-icon" title="Profile"></i>
                                        <div>Profile</div>
                                    </Link>
                                </li>
                                <li className="nav-tray-item">
                                    <Link to={`${this.props.match.url}/menu`}>
                                    <i className="fas fa-hamburger nav-tray-item-icon"></i>
                                        <div>Menu</div>
                                    </Link>
                                </li>
                                <li className="nav-tray-item">
                                    <Link to={`${this.props.match.url}/cart`}>
                                    <i className="fas fa-shopping-cart nav-tray-item-icon"></i>
                                        <div>Cart</div>
                                    </Link>
                                </li>
                                <li className="nav-tray-item">
                                    <Link to={`${this.props.match.url}/orders`}>
                                    <i className="fas fa-history nav-tray-item-icon"></i>
                                        <div>Orders</div>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div>
                            <Route exact path={`${this.props.match.path}`} component={User} />
                            <Route exact path={`${this.props.match.path}/menu`} component={ItemListing} />
                            {/* {/* <Route path={`${this.props.match.path}/outlets`} component={OutletHome} /> */}
                            <Route path={`${this.props.match.path}/cart`} component={CartHome} /> */}
                        </div>
                    </BrowserRouter>
                    </div>
                </div>
            )
        } else {
            return "";
        }
    }
}

export default UserHome;