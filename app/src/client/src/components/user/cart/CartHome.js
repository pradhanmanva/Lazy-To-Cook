import React from "react";
import "../../../styles/restaurant/Restaurant.css";
import "../../../styles/auth/Form.css";
import "../../../styles/ContentArea.css";
import ItemListingEntry from "../../item/listing/ItemListingEntry";
import "../../../styles/item/listing/ItemListing.css";
import AuthenticatedRoutes from "../../commons/AuthenticatedRoutes";
import {NotificationContainer, NotificationManager} from "react-notifications";
import QuantityComponent from "../../commons/QuantityComponent";
import "../../../styles/user/cart/CartHome.css";

class CartHome extends AuthenticatedRoutes {
    constructor(props) {
        super(props);
        this.state = {
            cart : {},
            items : [],
            amount : null
        }
        this.fetchItems = this.fetchItems.bind(this);
        this.fetchCartDetails = this.fetchCartDetails.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        const self = this;
        fetch(`/api/users/${this.props.match.params.id}/carts`, {
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
        }).then(function(carts) {
            if (carts && carts.length) {
                const cart = carts[0];
                self.setState({
                    cart : cart
                }, self.fetchCartDetails);
            }
        });
    }

    fetchCartDetails() {
        const self = this;
        fetch(`/api/users/${this.props.match.params.id}/carts/${this.state.cart.id}`, {
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
        }).then(function(cartDetail) {
            if (cartDetail) {
                self.setState({
                    cart : cartDetail.cart,
                    amount : cartDetail.amount
                }, self.fetchItems);
            }
        });
    }

    removeFromCart(itemId) {
        const self = this;
        console.log(itemId);
        if (this.state.cart && this.state.cart.id && itemId) {
            fetch(`/api/users/${this.props.match.params.id}/carts/${this.state.cart.id}/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response) {
                if (response.status !== 200) {
                    return response.text().then(function(error) {
                        NotificationManager.error(error);
                    })
                } else {
                    NotificationManager.success("Item removed from cart.");
                    self.setState(self.fetchCartDetails);
                    return;
                }
            })
        }
    }

    fetchItems() {
        const self = this;
        fetch(`/api/users/${this.props.match.params.id}/carts/${this.state.cart.id}/items`, {
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
        }).then(function(cartFromResponse) {
            if (cartFromResponse) {
                self.setState({
                    items : cartFromResponse
                });
            }
        })
    }

    changeQuantity(itemId, delta) {
        if (itemId) {
            const self = this;
            const currentQuantity = this.state.items.filter(function(item) {
                if (item.item.id == itemId) {
                    return item;
                }
            })[0].quantity;
            if (currentQuantity + delta <= 0) {
                if (window.confirm("Do you wish to remove this item from cart?")) {
                    self.removeFromCart(itemId);
                }
            } else {
                fetch(`/api/users/${this.props.match.params.id}/carts/${this.state.cart.id}/items/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify({quantity:currentQuantity+delta})
                }).then(function(response) {
                    if (response.status !== 200) {
                        NotificationManager.error("Some error occurred");
                        return;
                    } else {
                        self.setState(self.fetchCartDetails);
                    }
                })
            }
        }
    }

    render() {
        const self = this;
        let items = <p style={{"textAlign" : "center"}}>No item in cart. Check out <a href={`/app/user/${this.props.match.params.id}/menu`}>what's cooking</a>.</p>;
        if (this.state.items && this.state.items.length) {
            items = (
                <ul className="menu-list-container">
                    <h3>Items in cart</h3>
                    {
                        this.state.items.map(function(item) {
                            const itemTransformed = {
                                "item" :{
                                    "id" : item.item.id,
                                    "name" : item.item.name,
                                    "description" : item.item.description,
                                    "price": item.item.price,
                                    "category" : item.item.category,
                                    "image" : item.item.image
                                }
                            }

                            return (
                                <li className="item-list-entry-container">
                                    <ItemListingEntry key={itemTransformed.id} data={itemTransformed} />
                                    <div className="item-operation-bar">
                                        <QuantityComponent quantity={item.quantity} onDecrease={()=>{self.changeQuantity(item.item.id, -1)}} onIncrease={()=>{self.changeQuantity(item.item.id, 1)}} />
                                        &nbsp;
                                        <button name="removeFromCart" className="remove-from-cart-btn item-operation-btn danger-btn" onClick={(event)=>{self.removeFromCart(item.item.id);}}>
                                            Remove from Cart
                                        </button>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            )
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
            <div className="restaurant-detail-container">
                <section className="list-container">
                    {this.state.amount ? <button className="submit-btn float-right">Place Order</button> : ""}
                    {amount}
                    <div>
                        {items}
                    </div>
                    {this.state.amount ? <button className="submit-btn">Place Order</button> : ""}
                </section>
                <NotificationContainer />
            </div>
        );
    }
  }

export default CartHome;