import {Component} from 'react';
import 'react-notifications/lib/notifications.css';
import {NotificationManager} from 'react-notifications';
import Validators from '../../utils/FieldValidators';

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
            user_type: this.user_type
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
                if (result.status !== 200) {
                    return result.text().then(function (message) {
                        NotificationManager.error(message);
                    })
                } else {
                    NotificationManager.success("Created Successfully! Please login now.");
                    window.location = `/app/?type=${self.user_type}&mode=signin`;
                }
            });
        }
    }

    handleChange(event) {
        const fieldChanged = event.target.name;
        const changedValue = event.target.value;

        if (fieldChanged === "isSignup") {
            this.setState((prevState) => ({
                isSignup: !prevState.isSignup
            }));
            return;
        }

        this.setState((prevState) => ({
            [fieldChanged]: changedValue
        }));

        if (changedValue === "") {
            this.setState((prevState) => ({
                validationStatus: {
                    ...prevState.validationStatus,
                    [fieldChanged]: "Cannot be empty"
                }
            }));
        } else {
            let error = false;
            if (fieldChanged === "contact" && !Validators.isPhone(changedValue)) {
                this.setState((prevState) => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [fieldChanged]: "Enter only 10 Digits."
                    }
                }));
                error = true;
            }
            if (fieldChanged === "email" && !Validators.isEmail(changedValue)) {
                this.setState((prevState) => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [fieldChanged]: "Enter Format: [A-Za-z0-9]@[A-Za-z0-9].[A-Za-z0-9]"
                    }
                }));
                error = true;
            }
            if (fieldChanged === "username" && !Validators.isUsername(changedValue)) {
                this.setState((prevState) => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [fieldChanged]: "Need 4-10 characters with a digit and period in middle; no period in the end. Eg. 'test.1', 'test1.test', 'te1st.1'"
                    }
                }));
                error = true;
            }
            if (fieldChanged === "password" && !Validators.isStrongPassword(changedValue)) {
                this.setState((prevState) => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [fieldChanged]: "Length:8, At least One UpperCase, One LowerCase, One Digit and One Special Character."
                    }
                }));
                error = true;
            }
            if (fieldChanged === "website" && !Validators.isWebAddress(changedValue)) {
                this.setState((prevState) => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [fieldChanged]: "Enter Format: [www]?.[A-Za-z0-9].[A-Za-z0-9]"
                    }
                }));
                error = true;
            }
            if (fieldChanged === "dob" && !Validators.isDate(changedValue)) {
                this.setState((prevState) => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [fieldChanged]: "Format: mm-dd-yyyy, mm/dd/yyyy, mm.dd.yyyy, mm dd yyyy"
                    }
                }));
                error = true;
            }
            if (fieldChanged === "state" && !Validators.isUSState(changedValue)) {
                this.setState((prevState) => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [fieldChanged]: "Enter full state name."
                    }
                }));
                error = true;
            }
            if (fieldChanged === "zipcode" && !Validators.isZipcode(changedValue)) {
                this.setState((prevState) => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [fieldChanged]: "Enter 5 digit US Zipcode."
                    }
                }));
                error = true;
            }
            if (!error) {
                this.setState((prevState) => ({
                    validationStatus: {
                        ...prevState.validationStatus,
                        [fieldChanged]: ""
                    }
                }));
            }
        }
    }
}

export default Signup;