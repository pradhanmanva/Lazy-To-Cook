import React , {Component} from 'react';

class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item : {}
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const self = this;
        const restaurantId = this.props.match.params.id;
        const outletId = this.props.match.params.outlet_id;
        const itemId = this.props.match.params.item_id;
        if (restaurantId && outletId) {
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
                }
            })
        }
    }

    handleChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        this.setState((prevState) => {
            prevState.outlet[field] = value;
            return prevState;
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.outlet);
    }

    render() {
        let itemDetails = "";
        if (this.state.item && Object.keys(this.state.item).length) {
            itemDetails = (
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>
                            Name:
                            <input type="text" name="name" value={this.state.item.name} onChange={this.handleChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Description:
                            <input type="text" name="description" value={this.state.item.description} onChange={this.handleChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Price:
                            <input type="text" name="price" value={this.state.item.price} onChange={this.handleChange} />
                        </label>
                    </div>
                    <input type="submit" value="Update" />
                </form>
            );
        }
        return (
            <div>
                <h1>Edit {this.state.item.name}</h1>
                <section>{itemDetails}</section>
            </div>
        );
    }
}

export default Item;