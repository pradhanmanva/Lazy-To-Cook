import React , {Component} from 'react';
import "../../styles/auth/Form.css";
import "../../styles/item/Item.css";

class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item : {
                name : "",
                description : "",
                price : "",
                category : {
                    id : ""
                }
            },
            isEditMode : true,
            categories : []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const self = this;
        const restaurantId = this.props.match.params.id;
        const outletId = this.props.match.params.outlet_id;
        const itemId = this.props.match.params.item_id;
        this.setState({
            isEditMode : !!this.props.match.params.item_id
        });
        if (restaurantId && outletId && itemId) {
            fetch(`/api/restaurants/${restaurantId}/outlets/${outletId}/items/${itemId}`, {
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
            }).then(function(item) {
                if (item) {
                    self.setState({
                        item : item
                    });
                    console.log(self.state.item)
                }
            })
        }
        if (restaurantId) {
            fetch(`/api/restaurants/${restaurantId}/categories`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response){
                if (response.status !== 200) {
                    return null;
                }
                return response.json();
            }).then(function(categories) {
                if (categories) {
                    self.setState({
                        categories : categories
                    });
                    if (!self.state.isEditMode) {
                        self.setState({
                            item : {
                                category : categories[0]
                            }
                        })
                    }
                }
            })
        }
    }

    handleChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        if (field === "category") {
            this.setState((prevState) => {
                prevState.item.category = {
                    id : value
                };
                return prevState;
            });
            return;
        }
        this.setState((prevState) => {
            prevState.item[field] = value;
            return prevState;
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const restaurantId = this.props.match.params.id;
        const outletId = this.props.match.params.outlet_id;
        if (event.target.name === "submit") {
            const self = this;
            let url = `/api/restaurants/${restaurantId}/outlets/${outletId}/items`;
            let method = "POST";
            if (this.state.isEditMode) {
                const itemId = this.props.match.params.item_id;
                url += `/${itemId}`;
                method = "PUT";
            }
            fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(self.state.item)
            }).then(function(response) {
                if (response.status !== 200) {
                    return null;
                }
                window.location = `/app/admin/${restaurantId}/outlets/${outletId}/items`;
            });
        } else if (event.target.name === "cancel") {
            window.location = `/app/admin/${restaurantId}/outlets/${outletId}/items`;
        }
    }

    render() {
        let itemDetails = "";
        if (this.state.item && Object.keys(this.state.item).length) {
            itemDetails = (
                <form onSubmit={()=>{return false;}}>
                    <div className="field-row">
                        <label>Name</label>
                        <input type="text" name="name" value={this.state.item.name} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>Description</label>
                        <input type="text" name="description" value={this.state.item.description} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>Price</label>
                        <input type="text" name="price" value={this.state.item.price} onChange={this.handleChange} />
                    </div>
                    <div className="field-row">
                        <label>Category</label>
                        <select name="category" value={this.state.item.category.id} onChange={this.handleChange}>
                            {
                                this.state.categories.map(function(category, index){
                                    return <option key={category.id} value={category.id}>{category.name}</option>;
                                })
                            }
                        </select>
                    </div>
                    <input className="submit-btn" name="submit" type="submit" value={this.state.isEditMode ? "Update" : "Create"} onClick={this.handleSubmit} />
                    <input className="submit-btn" name="cancel" type="submit" value="Cancel" onClick={this.handleSubmit} />
                </form>
            );
        }
        return (
            <div className="item-form-container">
                <h1>{this.state.isEditMode ? "Edit" : "Add"} Item</h1>
                <section>{itemDetails}</section>
            </div>
        );
    }
}

export default Item;