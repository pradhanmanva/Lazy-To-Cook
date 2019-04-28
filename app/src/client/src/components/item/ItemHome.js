import React from "react";
import AuthenticatedRoutes from "../commons/AuthenticatedRoutes";
import {BrowserRouter, Link, Route} from "react-router-dom";
import Item from "./Item";
import DeleteItem from "./DeleteItem";
import "../../styles/item/ItemHome.css";

class ItemHome extends AuthenticatedRoutes {
    constructor(props) {
        super(props);
        this.state = {
            items: []
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
        }).then(function (response) {
            if (response.status !== 200) {
                return null;
            }
            return response.json();
        }).then(function (items) {
            self.setState({
                items: items
            });
        })
    }

    render() {
        const self = this;
        return (
            <div className="item-list-tray">
                <h4 className="item-title">
                    <span>Items</span>
                    <Link className="float-right" to={`${this.props.match.url}/add`}>
                        <button className="operation-btn" title="Add New Item"><i className="fas fa-plus"/></button>
                    </Link>
                </h4>
                <BrowserRouter forceRefresh={true} basename="/app">
                    <ul className="item-list">
                        {!this.state.items || !this.state.items.length ?
                            <div style={{textAlign: "center", marginTop: "10px"}}>No item to display.</div> : ""}
                        {this.state.items.map(function (item, index) {
                            return (
                                <li className="item-list-item" key={item.id}>
                                    <Link className="item-list-item-detail float-left"
                                          to={`${self.props.match.url}/${item.id}/edit`}>
                                        <h3>{item.name}</h3>
                                        <p className="item-list-item-description">{item.description}</p>
                                    </Link>
                                    <span className="float-right">
                                        <Link className="float-right" to={`${self.props.match.url}/${item.id}/delete`}>
                                            <button className="operation-btn" title="Delete"><i
                                                className="fas fa-trash"/></button>
                                        </Link>
                                    </span>
                                    <div className="clear-both"/>
                                </li>
                            );
                        })}
                    </ul>
                    <div>
                        <Route exact path={`${this.props.match.path}/add`} component={Item}/>
                        <Route path={`${this.props.match.path}/:item_id/delete`} component={DeleteItem}/>
                        <Route path={`${this.props.match.path}/:item_id/edit`} component={Item}/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default ItemHome;