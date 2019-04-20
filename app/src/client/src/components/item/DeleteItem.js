import React, {Component} from "react";
import "../../styles/item/DeleteItem.css";
import "../../styles/auth/Form.css";
import { NotificationManager } from "react-notifications";

class DeleteItem extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const self = this;
        if (event.target.name === "submit") {
            fetch(`/api/restaurants/${this.props.match.params.id}/outlets/${this.props.match.params.outlet_id}/items/${this.props.match.params.item_id}`, {
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
                window.location = `/app/admin/${self.props.match.params.id}/outlets/${self.props.match.params.outlet_id}/items`; 
            });
        } else if (event.target.name === "cancel") {
            window.location = `/app/admin/${self.props.match.params.id}/outlets/${self.props.match.params.outlet_id}/items`; 
        }
    }

    render() {
        return (
            <div className="delete-item-container">
                <h3>Delete Confirmation</h3>
                <p>Do you still want to delete item?</p>
                <button name="submit" className="submit-btn" onClick={this.handleSubmit}>Delete</button>
                <button name="cancel" className="submit-btn" onClick={this.handleSubmit}>Cancel</button>
            </div>
        );
    }
}

export default DeleteItem;