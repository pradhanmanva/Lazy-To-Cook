import React from "react";
import "../../../styles/restaurant/Restaurant.css";
import "../../../styles/auth/Form.css";
import "../../../styles/ContentArea.css";
import ItemListingEntry from "../../item/listing/ItemListingEntry";
import "../../../styles/item/listing/ItemListing.css";
import AuthenticatedRoutes from "../../commons/AuthenticatedRoutes";

class CartHome extends AuthenticatedRoutes {
    constructor(props) {
        super(props);
        this.state = {
            cart : {},
            items : []
        }
        this.fetchItems = this.fetchItems.bind(this);
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

    render() {
        let items = <p style={{"textAlign" : "center"}}><i className="fas fa-search fa-xs"></i> No item available to display.</p>;
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

                            return <ItemListingEntry key={itemTransformed.id} data={itemTransformed} />
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
            </div>
        );
    }
  }

export default CartHome;