import React, {Component} from "react";
import "../../../styles/restaurant/outlet/DeleteOutlet.css";
import "../../../styles/auth/Form.css";
import { NotificationManager } from "react-notifications";

class DeleteCategory extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const self = this;
        if (event.target.name === "submit") {
            fetch(`/api/restaurants/${this.props.match.params.id}/categories/${this.props.match.params.category_id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function(response) {
                if (response.status !== 200) {
                    NotificationManager.error("Error occurred while deleting category.");
                    return null;   
                }
                window.location = `/app/admin/${self.props.match.params.id}/categories`; 
            });
        } else if (event.target.name === "cancel") {
            window.location = `/app/admin/${self.props.match.params.id}/categories`; 
        }
    }

    render() {
        return (
            <div className="delete-outlet-container">
                <h3>Delete Confirmation</h3>
                <p>Do you still want to delete category?</p>
                <button name="submit" className="submit-btn" onClick={this.handleSubmit}>Delete</button>
                <button name="cancel" className="submit-btn" onClick={this.handleSubmit}>Cancel</button>
            </div>
        );
    }
}

export default DeleteCategory;