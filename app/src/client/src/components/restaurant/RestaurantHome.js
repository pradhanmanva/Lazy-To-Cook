import React from "react";
import AuthenticatedRoutes from "../commons/AuthenticatedRoutes";
import Restaurant from "./Restaurant";
import OutletHome from "./outlet/OutletHome";
import CategoryHome from "./category/CategoryHome";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Navbar from "../commons/Navbar";
import "../../styles/restaurant/RestaurantHome.css";
import OrderHome from "../orders/OrderHome";

class RestaurantHome extends AuthenticatedRoutes {
    constructor(props) {
        super(props);
        this.restaurantId = this.props.match.params.id;
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <div>
                    <Navbar shouldShowLogout={this.state.isLoggedIn} />
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
                                    <Link to={`${this.props.match.url}/outlets`}>
                                    <i className="fas fa-utensils nav-tray-item-icon"></i>
                                        <div>Outlets</div>
                                    </Link>
                                </li>
                                <li className="nav-tray-item">
                                    <Link to={`${this.props.match.url}/categories`}>
                                    <i className="fas fa-columns nav-tray-item-icon"></i>
                                        <div>Categories</div>
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
                            <Route exact path={`${this.props.match.path}`} component={Restaurant} />
                            <Route path={`${this.props.match.path}/outlets`} component={OutletHome} />
                            <Route path={`${this.props.match.path}/categories`} component={CategoryHome} />
                            <Route path={`${this.props.match.path}/orders`} component={OrderHome} />
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

export default RestaurantHome;