import React, { Component } from 'react';
import "../styles/ContentArea.css";
import { BrowserRouter, Route, Link } from "react-router-dom";

class ContentArea extends Component {
    render() {
        console.log(this.props);
        return (
            <div className="ContentArea-container">
                <ul className="ContentArea-icon-tray">
                <BrowserRouter basename="/app">
                    <li><Link to="">Info</Link></li>
                    <li><Link to={`${this.props.match.url}/outlets`}>Outlets</Link></li>
                    <div>
                        <Route path="/outlets" component={()=>{return "outlet";}} />
                    </div>
                </BrowserRouter>
                    
                </ul>
                <div className="ContentArea-left-pane"></div>
                <div className="ContentArea-content-pane">
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default ContentArea;