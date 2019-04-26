import React from "react";
import AuthenticatedRoutes from "../commons/AuthenticatedRoutes";
import Order from "./Order"
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import "../../styles/restaurant/outlet/OutletHome.css";
import OrderStatus from "./OrderStatus";

class OrderHome extends AuthenticatedRoutes {
    constructor(props) {
        super(props);
        this.state = {
            orders : []
        }
    }

    componentDidMount() {
        super.componentDidMount();
        const self = this;
        fetch(`/api/restaurants/${this.props.match.params.id}/orders`, {
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
        }).then(function(orders) {
            if (orders) {
                self.setState({
                    orders : orders
                });
            }
        })
    }

    render() {
        const self = this;
        return (
            <div className="outlet-list-tray">   
                <BrowserRouter forceRefresh={true} basename="/app">    
                    <h4 className="outlet-title">
                        <span>All Orders</span>
                    </h4>
                    <ul className="outlet-list">
                        {!this.state.orders || !this.state.orders.length ? <div style={{textAlign:"center",marginTop:"10px"}}>No orders available.</div> : ""}
                        {this.state.orders.map(function(order, index) {
                            return (
                                <li className="outlet-list-item" key={order.id} >
                                    <NavLink className="outlet-list-item-detail float-left" to={`${self.props.match.url}/${order.id}/edit`}>
                                        <h3>Order Number: {order.id}</h3>
                                        <p>{order.date}</p>
                                        <OrderStatus current={order.status} />
                                    </NavLink>
                                    <div className="clear-both"></div>
                                </li>
                            ); 
                        })}
                    </ul>
                    <div>
                        {/* <Route path={`${this.props.match.path}/:outlet_id/items`} component={ItemHome} /> */}
                        <Route exact path={`${this.props.match.path}/:order_id/edit`} component={Order} />
                        {/* <Route exact path={`${this.props.match.path}/:category_id/delete`} component={DeleteCategory} /> */}
                        {/* <Route exact path={`${this.props.match.path}/add`} component={Category} /> */}
                    </div>
                </BrowserRouter>    
            </div>
        );
    }
  }

export default OrderHome;