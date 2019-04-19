import React from "react";
import AuthenticatedRoutes from "../commons/AuthenticatedRoutes";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Item from "./Item";
import "../../styles/item/ItemHome.css";

class ItemHome extends AuthenticatedRoutes {
    constructor(props) {
        super(props);
        this.state = {
            items : []
        }
    }

    componentDidMount() {
        const self = this;
        fetch(`/api/restaurants/${this.props.match.params.id}/outlets/${this.props.match.params.outlet_id}/items`, {
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
        }).then(function(items) {
            self.setState({
                items : items
            });
        })
    }

    render() {
        const self = this;
        return (
            <div className="item-list-tray">   
                <h4 className="item-title">Items</h4>
                <BrowserRouter basename="/app">    
                    <ul className="item-list">
                        {this.state.items.map(function(item, index) {
                            return (
                                <li className="item-list-item" key={item.id} >
                                    <Link to={`${self.props.match.url}/${item.id}`}>
                                        <div>
                                            <h3>{item.name}</h3>
                                            <p className="item-list-item-description">{item.description}</p>
                                        </div>
                                    </Link>
                                </li>
                            ); 
                        })}
                    </ul>
                    <Route exact path={`${this.props.match.path}/:item_id`} component={Item} />
                </BrowserRouter>    
            </div>
        );
    }
  }

export default ItemHome;