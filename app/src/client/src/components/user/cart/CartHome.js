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
            items : []
        }
        this.fetchItems = this.fetchItems.bind(this);
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
                    self.setState(self.fetchItems);
                    return;
                }
            })
        }
    }

    fetchItems() {
        const self = this;
        console.log(this.props.match.params.id);
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
            this.setState((prevState)=>{
                prevState.items.map(function(item) {
                    if (item.item.id == itemId) {
                        if (item.quantity + delta <= 0) {
                            if (window.confirm("Do you wish to remove this item from cart?")) {
                                self.removeFromCart(itemId);
                            }
                        } else {
                            item.quantity += delta;
                        }
                    }
                });    
                return prevState;
            });
        }
    }

    render() {
        const self = this;
        let items = <p style={{"textAlign" : "center"}}>No item in cart. Check out <a href={`/app/user/${this.props.match.params.id}/menu`}>what's cooking</a>.</p>;
        if (this.state.items && this.state.items.length) {
            items = (
                <ul className="menu-list-container">
                    {
                        this.state.items.map(function(item) {
                            const itemTransformed = {
                                "item" :{
                                    "id" : item.item.id,
                                    "name" : item.item.name,
                                    "description" : item.item.description,
                                    "price": item.item.price,
                                    "category" : item.item.category
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
        return (
            <div className="restaurant-detail-container">
                <section className="list-container">
                    <div>
                        {items}
                    </div>
                </section>
                <NotificationContainer />
            </div>
        );
    }
  }

export default CartHome;