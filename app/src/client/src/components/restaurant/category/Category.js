import React , {Component} from 'react';
import "../../../styles/restaurant/outlet/Outlet.css";
import "../../../styles/auth/Form.css";

class Category extends Component {

    constructor(props) {
        super(props);
        this.state = {
            category : {
                name : ""
            },
            isEditMode : true
        }        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const self = this;
        const restaurantId = this.props.match.params.id;
        const categoryId = this.props.match.params.category_id;
        this.setState({
            isEditMode : !!this.props.match.params.category_id
        });
        if (restaurantId && categoryId) {
            fetch(`/api/restaurants/${restaurantId}/categories/${categoryId}`, {
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
            }).then(function(category) {
                if (category) {
                    self.setState({
                        category : category
                    });
                }
            });
        }
    }

    handleChange(event) {
        const self = this;
        const field = event.target.name;
        const value = event.target.value;
        self.setState((prevState) => {
            prevState.category[field] = value;
            return prevState;
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const restaurantId = this.props.match.params.id;
        if (event.target.name === "submit") {
            const self = this;
            let url = `/api/restaurants/${restaurantId}/categories`;
            let method = "POST";
            if (this.state.isEditMode) {
                const categoryId = this.props.match.params.category_id;
                url += `/${categoryId}`;
                method = "PUT";
            }
            fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(self.state.category)
            }).then(function(response) {
                if (response.status !== 200) {
                    return null;
                }
                window.location = `/app/admin/${restaurantId}/categories`;
            });
        } else if (event.target.name === "cancel") {
            window.location = `/app/admin/${restaurantId}/categories`;
        }
    }

    render() {
        let outletDetails = "";
        let category = this.state.category;
        
        if (category && Object.keys(category).length) {
            outletDetails = (
                <form onSubmit={()=>{return false;}}>
                    <div className="field-row">
                        <label>Name</label>
                        <input type="text" name="name" value={category.name} onChange={this.handleChange} />
                    </div>
                    <input name="submit" className="submit-btn" type="submit" value={this.state.isEditMode ? "Update" : "Create"} onClick={this.handleSubmit} />
                    <input name="cancel" className="submit-btn" type="submit" value="Cancel" onClick={this.handleSubmit} />
                </form>
            );
        }
        return (
            <div className="outlet-form-container">
                <h1>{this.state.isEditMode ? "Edit" : "Add"} Category</h1>
                <section>{outletDetails}</section>
            </div>
        );
    }
}

export default Category;