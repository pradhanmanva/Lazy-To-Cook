import React from "react";
import "../../styles/commons/Price.css";

export default (props) => {
    const notation = props.type === "USD" ? "$" : props.type;
    const denominations = props.amount.toString().split(".");
    const whole = denominations[0];
    let part = "";
    if (denominations.length === 2) {
        part = denominations[1];
    }
    return (
        <span className="price">
            <span className="price-whole">{notation} {whole}</span>
            <sup className="price-part">{part}</sup>
        </span>
    )
}