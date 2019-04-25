import React from "react";
import "../../../styles/restaurant/Restaurant.css";
import "../../../styles/auth/Form.css";
import "../../../styles/ContentArea.css";
import { NotificationManager, NotificationContainer } from "react-notifications";
import ItemListingEntry from "./ItemListingEntry";
import "../../../styles/item/listing/ItemListing.css";
import ItemCategoryTab from "./ItemCategoryTab";

class ItemListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items : [],
            filter : {
                item : "",
                category : ""
            },
            categories : [],
            currentFilter : {
                item : "",
                category : ""
            },
            paging : {
                current : 1,
                hasPrevious : false,
                hasNext : false,
                next : null,
                previous : null
            },
            cart : {}
        }

        this.defaultCategory = {
            id : "",
            name : "All Categories"
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.queryItems = this.queryItems.bind(this);
        this.queryCategories = this.queryCategories.bind(this);
        this.goToPreviousPage = this.goToPreviousPage.bind(this);
        this.goToNextPage = this.goToNextPage.bind(this);
        this.getCart = this.getCart.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
    }

    handleChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        if (field.startsWith("filter_")) {
            this.setState((prevState) => {
                prevState.filter[field.split("_")[1]] = value;
                return prevState;
            });
        } 
    }

    getCart() {
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
            if (carts && carts.length === 1) {
                const cart = carts[0];
                self.setState((prevState) => {
                    prevState.cart = cart;
                    return prevState;  
                });
            }
        });
    }

    queryItems() {
        let query = "";
        if (this.state.filter.item && this.state.filter.item.length) {
            query += `&item=${this.state.filter.item}`;
        }
        if (this.state.filter.category && this.state.filter.category.length) {
            query += `&category=${this.state.filter.category}`;
        }
        if (this.state.paging.current) {
            query += `&page=${this.state.paging.current}`;
        }
        query += "&count=5";
        query = '?' + query.substr(1);
        this.setState((prevState) => {
            let newState = {
                ...prevState,
                currentFilter : {
                    ...prevState.filter
                }
            }
            if (prevState.filter.category && prevState.filter.category.length) {
                let selectedCategory = prevState.categories.filter(function(category) {
                    return (category.id.toString() === prevState.filter.category.toString())
                });
                if (selectedCategory && selectedCategory.length) {
                    selectedCategory = selectedCategory[0];
                    newState.currentFilter.category = `${selectedCategory.name}${selectedCategory.restaurant ? `, ${selectedCategory.restaurant.name}` : ""}`;
                }
            }
            return newState;
        });
        const self = this;
        fetch(`/api/items${query}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            if (!response || response.status !== 200) {
                if (response.status === 400) {
                    response.text().then(function(message){
                        NotificationManager.error(message);
                    });
                }
            } else {
                return response.json();
            }
        }).then(function(responseJSON) {
            if(responseJSON) {
                self.setState((prev) => {
                    prev.items = responseJSON.items;
                    prev.paging =  {
                        ...prev.paging,
                        next : responseJSON.paging.next,
                        previous : responseJSON.paging.previous,
                        hasNext : responseJSON.paging.hasNext,
                        hasPrevious : responseJSON.paging.hasPrevious
                    }
                    return prev;
                });
            }
        });
    }

    queryCategories() {
        const self = this;
        fetch(`/api/categories`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
            if (!response || response.status !== 200) {
                if (response.status === 400) {
                    response.text().then(function(message){
                        NotificationManager.error(message);
                    });
                }
            } else {
                return response.json();
            }
        }).then(function(categories) {
            if(categories) {
                categories.unshift(self.defaultCategory);
                self.setState({
                    categories : categories
                });
                self.setState({
                    filter : {
                        category : self.defaultCategory.id
                    }
                })
            }
        });
    }

    goToPreviousPage(event) {
        event.preventDefault();
        if (this.state.paging.hasPrevious) {
            this.setState((prevState) => {
                prevState.paging.current = prevState.paging.previous;
                return prevState;
            },this.queryItems);
        }
    }

    goToNextPage(event) {
        event.preventDefault();
        if (this.state.paging.hasNext) {
            this.setState((prevState) => {
                prevState.paging.current = prevState.paging.next;
                return prevState;
            },this.queryItems);
        }
    }

    handleSearch(event) {
        event.preventDefault();
        this.queryItems();
    }

    componentDidMount() {
        this.getCart();
        this.queryItems();
        this.queryCategories();
    }

    addToCart(itemId) {
        const self = this;
        if (this.state.cart && this.state.cart.id) {
            fetch(`/api/users/${this.props.match.params.id}/carts/${this.state.cart.id}/items`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    item_id : itemId,
                    quantity : 1
                })
            }).then(function(response) {
                if (response.status !== 200) {
                    return response.text().then(function(error) {
                        NotificationManager.error(error);
                    })
                } else {
                    NotificationManager.success("Successfully added item to cart.");
                    self.setState((prevState)=> {
                        prevState.items = prevState.items.map(function(item) {
                            if (item.item.id == itemId) {
                                item.is_in_cart = !item.is_in_cart;
                            }
                            return item;
                        })
                        return prevState;
                    });
                    return;
                }
            })
        }
    }

    removeFromCart(itemId) {
        const self = this;
        if (this.state.cart && this.state.cart.id) {
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
                    self.setState((prevState)=> {
                        prevState.items = prevState.items.map(function(item) {
                            if (item.item.id == itemId) {
                                item.is_in_cart = !item.is_in_cart;
                            }
                            return item;
                        })
                        return prevState;
                    });
                    return;
                }
            })
        }
    }

    render() {
        const self = this;
        let items = <p style={{"textAlign" : "center"}}><i className="fas fa-search fa-xs"></i> No item available to display.</p>;
        if (this.state.items && this.state.items.length) {
            items = (
                <ul className="menu-list-container">
                    {
                        this.state.items.map(function(item) {
                            return (
                                <li key={item.item.id} className="item-list-entry-container">
                                    <ItemListingEntry data={item} />
                                    <div className="item-operation-bar">
                                    {
                                        self.state.cart && self.state.cart.id ?
                                        (
                                        item.is_in_cart ? 
                                            (
                                                <button name="removeFromCart" className="item-operation-btn danger-btn" onClick={(event)=>{self.removeFromCart(item.item.id);}}>
                                                    Remove from Cart
                                                </button>
                                            ) : 
                                            (
                                                <button name="addToCart" className="item-operation-btn" onClick={()=>{self.addToCart(item.item.id)}}>
                                                    Add to Cart
                                                </button>
                                            )
                                        ) : ""
                                    }
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }

        let itemFilter = null;
        let categoryFilter = null;
        if (this.state.currentFilter.item && this.state.currentFilter.item.length) {
            itemFilter = <ItemCategoryTab name={`name: ${this.state.currentFilter.item}`} />
        }
        if (this.state.currentFilter.category && this.state.currentFilter.category.length) {
            categoryFilter = <ItemCategoryTab name={`category: ${this.state.currentFilter.category}`} />
        }
        let currentFilterContainer = null;
        if (itemFilter || categoryFilter) {
            currentFilterContainer = (<span><b>Showing results for </b> {itemFilter} {categoryFilter}</span>)
        }
        
        return (
            <div className="restaurant-detail-container">
                <section className="list-container">
                    <form onSubmit={()=>{return false;}}>
                        <table width="100%">
                            <tbody>
                                <tr>
                                    <td className="filter-container filter-item-container"><input id="filter_item" className="filter-item filter-field" type="text" name="filter_item" placeholder="Search Items" onChange={this.handleChange} /></td>
                                    <td className="filter-container filter-category-container">
                                        <select id="filter-container filter_category" className="filter-category filter-field" name="filter_category" onChange={this.handleChange} >
                                            {
                                                this.state.categories.map(function(category) {
                                                    return <option key={category.id} value={category.id}>{category.name}{category.restaurant ? `, ${category.restaurant.name}` : ""}</option>
                                                })
                                            }
                                        </select>
                                    </td>
                                    <td className="filter-container filter-search-container"><button type="submit" name="search" onClick={this.handleSearch} title="Search items" className="filter-search-btn"><i className="fas fa-search"></i></button></td>
                                    <td className="filter-container filter-page-container">
                                        {this.state.paging.hasPrevious ? <button className="paging-btn" onClick={this.goToPreviousPage}><i className="fas fa-caret-left"></i></button> : ""}&nbsp;
                                        Page {this.state.paging.current}&nbsp;
                                        {this.state.paging.hasNext ? <button className="paging-btn" onClick={this.goToNextPage}><i className="fas fa-caret-right"></i></button> : ""}
                                    </td>
                                </tr>
                                <tr><td>{currentFilterContainer ? currentFilterContainer : ""}</td></tr>
                            </tbody>
                        </table>
                    </form>
                    <div>
                        {items}
                    </div>
                </section>
                <NotificationContainer />
            </div>
        );
    }
}

export default ItemListing;