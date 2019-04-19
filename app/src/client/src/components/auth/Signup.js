import {Component} from 'react';
import 'react-notifications/lib/notifications.css';
import {NotificationManager} from 'react-notifications';

class Signup extends Component { 
    constructor(props) {
        super(props);
        this.url = "/auth/register";
        this.user_type = "";
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.collectData = this.collectData.bind(this);
    }

    collectData() {
        return {
            ...this.state,
            user_type : this.user_type
        };
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = this.collectData();
        const self = this;
        if (data) {
            fetch(this.url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(function (result) {
                console.log(result.status);
                if (result.status !== 200) {
                    NotificationManager.error("Some error occurred.");
                } else {
                    NotificationManager.success("Created Successfully! Please login now.");
                    window.location = `/app/?type=${self.user_type}&mode=signin`;
                }
            });
        }
    }
    
    handleChange(event) {
        const fieldChanged = event.target.name;
        if (fieldChanged === "isSignup") {
            this.setState((prevState)=>({
                isSignup : !prevState.isSignup
            }))
            return;
        }
        const changedValue = event.target.value;
        this.setState((prevState) => ({
            [fieldChanged]: changedValue
        }));
      }
}
export default Signup;