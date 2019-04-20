import React from "react";
import AuthenticatedRoutes from "../commons/AuthenticatedRoutes";
import Navbar from "../commons/Navbar";

class UserHome extends AuthenticatedRoutes {
    render() {
        if (this.state.isLoggedIn) {
            const content = <div>You're on user page of user id: {this.props.match.params.id}.</div>;
            return (
                <div>
                    <Navbar shouldShowLogout={this.state.isLoggedIn}></Navbar>
                    {content}
                </div>
            )
        } else {
            return "";
        }
    }
}

export default UserHome;