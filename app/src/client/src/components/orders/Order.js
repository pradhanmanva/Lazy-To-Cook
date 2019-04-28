import React , {Component} from 'react';
import "../../styles/restaurant/outlet/Outlet.css";
import "../../styles/auth/Form.css";
import "../../styles/order/Order.css";
import OrderStatus from "./OrderStatus";
import Price from "../commons/Price";
import { NotificationManager, NotificationContainer } from 'react-notifications';

class Order extends Component {

    constructor(props) {
        super(props);
        this.state = {
            order : {}
        }        
        this.makeProgress = this.makeProgress.bind(this);
        this.fetchOrder = this.fetchOrder.bind(this);
        this.isEditable = this.props.match.url.includes("edit")
    }

    fetchOrder() {
        const self = this;
        const entityId = this.props.match.params.id;
        const orderId = this.props.match.params.order_id;
        const sourceEntity = this.props.match.url.includes("user") ? "users" : "restaurants";
        if (entityId && orderId) {
            fetch(`/api/${sourceEntity}/${entityId}/orders/${orderId}`, {
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
            }).then(function(order) {
                if (order) {
                    self.setState({
                        order : order.order,
                        amount : order.amount
                    });
                }
            });
        }
    }

    componentDidMount() {
        this.fetchOrder();
    }

    makeProgress(nextState) {
        if (nextState) {
            const self = this;
            const entityId = this.props.match.params.id;
            const orderId = this.props.match.params.order_id;
            const sourceEntity = this.props.match.url.includes("user") ? "users" : "restaurants";
            fetch(`/api/${sourceEntity}/${entityId}/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({status : nextState})
            }).then(function(response) {
                if (response.status !== 200) {
                    return response.text().then(function(error) {
                        return NotificationManager.error(error);
                    });
                } else {
                    self.fetchOrder();
                }
            })
        }
    }

    render() {
        let orderStatus = ""
        if (this.isEditable) {
            orderStatus = <OrderStatus current={this.state.order.status} makeProgress={this.makeProgress} isProgressable={true} />
        }
        let amount = "";
        if (this.state.amount) {
            amount = (
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <p><b>Order Subtotal</b></p>
                        </td>
                        <td>:</td>
                        <td>
                            ${this.state.amount.sub_total}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p><b>Tax</b></p>
                        </td>
                        <td>:</td>
                        <td>
                            ${this.state.amount.sales_tax}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3><b>Order Total</b></h3>
                        </td>
                        <td>:</td>
                        <td>
                            <h3>${this.state.amount.total}</h3>
                        </td>
                    </tr>
                    </tbody>
                </table>
            )
        }
        return (
            <div className="outlet-form-container">
                <section>
                    <h2>Order Number: {this.state.order.id}</h2>
                    <p>Placed on {this.state.order.date} by <b>{this.state.order.user && this.state.order.user.full_name}</b> at the <b>{this.state.order.outlet && this.state.order.outlet.name}</b> outlet</p>
                    {orderStatus}
                    {amount}
                    <ul className="order-item-list">
                        <h4>Items on order</h4>
                        {this.state.order.items && this.state.order.items.map(function(item) {
                            return (
                                <li className="order-item-container">
                                    <p className="order-item-details">
                                        <h4 className="order-item-name">{item.item.name}</h4>
                                        <p className="order-item-description">{item.item.description}</p>
                                    </p>
                                    <Price amount={item.item.price} type="USD" />
                                    <p className="float-right order-item-quantity">Qty: {item.quantity}</p>
                                    <div class="clear-both"></div>
                                </li>
                            )
                        })}
                    </ul>
                </section>
                <NotificationContainer />
            </div>
        );
    }
}

export default Order;