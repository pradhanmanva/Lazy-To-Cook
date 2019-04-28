import React from "react";
import "../../styles/commons/Price.css";
const ORDER_STATUS = {
    "received" : {
        text : "Order Received",
        color : "#999"
    },
    "accepted" : {
        text : "Order Accepted",
        color : "#ff4b00"
    },
    "ready" : {
        text: "Order Ready",
        color : "#ff9d00"
    },
    "out_for_delivery" : {
        text: "Order Out for Delivery",
        color: "#8dff00"
    },
    "delivered" : {
        text: "Order Delivered",
        color: "#00ff00"
    }
}

const ORDER_STATUS_FLOW = {
   "received" : {
       next: "accepted",
       command : "Accept"
   },
   "accepted" : {
       next : "ready",
       command : "Mark as Ready"
   },
   "ready" : {
       next : "out_for_delivery",
       command : "Send for delivery"
   },
   "out_for_delivery" : {
       next : "delivered",
       command : "Mark as Delivered"
   }
}

export default (props) => {
    const statusText = ORDER_STATUS[props.current] ? ORDER_STATUS[props.current].text : "";
    const statusColor = ORDER_STATUS[props.current] ? ORDER_STATUS[props.current].color : "grey";
    return (
        <div>
            <span>Current Status: <b style={{color: statusColor}}>{statusText}</b></span>&nbsp;
            {props.isProgressable ? (ORDER_STATUS_FLOW[props.current] ? <button className="submit-btn" onClick={()=>{props.makeProgress(ORDER_STATUS_FLOW[props.current].next);}}>{ORDER_STATUS_FLOW[props.current].command}</button> : "") : ""}
        </div>
    )
}