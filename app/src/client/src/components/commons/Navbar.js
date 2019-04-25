import React, {Component} from 'react';
import Logo from "./Logo";
import "../../styles/Navbar.css";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout(event) {
        if (event.target.name === "logout") {
            fetch("/auth/logout", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function (result) {
                if (result.status === 200) {
                    window.location = "/app/";
                } else {
                    alert("Error logging out.");
                }
            })
        }
    }

    render() {
        const logoutButton = this.props.shouldShowLogout ? <button className="logout-btn" name="logout" onClick={this.logout}>Logout</button> : "";
        const entryButtons = this.props.shouldShowLogout ? "" : (<p className="logout-btn"><a href="/app/?method=signin" className="logout-btn">Sign In</a><a href="/app/?method=register" className="logout-btn">Register</a></p>);
        return (
            <div>
                <nav className="Navbar-container">
                    <Logo />
                    {logoutButton}
                    {entryButtons}
                </nav>
                {this.props.children}
            </div>
        );
        
    }
}
export default Navbar;
  