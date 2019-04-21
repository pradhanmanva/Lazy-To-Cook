import React from "react";
import AuthenticatedRoutes from "../../commons/AuthenticatedRoutes";
import Category from "./Category";
import DeleteCategory from "./DeleteCategory";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import "../../../styles/restaurant/outlet/OutletHome.css";

class CategoryHome extends AuthenticatedRoutes {
    constructor(props) {
        super(props);
        this.state = {
            categories : []
        }
    }

    componentDidMount() {
        super.componentDidMount();
        const self = this;
        fetch(`/api/restaurants/${this.props.match.params.id}/categories`, {
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
        }).then(function(categories) {
            self.setState({
                categories : categories
            });
        })
    }

    render() {
        const self = this;
        return (
            <div className="outlet-list-tray">   
                <BrowserRouter forceRefresh={true} basename="/app">    
                    <h4 className="outlet-title">
                        <span>Item Categories</span>
                        <NavLink className="float-right" to={`${this.props.match.url}/add`} >
                        <button className="operation-btn" title="Add New Category"><i className="fas fa-plus"></i></button>
                        </NavLink>
                    </h4>
                    <ul className="outlet-list">
                        {!this.state.categories || !this.state.categories.length ? <div style={{textAlign:"center",marginTop:"10px"}}>No category to display.</div> : ""}
                        {this.state.categories.map(function(category, index) {
                            return (
                                <li className="outlet-list-item" key={category.id} >
                                    <NavLink className="outlet-list-item-detail float-left" to={`${self.props.match.url}/${category.id}/edit`}>
                                        <h3>{category.name}</h3>
                                    </NavLink>
                                    <span className="float-right">
                                        <NavLink className="float-right" to={`${self.props.match.url}/${category.id}/delete`} >
                                            <button className="operation-btn" title="Delete"><i className="fas fa-trash"></i></button>
                                        </NavLink>
                                    </span>
                                    <div className="clear-both"></div>
                                </li>
                            ); 
                        })}
                    </ul>
                    <div>
                        {/* <Route path={`${this.props.match.path}/:outlet_id/items`} component={ItemHome} /> */}
                        <Route exact path={`${this.props.match.path}/:category_id/edit`} component={Category} />
                        <Route exact path={`${this.props.match.path}/:category_id/delete`} component={DeleteCategory} />
                        <Route exact path={`${this.props.match.path}/add`} component={Category} />
                    </div>
                </BrowserRouter>    
            </div>
        );
    }
  }

export default CategoryHome;