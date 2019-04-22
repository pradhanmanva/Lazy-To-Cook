import React from "react";
import "../../styles/commons/QuantityComponent.css";

class QuantityComponent extends React.Component {

    render() {
        return (
            <span>
                <button className="quantity-btn" onClick={this.props.onDecrease}><i className="fas fa-minus"></i></button>
                <span>{this.props.quantity}</span>
                <button className="quantity-btn" onClick={this.props.onIncrease}><i className="fas fa-plus"></i></button>
            </span>
        )
    }
}

export default QuantityComponent;