import {Component} from "react";

class AuthenticatedRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn : false
        };
    }

    componentDidMount() {
        const self = this;
        fetch("/auth/login", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function (result) {
            return result.json();
        }).then(function(result) {
            self.setState({
                isLoggedIn : result.status
            })
            if (!result.status) {
                window.location = "/app";
            }
        });
    }
}

export default AuthenticatedRoutes;